import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, Shield } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import api from '../../services/api';

export const AdminActivityLogsPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/activities');
      setActivities(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>System Audit & Activity Logs</h2>
          <p className="text-sm text-muted">Immutable audit logs recording administrative and user actions across the platform</p>
        </div>
        <Button variant="secondary" icon={RefreshCw} onClick={fetchActivities}>Refresh</Button>
      </div>

      <Card title="Security & Operations Audit Trail" subtitle="Logged system operations for compliance and governance">
        <DataTable
          columns={[
            {
              header: 'Action',
              key: 'action',
              render: (val) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ),
            },
            {
              header: 'Details & Context',
              key: 'details',
            },
            {
              header: 'Performed By',
              key: 'performedBy',
              render: (val) => <Badge variant="secondary">{val || 'System'}</Badge>,
            },
            {
              header: 'Timestamp',
              key: 'timestamp',
              render: (val) => <span className="text-sm text-muted">{val ? new Date(val).toLocaleString() : 'Recent'}</span>,
            },
          ]}
          data={activities}
          loading={loading}
          emptyMessage="No audit log events recorded yet."
        />
      </Card>
    </div>
  );
};

export default AdminActivityLogsPage;
