import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { useToast } from '../../components/Toast';
import api from '../../services/api';

const StudentProfilePage = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    rollNumber: '',
    cgpa: '',
    graduationYear: '',
    collegeName: '',
    departmentName: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: [],
  });

  useEffect(() => {
    api.get('/students/profile')
      .then((res) => {
        if (res.data) setProfile(res.data);
      })
      .catch((err) => addToast(err.message || 'Failed to load profile', 'danger'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put('/students/profile', profile)
      .then((res) => {
        if (res.data) setProfile(res.data);
        addToast('Profile updated successfully!', 'success');
      })
      .catch((err) => addToast(err.message || 'Failed to update profile', 'danger'));
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading profile data...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Student Profile Management</h2>
          <p className="text-sm text-secondary">Manage your academic details, contact info, and portfolio links</p>
        </div>
        <Badge variant="primary">Verified Student Profile</Badge>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card title="Personal & Academic Information">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4" style={{ marginTop: '16px' }}>
            <Input label="Full Name" value={profile.fullName || ''} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} required />
            <Input label="Email Address" value={profile.email || ''} disabled />
            <Input label="Phone Number" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            <Input label="Roll Number" value={profile.rollNumber || ''} onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })} />
            <Input label="CGPA (0 - 10)" type="number" step="0.1" value={profile.cgpa || ''} onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) })} />
            <Input label="Graduation Year" type="number" value={profile.graduationYear || ''} onChange={(e) => setProfile({ ...profile, graduationYear: parseInt(e.target.value) })} />
          </div>
        </Card>

        <Card title="Online Portfolios & Social Links">
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-4" style={{ marginTop: '16px' }}>
            <Input label="GitHub URL" value={profile.githubUrl || ''} onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })} placeholder="https://github.com/username" />
            <Input label="LinkedIn URL" value={profile.linkedinUrl || ''} onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/username" />
            <Input label="Portfolio Website" value={profile.portfolioUrl || ''} onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })} placeholder="https://yourportfolio.com" />
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit">Save Profile Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfilePage;
