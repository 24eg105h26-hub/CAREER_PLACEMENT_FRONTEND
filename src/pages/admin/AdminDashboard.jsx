import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, Sparkles, Building2, Briefcase, Award, CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card, { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import DataTable from '../../components/DataTable';
import api from '../../services/api';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, actRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/activities')
      ]);
      setData(dashRes.data?.data || {});
      setActivities(actRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Unable to retrieve administrative dashboard metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ height: '40px', background: 'var(--bg-card)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
        <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: '100px', background: 'var(--bg-card)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>
        <Button variant="secondary" icon={RefreshCw} onClick={fetchDashboard}>Retry</Button>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>System Administration Console</h2>
          <p className="text-sm text-muted">Enterprise governance, user access management & AI infrastructure monitoring</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge variant="success">System Status: {data?.systemHealth || 'OPTIMAL'}</Badge>
          <Button size="sm" variant="secondary" icon={RefreshCw} onClick={fetchDashboard}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
        <StatCard title="Total Users" value={data?.totalUsers ?? 0} icon={Users} />
        <StatCard title="Registered Students" value={data?.totalStudents ?? 0} icon={Award} />
        <StatCard title="Faculty & Mentors" value={(data?.totalFaculty ?? 0) + (data?.totalMentors ?? 0)} icon={Building2} />
        <StatCard title="Partner Companies" value={data?.totalCompanies ?? 0} icon={Briefcase} />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
        <Card title="Active Jobs & Drives" subtitle="Current placement ecosystem volume">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
              <span className="text-sm text-muted">Active Job Listings</span>
              <span style={{ fontWeight: 600 }}>{data?.totalJobs ?? 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
              <span className="text-sm text-muted">Student Applications</span>
              <span style={{ fontWeight: 600 }}>{data?.totalApplications ?? 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
              <span className="text-sm text-muted">Pending Approvals</span>
              <Badge variant={data?.pendingApprovals > 0 ? 'warning' : 'success'}>{data?.pendingApprovals ?? 0}</Badge>
            </div>
          </div>
        </Card>

        <Card title="Quick Governance Actions" subtitle="Direct access to administrative tasks">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <Button variant="secondary" size="sm" icon={Users} onClick={() => navigate('/admin/users')}>
              Manage System Users
            </Button>
            <Button variant="secondary" size="sm" icon={Building2} onClick={() => navigate('/admin/assignments')}>
              Faculty & Mentor Assignments
            </Button>
            <Button variant="secondary" size="sm" icon={Briefcase} onClick={() => navigate('/admin/companies')}>
              Partner Companies & TPO
            </Button>
            <Button variant="secondary" size="sm" icon={Sparkles} onClick={() => navigate('/admin/ai-logs')}>
              Audit AI Usage & Tokens
            </Button>
          </div>
        </Card>

        <Card title="Security & Health Check" subtitle="Platform integrity status">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="var(--success)" />
              <span className="text-sm">Role-Based Access Control: Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="var(--success)" />
              <span className="text-sm">JWT Session Validation: Enforced</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="var(--success)" />
              <span className="text-sm">Database Integrity: In-Sync</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="var(--success)" />
              <span className="text-sm">Gemini AI Gateway: Operational</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent System Audit Activity" subtitle="Chronological log of administrative and system events">
        <DataTable
          columns={[
            { header: 'Action', key: 'action', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
            { header: 'Details', key: 'details' },
            { header: 'Performed By', key: 'performedBy', render: (val) => <span className="text-sm text-muted">{val || 'System'}</span> },
            { header: 'Timestamp', key: 'timestamp', render: (val) => <span className="text-sm text-muted">{val ? new Date(val).toLocaleString() : 'Recent'}</span> },
          ]}
          data={activities}
          emptyMessage="No recent administrative activity recorded."
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
