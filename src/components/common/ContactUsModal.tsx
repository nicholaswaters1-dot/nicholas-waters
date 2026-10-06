import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Building2,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Logo } from './Logo';
import { useMarketplace } from '../../context/MarketplaceContext';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
  const { showToast, activeHouseholdMember } = useMarketplace();
  const [name, setName] = useState(activeHouseholdMember?.name || 'Oliver Harrison');
  const [email, setEmail] = useState(activeHouseholdMember?.email || 'oliver.harrison@mypawswalks.co.uk');
  const [phone, setPhone] = useState(activeHouseholdMember?.phone || '+44 7700 900412');
  const [roleType, setRoleType] = useState('Pet Owner');
  const [department, setDepartment] = useState('Customer Support & Bookings');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const DIRECT_EMAIL = 'Mypawswalksdirect@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast('Please enter a subject and message for our UK support team.', 'warning');
      return;
    }

    const emailSubject = encodeURIComponent(`[My Paws Walks - ${department}] ${subject}`);
    const emailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nRole: ${roleType}\nDepartment: ${department}\n\nMessage:\n${message}`
    );
    const mailtoLink = `mailto:${DIRECT_EMAIL}?subject=${emailSubject}&body=${emailBody}`;
    const anchor = document.createElement('a');
    anchor.href = mailtoLink;
    anchor.click();

    setSubmitted(true);
    showToast(`Your enquiry has been linked & sent to ${DIRECT_EMAIL}! Reference #MPW-88412`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f5132] via-[#0c3e29] to-slate-900 text-white p-6 sm:p-7 flex items-start justify-between shrink-0">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>UK Customer Care, Business & Verification Desk</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Contact My Paws Walks
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Direct Email:{' '}
              <a
                href={`mailto:${DIRECT_EMAIL}`}
                className="font-extrabold text-amber-300 underline hover:text-amber-200"
              >
                {DIRECT_EMAIL}
              </a>{' '}
              — Need help with a booking, becoming a verified dog walker, kennel boarding registration, or local business advertising? Our UK team responds within 2 hours.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Left Column: Direct Contact Channels */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <Logo variant="compact" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated support for Pet Owners, Professional Dog Walkers, Licensed Kennels & Home Dog Sitters, Rescue Shelters, and Local Advertisers across England, Scotland & Wales.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl border-2 border-emerald-400 bg-emerald-50/60 flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#0f5132] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="font-extrabold text-slate-900">Official Direct Email Address</div>
                  <a
                    href={`mailto:${DIRECT_EMAIL}`}
                    className="text-emerald-900 font-extrabold underline block text-xs sm:text-sm break-all hover:text-emerald-700"
                  >
                    {DIRECT_EMAIL}
                  </a>
                  <div className="text-[11px] text-slate-600">
                    All customer support, walker/kennel verification, and business advertising enquiries are linked directly to {DIRECT_EMAIL}.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0f5132] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">UK Telephone Helpline</div>
                  <div className="text-emerald-800 font-mono font-bold mt-0.5">020 7946 0921 (Mon–Sun, 7am–9pm)</div>
                  <div className="text-[11px] text-slate-500">24/7 Live Walk & Boarding Emergency Triage Line Available in App</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0f5132] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">UK Headquarters</div>
                  <div className="text-slate-600 mt-0.5">
                    My Paws Walks · 42 Heath Street, Hampstead, London, NW3 1EN, United Kingdom
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Independent Pet Marketplace Platform (England & Wales)</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600">
                  <strong>Average Response Time:</strong> Under 28 minutes for active walk or kennel stays; under 2 hours for business & compliance enquiries.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Message Sent to {DIRECT_EMAIL}!
                </h3>
                <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your message has been linked to{' '}
                  <strong className="text-[#0f5132]">{DIRECT_EMAIL}</strong> under reference{' '}
                  <strong>#MPW-88412</strong> ({department}) and we will reply to <strong>{email}</strong> shortly.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={`mailto:${DIRECT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email {DIRECT_EMAIL} Directly</span>
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100"
                  >
                    Send Another Message
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 bg-[#0f5132] text-white font-bold text-xs rounded-xl hover:bg-[#0c3e29]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Send Us a Direct Message
                  </h3>
                  <a
                    href={`mailto:${DIRECT_EMAIL}`}
                    className="text-[11px] font-extrabold text-[#0f5132] hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{DIRECT_EMAIL}</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Reply Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">I am a...</label>
                    <select
                      value={roleType}
                      onChange={(e) => setRoleType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    >
                      <option value="Pet Owner">Pet Owner / Parent</option>
                      <option value="Dog Walker">Professional Dog Walker</option>
                      <option value="Kennel / Dog Sitter">Kennel, Stay or Dog Sitter</option>
                      <option value="Local Business Advertiser">Local Business / Advertiser</option>
                      <option value="Rescue Shelter">Rescue Shelter Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    >
                      <option value="Customer Support & Bookings">Customer Support & Bookings</option>
                      <option value="Become a Verified Walker / DBS">Become a Verified Walker / DBS</option>
                      <option value="Kennels & Dog Sitting Onboarding">Kennels & Dog Sitting Onboarding</option>
                      <option value="Directory Advertising & Promotions (£9.99/mo)">Directory Advertising & Promotions (£9.99/mo)</option>
                      <option value="Billing, Escrow & Payouts">Billing, Escrow & Payouts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject / Summary *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question about Kennel Membership Plans or Booking #BK-9912"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">How can our team help you? *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you need help with..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Linked to {DIRECT_EMAIL}</span>
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-black rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to {DIRECT_EMAIL}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
