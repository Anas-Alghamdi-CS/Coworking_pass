'use client';

import { useState } from 'react';
import { Warehouse, Settings, Phone, Mail, FileText } from 'lucide-react';
import { useApp } from '@/app/store';

export default function ProviderProfileSettings() {
  const { currentUser, navigate, nav, updateCurrentUser } = useApp();
  if (!currentUser) return null;

  const [businessName, setBusinessName] = useState(currentUser.businessName || '');
  const [crNumber, setCrNumber] = useState(currentUser.crNumber || '');
  const [businessDescription, setBusinessDescription] = useState(currentUser.businessDescription || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [saved, setSaved] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleSaveProfile = () => {
    updateCurrentUser({ businessName, crNumber, businessDescription });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveSettings = () => {
    updateCurrentUser({ phone });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl text-soot mb-8" style={{ fontFamily: 'DM Serif Display, serif' }}>
        {nav.screen === 'provider-profile' ? 'Business Profile' : 'Settings'}
      </h1>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-white border border-soot/8 rounded-xl p-1 mb-8 w-fit">
        {[
          { label: 'Profile', screen: 'provider-profile' as const, icon: Warehouse },
          { label: 'Settings', screen: 'provider-settings' as const, icon: Settings },
        ].map(t => (
          <button
            key={t.screen}
            onClick={() => navigate(t.screen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${nav.screen === t.screen ? 'bg-soot text-plaster' : 'text-moss hover:text-soot'}`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {nav.screen === 'provider-profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-soot/8 p-6">
            <h2 className="font-semibold text-soot mb-4">Business information</h2>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-eucalyptus/20 flex items-center justify-center">
                <Warehouse size={28} className="text-moss" />
              </div>
              <div>
                <div className="font-semibold text-soot">{currentUser.businessName || currentUser.name}</div>
                <div className="text-sm text-moss">{currentUser.email}</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-moss mb-1.5">Business name</label>
                <input value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-plaster text-soot text-sm outline-none focus:border-eucalyptus" />
              </div>
              <div>
                <label className="block text-xs font-medium text-moss mb-1.5 flex items-center gap-1"><FileText size={11} />CR number</label>
                <input value={crNumber} onChange={e => setCrNumber(e.target.value)} placeholder="1010xxxxxx" className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-plaster text-soot text-sm outline-none focus:border-eucalyptus" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-moss mb-1.5">Description</label>
                <textarea value={businessDescription} onChange={e => setBusinessDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-plaster text-soot text-sm outline-none focus:border-eucalyptus resize-none" placeholder="Tell customers about your workspace business" />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className={`mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-eucalyptus text-soot' : 'bg-soot text-plaster hover:bg-soot-light'}`}
            >
              {saved ? '✓ Saved' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      {nav.screen === 'provider-settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-soot/8 p-6">
            <h2 className="font-semibold text-soot mb-4">Contact information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-moss mb-1.5 flex items-center gap-1"><Phone size={11} />Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-soot/12 bg-plaster text-soot text-sm outline-none focus:border-eucalyptus" />
              </div>
              <div>
                <label className="block text-xs font-medium text-moss mb-1.5 flex items-center gap-1"><Mail size={11} />Email</label>
                <input value={currentUser.email} disabled className="w-full px-4 py-2.5 rounded-xl border border-soot/8 bg-soot/5 text-moss text-sm" />
              </div>
            </div>
            <button
              onClick={handleSaveSettings}
              className={`mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${settingsSaved ? 'bg-eucalyptus text-soot' : 'bg-soot text-plaster hover:bg-soot-light'}`}
            >
              {settingsSaved ? '✓ Saved' : 'Save'}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 p-6">
            <h2 className="font-semibold text-red-600 mb-3">Danger zone</h2>
            <p className="text-sm text-moss mb-4">Deleting your provider account will remove all your listed spaces, bookings history, and settings.</p>
            <button className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-medium">Delete account</button>
          </div>
        </div>
      )}
    </div>
  );
}