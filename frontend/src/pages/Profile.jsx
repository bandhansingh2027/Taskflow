import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { User, Mail, Shield, FileText, CheckCircle2, Save, Sparkles } from 'lucide-react';

const Profile = () => {
  const { profile, updateProfile } = useContext(TaskContext);

  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [role, setRole] = useState(profile.role || '');
  const [bio, setBio] = useState(profile.bio || '');

  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name, email, role, bio });
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="page-container container-narrow">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>User Profile</h1>
          <p>Manage your account credentials and personal preferences.</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="profile-banner">
        <div className="profile-avatar-large">
          {name ? name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="profile-info-header">
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <span className="role-badge">
            <Sparkles size={13} />
            {profile.role || 'Project Manager'}
          </span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="form-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Edit Profile Information</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role / Title</label>
            <div className="input-with-icon">
              <Shield size={18} className="input-icon" />
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Personal Bio</label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief description of your role and responsibilities..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-full">
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
