import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowUpRight, ShieldAlert } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import api from '../../services/api';

export const FacultyEarlyWarningsPage = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/faculty/warnings')
      .then((res) => setWarnings(res?.data || res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Early Warning Academic Radar</h2>
        <p className="text-sm text-muted">
          Diagnostic list of students requiring urgent academic revision, backlog clearance, or placement guidance.
        </p>
      </div>

      <Card>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : warnings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px' }}>
            <p className="text-sm text-muted">All assigned students are currently above academic thresholds!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {warnings.map((w) => {
              const isCritical = w.riskLevel === 'CRITICAL';
              return (
                <div
                  key={w.studentId}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isCritical ? 'var(--danger)' : 'var(--warning)'}`,
                    background: 'var(--bg-surface-hover)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <AlertTriangle color={isCritical ? 'var(--danger)' : 'var(--warning)'} size={24} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>
                          {w.name}
                        </span>
                        <span className="text-xs text-muted">({w.rollNumber} - {w.department})</span>
                        <Badge variant={isCritical ? 'danger' : 'warning'}>{w.riskLevel}</Badge>
                      </div>
                      <p className="text-xs text-secondary" style={{ margin: '4px 0 0' }}>
                        <strong>Diagnostic Reason:</strong> {w.reason}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span className="text-xs text-muted">CGPA: {w.cgpa}</span>
                      <span className="text-xs text-muted" style={{ display: 'block' }}>Readiness: {w.readiness}%</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={ArrowUpRight}
                      onClick={() => navigate(`/faculty/students/${w.studentId}`)}
                    >
                      Counsel Student
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default FacultyEarlyWarningsPage;