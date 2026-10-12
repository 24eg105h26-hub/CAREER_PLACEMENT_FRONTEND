import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Award, Building2 } from 'lucide-react';
import Card, { StatCard } from '../../components/Card';
import Badge from '../../components/Badge';
import ProgressBar from '../../components/ProgressBar';
import api from '../../services/api';

export const TPOAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tpo/analytics')
      .then((res) => setStats(res?.data || res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  const deptBreakdown = stats?.departmentBreakdown || {};
  const funnel = stats?.applicationFunnel || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Placement & Skill Intelligence Analytics</h2>
        <p className="text-sm text-muted">
          Cohort level placement breakdown, stage progression, and department distributions.
        </p>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
        <StatCard title="Total Students" value={stats?.totalStudents ?? 0} icon={Users} />
        <StatCard title="Total Drives" value={stats?.totalDrives ?? 0} icon={Award} />
        <StatCard title="Total Job Postings" value={stats?.totalJobs ?? 0} icon={Building2} />
        <StatCard title="Overall Placement Rate" value={`${stats?.placementRate ?? 0}%`} icon={TrendingUp} trendType="positive" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        <Card title="Department-wise Students" subtitle="Batch strength across disciplines">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {Object.entries(deptBreakdown).map(([dept, count]) => (
              <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-semibold text-sm">{dept}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="text-xs text-muted">{count} students</span>
                  <Badge variant="primary">{count}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Application Funnel Pipeline" subtitle="Status of submitted campus job applications">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {Object.entries(funnel).map(([status, count]) => {
              const badgeVariant = status === 'SELECTED' ? 'success' : status === 'SHORTLISTED' ? 'primary' : status === 'REJECTED' ? 'danger' : 'neutral';
              return (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-semibold text-sm">{status}</span>
                  <Badge variant={badgeVariant}>{count} candidates</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TPOAnalyticsPage;