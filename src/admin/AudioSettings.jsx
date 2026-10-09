import { useCallback, useEffect, useRef, useState } from 'react';
import { CircleAlert, CircleCheck, FileAudio, LoaderCircle, Pause, Play, RotateCcw, Upload } from 'lucide-react';
import { api, uploadFile } from './api';
import { AUDIO_SLOTS, refreshAudioConfig, resolveAudio } from '../audio/audioConfig';
import { playPreview, stopPreview } from '../audio/audioManager';
import { btnDanger, btnGhost, btnPrimary, cardClass, ConfirmDialog, fmtDate, Skeleton } from './ui';

const MIN_BYTES = 1024;
const fmtSize = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

function Notice({ kind, children }) {
  const ok = kind === 'success';
  const Icon = ok ? CircleCheck : CircleAlert;
  return (
    <p role={ok ? 'status' : 'alert'} className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${ok ? 'border-success/40 bg-success/10' : 'border-red-400/30 bg-red-500/10'}`}>
      <Icon size={16} aria-hidden="true" className={`mt-0.5 shrink-0 ${ok ? 'text-success' : 'text-red-300'}`} /> <span>{children}</span>
    </p>
  );
}

function SlotCard({ slot, state, maxBytes, onChanged }) {
  const def = AUDIO_SLOTS[slot];
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [blobUrl, setBlobUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(null); // null = idle, 0-100 = uploading
  const [msg, setMsg] = useState(null); // { kind, text }
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (blobUrl) URL.revokeObjectURL(blobUrl); }, [blobUrl]);
  useEffect(() => () => stopPreview(), []);

  const current = state.custom
    ? { filename: state.filename, detail: `Uploaded ${fmtSize(state.size)}, ${fmtDate(state.updatedAt)}` }
    : { filename: def.defaultName, detail: 'Bundled default' };

  function choose(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    setMsg(null);
    if (!f) return;
    stopPreview();
    if (!/\.mp3$/i.test(f.name) || (f.type && !/^audio\/(mpeg|mp3)$/.test(f.type))) {
      setFile(null); setBlobUrl('');
      return setMsg({ kind: 'error', text: 'Only MP3 files (.mp3, audio/mpeg) are allowed.' });
    }
    if (f.size < MIN_BYTES) { setFile(null); setBlobUrl(''); return setMsg({ kind: 'error', text: 'That file is too small to be a valid MP3.' }); }
    if (f.size > maxBytes) { setFile(null); setBlobUrl(''); return setMsg({ kind: 'error', text: `File is ${fmtSize(f.size)}; the maximum is ${fmtSize(maxBytes)}.` }); }
    setFile(f);
    setBlobUrl(URL.createObjectURL(f));
  }

  async function togglePreview() {
    if (playing) return stopPreview();
    setMsg(null);
    setPlaying(true);
    const ok = await playPreview(blobUrl || resolveAudio(slot).url, () => setPlaying(false));
    if (!ok) { setPlaying(false); setMsg({ kind: 'error', text: 'Your browser could not play this file.' }); }
  }

  async function save() {
    stopPreview();
    setMsg(null);
    setProgress(0);
    try {
      await uploadFile(`/audio/${slot}`, file, { onProgress: setProgress });
      setMsg({ kind: 'success', text: `Saved. "${file.name}" is now the ${def.label.toLowerCase()}.` });
      setFile(null); setBlobUrl('');
      await onChanged();
    } catch (err) {
      setMsg({ kind: 'error', text: err.message });
    } finally {
      setProgress(null);
    }
  }

  async function restore() {
    setBusy(true);
    try {
      await api(`/audio/${slot}`, { method: 'DELETE' });
      setConfirmRestore(false);
      setFile(null); setBlobUrl('');
      setMsg({ kind: 'success', text: `Restored the default (${def.defaultName}).` });
      await onChanged();
    } catch (err) {
      setConfirmRestore(false);
      setMsg({ kind: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  const uploading = progress !== null;

  return (
    <section className={`${cardClass} p-5 sm:p-6`} aria-labelledby={`${slot}-title`}>
      <h2 id={`${slot}-title`} className="text-lg font-semibold">{def.label}</h2>
      <p className="mt-1 text-sm text-muted">{def.description}</p>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-bg/40 p-3">
        <span className="rounded-lg bg-primary/10 p-2.5 text-primary"><FileAudio size={18} aria-hidden="true" /></span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium" data-testid={`${slot}-current`}>{current.filename}</p>
          <p className="text-xs text-muted">Current: {current.detail}</p>
        </div>
      </div>

      <div className="mt-4">
        <input ref={inputRef} type="file" accept=".mp3,audio/mpeg" onChange={choose} className="sr-only" id={`${slot}-file`} data-testid={`${slot}-input`} />
        <label htmlFor={`${slot}-file`} className={`${btnGhost} cursor-pointer`}>
          <Upload size={16} aria-hidden="true" /> {file ? 'Choose a different MP3' : 'Choose replacement MP3'}
        </label>
        <p className="mt-2 text-xs text-muted">MP3 only, up to {fmtSize(maxBytes)}.</p>
        {file && (
          <p className="mt-3 rounded-lg border border-accent/40 bg-primary/5 px-3 py-2 text-sm" data-testid={`${slot}-selected`}>
            Ready to save: <span className="font-medium">{file.name}</span> <span className="text-muted">({fmtSize(file.size)})</span>
          </p>
        )}
      </div>

      {uploading && (
        <div className="mt-4" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">Uploading {progress}%</p>
        </div>
      )}
      {msg && <div className="mt-4"><Notice kind={msg.kind}>{msg.text}</Notice></div>}

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={togglePreview} disabled={uploading} className={btnGhost}>
          {playing ? <><Pause size={16} aria-hidden="true" /> Stop preview</> : <><Play size={16} aria-hidden="true" /> Play Preview</>}
        </button>
        <button type="button" onClick={save} disabled={!file || uploading} className={btnPrimary}>
          {uploading ? <><LoaderCircle size={16} aria-hidden="true" className="motion-safe:animate-spin" /> Saving...</> : 'Save Changes'}
        </button>
        <button type="button" onClick={() => setConfirmRestore(true)} disabled={!state.custom || uploading} className={btnDanger}>
          <RotateCcw size={16} aria-hidden="true" /> Restore Default
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">{file ? 'Preview plays the new file you selected.' : 'Preview plays the file that is active now.'}</p>

      <ConfirmDialog
        open={confirmRestore}
        title="Restore default audio?"
        text={`The uploaded file will be removed and the bundled ${def.defaultName} will be used again.`}
        confirmLabel="Restore default"
        busy={busy}
        onConfirm={restore}
        onClose={() => setConfirmRestore(false)}
      />
    </section>
  );
}

export default function AudioSettings() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setData(await api('/audio'));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // After any change: re-read the admin view and refresh this tab's playback config.
  const onChanged = useCallback(async () => {
    await load();
    await refreshAudioConfig();
  }, [load]);

  return (
    <>
      <h1 className="text-3xl font-semibold">Audio &amp; Welcome Experience Settings</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Replace the sounds used on the website and in this panel. Uploaded files are stored in your MongoDB database and the active
        choice is saved there too, so changes survive refreshes and redeploys and apply to every visitor right away.
      </p>

      {error && (
        <p role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-surface p-4 text-sm">
          <CircleAlert aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-primary-text" /> {error}
          <button type="button" onClick={load} className="ml-auto underline">Retry</button>
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {data ? (
          <>
            <SlotCard slot="welcome" state={data.welcome} maxBytes={data.maxBytes} onChanged={onChanged} />
            <SlotCard slot="admin" state={data.admin} maxBytes={data.maxBytes} onChanged={onChanged} />
          </>
        ) : (
          !error && [0, 1].map((i) => (
            <div key={i} className={`${cardClass} space-y-3 p-6`}>
              <Skeleton className="h-5 w-1/2" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-14 w-full" /><Skeleton className="h-10 w-1/2" />
            </div>
          ))
        )}
      </div>

      <section className={`${cardClass} mt-6 p-5 text-sm text-muted sm:p-6`}>
        <h2 className="text-base font-semibold text-ink">About the welcome popup</h2>
        <p className="mt-2">
          The welcome popup appears on the homepage and closes automatically after 10 seconds (visitors can also use Close or Let&apos;s Explore).
          The website sound plays only there, and the admin sound plays only after a successful administrator login. They never play at the same time.
        </p>
      </section>
    </>
  );
}
