import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Users, UserPlus, Shield, Mail, PlusCircle, CheckCircle2, Trash2, Search, User } from 'lucide-react';

const MyTeam = () => {
  const { team, createTeam, addTeamMember, deleteTeamMember } = useContext(TaskContext);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');

  const [memberEmail, setMemberEmail] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('Frontend Engineer');
  const [searchTerm, setSearchTerm] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateTeam = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!teamName.trim()) {
      setError('Team name is required.');
      return;
    }

    createTeam(teamName.trim(), teamDesc.trim());
    setSuccess('Team created successfully!');
    setTeamName('');
    setTeamDesc('');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!memberEmail.trim()) {
      setError('Please enter a team member email address.');
      return;
    }

    addTeamMember(memberEmail.trim(), memberName.trim(), memberRole);
    setSuccess(`Added team member (${memberEmail}) successfully!`);
    setMemberEmail('');
    setMemberName('');

    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteMember = (memberId, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the team?`)) {
      deleteTeamMember(memberId);
      setSuccess(`Removed ${name} from team.`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const membersList = team?.members || [];
  const filteredMembers = membersList.filter((m) =>
    !searchTerm.trim() ||
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.role && m.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>My Team</h1>
          <p>Manage your workspace team members, roles, and collaboration.</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
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
            <h2>Create Your Team Workspace</h2>
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

            <button type="submit" className="btn btn-primary btn-full">
              <PlusCircle size={18} />
              <span>Create Team Workspace</span>
            </button>
          </form>
        </div>
      ) : (
        /* Active Team View */
        <div className="team-layout">
          {/* Team Banner */}
          <div className="team-banner">
            <div className="team-banner-header">
              <div className="team-badge-icon">
                <Users size={28} />
              </div>
              <div>
                <h2>{team.name}</h2>
                <p>{team.description || 'Core product engineering & design workspace'}</p>
              </div>
            </div>
            <div className="team-stats-pill">
              <span>{membersList.length} Active Members</span>
            </div>
          </div>

          {/* Add Team Member Form */}
          <div className="form-card" style={{ marginBottom: '2rem' }}>
            <h3
              style={{
                fontSize: '1.1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <UserPlus size={18} className="highlight-text" />
              Add New Team Member
            </h3>

            <form onSubmit={handleAddMember}>
              <div className="form-row" style={{ marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Member Email *</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      placeholder="e.g. member@taskflow.com"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Member Full Name</label>
                  <div className="input-with-icon">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row" style={{ alignItems: 'flex-end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Role / Position</label>
                  <div className="input-with-icon">
                    <Shield size={18} className="input-icon" />
                    <select
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                    >
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="QA Specialist">QA Specialist</option>
                      <option value="DevOps Lead">DevOps Lead</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
                  <UserPlus size={18} />
                  <span>Add Member</span>
                </button>
              </div>
            </form>
          </div>

          {/* Members List Header & Search */}
          <div className="section-header" style={{ marginBottom: '1.25rem' }}>
            <div className="section-title">
              <Shield size={20} />
              <h2>Team Members ({filteredMembers.length})</h2>
            </div>
            <div className="search-box" style={{ maxWidth: '280px' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search member by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Members Grid */}
          <div className="members-grid">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div key={member._id} className="member-card">
                  <div className="member-avatar">{member.avatar || member.name.charAt(0).toUpperCase()}</div>
                  <div className="member-info" style={{ flex: 1 }}>
                    <h4>{member.name}</h4>
                    <p>{member.email}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
                      <span className="role-tag">{member.role || 'Member'}</span>
                      <span className={`status-dot status-${(member.status || 'online').toLowerCase()}`} />
                    </div>
                  </div>
                  {member._id !== 'user_demo_101' && (
                    <button
                      onClick={() => handleDeleteMember(member._id, member.name)}
                      className="action-btn delete-btn"
                      title="Remove Member"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No matching team members found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeam;
