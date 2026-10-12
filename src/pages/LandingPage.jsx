import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Brain, FileCheck, Target, CheckCircle2, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

export const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* Header */}
      <header
        style={{
          height: '70px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          backgroundColor: 'var(--bg-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles color="var(--primary)" size={24} />
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>SmartPlacement</span>
          <span className="sidebar-brand-badge">AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-ghost btn-icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link to="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '24px',
          }}
        >
          <Sparkles size={16} /> Next-Gen Career Intelligence Platform
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: 1.15, marginBottom: '20px' }}>
          AI-Powered Student Placement & Career Intelligence
        </h1>
        <p className="text-secondary" style={{ fontSize: '18px', marginBottom: '32px', lineHeight: 1.6 }}>
          Transform your institution's placement ecosystem. Connect Students, Recruiters, TPOs, Faculty, and Mentors with explainable AI job matching, resume analysis, and mock interviews.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link to="/register">
            <Button variant="primary" size="lg" icon={ArrowRight}>
              Join Platform
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Sign In to Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Preview Card */}
      <section style={{ padding: '0 24px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div
          className="card"
          style={{
            padding: '32px',
            background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-surface-hover) 100%)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ background: 'var(--bg-surface)' }}>
              <Brain color="var(--primary)" size={32} style={{ marginBottom: '12px' }} />
              <h3>Deterministic Skill Coverage</h3>
              <p className="text-sm text-muted" style={{ marginTop: '8px' }}>
                Weighted matching formula (3:1 required vs preferred skills) computes exact match percentage with zero hallucinations.
              </p>
            </div>
            <div className="card" style={{ background: 'var(--bg-surface)' }}>
              <FileCheck color="var(--success)" size={32} style={{ marginBottom: '12px' }} />
              <h3>PDF Resume Intelligence</h3>
              <p className="text-sm text-muted" style={{ marginTop: '8px' }}>
                PDFBox text extraction with AI structured parsing, ATS score simulation, and 1-click profile skill sync.
              </p>
            </div>
            <div className="card" style={{ background: 'var(--bg-surface)' }}>
              <Target color="var(--warning)" size={32} style={{ marginBottom: '12px' }} />
              <h3>Explainable Readiness Score</h3>
              <p className="text-sm text-muted" style={{ marginTop: '8px' }}>
                Multi-component readiness breakdown (Technical, Resume, Coding, Interview) with missing data callouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Capabilities Grid */}
      <section style={{ padding: '60px 24px', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '12px' }}>Built for the Entire Placement Ecosystem</h2>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '48px' }}>Six specialized roles working seamlessly on one platform.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              { role: 'Student', desc: 'Build profile, analyze resume, practice AI mock interviews, practice coding, and apply to eligible jobs.' },
              { role: 'Recruiter', desc: 'Post jobs with weighted skills, filter applicants by CGPA & match score, schedule interviews, and compare candidates.' },
              { role: 'TPO', desc: 'Manage placement drives, close drives, view department-wise analytics, and calculate eligible student lists.' },
              { role: 'Faculty', desc: 'Monitor assigned students, inspect explainable Early Warning flags, and track assessment scores.' },
              { role: 'Mentor', desc: 'Review mentee roadmaps, provide structured feedback, and log career guidance sessions.' },
              { role: 'Admin', desc: 'Approve recruiter registrations, manage users & roles, oversee departments, and monitor AI token logs.' },
            ].map((r, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <h4>{r.role}</h4>
                </div>
                <p className="text-sm text-secondary">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 24px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <p className="text-xs text-muted">
          SmartPlacement AI Platform © 2026. Built with Java 17, Spring Boot 3, React 18 & MySQL.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
