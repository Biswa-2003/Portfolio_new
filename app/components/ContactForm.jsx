'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MessageSquare, Edit3, Send, Lock, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm({ onInteractionChange, onTransmittingChange }) {
  const [status, setStatus] = useState({ type: 'idle', msg: '' });
  const [pending, setPending] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (pending) return;

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const name = form.get('name')?.toString().trim();
    const email = form.get('email')?.toString().trim();
    const channel = form.get('channel')?.toString().trim() || 'Project Collaboration';
    const message = form.get('message')?.toString().trim();

    if (!name || !email || !message) {
      setStatus({ type: 'error', msg: 'System check: Please complete all required telemetry fields.' });
      return;
    }

    setPending(true);
    onTransmittingChange?.(true);
    setStatus({ type: 'loading', msg: 'Transmitting encrypted payload across quantum relay...' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, channel, message }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) throw new Error(data.error || 'Transmission failed.');

      formEl.reset();
      startedAt.current = Date.now();
      setStatus({ type: 'success', msg: 'Transmission confirmed! Payload safely received.' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Error executing transmission.' });
    } finally {
      setPending(false);
      onTransmittingChange?.(false);
    }
  }

  const handleFocus = () => onInteractionChange?.(true);
  const handleBlur = () => {
    setTimeout(() => onInteractionChange?.(false), 300);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="position-relative z-1">
      <div className="row g-4">
        {/* Field 1: Registry Identifier */}
        <div className="col-md-6">
          <label
            htmlFor="c_name"
            className="d-block mb-2 text-uppercase fw-semibold"
            style={{
              fontSize: '0.74rem',
              letterSpacing: '0.12em',
              color: '#93c5fd',
              fontFamily: 'monospace',
            }}
          >
            Registry Identifier
          </label>
          <div className="position-relative">
            <span
              className="position-absolute top-50 translate-middle-y"
              style={{ left: '16px', color: '#60a5fa', pointerEvents: 'none', display: 'flex' }}
            >
              <User size={18} />
            </span>
            <input
              id="c_name"
              name="name"
              type="text"
              placeholder="Your Name"
              className="form-control cyber-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              disabled={pending}
            />
          </div>
        </div>

        {/* Field 2: Communication Protocol */}
        <div className="col-md-6">
          <label
            htmlFor="c_email"
            className="d-block mb-2 text-uppercase fw-semibold"
            style={{
              fontSize: '0.74rem',
              letterSpacing: '0.12em',
              color: '#93c5fd',
              fontFamily: 'monospace',
            }}
          >
            Communication Protocol
          </label>
          <div className="position-relative">
            <span
              className="position-absolute top-50 translate-middle-y"
              style={{ left: '16px', color: '#60a5fa', pointerEvents: 'none', display: 'flex' }}
            >
              <Mail size={18} />
            </span>
            <input
              id="c_email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className="form-control cyber-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              disabled={pending}
            />
          </div>
        </div>

        {/* Field 3: Channel Selector */}
        <div className="col-12">
          <label
            htmlFor="c_channel"
            className="d-block mb-2 text-uppercase fw-semibold"
            style={{
              fontSize: '0.74rem',
              letterSpacing: '0.12em',
              color: '#93c5fd',
              fontFamily: 'monospace',
            }}
          >
            Channel
          </label>
          <div className="position-relative">
            <span
              className="position-absolute top-50 translate-middle-y"
              style={{ left: '16px', color: '#60a5fa', pointerEvents: 'none', display: 'flex' }}
            >
              <MessageSquare size={18} />
            </span>
            <select
              id="c_channel"
              name="channel"
              className="form-select cyber-input"
              defaultValue=""
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={pending}
              style={{ appearance: 'none' }}
            >
              <option value="" disabled>Select Purpose</option>
              <option value="Project Collaboration">Project Collaboration</option>
              <option value="Full-Time Engineering Role">Full-Time Engineering Role</option>
              <option value="Enterprise Architecture Consulting">Enterprise Architecture Consulting</option>
              <option value="Applied AI & Autonomous Systems">Applied AI & Autonomous Systems</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
            <span
              className="position-absolute top-50 translate-middle-y"
              style={{ right: '16px', color: '#60a5fa', pointerEvents: 'none', display: 'flex' }}
            >
              <ChevronDown size={18} />
            </span>
          </div>
        </div>

        {/* Field 4: Encrypted Payload */}
        <div className="col-12">
          <label
            htmlFor="c_msg"
            className="d-block mb-2 text-uppercase fw-semibold"
            style={{
              fontSize: '0.74rem',
              letterSpacing: '0.12em',
              color: '#93c5fd',
              fontFamily: 'monospace',
            }}
          >
            Encrypted Payload
          </label>
          <div className="position-relative">
            <span
              className="position-absolute"
              style={{ top: '16px', left: '16px', color: '#60a5fa', pointerEvents: 'none', display: 'flex' }}
            >
              <Edit3 size={18} />
            </span>
            <textarea
              id="c_msg"
              name="message"
              rows={4}
              placeholder="Write your message here..."
              className="form-control cyber-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              disabled={pending}
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="col-12 mt-3">
          <motion.button
            whileHover={{ scale: 1.015, boxShadow: '0 0 35px rgba(56, 189, 248, 0.6)' }}
            whileTap={{ scale: 0.985 }}
            type="submit"
            disabled={pending}
            className="btn w-100 d-flex align-items-center justify-content-center gap-3 cyber-submit-btn"
          >
            {pending ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <Send size={18} />
            )}
            <span style={{ fontWeight: 700, letterSpacing: 'clamp(0.04em, 1.2vw, 0.12em)', textTransform: 'uppercase', fontSize: 'clamp(0.82rem, 3.2vw, 0.94rem)' }}>
              {pending ? 'TRANSMITTING...' : 'INITIALIZE CONNECTION →'}
            </span>
          </motion.button>
        </div>

        {/* Feedback / Status message */}
        {status.type !== 'idle' && (
          <div className="col-12">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 d-flex align-items-center gap-2 rounded-3"
              style={{
                background: status.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                color: status.type === 'error' ? '#fca5a5' : '#6ee7b7',
                fontSize: '0.85rem',
              }}
            >
              {status.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{status.msg}</span>
            </motion.div>
          </div>
        )}

        {/* Security / Privacy notice */}
        <div className="col-12 pt-1 text-center">
          <div className="d-inline-flex align-items-center justify-content-center gap-2" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            <Lock size={13} style={{ color: '#38bdf8' }} />
            <span>Your information is secure and will only be used for professional communication.</span>
          </div>
        </div>
      </div>

      <style>{`
        .cyber-input {
          background-color: rgba(9, 14, 34, 0.7) !important;
          border: 1px solid rgba(56, 189, 248, 0.22) !important;
          color: #f1f5f9 !important;
          padding: 14px 18px 14px 48px !important;
          border-radius: 12px !important;
          font-size: 16px !important;
          backdrop-filter: blur(12px) !important;
          transition: all 0.25s ease !important;
        }
        .cyber-input:focus {
          border-color: #38bdf8 !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2), 0 0 20px rgba(56, 189, 248, 0.25) !important;
          background-color: rgba(12, 19, 46, 0.85) !important;
        }
        .cyber-input::placeholder {
          color: #64748b !important;
        }
        .cyber-submit-btn {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #4338ca 100%) !important;
          border: 1px solid rgba(147, 197, 253, 0.4) !important;
          color: #ffffff !important;
          padding: 16px 24px !important;
          border-radius: 12px !important;
          box-shadow: 0 0 25px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
          transition: all 0.3s ease !important;
        }
        .cyber-submit-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #4f46e5 100%) !important;
          box-shadow: 0 0 35px rgba(56, 189, 248, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
        }
      `}</style>
    </form>
  );
}
