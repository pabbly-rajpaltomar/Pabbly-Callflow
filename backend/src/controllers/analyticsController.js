const { Call, Contact, User, Lead } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const { Parser } = require('json2csv');

exports.getDashboardStats = async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;

    const where = {};

    if (req.user.role === 'sales_rep') {
      where.user_id = req.user.id;
    } else if (user_id) {
      where.user_id = user_id;
    }

    if (start_date || end_date) {
      where.start_time = {};
      if (start_date) where.start_time[Op.gte] = new Date(start_date);
      if (end_date) {
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        where.start_time[Op.lte] = endDateTime;
      }
    }

    const totalCalls = await Call.count({ where });

    const answeredCalls = await Call.count({
      where: { ...where, outcome: 'answered' }
    });

    const avgDuration = await Call.findOne({
      where: { ...where, duration: { [Op.not]: null } },
      attributes: [[fn('AVG', col('duration')), 'avg_duration']]
    });

    const totalDuration = await Call.findOne({
      where: { ...where, duration: { [Op.not]: null } },
      attributes: [[fn('SUM', col('duration')), 'total_duration']]
    });

    const convertedCalls = await Call.count({
      where: { ...where, call_status: 'converted' }
    });

    const callsByType = await Call.findAll({
      where,
      attributes: [
        'call_type',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['call_type']
    });

    const callsByStatus = await Call.findAll({
      where,
      attributes: [
        'call_status',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['call_status']
    });

    const conversionRate = answeredCalls > 0 ? (convertedCalls / answeredCalls) * 100 : 0;

    // Get leads counts (with optional date filter on created_at)
    const leadWhere = {};
    if (req.user.role === 'sales_rep') {
      leadWhere.assigned_to = req.user.id;
    }

    // Apply date filter for leads using created_at (not start_time)
    if (start_date || end_date) {
      leadWhere.created_at = {};
      if (start_date) leadWhere.created_at[Op.gte] = new Date(start_date);
      if (end_date) {
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        leadWhere.created_at[Op.lte] = endDateTime;
      }
    }

    const newLeads = await Lead.count({
      where: { ...leadWhere, lead_status: 'new' }
    });

    // Get total leads count (within date range)
    const totalLeads = await Lead.count({ where: leadWhere });

    res.json({
      success: true,
      data: {
        newLeads,
        totalLeads,
        totalCalls,
        answeredCalls,
        avgDuration: Math.round(avgDuration?.dataValues?.avg_duration || 0),
        totalDuration: totalDuration?.dataValues?.total_duration || 0,
        convertedCalls,
        conversionRate: conversionRate.toFixed(2),
        callsByType: callsByType.map(item => ({
          type: item.call_type,
          count: parseInt(item.dataValues.count)
        })),
        callsByStatus: callsByStatus.map(item => ({
          status: item.call_status,
          count: parseInt(item.dataValues.count)
        }))
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats.',
      error: error.message
    });
  }
};

exports.getCallsOverTime = async (req, res) => {
  try {
    const { start_date, end_date, user_id, interval = 'day' } = req.query;

    const where = {};

    if (req.user.role === 'sales_rep') {
      where.user_id = req.user.id;
    } else if (user_id) {
      where.user_id = user_id;
    }

    if (start_date || end_date) {
      where.start_time = {};
      if (start_date) where.start_time[Op.gte] = new Date(start_date);
      if (end_date) {
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        where.start_time[Op.lte] = endDateTime;
      }
    }

    let dateFormat;
    switch (interval) {
      case 'hour':
        dateFormat = 'YYYY-MM-DD HH24:00:00';
        break;
      case 'week':
        dateFormat = 'IYYY-IW';
        break;
      case 'month':
        dateFormat = 'YYYY-MM';
        break;
      default:
        dateFormat = 'YYYY-MM-DD';
    }

    const callsOverTime = await Call.findAll({
      where,
      attributes: [
        [fn('TO_CHAR', col('start_time'), dateFormat), 'period'],
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['period'],
      order: [[literal('period'), 'ASC']]
    });

    res.json({
      success: true,
      data: {
        callsOverTime: callsOverTime.map(item => ({
          period: item.dataValues.period,
          count: parseInt(item.dataValues.count)
        }))
      }
    });
  } catch (error) {
    console.error('Get calls over time error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching calls over time.',
      error: error.message
    });
  }
};

exports.getTeamPerformance = async (req, res) => {
  try {
    if (req.user.role === 'sales_rep') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only managers and admins can view team performance.'
      });
    }

    const { start_date, end_date } = req.query;

    const where = {};

    if (start_date || end_date) {
      where.start_time = {};
      if (start_date) where.start_time[Op.gte] = new Date(start_date);
      if (end_date) {
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        where.start_time[Op.lte] = endDateTime;
      }
    }

    const teamPerformance = await Call.findAll({
      where,
      attributes: [
        'user_id',
        [fn('COUNT', col('Call.id')), 'total_calls'],
        [literal("COUNT(CASE WHEN outcome = 'answered' THEN 1 END)"), 'answered_calls'],
        [fn('AVG', col('duration')), 'avg_duration'],
        [literal("COUNT(CASE WHEN call_status = 'converted' THEN 1 END)"), 'converted_calls']
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'role']
        }
      ],
      group: ['user_id', 'user.id'],
      order: [[literal('total_calls'), 'DESC']]
    });

    res.json({
      success: true,
      data: {
        teamPerformance: teamPerformance.map(item => ({
          user: item.user,
          totalCalls: parseInt(item.dataValues.total_calls),
          answeredCalls: parseInt(item.dataValues.answered_calls),
          avgDuration: Math.round(item.dataValues.avg_duration || 0),
          convertedCalls: parseInt(item.dataValues.converted_calls),
          conversionRate: item.dataValues.answered_calls > 0
            ? ((item.dataValues.converted_calls / item.dataValues.answered_calls) * 100).toFixed(2)
            : 0
        }))
      }
    });
  } catch (error) {
    console.error('Get team performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team performance.',
      error: error.message
    });
  }
};

// Conversion Funnel Analytics
exports.getConversionFunnel = async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;

    const where = {};

    if (req.user.role === 'sales_rep') {
      where.assigned_to = req.user.id;
    } else if (user_id) {
      where.assigned_to = user_id;
    }

    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) where.created_at[Op.gte] = new Date(start_date);
      if (end_date) {
        // Include the entire end date by setting time to end of day
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        where.created_at[Op.lte] = endDateTime;
      }
    }

    // Get counts for each stage - ALL from Lead model (Kanban pipeline)
    const stages = [
      { name: 'New Leads', status: 'new' },
      { name: 'Contacted', status: 'contacted' },
      { name: 'Qualified', status: 'qualified' },
      { name: 'Converted', status: 'converted' },
      { name: 'Lost', status: 'lost' }
    ];

    const funnelData = [];
    let totalLeads = 0;

    // First get total leads count for percentage calculation
    totalLeads = await Lead.count({ where });

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];

      // Count leads in this stage
      const count = await Lead.count({
        where: { ...where, lead_status: stage.status }
      });

      // Calculate percentage of total
      const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(2) : 0;

      // Calculate average days in stage
      const avgDaysQuery = await Lead.findAll({
        where: { ...where, lead_status: stage.status },
        attributes: [
          [fn('AVG', literal("EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400")), 'avg_days']
        ]
      });

      const avgDays = Math.round(avgDaysQuery[0]?.dataValues?.avg_days || 0);

      funnelData.push({
        name: stage.name,
        status: stage.status,
        count,
        percentage: parseFloat(percentage),
        avgDays
      });
    }

    res.json({
      success: true,
      data: {
        funnel: funnelData,
        totalLeads
      }
    });
  } catch (error) {
    console.error('Get conversion funnel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching conversion funnel.',
      error: error.message
    });
  }
};

// Performance Rankings
exports.getPerformanceRankings = async (req, res) => {
  try {
    if (req.user.role === 'sales_rep') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only managers and admins can view rankings.'
      });
    }

    const { start_date, end_date, metric = 'totalCalls' } = req.query;

    const where = {};

    if (start_date || end_date) {
      where.start_time = {};
      if (start_date) where.start_time[Op.gte] = new Date(start_date);
      if (end_date) where.start_time[Op.lte] = new Date(end_date);
    }

    const performance = await Call.findAll({
      where,
      attributes: [
        'user_id',
        [fn('COUNT', col('Call.id')), 'total_calls'],
        [literal("COUNT(CASE WHEN outcome = 'answered' THEN 1 END)"), 'answered_calls'],
        [literal("COUNT(CASE WHEN outcome = 'no_answer' THEN 1 END)"), 'missed_calls'],
        [fn('AVG', col('duration')), 'avg_duration'],
        [literal("COUNT(CASE WHEN call_status = 'converted' THEN 1 END)"), 'converted_calls']
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'role']
        }
      ],
      group: ['user_id', 'user.id']
    });

    // Calculate additional metrics
    const rankings = performance.map(item => {
      const totalCalls = parseInt(item.dataValues.total_calls);
      const answeredCalls = parseInt(item.dataValues.answered_calls);
      const convertedCalls = parseInt(item.dataValues.converted_calls);
      const avgDuration = Math.round(item.dataValues.avg_duration || 0);

      return {
        user: item.user,
        totalCalls,
        answeredCalls,
        missedCalls: parseInt(item.dataValues.missed_calls),
        avgDuration,
        convertedCalls,
        answeredRate: totalCalls > 0 ? ((answeredCalls / totalCalls) * 100).toFixed(2) : 0,
        conversionRate: answeredCalls > 0 ? ((convertedCalls / answeredCalls) * 100).toFixed(2) : 0,
        callsPerConversion: convertedCalls > 0 ? (totalCalls / convertedCalls).toFixed(2) : 0
      };
    });

    // Sort by selected metric
    const sortKey = {
      'totalCalls': 'totalCalls',
      'conversionRate': 'conversionRate',
      'answeredRate': 'answeredRate',
      'avgDuration': 'avgDuration'
    }[metric] || 'totalCalls';

    rankings.sort((a, b) => parseFloat(b[sortKey]) - parseFloat(a[sortKey]));

    // Add rank
    rankings.forEach((item, index) => {
      item.rank = index + 1;
    });

    res.json({
      success: true,
      data: { rankings }
    });
  } catch (error) {
    console.error('Get performance rankings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching rankings.',
      error: error.message
    });
  }
};

// Call Quality Analytics
exports.getCallQuality = async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;

    const where = {};

    if (req.user.role === 'sales_rep') {
      where.user_id = req.user.id;
    } else if (user_id) {
      where.user_id = user_id;
    }

    if (start_date || end_date) {
      where.start_time = {};
      if (start_date) where.start_time[Op.gte] = new Date(start_date);
      if (end_date) where.start_time[Op.lte] = new Date(end_date);
    }

    // Duration distribution
    const durationDistribution = await Call.findAll({
      where: { ...where, duration: { [Op.not]: null } },
      attributes: [
        [literal(`
          CASE
            WHEN duration < 30 THEN '<30s'
            WHEN duration < 60 THEN '30-60s'
            WHEN duration < 120 THEN '1-2min'
            WHEN duration < 300 THEN '2-5min'
            ELSE '>5min'
          END
        `), 'duration_bucket'],
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['duration_bucket'],
      raw: true
    });

    // Outcome distribution
    const outcomeDistribution = await Call.findAll({
      where,
      attributes: [
        'outcome',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['outcome'],
      raw: true
    });

    const totalCalls = await Call.count({ where });

    // Success rate (answered calls)
    const answeredCalls = await Call.count({
      where: { ...where, outcome: 'answered' }
    });
    const successRate = totalCalls > 0 ? ((answeredCalls / totalCalls) * 100).toFixed(2) : 0;

    // Callback rate
    const callbackCalls = await Call.count({
      where: { ...where, call_status: 'callback' }
    });
    const callbackRate = totalCalls > 0 ? ((callbackCalls / totalCalls) * 100).toFixed(2) : 0;

    // Best time slots (by hour)
    const timeSlots = await Call.findAll({
      where: { ...where, outcome: 'answered' },
      attributes: [
        [fn('EXTRACT', literal("HOUR FROM start_time")), 'hour'],
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['hour'],
      order: [[literal('count'), 'DESC']],
      limit: 5,
      raw: true
    });

    res.json({
      success: true,
      data: {
        durationDistribution: durationDistribution.map(item => ({
          bucket: item.duration_bucket,
          count: parseInt(item.count)
        })),
        outcomeDistribution: outcomeDistribution.map(item => ({
          outcome: item.outcome,
          count: parseInt(item.count),
          percentage: totalCalls > 0 ? ((parseInt(item.count) / totalCalls) * 100).toFixed(2) : 0
        })),
        successRate,
        callbackRate,
        bestTimeSlots: timeSlots.map(item => ({
          hour: parseInt(item.hour),
          count: parseInt(item.count)
        }))
      }
    });
  } catch (error) {
    console.error('Get call quality error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching call quality.',
      error: error.message
    });
  }
};

// Export Analytics Data
exports.exportAnalytics = async (req, res) => {
  try {
    const { type = 'calls', start_date, end_date, user_id } = req.query;

    const where = {};

    if (req.user.role === 'sales_rep') {
      where.user_id = req.user.id;
    } else if (user_id) {
      where.user_id = user_id;
    }

    if (start_date || end_date) {
      where.start_time = {};
      if (start_date) where.start_time[Op.gte] = new Date(start_date);
      if (end_date) where.start_time[Op.lte] = new Date(end_date);
    }

    let data = [];
    let fields = [];
    let filename = '';

    if (type === 'calls') {
      const calls = await Call.findAll({
        where,
        include: [
          { model: User, as: 'user', attributes: ['full_name', 'email'] },
          { model: Contact, as: 'contact', attributes: ['name', 'phone'] }
        ],
        order: [['start_time', 'DESC']]
      });

      data = calls.map(call => ({
        'Call ID': call.id,
        'User': call.user?.full_name,
        'Contact': call.contact?.name,
        'Phone': call.phone_number,
        'Type': call.call_type,
        'Outcome': call.outcome,
        'Status': call.call_status,
        'Duration (s)': call.duration || 0,
        'Start Time': call.start_time,
        'Notes': call.notes || ''
      }));

      fields = ['Call ID', 'User', 'Contact', 'Phone', 'Type', 'Outcome', 'Status', 'Duration (s)', 'Start Time', 'Notes'];
      filename = `calls_export_${new Date().toISOString().split('T')[0]}.csv`;

    } else if (type === 'leads') {
      const leads = await Lead.findAll({
        where: user_id ? { assigned_to: user_id } : {},
        include: [
          { model: User, as: 'assignedUser', attributes: ['full_name', 'email'] }
        ],
        order: [['created_at', 'DESC']]
      });

      data = leads.map(lead => ({
        'Lead ID': lead.id,
        'Name': lead.name,
        'Phone': lead.phone,
        'Email': lead.email || '',
        'Company': lead.company || '',
        'Source': lead.source,
        'Status': lead.lead_status,
        'Assigned To': lead.assignedUser?.full_name || '',
        'Created At': lead.created_at,
        'Notes': lead.notes || ''
      }));

      fields = ['Lead ID', 'Name', 'Phone', 'Email', 'Company', 'Source', 'Status', 'Assigned To', 'Created At', 'Notes'];
      filename = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;

    } else if (type === 'contacts') {
      const contacts = await Contact.findAll({
        where: user_id ? { assigned_to: user_id } : {},
        include: [
          { model: User, as: 'assignedUser', attributes: ['full_name', 'email'] }
        ],
        order: [['created_at', 'DESC']]
      });

      data = contacts.map(contact => ({
        'Contact ID': contact.id,
        'Name': contact.name,
        'Phone': contact.phone,
        'Email': contact.email || '',
        'Company': contact.company || '',
        'Status': contact.lead_status,
        'Assigned To': contact.assignedUser?.full_name || '',
        'Created At': contact.created_at,
        'Notes': contact.notes || ''
      }));

      fields = ['Contact ID', 'Name', 'Phone', 'Email', 'Company', 'Status', 'Assigned To', 'Created At', 'Notes'];
      filename = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
    }

    // Generate CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);

  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting data.',
      error: error.message
    });
  }
};
