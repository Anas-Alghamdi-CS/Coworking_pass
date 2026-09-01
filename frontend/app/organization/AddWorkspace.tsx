'use client';

import { useState } from 'react';
import { ArrowLeft, Check, Building2, MapPin, Users, DollarSign, Eye, X } from 'lucide-react';
import { useApp } from '@/app/store';
import { SpaceType } from '@/types';

const STEPS = ['Basic info', 'Location', 'Capacity & amenities', 'Pricing', 'Review & publish'];

const REGIONS = [
  'Riyadh Region', 'Makkah Region', 'Eastern Province', 'Madinah Region',
  'Asir Region', 'Qassim Region', 'Tabuk Region', 'Jazan Region',
  'Hail Region', 'Najran Region', 'Al Bahah Region', 'Northern Borders Region',
];

const CITIES_BY_REGION: Record<string, string[]> = {
  'Riyadh Region': ['Riyadh', 'Al Kharj', 'Dawadmi', 'Al Majmaah'],
  'Makkah Region': ['Jeddah', 'Makkah', 'Taif', 'Rabigh'],
  'Eastern Province': ['Dammam', 'Khobar', 'Dhahran', 'Jubail', 'Qatif'],
  'Madinah Region': ['Madinah', 'Yanbu', 'Al Ula'],
  'Asir Region': ['Abha', 'Khamis Mushait', 'Bisha'],
  'Qassim Region': ['Buraydah', 'Unaizah', 'Ar Rass'],
  'Tabuk Region': ['Tabuk', 'Al Wajh', 'Haql'],
  'Jazan Region': ['Jazan', 'Sabya', 'Abu Arish'],
  'Hail Region': ['Hail', 'Baqaa', 'Al Shamli'],
  'Najran Region': ['Najran', 'Sharurah'],
  'Al Bahah Region': ['Al Bahah', 'Baljurashi'],
  'Northern Borders Region': ["Ar'ar", 'Rafha', 'Turaif'],
};

const AMENITIES_LIST = [
  'High-Speed WiFi', 'Parking', 'Coffee & Tea', 'Printing', 'Meeting Rooms',
  'Phone Booths', 'Reception', '24/7 Access', 'Accessibility', 'Prayer Room',
  'Locker', 'Gym Access', 'Rooftop', 'Event Space', 'Bike Storage',
];

const WORKSPACE_TYPES: { type: SpaceType; label: string; desc: string }[] = [
  { type: 'hot-desk', label: 'Hot Desk', desc: 'Flexible open seating, first-come first-served' },
  { type: 'private-office', label: 'Private Office', desc: 'Dedicated enclosed office space' },
  { type: 'meeting-room', label: 'Meeting Room', desc: 'Conference and collaboration rooms' },
  { type: 'mixed', label: 'Mixed Workspace', desc: 'Combination of different workspace types' },
];

export default function AddWorkspace() {
  const { currentUser, navigate, addSpace, showToast } = useApp();
  if (!currentUser) return null;

  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);

  // Step 1
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<SpaceType>('hot-desk');

  // Step 2
  const [region, setRegion] = useState('Riyadh Region');
  const [city, setCity] = useState('Riyadh');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');

  // Step 3
  const [totalCapacity, setTotalCapacity] = useState(20);
  const [availableCapacity, setAvailableCapacity] = useState(20);
  const [amenities, setAmenities] = useState<string[]>(['High-Speed WiFi', 'Coffee & Tea']);
  const [openHours, setOpenHours] = useState('Sun–Thu: 8am–9pm');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Step 4
  const [dailyPrice, setDailyPrice] = useState(150);
  const [monthlyPrice, setMonthlyPrice] = useState(1800);
  const [yearlyPrice, setYearlyPrice] = useState(18000);
  const [allowWaitlist, setAllowWaitlist] = useState(true);
  const [autoApproval, setAutoApproval] = useState(true);
  const [publicBooking, setPublicBooking] = useState(true);

  const toggleAmenity = (a: string) =>
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0 && description.trim().length > 0;
    if (step === 1) return city.trim().length > 0 && address.trim().length > 0;
    if (step === 2) return totalCapacity > 0 && phone.trim().length > 0 && email.trim().length > 0;
    if (step === 3) return dailyPrice > 0 && monthlyPrice > 0 && yearlyPrice > 0;
    return true;
  };

  const handlePublish = (asDraft: boolean) => {
    const images = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop&auto=format',
    ];
    addSpace({
      name, description, type, city, region, district, address,
      images,
      amenities,
      totalCapacity,
      availableCapacity,
      pricing: { daily: dailyPrice, monthly: monthlyPrice, yearly: yearlyPrice },
      rating: 0,
      reviewCount: 0,
      isVisible: !asDraft,
      isFeatured: false,
      openHours,
      phone,
      email,
      ownerId: currentUser.id,
      status: asDraft ? 'draft' : 'published',
    });
    setPublished(true);
    showToast(asDraft ? 'Workspace saved as draft.' : 'Workspace published successfully!', 'success');
  };

  if (published) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-eucalyptus/20 flex items-center justify-center mx-auto mb-5">
          <Check size={28} className="text-moss" />
        </div>
        <h1 className="text-2xl text-soot mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>Workspace ready!</h1>
        <p className="text-moss text-sm mb-8">Your workspace has been published and is now accepting bookings.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('company-workspaces')} className="px-5 py-2.5 rounded-xl bg-soot text-plaster font-medium text-sm">
            View workspaces
          </button>
          <button onClick={() => { setPublished(false); setStep(0); setName(''); setDescription(''); }} className="px-5 py-2.5 rounded-xl border border-soot/15 text-soot font-medium text-sm">
            Add another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => step === 0 ? navigate('company-workspaces') : setStep(s => s - 1)} className="flex items-center gap-2 text-moss hover:text-soot text-sm font-medium mb-6 transition-colors">
        <ArrowLeft size={15} /> {step === 0 ? 'My Workspaces' : 'Back'}
      </button>

      <div className="mb-8">
        <h1 className="text-3xl text-soot mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>Add workspace</h1>
        <p className="text-moss text-sm">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1.5 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={`flex items-center gap-1.5 ${i < step ? 'text-moss' : i === step ? 'text-soot' : 'text-moss/40'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${i < step ? 'bg-eucalyptus text-soot' : i === step ? 'bg-soot text-plaster' : 'bg-soot/8 text-moss/50'}`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span className="text-xs hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-px flex-1 min-w-4 ${i < step ? 'bg-eucalyptus' : 'bg-soot/10'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Basic info */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-moss mb-1.5">Workspace name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tech Square Riyadh" className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus" />
          </div>
          <div>
            <label className="block text-xs font-medium text-moss mb-1.5">Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe your workspace, its atmosphere, and what makes it unique..." className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-moss mb-3">Workspace type *</label>
            <div className="space-y-2">
              {WORKSPACE_TYPES.map(wt => (
                <button key={wt.type} onClick={() => setType(wt.type)} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${type === wt.type ? 'border-eucalyptus bg-eucalyptus/8' : 'border-soot/10 bg-white hover:border-eucalyptus/30'}`}>
                  <div>
                    <div className="font-medium text-soot text-sm">{wt.label}</div>
                    <div className="text-xs text-moss mt-0.5">{wt.desc}</div>
                  </div>
                  {type === wt.type && <Check size={16} className="text-moss shrink-0" />}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-mist/15 border border-mist/40 rounded-xl p-4">
            <p className="text-xs text-moss">You can upload workspace photos after publishing from the workspace management page.</p>
          </div>
        </div>
      )}

      {/* Step 1: Location */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-moss mb-1.5">Region *</label>
              <select value={region} onChange={e => { setRegion(e.target.value); setCity(CITIES_BY_REGION[e.target.value]?.[0] || ''); }} className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus">
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-moss mb-1.5">City *</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus">
                {(CITIES_BY_REGION[region] || []).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-moss mb-1.5">District / Neighborhood</label>
            <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="e.g. Al Olaya, KAFD, Al Rawdah" className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus" />
          </div>
          <div>
            <label className="block text-xs font-medium text-moss mb-1.5">Full address *</label>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Building name, street, city, postal code" className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus" />
          </div>
          <div className="bg-plaster-dark rounded-xl h-36 flex items-center justify-center border border-soot/8">
            <div className="text-center">
              <MapPin size={24} className="text-moss mx-auto mb-2" />
              <p className="text-xs text-moss">Map location preview</p>
              <p className="text-[10px] text-moss/60 mt-0.5">Interactive map available after publishing</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Capacity & amenities */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-moss mb-1.5">Total capacity *</label>
              <input type="number" min={1} value={totalCapacity} onChange={e => { const v = parseInt(e.target.value) || 0; setTotalCapacity(v); setAvailableCapacity(Math.min(availableCapacity, v)); }} className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus" />
            </div>
            <div>
              <label className="block text-xs font-medium text-moss mb-1.5">Available capacity *</label>
              <input type="number" min={0} max={totalCapacity} value={availableCapacity} onChange={e => setAvailableCapacity(Math.min(parseInt(e.target.value) || 0, totalCapacity))} className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-moss mb-3">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map(a => (
                <button key={a} onClick={() => toggleAmenity(a)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${amenities.includes(a) ? 'bg-eucalyptus/15 border-eucalyptus/40 text-moss' : 'border-soot/10 text-moss hover:border-eucalyptus/30'}`}>
                  {amenities.includes(a) && <Check size={10} className="inline mr-1" />}
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-moss mb-1.5">Opening hours</label>
            <input value={openHours} onChange={e => setOpenHours(e.target.value)} placeholder="e.g. Sun–Thu: 8am–9pm | Fri–Sat: 10am–6pm" className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-moss mb-1.5">Contact phone *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+966 11 xxx xxxx" className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus" />
            </div>
            <div>
              <label className="block text-xs font-medium text-moss mb-1.5">Contact email *</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="workspace@company.sa" className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus" />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Pricing */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-4">
            {[
              { label: 'Daily price (SAR)', value: dailyPrice, set: setDailyPrice, hint: 'Per person per day' },
              { label: 'Monthly price (SAR)', value: monthlyPrice, set: setMonthlyPrice, hint: 'Per person per month' },
              { label: 'Yearly price (SAR)', value: yearlyPrice, set: setYearlyPrice, hint: 'Per person per year' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-medium text-moss mb-1.5">{f.label} *</label>
                <input type="number" min={0} value={f.value} onChange={e => f.set(parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-white text-soot text-sm outline-none focus:border-eucalyptus" />
                <p className="text-[10px] text-moss mt-1">{f.hint}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-soot/8 p-5 space-y-4">
            <h3 className="font-semibold text-soot text-sm">Booking settings</h3>
            {[
              { label: 'Allow public booking', desc: 'Anyone can book this workspace', value: publicBooking, set: setPublicBooking },
              { label: 'Enable waitlist', desc: 'Allow customers to join waitlist when full', value: allowWaitlist, set: setAllowWaitlist },
              { label: 'Auto-approve bookings', desc: 'Bookings confirmed instantly without review', value: autoApproval, set: setAutoApproval },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-soot">{s.label}</div>
                  <div className="text-xs text-moss">{s.desc}</div>
                </div>
                <button
                  onClick={() => s.set(!s.value)}
                  style={{ width: 40, height: 22, borderRadius: 11, position: 'relative', transition: 'background 0.2s', background: s.value ? '#98AA9D' : 'rgba(45,53,54,0.15)' }}
                >
                  <div style={{ width: 18, height: 18, top: 2, left: s.value ? 20 : 2, position: 'absolute', background: 'white', borderRadius: 9, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-soot/8 overflow-hidden">
            <div className="h-48 bg-plaster-dark flex items-center justify-center">
              <div className="text-center">
                <Building2 size={32} className="text-moss mx-auto mb-2" />
                <p className="text-xs text-moss">Workspace preview</p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-soot text-lg">{name}</h2>
                  <div className="flex items-center gap-1 text-xs text-moss mt-0.5">
                    <MapPin size={11} />
                    {city}{district ? `, ${district}` : ''} · <span className="capitalize">{type.replace('-', ' ')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-soot">SAR {dailyPrice}</div>
                  <div className="text-xs text-moss">/day</div>
                </div>
              </div>
              <p className="text-sm text-moss leading-relaxed mb-4">{description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {amenities.slice(0, 5).map(a => (
                  <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-plaster text-moss border border-soot/8">{a}</span>
                ))}
                {amenities.length > 5 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-plaster text-moss border border-soot/8">+{amenities.length - 5} more</span>}
              </div>
              <div className="grid grid-cols-3 gap-3 text-center border-t border-soot/8 pt-4">
                <div>
                  <div className="text-sm font-semibold text-soot">SAR {dailyPrice}</div>
                  <div className="text-[10px] text-moss">/ day</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-soot">SAR {monthlyPrice}</div>
                  <div className="text-[10px] text-moss">/ month</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-soot">{totalCapacity}</div>
                  <div className="text-[10px] text-moss">total seats</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-mist/15 border border-mist/40 rounded-xl p-4">
            <p className="text-xs text-moss">Publishing will make this workspace visible to all users on Coworking Pass. You can hide or edit it anytime from My Workspaces.</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => step === 0 ? navigate('company-workspaces') : setStep(s => s - 1)}
          className="flex-1 py-3 rounded-xl border border-soot/15 text-soot font-medium text-sm"
        >
          {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className="flex-1 py-3 rounded-xl bg-soot text-plaster font-semibold text-sm hover:bg-soot-light disabled:opacity-50 transition-colors"
          >
            Continue
          </button>
        ) : (
          <div className="flex-1 flex gap-2">
            <button onClick={() => handlePublish(true)} className="flex-1 py-3 rounded-xl border border-soot/15 text-soot font-medium text-sm">
              Save draft
            </button>
            <button onClick={() => handlePublish(false)} className="flex-1 py-3 rounded-xl bg-eucalyptus text-soot font-semibold text-sm hover:bg-eucalyptus-dark transition-colors">
              Publish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
