import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Layers,
  Award,
  BookOpen,
  Video,
  Code2,
  TrendingUp,
  Compass,
  Users,
  Building2,
  Calendar,
  AlertTriangle,
  LogOut,
  Sparkles,
  ShieldAlert,
  MessageSquare,
  Activity,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_NAV_ITEMS = {
  STUDENT: [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'Resume & ATS', path: '/student/resume', icon: FileText },
    { label: 'Browse Jobs', path: '/student/jobs', icon: Briefcase },
    { label: 'My Applications', path: '/student/applications', icon: Layers },
    { label: 'Skill Gap & Roadmap', path: '/student/roadmap', icon: BookOpen },
    { label: 'AI Mock Interview', path: '/student/interview', icon: Video },
    { label: 'Coding Practice', path: '/student/coding', icon: Code2 },
    { label: 'Career Intelligence', path: '/student/career', icon: Compass },
  ],
  RECRUITER: [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', path: '/recruiter/company', icon: Building2 },
    { label: 'Job Postings', path: '/recruiter/jobs', icon: Briefcase },
    { label: 'Applicants', path: '/recruiter/applicants', icon: Users },
    { label: 'Candidate Compare', path: '/recruiter/compare', icon: Layers },
  ],
  TPO: [
    { label: 'Dashboard', path: '/tpo/dashboard', icon: LayoutDashboard },
    { label: 'Placement Drives', path: '/tpo/drives', icon: Calendar },
    { label: 'Companies', path: '/tpo/companies', icon: Building2 },
    { label: 'Manage Jobs', path: '/tpo/jobs', icon: Briefcase },
    { label: 'Eligible Students', path: '/tpo/students', icon: Users },
    { label: 'Placement Analytics', path: '/tpo/analytics', icon: TrendingUp },
  ],
  FACULTY: [
    { label: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { label: 'Assigned Students', path: '/faculty/students', icon: Users },
    { label: 'Early Warnings', path: '/faculty/warnings', icon: AlertTriangle },
    { label: 'Assessments', path: '/faculty/assessments', icon: Award },
  ],
  MENTOR: [
    { label: 'Dashboard', path: '/mentor/dashboard', icon: LayoutDashboard },
    { label: 'My Mentees', path: '/mentor/mentees', icon: Users },
    { label: 'Progress & Roadmaps', path: '/mentor/progress', icon: BookOpen },
    { label: 'AI Recommendations', path: '/mentor/recommendations', icon: Sparkles },
    { label: 'Mentee Feedback', path: '/mentor/feedback', icon: MessageSquare },
    { label: 'Mentoring Sessions', path: '/mentor/activities', icon: Activity },
  ],
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Recruiter Approvals', path: '/admin/approvals', icon: ShieldAlert },
    { label: 'Student Assignments', path: '/admin/assignments', icon: UserCheck },
    { label: 'Academic Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Partner Companies', path: '/admin/companies', icon: Briefcase },
    { label: 'AI Usage & Tokens', path: '/admin/ai-logs', icon: Sparkles },
    { label: 'Audit Activity Log', path: '/admin/activities', icon: Activity },
  ],
};

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = ROLE_NAV_ITEMS[user.role] || [];
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <Sparkles color="var(--primary)" size={22} />
          <span className="sidebar-brand-text">SmartPlacement</span>
          <span className="sidebar-brand-badge">AI</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">{user.role} Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen && setMobileOpen(false)}
            >
              <Icon size={18} />
              <span className="nav-item-text">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge-container">
          <div className="user-avatar">{initials}</div>
          <div className="user-details">
            <span className="user-name">{user.fullName}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-icon"
          title="Logout"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
