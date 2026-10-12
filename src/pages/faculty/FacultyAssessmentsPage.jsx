import React, { useState, useEffect } from 'react';
import { Plus, Award, Calendar, BookOpen } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';

export const FacultyAssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Core Java');
  const [duration, setDuration] = useState(30);
  const [totalMarks, setTotalMarks] = useState(100);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = () => {
    setLoading(true);
    api.get('/faculty/assessments')
      .then((res) => setAssessments(res?.data || res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    api.post('/faculty/assessments', {
      title: title.trim(),
      topic,
      durationMinutes: duration,
      totalMarks,
      description,
    })
      .then(() => {
        setShowModal(false);
        setTitle('');
        setDescription('');
        fetchAssessments();
      })
      .catch((err) => alert(err.message || 'Failed to create assessment'))
      .finally(() => setSaving(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Placement Assessments & Quizzes</h2>
          <p className="text-sm text-muted">
            Create, publish, and track department benchmarks in Core Java, Algorithms, System Design, and Aptitude.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Create Assessment
        </Button>
      </div>

      <Card>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : assessments.length === 0 ? (
          <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '36px' }}>No assessments created yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assessment Title</th>
                  <th>Topic</th>
                  <th>Duration</th>
                  <th>Total Marks</th>
                  <th>Students Taken</th>
                  <th>Average Score</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{a.title}</span>
                      {a.description && <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>{a.description}</p>}
                    </td>
                    <td><Badge variant="primary">{a.topic}</Badge></td>
                    <td>{a.durationMinutes} mins</td>
                    <td>{a.totalMarks} pts</td>
                    <td><strong>{a.studentsTaken}</strong> students</td>
                    <td><span className="font-semibold text-sm">{a.avgScore}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxWidth: '520px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px' }}>Create New Placement Assessment</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Title</label>
                <input className="form-input" placeholder="e.g. Java Concurrency & JVM Benchmark" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Topic</label>
                  <input className="form-input" placeholder="Topic name" value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Duration (Mins)</label>
                  <input type="number" className="form-input" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea className="form-input" rows={3} placeholder="Assessment syllabus, focus areas, and instructions..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Publish Assessment'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAssessmentsPage;