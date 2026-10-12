import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, MessageSquare, Award, AlertTriangle, Calendar, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Card, { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import ProgressBar from '../../components/ProgressBar';
import DataTable from '../../components/DataTable';
import api from '../../services/api';

export const MentorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    setLoading(true);
    api.get('/mentor/dashboard')
      .then((res) => {
        setData(res?.data || res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }} />
        <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <AlertTriangle size={36} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
          <h3>Unable to load mentor dashboard</h3>
          <p className="text-sm text-muted" style={{ margin: '8px 0 16px' }}>{error}</p>
          <Button onClick={fetchDashboard}>Retry</Button>
        </div>
      </Card>
    );
  }

  const assignedCount = data?.assignedStudentsCount ?? 0;
  const avgReadiness = data?.averageReadiness ?? 0;
  const needingAttention = data?.studentsNeedingAttentionCount ?? 0;
  const recentFeedback = data?.recentFeedback || [];
  const upcomingSessions = data?.upcomingSessions || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Industry Mentor Workspace</h2>
          <p className="text-sm text-muted">
            {data?.mentorName} • {data?.designation} at {data?.companyName}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={Calendar} onClick={() => navigate('/mentor/activities')}>
            Log Session
          </Button>
          <Button icon={Users} onClick={() => navigate('/mentor/mentees')}>
            View My Students
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
        <StatCard
          title="Assigned Students"
          value={assignedCount}
          icon={Users}
          description="Active mentees under your guidance"
        />
        <StatCard
          title="Average Readiness"
          value={`${avgReadiness}%`}
          icon={Award}
          trend={avgReadiness >= 75 ? '+4.2% vs last month' : 'Needs attention'}
          trendType={avgReadiness >= 75 ? 'positive' : 'warning'}
        />
        <StatCard
          title="Students Needing Attention"
          value={needingAttention}
          icon={AlertTriangle}
          trendType="negative"
          description="Readiness < 65% or low test score"
        />
        <StatCard
          title="Mentoring Activities"
          value={upcomingSessions.length}
          icon={Calendar}
          description="Total logged sessions & reviews"
        />
      </div>

      {/* Main Grid: Feedback & Sessions */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Recent Feedback Given */}
        <Card title="Recent Student Feedback" subtitle="Your notes and advice provided to mentees">
          {recentFeedback.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <p className="text-sm text-muted">No feedback submitted yet.</p>
              <Button size="sm" style={{ marginTop: '12px' }} onClick={() => navigate('/mentor/feedback')}>
                Give Feedback
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              {recentFeedback.map((f) => (
                <div
                  key={f.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>
                      {f.studentName}
                    </span>
                    <Badge variant={f.category === 'EARLY_WARNING' ? 'danger' : 'primary'}>
                      {f.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.5 }}>
                    "{f.comment}"
                  </p>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/mentor/feedback')}>
                  All Feedback
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Mentoring Sessions & Action Logs */}
        <Card title="Mentoring Activity Logs" subtitle="Past mock reviews and scheduled 1-on-1s">
          {upcomingSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <p className="text-sm text-muted">No session logs found.</p>
              <Button size="sm" style={{ marginTop: '12px' }} onClick={() => navigate('/mentor/activities')}>
                Log Mentoring Session
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              {upcomingSessions.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="font-semibold text-xs text-primary" style={{ textTransform: 'uppercase' }}>
                      {s.action.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-muted">
                      {s.createdAt ? s.createdAt.substring(0, 10) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-secondary" style={{ margin: 0 }}>
                    {s.details}
                  </p>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/mentor/activities')}>
                  Manage Sessions
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboard;