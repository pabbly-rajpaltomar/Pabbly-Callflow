const { User, Call, CallRecording, Contact, Lead, EmailLog, LeadActivity, UserActivity, WhatsAppLog, MeetingLog } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// Get team member's complete activity (calls, emails, leads)
exports.getMemberActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, type, startDate, endDate } = req.query;

    // Authorization check - only admin/manager can view other users
    if (req.user.role === 'sales_rep' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Verify user exists
    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const activities = [];
    const dateFilter = {};

    if (startDate) dateFilter[Op.gte] = new Date(startDate);
    if (endDate) dateFilter[Op.lte] = new Date(endDate);

    // Get calls
    if (!type || type === 'call') {
      const calls = await Call.findAll({
        where: {
          user_id: userId,
          ...(Object.keys(dateFilter).length > 0 && { created_at: dateFilter })
        },
        include: [
          { model: Contact, as: 'contact', attributes: ['id', 'name', 'phone', 'email'] },
          { model: CallRecording, as: 'recording', attributes: ['id', 'file_path', 'duration'] }
        ],
        order: [['created_at', 'DESC']],
        limit: 50
      });

      calls.forEach(call => {
        activities.push({
          type: 'call',
          id: call.id,
          timestamp: call.created_at,
          data: {
            phone_number: call.phone_number,
            duration: call.duration,
            call_type: call.call_type,
            outcome: call.outcome,
            call_status: call.call_status,
            contact: call.contact,
            hasRecording: !!call.recording || !!call.recording_url,
            recording_url: call.recording_url,
            notes: call.notes
          }
        });
      });
    }

    // Get emails
    if (!type || type === 'email') {
      const emails = await EmailLog.findAll({
        where: {
          user_id: userId,
          ...(Object.keys(dateFilter).length > 0 && { sent_at: dateFilter })
        },
        include: [
          { model: Contact, as: 'contact', attributes: ['id', 'name', 'email'], required: false },
          { model: Lead, as: 'lead', attributes: ['id', 'name', 'email'], required: false }
        ],
        order: [['sent_at', 'DESC']],
        limit: 50
      });

      emails.forEach(email => {
        activities.push({
          type: 'email',
          id: email.id,
          timestamp: email.sent_at,
          data: {
            recipient_email: email.recipient_email,
            recipient_name: email.recipient_name,
            subject: email.subject,
            body_preview: email.body_preview,
            email_status: email.email_status,
            contact: email.contact,
            lead: email.lead
          }
        });
      });
    }

    // Get lead activities
    if (!type || type === 'lead_activity') {
      const leadActivities = await LeadActivity.findAll({
        where: {
          user_id: userId,
          ...(Object.keys(dateFilter).length > 0 && { created_at: dateFilter })
        },
        include: [
          { model: Lead, as: 'lead', attributes: ['id', 'name', 'phone', 'email'] }
        ],
        order: [['created_at', 'DESC']],
        limit: 50
      });

      leadActivities.forEach(activity => {
        activities.push({
          type: 'lead_activity',
          id: activity.id,
          timestamp: activity.created_at,
          data: {
            activity_type: activity.activity_type,
            description: activity.description,
            lead: activity.lead,
            duration_seconds: activity.duration_seconds
          }
        });
      });
    }

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Paginate
    const offset = (page - 1) * limit;
    const paginatedActivities = activities.slice(offset, offset + parseInt(limit));

    res.json({
      success: true,
      data: {
        user: {
          id: targetUser.id,
          full_name: targetUser.full_name,
          email: targetUser.email,
          role: targetUser.role,
          avatar_url: targetUser.avatar_url
        },
        activities: paginatedActivities,
        pagination: {
          total: activities.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(activities.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get member activity error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch member activity'
    });
  }
};

// Get team member's calls with recordings
exports.getMemberCalls = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, outcome, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    // Authorization check
    if (req.user.role === 'sales_rep' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const where = { user_id: userId };

    if (outcome) where.outcome = outcome;
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    const { count, rows: calls } = await Call.findAndCountAll({
      where,
      include: [
        { model: Contact, as: 'contact', attributes: ['id', 'name', 'phone', 'email'] },
        { model: CallRecording, as: 'recording', attributes: ['id', 'file_path', 'duration', 'recording_sid'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        calls,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get member calls error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch member calls'
    });
  }
};

// Get all team calls (admin/manager only)
exports.getTeamCalls = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, outcome, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    // Only admin/manager can access this
    if (req.user.role === 'sales_rep') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or manager role required.'
      });
    }

    const where = {};

    if (userId) where.user_id = userId;
    if (outcome) where.outcome = outcome;
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    const { count, rows: calls } = await Call.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'avatar_url', 'role']
        },
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'phone', 'email']
        },
        {
          model: CallRecording,
          as: 'recording',
          attributes: ['id', 'file_path', 'duration', 'recording_sid']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        calls,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get team calls error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch team calls'
    });
  }
};

// Get team stats overview (admin/manager only)
exports.getTeamStats = async (req, res) => {
  try {
    // Only admin/manager can access this
    if (req.user.role === 'sales_rep') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or manager role required.'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get all active sales reps
    const salesReps = await User.findAll({
      where: {
        role: 'sales_rep',
        is_active: true
      },
      attributes: ['id', 'full_name', 'email', 'avatar_url']
    });

    // Get stats for each sales rep
    const memberStats = await Promise.all(salesReps.map(async (rep) => {
      // Calls today
      const callsToday = await Call.count({
        where: {
          user_id: rep.id,
          created_at: { [Op.gte]: today }
        }
      });

      // Calls this week
      const callsThisWeek = await Call.count({
        where: {
          user_id: rep.id,
          created_at: { [Op.gte]: weekAgo }
        }
      });

      // Total calls
      const totalCalls = await Call.count({
        where: { user_id: rep.id }
      });

      // Answered calls
      const answeredCalls = await Call.count({
        where: {
          user_id: rep.id,
          outcome: 'answered'
        }
      });

      // Emails sent this week
      const emailsThisWeek = await EmailLog.count({
        where: {
          user_id: rep.id,
          sent_at: { [Op.gte]: weekAgo }
        }
      });

      // Total emails
      const totalEmails = await EmailLog.count({
        where: { user_id: rep.id }
      });

      // Leads assigned
      const leadsAssigned = await Lead.count({
        where: { assigned_to: rep.id }
      });

      // Conversion rate (answered / total * 100)
      const conversionRate = totalCalls > 0
        ? Math.round((answeredCalls / totalCalls) * 100)
        : 0;

      // Last activity
      const lastCall = await Call.findOne({
        where: { user_id: rep.id },
        order: [['created_at', 'DESC']],
        attributes: ['created_at']
      });

      const lastEmail = await EmailLog.findOne({
        where: { user_id: rep.id },
        order: [['sent_at', 'DESC']],
        attributes: ['sent_at']
      });

      const lastActivity = lastCall?.created_at > lastEmail?.sent_at
        ? lastCall?.created_at
        : lastEmail?.sent_at || lastCall?.created_at;

      return {
        user: {
          id: rep.id,
          full_name: rep.full_name,
          email: rep.email,
          avatar_url: rep.avatar_url
        },
        stats: {
          callsToday,
          callsThisWeek,
          totalCalls,
          answeredCalls,
          conversionRate,
          emailsThisWeek,
          totalEmails,
          leadsAssigned,
          lastActivity
        }
      };
    }));

    // Team totals
    const teamTotals = {
      totalCallsToday: memberStats.reduce((sum, m) => sum + m.stats.callsToday, 0),
      totalCallsThisWeek: memberStats.reduce((sum, m) => sum + m.stats.callsThisWeek, 0),
      totalCalls: memberStats.reduce((sum, m) => sum + m.stats.totalCalls, 0),
      totalEmailsThisWeek: memberStats.reduce((sum, m) => sum + m.stats.emailsThisWeek, 0),
      totalEmails: memberStats.reduce((sum, m) => sum + m.stats.totalEmails, 0),
      avgConversionRate: memberStats.length > 0
        ? Math.round(memberStats.reduce((sum, m) => sum + m.stats.conversionRate, 0) / memberStats.length)
        : 0
    };

    res.json({
      success: true,
      data: {
        teamTotals,
        members: memberStats
      }
    });
  } catch (error) {
    console.error('Get team stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch team stats'
    });
  }
};

// Get detailed stats for a specific member
exports.getMemberDetailedStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Authorization check
    if (req.user.role === 'sales_rep' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'full_name', 'email', 'avatar_url', 'role', 'created_at', 'last_login_at']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Call stats
    const callStats = {
      today: await Call.count({ where: { user_id: userId, created_at: { [Op.gte]: today } } }),
      thisWeek: await Call.count({ where: { user_id: userId, created_at: { [Op.gte]: weekAgo } } }),
      thisMonth: await Call.count({ where: { user_id: userId, created_at: { [Op.gte]: monthStart } } }),
      total: await Call.count({ where: { user_id: userId } }),
      answered: await Call.count({ where: { user_id: userId, outcome: 'answered' } }),
      noAnswer: await Call.count({ where: { user_id: userId, outcome: 'no_answer' } }),
      busy: await Call.count({ where: { user_id: userId, outcome: 'busy' } }),
      voicemail: await Call.count({ where: { user_id: userId, outcome: 'voicemail' } })
    };

    // Average call duration
    const avgDuration = await Call.findOne({
      where: { user_id: userId, duration: { [Op.gt]: 0 } },
      attributes: [[fn('AVG', col('duration')), 'avgDuration']]
    });

    callStats.avgDuration = Math.round(avgDuration?.dataValues?.avgDuration || 0);

    // Email stats
    const emailStats = {
      today: await EmailLog.count({ where: { user_id: userId, sent_at: { [Op.gte]: today } } }),
      thisWeek: await EmailLog.count({ where: { user_id: userId, sent_at: { [Op.gte]: weekAgo } } }),
      thisMonth: await EmailLog.count({ where: { user_id: userId, sent_at: { [Op.gte]: monthStart } } }),
      total: await EmailLog.count({ where: { user_id: userId } })
    };

    // WhatsApp stats
    const whatsappStats = {
      today: await WhatsAppLog.count({ where: { user_id: userId, sent_at: { [Op.gte]: today } } }),
      thisWeek: await WhatsAppLog.count({ where: { user_id: userId, sent_at: { [Op.gte]: weekAgo } } }),
      thisMonth: await WhatsAppLog.count({ where: { user_id: userId, sent_at: { [Op.gte]: monthStart } } }),
      total: await WhatsAppLog.count({ where: { user_id: userId } })
    };

    // Meeting stats
    const meetingStats = {
      today: await MeetingLog.count({ where: { user_id: userId, scheduled_at: { [Op.gte]: today } } }),
      thisWeek: await MeetingLog.count({ where: { user_id: userId, scheduled_at: { [Op.gte]: weekAgo } } }),
      thisMonth: await MeetingLog.count({ where: { user_id: userId, scheduled_at: { [Op.gte]: monthStart } } }),
      total: await MeetingLog.count({ where: { user_id: userId } }),
      completed: await MeetingLog.count({ where: { user_id: userId, meeting_status: 'completed' } }),
      scheduled: await MeetingLog.count({ where: { user_id: userId, meeting_status: 'scheduled' } }),
      cancelled: await MeetingLog.count({ where: { user_id: userId, meeting_status: 'cancelled' } })
    };

    // Lead stats
    const leadStats = {
      assigned: await Lead.count({ where: { assigned_to: userId } }),
      created: await Lead.count({ where: { created_by: userId } }),
      converted: await Lead.count({ where: { assigned_to: userId, lead_status: 'converted' } })
    };

    // Contact stats
    const contactStats = {
      assigned: await Contact.count({ where: { assigned_to: userId } }),
      created: await Contact.count({ where: { created_by: userId } })
    };

    // Recent calls with recordings
    const recentCalls = await Call.findAll({
      where: { user_id: userId },
      include: [
        { model: Contact, as: 'contact', attributes: ['id', 'name', 'phone'] },
        { model: CallRecording, as: 'recording', attributes: ['id', 'duration'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    // Recent WhatsApp messages
    const recentWhatsApp = await WhatsAppLog.findAll({
      where: { user_id: userId },
      include: [
        { model: Contact, as: 'contact', attributes: ['id', 'name', 'phone'], required: false },
        { model: Lead, as: 'lead', attributes: ['id', 'name', 'phone'], required: false }
      ],
      order: [['sent_at', 'DESC']],
      limit: 10
    });

    // Recent Meetings
    const recentMeetings = await MeetingLog.findAll({
      where: { user_id: userId },
      include: [
        { model: Contact, as: 'contact', attributes: ['id', 'name', 'phone'], required: false },
        { model: Lead, as: 'lead', attributes: ['id', 'name', 'phone'], required: false }
      ],
      order: [['scheduled_at', 'DESC']],
      limit: 10
    });

    // Recent Emails
    const recentEmails = await EmailLog.findAll({
      where: { user_id: userId },
      include: [
        { model: Contact, as: 'contact', attributes: ['id', 'name', 'email'], required: false },
        { model: Lead, as: 'lead', attributes: ['id', 'name', 'email'], required: false }
      ],
      order: [['sent_at', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        user,
        callStats,
        emailStats,
        whatsappStats,
        meetingStats,
        leadStats,
        contactStats,
        recentCalls,
        recentWhatsApp,
        recentMeetings,
        recentEmails,
        conversionRate: callStats.total > 0
          ? Math.round((callStats.answered / callStats.total) * 100)
          : 0
      }
    });
  } catch (error) {
    console.error('Get member detailed stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch member stats'
    });
  }
};
