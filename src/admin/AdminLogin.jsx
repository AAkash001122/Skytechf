import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { playAdminWelcome, preloadAdminAudio } from '../audio/audioManager';
import AuthShell, { inputClass, Notice, primaryBtn } from './AuthShell';

export default function AdminLogin() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { preloadAdminAudio(); }, []);

  const from = location.state?.from;
  const target = typeof from === 'string' && from.startsWith('/admin') ? from : '/admin/dashboard';
  if (admin) return <Navigate to={target} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email.trim(), password);
      playAdminWelcome(); // only reached after the admin endpoint accepted the credentials
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage messages and replies."
      footer={<Link to="/" className="hover:text-ink">Back to website</Link>}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input id="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" className={inputClass} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <Link to="/admin/forgot-password" className="text-xs text-primary-text hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-muted hover:text-ink"
            >
              {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
        {error && <Notice>{error}</Notice>}
        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy ? (<><LoaderCircle size={18} aria-hidden="true" className="motion-safe:animate-spin" /> Signing in...</>) : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}
