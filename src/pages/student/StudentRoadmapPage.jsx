import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';
import { BookOpen, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import api from '../../services/api';

export const StudentRoadmapPage = () => {
  const [targetRole, setTargetRole] = useState('Senior Java Backend Engineer');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = () => {
    setLoading(true);
    api.get('/students/roadmap')
      .then((res) => {
        const data = res?.data || res || {};
        if (data.targetRole) setTargetRole(data.targetRole);
        setItems(data.items || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const toggleItem = (id, currentStatus) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    api.put(`/students/roadmap/items/${id}/status?status=${nextStatus}`)
      .then(() => fetchRoadmap())
      .catch((err) => alert(err.message || 'Failed to update milestone status'));
  };

  const completedCount = items.filter((i) => i.status === 'COMPLETED').length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Skill Gap Analysis & Personalized Roadmap</h2>
          <p className="text-sm text-secondary">
            Week-by-week actionable roadmap targeting <strong>{targetRole}</strong>
          </p>
        </div>
        <Badge variant="primary">
          <Sparkles size={14} style={{ marginRight: '4px' }} /> AI Curated
        </Badge>
      </div>

      <Card title="Overall Roadmap Milestone Progress">
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>{completedCount} of {items.length} Milestones Completed</span>
            <span className="font-semibold">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} color="var(--primary)" />
        </div>
      </Card>

      <Card title="Actionable Roadmap Timeline">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '36px' }}>No roadmap items available.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {items.map((item) => {
              const isCompleted = item.status === 'COMPLETED';
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <CheckCircle2
                      size={24}
                      color={isCompleted ? 'var(--success)' : 'var(--text-muted)'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleItem(item.id, item.status)}
                    />
                    <div>
                      <h4 style={{ textDecoration: isCompleted ? 'line-through' : 'none', margin: 0 }}>
                        Week {item.weekNumber}: {item.topic}
                      </h4>
                      <p className="text-xs text-muted" style={{ marginTop: '4px', margin: 0 }}>
                        {item.description} • Priority: {item.priority}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isCompleted ? 'secondary' : 'primary'}
                    onClick={() => toggleItem(item.id, item.status)}
                  >
                    {isCompleted ? 'Mark In Progress' : 'Mark Complete'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentRoadmapPage;