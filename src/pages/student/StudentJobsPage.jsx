import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
import { Briefcase, MapPin, DollarSign, Search, CheckCircle } from 'lucide-react';

const StudentJobsPage = () => {
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  useEffect(() => {
    Promise.all([api.get('/jobs'), api.get('/applications/my')])
      .then(([jobsRes, appRes]) => {
        if (jobsRes.data) setJobs(jobsRes.data);
        if (appRes.data) {
          const applied = new Set(appRes.data.map((a) => a.job?.id || a.jobId));
          setAppliedJobIds(applied);
        }
      })
      .catch((err) => addToast(err.message || 'Failed to load jobs', 'danger'))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = (jobId) => {
    api.post(`/applications/${jobId}`)
      .then(() => {
        addToast('Application submitted successfully!', 'success');
        setAppliedJobIds(new Set([...appliedJobIds, jobId]));
      })
      .catch((err) => addToast(err.message || 'Failed to submit application', 'danger'));
  };

  const filteredJobs = jobs.filter((j) =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.name?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Browse Job Opportunities</h2>
          <p className="text-sm text-secondary">Discover active placement drives and campus hiring openings</p>
        </div>
        <Badge variant="primary">{filteredJobs.length} Open Positions</Badge>
      </div>

      <Card>
        <Input
          placeholder="Search by Job Title, Company, or Location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredJobs.length === 0 ? (
          <Card><p className="text-muted">No open job listings found matching your search.</p></Card>
        ) : (
          filteredJobs.map((job) => {
            const isApplied = appliedJobIds.has(job.id);
            return (
              <Card key={job.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3>{job.title}</h3>
                      <Badge variant="info">{job.jobType || 'Full Time'}</Badge>
                    </div>
                    <p className="text-sm text-secondary" style={{ marginTop: '4px' }}>
                      {job.company?.name || 'Top Company'} • <MapPin size={14} inline /> {job.location || 'Remote'}
                    </p>
                    <p className="text-xs text-muted" style={{ marginTop: '8px' }}>
                      {job.description || 'Join our engineering team to work on cutting edge cloud applications.'}
                    </p>
                  </div>
                  <div>
                    {isApplied ? (
                      <Button variant="secondary" disabled>
                        <CheckCircle size={14} style={{ marginRight: '6px' }} /> Applied
                      </Button>
                    ) : (
                      <Button onClick={() => handleApply(job.id)}>Apply Now</Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentJobsPage;
