import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, CheckCircle, Video, ArrowRight, Building2 } from 'lucide-react';
import Card, { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import api from '../../services/api';

export const RecruiterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/recruiter/dashboard')
      .then((res) => setData(res?.data || res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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

  const recent = data?.recentApplicants || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Corporate Recruiter Hiring Hub</h2>
          <p className="text-sm text-muted">
            {data?.recruiterName} • Talent Acquisition at {data?.companyName}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={Users} onClick={() => navigate('/recruiter/compare')}>
            Compare Candidates
          </Button>
          <Button icon={Briefcase} onClick={() => navigate('/recruiter/jobs')}>
            Post New Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
        <StatCard title="Active Job Openings" value={data?.activeJobsCount ?? 0} icon={Briefcase} />
        <StatCard title="Total Candidates" value={data?.totalApplicantsCount ?? 0} icon={Users} />
        <StatCard title="Shortlisted Candidates" value={data?.shortlistedCount ?? 0} icon={CheckCircle} trendType="positive" />
        <StatCard title="Interviews Scheduled" value={data?.interviewsScheduledCount ?? 0} icon={Video} />
      </div>

      <Card title="Recent Candidate Applications" subtitle="Latest submissions to your active listings">
        {recent.length === 0 ? (
          <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '36px' }}>No applicants yet.</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '12px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job Applied</th>
                  <th>Match Score</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr key={a.applicationId}>
                    <td className="font-semibold text-sm">{a.studentName}</td>
                    <td>{a.jobTitle}</td>
                    <td><span className="font-semibold">{a.matchScore}%</span></td>
                    <td>
                      <Badge variant={a.status === 'SELECTED' ? 'success' : a.status === 'SHORTLISTED' ? 'primary' : 'neutral'}>
                        {a.status}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button size="sm" variant="ghost" icon={ArrowRight} onClick={() => navigate('/recruiter/applicants')}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecruiterDashboard;