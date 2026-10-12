import React from 'react';
import Button from '../../components/Button';
import Card, { StatCard } from '../../components/Card';
import Badge, { SkillBadge } from '../../components/Badge';
import ProgressBar, { ProgressRing } from '../../components/ProgressBar';
import Input, { Select } from '../../components/Input';
import ApplicationPipeline from '../../components/ApplicationPipeline';
import DataTable from '../../components/DataTable';
import { Users, Sparkles, Award } from 'lucide-react';

export const DesignSystemPreview = () => {
  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>SmartPlacement AI Design System</h1>
      <p className="text-muted" style={{ marginBottom: '32px' }}>
        Tokenized Design Tokens, Components, and States preview.
      </p>

      {/* Buttons */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Action</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" icon={Sparkles}>With Icon</Button>
        </div>
      </section>

      {/* Badges */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Badges & Skill Badges</h2>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="primary">Primary</Badge>
          <SkillBadge skill="Java" matched={true} />
          <SkillBadge skill="Docker" matched={false} />
          <SkillBadge skill="Kubernetes" matched={false} preferred={true} />
        </div>
      </section>

      {/* Stat Cards */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Stat Cards & Progress Rings</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <StatCard title="Applications Sent" value="12" icon={Users} trend={{ type: 'up', label: '+15% vs last month' }} />
          <StatCard title="Total Placements" value="48" icon={Award} trend={{ type: 'up', label: '82% rate' }} />
          <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProgressRing progress={82} label="Readiness Score" />
          </Card>
        </div>
      </section>

      {/* Pipeline */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Application Pipeline</h2>
        <Card style={{ marginTop: '16px' }}>
          <ApplicationPipeline status="INTERVIEW" />
        </Card>
      </section>

      {/* Data Table */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Data Table</h2>
        <DataTable
          columns={[
            { header: 'Student', key: 'name' },
            { header: 'Department', key: 'dept' },
            { header: 'CGPA', key: 'cgpa' },
            { header: 'Status', key: 'status', render: (val) => <Badge variant="success">{val}</Badge> },
          ]}
          data={[
            { id: 1, name: 'Alex Chen', dept: 'CSE', cgpa: '8.80', status: 'SELECTED' },
            { id: 2, name: 'Sarah Miller', dept: 'IT', cgpa: '9.10', status: 'SHORTLISTED' },
          ]}
        />
      </section>
    </div>
  );
};

export default DesignSystemPreview;
