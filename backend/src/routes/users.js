const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/stats', userController.getUserStats);
router.post('/', userController.createUser);
router.post('/bulk', userController.bulkCreateUsers);
router.post('/:id/reset-password', userController.resetUserPassword);
router.patch('/:id/status', userController.toggleUserStatus);
router.patch('/:id/team', userController.assignUserToTeam);
router.post('/bulk-assign-team', userController.bulkAssignTeam);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
