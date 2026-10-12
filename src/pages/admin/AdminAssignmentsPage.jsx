import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Search, RefreshCw, Award, BookOpen } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import api from '../../services/api';

export const AdminAssignmentsPage = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    studentId: '',
    staffId: '',
    type: 'MENTOR',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignRes, usersRes] = await Promise.all([
        api.get('/admin/assignments'),
        api.get('/admin/users')
      ]);
      setAssignments(assignRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load assignments:', err);
      showToast('Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const students = users.filter((u) => u.role === 'STUDENT');
  const staff = users.filter((u) => form.type === 'MENTOR' ? u.role === 'MENTOR' : u.role === 'FACULTY');

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.staffId) {
      showToast('Please select both a student and an advisor', 'error');
      return;
    }
    try {
      await api.post('/admin/assignments', form);
      showToast('Student advisory assignment updated successfully', 'success');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update assignment', 'error');
    }
  };

  const filtered = assignments.filter((a) =>
    a.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    a.studentEmail?.toLowerCase().includes(search.toLowerCase()) ||
    a.assignedMentor?.toLowerCase().includes(search.toLowerCase()) ||
    a.assignedFaculty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Student Faculty & Mentor Assignments</h2>
          <p className="text-sm text-muted">Govern academic mentorship mappings and departmental faculty advisors</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchData}>Refresh</Button>
          <Button variant="primary" icon={UserCheck} onClick={() => setModalOpen(true)}>Assign Student</Button>
        </div>
      </div>

      <Card>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: '6px' }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search student by name, email, or assigned advisor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        <DataTable
          columns={[
            {
              header: 'Student',
              key: 'studentName',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 600 }}>{row.studentName}</div>
                  <div className="text-xs text-muted">{row.studentEmail}</div>
                </div>
              ),
            },
            {
              header: 'Department',
              key: 'department',
              render: (val) => val || 'Computer Science',
            },
            {
              header: 'Assigned Mentor',
              key: 'assignedMentor',
              render: (val) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={14} color="var(--primary)" />
                  <span style={{ fontWeight: val ? 600 : 400, color: val ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {val || 'None Assigned'}
                  </span>
                </div>
              ),
            },
            {
              header: 'Assigned Faculty',
              key: 'assignedFaculty',
              render: (val) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={14} color="var(--secondary)" />
                  <span style={{ fontWeight: val ? 600 : 400, color: val ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {val || 'None Assigned'}
                  </span>
                </div>
              ),
            },
            {
              header: 'Readiness Index',
              key: 'readinessScore',
              render: (val) => (
                <Badge variant={val >= 70 ? 'success' : val >= 50 ? 'warning' : 'danger'}>
                  {val ?? 0}%
                </Badge>
              ),
            },
          ]}
          data={filtered}
          loading={loading}
          emptyMessage="No student advisory mappings found."
        />
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Assign Student to Advisor">
        <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Assignment Type *</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value, staffId: '' })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            >
              <option value="MENTOR">Career Mentor (Placement Coaching)</option>
              <option value="FACULTY">Faculty Advisor (Academic Evaluation)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Select Student *</label>
            <select
              required
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            >
              <option value="">-- Choose a Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>
              Select {form.type === 'MENTOR' ? 'Mentor' : 'Faculty Member'} *
            </label>
            <select
              required
              value={form.staffId}
              onChange={(e) => setForm({ ...form, staffId: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            >
              <option value="">-- Choose Advisor --</option>
              {staff.map((st) => (
                <option key={st.id} value={st.id}>{st.fullName} ({st.email})</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Confirm Assignment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAssignmentsPage;
