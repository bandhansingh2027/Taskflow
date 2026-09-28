import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Bell, Check, CheckCheck, Trash2, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useContext(TaskContext);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="notif-icon-success" />;
      case 'warning':
        return <AlertTriangle size={18} className="notif-icon-warning" />;
      case 'info':
      default:
        return <Info size={18} className="notif-icon-info" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="page-container container-narrow">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={24} className="highlight-text" />
            <h1 style={{ margin: 0 }}>Notifications</h1>
            {unreadCount > 0 && (
              <span className="notif-badge-pill">{unreadCount} Unread</span>
            )}
          </div>
          <p style={{ marginTop: '0.25rem' }}>Real-time workspace activity updates and alerts.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-secondary btn-sm">
            <CheckCheck size={16} />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Bell size={36} />
          </div>
          <h3>No notifications</h3>
          <p>You are all caught up! Workspace updates will appear here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`notification-card ${item.read ? 'notif-read' : 'notif-unread'}`}
            >
              <div className="notif-header">
                <div className="notif-title-row">
                  {getIcon(item.type)}
                  <h4>{item.title}</h4>
                </div>
                <span className="notif-time">{item.time}</span>
              </div>
              <p className="notif-message">{item.message}</p>

              <div className="notif-actions">
                {!item.read && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="notif-btn notif-btn-read"
                    title="Mark as Read"
                  >
                    <Check size={14} />
                    <span>Mark as Read</span>
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="notif-btn notif-btn-delete"
                  title="Delete Notification"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
