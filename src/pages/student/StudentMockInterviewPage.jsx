import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
import { Video, Sparkles, Send, Award, CheckCircle, AlertTriangle, ArrowRight, RotateCcw, Target, BookOpen } from 'lucide-react';

const ROLE_OPTIONS = [
  'Java Backend Developer',
  'Frontend React Developer',
  'Full Stack Developer',
  'HR & Behavioral',
];

const StudentMockInterviewPage = () => {
  const { addToast } = useToast();
  const [role, setRole] = useState('Java Backend Developer');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [type, setType] = useState('TECHNICAL');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleStart = () => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    api.post('/ai/interview/start', { targetRole: role, interviewType: type, difficulty })
      .then((res) => {
        const qList = res?.data?.questions || res?.questions || [
          'Explain Dependency Injection and Inversion of Control in Spring Boot.',
          'How does Garbage Collection work in Java, and what are G1 and ZGC?',
          'What is the difference between optimistic and pessimistic locking in JPA?',
        ];
        setQuestions(qList);
        addToast('Mock interview session started! Answer thoroughly for accurate scoring.', 'success');
      })
      .catch((err) => addToast(err.message || 'Failed to start interview', 'danger'))
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {
    // Validate if any answers have been entered
    const answerKeys = Object.keys(answers);
    const hasAnyAnswer = answerKeys.some((k) => (answers[k] || '').trim().length > 0);

    if (!hasAnyAnswer) {
      if (!window.confirm('You have not entered any answers. Submitting will result in a low evaluation score. Do you want to proceed?')) {
        return;
      }
    }

    setLoading(true);
    api.post('/ai/interview/answer', {
      role,
      difficulty,
      interviewType: type,
      questions,
      answers,
    })
      .then((res) => {
        const evalData = res?.data?.evaluation || res?.data || res;
        setResult(evalData);
        addToast('Interview successfully evaluated by AI!', 'success');
      })
      .catch((err) => addToast(err.message || 'Failed to evaluate interview', 'danger'))
      .finally(() => setLoading(false));
  };

  const handleReset = () => {
    setQuestions([]);
    setAnswers({});
    setResult(null);
  };

  const overallScore = result ? (result.score ?? result.overallScore ?? 0) : 0;
  const scoreColor = overallScore >= 75 ? 'var(--success)' : overallScore >= 50 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={24} color="var(--primary)" /> AI Technical Mock Interview Evaluator
          </h2>
          <p className="text-sm text-secondary" style={{ marginTop: '4px' }}>
            Real-time AI evaluation analyzing depth, architectural mechanisms, correctness, and communication
          </p>
        </div>
        <Badge variant="primary">
          <Sparkles size={14} style={{ marginRight: '4px' }} /> SmartPlacement AI
        </Badge>
      </div>

      {/* Step 1: Configuration */}
      {!questions.length && !result && (
        <Card title="Configure Your Mock Interview">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
            <div>
              <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '8px' }}>
                Target Role
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${role === r ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: role === r ? 'var(--primary)' : 'var(--bg-surface-hover)',
                      color: role === r ? '#fff' : 'var(--text-main)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <Input
                label="Or Custom Job Role"
                placeholder="e.g. Cloud DevOps Engineer, Data Engineer..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '8px' }}>
                  Interview Difficulty
                </label>
                <select
                  className="form-input"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="BEGINNER">Junior / Entry Level (Foundations)</option>
                  <option value="INTERMEDIATE">Intermediate (Core Concepts & Frameworks)</option>
                  <option value="ADVANCED">Senior (Architecture & Concurrency)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '8px' }}>
                  Round Category
                </label>
                <select
                  className="form-input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="TECHNICAL">Technical Architecture Round</option>
                  <option value="HR">HR / Managerial Round</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button onClick={handleStart} disabled={loading} icon={Sparkles}>
                {loading ? 'Generating Interview Questions...' : 'Start AI Mock Interview'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Answering Questions */}
      {questions.length > 0 && !result && (
        <Card title={`Mock Interview: ${role} (${difficulty})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
            <div style={{ background: 'var(--bg-surface-hover)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <strong>Evaluation Tip:</strong> High-scoring answers include: (1) Formal definition, (2) Internal mechanics/architecture, (3) Practical code or design example, and (4) Concurrency or performance trade-offs.
            </div>

            {questions.map((q, idx) => {
              const currentAns = answers[idx] || '';
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-main)', margin: 0 }}>
                      Question {idx + 1}: {q}
                    </p>
                    <span className="text-xs text-muted">
                      {currentAns.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Provide a comprehensive technical response with architectural details, key annotations/classes, and design trade-offs..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      resize: 'vertical',
                    }}
                    value={currentAns}
                    onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                  />
                </div>
              );
            })}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <Button variant="outline" onClick={handleReset} disabled={loading}>
                Cancel & Exit
              </Button>
              <Button onClick={handleSubmit} disabled={loading} icon={Send}>
                {loading ? 'Evaluating Answers with AI...' : 'Submit Interview for AI Evaluation'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Evaluation Report */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Score Banner */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="text-xs font-semibold uppercase text-muted">Overall AI Evaluation</span>
                <h1 style={{ fontSize: '36px', color: scoreColor, margin: '4px 0' }}>
                  {overallScore} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/ 100</span>
                </h1>
                <p className="text-sm font-semibold" style={{ color: scoreColor, margin: 0 }}>
                  {overallScore >= 75 ? 'Placement Ready - Strong Performance' : overallScore >= 50 ? 'Moderate - Foundational Knowledge Present' : 'Needs Significant Revision - Brief or Incomplete Answers'}
                </p>
              </div>

              <Button onClick={handleReset} icon={RotateCcw} variant="outline">
                Take Another Interview
              </Button>
            </div>

            {/* Metric Bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Correctness</span>
                  <strong>{result.correctness ?? overallScore}%</strong>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${result.correctness ?? overallScore}%`, height: '100%', background: 'var(--primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Technical Knowledge</span>
                  <strong>{result.technicalKnowledge ?? overallScore}%</strong>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${result.technicalKnowledge ?? overallScore}%`, height: '100%', background: 'var(--info)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Communication</span>
                  <strong>{result.communication ?? overallScore}%</strong>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${result.communication ?? overallScore}%`, height: '100%', background: 'var(--success)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Completeness</span>
                  <strong>{result.completeness ?? overallScore}%</strong>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${result.completeness ?? overallScore}%`, height: '100%', background: 'var(--warning)' }} />
                </div>
              </div>
            </div>

            {/* Overall Feedback */}
            <div style={{ marginTop: '20px', padding: '14px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Interviewer Executive Summary:</strong>
              <p className="text-sm" style={{ margin: 0, color: 'var(--text-main)', lineHeight: '1.6' }}>
                {result.feedback}
              </p>
            </div>
          </Card>

          {/* Strengths & Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Strengths */}
            <Card title="Demonstrated Strengths">
              <ul style={{ paddingLeft: '18px', margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(result.strengths && result.strengths.length > 0 ? result.strengths : ['Completed all interview questions under simulated pressure']).map((s, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'var(--text-main)' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> {s}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Areas for Improvement */}
            <Card title="Key Areas for Improvement">
              <ul style={{ paddingLeft: '18px', margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(result.recommendations && result.recommendations.length > 0 ? result.recommendations : ['Practice explaining internal framework lifecycles and concurrency handling']).map((r, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'var(--text-main)' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>→</span> {r}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Per-Question Detailed Breakdown */}
          {result.perQuestionFeedback && result.perQuestionFeedback.length > 0 && (
            <Card title="Detailed Per-Question Feedback">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                {result.perQuestionFeedback.map((qf, idx) => {
                  const qScore = qf.score ?? 0;
                  const qScoreColor = qScore >= 75 ? 'var(--success)' : qScore >= 50 ? 'var(--warning)' : 'var(--danger)';
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface-hover)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="font-semibold text-sm">
                          Question {qf.questionNumber || idx + 1}: {qf.question || questions[idx]}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            color: '#fff',
                            background: qScoreColor,
                          }}
                        >
                          Score: {qScore}/100
                        </span>
                      </div>

                      {qf.candidateAnswer && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                          <strong>Your Answer:</strong> {qf.candidateAnswer}
                        </div>
                      )}

                      <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '4px' }}>
                        <strong>Feedback:</strong> {qf.feedback}
                      </div>

                      {qf.suggestion && (
                        <div style={{ fontSize: '12px', color: 'var(--primary)' }}>
                          <strong>Recommended Improvement:</strong> {qf.suggestion}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
            <Button onClick={handleReset} icon={RotateCcw}>
              Start New Mock Interview Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMockInterviewPage;
