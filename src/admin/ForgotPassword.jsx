import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { api } from './api';
import AuthShell, { inputClass, Notice, primaryBtn } from './AuthShell';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const d = await api('/forgot-password', { method: 'POST', body: { email: email.trim() } });
      setDone(d.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your admin email and we will send you a reset link."
      footer={<Link to="/admin/login" className="hover:text-ink">Back to sign in</Link>}
    >
      {done ? (
        <Notice kind="success">{done} The link is valid for 30 minutes.</Notice>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          {error && <Notice>{error}</Notice>}
          <button type="submit" disabled={busy} className={primaryBtn}>
            {busy ? (<><LoaderCircle size={18} aria-hidden="true" className="motion-safe:animate-spin" /> Sending...</>) : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
