import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AIAssistant from './AIAssistant';

const PATH_TITLES = {
  '/student/dashboard': 'Student Career Dashboard',
  '/student/profile': 'My Student Profile',
  '/student/resume': 'Resume & ATS Intelligence',
  '/student/jobs': 'Open Placement Opportunities',
  '/student/applications': 'Application Tracker',
  '/student/roadmap': 'Skill Gap & Learning Roadmap',
  '/student/interview': 'AI Mock Interviewer',
  '/student/coding': 'AI Coding Practice',
  '/student/career': 'Career Path & Daily Planner',
  '/recruiter/dashboard': 'Recruiter Hiring Dashboard',
  '/recruiter/company': 'Company Profile',
  '/recruiter/jobs': 'Manage Job Postings',
  '/recruiter/applicants': 'Candidate Pipeline',
  '/recruiter/compare': 'Candidate Side-by-Side Comparison',
  '/tpo/dashboard': 'TPO Placement Overview',
  '/tpo/drives': 'Placement Drives Management',
  '/tpo/companies': 'Partner Companies',
  '/tpo/jobs': 'All Job Openings',
  '/tpo/students': 'Eligible Students Directory',
  '/tpo/analytics': 'Placement & Skill Analytics',
  '/faculty/dashboard': 'Faculty Overview',
  '/faculty/students': 'Assigned Students Directory',
  '/faculty/warnings': 'Early Warning Risk Radar',
  '/faculty/assessments': 'Assessments & Quizzes',
  '/mentor/dashboard': 'Mentor Dashboard',
  '/mentor/mentees': 'Assigned Mentees',
  '/mentor/progress': 'Mentee Learning Progress',
  '/admin/dashboard': 'Administrator Console',
  '/admin/users': 'User Management & Roles',
  '/admin/approvals': 'Pending Recruiter Approvals',
  '/admin/departments': 'Academic Departments',
  '/admin/ai-logs': 'AI Usage & Token Log',
};

export const AppShell = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const location = useLocation();

  const pageTitle = PATH_TITLES[location.pathname] || 'SmartPlacement AI';

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="main-wrapper">
        <Navbar
          pageTitle={pageTitle}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          onToggleAI={() => setAiOpen(!aiOpen)}
        />
        <main className="content-container">
          <Outlet />
        </main>
      </div>

      <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
};

export default AppShell;
