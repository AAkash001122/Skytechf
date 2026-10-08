import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { api } from './api';
import AuthShell, { inputClass, Notice, primaryBtn } from './AuthShell';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 10 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return setError('Use at least 10 characters with a letter and a number.');
    }
    if (password !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    try {
      await api('/reset-password', { method: 'POST', body: { email, token, password } });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const footer = <Link to="/admin/login" className="hover:text-ink">Back to sign in</Link>;

  if (!token || !email) {
    return (
      <AuthShell title="Reset password" footer={<Link to="/admin/forgot-password" className="hover:text-ink">Request a new link</Link>}>
        <Notice>This reset link is incomplete. Request a new one.</Notice>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set a new password" subtitle={email} footer={footer}>
      {done ? (
        <div className="space-y-5">
          <Notice kind="success">Password updated. You can now sign in.</Notice>
          <Link to="/admin/login" className={primaryBtn}>Go to sign in</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium">New password</label>
            <input id="password" type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            <p className="mt-1.5 text-xs text-muted">At least 10 characters, with a letter and a number.</p>
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium">Confirm password</label>
            <input id="confirm" type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
          </div>
          {error && <Notice>{error}</Notice>}
          <button type="submit" disabled={busy} className={primaryBtn}>
            {busy ? (<><LoaderCircle size={18} aria-hidden="true" className="motion-safe:animate-spin" /> Saving...</>) : 'Update password'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
