import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';

import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import AppShell from './components/AppShell';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ForbiddenPage from './pages/ForbiddenPage';
import DesignSystemPreview from './pages/dev/DesignSystemPreview';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentResumePage from './pages/student/StudentResumePage';
import StudentJobsPage from './pages/student/StudentJobsPage';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentRoadmapPage from './pages/student/StudentRoadmapPage';
import StudentMockInterviewPage from './pages/student/StudentMockInterviewPage';
import StudentCodingPage from './pages/student/StudentCodingPage';
import StudentCareerPage from './pages/student/StudentCareerPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterCompanyPage from './pages/recruiter/RecruiterCompanyPage';
import RecruiterJobsPage from './pages/recruiter/RecruiterJobsPage';
import RecruiterApplicantsPage from './pages/recruiter/RecruiterApplicantsPage';
import RecruiterCandidateComparePage from './pages/recruiter/RecruiterCandidateComparePage';

// TPO Pages
import TPODashboard from './pages/tpo/TPODashboard';
import TPOPlacementDrivesPage from './pages/tpo/TPOPlacementDrivesPage';
import TPOCompaniesPage from './pages/tpo/TPOCompaniesPage';
import TPOJobsPage from './pages/tpo/TPOJobsPage';
import TPOStudentsPage from './pages/tpo/TPOStudentsPage';
import TPOAnalyticsPage from './pages/tpo/TPOAnalyticsPage';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyStudentsPage from './pages/faculty/FacultyStudentsPage';
import FacultyStudentDetailPage from './pages/faculty/FacultyStudentDetailPage';
import FacultyEarlyWarningsPage from './pages/faculty/FacultyEarlyWarningsPage';
import FacultyAssessmentsPage from './pages/faculty/FacultyAssessmentsPage';

// Mentor Pages
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorMenteesPage from './pages/mentor/MentorMenteesPage';
import MentorStudentDetailPage from './pages/mentor/MentorStudentDetailPage';
import MentorProgressPage from './pages/mentor/MentorProgressPage';
import MentorRecommendationsPage from './pages/mentor/MentorRecommendationsPage';
import MentorFeedbackPage from './pages/mentor/MentorFeedbackPage';
import MentorActivitiesPage from './pages/mentor/MentorActivitiesPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminRecruiterApprovalsPage from './pages/admin/AdminRecruiterApprovalsPage';
import AdminAssignmentsPage from './pages/admin/AdminAssignmentsPage';
import AdminDepartmentsPage from './pages/admin/AdminDepartmentsPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminAiUsagePage from './pages/admin/AdminAiUsagePage';
import AdminActivityLogsPage from './pages/admin/AdminActivityLogsPage';

import './css/base.css';
import './css/layout.css';
import './css/components.css';
import './css/utilities.css';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/forbidden" element={<ForbiddenPage />} />
              <Route path="/dev/design-system" element={<DesignSystemPreview />} />

              {/* Protected AppShell Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>

                  {/* Student Routes */}
                  <Route element={<RoleGuard allowedRoles={['STUDENT']} />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/profile" element={<StudentProfilePage />} />
                    <Route path="/student/resume" element={<StudentResumePage />} />
                    <Route path="/student/jobs" element={<StudentJobsPage />} />
                    <Route path="/student/applications" element={<StudentApplicationsPage />} />
                    <Route path="/student/roadmap" element={<StudentRoadmapPage />} />
                    <Route path="/student/interview" element={<StudentMockInterviewPage />} />
                    <Route path="/student/coding" element={<StudentCodingPage />} />
                    <Route path="/student/career" element={<StudentCareerPage />} />
                  </Route>

                  {/* Recruiter Routes */}
                  <Route element={<RoleGuard allowedRoles={['RECRUITER']} />}>
                    <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                    <Route path="/recruiter/company" element={<RecruiterCompanyPage />} />
                    <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
                    <Route path="/recruiter/applicants" element={<RecruiterApplicantsPage />} />
                    <Route path="/recruiter/compare" element={<RecruiterCandidateComparePage />} />
                  </Route>

                  {/* TPO Routes */}
                  <Route element={<RoleGuard allowedRoles={['TPO']} />}>
                    <Route path="/tpo/dashboard" element={<TPODashboard />} />
                    <Route path="/tpo/drives" element={<TPOPlacementDrivesPage />} />
                    <Route path="/tpo/companies" element={<TPOCompaniesPage />} />
                    <Route path="/tpo/jobs" element={<TPOJobsPage />} />
                    <Route path="/tpo/students" element={<TPOStudentsPage />} />
                    <Route path="/tpo/analytics" element={<TPOAnalyticsPage />} />
                  </Route>

                  {/* Faculty Routes */}
                  <Route element={<RoleGuard allowedRoles={['FACULTY']} />}>
                    <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
                    <Route path="/faculty/students" element={<FacultyStudentsPage />} />
                    <Route path="/faculty/students/:id" element={<FacultyStudentDetailPage />} />
                    <Route path="/faculty/warnings" element={<FacultyEarlyWarningsPage />} />
                    <Route path="/faculty/assessments" element={<FacultyAssessmentsPage />} />
                  </Route>

                  {/* Mentor Routes */}
                  <Route element={<RoleGuard allowedRoles={['MENTOR']} />}>
                    <Route path="/mentor/dashboard" element={<MentorDashboard />} />
                    <Route path="/mentor/mentees" element={<MentorMenteesPage />} />
                    <Route path="/mentor/students/:id" element={<MentorStudentDetailPage />} />
                    <Route path="/mentor/progress" element={<MentorProgressPage />} />
                    <Route path="/mentor/recommendations" element={<MentorRecommendationsPage />} />
                    <Route path="/mentor/feedback" element={<MentorFeedbackPage />} />
                    <Route path="/mentor/activities" element={<MentorActivitiesPage />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUserManagementPage />} />
                    <Route path="/admin/approvals" element={<AdminRecruiterApprovalsPage />} />
                    <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
                    <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
                    <Route path="/admin/companies" element={<AdminCompaniesPage />} />
                    <Route path="/admin/ai-logs" element={<AdminAiUsagePage />} />
                    <Route path="/admin/activities" element={<AdminActivityLogsPage />} />
                  </Route>

                </Route>
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
