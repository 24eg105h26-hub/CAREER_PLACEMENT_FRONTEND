import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Globe, Briefcase, RefreshCw } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import api from '../../services/api';

export const AdminCompaniesPage = () => {
  const { showToast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    website: '',
    industry: 'Technology',
    tier: 'TIER_1',
    description: '',
  });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/companies');
      setCompanies(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load companies:', err);
      showToast('Failed to load partner companies', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name) {
      showToast('Company name is required', 'error');
      return;
    }
    try {
      await api.post('/admin/companies', form);
      showToast('Corporate partner added successfully', 'success');
      setModalOpen(false);
      setForm({ name: '', website: '', industry: 'Technology', tier: 'TIER_1', description: '' });
      fetchCompanies();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add company', 'error');
    }
  };

  const handleDelete = async (comp) => {
    if (!window.confirm(`Are you sure you want to delete partner company "${comp.name}"?`)) return;
    try {
      await api.delete(`/admin/companies/${comp.id}`);
      showToast('Company removed successfully', 'success');
      fetchCompanies();
    } catch (err) {
      showToast('Failed to delete company', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Corporate Partner Companies</h2>
          <p className="text-sm text-muted">Manage corporate recruitment partners, industry classifications and tier rankings</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchCompanies}>Refresh</Button>
          <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>Add Partner Company</Button>
        </div>
      </div>

      <Card title="Campus Recruiting Corporate Partners" subtitle="Active enterprises participating in placement cycles">
        <DataTable
          columns={[
            {
              header: 'Company Name',
              key: 'name',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 600 }}>{row.name}</div>
                  {row.website && (
                    <a href={row.website} target="_blank" rel="noreferrer" className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={12} /> {row.website}
                    </a>
                  )}
                </div>
              ),
            },
            {
              header: 'Industry',
              key: 'industry',
              render: (val) => val || 'Technology',
            },
            {
              header: 'Tier',
              key: 'tier',
              render: (val) => {
                const variants = { TIER_1: 'success', TIER_2: 'primary', TIER_3: 'secondary' };
                return <Badge variant={variants[val] || 'default'}>{val || 'TIER_1'}</Badge>;
              },
            },
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
          data={companies}
          loading={loading}
          emptyMessage="No partner companies registered yet."
        />
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register Corporate Partner">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Company Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. NVIDIA Corporation"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            />
          </div>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Official Website</label>
            <input
              type="url"
              placeholder="https://nvidia.com"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            />
          </div>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Industry Classification</label>
            <input
              type="text"
              placeholder="e.g. Semiconductors & AI Systems"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            />
          </div>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Recruitment Tier</label>
            <select
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            >
              <option value="TIER_1">TIER 1 (Dream & Premium CTC)</option>
              <option value="TIER_2">TIER 2 (Core & Enterprise)</option>
              <option value="TIER_3">TIER 3 (Mass & Volume)</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Company</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCompaniesPage;
