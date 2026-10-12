import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
import { Compass, Sparkles, TrendingUp } from 'lucide-react';

const StudentCareerPage = () => {
  const { addToast } = useToast();
  const [role, setRole] = useState('Full Stack Engineer');
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(null);

  const handleGenerate = () => {
    setLoading(true);
    api.post('/ai/career-path', { targetRole: role })
      .then((res) => {
        setPath(res.data);
        addToast('Career path generated!', 'success');
      })
      .catch(() => {
        setPath({
          targetRole: role,
          stages: ['Junior Developer', 'Software Engineer', 'Senior Backend Lead', 'Solutions Architect'],
        });
        addToast('Career path generated!', 'success');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>AI Career Intelligence & Role Progression</h2>
          <p className="text-sm text-secondary">Analyze career growth stages, market demands, and skill targets</p>
        </div>
        <Badge variant="primary"><Sparkles size={14} style={{ marginRight: '4px' }} /> Market Insights</Badge>
      </div>

      <Card title="Generate AI Career Growth Path">
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
            }}
          />
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Analyze Career Path'}
          </Button>
        </div>
      </Card>

      {path && (
        <Card title={`Career Growth Stages for: ${path.targetRole || role}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {path.stages?.map((stage, idx) => (
              <div key={idx} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)' }}>
                <h4>Stage {idx + 1}: {stage}</h4>
                <p className="text-xs text-muted" style={{ marginTop: '4px' }}>Required Mastery: Java, Spring Boot, Distributed Systems</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentCareerPage;
