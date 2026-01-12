import api from './api';

const teamActivityService = {
  // Get detailed stats for a team member
  getMemberDetailedStats: (userId) => {
    return api.get(`/team-activity/member/${userId}/detailed-stats`);
  },

  // Get team overview stats
  getTeamOverview: () => {
    return api.get('/team-activity/overview');
  },

  // Get all team members with basic stats
  getTeamMembers: () => {
    return api.get('/team-activity/members');
  }
};

export default teamActivityService;
