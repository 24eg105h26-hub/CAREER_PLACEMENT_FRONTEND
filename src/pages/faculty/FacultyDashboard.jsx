import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Award, AlertTriangle, BookOpen, Plus, ArrowRight } from 'lucide-react';
import Card, { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import api from '../../services/api';

export const FacultyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/faculty/dashboard')
      .then((res) => setData(res?.data || res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }} />
        <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  const assignedCount = data?.assignedStudentsCount ?? 0;
  const avgCgpa = data?.averageCgpa ?? 0;
  const avgReadiness = data?.averageReadiness ?? 0;
  const atRiskCount = data?.atRiskCount ?? 0;
  const totalAssessments = data?.totalAssessments ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Faculty Academic & Placement Overview</h2>
          <p className="text-sm text-muted">
            {data?.facultyName} • {data?.designation} • {data?.department}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={AlertTriangle} onClick={() => navigate('/faculty/warnings')}>
            Review Early Warnings
          </Button>
          <Button icon={Users} onClick={() => navigate('/faculty/students')}>
            View Assigned Students
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
        <StatCard
          title="Assigned Students"
          value={assignedCount}
          icon={Users}
          description="Total students under academic supervision"
        />
        <StatCard
          title="Average CGPA"
          value={avgCgpa}
          icon={Award}
          trend={avgCgpa >= 8.0 ? 'Strong Academic Track' : 'Standard Cohort Track'}
          trendType={avgCgpa >= 8.0 ? 'positive' : 'warning'}
        />
        <StatCard
          title="Average Readiness"
          value={`${avgReadiness}%`}
          icon={BookOpen}
          trend={avgReadiness >= 70 ? 'Tier-1 Target Ready' : 'Foundational'}
          trendType={avgReadiness >= 70 ? 'positive' : 'warning'}
        />
        <StatCard
          title="At-Risk Academic Radar"
          value={atRiskCount}
          icon={AlertTriangle}
          trendType="negative"
          description="CGPA < 7.0 or low readiness"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        <Card title="Quick Academic Actions" subtitle="Assessment & student advisory tools">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h4 style={{ margin: 0 }}>Create Placement Assessment</h4>
                <p className="text-xs text-muted" style={{ margin: '4px 0 0' }}>
                  Schedule technical quizzes on Core Java, DSA, or Web Services
                </p>
              </div>
              <Button size="sm" icon={Plus} onClick={() => navigate('/faculty/assessments')}>
                New Assessment
              </Button>
            </div>

            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h4 style={{ margin: 0 }}>Early Warning Risk Radar</h4>
                <p className="text-xs text-muted" style={{ margin: '4px 0 0' }}>
                  {atRiskCount} student(s) currently need urgent academic counseling
                </p>
              </div>
              <Button size="sm" variant="outline" icon={ArrowRight} onClick={() => navigate('/faculty/warnings')}>
                View Warnings
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Assessment Overview" subtitle="Published quizzes & tests">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <p className="text-sm text-secondary">
              Total published assessments: <strong>{totalAssessments}</strong>
            </p>
            <p className="text-xs text-muted">
              Regular benchmarking enables campus placement algorithms to pair students with eligible company criteria.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button size="sm" variant="ghost" icon={ArrowRight} onClick={() => navigate('/faculty/assessments')}>
                Manage All Assessments
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;