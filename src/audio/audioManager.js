import { AUDIO_SLOTS, audioConfigReady, isAudioConfigSettled, loadAudioConfig, resolveAudio } from './audioConfig';

/**
 * Playback engine (what plays, when). Which file plays is decided in audioConfig.js.
 *
 * Module-level state, so playback is independent of React renders, Strict Mode double effects and route changes.
 *  - Only one sound plays at a time (starting one stops the others, including admin previews).
 *  - The welcome sound plays at most once per page load.
 *  - Autoplay refusal is reported (promise resolves false) so callers can retry after a user gesture.
 */
const tracks = {}; // slot -> { audio, url, custom }
let preview = null;

loadAudioConfig().then(() => { getTrack('welcome'); }); // fetch settings at startup and preload the welcome file

function getTrack(slot) {
  const { url, custom } = resolveAudio(slot);
  let t = tracks[slot];
  if (!t || t.url !== url) {
    if (t) t.audio.pause();
    const audio = new Audio(url);
    audio.preload = 'auto';
    t = { audio, url, custom };
    tracks[slot] = t;
  }
  return t;
}

const stop = (audio) => {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
};

/** true = playing, false = blocked by the browser's autoplay policy (or unusable). Falls back to the bundled file if an uploaded one fails to load. */
async function startTrack(slot) {
  stopPreview();
  let t = getTrack(slot);
  t.audio.currentTime = 0;
  try {
    await t.audio.play();
    return true;
  } catch (err) {
    if (err?.name === 'NotAllowedError' || !t.custom) return false;
    const def = AUDIO_SLOTS[slot];
    t.audio.pause();
    t = { audio: new Audio(def.defaultUrl), url: def.defaultUrl, custom: false };
    tracks[slot] = t;
    try {
      await t.audio.play();
      return true;
    } catch {
      return false;
    }
  }
}

// ---------------------------------------------------------------- public welcome sound
let welcomePromise = null; // shared by every caller, so concurrent calls never start a second playback
let welcomeSuppressed = false; // set by Close/Skip or admin audio: no welcome sound for the rest of this page load

/** Resolves true if the welcome sound is playing/has played, false if blocked (safe to retry on a user gesture). */
export function playWelcome() {
  if (welcomeSuppressed) return Promise.resolve(false);
  if (welcomePromise) return welcomePromise;
  const go = () => {
    if (welcomeSuppressed || (tracks.admin && !tracks.admin.audio.paused)) return Promise.resolve(false);
    return startTrack('welcome');
  };
  // When the settings are already loaded start synchronously, so a click-triggered retry stays inside the user gesture.
  const started = isAudioConfigSettled() ? go() : audioConfigReady().then(go);
  welcomePromise = started.then((ok) => {
    if (!ok) welcomePromise = null; // blocked: allow a retry after a user gesture
    return ok;
  });
  return welcomePromise;
}

export function stopWelcome() {
  welcomeSuppressed = true;
  stop(tracks.welcome?.audio);
}

export function setWelcomeMuted(muted) {
  if (tracks.welcome) tracks.welcome.audio.muted = muted;
  else getTrack('welcome').audio.muted = muted;
}

// ---------------------------------------------------------------- admin login sound
/** Call once, right after a successful admin login (a user gesture, so autoplay is allowed). */
export function playAdminWelcome() {
  welcomeSuppressed = true; // never let the public welcome overlap or start after this
  stop(tracks.welcome?.audio);
  if (tracks.admin && !tracks.admin.audio.paused) return; // already playing: ignore double submits
  const go = () => startTrack('admin');
  (isAudioConfigSettled() ? go() : audioConfigReady().then(go)).catch(() => {});
}

/** Warm the admin file while the login form is on screen. */
export function preloadAdminAudio() {
  loadAudioConfig().then(() => { getTrack('admin'); });
}

// ---------------------------------------------------------------- admin settings page: previews
/** Plays any URL (an uploaded blob, or the current file) for the audio settings page; stops everything else first. */
export function playPreview(url, onEnd) {
  stopPreview();
  stop(tracks.welcome?.audio);
  stop(tracks.admin?.audio);
  const audio = new Audio(url);
  preview = { audio, onEnd };
  audio.addEventListener('ended', () => { if (preview?.audio === audio) { preview = null; onEnd?.(); } });
  return audio.play().then(() => true).catch(() => { preview = null; return false; });
}

export function stopPreview() {
  if (!preview) return;
  const { audio, onEnd } = preview;
  preview = null;
  stop(audio);
  onEnd?.();
}
