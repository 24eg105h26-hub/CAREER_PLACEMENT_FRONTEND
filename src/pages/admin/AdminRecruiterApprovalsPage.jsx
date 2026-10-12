import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, RefreshCw, Building2 } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import { useToast } from '../../components/Toast';
import api from '../../services/api';

export const AdminRecruiterApprovalsPage = () => {
  const { showToast } = useToast();
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecruiters = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      const allUsers = res.data?.data || [];
      const recList = allUsers.filter((u) => u.role === 'RECRUITER');
      setRecruiters(recList);
    } catch (err) {
      console.error('Failed to load recruiters:', err);
      showToast('Failed to load recruiters', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleUpdateApproval = async (user, status) => {
    try {
      await api.put(`/admin/users/${user.id}/approval?status=${status}`);
      showToast(`Recruiter ${user.fullName} is now ${status}`, 'success');
      fetchRecruiters();
    } catch (err) {
      showToast('Failed to update recruiter status', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Corporate Recruiter Approvals</h2>
          <p className="text-sm text-muted">Verify corporate employer identities before authorizing campus placement access</p>
        </div>
        <Button variant="secondary" icon={RefreshCw} onClick={fetchRecruiters}>Refresh</Button>
      </div>

      <Card title="Recruiter Authorization Roster" subtitle="All registered recruiters and their campus recruitment approval status">
        <DataTable
          columns={[
            {
              header: 'Recruiter Contact',
              key: 'fullName',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 600 }}>{row.fullName}</div>
                  <div className="text-xs text-muted">{row.email}</div>
                </div>
              ),
            },
            {
              header: 'Company / Org',
              key: 'company',
              render: (val, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={15} className="text-muted" />
                  <span>{val || row.department?.name || 'Corporate Partner'}</span>
                </div>
              ),
            },
            {
              header: 'Phone',
              key: 'phone',
              render: (val) => val || 'Not provided',
            },
            {
              header: 'Status',
              key: 'approvalStatus',
              render: (val) => {
                const variants = { APPROVED: 'success', REJECTED: 'danger', PENDING: 'warning' };
                return <Badge variant={variants[val] || 'warning'}>{val || 'PENDING'}</Badge>;
              },
            },
            {
              header: 'Actions',
              key: 'actions',
              render: (_, row) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {row.approvalStatus !== 'APPROVED' && (
                    <Button
                      size="sm"
                      variant="primary"
                      icon={Check}
                      onClick={() => handleUpdateApproval(row, 'APPROVED')}
                    >
                      Approve
                    </Button>
                  )}
                  {row.approvalStatus !== 'REJECTED' && (
                    <Button
                      size="sm"
                      variant="danger"
                      icon={X}
                      onClick={() => handleUpdateApproval(row, 'REJECTED')}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
          data={recruiters}
          loading={loading}
          emptyMessage="No recruiters registered in the platform yet."
        />
      </Card>
    </div>
  );
};

export default AdminRecruiterApprovalsPage;
