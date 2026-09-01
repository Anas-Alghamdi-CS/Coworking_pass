'use client';

import React, { useState } from 'react';
import { ArrowLeft, Check, Calendar, Users, CreditCard, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '@/app/store';
import { BookingPlan, BookingType } from '@/types/types';

const STEPS = ['Plan', 'Details', 'Review', 'Confirm'];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2.5 ${
              i < current ? 'text-moss' : i === current ? 'text-soot font-semibold' : 'text-moss/40'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                i < current
                  ? 'bg-eucalyptus text-soot'
                  : i === current
                  ? 'bg-soot text-plaster'
                  : 'bg-soot/8 text-moss/50'
              }`}
            >
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span className="text-sm hidden sm:block">{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <ChevronRight size={15} className={`mx-1.5 ${i < current ? 'text-eucalyptus' : 'text-soot/20'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-moss text-sm">{label}</span>
      <span className="text-soot font-medium text-sm">{value}</span>
    </div>
  );
}

export default function BookingFlow() {
  const { nav, navigate, goBack, spaces, currentUser, addBooking, showToast } = useApp();
  const spaceId = nav.params?.spaceId;
  const space = spaces.find(s => s.id === spaceId);

  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<BookingPlan>((nav.params?.plan as BookingPlan) || 'monthly');
  const [deskType, setDeskType] = useState<BookingType>('hot-desk');
  const [startDate, setStartDate] = useState('');
  const [seats, setSeats] = useState(1);
  const [notes, setNotes] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!space || !currentUser) return null;

  const getEndDate = (start: string, p: BookingPlan) => {
    if (!start) return '';
    const d = new Date(start);
    if (p === 'monthly') d.setMonth(d.getMonth() + 1);
    else if (p === 'yearly') d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };

  const endDate = getEndDate(startDate, plan);
  const planPrice = space.pricing[plan];
  const totalPrice = planPrice * seats;
  const priceLabel = plan === 'daily' ? '/day' : plan === 'monthly' ? '/month' : '/year';

  const validateStep = () => {
    if (step === 1 && !startDate) {
      showToast('Please select a start date.', 'error');
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep(s => Math.min(s + 1, 3));
  };

  const back = () => {
    if (step === 0) {
      goBack();
      return;
    }
    setStep(s => s - 1);
  };

  const confirmBooking = () => {
    setLoading(true);
    setTimeout(() => {
      const booking = addBooking({
        userId: currentUser.id,
        spaceId: space.id,
        spaceName: space.name,
        spaceCity: space.city,
        spaceAddress: space.address,
        spaceImage: space.images[0],
        type: deskType,
        plan,
        startDate,
        endDate: endDate || startDate,
        seats,
        employees: [],
        totalPrice,
        status: 'active',
        notes,
      });
      setConfirmedBooking(booking);
      setStep(3);
      setLoading(false);
      showToast('Workspace booked successfully!', 'success');
    }, 900);
  };

  // Confirmation screen
  if (step === 3 && confirmedBooking) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center">
          <div className="w-18 h-18 rounded-3xl bg-eucalyptus/20 border border-eucalyptus/30 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Check size={32} className="text-moss" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-soot font-normal mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Booking Confirmed!
          </h1>
          <p className="text-moss text-sm mb-8">
            Your pass is ready. We've saved all details in your My Bookings section.
          </p>

          <div className="bg-white rounded-3xl border border-soot/8 p-6 sm:p-8 text-left mb-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-soot/8">
              <img src={space.images[0]} alt={space.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
              <div>
                <div className="font-semibold text-soot text-lg">{space.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-moss mt-1">
                  <MapPin size={12} />
                  <span>{space.city}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5 text-sm">
              <Row label="Booking ID" value={`#${confirmedBooking.id.slice(-8).toUpperCase()}`} />
              <Row label="Desk Type" value={deskType.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} />
              <Row label="Pass Plan" value={`${plan.charAt(0).toUpperCase() + plan.slice(1)} Pass`} />
              <Row label="Start Date" value={startDate} />
              {plan !== 'daily' && <Row label="End Date" value={endDate} />}
              <Row label="Reserved Seats" value={`${seats} seat${seats > 1 ? 's' : ''}`} />
              <div className="pt-3 border-t border-soot/8 flex justify-between items-center font-semibold text-base">
                <span className="text-soot">Total Paid</span>
                <span className="text-soot">SAR {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('my-bookings')}
              className="flex-1 py-3 rounded-2xl bg-soot text-plaster font-semibold text-sm hover:bg-soot-light transition-all shadow-sm"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('browse')}
              className="flex-1 py-3 rounded-2xl border border-soot/15 text-soot font-semibold text-sm hover:bg-soot/5 transition-all bg-white"
            >
              Browse More Spaces
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10">
      <button
        onClick={back}
        className="flex items-center gap-2 text-moss hover:text-soot text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <StepIndicator current={step} />

      {/* Space Summary Bar */}
      <div className="flex items-center gap-4 bg-white rounded-3xl border border-soot/8 p-5 mb-8 shadow-sm">
        <img src={space.images[0]} alt={space.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-soot text-base truncate">{space.name}</div>
          <div className="flex items-center gap-1 text-xs text-moss mt-0.5">
            <MapPin size={12} />
            <span>{space.city}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold text-soot text-base">SAR {planPrice.toLocaleString()}</div>
          <div className="text-xs text-moss">{priceLabel}</div>
        </div>
      </div>

      {/* Step 0: Plan */}
      {step === 0 && (
        <div className="bg-white rounded-3xl border border-soot/8 p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl text-soot font-normal mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Choose Your Pass
          </h2>
          <p className="text-moss text-sm mb-6">Select how long you'd like to access {space.name}</p>

          <div className="space-y-3 mb-8">
            {(['daily', 'monthly', 'yearly'] as BookingPlan[]).map(p => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left cursor-pointer ${
                  plan === p
                    ? 'border-eucalyptus bg-[#E5ECE9]/40 shadow-sm'
                    : 'border-soot/10 bg-white hover:border-eucalyptus/40'
                }`}
              >
                <div>
                  <div className="font-semibold text-soot text-base capitalize">{p} Pass</div>
                  <div className="text-xs text-moss mt-1">
                    {p === 'daily'
                      ? 'Flexibility for single or intermittent work days'
                      : p === 'monthly'
                      ? 'Best for steady ongoing monthly access'
                      : 'Dedicated full-year workspace with maximum savings'}
                  </div>
                </div>
                <div className="text-right shrink-0 pl-4">
                  <div className="font-semibold text-soot text-lg">SAR {space.pricing[p].toLocaleString()}</div>
                  <div className="text-xs text-moss">
                    /{p === 'daily' ? 'day' : p === 'monthly' ? 'month' : 'year'}
                  </div>
                  {p === 'yearly' && (
                    <div className="text-[10px] text-moss font-semibold bg-eucalyptus/20 border border-eucalyptus/30 px-2 py-0.5 rounded-full mt-1">
                      Save {Math.round((1 - space.pricing.yearly / (space.pricing.monthly * 12)) * 100)}%
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-moss mb-3">Workspace Type</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['hot-desk', 'private-office', 'meeting-room'] as BookingType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setDeskType(t)}
                  className={`py-3 px-3 rounded-2xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    deskType === t
                      ? 'bg-soot text-plaster border-soot shadow-sm'
                      : 'border-soot/10 text-moss hover:border-soot/30 bg-plaster/30'
                  }`}
                >
                  {t.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={next}
            className="w-full py-3.5 rounded-2xl bg-soot text-plaster font-semibold text-sm hover:bg-soot-light transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Continue to Details <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-soot/8 p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl text-soot font-normal mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Booking Details
          </h2>
          <p className="text-moss text-sm mb-6">Choose your schedule and required seats</p>

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white font-medium"
              />
            </div>

            {startDate && plan !== 'daily' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-2">
                  End Date (Auto-calculated)
                </label>
                <input
                  type="date"
                  value={endDate}
                  disabled
                  className="w-full px-4 py-3 rounded-2xl border border-soot/8 bg-soot/5 text-moss text-sm cursor-not-allowed font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-2">
                Number of Seats
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  className="w-11 h-11 rounded-2xl border border-soot/10 bg-plaster/50 hover:bg-plaster flex items-center justify-center text-soot font-bold text-lg"
                >
                  -
                </button>
                <span className="font-semibold text-soot text-lg w-10 text-center">{seats}</span>
                <button
                  type="button"
                  onClick={() => setSeats(Math.min(space.availableCapacity || 10, seats + 1))}
                  className="w-11 h-11 rounded-2xl border border-soot/10 bg-plaster/50 hover:bg-plaster flex items-center justify-center text-soot font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-2">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special setup or desk requirements..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={back}
              className="flex-1 py-3.5 rounded-2xl border border-soot/15 text-soot font-semibold text-sm hover:bg-soot/5 transition-all bg-white"
            >
              Back
            </button>
            <button
              onClick={next}
              className="flex-1 py-3.5 rounded-2xl bg-soot text-plaster font-semibold text-sm hover:bg-soot-light transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Review Booking <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-soot/8 p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl text-soot font-normal mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Review & Payment
          </h2>
          <p className="text-moss text-sm mb-6">Confirm your workspace reservation details</p>

          <div className="space-y-3 mb-8 divide-y divide-soot/6">
            <div className="pt-2">
              <Row label="Space" value={space.name} />
              <Row label="Location" value={`${space.address}, ${space.city}`} />
              <Row label="Plan" value={`${plan.charAt(0).toUpperCase() + plan.slice(1)} Pass`} />
              <Row label="Type" value={deskType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
              <Row label="Start Date" value={startDate} />
              {plan !== 'daily' && <Row label="End Date" value={endDate} />}
              <Row label="Seats" value={`${seats} seat${seats > 1 ? 's' : ''}`} />
            </div>

            <div className="pt-4">
              <Row label={`Subtotal (${seats} seat × SAR ${planPrice.toLocaleString()})`} value={`SAR ${totalPrice.toLocaleString()}`} />
              <Row label="VAT (15% included)" value={`SAR ${(totalPrice * 0.15).toFixed(0)}`} />
              <div className="pt-3 flex justify-between items-center font-semibold text-lg text-soot">
                <span>Total Amount</span>
                <span>SAR {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={back}
              className="flex-1 py-3.5 rounded-2xl border border-soot/15 text-soot font-semibold text-sm hover:bg-soot/5 transition-all bg-white"
            >
              Back
            </button>
            <button
              onClick={confirmBooking}
              disabled={loading}
              className="flex-1 py-3.5 rounded-2xl bg-soot text-plaster font-semibold text-sm hover:bg-soot-light transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <CreditCard size={16} /> Pay & Confirm
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
