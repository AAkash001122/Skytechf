import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { api } from './api';
import { inputClass, Notice, primaryBtn } from './AuthShell';

export default function ChangePassword() {
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setDone(false);
    if (newPassword.length < 10 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return setError('Use at least 10 characters with a letter and a number.');
    }
    if (newPassword !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    try {
      await api('/change-password', { method: 'POST', body: { currentPassword, newPassword } });
      setDone(true);
      setCurrent(''); setNew(''); setConfirm('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-semibold">Change password</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-2xl border border-line bg-surface/50 p-6">
        <div>
          <label htmlFor="current" className="block text-sm font-medium">Current password</label>
          <input id="current" type="password" required autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="new" className="block text-sm font-medium">New password</label>
          <input id="new" type="password" required autoComplete="new-password" value={newPassword} onChange={(e) => setNew(e.target.value)} className={inputClass} />
          <p className="mt-1.5 text-xs text-muted">At least 10 characters, with a letter and a number.</p>
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium">Confirm new password</label>
          <input id="confirm" type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
        </div>
        {error && <Notice>{error}</Notice>}
        {done && <Notice kind="success">Password changed.</Notice>}
        <button type="submit" disabled={busy} className={`${primaryBtn} sm:w-auto`}>
          {busy ? (<><LoaderCircle size={18} aria-hidden="true" className="motion-safe:animate-spin" /> Saving...</>) : 'Update password'}
        </button>
      </form>
    </div>
  );
}
