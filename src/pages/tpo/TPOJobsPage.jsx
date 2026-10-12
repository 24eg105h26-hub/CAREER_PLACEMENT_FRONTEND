import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, MapPin } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import api from '../../services/api';

export const TPOJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setLoading(true);
    api.get('/tpo/jobs')
      .then((res) => setJobs(res?.data || res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = (jobId, currentStatus) => {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    api.put(`/tpo/jobs/${jobId}/status?status=${newStatus}`)
      .then(() => fetchJobs())
      .catch((err) => alert(err.message || 'Failed to update job status'));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Campus Placement Job Postings</h2>
        <p className="text-sm text-muted">Review, approve, and manage all active recruiter job listings across departments.</p>
      </div>

      <Card>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '36px' }}>No jobs posted yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Salary Package</th>
                  <th>Min CGPA</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td><span className="font-semibold text-sm">{j.title}</span></td>
                    <td><strong>{j.companyName}</strong></td>
                    <td>{j.location}</td>
                    <td>{j.salaryRange || 'Industry Standard'}</td>
                    <td>{j.minCgpa}</td>
                    <td><strong>{j.applicationsCount}</strong> applicants</td>
                    <td><Badge variant={j.status === 'OPEN' ? 'success' : 'neutral'}>{j.status}</Badge></td>
                    <td style={{ textAlign: 'right' }}>
                      <Button size="sm" variant="ghost" onClick={() => handleToggleStatus(j.id, j.status)}>
                        {j.status === 'OPEN' ? 'Close Job' : 'Re-open'}
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

export default TPOJobsPage;