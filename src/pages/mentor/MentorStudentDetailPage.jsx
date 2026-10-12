import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, ArrowLeft, BookOpen, Award, Layers, MessageSquare, Video, CheckCircle2, AlertTriangle, Send, Sparkles, ExternalLink
} from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Tabs from '../../components/Tabs';
import ProgressBar from '../../components/ProgressBar';
import api from '../../services/api';

export const MentorStudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Feedback form state
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('MOCK_INTERVIEW');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = () => {
    setLoading(true);
    api.get(`/mentor/students/${id}`)
      .then((res) => {
        setStudent(res?.data || res);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Access Denied: Student is not assigned to you');
      })
      .finally(() => setLoading(false));
  };

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingFeedback(true);
    api.post('/mentor/feedback', {
      studentId: id,
      comment: comment.trim(),
      category: category,
    })
      .then(() => {
        setComment('');
        setFeedbackSuccess(true);
        setTimeout(() => setFeedbackSuccess(false), 4000);
        fetchStudent();
      })
      .catch((err) => alert(err.message || 'Failed to submit feedback'))
      .finally(() => setSubmittingFeedback(false));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="skeleton" style={{ height: '48px', width: '160px', borderRadius: 'var(--radius-md)' }} />
        <div className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton" style={{ height: '360px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '48px 16px' }}>
          <AlertTriangle size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
          <h3>Access Restricted</h3>
          <p className="text-sm text-muted" style={{ margin: '8px 0 20px' }}>{error}</p>
          <Button icon={ArrowLeft} onClick={() => navigate('/mentor/mentees')}>
            Back to Assigned Students
          </Button>
        </div>
      </Card>
    );
  }

  if (!student) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: `Skills & Gaps (${student.skills?.length || 0})` },
    { id: 'roadmap', label: `Learning Progress (${student.roadmapItems?.length || 0})` },
    { id: 'applications', label: `Applications (${student.applications?.length || 0})` },
    { id: 'assessments', label: `Assessments (${student.assessmentScores?.length || 0})` },
    { id: 'feedback', label: `Feedback History (${student.feedbackHistory?.length || 0})` },
  ];

  const riskColor = student.riskBadge === 'LOW' ? 'var(--success)' : student.riskBadge === 'MEDIUM' ? 'var(--warning)' : 'var(--danger)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Navigation */}
      <div>
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/mentor/mentees')}>
          Back to My Students
        </Button>
      </div>

      {/* Header Profile Card */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {student.name ? student.name[0] : 'S'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0 }}>{student.name}</h2>
                <Badge variant={student.riskBadge === 'LOW' ? 'success' : student.riskBadge === 'MEDIUM' ? 'warning' : 'danger'}>
                  {student.riskBadge} RISK
                </Badge>
              </div>
              <p className="text-sm text-muted" style={{ margin: '4px 0 0' }}>
                {student.rollNumber} • {student.department} • CGPA: {student.cgpa}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <span className="text-xs uppercase text-muted font-semibold">Placement Readiness</span>
              <h3 style={{ margin: '2px 0 0', color: riskColor }}>{student.readiness}%</h3>
            </div>
          </div>
        </div>
      </Card>

      {/* Detail Tabs */}
      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div style={{ marginTop: '24px' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div>
                  <h4 style={{ marginBottom: '8px' }}>Student Profile</h4>
                  <p className="text-sm text-secondary" style={{ lineHeight: 1.6 }}>
                    {student.bio || 'No personal bio added.'}
                  </p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '8px' }}>Contact & Links</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <p className="text-sm"><strong>Email:</strong> {student.email}</p>
                    <p className="text-sm"><strong>Target Role:</strong> {student.targetRole || 'Software Engineer'}</p>
                    {student.githubUrl && (
                      <p className="text-sm"><strong>GitHub:</strong> <a href={student.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{student.githubUrl}</a></p>
                    )}
                    {student.linkedinUrl && (
                      <p className="text-sm"><strong>LinkedIn:</strong> <a href={student.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{student.linkedinUrl}</a></p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS & GAPS */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4>Verified Skills & Technical Competencies</h4>
              {(!student.skills || student.skills.length === 0) ? (
                <p className="text-sm text-muted">No skills logged yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                  {student.skills.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface-hover)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{s.name}</span>
                        <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>{s.category}</p>
                      </div>
                      <Badge variant={s.verified ? 'success' : 'neutral'}>
                        {s.proficiency}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LEARNING PROGRESS & ROADMAP */}
          {activeTab === 'roadmap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Milestone Learning Roadmap ({student.targetRole})</h4>
              </div>
              {(!student.roadmapItems || student.roadmapItems.length === 0) ? (
                <p className="text-sm text-muted">No roadmap items generated yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {student.roadmapItems.map((item) => {
                    const isCompleted = item.status === 'COMPLETED';
                    const isInProgress = item.status === 'IN_PROGRESS';
                    return (
                      <div
                        key={item.id}
                        style={{
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${isCompleted ? 'var(--success)' : 'var(--border-color)'}`,
                          background: 'var(--bg-surface-hover)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="text-xs font-bold text-primary">WEEK {item.weekNumber}</span>
                            <span className="font-semibold text-sm">{item.topic}</span>
                          </div>
                          <p className="text-xs text-muted" style={{ margin: '4px 0 0' }}>{item.description}</p>
                        </div>
                        <Badge variant={isCompleted ? 'success' : isInProgress ? 'primary' : 'neutral'}>
                          {item.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4>Placement Applications History</h4>
              {(!student.applications || student.applications.length === 0) ? (
                <p className="text-sm text-muted">No applications submitted yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Match Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.applications.map((a) => (
                        <tr key={a.id}>
                          <td className="font-semibold text-sm">{a.jobTitle}</td>
                          <td>{a.companyName}</td>
                          <td><span className="font-semibold">{a.matchScore}%</span></td>
                          <td>
                            <Badge variant={a.status === 'SELECTED' ? 'success' : a.status === 'SHORTLISTED' ? 'primary' : a.status === 'REJECTED' ? 'danger' : 'neutral'}>
                              {a.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ASSESSMENTS */}
          {activeTab === 'assessments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4>Quiz & Assessment Scores</h4>
              {(!student.assessmentScores || student.assessmentScores.length === 0) ? (
                <p className="text-sm text-muted">No assessments recorded yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                  {student.assessmentScores.map((sc) => (
                    <div
                      key={sc.id}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface-hover)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="font-semibold text-sm">{sc.assessmentTitle}</span>
                        <Badge variant={sc.passed ? 'success' : 'danger'}>
                          {sc.passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                      </div>
                      <h3 style={{ margin: '12px 0 4px', color: sc.passed ? 'var(--success)' : 'var(--danger)' }}>
                        {sc.percentageScore}%
                      </h3>
                      <p className="text-xs text-muted" style={{ margin: 0 }}>
                        Score: {sc.scoreObtained} / {sc.totalMarks} • Topic: {sc.topic}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: FEEDBACK HISTORY & SUBMIT FORM */}
          {activeTab === 'feedback' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Form */}
              <form onSubmit={handleSendFeedback} style={{ background: 'var(--bg-surface-hover)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 12px' }}>Add Mentoring Feedback for {student.name}</h4>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <select
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '220px' }}
                  >
                    <option value="MOCK_INTERVIEW">Mock Interview Review</option>
                    <option value="RESUME_REVIEW">Resume / ATS Feedback</option>
                    <option value="CAREER_GUIDANCE">Career & Roadmaps</option>
                    <option value="EARLY_WARNING">Early Warning / Action Required</option>
                  </select>
                </div>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Write clear, actionable senior feedback on technical mechanics, areas for improvement, or next steps..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', marginBottom: '12px' }}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {feedbackSuccess && (
                    <span className="text-xs font-semibold text-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Feedback saved and notification sent to student!
                    </span>
                  )}
                  <div style={{ marginLeft: 'auto' }}>
                    <Button type="submit" disabled={submittingFeedback} icon={Send}>
                      {submittingFeedback ? 'Saving...' : 'Save Feedback'}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Past Feedback List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4>Past Feedback Logs</h4>
                {(!student.feedbackHistory || student.feedbackHistory.length === 0) ? (
                  <p className="text-sm text-muted">No past feedback records found.</p>
                ) : (
                  student.feedbackHistory.map((fb) => (
                    <div
                      key={fb.id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="font-semibold text-sm">{fb.authorName}</span>
                        <Badge variant="primary">{fb.category}</Badge>
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
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MentorStudentDetailPage;