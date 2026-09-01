'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Clock,
  Phone,
  Mail,
  Heart,
  Bell,
  Zap,
  ChevronLeft,
  ChevronRight,
  Check,
  Info
} from 'lucide-react';
import { useApp } from '@/app/store';
import Modal from '@/components/ui/Modal';

export default function SpaceDetails() {
  const { nav, navigate, goBack, spaces, currentUser, favorites, toggleFavorite, waitlist, autobooking, joinWaitlist } = useApp();
  
  // Extract spaceId from nav state or URL fallback
  const urlId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
  const spaceId = nav?.params?.spaceId || (urlId && urlId !== 'page' && urlId !== '[id]' ? urlId : '') || 'space-1';
  const space = spaces.find(s => s.id === spaceId) || spaces[0];

  const [imgIndex, setImgIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [waitlistModal, setWaitlistModal] = useState(false);
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);

  useEffect(() => { 
    setImgIndex(0); 
  }, [spaceId]);

  if (!space) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h2 className="text-xl font-semibold text-soot mb-2">Space not found</h2>
        <button onClick={() => navigate('browse')} className="text-moss hover:text-soot flex items-center gap-2 text-sm">
          <ArrowLeft size={14} /> Back to browse
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(space.id);
  const isFullyBooked = space.availableCapacity === 0;
  const inWaitlist = waitlist[space.id];
  const autoBookOn = autobooking[space.id];

  const handleBook = () => {
    if (!currentUser) { navigate('login'); return; }
    if (currentUser.role === 'organization') {
      navigate('team-booking', { spaceId: space.id, plan: selectedPlan });
    } else {
      navigate('booking-flow', { spaceId: space.id, plan: selectedPlan });
    }
  };

  const handleJoinWaitlist = () => {
    joinWaitlist(space.id);
    setWaitlistDone(true);
  };

  const availabilityInfo = isFullyBooked
    ? { label: 'Fully Booked', color: 'text-red-500 bg-red-50 border-red-100' }
    : space.availableCapacity <= 5
    ? { label: `${space.availableCapacity} spots left`, color: 'text-amber-600 bg-amber-50 border-amber-100' }
    : { label: `${space.availableCapacity} spots available`, color: 'text-moss bg-eucalyptus/15 border-eucalyptus/20' };

  const planPrice = space.pricing[selectedPlan];
  const planLabel = selectedPlan === 'daily' ? '/day' : selectedPlan === 'monthly' ? '/month' : '/year';

  // معالجة مرنة لساعات العمل وتفاصيل التواصل لتجنب انهيار الصفحة
  const hoursDisplay = (space as any).openHours || (space as any).hours || '8:00 AM - 10:00 PM';
  const phoneDisplay = space.phone || '+966 50 000 0000';
  const emailDisplay = space.email || 'info@coworkingpass.sa';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <button onClick={goBack} className="flex items-center gap-2 text-moss hover:text-soot text-sm font-medium mb-6 transition-colors">
        <ArrowLeft size={15} />
        Back
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image carousel */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-soot/5">
            <img
              src={space.images[imgIndex] || '/placeholder.jpg'}
              alt={`${space.name} ${imgIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {space.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setImgIndex(i => (i - 1 + space.images.length) % space.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <ChevronLeft size={16} className="text-soot" />
                </button>
                <button
                  type="button"
                  onClick={() => setImgIndex(i => (i + 1) % space.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <ChevronRight size={16} className="text-soot" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {space.images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImgIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              {currentUser && (
                <button
                  type="button"
                  onClick={() => toggleFavorite(space.id)}
                  className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <Heart size={16} fill={isFav ? '#98AA9D' : 'none'} stroke={isFav ? '#98AA9D' : '#2D3536'} />
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl text-soot font-bold">{space.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-moss">
                  <MapPin size={13} />
                  <span>{space.address}</span>
                </div>
              </div>
              <span className={`shrink-0 text-sm font-medium px-3 py-1.5 rounded-full border ${availabilityInfo.color}`}>
                {availabilityInfo.label}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1.5 text-soot">
                <Star size={14} fill="#98AA9D" className="text-eucalyptus" />
                <span className="font-medium">{space.rating}</span>
                <span className="text-moss">({space.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-moss">
                <Users size={13} />
                <span>Capacity: {space.totalCapacity}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-soot mb-2">About this space</h2>
            <p className="text-moss text-sm leading-relaxed">{space.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-lg font-semibold text-soot mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {space.amenities.map(a => (
                <div key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-soot/8 text-sm text-soot">
                  <Check size={12} className="text-eucalyptus" />
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Clock, label: 'Hours', value: hoursDisplay },
              { icon: Phone, label: 'Phone', value: phoneDisplay },
              { icon: Mail, label: 'Email', value: emailDisplay },
            ].map(item => (
              <div key={item.label} className="bg-mist/15 rounded-xl p-4 border border-mist/40">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon size={14} className="text-moss" />
                  <span className="text-xs font-medium text-moss uppercase tracking-wide">{item.label}</span>
                </div>
                <div className="text-sm text-soot truncate">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Booking panel */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white rounded-2xl border border-soot/8 p-5 shadow-sm">
            <div className="mb-4">
              <div className="text-2xl font-semibold text-soot">
                SAR {planPrice.toLocaleString()}
                <span className="text-base font-normal text-moss">{planLabel}</span>
              </div>
            </div>

            {/* Plan selector */}
            <div className="mb-5">
              <label className="text-xs font-medium text-moss mb-2 block uppercase tracking-wide">Select plan</label>
              <div className="grid grid-cols-3 gap-2">
                {(['daily', 'monthly', 'yearly'] as const).map(plan => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all text-xs font-medium ${
                      selectedPlan === plan
                        ? 'bg-eucalyptus border-eucalyptus text-soot'
                        : 'border-soot/10 text-moss hover:border-eucalyptus/50'
                    }`}
                  >
                    <div className="capitalize">{plan}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedPlan === plan ? 'text-soot/70' : 'text-moss/60'}`}>
                      SAR {space.pricing[plan].toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
              {selectedPlan === 'yearly' && (
                <div className="mt-2 text-[11px] text-moss bg-eucalyptus/10 rounded-lg px-3 py-1.5">
                  💚 Save {Math.round((1 - space.pricing.yearly / (space.pricing.monthly * 12)) * 100)}% vs monthly
                </div>
              )}
            </div>

            {/* Capacity indicator */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-moss mb-1.5">
                <span>Availability</span>
                <span>{space.availableCapacity}/{space.totalCapacity}</span>
              </div>
              <div className="h-2 bg-soot/8 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isFullyBooked ? 'bg-red-400' : space.availableCapacity <= 5 ? 'bg-amber-400' : 'bg-eucalyptus'}`}
                  style={{ width: `${(space.availableCapacity / space.totalCapacity) * 100}%` }}
                />
              </div>
            </div>

            {isFullyBooked ? (
              <div className="space-y-3">
                <div className="mist-accent rounded-xl p-4 text-center border border-[#B3C9D6]">
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#B3C9D6] flex items-center justify-center">
                      <Bell size={18} className="text-[#1F2933]" />
                    </div>
                  </div>
                  <div className="text-[#344955] font-semibold text-sm mb-1">
                    Space is fully booked
                  </div>
                  <div className="text-[#64748B] text-xs">
                    Next availability will be notified
                  </div>
                </div>

                {inWaitlist ? (
                  <div className="bg-eucalyptus/15 rounded-xl p-3 text-center">
                    <div className="text-moss font-medium text-sm flex items-center justify-center gap-2">
                      <Bell size={14} />
                      You're on the waitlist
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { if (!currentUser) { navigate('login'); return; } setWaitlistDone(false); setWaitlistModal(true); }}
                    className="w-full py-3 rounded-xl bg-[#B3C9D6] text-[#1F2933] font-semibold text-sm hover:bg-[#9FBAC9] transition-colors flex items-center justify-center gap-2"
                  >
                    <Bell size={16} />
                    Join Waitlist
                  </button>
                )}

                <div>
                  <button
                    type="button"
                    onClick={() => { if (!currentUser) navigate('login'); }}
                    className="w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors bg-eucalyptus/20 text-moss hover:bg-eucalyptus/30"
                  >
                    <Bell size={15} />
                    Enable Notifications
                  </button>
                  {autoBookOn && (
                    <p className="text-[11px] text-moss text-center mt-1.5">
                      We'll automatically book when a spot opens
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBook}
                className="w-full py-3 rounded-xl bg-soot text-plaster font-semibold text-sm hover:bg-soot-light transition-colors"
              >
                {currentUser ? `Book ${selectedPlan === 'daily' ? 'for a day' : selectedPlan === 'monthly' ? 'for a month' : 'for a year'}` : 'Log in to book'}
              </button>
            )}

            {!currentUser && (
              <p className="text-center text-xs text-moss mt-3">
                <button type="button" onClick={() => navigate('signup')} className="text-soot font-medium hover:underline">Sign up</button> to start booking
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <Modal
        open={waitlistModal}
        onClose={() => setWaitlistModal(false)}
        title="Join the Waitlist"
        size="md"
      >
        <div className="p-6">
          {waitlistDone ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#EAF1F5] flex items-center justify-center mx-auto mb-5">
                <Check size={28} className="text-[#344955]" />
              </div>
              <h3 className="text-2xl text-soot font-bold mb-2">You’re on the list!</h3>
              <p className="text-sm text-moss leading-relaxed">
                We’ll notify you as soon as a desk becomes available at {space.name}.
              </p>
              <button
                type="button"
                onClick={() => setWaitlistModal(false)}
                className="mt-6 w-full py-3 rounded-xl bg-soot text-plaster text-sm font-semibold"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h2 className="text-2xl text-soot font-bold mb-2">Join the Waitlist</h2>
                <p className="text-sm text-moss leading-relaxed">
                  Secure your spot in line. We’ll alert you the moment a desk becomes available.
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EAF1F5] border border-[#B3C9D6] mb-5">
                <img
                  src={space.images[0] || '/placeholder.jpg'}
                  alt={space.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div>
                  <div className="font-semibold text-soot text-sm">{space.name}</div>
                  <div className="flex items-center gap-1 text-xs text-moss mt-1">
                    <MapPin size={11} />
                    {space.city}
                  </div>
                  <div className="text-xs text-moss mt-1">
                    {space.type.replace('-', ' ')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-4 rounded-xl bg-[#EAF1F5]">
                  <div className="text-xs text-moss mb-1">Queue Status</div>
                  <div className="text-xl text-soot font-semibold">You are #3</div>
                </div>
                <div className="p-4 rounded-xl bg-[#EAF1F5]">
                  <div className="text-xs text-moss mb-1">Est. Wait Time</div>
                  <div className="text-xl text-soot font-semibold">~25 mins</div>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-soot mb-2">Preferred Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-[#B3C9D6] focus:ring-2 focus:ring-[#EAF1F5]"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-soot mb-3">Notification Preferences</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-moss cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={e => setSmsAlerts(e.target.checked)}
                      className="accent-[#6F8792]"
                    />
                    SMS Alerts
                  </label>
                  <label className="flex items-center gap-2 text-sm text-moss cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={e => setEmailAlerts(e.target.checked)}
                      className="accent-[#6F8792]"
                    />
                    Email Alerts
                  </label>
                  <label className="flex items-center gap-2 text-sm text-moss cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappAlerts}
                      onChange={e => setWhatsappAlerts(e.target.checked)}
                      className="accent-[#6F8792]"
                    />
                    WhatsApp
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-soot/10 mb-5">
                <div>
                  <div className="text-sm font-semibold text-soot">Enable Notifications</div>
                  <div className="text-xs text-moss mt-1">Get alerts when spaces become available</div>
                </div>
                <button
                  type="button"
                  onClick={() => { if (!currentUser) navigate('login'); }}
                  className="relative w-12 h-7 rounded-full transition-colors bg-soot/15"
                >
                  <span
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform translate-x-1"
                  />
                </button>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-[#F3F5F5] mb-5">
                <Info size={16} className="text-[#6F8792] mt-0.5 shrink-0" />
                <p className="text-xs text-moss leading-relaxed">
                  You’ll have 10 minutes to confirm your reservation after receiving an alert before the desk is offered to the next person in line.
                </p>
              </div>

              <button
                type="button"
                onClick={handleJoinWaitlist}
                className="w-full py-3 rounded-xl bg-[#8FA7B2] text-white font-semibold text-sm hover:bg-[#7D98A4] transition-colors"
              >
                Join Waitlist
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
