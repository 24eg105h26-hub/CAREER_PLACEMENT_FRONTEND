import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, Briefcase, Users, TrendingUp, Bell, Plus } from 'lucide-react';
import Card, { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import api from '../../services/api';

export const TPODashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [sendingNotif, setSendingNotif] = useState(false);
  const [notifSent, setNotifSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    setLoading(true);
    api.get('/tpo/dashboard')
      .then((res) => setData(res?.data || res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMsg.trim()) return;

    setSendingNotif(true);
    api.post('/notifications/broadcast', {
      title: notifTitle.trim(),
      message: notifMsg.trim(),
      type: 'ANNOUNCEMENT',
      link: '/student/jobs',
    })
      .then(() => {
        setNotifSent(true);
        setTimeout(() => {
          setNotifSent(false);
          setShowBroadcast(false);
          setNotifTitle('');
          setNotifMsg('');
        }, 2000);
      })
      .catch((err) => alert(err.message || 'Failed to send broadcast'))
      .finally(() => setSendingNotif(false));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }} />
        <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Training & Placement Office (TPO)</h2>
          <p className="text-sm text-muted">
            Campus Placement Operations • Drives Coordination • Corporate Relations
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={Bell} onClick={() => setShowBroadcast(true)}>
            Send Student Announcement
          </Button>
          <Button icon={Calendar} onClick={() => navigate('/tpo/drives')}>
            Manage Drives
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
        <StatCard
          title="Placement Drives"
          value={data?.totalDrives ?? 0}
          icon={Calendar}
          description={`${data?.activeDrives ?? 0} currently active / upcoming`}
        />
        <StatCard
          title="Partner Companies"
          value={data?.totalCompanies ?? 0}
          icon={Building2}
          description="Registered corporate recruiters"
        />
        <StatCard
          title="Total Open Jobs"
          value={data?.totalJobs ?? 0}
          icon={Briefcase}
          description={`${data?.totalApplications ?? 0} student applications`}
        />
        <StatCard
          title="Placement Success Rate"
          value={`${data?.placementRate ?? 0}%`}
          icon={TrendingUp}
          trend={`${data?.placedStudentsCount ?? 0} students placed`}
          trendType="positive"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        <Card title="Quick Placement Operations" subtitle="Shortcuts for placement team">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0 }}>Partner Companies Directory</h4>
                <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>Manage {data?.totalCompanies} corporate hiring partners</p>
              </div>
              <Button size="sm" onClick={() => navigate('/tpo/companies')}>View Companies</Button>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0 }}>Eligible Students Directory</h4>
                <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>Filter batch by CGPA and department thresholds</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/tpo/students')}>Check Eligibility</Button>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0 }}>Placement Analytics</h4>
                <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>Department distributions and application funnel metrics</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/tpo/analytics')}>View Analytics</Button>
            </div>
          </div>
        </Card>

        <Card title="Average Compensation Package" subtitle="Campus median metrics">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', textAlign: 'center', padding: '16px 0' }}>
            <span className="text-xs uppercase text-muted font-semibold">Tier-1 & Core Median</span>
            <h1 style={{ fontSize: '42px', color: 'var(--primary)', margin: 0 }}>{data?.averagePackage || '14.2 LPA'}</h1>
            <p className="text-xs text-secondary">
              Based on recent accepted offers across Google, Amazon, Microsoft, and TCS
            </p>
          </div>
        </Card>
      </div>

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxWidth: '500px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Broadcast Announcement to Students</h3>
            <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Title</label>
                <input className="form-input" placeholder="e.g. Google Campus Drive Shortlist Released" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} required style={{ width: '100%' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Message Details</label>
                <textarea className="form-input" rows={3} placeholder="Important information for eligible students..." value={notifMsg} onChange={(e) => setNotifMsg(e.target.value)} required style={{ width: '100%' }} />
              </div>
              {notifSent && (
                <p className="text-xs font-semibold text-success" style={{ margin: 0 }}>Broadcast sent successfully to all students!</p>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="outline" type="button" onClick={() => setShowBroadcast(false)}>Cancel</Button>
                <Button type="submit" disabled={sendingNotif}>{sendingNotif ? 'Sending...' : 'Send Broadcast'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TPODashboard;