import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Moon, Sun, Bell, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useContext(TaskContext);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [desktopNotifs, setDesktopNotifs] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSaveSettings = () => {
    setSavedMsg('Settings saved successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="page-container container-narrow">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <SettingsIcon size={24} className="highlight-text" />
            <h1 style={{ margin: 0 }}>Application Settings</h1>
          </div>
          <p style={{ marginTop: '0.25rem' }}>Configure theme, preferences, and account controls.</p>
        </div>
      </div>

      {savedMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Theme Settings Section */}
      <div className="settings-card" style={{ marginBottom: '1.5rem' }}>
        <div className="settings-header">
          {theme === 'dark' ? <Moon size={22} className="highlight-text" /> : <Sun size={22} className="highlight-text" />}
          <div>
            <h3>Appearance Theme</h3>
            <p>Switch between dark and light workspace themes.</p>
          </div>
        </div>
        <div className="settings-row">
          <span>Current Theme: <strong>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong></span>
          <button onClick={toggleTheme} className="btn btn-secondary">
            {theme === 'dark' ? (
              <>
                <Sun size={18} />
                <span>Switch to Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={18} />
                <span>Switch to Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification Preferences Section */}
      <div className="settings-card" style={{ marginBottom: '1.5rem' }}>
        <div className="settings-header">
          <Bell size={22} className="highlight-text" />
          <div>
            <h3>Notification Preferences</h3>
            <p>Manage how and when you receive workspace alerts.</p>
          </div>
        </div>

        <div className="toggle-group">
          <div className="toggle-row">
            <div>
              <span className="toggle-title">Email Task Updates</span>
              <p className="toggle-desc">Receive email notifications when assigned new tasks.</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="toggle-checkbox"
            />
          </div>

          <div className="toggle-row">
            <div>
              <span className="toggle-title">Desktop Activity Popups</span>
              <p className="toggle-desc">Show browser notifications for team updates.</p>
            </div>
            <input
              type="checkbox"
              checked={desktopNotifs}
              onChange={(e) => setDesktopNotifs(e.target.checked)}
              className="toggle-checkbox"
            />
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="settings-card">
        <div className="settings-header">
          <ShieldCheck size={22} className="highlight-text" />
          <div>
            <h3>Account & Profile</h3>
            <p>Manage credentials, password, and public profile.</p>
          </div>
        </div>
        <div className="settings-row">
          <Link to="/profile" className="btn btn-secondary">
            <User size={18} />
            <span>Edit Profile Details</span>
          </Link>
          <button onClick={handleSaveSettings} className="btn btn-primary">
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
