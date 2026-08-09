const Team = require('../models/Team');
const User = require('../models/User');

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Team name is required' });
    }

    // Check if user is already in a team created by them
    const existingTeam = await Team.findOne({
      $or: [
        { creatorId: req.user._id },
        { members: req.user._id }
      ]
    });

    if (existingTeam) {
      return res.status(400).json({
        message: 'You already belong to a team',
        team: existingTeam
      });
    }

    const team = await Team.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      creatorId: req.user._id,
      members: [req.user._id]
    });

    const populatedTeam = await Team.findById(team._id).populate('members', 'name email');

    res.status(201).json(populatedTeam);
  } catch (error) {
    console.error('Create team error:', error.message);
    res.status(500).json({ message: 'Failed to create team', error: error.message });
  }
};

// @desc    Get user's active team
// @route   GET /api/teams
// @access  Private
const getUserTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      $or: [
        { creatorId: req.user._id },
        { members: req.user._id }
      ]
    }).populate('members', 'name email');

    if (!team) {
      return res.status(200).json(null);
    }

    res.status(200).json(team);
  } catch (error) {
    console.error('Get user team error:', error.message);
    res.status(500).json({ message: 'Failed to fetch team details', error: error.message });
  }
};

// @desc    Add member to user's team by email
// @route   POST /api/teams/:id/members
// @access  Private
const addTeamMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Member email address is required' });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Ensure logged-in user belongs to this team
    const isMember = team.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (!isMember && team.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add members to this team' });
    }

    // Find registered user by email
    const userToAdd = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userToAdd) {
      return res.status(404).json({ message: 'No registered user found with this email' });
    }

    // Check if user is already a member
    const alreadyInTeam = team.members.some(
      (m) => m.toString() === userToAdd._id.toString()
    );
    if (alreadyInTeam) {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }

    team.members.push(userToAdd._id);
    await team.save();

    const updatedTeam = await Team.findById(team._id).populate('members', 'name email');
    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error('Add team member error:', error.message);
    res.status(500).json({ message: 'Failed to add team member', error: error.message });
  }
};

// @desc    Get team members list
// @route   GET /api/teams/:id/members
// @access  Private
const getTeamMembers = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'name email');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.status(200).json(team.members);
  } catch (error) {
    console.error('Get team members error:', error.message);
    res.status(500).json({ message: 'Failed to fetch team members', error: error.message });
  }
};

module.exports = {
  createTeam,
  getUserTeam,
  addTeamMember,
  getTeamMembers
};
