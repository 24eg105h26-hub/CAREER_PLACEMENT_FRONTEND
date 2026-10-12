import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, CheckCircle, XCircle, Trash2, Edit3, Shield, RefreshCw } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import api from '../../services/api';

export const AdminUserManagementPage = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('STUDENT');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    phone: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      showToast('Failed to load system users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus = !user.enabled;
    try {
      await api.put(`/admin/users/${user.id}/status?enabled=${nextStatus}`);
      showToast(`User ${user.fullName} is now ${nextStatus ? 'Activated' : 'Deactivated'}`, 'success');
      fetchUsers();
    } catch (err) {
      showToast('Failed to change user status', 'error');
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/admin/users/${selectedUser.id}/role?role=${newRole}`);
      showToast(`Updated ${selectedUser.fullName}'s role to ${newRole}`, 'success');
      setRoleModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast('Failed to update role', 'error');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${user.fullName}"?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      showToast(`User ${user.fullName} deleted successfully`, 'success');
      fetchUsers();
    } catch (err) {
      showToast('Failed to delete user', 'error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    try {
      await api.post('/admin/users', form);
      showToast('User created successfully!', 'success');
      setModalOpen(false);
      setForm({ fullName: '', email: '', password: '', role: 'STUDENT', phone: '' });
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create user', 'error');
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>User Access Management</h2>
          <p className="text-sm text-muted">Create, activate, assign roles and govern all platform user accounts</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchUsers}>Refresh</Button>
          <Button variant="primary" icon={UserPlus} onClick={() => setModalOpen(true)}>Add New User</Button>
        </div>
      </div>

      <Card>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px', background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: '6px' }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)' }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="MENTOR">Mentors</option>
            <option value="TPO">TPO Officers</option>
            <option value="RECRUITER">Recruiters</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>

        <DataTable
          columns={[
            {
              header: 'Full Name',
              key: 'fullName',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 600 }}>{row.fullName}</div>
                  <div className="text-xs text-muted">{row.email}</div>
                </div>
              ),
            },
            {
              header: 'Role',
              key: 'role',
              render: (val) => {
                const variants = { ADMIN: 'danger', TPO: 'warning', RECRUITER: 'primary', FACULTY: 'secondary', MENTOR: 'secondary', STUDENT: 'success' };
                return <Badge variant={variants[val] || 'default'}>{val}</Badge>;
              },
            },
            {
              header: 'Account Status',
              key: 'enabled',
              render: (val) => (
                <Badge variant={val ? 'success' : 'danger'}>{val ? 'ACTIVE' : 'DISABLED'}</Badge>
              ),
            },
            {
              header: 'Approval',
              key: 'approvalStatus',
              render: (val) => <Badge variant={val === 'APPROVED' ? 'success' : val === 'REJECTED' ? 'danger' : 'warning'}>{val || 'APPROVED'}</Badge>,
            },
            {
              header: 'Actions',
              key: 'actions',
              render: (_, row) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    size="sm"
                    variant={row.enabled ? 'secondary' : 'primary'}
                    onClick={() => handleToggleStatus(row)}
                    title={row.enabled ? 'Deactivate user' : 'Activate user'}
                  >
                    {row.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Shield}
                    onClick={() => {
                      setSelectedUser(row);
                      setNewRole(row.role);
                      setRoleModalOpen(true);
                    }}
                    title="Change Role"
                  >
                    Role
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={Trash2}
                    onClick={() => handleDelete(row)}
                    title="Delete User"
                  />
                </div>
              ),
            },
          ]}
          data={filtered}
          loading={loading}
          emptyMessage="No users found matching your criteria."
        />
      </Card>

      {/* Create User Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Platform User">
        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Arthur Pendelton"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            />
          </div>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. arthur@college.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            />
          </div>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Password *</label>
            <input
              type="password"
              required
              placeholder="Enter strong password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            />
          </div>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Role *</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            >
              <option value="STUDENT">STUDENT</option>
              <option value="FACULTY">FACULTY</option>
              <option value="MENTOR">MENTOR</option>
              <option value="TPO">TPO</option>
              <option value="RECRUITER">RECRUITER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Phone Number (Optional)</label>
            <input
              type="text"
              placeholder="+1 555-0199"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create User</Button>
          </div>
        </form>
      </Modal>

      {/* Role Change Modal */}
      <Modal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} title="Change User System Role">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="text-sm">
            Updating system role for <strong>{selectedUser?.fullName}</strong> ({selectedUser?.email}).
          </p>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Select Target Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            >
              <option value="STUDENT">STUDENT</option>
              <option value="FACULTY">FACULTY</option>
              <option value="MENTOR">MENTOR</option>
              <option value="TPO">TPO</option>
              <option value="RECRUITER">RECRUITER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setRoleModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleRoleChange}>Confirm Role Change</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUserManagementPage;
