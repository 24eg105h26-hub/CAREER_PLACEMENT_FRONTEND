import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import api from '../../services/api';

export const MentorActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState('MOCK_INTERVIEW');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [details, setDetails] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('/mentor/activities'), api.get('/mentor/mentees')])
      .then(([actRes, menteesRes]) => {
        setActivities(actRes?.data || actRes || []);
        const m = menteesRes?.data || menteesRes || [];
        setMentees(m);
        if (m.length > 0 && !selectedStudent) {
          setSelectedStudent(m[0].id.toString());
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!details.trim()) return;

    setSaving(true);
    api.post('/mentor/activities', {
      action: action,
      entityId: selectedStudent,
      details: details.trim(),
    })
      .then(() => {
        setShowModal(false);
        setDetails('');
        loadData();
      })
      .catch((err) => alert(err.message || 'Failed to log session'))
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this activity log?')) return;
    api.delete(`/mentor/activities/${id}`)
      .then(() => loadData())
      .catch((err) => alert(err.message || 'Failed to delete activity'));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Mentoring Sessions & Activity Logs</h2>
          <p className="text-sm text-muted">
            Track mock interviews, 1-on-1 coaching sessions, and milestones reviews conducted with your mentees.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Log New Session
        </Button>
      </div>

      <Card>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px' }}>
            <p className="text-sm text-muted">No activity logs recorded yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session Type</th>
                  <th>Notes & Details</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Badge variant="primary">{a.action.replace('_', ' ')}</Badge>
                    </td>
                    <td className="text-sm text-secondary" style={{ maxWidth: '400px' }}>
                      {a.details}
                    </td>
                    <td className="text-xs text-muted">
                      {a.createdAt ? a.createdAt.substring(0, 10) : ''}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={Trash2}
                        onClick={() => handleDelete(a.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '500px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h3 style={{ margin: '0 0 16px' }}>Log Mentoring Session</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>
                  Session Type
                </label>
                <select
                  className="form-input"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="MOCK_INTERVIEW">Live Mock Interview</option>
                  <option value="RESUME_REVIEW">Resume & Portfolio Review</option>
                  <option value="SESSION_SCHEDULED">Scheduled 1-on-1 Coaching</option>
                  <option value="CODE_REVIEW">Technical Code Review</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>
                  Select Mentee
                </label>
                <select
                  className="form-input"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {mentees.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>
                  Session Notes & Outcomes
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Summary of topics discussed, interview score, or action items assigned..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Session Log'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorActivitiesPage;