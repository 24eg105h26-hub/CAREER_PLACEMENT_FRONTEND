import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import ProgressBar from '../../components/ProgressBar';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const StudentResumePage = () => {
  const { addToast } = useToast();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      addToast('Please select a PDF resume file to upload', 'warning');
      return;
    }
    setAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    api.post('/ai/analyze-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        setAnalysis(res.data);
        addToast('Resume analyzed successfully with AI!', 'success');
      })
      .catch((err) => addToast(err.message || 'Failed to analyze resume', 'danger'))
      .finally(() => setAnalyzing(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>AI Resume Analyzer & ATS Optimization</h2>
          <p className="text-sm text-secondary">Upload your PDF resume for instant AI skill extraction and ATS scoring</p>
        </div>
        <Badge variant="primary"><Sparkles size={14} style={{ marginRight: '4px' }} /> AI Engine Active</Badge>
      </div>

      <Card title="Upload PDF Resume">
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
          <div
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              textAlign: 'center',
              background: 'var(--bg-surface-hover)',
              cursor: 'pointer',
            }}
          >
            <Upload size={36} color="var(--primary)" style={{ marginBottom: '12px' }} />
            <p className="font-semibold text-sm">Drag and drop your PDF resume here, or click to browse</p>
            <p className="text-xs text-muted" style={{ marginTop: '4px' }}>Supports PDF format up to 5MB</p>
            <input type="file" accept=".pdf" onChange={handleFileChange} style={{ marginTop: '16px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" disabled={analyzing || !file}>
              {analyzing ? 'Analyzing with AI PDFBox...' : 'Start AI Analysis'}
            </Button>
          </div>
        </form>
      </Card>

      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <Card title="Overall Resume Score">
              <div style={{ marginTop: '12px' }}>
                <h1 style={{ color: 'var(--primary)' }}>{analysis.resumeScore || 85}%</h1>
                <ProgressBar progress={analysis.resumeScore || 85} color="var(--primary)" style={{ marginTop: '8px' }} />
              </div>
            </Card>

            <Card title="ATS Compatibility Simulation">
              <div style={{ marginTop: '12px' }}>
                <h1 style={{ color: 'var(--success)' }}>{analysis.atsScore || 88}%</h1>
                <ProgressBar progress={analysis.atsScore || 88} color="var(--success)" style={{ marginTop: '8px' }} />
                <p className="text-xs text-muted" style={{ marginTop: '8px' }}>
                  * Disclaimer: ATS score is an algorithmic simulation for guidance and does not guarantee passing corporate ATS filters.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResumePage;
