import { useEffect, useState } from 'react';

const TYPE_MS = 32;
const OUT_MS = 260;
const HOLD_MS = 2200;

/**
 * Fake terminal that types commands, prints their output and loops. Pure decoration (aria-hidden):
 * the scripts are made-up build/deploy/scan output. With `animate` false it renders the finished script.
 */
export default function Terminal({ title, lines, rows = 8, animate = true, className = '' }) {
  const [state, setState] = useState(() => (animate ? { done: [], cur: '' } : { done: lines.slice(-rows), cur: '' }));

  useEffect(() => {
    if (!animate) return undefined;
    let cancelled = false;
    let timer;
    const wait = (ms) => new Promise((res) => { timer = setTimeout(res, ms); });

    (async () => {
      while (!cancelled) {
        setState({ done: [], cur: '' });
        for (const line of lines) {
          if (cancelled) return;
          if (line.t === 'cmd') {
            for (let i = 1; i <= line.s.length; i++) {
              if (cancelled) return;
              setState((st) => ({ ...st, cur: line.s.slice(0, i) }));
              await wait(TYPE_MS + Math.random() * 40);
            }
            await wait(180);
            setState((st) => ({ done: [...st.done, line], cur: '' }));
          } else {
            await wait(OUT_MS);
            setState((st) => ({ ...st, done: [...st.done, line] }));
          }
        }
        await wait(HOLD_MS);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [animate, lines]);

  const visible = state.done.slice(-(rows - (state.cur !== '' || animate ? 1 : 0)));

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden rounded-xl border border-blue-400/30 bg-[#06102A]/80 font-mono text-[11px] leading-5 shadow-[0_0_30px_-8px_rgba(37,99,235,0.7)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-blue-400/20 bg-blue-500/10 px-3 py-1.5">
        <span className="size-2 rounded-full bg-red-400/80" />
        <span className="size-2 rounded-full bg-yellow-300/80" />
        <span className="size-2 rounded-full bg-green-400/80" />
        <span className="ml-2 truncate text-[10px] tracking-wide text-blue-200/70">{title}</span>
      </div>
      <div className="px-3 py-2" style={{ height: `${rows * 1.25 + 1}rem` }}>
        {visible.map((l, i) =>
          l.t === 'cmd' ? (
            <p key={`${i}-${l.s}`} className="whitespace-pre text-green-300"><span className="text-blue-400">$ </span>{l.s}</p>
          ) : (
            <p key={`${i}-${l.s}`} className={`whitespace-pre ${l.c ?? 'text-green-400/70'}`}>{l.s}</p>
          )
        )}
        {animate && (
          <p className="whitespace-pre text-green-300">
            <span className="text-blue-400">$ </span>{state.cur}<span className="caret ml-px inline-block h-3.5 w-1.5 translate-y-0.5 bg-green-300" />
          </p>
        )}
      </div>
    </div>
  );
}

export const scriptBuild = [
  { t: 'cmd', s: 'git pull origin main' },
  { t: 'out', s: 'remote: Enumerating objects: 128, done.' },
  { t: 'cmd', s: 'npm run build' },
  { t: 'out', s: 'vite building for production...' },
  { t: 'out', s: '✓ 142 modules transformed.', c: 'text-green-300' },
  { t: 'cmd', s: 'docker compose up -d' },
  { t: 'out', s: '✔ api   ✔ db   ✔ web   running', c: 'text-green-300' },
];

export const scriptScan = [
  { t: 'cmd', s: 'nmap -sV --script vuln edge-01' },
  { t: 'out', s: '443/tcp open  https  (TLSv1.3)' },
  { t: 'out', s: '| ssl-enum-ciphers: grade A', c: 'text-blue-300' },
  { t: 'cmd', s: './audit --deps --strict' },
  { t: 'out', s: '0 vulnerabilities found', c: 'text-green-300' },
  { t: 'cmd', s: 'deploy --prod --region mum-1' },
  { t: 'out', s: '✔ deployed in 12.4s', c: 'text-green-300' },
];

export const scriptCloud = [
  { t: 'cmd', s: 'terraform apply -auto-approve' },
  { t: 'out', s: 'Apply complete! 6 added, 0 destroyed.', c: 'text-green-300' },
  { t: 'cmd', s: 'kubectl get pods -n prod' },
  { t: 'out', s: 'api-7f9c   1/1   Running   0   4d' },
  { t: 'out', s: 'web-5d2b   1/1   Running   0   4d' },
  { t: 'cmd', s: 'aws s3 sync ./dist s3://skytech-cdn' },
  { t: 'out', s: 'upload: 142 files  ✔', c: 'text-green-300' },
];

export const scriptSecurity = [
  { t: 'cmd', s: 'sudo ufw status verbose' },
  { t: 'out', s: 'Status: active  (deny incoming)' },
  { t: 'cmd', s: 'trivy image skytech/api:latest' },
  { t: 'out', s: 'Total: 0 (HIGH: 0, CRITICAL: 0)', c: 'text-green-300' },
  { t: 'cmd', s: 'fail2ban-client status sshd' },
  { t: 'out', s: 'Currently banned: 0   Total: 17' },
  { t: 'cmd', s: 'openssl s_client -connect skytech.dev:443' },
  { t: 'out', s: 'TLSv1.3  Verify return code: 0 (ok)', c: 'text-green-300' },
];
