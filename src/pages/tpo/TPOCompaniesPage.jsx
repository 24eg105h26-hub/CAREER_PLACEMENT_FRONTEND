import React, { useState, useEffect } from 'react';
import { Building2, Plus, Globe, MapPin, ExternalLink } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import api from '../../services/api';

export const TPOCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    setLoading(true);
    api.get('/tpo/companies')
      .then((res) => setCompanies(res?.data || res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    api.post('/tpo/companies', { name: name.trim(), website, location, description })
      .then(() => {
        setShowModal(false);
        setName('');
        setWebsite('');
        setLocation('');
        setDescription('');
        fetchCompanies();
      })
      .catch((err) => alert(err.message || 'Failed to create company'))
      .finally(() => setSaving(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Partner Companies Directory</h2>
          <p className="text-sm text-muted">Corporate recruiters conducting placement recruitment drives on campus.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>Add Company</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-lg)' }} />
          ))
        ) : companies.map((c) => (
          <Card key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0 }}>{c.name}</h3>
                {c.location && (
                  <p className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0 0' }}>
                    <MapPin size={12} /> {c.location}
                  </p>
                )}
              </div>
              <Badge variant="primary">{c.jobsCount || 0} Open Jobs</Badge>
            </div>
            <p className="text-sm text-secondary" style={{ margin: '12px 0', lineHeight: 1.5 }}>
              {c.description || 'Global corporate technology enterprise.'}
            </p>
            {c.website && (
              <a href={c.website} target="_blank" rel="noreferrer" className="text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                <Globe size={12} /> {c.website} <ExternalLink size={10} />
              </a>
            )}
          </Card>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxWidth: '480px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Add Corporate Partner Company</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Company Name</label>
                <input className="form-input" placeholder="e.g. Adobe Systems" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Website</label>
                <input className="form-input" placeholder="https://adobe.com" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Location</label>
                <input className="form-input" placeholder="Noida / Bengaluru" value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea className="form-input" rows={2} placeholder="Hiring focus and profile..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Company'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TPOCompaniesPage;