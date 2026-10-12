import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, BookOpen, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Tabs from '../../components/Tabs';
import api from '../../services/api';

export const FacultyStudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = () => {
    setLoading(true);
    api.get(`/faculty/students/${id}`)
      .then((res) => {
        setStudent(res?.data || res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Access Denied'))
      .finally(() => setLoading(false));
  };

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSaving(true);
    api.post('/faculty/feedback', {
      studentId: id,
      comment: comment.trim(),
      category: 'ACADEMIC',
    })
      .then(() => {
        setComment('');
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
        fetchStudent();
      })
      .catch((err) => alert(err.message || 'Failed to submit feedback'))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="skeleton" style={{ height: '48px', width: '160px', borderRadius: 'var(--radius-md)' }} />
        <div className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (error || !student) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '48px 16px' }}>
          <AlertTriangle size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
          <h3>Access Restricted</h3>
          <p className="text-sm text-muted" style={{ margin: '8px 0 20px' }}>{error || 'Student not found'}</p>
          <Button icon={ArrowLeft} onClick={() => navigate('/faculty/students')}>
            Back to Assigned Students
          </Button>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview & Profile' },
    { id: 'skills', label: `Technical Skills (${student.skills?.length || 0})` },
    { id: 'assessments', label: `Assessment Results (${student.assessmentResults?.length || 0})` },
    { id: 'feedback', label: `Academic Advisory (${student.feedbackHistory?.length || 0})` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/faculty/students')}>
          Back to Students
        </Button>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0 }}>{student.name}</h2>
              <Badge variant={student.riskLevel === 'LOW' ? 'success' : student.riskLevel === 'MEDIUM' ? 'warning' : 'danger'}>
                {student.riskLevel} RISK
              </Badge>
            </div>
            <p className="text-sm text-muted" style={{ margin: '4px 0 0' }}>
              Roll: {student.rollNumber} • {student.department} • CGPA: {student.cgpa}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="text-xs uppercase text-muted font-semibold">Placement Readiness</span>
            <h3 style={{ margin: '2px 0 0', color: student.readiness >= 70 ? 'var(--success)' : 'var(--warning)' }}>
              {student.readiness}%
            </h3>
          </div>
        </div>
      </Card>

      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div style={{ marginTop: '24px' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4>Student Overview</h4>
              <p className="text-sm text-secondary"><strong>Email:</strong> {student.email}</p>
              <p className="text-sm text-secondary"><strong>Academic CGPA:</strong> {student.cgpa}</p>
              <p className="text-sm text-secondary"><strong>Department:</strong> {student.department}</p>
            </div>
          )}

          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4>Verified Skills</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                {student.skills?.map((s) => (
                  <div key={s.id} style={{ padding: '12px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="font-semibold text-sm">{s.name}</span>
                      <Badge variant="primary">{s.proficiency}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4>Quizzes & Test Results</h4>
              {student.assessmentResults?.length === 0 ? (
                <p className="text-sm text-muted">No test results found.</p>
              ) : (
                student.assessmentResults.map((r) => (
                  <div key={r.id} style={{ padding: '12px 16px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="font-semibold text-sm">{r.title}</span>
                      <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>Score: {r.scoreObtained} / {r.totalMarks} ({r.percentageScore}%)</p>
                    </div>
                    <Badge variant={r.passed ? 'success' : 'danger'}>
                      {r.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <form onSubmit={handleSendFeedback} style={{ padding: '16px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 10px' }}>Add Academic Advisory Note</h4>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Enter academic feedback or placement clearance guidance..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {savedSuccess && (
                    <span className="text-xs font-semibold text-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Advisory note saved and sent to student!
                    </span>
                  )}
                  <Button type="submit" disabled={saving} icon={Send} style={{ marginLeft: 'auto' }}>
                    {saving ? 'Saving...' : 'Save Feedback'}
                  </Button>
                </div>
              </form>

              <div>
                <h4>Past Academic Feedback</h4>
                {student.feedbackHistory?.map((f) => (
                  <div key={f.id} style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                    <span className="font-semibold text-sm">{f.authorName}</span>
                    <p className="text-sm text-secondary" style={{ margin: '4px 0 0' }}>"{f.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FacultyStudentDetailPage;