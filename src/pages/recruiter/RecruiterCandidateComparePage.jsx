import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Award } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import ProgressBar from '../../components/ProgressBar';
import api from '../../services/api';

export const RecruiterCandidateComparePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recruiter/compare')
      .then((res) => setCandidates(res?.data || res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Candidate Side-by-Side Comparison</h2>
        <p className="text-sm text-muted">
          Compare verified candidate skills, academic standing, and placement readiness side-by-side.
        </p>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />
      ) : candidates.length === 0 ? (
        <Card><p className="text-sm text-muted" style={{ textAlign: 'center', padding: '36px' }}>No candidates available to compare.</p></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${candidates.length}, 1fr)`, gap: '16px', overflowX: 'auto' }}>
          {candidates.map((c) => (
            <Card key={c.studentId}>
              <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>
                  {c.name ? c.name[0] : 'C'}
                </div>
                <h3 style={{ margin: 0 }}>{c.name}</h3>
                <p className="text-xs text-muted" style={{ margin: '4px 0 0' }}>{c.rollNumber} • {c.department}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div>
                  <span className="text-xs text-muted font-semibold">Academic CGPA</span>
                  <h4 style={{ margin: '2px 0 0' }}>{c.cgpa} / 10.0</h4>
                </div>

                <div>
                  <span className="text-xs text-muted font-semibold">Estimated Readiness</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span className="text-xs font-bold">{c.readiness}%</span>
                    <ProgressBar value={c.readiness} />
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted font-semibold">Verified Technical Skills</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {c.skills?.map((s, idx) => (
                      <Badge key={idx} variant="primary">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterCandidateComparePage;