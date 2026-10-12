import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
import { Plus, Briefcase, MapPin } from 'lucide-react';

const RecruiterJobsPage = () => {
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', location: '', jobType: 'FULL_TIME', description: '' });

  useEffect(() => {
    api.get('/jobs')
      .then((res) => {
        if (res.data) setJobs(res.data);
      })
      .catch((err) => addToast(err.message || 'Failed to load jobs', 'danger'));
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    api.post('/jobs', newJob)
      .then((res) => {
        if (res.data) setJobs([...jobs, res.data]);
        setShowForm(false);
        setNewJob({ title: '', location: '', jobType: 'FULL_TIME', description: '' });
        addToast('Job posting published successfully!', 'success');
      })
      .catch((err) => addToast(err.message || 'Failed to publish job', 'danger'));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Recruiter Job Postings</h2>
          <p className="text-sm text-secondary">Create and manage active campus recruitment postings</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} style={{ marginRight: '6px' }} /> {showForm ? 'Close Form' : 'Post New Job'}
        </Button>
      </div>

      {showForm && (
        <Card title="Post New Placement Opportunity">
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <Input label="Job Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} required />
              <Input label="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} required />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit">Publish Job Posting</Button>
            </div>
          </form>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {jobs.map((job) => (
          <Card key={job.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{job.title}</h3>
                <p className="text-sm text-secondary" style={{ marginTop: '2px' }}>
                  {job.company?.name || 'Company'} • {job.location}
                </p>
              </div>
              <Badge variant="primary">OPEN</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecruiterJobsPage;
