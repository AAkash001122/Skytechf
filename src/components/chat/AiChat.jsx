import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Building2, Cpu, FileText, Layers, Mail, MessageCircle, SendHorizontal, Sparkles, X } from 'lucide-react';
import { detectIntent, quickActions, reply, welcome } from '../../config/assistant';
import { whatsappLink } from '../../config/site';
import TypedText from './TypedText';

const actionIcons = { Layers, Cpu, FileText, Mail, Building2 };
const chipClass =
  'inline-flex items-center gap-2 rounded-full border border-accent/40 px-3.5 py-1.5 text-xs font-semibold text-primary-text transition-colors hover:border-accent hover:bg-accent/10 hover:text-ink';

let nextId = 0;
const makeId = () => `m${nextId++}`;

function Launcher({ open, onClick, hint }) {
  return (
    <div className="fixed bottom-5 right-3 z-50 sm:right-5">
      <AnimatePresence>
        {hint && !open && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="glass pointer-events-none absolute right-[4.75rem] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-ink/15 px-3 py-2 text-xs font-semibold shadow-lg shadow-bg/50"
          >
            Ask our AI assistant
          </motion.span>
        )}
      </AnimatePresence>

      <div className={open ? '' : 'float-y'}>
        <button
          type="button"
          onClick={onClick}
          aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
          aria-expanded={open}
          aria-controls="ai-chat-panel"
          className="group relative flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 focus-visible:outline-ink"
        >
          {/* rotating gradient ring */}
          <span
            aria-hidden="true"
            className="spin-slow absolute inset-0 rounded-full"
            style={{ '--d': '8s', background: 'conic-gradient(from 0deg, var(--color-primary), var(--color-blue), var(--color-primary))' }}
          />
          {/* soft pulse */}
          {!open && <span aria-hidden="true" className="absolute inset-0 rounded-full border border-accent/50 motion-safe:animate-ping" />}
          {/* orbiting data particles */}
          <span aria-hidden="true" className="orbit-spin pointer-events-none absolute -inset-2" style={{ '--d': '6s' }}>
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent" />
            <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-primary-text" />
            <span className="absolute bottom-1 left-1 h-1 w-1 rounded-full bg-primary-text" />
          </span>
          <span className="relative flex h-[calc(100%-4px)] w-[calc(100%-4px)] items-center justify-center rounded-full bg-surface shadow-lg shadow-bg/60">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'ai'}
                initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                className="text-primary"
              >
                {open ? <X size={24} aria-hidden="true" /> : <Sparkles size={26} aria-hidden="true" />}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>
      </div>
    </div>
  );
}

function Bubble({ msg, onTick, onDone, onNavigate }) {
  const ai = msg.role === 'ai';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col gap-2 ${ai ? 'items-start' : 'items-end'}`}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          ai ? 'rounded-bl-md bg-ink/10 text-ink' : 'rounded-br-md bg-primary font-medium text-bg'
        }`}
      >
        {ai ? <TypedText text={msg.text} instant={msg.done} onTick={onTick} onDone={() => onDone(msg.id)} /> : msg.text}
      </div>
      {ai && msg.done && msg.links?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {msg.links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} onClick={onNavigate} className={chipClass}>{l.label}</Link>
            ) : (
              <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={chipClass}>
                {l.label}
              </a>
            )
          )}
        </div>
      )}
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div aria-hidden="true" className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md bg-ink/[0.08] px-4 py-3.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

export default function AiChat() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);

  const later = (fn, ms) => {
    const id = setTimeout(fn, reduce ? 0 : ms);
    timers.current.push(id);
  };

  const scroll = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const answer = useCallback((r) => {
    setBusy(true);
    setThinking(true);
    later(() => {
      setThinking(false);
      setMessages((m) => [...m, { id: makeId(), role: 'ai', text: r.text, links: r.links, done: reduce }]);
      if (reduce) setBusy(false);
    }, 650);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const ask = (text, intent) => {
    const clean = text.trim();
    if (!clean || busy) return;
    setMessages((m) => [...m, { id: makeId(), role: 'user', text: clean }]);
    answer(reply(intent ?? detectIntent(clean)));
  };

  const markDone = useCallback((id) => {
    setMessages((m) => m.map((x) => (x.id === id && !x.done ? { ...x, done: true } : x)));
    setBusy(false);
  }, []);

  // greet on first open
  useEffect(() => {
    if (open && messages.length === 0 && !busy) answer({ text: welcome });
  }, [open, messages.length, busy, answer]);

  useEffect(scroll, [messages, thinking, busy, scroll]);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    const show = setTimeout(() => setHint(true), 4000);
    const hide = setTimeout(() => setHint(false), 12000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onSubmit = (e) => {
    e.preventDefault();
    ask(input);
    setInput('');
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            id="ai-chat-panel"
            role="dialog"
            aria-label="AI assistant chat"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ transformOrigin: 'bottom right' }}
            className="glass fixed bottom-24 left-3 right-3 z-50 flex h-[min(34rem,calc(100dvh-7.5rem))] flex-col overflow-hidden rounded-3xl border border-ink/15 bg-bg/90 shadow-2xl shadow-bg/70 sm:left-auto sm:right-5 sm:w-[24rem]"
          >
            <header className="relative flex items-center gap-3 border-b border-ink/10 px-4 py-3.5">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-primary">
                <Sparkles size={20} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-base font-semibold leading-tight">AI Assistant</h2>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  Online
                </p>
              </div>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with our team on WhatsApp"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-ink/10 hover:text-ink"
              >
                <MessageCircle size={18} aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-ink/10 hover:text-ink"
              >
                <X size={18} aria-hidden="true" />
              </button>
              <span aria-hidden="true" className="data-flow absolute inset-x-0 bottom-0 h-px opacity-30" />
            </header>

            <div ref={listRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <Bubble key={m.id} msg={m} onTick={scroll} onDone={markDone} onNavigate={() => setOpen(false)} />
              ))}
              {thinking && <TypingDots />}
              {!busy && messages.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 pt-1">
                  {quickActions.map((a) => {
                    const Icon = actionIcons[a.icon];
                    return (
                      <button key={a.label} type="button" onClick={() => ask(a.label, a.intent)} className={chipClass}>
                        <Icon size={14} aria-hidden="true" />{a.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>

            <form onSubmit={onSubmit} className="border-t border-ink/10 p-3">
              <div className="flex items-center gap-2">
                <label htmlFor="ai-chat-input" className="sr-only">Message the AI assistant</label>
                <input
                  id="ai-chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={300}
                  autoComplete="off"
                  placeholder="Ask about services, pricing..."
                  className="min-w-0 flex-1 rounded-full border border-ink/15 bg-bg/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/80 focus-visible:outline-primary"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-bg transition-colors hover:bg-primary/85 disabled:opacity-40 disabled:hover:bg-primary"
                >
                  <SendHorizontal size={18} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 px-1 text-center text-[11px] text-muted">
                Automated assistant. Our team replies to every enquiry within one working day.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <Launcher open={open} onClick={() => setOpen((v) => !v)} hint={hint} />
    </>
  );
}
