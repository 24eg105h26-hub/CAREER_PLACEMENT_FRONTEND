import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, CheckCircle, Cpu, RefreshCw, Zap } from 'lucide-react';
import Card, { StatCard } from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import api from '../../services/api';

export const AdminAiUsagePage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/ai-logs');
      setLogs(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load AI usage logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalPromptTokens = logs.reduce((acc, curr) => acc + (curr.promptTokens || 0), 0);
  const totalCompletionTokens = logs.reduce((acc, curr) => acc + (curr.completionTokens || 0), 0);
  const totalTokens = totalPromptTokens + totalCompletionTokens;
  const avgLatency = logs.length > 0
    ? Math.round(logs.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) / logs.length)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>AI Model & Token Consumption Analytics</h2>
          <p className="text-sm text-muted">Audited consumption tracking for Gemini 2.5 Flash & LLM inference pipelines</p>
        </div>
        <Button variant="secondary" icon={RefreshCw} onClick={fetchLogs}>Refresh</Button>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
        <StatCard title="Total AI Requests" value={logs.length} icon={Sparkles} />
        <StatCard title="Total Tokens Consumed" value={totalTokens.toLocaleString()} icon={Cpu} />
        <StatCard title="Average Latency" value={`${avgLatency} ms`} icon={Activity} />
        <StatCard title="Model Engine" value="Gemini Flash" icon={Zap} />
      </div>

      <Card title="Live AI API Invocations" subtitle="Audit records captured across all student, mentor and resume evaluation workflows">
        <DataTable
          columns={[
            {
              header: 'Feature',
              key: 'feature',
              render: (_, row) => (
                <div style={{ fontWeight: 600 }}>{row.feature || row.featureName || 'AI Intelligence'}</div>
              ),
            },
            {
              header: 'Model Engine',
              key: 'model',
              render: (val) => <Badge variant="secondary">{val || 'gemini-2.5-flash'}</Badge>,
            },
            {
              header: 'Tokens (Prompt / Compl)',
              key: 'tokens',
              render: (_, row) => (
                <span className="text-sm">
                  {row.promptTokens || 0} / {row.completionTokens || 0}
                </span>
              ),
            },
            {
              header: 'Latency',
              key: 'latencyMs',
              render: (val) => <span className="text-sm text-muted">{val ? `${val}ms` : '< 1s'}</span>,
            },
            {
              header: 'Status',
              key: 'status',
              render: (val) => <Badge variant={val === 'SUCCESS' ? 'success' : 'primary'}>{val || 'SUCCESS'}</Badge>,
            },
            {
              header: 'Timestamp',
              key: 'createdAt',
              render: (val) => <span className="text-sm text-muted">{val ? new Date(val).toLocaleTimeString() : 'Recent'}</span>,
            },
          ]}
          data={logs}
          loading={loading}
          emptyMessage="No AI invocations recorded yet. Invocations from mock interview, study buddy, and resume analysis will appear here."
        />
      </Card>
    </div>
  );
};

export default AdminAiUsagePage;
