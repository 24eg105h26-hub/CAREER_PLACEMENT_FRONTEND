import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import Button from '../../components/Button';
import Input, { Select } from '../../components/Input';

export const RegisterPage = () => {
  const [role, setRole] = useState('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Password Strength Check
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasLength = password.length >= 8;
  const isPasswordValid = hasUpper && hasLower && hasDigit && hasLength;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Please ensure your password meets all complexity requirements.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        email,
        password,
        fullName,
        phone,
        role,
        ...(role === 'RECRUITER' ? { companyName } : { rollNumber }),
      };

      const res = await register(payload);
      if (res.approvalStatus === 'PENDING') {
        showToast('Registration submitted! Account is pending TPO/Admin approval.', 'info');
        navigate('/login');
      } else {
        showToast('Registration successful!', 'success');
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px',
          maxWidth: '540px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles color="var(--primary)" size={28} />
            <h2 style={{ fontSize: '24px' }}>SmartPlacement AI</h2>
          </div>
          <h3>Create your account</h3>
          <p className="text-sm text-muted">Self-registration is available for Students & Recruiters.</p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Select
            label="I am registering as a"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { label: 'Student', value: 'STUDENT' },
              { label: 'Recruiter / Employer', value: 'RECRUITER' },
            ]}
          />

          {role === 'RECRUITER' && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--warning-bg)',
                color: 'var(--warning)',
                fontSize: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} />
              Recruiter accounts require TPO/Admin approval before posting jobs.
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="Alex Chen"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="alex@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {role === 'RECRUITER' ? (
            <Input
              label="Company Name"
              placeholder="e.g. Google, Microsoft, Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          ) : (
            <Input
              label="Roll Number / Student ID"
              placeholder="2024CSE101"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />
          )}

          <Input
            label="Phone Number"
            placeholder="+1 555-0199"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Password Strength Requirements */}
          <div style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <p style={{ fontWeight: '600', marginBottom: '4px' }}>Password Requirements:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <span style={{ color: hasLength ? 'var(--success)' : 'inherit' }}>
                {hasLength ? '✓' : '•'} At least 8 chars
              </span>
              <span style={{ color: hasUpper ? 'var(--success)' : 'inherit' }}>
                {hasUpper ? '✓' : '•'} 1 Uppercase letter
              </span>
              <span style={{ color: hasLower ? 'var(--success)' : 'inherit' }}>
                {hasLower ? '✓' : '•'} 1 Lowercase letter
              </span>
              <span style={{ color: hasDigit ? 'var(--success)' : 'inherit' }}>
                {hasDigit ? '✓' : '•'} 1 Digit number
              </span>
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-sm text-muted" style={{ marginTop: '24px', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '600' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
