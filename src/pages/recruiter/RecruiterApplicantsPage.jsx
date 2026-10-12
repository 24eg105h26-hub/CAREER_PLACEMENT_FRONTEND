import React, { useState, useEffect } from 'react';
import { Users, Filter, CheckCircle, XCircle, Video, Search } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';

export const RecruiterApplicantsPage = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, [statusFilter]);

  const fetchApplicants = () => {
    setLoading(true);
    const q = statusFilter !== 'ALL' ? `?status=${statusFilter}` : '';
    api.get(`/recruiter/applicants${q}`)
      .then((res) => setApplicants(res?.data || res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = (appId, newStatus) => {
    api.put(`/recruiter/applicants/${appId}/status?status=${newStatus}`)
      .then(() => fetchApplicants())
      .catch((err) => alert(err.message || 'Failed to update status'));
  };

  const filtered = applicants.filter((a) =>
    (a.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.jobTitle || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.rollNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Candidate Hiring Pipeline</h2>
          <p className="text-sm text-muted">
            Review applicant qualifications, match scores, and progress candidate stages.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '170px' }}
          >
            <option value="ALL">All Application Stages</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: '16px', maxWidth: '400px' }}>
          <Input placeholder="Search applicants by name, roll, or job..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} />
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '64px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '36px' }}>No applicants found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job Title</th>
                  <th>Roll / Dept</th>
                  <th>CGPA</th>
                  <th>Match Score</th>
                  <th>Stage</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const statusVariant = a.status === 'SELECTED' ? 'success' : a.status === 'SHORTLISTED' ? 'primary' : a.status === 'REJECTED' ? 'danger' : 'neutral';
                  return (
                    <tr key={a.applicationId}>
                      <td>
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{a.studentName}</span>
                        <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>{a.email}</p>
                      </td>
                      <td><strong>{a.jobTitle}</strong></td>
                      <td>{a.rollNumber} • {a.department}</td>
                      <td><strong>{a.cgpa}</strong></td>
                      <td><span className="font-semibold">{a.matchScore}%</span></td>
                      <td><Badge variant={statusVariant}>{a.status}</Badge></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {a.status !== 'SHORTLISTED' && a.status !== 'SELECTED' && (
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(a.applicationId, 'SHORTLISTED')}>
                              Shortlist
                            </Button>
                          )}
                          {a.status !== 'INTERVIEW' && a.status !== 'SELECTED' && (
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(a.applicationId, 'INTERVIEW')}>
                              Interview
                            </Button>
                          )}
                          {a.status !== 'SELECTED' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(a.applicationId, 'SELECTED')}>
                              Select
                            </Button>
                          )}
                          {a.status !== 'REJECTED' && (
                            <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(a.applicationId, 'REJECTED')}>
                              Reject
                            </Button>
                          )}
                        </div>
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

export default RecruiterApplicantsPage;