const { User, Call } = require('../models');
const { Op } = require('sequelize');

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

    const { email, password, full_name, role, phone } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required.'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    const user = await User.create({
      email,
      password_hash: password,
      full_name,
      role: role || 'sales_rep',
      phone
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: { user: user.toJSON() }
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
