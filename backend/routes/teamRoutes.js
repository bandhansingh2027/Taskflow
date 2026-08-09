const express = require('express');
const router = express.Router();
const {
  createTeam,
  getUserTeam,
  addTeamMember,
  getTeamMembers
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createTeam)
  .get(getUserTeam);

router.post('/:id/members', addTeamMember);
router.get('/:id/members', getTeamMembers);

module.exports = router;
