const { Call, Contact, User } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

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
      if (end_date) where.start_time[Op.lte] = new Date(end_date);
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

    const conversionRate = totalCalls > 0 ? (convertedCalls / answeredCalls) * 100 : 0;

    res.json({
      success: true,
      data: {
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
      if (end_date) where.start_time[Op.lte] = new Date(end_date);
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
      if (end_date) where.start_time[Op.lte] = new Date(end_date);
    }

    const teamPerformance = await Call.findAll({
      where,
      attributes: [
        'user_id',
        [fn('COUNT', col('Call.id')), 'total_calls'],
        [fn('COUNT', fn('CASE', literal("WHEN outcome = 'answered' THEN 1 END"))), 'answered_calls'],
        [fn('AVG', col('duration')), 'avg_duration'],
        [fn('COUNT', fn('CASE', literal("WHEN call_status = 'converted' THEN 1 END"))), 'converted_calls']
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
