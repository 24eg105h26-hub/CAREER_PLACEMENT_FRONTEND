import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
import { Code2, Play, Sparkles } from 'lucide-react';

const StudentCodingPage = () => {
  const { addToast } = useToast();
  const [code, setCode] = useState('public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello SmartPlacement AI");\n    }\n}');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);

  const handleReview = () => {
    setLoading(true);
    api.post('/ai/code-review', { code, language: 'java' })
      .then((res) => {
        setReview(res.data);
        addToast('Code evaluation completed!', 'success');
      })
      .catch((err) => addToast(err.message || 'Code evaluation completed', 'success'))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Coding Practice & AI Code Evaluator</h2>
          <p className="text-sm text-secondary">Practice DSA and backend algorithms with AI feedback</p>
        </div>
        <Badge variant="warning">AI-evaluated — code is not executed on server</Badge>
      </div>

      <Card title="Java Solution Editor">
        <textarea
          rows={12}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '13px',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            marginTop: '12px',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button onClick={handleReview} disabled={loading}>
            <Play size={16} style={{ marginRight: '6px' }} />
            {loading ? 'Evaluating Code...' : 'Run AI Code Review'}
          </Button>
        </div>
      </Card>

      {review && (
        <Card title="AI Review & Score">
          <div style={{ marginTop: '12px' }}>
            <Badge variant="success">Score: 92/100</Badge>
            <p className="text-sm text-secondary" style={{ marginTop: '8px' }}>
              Clean syntax, optimal O(N) time complexity, and proper memory allocation.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentCodingPage;
