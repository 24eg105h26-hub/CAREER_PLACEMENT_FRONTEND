import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import Button from './Button';
import api from '../services/api';

export const NotificationPanel = ({ notifications: propNotifications, onMarkRead: propOnMarkRead }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(propNotifications || []);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.warn('Could not fetch notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propNotifications && propNotifications.length > 0) {
      setNotifications(propNotifications);
    } else {
      fetchNotifications();
    }
  }, [propNotifications]);

  const handleMarkRead = async (id) => {
    if (propOnMarkRead) {
      propOnMarkRead(id);
      return;
    }
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && (!propNotifications || propNotifications.length === 0)) {
            fetchNotifications();
          }
        }}
        className="btn btn-ghost btn-icon"
        style={{ position: 'relative' }}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              minWidth: '16px',
              height: '16px',
              padding: '0 4px',
              borderRadius: '8px',
              backgroundColor: 'var(--danger)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '48px',
            right: 0,
            width: '340px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 60,
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: 'var(--font-size-md)', margin: 0 }}>Notifications</h4>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '11px', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                >
                  <CheckCheck size={14} /> Read all
                </button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                <X size={14} />
              </Button>
            </div>
          </div>
          <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.length === 0 ? (
              <p className="text-xs text-muted" style={{ textAlign: 'center', padding: '16px' }}>
                No notifications right now.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: n.isRead ? 'var(--bg-subtle)' : 'var(--primary-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    gap: '8px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p className="text-xs font-medium" style={{ margin: 0, color: 'var(--text-main)' }}>{n.title}</p>
                    <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>{n.message}</p>
                    {n.createdAt && (
                      <span className="text-xs text-muted" style={{ fontSize: '10px' }}>
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '2px' }}
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
