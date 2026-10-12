import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import api from '../../services/api';

export const MentorRecommendationsPage = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecs();
  }, []);

  const fetchRecs = () => {
    setLoading(true);
    api.get('/mentor/recommendations')
      .then((res) => {
        setRecs(res?.data || res || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>AI Recommendations for Mentees</h2>
        <p className="text-sm text-muted">
          Smart AI recommendations analyzed from each student's current skill gaps, readiness score, and placement targets.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : recs.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '36px' }}>
            <p className="text-sm text-muted">No recommendations available at this time.</p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recs.map((r) => (
            <Card key={r.studentId}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {r.studentName ? r.studentName[0] : 'S'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{r.studentName}</h4>
                    <span className="text-xs text-muted">Readiness: {r.readiness}%</span>
                  </div>
                </div>
                <Badge variant={r.readiness >= 75 ? 'success' : r.readiness >= 55 ? 'warning' : 'danger'}>
                  {r.readiness >= 75 ? 'Advanced Coaching' : r.readiness >= 55 ? 'Framework Building' : 'Foundations Priority'}
                </Badge>
              </div>

              <div
                style={{
                  marginTop: '14px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Sparkles size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, color: 'var(--text-main)' }}>{r.recommendation}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorRecommendationsPage;