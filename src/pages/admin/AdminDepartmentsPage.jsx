import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, RefreshCw } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import api from '../../services/api';

export const AdminDepartmentsPage = () => {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', code: '' });

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/departments');
      setDepartments(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load departments:', err);
      showToast('Failed to load academic departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      showToast('Please provide both department name and code', 'error');
      return;
    }
    try {
      await api.post('/admin/departments', form);
      showToast('Department registered successfully', 'success');
      setModalOpen(false);
      setForm({ name: '', code: '' });
      fetchDepartments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create department', 'error');
    }
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`Are you sure you want to delete department "${dept.name}"?`)) return;
    try {
      await api.delete(`/admin/departments/${dept.id}`);
      showToast('Department removed successfully', 'success');
      fetchDepartments();
    } catch (err) {
      showToast('Failed to delete department', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Academic Departments</h2>
          <p className="text-sm text-muted">Manage college faculties, department codes and placement cohort allocations</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchDepartments}>Refresh</Button>
          <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>Add Department</Button>
        </div>
      </div>

      <Card title="Registered University Departments" subtitle="Current academic units configured for placement tracking">
        <DataTable
          columns={[
            { header: 'Department Name', key: 'name', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
            { header: 'Code', key: 'code', render: (val) => <Badge variant="secondary">{val}</Badge> },
            {
              header: 'Actions',
              key: 'actions',
              render: (_, row) => (
                <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(row)}>
                  Delete
                </Button>
              ),
            },
          ]}
          data={departments}
          loading={loading}
          emptyMessage="No departments found. Click 'Add Department' to configure one."
        />
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register Academic Department">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Department Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Electrical & Electronics Engineering"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            />
          </div>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Department Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. EEE"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Department</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDepartmentsPage;
