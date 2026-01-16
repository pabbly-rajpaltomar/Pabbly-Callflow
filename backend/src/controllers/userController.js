const { User, Call, Contact, Lead, UserActivity, TeamMember } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const { generatePassword, generateMultiplePasswords } = require('../utils/passwordGenerator');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    if (req.user.role === 'sales_rep') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only managers and admins can view users.'
      });
    }

    const { page = 1, limit = 20, role, is_active, search } = req.query;

    const where = {};

    if (role) where.role = role;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    if (search) {
      where[Op.or] = [
        { full_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        users: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users.',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === 'sales_rep' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const callStats = await Call.count({
      where: { user_id: id }
    });

    res.json({
      success: true,
      data: {
        user,
        stats: {
          totalCalls: callStats
        }
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user.',
      error: error.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can create users.'
      });
    }

    const { email, full_name, role, phone } = req.body;

    if (!email || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Email and full name are required.'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // Auto-generate password
    const generatedPassword = generatePassword(12);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const user = await User.create({
      email,
      password_hash: hashedPassword,
      full_name,
      role: role || 'sales_rep',
      phone,
      password_reset_required: true,
      onboarding_completed: false
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: {
        user: user.toJSON(),
        password: generatedPassword
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating user.',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.user.role === 'sales_rep' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    if (req.user.role !== 'admin' && updates.role) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can change user roles.'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (updates.password) {
      updates.password_hash = updates.password;
      delete updates.password;
    }

    await user.update(updates);

    res.json({
      success: true,
      message: 'User updated successfully.',
      data: { user: user.toJSON() }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user.',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can delete users.'
      });
    }

    const { id } = req.params;

    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account.'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    await user.update({ is_active: false });

    res.json({
      success: true,
      message: 'User deactivated successfully.'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user.',
      error: error.message
    });
  }
};

// Get user stats with activity
exports.getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === 'sales_rep' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Week range
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Month range
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Calls stats
    const callsToday = await Call.count({
      where: {
        user_id: id,
        start_time: { [Op.gte]: today, [Op.lt]: tomorrow }
      }
    });

    const callsWeek = await Call.count({
      where: {
        user_id: id,
        start_time: { [Op.gte]: weekAgo }
      }
    });

    const callsMonth = await Call.count({
      where: {
        user_id: id,
        start_time: { [Op.gte]: monthAgo }
      }
    });

    const answeredCalls = await Call.count({
      where: {
        user_id: id,
        outcome: 'answered'
      }
    });

    const convertedCalls = await Call.count({
      where: {
        user_id: id,
        call_status: 'converted'
      }
    });

    const totalCalls = await Call.count({ where: { user_id: id } });

    const conversionRate = answeredCalls > 0 ? ((convertedCalls / answeredCalls) * 100).toFixed(2) : 0;

    // Recent activities
    const recentActivities = await UserActivity.findAll({
      where: { user_id: id },
      order: [['activity_timestamp', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        user,
        stats: {
          callsToday,
          callsWeek,
          callsMonth,
          totalCalls,
          answeredCalls,
          convertedCalls,
          conversionRate
        },
        recentActivities
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user stats.',
      error: error.message
    });
  }
};

// Bulk create users
exports.bulkCreateUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can create users.'
      });
    }

    const { users } = req.body; // Array of user objects

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Users array is required.'
      });
    }

    const createdUsers = [];
    const passwords = generateMultiplePasswords(users.length, 12);

    for (let i = 0; i < users.length; i++) {
      const userData = users[i];

      if (!userData.email || !userData.full_name) {
        continue; // Skip invalid entries
      }

      // Check if user exists
      const existing = await User.findOne({ where: { email: userData.email } });
      if (existing) {
        continue; // Skip existing users
      }

      const password = passwords[i];
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email: userData.email,
        password_hash: hashedPassword,
        full_name: userData.full_name,
        role: userData.role || 'sales_rep',
        phone: userData.phone || null,
        password_reset_required: true,
        onboarding_completed: false
      });

      createdUsers.push({
        user: user.toJSON(),
        password // Return plain password for first-time setup
      });
    }

    res.status(201).json({
      success: true,
      message: `${createdUsers.length} users created successfully.`,
      data: { users: createdUsers }
    });
  } catch (error) {
    console.error('Bulk create users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating users.',
      error: error.message
    });
  }
};

// Reset user password
exports.resetUserPassword = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const newPassword = generatePassword(12);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password_hash: hashedPassword,
      password_reset_required: true
    });

    res.json({
      success: true,
      message: 'Password reset successfully.',
      data: { newPassword }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting password.',
      error: error.message
    });
  }
};

// Toggle user status
exports.toggleUserStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own status.'
      });
    }

    await user.update({ is_active: !user.is_active });

    res.json({
      success: true,
      message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully.`,
      data: { user: user.toJSON() }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling user status.',
      error: error.message
    });
  }
};

// Assign user to team
exports.assignUserToTeam = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const { id } = req.params;
    const { team_id } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    await user.update({ team_id });

    // Also create TeamMember entry if team_id is provided
    if (team_id) {
      await TeamMember.findOrCreate({
        where: {
          team_id,
          user_id: id
        }
      });
    }

    res.json({
      success: true,
      message: 'User assigned to team successfully.',
      data: { user: user.toJSON() }
    });
  } catch (error) {
    console.error('Assign user to team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning user to team.',
      error: error.message
    });
  }
};

// Change own password (for logged in user)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.'
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password_hash: hashedPassword,
      password_reset_required: false
    });

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password.',
      error: error.message
    });
  }
};

// Bulk assign users to team
exports.bulkAssignTeam = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const { user_ids, team_id } = req.body;

    if (!Array.isArray(user_ids) || !team_id) {
      return res.status(400).json({
        success: false,
        message: 'user_ids array and team_id are required.'
      });
    }

    await User.update(
      { team_id },
      { where: { id: { [Op.in]: user_ids } } }
    );

    // Create TeamMember entries
    for (const userId of user_ids) {
      await TeamMember.findOrCreate({
        where: {
          team_id,
          user_id: userId
        }
      });
    }

    res.json({
      success: true,
      message: `${user_ids.length} users assigned to team successfully.`
    });
  } catch (error) {
    console.error('Bulk assign team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning users to team.',
      error: error.message
    });
  }
};
