import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import ApplicationPipeline from '../../components/ApplicationPipeline';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
import { Layers, Briefcase, Calendar } from 'lucide-react';

const StudentApplicationsPage = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then((res) => {
        if (res.data) setApplications(res.data);
      })
      .catch((err) => addToast(err.message || 'Failed to load applications', 'danger'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>My Job Applications Tracker</h2>
          <p className="text-sm text-secondary">Track live recruitment stages, shortlisting, and interview updates</p>
        </div>
        <Badge variant="primary">{applications.length} Total Submissions</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {applications.length === 0 ? (
          <Card>
            <p className="text-muted">You have not submitted any job applications yet. Browse jobs to apply!</p>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3>{app.job?.title || 'Software Engineer'}</h3>
                  <p className="text-sm text-secondary" style={{ marginTop: '2px' }}>
                    {app.job?.company?.name || 'Company'} • Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <Badge variant={app.status === 'SELECTED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'primary'}>
                  {app.status}
                </Badge>
              </div>

              <ApplicationPipeline currentStatus={app.status} history={app.history || []} />
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentApplicationsPage;
