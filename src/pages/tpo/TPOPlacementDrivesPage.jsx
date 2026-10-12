import React, { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle2, Building2 } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import api from '../../services/api';

export const TPOPlacementDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [location, setLocation] = useState('Campus Auditorium');
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [driveDate, setDriveDate] = useState('2026-11-01');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('/tpo/drives'), api.get('/tpo/companies')])
      .then(([dRes, cRes]) => {
        setDrives(dRes?.data || dRes || []);
        const comps = cRes?.data || cRes || [];
        setCompanies(comps);
        if (comps.length > 0 && !companyId) {
          setCompanyId(comps[0].id.toString());
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim() || !companyId) return;

    setSaving(true);
    api.post('/tpo/drives', {
      title: title.trim(),
      description,
      companyId: Number(companyId),
      location,
      minCgpa: Number(minCgpa),
      driveDate,
    })
      .then(() => {
        setShowModal(false);
        setTitle('');
        setDescription('');
        loadData();
      })
      .catch((err) => alert(err.message || 'Failed to create drive'))
      .finally(() => setSaving(false));
  };

  const handleCloseDrive = (id) => {
    if (!window.confirm('Are you sure you want to mark this placement drive as COMPLETED?')) return;
    api.put(`/tpo/drives/${id}/close`)
      .then(() => loadData())
      .catch((err) => alert(err.message || 'Failed to close drive'));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Placement Drives Management</h2>
          <p className="text-sm text-muted">
            Schedule on-campus and virtual hiring drives, set cutoffs, and monitor process status.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Schedule New Drive
        </Button>
      </div>

      <Card>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : drives.length === 0 ? (
          <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '36px' }}>No drives scheduled.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Drive Title</th>
                  <th>Company</th>
                  <th>Drive Date</th>
                  <th>Location</th>
                  <th>Min CGPA</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((d) => {
                  const isCompleted = d.status === 'COMPLETED';
                  const badgeVariant = isCompleted ? 'neutral' : d.status === 'ONGOING' ? 'success' : 'primary';
                  return (
                    <tr key={d.id}>
                      <td>
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{d.title}</span>
                        {d.description && <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>{d.description}</p>}
                      </td>
                      <td><strong>{d.companyName}</strong></td>
                      <td>{d.driveDate}</td>
                      <td>{d.location}</td>
                      <td>{d.minCgpa}</td>
                      <td><Badge variant={badgeVariant}>{d.status}</Badge></td>
                      <td style={{ textAlign: 'right' }}>
                        {!isCompleted && (
                          <Button size="sm" variant="outline" onClick={() => handleCloseDrive(d.id)}>
                            Close Drive
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxWidth: '520px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Schedule Placement Drive</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Drive Title</label>
                <input className="form-input" placeholder="e.g. Amazon University SDE Hiring" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Partner Company</label>
                  <select className="form-input" value={companyId} onChange={(e) => setCompanyId(e.target.value)} style={{ width: '100%' }}>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Drive Date</label>
                  <input type="date" className="form-input" value={driveDate} onChange={(e) => setDriveDate(e.target.value)} style={{ width: '100%' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Location / Mode</label>
                  <input className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Minimum CGPA Cutoff</label>
                  <input type="number" step="0.1" className="form-input" value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea className="form-input" rows={2} placeholder="Rounds details, test links, instructions..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Scheduling...' : 'Schedule Drive'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TPOPlacementDrivesPage;