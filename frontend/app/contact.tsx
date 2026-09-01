'use client';

import { useState } from 'react';
import { MessageCircle, Mail, Phone, Send, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl text-soot font-normal mb-3 font-serif-display">
          Contact Us
        </h1>
        <p className="text-moss text-base sm:text-lg">
          We're here to help answer your questions about workspace bookings, company passes, or partnership opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-soot/12 bg-plaster-dark/30 p-6 shadow-xs space-y-3 ui-hover-card">
            <div className="w-12 h-12 rounded-2xl bg-eucalyptus/20 text-soot flex items-center justify-center">
              <MessageCircle size={22} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-soot mb-1">General Inquiries</h2>
              <p className="text-xs text-moss leading-relaxed">
                Questions about workspace memberships, day passes, or custom team plans.
              </p>
            </div>
          </div>

          <a
            href="mailto:info@coworkingpass.sa"
            className="block rounded-3xl border border-soot/12 bg-plaster-dark/30 hover:bg-plaster-dark/50 p-6 shadow-xs space-y-3 transition-all duration-200 group active:scale-[0.98] cursor-pointer ui-hover-card"
          >
            <div className="w-12 h-12 rounded-2xl bg-mist-light text-soot flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mail size={22} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-soot mb-1">Email Us</h2>
              <p className="text-sm font-medium text-soot">info@coworkingpass.sa</p>
              <p className="text-xs text-moss mt-1">Our support team responds within 24 hours.</p>
            </div>
          </a>

          <a
            href="tel:+966500000000"
            className="block rounded-3xl border border-soot/12 bg-plaster-dark/30 hover:bg-plaster-dark/50 p-6 shadow-xs space-y-3 transition-all duration-200 group active:scale-[0.98] cursor-pointer ui-hover-card"
          >
            <div className="w-12 h-12 rounded-2xl bg-soot text-plaster flex items-center justify-center group-hover:scale-105 transition-transform">
              <Phone size={22} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-soot mb-1">Call Support</h2>
              <p className="text-sm font-medium text-soot" dir="ltr">+966 50 000 0000</p>
              <p className="text-xs text-moss mt-1">Sun - Thu: 9:00 AM - 6:00 PM AST</p>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-plaster-surface rounded-3xl border border-soot/12 p-6 sm:p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl text-soot font-normal font-serif-display">Message Sent!</h2>
              <p className="text-moss text-sm max-w-md mx-auto">
                Thank you for reaching out, {name}. Our team has received your message and will get back to you at {email} shortly.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSubmitted(false)}
                className="mt-4"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-normal text-soot mb-4 font-serif-display">Send us a message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Mohammed Al-Faisal"
                  required
                />
                <Input
                  label="Email Address *"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>
              <Input
                label="Subject *"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="How can we help you?"
                required
              />
              <div>
                <label className="block text-xs font-semibold text-soot/85 mb-1.5">Message *</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Provide details about your inquiry..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-soot/15 bg-white text-soot text-sm outline-none focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/25 transition-all placeholder:text-soot/50 shadow-xs"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                className="px-8 py-3 font-semibold text-sm"
              >
                Send Message
                <Send size={16} />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}