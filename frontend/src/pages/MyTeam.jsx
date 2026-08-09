import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Users, UserPlus, Shield, Mail, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

const MyTeam = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create Team state
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Add Member state
  const [memberEmail, setMemberEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/teams');
      setTeam(response.data);
    } catch (err) {
      console.error('Error fetching team:', err);
      setError(err.response?.data?.message || 'Failed to load team data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!teamName.trim()) {
      setError('Team name is required.');
      return;
    }

    setIsCreating(true);
    try {
      const response = await API.post('/teams', {
        name: teamName.trim(),
        description: teamDesc.trim()
      });
      setTeam(response.data);
      setSuccess('Team created successfully!');
      setTeamName('');
      setTeamDesc('');
    } catch (err) {
      console.error('Create team error:', err);
      setError(err.response?.data?.message || 'Failed to create team.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!memberEmail.trim()) {
      setError('Please enter a user email address.');
      return;
    }

    setIsAdding(true);
    try {
      const response = await API.post(`/teams/${team._id}/members`, {
        email: memberEmail.trim()
      });
      setTeam(response.data);
      setSuccess(`Added member (${memberEmail}) to team successfully!`);
      setMemberEmail('');
    } catch (err) {
      console.error('Add member error:', err);
      setError(err.response?.data?.message || 'Failed to add member.');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading team information...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>My Team</h1>
          <p>Manage your team workspace and members.</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {!team ? (
        /* Create Team State */
        <div className="form-card container-narrow">
          <div className="form-header" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <div className="auth-logo" style={{ marginBottom: '1rem' }}>
              <Users size={32} />
            </div>
            <h2>Create Your Team</h2>
            <p>Set up a team to assign tasks and collaborate with team members.</p>
          </div>

          <form onSubmit={handleCreateTeam}>
            <div className="form-group">
              <label htmlFor="teamName">Team Name *</label>
              <div className="input-with-icon">
                <Users size={18} className="input-icon" />
                <input
                  type="text"
                  id="teamName"
                  placeholder="e.g. Engineering Core Team"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="teamDesc">Team Description</label>
              <textarea
                id="teamDesc"
                rows={3}
                placeholder="Brief description of your team's mission or scope..."
                value={teamDesc}
                onChange={(e) => setTeamDesc(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isCreating}
            >
              {isCreating ? (
                <span className="btn-loading">
                  <span className="spinner-sm"></span> Creating Team...
                </span>
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Create Team</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Active Team View */
        <div className="team-layout">
          {/* Team Details Overview */}
          <div className="team-banner">
            <div className="team-banner-header">
              <div className="team-badge-icon">
                <Users size={28} />
              </div>
              <div>
                <h2>{team.name}</h2>
                <p>{team.description || 'No description provided.'}</p>
              </div>
            </div>
            <div className="team-stats-pill">
              <span>{team.members?.length || 0} Members</span>
            </div>
          </div>

          {/* Add Team Member Section */}
          <div className="form-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={18} className="highlight-text" />
              Add Team Member
            </h3>

            <form onSubmit={handleAddMember} className="add-member-form">
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Enter registered user email address..."
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isAdding}
                style={{ whiteSpace: 'nowrap' }}
              >
                {isAdding ? 'Adding...' : 'Add Member'}
              </button>
            </form>
          </div>

          {/* Team Members List */}
          <div className="section-header">
            <div className="section-title">
              <Shield size={20} />
              <h2>Team Members</h2>
            </div>
          </div>

          <div className="members-grid">
            {team.members && team.members.length > 0 ? (
              team.members.map((member) => (
                <div key={member._id} className="member-card">
                  <div className="member-avatar">
                    {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <p>{member.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No team members found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeam;
