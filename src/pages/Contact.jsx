import { useState } from 'react';
import { CalendarDays, CircleAlert, CircleCheck, LoaderCircle, Mail, MapPin, MessageCircle } from 'lucide-react';
import { budgetRanges, projectTypes, site, whatsappLink } from '../config/site';
import Seo from '../components/Seo';
import Section, { SectionHeading } from '../components/Section';
import Button from '../components/Button';

const API_URL = import.meta.env.VITE_API_URL ?? '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-\s\d]{7,20}$/;
const empty = { name: '', email: '', phone: '', projectType: '', budget: '', message: '' };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.';
  if (!v.projectType) e.projectType = 'Please choose a project type.';
  if (v.message.trim().length < 10) e.message = 'Please tell us a little more (at least 10 characters).';
  return e;
}

const inputClass =
  'mt-2 w-full rounded-xl border bg-surface px-4 py-3 text-ink placeholder:text-muted/70 focus-visible:outline-primary';

function Field({ id, label, error, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-ink/90">{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: set,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: `${inputClass} ${errors[name] ? 'border-ink/70' : 'border-line'}`,
  });

  async function onSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || 'Request failed');
      }
      setValues(empty);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const { contact } = site;

  return (
    <>
      <Seo
        title="Contact"
        description="Tell SkyTech about your project. Get a free quote by form, WhatsApp, email or a booked call. We reply within one working day."
        path="/contact"
      />
      <Section bg="network">
        <SectionHeading
          eyebrow="Contact"
          title="Tell us about your project"
          text="Share a few details and we will reply within one working day with next steps and a clear quote."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {status === 'success' ? (
            <div role="status" className="rounded-2xl border border-success/50 bg-surface p-8">
              <CircleCheck aria-hidden="true" className="text-success" size={36} />
              <h2 className="mt-4 text-2xl font-semibold">Thanks, we have your message</h2>
              <p className="mt-2 text-muted">We will get back to you within one working day. In a hurry? Message us on WhatsApp.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={whatsappLink()}>Chat on WhatsApp</Button>
                <Button variant="secondary" onClick={() => setStatus('idle')}>Send another message</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-line bg-surface/50 p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Name" required error={errors.name}>
                  <input {...fieldProps('name')} type="text" autoComplete="name" placeholder="Your name" />
                </Field>
                <Field id="email" label="Email" required error={errors.email}>
                  <input {...fieldProps('email')} type="email" autoComplete="email" placeholder="you@company.com" />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="phone" label="Phone / WhatsApp" error={errors.phone}>
                  <input {...fieldProps('phone')} type="tel" autoComplete="tel" placeholder="+91 98765 43210" />
                </Field>
                <Field id="projectType" label="Project type" required error={errors.projectType}>
                  <select {...fieldProps('projectType')}>
                    <option value="">Select a type</option>
                    {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <Field id="budget" label="Budget range">
                <select {...fieldProps('budget')}>
                  <option value="">Select a range</option>
                  {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field id="message" label="About your project" required error={errors.message}>
                <textarea {...fieldProps('message')} rows={5} placeholder="What are you building, and what does success look like?" />
              </Field>

              {status === 'error' && (
                <p role="alert" className="flex items-start gap-3 rounded-xl border border-line bg-bg p-4 text-sm">
                  <CircleAlert aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-primary-text" />
                  <span>
                    We could not send your message. Please try again, or reach us on{' '}
                    <a className="text-primary-text underline" href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>{' '}
                    or at <a className="text-primary-text underline" href={`mailto:${contact.email}`}>{contact.email}</a>.
                  </span>
                </p>
              )}

              <Button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
                {status === 'sending' ? (<><LoaderCircle size={18} aria-hidden="true" className="motion-safe:animate-spin" /> Sending...</>) : 'Start your project'}
              </Button>
            </form>
          )}

          <aside aria-label="Other ways to reach us" className="space-y-4">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-hover flex items-center gap-4 rounded-2xl border border-line bg-surface p-5"
            >
              <MessageCircle aria-hidden="true" className="text-primary" />
              <span><span className="block font-semibold">WhatsApp</span><span className="text-sm text-muted">{contact.phone}</span></span>
            </a>
            <a href={`mailto:${contact.email}`} className="glow-hover flex items-center gap-4 rounded-2xl border border-line bg-surface p-5">
              <Mail aria-hidden="true" className="text-primary" />
              <span className="min-w-0"><span className="block font-semibold">Email</span><span className="break-all text-sm text-muted">{contact.email}</span></span>
            </a>
            <a
              href={contact.bookCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-hover flex items-center gap-4 rounded-2xl border border-line bg-surface p-5"
            >
              <CalendarDays aria-hidden="true" className="text-primary" />
              <span><span className="block font-semibold">Book a call</span><span className="text-sm text-muted">Pick a time that suits you</span></span>
            </a>
            <p className="flex items-center gap-3 px-1 text-sm text-muted">
              <MapPin size={18} aria-hidden="true" className="text-primary-text" />{contact.location}
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
