const { User, LeadAssignmentConfig } = require('../models');

/**
 * Initialize the lead assignment configuration
 * Sets up the round-robin rotation with all active sales reps
 */
exports.initializeAssignmentConfig = async () => {
  try {
    // Get all active sales reps
    const salesReps = await User.findAll({
      where: {
        role: 'sales_rep',
        is_active: true
      },
      order: [['id', 'ASC']],
      attributes: ['id']
    });

    if (salesReps.length === 0) {
      console.warn('No active sales reps found for lead assignment');
      return null;
    }

    // Create assignment order array
    const assignmentOrder = salesReps.map(rep => rep.id);

    // Create or update config
    const [config, created] = await LeadAssignmentConfig.findOrCreate({
      where: { is_active: true },
      defaults: {
        last_assigned_user_id: salesReps[0].id,
        assignment_order: assignmentOrder,
        is_active: true
      }
    });

    if (!created) {
      // Update existing config
      await config.update({
        assignment_order: assignmentOrder
      });
    }

    return config;
  } catch (error) {
    console.error('Initialize assignment config error:', error);
    throw error;
  }
};

/**
 * Get the next user to assign a lead to (round-robin)
 * @returns {number|null} User ID or null if no sales reps available
 */
exports.getNextAssignee = async () => {
  try {
    // Get active sales reps
    const salesReps = await User.findAll({
      where: {
        role: 'sales_rep',
        is_active: true
      },
      order: [['id', 'ASC']],
      attributes: ['id']
    });

    if (salesReps.length === 0) {
      console.warn('No active sales reps available for assignment');
      return null;
    }

    // Get current config
    let config = await LeadAssignmentConfig.findOne({
      where: { is_active: true }
    });

    // Initialize if no config exists
    if (!config) {
      config = await this.initializeAssignmentConfig();
      if (!config) return null;
    }

    // Find current position in rotation
    const currentIndex = salesReps.findIndex(
      rep => rep.id === config.last_assigned_user_id
    );

    // Calculate next index (round-robin)
    const nextIndex = (currentIndex + 1) % salesReps.length;
    const nextUserId = salesReps[nextIndex].id;

    // Update config with next user
    await config.update({
      last_assigned_user_id: nextUserId
    });

    console.log(`Assigned lead to user ID: ${nextUserId} (round-robin)`);
    return nextUserId;
  } catch (error) {
    console.error('Get next assignee error:', error);
    throw error;
  }
};

/**
 * Update assignment order when users are added/removed
 * Call this when user roles or active status changes
 */
exports.updateAssignmentOrder = async () => {
  try {
    // Get all active sales reps
    const salesReps = await User.findAll({
      where: {
        role: 'sales_rep',
        is_active: true
      },
      order: [['id', 'ASC']],
      attributes: ['id']
    });

    if (salesReps.length === 0) {
      console.warn('No active sales reps found');
      return null;
    }

    const assignmentOrder = salesReps.map(rep => rep.id);

    // Update config
    const config = await LeadAssignmentConfig.findOne({
      where: { is_active: true }
    });

    if (config) {
      await config.update({ assignment_order: assignmentOrder });
    } else {
      await this.initializeAssignmentConfig();
    }

    console.log('Assignment order updated');
    return assignmentOrder;
  } catch (error) {
    console.error('Update assignment order error:', error);
    throw error;
  }
};
