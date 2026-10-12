import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, User } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import api from '../../services/api';

export const MentorFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [category, setCategory] = useState('MOCK_INTERVIEW');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('/mentor/feedback'), api.get('/mentor/mentees')])
      .then(([fbRes, menteesRes]) => {
        setFeedbackList(fbRes?.data || fbRes || []);
        const m = menteesRes?.data || menteesRes || [];
        setMentees(m);
        if (m.length > 0 && !selectedStudent) {
          setSelectedStudent(m[0].id.toString());
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSaveFeedback = (e) => {
    e.preventDefault();
    if (!comment.trim() || !selectedStudent) return;

    setSaving(true);
    api.post('/mentor/feedback', {
      studentId: selectedStudent,
      comment: comment.trim(),
      category: category,
    })
      .then(() => {
        setComment('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
        loadData();
      })
      .catch((err) => alert(err.message || 'Failed to submit feedback'))
      .finally(() => setSaving(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Student Feedback Management</h2>
        <p className="text-sm text-muted">
          Write and review comprehensive feedback for your assigned mentees. Saving feedback immediately notifies the student.
        </p>
      </div>

      {/* Form Card */}
      <Card title="Write Student Feedback">
        <form onSubmit={handleSaveFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>
                Select Student
              </label>
              <select
                className="form-input"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                style={{ width: '100%' }}
                required
              >
                {mentees.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.rollNumber} - {m.department})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>
                Feedback Category
              </label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="MOCK_INTERVIEW">Mock Interview Review</option>
                <option value="RESUME_REVIEW">Resume & ATS Advice</option>
                <option value="CAREER_GUIDANCE">Career & Roadmap Guidance</option>
                <option value="EARLY_WARNING">Early Warning / Academic Radar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>
              Feedback Comments & Recommendations
            </label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Detail strengths, technical areas for revision, architecture trade-offs, or preparation roadmaps..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {success && (
              <span className="text-xs font-semibold text-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={16} /> Feedback successfully saved and notification sent to student!
              </span>
            )}
            <div style={{ marginLeft: 'auto' }}>
              <Button type="submit" disabled={saving} icon={Send}>
                {saving ? 'Saving...' : 'Save Feedback'}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* History Card */}
      <Card title="Past Feedback Given">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : feedbackList.length === 0 ? (
          <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '24px' }}>No feedback records found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {feedbackList.map((fb) => (
              <div
                key={fb.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="font-semibold text-sm">{fb.studentName}</span>
                  <Badge variant={fb.category === 'EARLY_WARNING' ? 'danger' : 'primary'}>{fb.category}</Badge>
                </div>
                <p className="text-sm text-secondary" style={{ margin: 0, lineHeight: 1.5 }}>
                  "{fb.comment}"
                </p>
                {fb.createdAt && (
                  <span className="text-xs text-muted" style={{ display: 'block', marginTop: '6px' }}>
                    {fb.createdAt.substring(0, 10)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MentorFeedbackPage;