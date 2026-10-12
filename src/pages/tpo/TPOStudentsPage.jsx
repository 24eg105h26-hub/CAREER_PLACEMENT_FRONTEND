import React, { useState, useEffect } from 'react';
import { Search, Users, Filter } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';

export const TPOStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minCgpa, setMinCgpa] = useState(6.0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEligible();
  }, [minCgpa]);

  const fetchEligible = () => {
    setLoading(true);
    api.get(`/tpo/eligible-students?minCgpa=${minCgpa}`)
      .then((res) => setStudents(res?.data || res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const filtered = students.filter((s) =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Eligible Students Computation Directory</h2>
          <p className="text-sm text-muted">Compute student eligibility across cutoff criteria and export drive rosters.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label className="text-xs font-semibold text-muted">Min CGPA Threshold:</label>
          <select className="form-input" value={minCgpa} onChange={(e) => setMinCgpa(Number(e.target.value))} style={{ width: '110px' }}>
            <option value="6.0">6.0+</option>
            <option value="7.0">7.0+</option>
            <option value="7.5">7.5+</option>
            <option value="8.0">8.0+</option>
            <option value="8.5">8.5+</option>
          </select>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: '16px', maxWidth: '400px' }}>
          <Input placeholder="Search eligible students..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} />
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '36px' }}>No students meet the current criteria.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Department</th>
                  <th>CGPA</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td><span className="font-semibold text-sm">{s.name}</span></td>
                    <td>{s.rollNumber}</td>
                    <td>{s.department}</td>
                    <td><strong>{s.cgpa}</strong></td>
                    <td className="text-muted">{s.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TPOStudentsPage;