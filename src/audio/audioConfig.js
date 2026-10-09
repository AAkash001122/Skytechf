/**
 * ONE PLACE for the site's two sounds.
 *
 *   welcome  ->  src/assets/skyteck.mp3   plays once in the public welcome popup
 *   admin    ->  src/assets/admin.mp3     plays once after a successful administrator login
 *
 * How to change a sound
 *   1. No code needed:  Admin panel -> "Audio & Welcome Experience" -> upload an MP3 -> Save Changes.
 *      The file is stored in MongoDB (GridFS), the choice is saved in the database, and every visitor gets it
 *      immediately, including after a frontend redeploy. "Restore Default" goes back to the bundled files below.
 *   2. Change the bundled defaults:  replace the two files in src/assets/ keeping the same names
 *      (or point the imports below at new files).
 *
 * Playback rules (single-play, never overlapping, autoplay handling) live in audioManager.js.
 */
import welcomeDefault from '../assets/skyteck.mp3';
import adminDefault from '../assets/admin.mp3';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export const AUDIO_SLOTS = {
  welcome: {
    label: 'Website Welcome Audio',
    description: 'Plays when a visitor opens the homepage (the welcome popup).',
    defaultUrl: welcomeDefault,
    defaultName: 'skyteck.mp3',
  },
  admin: {
    label: 'Admin Login Audio',
    description: 'Plays once after an administrator signs in successfully.',
    defaultUrl: adminDefault,
    defaultName: 'admin.mp3',
  },
};

let config = null; // last settings from the server (null until loaded or if the server is unreachable)
let loading = null;
let settled = false; // true once the first settings request has finished (success or failure)

/** Fetches the active audio settings. Never throws: on any failure the bundled defaults are used. */
export function loadAudioConfig() {
  if (!loading) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    loading = fetch(`${API_URL}/api/settings/audio`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.ok) config = d; return config; })
      .catch(() => null)
      .finally(() => { clearTimeout(timer); settled = true; });
  }
  return loading;
}

/** Call after an admin saves or restores audio so this tab picks up the change. */
export function refreshAudioConfig() {
  loading = null;
  return loadAudioConfig();
}

export const isAudioConfigSettled = () => settled;

/** Resolves when the config is known, or after `ms` so playback never waits long on a slow API. */
export function audioConfigReady(ms = 1200) {
  return Promise.race([loadAudioConfig(), new Promise((res) => setTimeout(res, ms))]);
}

/** { url, custom, filename } for a slot: the uploaded file if one is configured, else the bundled default. */
export function resolveAudio(slot) {
  const def = AUDIO_SLOTS[slot];
  const s = config?.[slot];
  if (s?.custom) {
    return { url: `${API_URL}/api/settings/audio/${slot}?v=${s.version}`, custom: true, filename: s.filename };
  }
  return { url: def.defaultUrl, custom: false, filename: def.defaultName };
}

export const getAudioConfig = () => config;
