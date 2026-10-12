import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { useToast } from '../../components/Toast';
import api from '../../services/api';

const RecruiterCompanyPage = () => {
  const { addToast } = useToast();
  const [company, setCompany] = useState({ name: '', website: '', location: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recruiter/company')
      .then((res) => {
        if (res.data) setCompany(res.data);
      })
      .catch((err) => addToast(err.message || 'Failed to load company profile', 'danger'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put('/recruiter/company', company)
      .then((res) => {
        if (res.data) setCompany(res.data);
        addToast('Company profile updated successfully!', 'success');
      })
      .catch((err) => addToast(err.message || 'Failed to update company profile', 'danger'));
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading company profile...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Company Profile Management</h2>
          <p className="text-sm text-secondary">Manage organization info, branding, and placement drive settings</p>
        </div>
        <Badge variant="success">Approved Recruiter</Badge>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card title="Organization Details">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4" style={{ marginTop: '16px' }}>
            <Input label="Company Name" value={company.name || ''} onChange={(e) => setCompany({ ...company, name: e.target.value })} required />
            <Input label="Website URL" value={company.website || ''} onChange={(e) => setCompany({ ...company, website: e.target.value })} placeholder="https://company.com" />
            <Input label="Headquarters / Location" value={company.location || ''} onChange={(e) => setCompany({ ...company, location: e.target.value })} />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label className="text-xs font-semibold" style={{ display: 'block', marginBottom: '6px' }}>Company Description</label>
            <textarea
              rows={4}
              value={company.description || ''}
              onChange={(e) => setCompany({ ...company, description: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
              }}
            />
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit">Save Company Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default RecruiterCompanyPage;
