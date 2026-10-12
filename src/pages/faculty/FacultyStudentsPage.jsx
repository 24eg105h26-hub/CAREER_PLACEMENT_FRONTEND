import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpRight, Users } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ProgressBar from '../../components/ProgressBar';
import api from '../../services/api';

export const FacultyStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/faculty/students')
      .then((res) => setStudents(res?.data || res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Assigned Students Directory</h2>
          <p className="text-sm text-muted">
            Students assigned to you for academic mentoring and placement clearance.
          </p>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: '16px', maxWidth: '400px' }}>
          <Input
            placeholder="Search by student name, roll number, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px' }}>
            <p className="text-sm text-muted">No students found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll / Department</th>
                  <th>CGPA</th>
                  <th>Placement Readiness</th>
                  <th>Risk Level</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const riskVariant = s.riskLevel === 'LOW' ? 'success' : s.riskLevel === 'MEDIUM' ? 'warning' : 'danger';
                  return (
                    <tr
                      key={s.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/faculty/students/${s.id}`)}
                    >
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{s.name}</span>
                          <span className="text-xs text-muted">{s.email}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="text-xs font-semibold">{s.rollNumber}</span>
                          <span className="text-xs text-muted">{s.department}</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold text-sm">{s.cgpa ?? 'N/A'}</span>
                      </td>
                      <td style={{ minWidth: '140px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="text-xs font-semibold">{s.readiness}%</span>
                          <ProgressBar value={s.readiness} />
                        </div>
                      </td>
                      <td>
                        <Badge variant={riskVariant}>{s.riskLevel}</Badge>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={ArrowUpRight}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/faculty/students/${s.id}`);
                          }}
                        >
                          View Detail
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FacultyStudentsPage;