import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, ArrowUpRight, Award, AlertTriangle, ExternalLink } from 'lucide-react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ProgressBar from '../../components/ProgressBar';
import api from '../../services/api';

export const MentorMenteesPage = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentees();
  }, []);

  const fetchMentees = () => {
    setLoading(true);
    api.get('/mentor/mentees')
      .then((res) => {
        setMentees(res?.data || res || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const filtered = mentees.filter((m) => {
    const matchesSearch =
      (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.rollNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || (m.departmentCode || m.department || '').includes(deptFilter);
    return matchesSearch && matchesDept;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Assigned Students Directory</h2>
          <p className="text-sm text-muted">
            All students mapped to your mentorship. Click any student to review their complete profile and performance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            className="form-input"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="DS">Data Science</option>
          </select>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: '16px', maxWidth: '400px' }}>
          <Input
            placeholder="Search by student name, roll number, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: '64px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px' }}>
            <Users size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h4>No students found</h4>
            <p className="text-sm text-muted">Try adjusting your search query or department filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll / Dept</th>
                  <th>CGPA</th>
                  <th>Readiness Score</th>
                  <th>Risk Status</th>
                  <th>Roadmap Progress</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const riskVariant = m.riskBadge === 'LOW' ? 'success' : m.riskBadge === 'MEDIUM' ? 'warning' : 'danger';
                  return (
                    <tr
                      key={m.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/mentor/students/${m.id}`)}
                    >
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>
                            {m.name}
                          </span>
                          <span className="text-xs text-muted">{m.email}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="text-xs font-semibold">{m.rollNumber}</span>
                          <span className="text-xs text-muted">{m.department}</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold text-sm">{m.cgpa ?? 'N/A'}</span>
                      </td>
                      <td style={{ minWidth: '140px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="text-xs font-semibold">{m.readiness}%</span>
                          <ProgressBar value={m.readiness} />
                        </div>
                      </td>
                      <td>
                        <Badge variant={riskVariant}>{m.riskBadge}</Badge>
                      </td>
                      <td>
                        <span className="text-xs text-secondary">{m.roadmapStatus}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={ArrowUpRight}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/mentor/students/${m.id}`);
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

export default MentorMenteesPage;