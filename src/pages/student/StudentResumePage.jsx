import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import ProgressBar from '../../components/ProgressBar';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { Skeleton } from '../../components/Skeleton';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Copy,
  Check,
  Download,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Layers,
  Clock,
  FileCheck,
  Award,
  ListFilter,
  RefreshCw,
  HelpCircle,
  CheckSquare,
  Square
} from 'lucide-react';

/* Score Ring Circular SVG Component */
const ScoreRing = ({ score = 0, size = 110, strokeWidth = 9, label = 'Score', sublabel = 'out of 100' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let color = 'var(--danger, #EF4444)';
  if (score >= 80) color = 'var(--success, #10B981)';
  else if (score >= 60) color = 'var(--warning, #F59E0B)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border-color, #E2E8F0)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
          {Math.round(score)}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-4px' }}>/100</span>
      </div>
      <span style={{ marginTop: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>
        {label}
      </span>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sublabel}</span>
    </div>
  );
};

const StudentResumePage = () => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // Upload & processing state
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Analysis data state
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Checklist state (tracks user completed checkboxes)
  const [completedFixes, setCompletedFixes] = useState(new Set());
  const [activePriorityFilter, setActivePriorityFilter] = useState('ALL');

  // Add skills modal state
  const [addSkillsModalOpen, setAddSkillsModalOpen] = useState(false);
  const [selectedSkillsToAdd, setSelectedSkillsToAdd] = useState([]);
  const [addingSkills, setAddingSkills] = useState(false);

  // Bullet rewriter state
  const [rewritingBulletIndex, setRewritingBulletIndex] = useState(null);
  const [rewriteResults, setRewriteResults] = useState({});
  const [copiedBulletKey, setCopiedBulletKey] = useState(null);

  // Job comparison state
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [customJobDesc, setCustomJobDesc] = useState('');
  const [comparingJob, setComparingJob] = useState(false);
  const [jobComparisonResult, setJobComparisonResult] = useState(null);

  // PDF download state
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Fetch resume history & available jobs on mount
  useEffect(() => {
    loadHistory();
    loadJobs();
  }, []);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.get('/resumes/history');
      const items = res.data || [];
      setHistory(items);
      // Auto-load most recent analysis if none is currently selected
      if (items.length > 0 && !analysis) {
        setAnalysis(items[0]);
      }
    } catch (err) {
      console.error('Failed to load resume history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data || []);
    } catch (err) {
      console.warn('Failed to load active jobs for comparison:', err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selected) => {
    setUploadError(null);
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      const msg = 'Invalid file format. Please upload a standard PDF resume.';
      setUploadError(msg);
      addToast(msg, 'danger');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      const msg = 'File exceeds the 5 MB limit. Please upload a smaller PDF file.';
      setUploadError(msg);
      addToast(msg, 'danger');
      return;
    }
    setFile(selected);
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!file) {
      addToast('Please select a PDF file first.', 'warning');
      return;
    }

    setAnalyzing(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/resumes/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = res.data;
      setAnalysis(data);
      setCompletedFixes(new Set());
      setRewriteResults({});
      setJobComparisonResult(null);
      addToast('Resume analyzed successfully with ATS & AI engine!', 'success');
      loadHistory();
    } catch (err) {
      const msg = err.message || 'Failed to analyze resume. Please try again.';
      setUploadError(msg);
      addToast(msg, 'danger');
    } finally {
      setAnalyzing(false);
    }
  };

  // Toggle improvement checklist item
  const toggleFix = (fixId) => {
    setCompletedFixes((prev) => {
      const next = new Set(prev);
      if (next.has(fixId)) next.delete(fixId);
      else next.add(fixId);
      return next;
    });
  };

  // Add missing skills to profile handler
  const openAddSkillsModal = () => {
    const missing = analysis?.missingTargetSkills || [];
    setSelectedSkillsToAdd([...missing]);
    setAddSkillsModalOpen(true);
  };

  const handleConfirmAddSkills = async () => {
    if (selectedSkillsToAdd.length === 0) {
      addToast('Select at least one skill to add.', 'warning');
      return;
    }
    setAddingSkills(true);
    try {
      const res = await api.post('/resumes/add-skills', { skills: selectedSkillsToAdd });
      addToast(res.message || `Added ${selectedSkillsToAdd.length} skill(s) to your profile!`, 'success');
      setAddSkillsModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to update student profile skills', 'danger');
    } finally {
      setAddingSkills(false);
    }
  };

  // Rewrite bullet assistant
  const handleRewriteBullet = async (bulletText, context, key) => {
    if (!analysis?.resumeId) {
      addToast('Active resume reference is required for AI rewriter.', 'warning');
      return;
    }
    setRewritingBulletIndex(key);
    try {
      const res = await api.post('/resumes/rewrite-bullet', {
        resumeId: analysis.resumeId,
        bullet: bulletText,
        context: context || 'Experience bullet rewrite',
      });
      setRewriteResults((prev) => ({
        ...prev,
        [key]: res.data,
      }));
      addToast('AI rewrite suggestion generated!', 'success');
    } catch (err) {
      addToast(err.message || 'AI rewrite unavailable. Please try again.', 'danger');
    } finally {
      setRewritingBulletIndex(null);
    }
  };

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletKey(key);
    addToast('Rewritten bullet copied to clipboard!', 'info');
    setTimeout(() => setCopiedBulletKey(null), 2500);
  };

  // Job comparison handler
  const handleCompareJob = async () => {
    if (!analysis?.resumeId) {
      addToast('Please upload or select a resume first.', 'warning');
      return;
    }
    if (!selectedJobId && !customJobDesc.trim()) {
      addToast('Please select a job role or paste a job description.', 'warning');
      return;
    }

    setComparingJob(true);
    try {
      const payload = {
        resumeId: analysis.resumeId,
        jobId: selectedJobId ? Number(selectedJobId) : null,
        jobDescription: customJobDesc.trim(),
      };
      const res = await api.post('/resumes/compare-job', payload);
      setJobComparisonResult(res.data);
      addToast('Job comparison completed!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to compare resume with job.', 'danger');
    } finally {
      setComparingJob(false);
    }
  };

  // Download PDF Report
  const handleDownloadPdf = async (resumeIdToDownload) => {
    const id = resumeIdToDownload || analysis?.resumeId;
    if (!id) {
      addToast('No resume analysis available to download.', 'warning');
      return;
    }
    setDownloadingPdf(true);
    try {
      const blob = await api.get(`/resumes/${id}/pdf-report`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume_ATS_Report_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast('ATS PDF report downloaded successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate PDF report', 'danger');
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Improvements filtering & stats
  const improvements = useMemo(() => analysis?.improvements || [], [analysis]);
  const filteredImprovements = useMemo(() => {
    if (activePriorityFilter === 'ALL') return improvements;
    return improvements.filter((item) => item.priority?.toUpperCase() === activePriorityFilter);
  }, [improvements, activePriorityFilter]);

  const totalFixesCount = improvements.length;
  const completedFixesCount = useMemo(() => {
    return improvements.filter((i) => completedFixes.has(i.id || i.problem)).length;
  }, [improvements, completedFixes]);

  // Skill groupings from analysis
  const skillCategories = [
    { key: 'Programming Languages', label: 'Programming Languages' },
    { key: 'Frameworks & Libraries', label: 'Frameworks & Libraries' },
    { key: 'Databases', label: 'Databases' },
    { key: 'Tools & Cloud/DevOps', label: 'Tools & Cloud / DevOps' },
    { key: 'Soft Skills', label: 'Soft Skills' },
    { key: 'Other', label: 'Other Technical Skills' },
  ];

  const totalSkillsCount = analysis?.totalSkillsCount || 0;
  const skillsGrouped = analysis?.skillsGrouped || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            AI Resume Analyzer & ATS Optimization
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Multi-stage PDF parsing, algorithmic ATS compliance scoring, skill taxonomy extraction, and AI rewrite suggestions.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {analysis?.resumeId && (
            <Button
              variant="secondary"
              onClick={() => handleDownloadPdf()}
              disabled={downloadingPdf}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={15} />
              {downloadingPdf ? 'Exporting PDF...' : 'Download PDF Report'}
            </Button>
          )}
          <Badge variant="primary">
            <Sparkles size={14} style={{ marginRight: '5px' }} />
            Gemini 2.5 AI Active
          </Badge>
        </div>
      </div>

      {/* 1. Upload Section */}
      <Card title="Upload Resume for Analysis">
        <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: isDragging ? '2px dashed var(--primary)' : '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: '36px 20px',
              textAlign: 'center',
              background: isDragging ? 'var(--primary-light)' : 'var(--bg-surface-hover)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Upload size={40} color="var(--primary)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              {file ? file.name : 'Drag and drop your PDF resume here, or click to browse'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              {file
                ? `Size: ${(file.size / 1024).toFixed(1)} KB — Ready to analyze`
                : 'Accepts genuine PDF files up to 5 MB. Multi-page, text-based documents supported.'}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>

          {uploadError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'var(--danger-bg)',
                borderRadius: 'var(--radius-md, 8px)',
                color: 'var(--danger)',
                fontSize: '13px',
              }}
            >
              <AlertTriangle size={18} />
              <span>{uploadError}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              * Scanned image-only PDFs will be flagged and rejected to ensure authentic ATS parsing.
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              {file && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFile(null);
                    setUploadError(null);
                  }}
                >
                  Clear File
                </Button>
              )}
              <Button type="submit" variant="primary" disabled={analyzing || !file}>
                {analyzing ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={15} className="spin-animation" /> Analyzing with ATS Engine...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={15} /> Start AI & ATS Analysis
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Analyzing Skeleton State */}
      {analyzing && (
        <Card title="Analyzing Document Structure...">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px 0' }}>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <Skeleton width="120px" height="120px" borderRadius="50%" />
              <Skeleton width="120px" height="120px" borderRadius="50%" />
            </div>
            <Skeleton width="100%" height="28px" />
            <Skeleton width="100%" height="28px" />
            <Skeleton width="80%" height="28px" />
          </div>
        </Card>
      )}

      {/* Empty State before any upload / history */}
      {!analyzing && !analysis && (
        <Card>
          <EmptyState
            title="No Resume Analyzed Yet"
            description="Upload your PDF resume above to receive deep ATS compatibility scores, skill categorization, weak verb detection, and AI bullet rewrites."
            actionLabel="Choose PDF File"
            onAction={() => fileInputRef.current?.click()}
          />
        </Card>
      )}

      {/* Main Analysis Results */}
      {!analyzing && analysis && (
        <>
          {/* 2. Scores & ATS Simulation */}
          <Card title="Resume Scores & ATS Diagnostics">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '12px' }}>
              {/* Score Rings Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '24px',
                  padding: '16px',
                  background: 'var(--bg-surface-hover)',
                  borderRadius: 'var(--radius-lg, 12px)',
                  alignItems: 'center',
                }}
              >
                <ScoreRing
                  score={analysis.overallScore || 0}
                  label="Overall Score"
                  sublabel="Structure & Content Quality"
                />
                <ScoreRing
                  score={analysis.atsScore || 0}
                  label="ATS Pass Score"
                  sublabel="Machine Readability"
                />

                {/* Quick Stats Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Analyzed Document:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{analysis.filename || 'Resume.pdf'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Page Count:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{analysis.pageCount || 1} Page(s)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Skills Identified:</span>
                    <strong style={{ color: 'var(--primary)' }}>{totalSkillsCount}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Improvements Needed:</span>
                    <strong style={{ color: 'var(--warning)' }}>{improvements.length} items</strong>
                  </div>
                </div>
              </div>

              {/* Mandatory ATS Disclaimer Note */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md, 8px)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                <HelpCircle size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Notice:</strong> ATS scores are estimates and do not guarantee passing any real ATS.
                  Different corporate recruiting platforms use proprietary scoring thresholds and parsing models.
                </span>
              </div>

              {/* Section Breakdown Bars */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Section Score Breakdown
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {analysis.sectionScores &&
                    Object.entries(analysis.sectionScores).map(([key, val]) => {
                      const displayTitle = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase());
                      let badgeVariant = 'danger';
                      if (val >= 80) badgeVariant = 'success';
                      else if (val >= 60) badgeVariant = 'warning';

                      return (
                        <div
                          key={key}
                          style={{
                            padding: '14px',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md, 8px)',
                            background: 'var(--bg-surface)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                              {displayTitle}
                            </span>
                            <Badge variant={badgeVariant}>{val}%</Badge>
                          </div>
                          <ProgressBar progress={val} height={6} />
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* 9 ATS Checks (Pass / Warn / Fail) */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' }}>
                  ATS Standard Checks (9 Factors)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {analysis.atsChecks &&
                    analysis.atsChecks.map((chk, i) => {
                      const status = chk.status?.toUpperCase() || 'PASS';
                      let icon = <CheckCircle2 size={18} color="var(--success)" />;
                      let badgeVar = 'success';
                      if (status === 'WARN') {
                        icon = <AlertTriangle size={18} color="var(--warning)" />;
                        badgeVar = 'warning';
                      } else if (status === 'FAIL') {
                        icon = <XCircle size={18} color="var(--danger)" />;
                        badgeVar = 'danger';
                      }

                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md, 8px)',
                            background: 'var(--bg-surface)',
                            gap: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ marginTop: '2px', flexShrink: 0 }}>{icon}</div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                  {chk.title}
                                </span>
                              </div>
                              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 2px 0' }}>
                                {chk.result}
                              </p>
                              {chk.detail && (
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                                  {chk.detail}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant={badgeVar}>{status}</Badge>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Skills Found in Resume */}
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="var(--primary)" />
                  <span>Skills Found in Your Resume ({totalSkillsCount})</span>
                </div>
                {analysis.missingTargetSkills && analysis.missingTargetSkills.length > 0 && (
                  <Button
                    variant="primary"
                    onClick={openAddSkillsModal}
                    style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Add Missing Skills to Profile
                  </Button>
                )}
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginTop: '12px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Skills were automatically parsed and categorized from the text. Skills marked with{' '}
                <span style={{ color: 'var(--warning)', fontWeight: '600' }}>⚠️ Listed only</span> appear in your skills list
                but were never substantiated in any project or work experience bullet.
              </p>

              {/* 6 Category Groups */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {skillCategories.map((cat) => {
                  const skillsInGroup = skillsGrouped[cat.key] || [];
                  return (
                    <div
                      key={cat.key}
                      style={{
                        padding: '14px',
                        background: 'var(--bg-surface-hover)',
                        borderRadius: 'var(--radius-md, 8px)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {cat.label}
                        </span>
                        <Badge variant="default" style={{ fontSize: '11px' }}>
                          {skillsInGroup.length} skill{skillsInGroup.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>

                      {skillsInGroup.length === 0 ? (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                          No skills detected under this category.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {skillsInGroup.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '5px 10px',
                                borderRadius: 'var(--radius-full, 9999px)',
                                background: item.listedOnly ? 'var(--warning-bg)' : 'var(--bg-surface)',
                                border: `1px solid ${item.listedOnly ? 'var(--warning)' : 'var(--border-color)'}`,
                                fontSize: '12px',
                                color: 'var(--text-primary)',
                              }}
                            >
                              <span style={{ fontWeight: '500' }}>{item.name}</span>

                              {/* Where Found Tag */}
                              {item.sectionsFound && item.sectionsFound.length > 0 && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                    background: 'var(--border-color)',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  {item.sectionsFound.join(', ')}
                                </span>
                              )}

                              {/* Listed Only Warning Tag */}
                              {item.listedOnly && (
                                <span
                                  title="Flagged: This skill is only listed in your skills section and never applied in your experience or projects."
                                  style={{
                                    fontSize: '10px',
                                    color: 'var(--warning)',
                                    fontWeight: '600',
                                  }}
                                >
                                  ⚠️ Listed only
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* "Skills to Add" Group (Missing for target role / job) */}
                <div
                  style={{
                    padding: '14px',
                    background: 'var(--brand-50, #EEF2FF)',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--brand-500, #6366F1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={16} color="var(--primary)" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)' }}>
                        Skills to Add (Missing for Target Tech Roles)
                      </span>
                    </div>
                    <Badge variant="primary">
                      {analysis.missingTargetSkills ? analysis.missingTargetSkills.length : 0} recommended
                    </Badge>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    These high-demand keywords are standard for top engineering roles. Adding projects demonstrating these skills will boost your ATS keyword score:
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {analysis.missingTargetSkills && analysis.missingTargetSkills.length > 0 ? (
                      analysis.missingTargetSkills.map((s, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full, 9999px)',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--brand-500, #6366F1)',
                            fontSize: '12px',
                            color: 'var(--primary)',
                            fontWeight: '500',
                          }}
                        >
                          <Plus size={12} />
                          <span>{s}</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--success)' }}>
                        All target role core skills are represented in your resume!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 4. "How to improve your resume" Panel (The most important part) */}
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckSquare size={18} color="var(--primary)" />
                  <span>How to Improve Your Resume (Prioritized Action Plan)</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>
                  {completedFixesCount} of {totalFixesCount} fixes done (
                  {totalFixesCount > 0 ? Math.round((completedFixesCount / totalFixesCount) * 100) : 100}%)
                </div>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
              {/* Progress Bar of Completed Fixes */}
              <div>
                <ProgressBar
                  progress={totalFixesCount > 0 ? (completedFixesCount / totalFixesCount) * 100 : 100}
                  color="var(--success)"
                  height={8}
                />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Check off each completed edit as you update your resume. Re-analyzing your updated PDF will reflect the new score.
                </p>
              </div>

              {/* Priority Filter Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => {
                  const isActive = activePriorityFilter === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setActivePriorityFilter(p)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-md, 8px)',
                        border: 'none',
                        background: isActive ? 'var(--primary)' : 'transparent',
                        color: isActive ? '#fff' : 'var(--text-secondary)',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {p === 'ALL' ? 'All Fixes' : `${p} Priority`}
                    </button>
                  );
                })}
              </div>

              {/* Checklist Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredImprovements.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                    No fixes pending under this priority filter!
                  </p>
                ) : (
                  filteredImprovements.map((item, idx) => {
                    const isDone = completedFixes.has(item.id || item.problem);
                    const priorityUpper = item.priority?.toUpperCase() || 'MEDIUM';
                    let pVariant = 'warning';
                    if (priorityUpper === 'HIGH') pVariant = 'danger';
                    if (priorityUpper === 'LOW') pVariant = 'default';

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '14px',
                          padding: '16px',
                          borderRadius: 'var(--radius-md, 8px)',
                          border: `1px solid ${isDone ? 'var(--success)' : 'var(--border-color)'}`,
                          background: isDone ? 'var(--success-bg)' : 'var(--bg-surface)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {/* Interactive Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleFix(item.id || item.problem)}
                          aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            marginTop: '2px',
                            color: isDone ? 'var(--success)' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
                        </button>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <Badge variant={pVariant}>{priorityUpper}</Badge>
                            {item.category && <Badge variant="default">{item.category}</Badge>}
                            {item.estimatedScoreGain && (
                              <Badge variant="success">+{item.estimatedScoreGain} pts gain</Badge>
                            )}
                          </div>

                          <h4
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: isDone ? 'line-through' : 'none',
                              margin: '0 0 4px 0',
                            }}
                          >
                            {item.problem}
                          </h4>

                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>
                            <strong>Why it matters:</strong> {item.whyItMatters}
                          </p>

                          <div
                            style={{
                              fontSize: '12px',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm, 6px)',
                              background: 'var(--bg-surface-hover)',
                              borderLeft: '3px solid var(--primary)',
                              color: 'var(--text-primary)',
                              fontFamily: 'monospace',
                            }}
                          >
                            <strong>Actionable Fix:</strong> {item.concreteFix}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Weak Verbs & Phrase Detector Section */}
              {analysis.weakPhrases && analysis.weakPhrases.length > 0 && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--warning)',
                    background: 'var(--warning-bg)',
                  }}
                >
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--warning)', margin: '0 0 8px 0' }}>
                    Action-Verb & Weak-Phrase Detector ({analysis.weakPhrases.length} passive instances)
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
                    Passive phrases like "responsible for" or "worked on" fail to convey ownership. Replace them with high-octane engineering action verbs:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {analysis.weakPhrases.map((wp, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'var(--bg-surface)',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-md, 8px)',
                          border: '1px solid var(--border-color)',
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ color: 'var(--danger)', fontWeight: '600', textDecoration: 'line-through' }}>
                          "{wp.phrase || wp}"
                        </span>
                        <span style={{ margin: '0 6px', color: 'var(--text-muted)' }}>→</span>
                        <span style={{ color: 'var(--success)', fontWeight: '600' }}>
                          {wp.replacements ? wp.replacements.join(' / ') : 'Spearheaded / Architected / Orchestrated'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bullet Rewrite Assistant Panel */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={16} color="var(--primary)" />
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                    AI Bullet Rewrite Assistant
                  </h4>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  Select any unquantified or weak bullet point from your resume to generate an ATS-optimized, high-impact bullet following Google's X-Y-Z formula:
                </p>

                {analysis.unquantifiedBullets && analysis.unquantifiedBullets.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analysis.unquantifiedBullets.slice(0, 4).map((bullet, idx) => {
                      const key = `bullet-${idx}`;
                      const rewrite = rewriteResults[key];
                      const isRewriting = rewritingBulletIndex === key;

                      return (
                        <div
                          key={key}
                          style={{
                            padding: '12px',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md, 8px)',
                            background: 'var(--bg-surface-hover)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                            <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, fontStyle: 'italic' }}>
                              "{bullet}"
                            </p>
                            <Button
                              variant="secondary"
                              onClick={() => handleRewriteBullet(bullet, 'Experience bullet', key)}
                              disabled={isRewriting}
                              style={{ fontSize: '12px', padding: '4px 10px', flexShrink: 0 }}
                            >
                              {isRewriting ? 'Rewriting...' : 'Improve this bullet'}
                            </Button>
                          </div>

                          {rewrite && (
                            <div
                              style={{
                                marginTop: '12px',
                                padding: '12px',
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--brand-500, #6366F1)',
                                borderRadius: 'var(--radius-md, 8px)',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>
                                  ✨ AI Improved Version:
                                </span>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <Button
                                    variant="secondary"
                                    onClick={() => handleCopyText(rewrite.improvedBullet, key)}
                                    style={{ fontSize: '11px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    {copiedBulletKey === key ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                                    {copiedBulletKey === key ? 'Copied' : 'Copy'}
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      toggleFix(key);
                                      addToast('Rewrite accepted!', 'success');
                                    }}
                                    style={{ fontSize: '11px', padding: '3px 8px' }}
                                  >
                                    Accept
                                  </Button>
                                </div>
                              </div>

                              <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500', margin: '4px 0' }}>
                                {rewrite.improvedBullet}
                              </p>

                              {rewrite.explanation && (
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                                  <strong>Why it works:</strong> {rewrite.explanation}
                                </p>
                              )}

                              {rewrite.metricsPrompt && (
                                <p style={{ fontSize: '11px', color: 'var(--warning)', margin: '4px 0 0 0' }}>
                                  <strong>💡 Metric Verification:</strong> {rewrite.metricsPrompt}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', color: 'var(--success)', margin: 0 }}>
                    Great work! All your experience bullets include quantifiable impact metrics.
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* 5. Compare with a Job */}
          <Card title="Compare with a Job Posting">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Select an open placement job role or paste an external job description to calculate your exact keyword match percentage and uncover missing qualifications:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Choose an Active Placement Job:
                  </label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="">-- Or paste custom job description below --</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} - {job.companyName || 'Company'} ({job.location || 'Remote'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Or Paste External Job Description:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Paste job requirements, tech stack, and responsibilities here..."
                    value={customJobDesc}
                    onChange={(e) => setCustomJobDesc(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" onClick={handleCompareJob} disabled={comparingJob}>
                  {comparingJob ? 'Comparing Keywords...' : 'Calculate Job Match %'}
                </Button>
              </div>

              {/* Comparison Result Display */}
              {jobComparisonResult && (
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--bg-surface-hover)',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                        Target Job Match: {jobComparisonResult.matchScore || 0}%
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                        Based on algorithmic keyword alignment between your resume and the specified job profile.
                      </p>
                    </div>
                    <Badge variant={jobComparisonResult.matchScore >= 75 ? 'success' : 'warning'}>
                      {jobComparisonResult.matchScore >= 75 ? 'High Compatibility' : 'Moderate Match'}
                    </Badge>
                  </div>

                  <ProgressBar progress={jobComparisonResult.matchScore || 0} height={8} />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {/* Matched Keywords */}
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--success)' }}>
                        ✓ Matched Keywords ({jobComparisonResult.matchedKeywords?.length || 0}):
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                        {jobComparisonResult.matchedKeywords && jobComparisonResult.matchedKeywords.length > 0 ? (
                          jobComparisonResult.matchedKeywords.map((kw, i) => (
                            <span
                              key={i}
                              style={{
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full, 9999px)',
                                background: 'var(--success-bg)',
                                color: 'var(--success)',
                                fontSize: '12px',
                                border: '1px solid var(--success)',
                              }}
                            >
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>None identified</span>
                        )}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--danger)' }}>
                        ✗ Missing Keywords ({jobComparisonResult.missingKeywords?.length || 0}):
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                        {jobComparisonResult.missingKeywords && jobComparisonResult.missingKeywords.length > 0 ? (
                          jobComparisonResult.missingKeywords.map((kw, i) => (
                            <span
                              key={i}
                              style={{
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full, 9999px)',
                                background: 'var(--danger-bg)',
                                color: 'var(--danger)',
                                fontSize: '12px',
                                border: '1px solid var(--danger)',
                              }}
                            >
                              + {kw}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--success)' }}>
                            No critical missing keywords!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* 6. Score History */}
          <Card title="Resume Score History & Evolution">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Every analysis run is preserved to monitor your progress as you incorporate recommendations and re-upload:
              </p>

              {history.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No historical analyses recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {history.map((h, i) => {
                    const isCurrent = h.resumeId === analysis.resumeId;
                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md, 8px)',
                          background: isCurrent ? 'var(--primary-light)' : 'var(--bg-surface)',
                          flexWrap: 'wrap',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Clock size={18} color="var(--primary)" />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                                {h.filename || `Resume_${h.resumeId}.pdf`}
                              </strong>
                              {isCurrent && <Badge variant="primary">Current</Badge>}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {h.createdAt ? new Date(h.createdAt).toLocaleString() : 'Recent Upload'}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                              Overall / ATS
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                              {h.overallScore || 0}% / {h.atsScore || 0}%
                            </span>
                          </div>

                          <Button
                            variant="secondary"
                            onClick={() => setAnalysis(h)}
                            style={{ fontSize: '12px', padding: '4px 10px' }}
                          >
                            Load
                          </Button>

                          <Button
                            variant="secondary"
                            onClick={() => handleDownloadPdf(h.resumeId)}
                            title="Download PDF Report"
                            style={{ padding: '6px 8px' }}
                          >
                            <Download size={14} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Confirmation Modal for Adding Skills to Profile */}
      <Modal
        isOpen={addSkillsModalOpen}
        onClose={() => setAddSkillsModalOpen(false)}
        title="Add Missing Skills to Your Student Profile"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setAddSkillsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmAddSkills}
              disabled={addingSkills || selectedSkillsToAdd.length === 0}
            >
              {addingSkills ? 'Updating Profile...' : `Confirm & Add (${selectedSkillsToAdd.length})`}
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Select the skills below to add directly to your SmartPlacement student profile. Recruiters use these profile skills when filtering candidates for placement drives.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '240px',
              overflowY: 'auto',
              padding: '8px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md, 8px)',
            }}
          >
            {analysis?.missingTargetSkills && analysis.missingTargetSkills.length > 0 ? (
              analysis.missingTargetSkills.map((skill, idx) => {
                const isSelected = selectedSkillsToAdd.includes(skill);
                return (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm, 6px)',
                      background: isSelected ? 'var(--primary-light)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setSelectedSkillsToAdd((prev) =>
                          isSelected ? prev.filter((s) => s !== skill) : [...prev, skill]
                        );
                      }}
                    />
                    <span>{skill}</span>
                  </label>
                );
              })
            ) : (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No missing skills to add.</p>
            )}
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
            * Note: This safely updates your SmartPlacement database profile without altering your uploaded PDF file.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default StudentResumePage;
