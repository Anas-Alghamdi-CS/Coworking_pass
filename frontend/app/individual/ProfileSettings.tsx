'use client';

import React, { useState } from 'react';
import { User, Settings, Bell, Shield, Camera, Check, AlertCircle } from 'lucide-react';
import { useApp } from '@/app/store';

export default function ProfileSettings({ mode }: { mode: 'profile' | 'settings' }) {
  const { currentUser, updateCurrentUser, navigate, nav, showToast } = useApp();
  if (!currentUser) return null;

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(
    mode || (nav.screen === 'ind-settings' ? 'settings' : 'profile')
  );
  const [notifications, setNotifications] = useState({
    bookings: true,
    promotions: false,
    updates: true,
    waitlist: true,
  });
  const [privacy, setPrivacy] = useState({ profileVisible: true, showBookings: false });

  const handleSave = () => {
    updateCurrentUser({ name, phone });
    setSaved(true);
    showToast('Profile updated successfully', 'success');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl text-soot font-normal mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>
          {activeTab === 'profile' ? 'My Profile' : 'Account Settings'}
        </h1>
        <p className="text-moss text-sm font-medium">Manage your personal details and account preferences</p>
      </div>

      {/* Tab Switcher */}
      <div className="inline-flex items-center gap-1.5 bg-white rounded-2xl p-1.5 border border-soot/8 shadow-sm mb-8">
        <button
          onClick={() => {
            setActiveTab('profile');
            navigate('ind-profile');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'profile'
              ? 'bg-soot text-plaster font-semibold shadow-sm'
              : 'text-moss hover:text-soot'
          }`}
        >
          <User size={16} />
          <span>Profile</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('settings');
            navigate('ind-settings');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'settings'
              ? 'bg-soot text-plaster font-semibold shadow-sm'
              : 'text-moss hover:text-soot'
          }`}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-soot/8 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-soot mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Personal Information
            </h2>

            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-soot/8">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-eucalyptus/30 shadow-sm"
                />
                <button
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-soot text-plaster hover:bg-soot-light flex items-center justify-center shadow-md transition-all active:scale-95"
                  title="Change avatar"
                >
                  <Camera size={13} />
                </button>
              </div>
              <div>
                <div className="font-semibold text-soot text-lg">{currentUser.name}</div>
                <div className="text-sm text-moss">{currentUser.email}</div>
                <div className="inline-block text-xs font-semibold uppercase tracking-wider text-moss bg-eucalyptus/20 px-2.5 py-0.5 rounded-full mt-1.5">
                  {currentUser.role} Account
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-2">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white focus:ring-2 focus:ring-eucalyptus/20 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-2">
                  Email Address
                </label>
                <input
                  value={currentUser.email}
                  disabled
                  className="w-full px-4 py-3 rounded-2xl border border-soot/8 bg-soot/5 text-moss text-sm cursor-not-allowed font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-2">
                  Phone Number
                </label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white focus:ring-2 focus:ring-eucalyptus/20 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-2">
                  Member Since
                </label>
                <div className="w-full px-4 py-3 rounded-2xl border border-soot/8 bg-soot/5 text-moss text-sm font-medium">
                  {currentUser.joinDate}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end">
              <button
                onClick={handleSave}
                className={`px-8 py-3 rounded-2xl text-sm font-semibold transition-all shadow-sm ${
                  saved
                    ? 'bg-eucalyptus text-soot'
                    : 'bg-soot text-plaster hover:bg-soot-light active:scale-98'
                }`}
              >
                {saved ? '✓ Saved Changes' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Account Summary Card */}
          <div className="bg-white rounded-3xl border border-soot/8 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-soot mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Account Details
            </h2>
            <div className="divide-y divide-soot/6">
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-moss font-medium">Account Role</span>
                <span className="text-sm font-semibold text-soot capitalize">{currentUser.role}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-moss font-medium">Status</span>
                <span className="text-xs font-semibold text-moss bg-eucalyptus/20 border border-eucalyptus/30 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-moss font-medium">Language</span>
                <span className="text-sm font-semibold text-soot">English (US)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="bg-white rounded-3xl border border-soot/8 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={20} className="text-moss" />
              <h2 className="text-xl font-semibold text-soot" style={{ fontFamily: 'DM Serif Display, serif' }}>
                Notification Preferences
              </h2>
            </div>
            <div className="space-y-5">
              {[
                {
                  key: 'bookings' as const,
                  label: 'Booking confirmations & reminders',
                  desc: 'Instant updates regarding your active passes and renewals',
                },
                {
                  key: 'waitlist' as const,
                  label: 'Waitlist notifications',
                  desc: 'Immediate alerts as soon as fully booked spots become open',
                },
                {
                  key: 'updates' as const,
                  label: 'Platform announcements',
                  desc: 'News about newly added spaces and system improvements',
                },
                {
                  key: 'promotions' as const,
                  label: 'Special discounts & offers',
                  desc: 'Occasional seasonal deals from coworking spaces',
                },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-2 border-b border-soot/5 last:border-b-0">
                  <div>
                    <div className="text-sm font-semibold text-soot">{item.label}</div>
                    <div className="text-xs text-moss mt-0.5">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      notifications[item.key] ? 'bg-eucalyptus' : 'bg-soot/15'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Card */}
          <div className="bg-white rounded-3xl border border-soot/8 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={20} className="text-moss" />
              <h2 className="text-xl font-semibold text-soot" style={{ fontFamily: 'DM Serif Display, serif' }}>
                Privacy & Visibility
              </h2>
            </div>
            <div className="space-y-5">
              {[
                {
                  key: 'profileVisible' as const,
                  label: 'Community visibility',
                  desc: 'Allow other verified coworkers at the same venue to see your profile name',
                },
                {
                  key: 'showBookings' as const,
                  label: 'Activity sharing',
                  desc: 'Show your current booked location status to teammates',
                },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-2 border-b border-soot/5 last:border-b-0">
                  <div>
                    <div className="text-sm font-semibold text-soot">{item.label}</div>
                    <div className="text-xs text-moss mt-0.5">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => setPrivacy(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      privacy[item.key] ? 'bg-eucalyptus' : 'bg-soot/15'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        privacy[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-3xl border border-red-200 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-red-600 mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Danger Zone
            </h2>
            <p className="text-sm text-moss mb-5 leading-relaxed">
              Once you delete your account, your profile and history will be permanently wiped. This action cannot be reversed.
            </p>
            <button className="px-5 py-2.5 rounded-xl border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
