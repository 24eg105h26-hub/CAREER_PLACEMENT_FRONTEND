import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import api from '../../services/api';

export const MentorProgressPage = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = () => {
    setLoading(true);
    api.get('/mentor/progress')
      .then((res) => {
        setProgress(res?.data || res || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Mentee Cohort Learning Progress</h2>
        <p className="text-sm text-muted">
          Track milestones completion, readiness health, and on-track delivery across all assigned students.
        </p>
      </div>

      <Card>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : progress.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px' }}>
            <p className="text-sm text-muted">No mentee progress data available.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Milestones Completed</th>
                  <th>Readiness Score</th>
                  <th>Cohort Status</th>
                </tr>
              </thead>
              <tbody>
                {progress.map((p) => {
                  const pct = p.totalMilestones > 0 ? Math.round((p.completedMilestones / p.totalMilestones) * 100) : 0;
                  const statusVariant = p.status === 'ON_TRACK' ? 'success' : p.status === 'NEEDS_ATTENTION' ? 'warning' : 'danger';
                  return (
                    <tr key={p.menteeId}>
                      <td className="font-semibold text-sm">{p.name}</td>
                      <td style={{ minWidth: '180px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className="text-xs font-semibold">{p.completedMilestones} / {p.totalMilestones} Milestones ({pct}%)</span>
                          <ProgressBar value={pct} />
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold text-sm">{p.readiness}%</span>
                      </td>
                      <td>
                        <Badge variant={statusVariant}>{p.status.replace('_', ' ')}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MentorProgressPage;