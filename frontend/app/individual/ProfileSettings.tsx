'use client';

import React, { useState, useRef } from 'react';
import {
  User,
  Settings,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit3,
  Check,
  Camera,
  Trash2,
  Upload,
  Lock,
  GraduationCap,
  FileText
} from 'lucide-react';
import { useApp } from '@/app/store';
import UserAvatar from '@/components/ui/UserAvatar';
import Modal from '@/components/ui/Modal';

export default function ProfileSettings({ mode = 'profile' }: { mode?: 'profile' | 'settings' }) {
  const { currentUser, updateCurrentUser, navigate, nav, showToast } = useApp();
  if (!currentUser) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(
    mode || (nav.screen === 'ind-settings' ? 'settings' : 'profile')
  );

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit Form Fields
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editUsername, setEditUsername] = useState(
    currentUser.username || currentUser.name.toLowerCase().replace(/[^a-z0-9_]/g, '') || ''
  );
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editUniversity, setEditUniversity] = useState(currentUser.university || '');
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notifications & Privacy Settings
  const [notifications, setNotifications] = useState({
    bookings: true,
    promotions: false,
    updates: true,
    waitlist: true,
  });
  const [privacy, setPrivacy] = useState({ profileVisible: true, showBookings: false });

  const usernameDisplay = currentUser.username || currentUser.name.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user';

  const handleOpenEdit = () => {
    setEditName(currentUser.name || '');
    setEditUsername(currentUser.username || usernameDisplay);
    setEditPhone(currentUser.phone || '');
    setEditUniversity(currentUser.university || '');
    setEditBio(currentUser.bio || '');
    setEditAvatar(currentUser.avatar || '');
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setEditAvatar(reader.result);
        showToast('Photo selected. Click "Save Changes" to apply.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setEditAvatar('');
    showToast('Profile photo removed. Default avatar will be used.', 'info');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!editName.trim()) newErrors.name = 'Full name is required';
    if (!editUsername.trim()) newErrors.username = 'Username is required';
    else if (!/^[a-zA-Z0-9_]+$/.test(editUsername)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setTimeout(() => {
      updateCurrentUser({
        name: editName.trim(),
        username: editUsername.trim().toLowerCase(),
        phone: editPhone.trim(),
        university: editUniversity.trim(),
        bio: editBio.trim(),
        avatar: editAvatar,
      });
      setIsSaving(false);
      setIsEditModalOpen(false);
      showToast('Profile updated successfully!', 'success');
    }, 350);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl text-soot font-normal" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {activeTab === 'profile' ? 'My Profile' : 'Account Settings'}
          </h1>
          <p className="text-moss text-xs sm:text-sm mt-1 font-normal">Manage your identity, personal information, and preferences</p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex items-center gap-2 bg-white rounded-full p-1.5 border border-soot/8 shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              navigate('ind-profile');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${activeTab === 'profile'
                ? 'bg-[#DDE6DF] text-soot shadow-xs border border-soot/5'
                : 'text-moss hover:text-soot'
              }`}
          >
            <User size={15} />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              navigate('ind-settings');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${activeTab === 'settings'
                ? 'bg-[#DDE6DF] text-soot shadow-xs border border-soot/5'
                : 'text-moss hover:text-soot'
              }`}
          >
            <Settings size={15} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {activeTab === 'profile' ? (
        <div className="space-y-7">
          {/* Card 1: Main Profile Header Card */}
          <div className="bg-white rounded-3xl border border-soot/8 shadow-sm overflow-hidden">
            {/* Top Patterned Decorative Banner */}
            <div className="h-32 sm:h-40 w-full relative bg-gradient-to-r from-[#E5ECE9] via-[#E2EBE5] to-[#D9E5E0] border-b border-soot/6 overflow-hidden">
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(#2D3536 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />
            </div>

            {/* Profile Content Details */}
            <div className="px-6 sm:px-8 pb-8 pt-0 relative">
              {/* Header Row: Avatar */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
                {/* Avatar with Ring */}
                <div className="relative inline-block self-start">
                  <UserAvatar
                    src={currentUser.avatar}
                    name={currentUser.name}
                    size="2xl"
                    ring={true}
                  />
                </div>
              </div>

              {/* User Name, Role Badge, Username */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-normal text-soot tracking-tight" style={{ fontFamily: 'DM Serif Display, serif' }}>
                    {currentUser.name}
                  </h2>

                  {/* Account Role Badge */}
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-[#DDE6DF] text-soot border border-soot/6 capitalize">
                    {currentUser.role === 'individual' ? 'Individual' : currentUser.role}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-moss font-normal">
                  @{usernameDisplay}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Personal Information Section */}
          <div className="bg-white rounded-3xl border border-soot/8 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-soot/8 gap-4 flex-wrap">
              <div>
                <h3 className="text-xl font-normal text-soot" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  Personal Information
                </h3>
                <p className="text-moss text-xs mt-0.5 font-normal">Your official account details and contact information</p>
              </div>
              <button
                type="button"
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#DDE6DF] text-soot hover:bg-[#D0DDD3] text-xs sm:text-sm font-medium transition-all shadow-xs border border-soot/8 cursor-pointer active:scale-98"
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Full Name */}
              <div className="bg-[#F9F8F5] rounded-2xl p-4 border border-soot/6 transition-all hover:border-soot/12">
                <div className="text-[11px] font-medium uppercase tracking-wider text-moss mb-1 flex items-center gap-1.5">
                  <User size={13} className="text-moss/80" />
                  Full Name
                </div>
                <div className="text-sm sm:text-base font-normal text-soot">
                  {currentUser.name}
                </div>
              </div>

              {/* Username */}
              <div className="bg-[#F9F8F5] rounded-2xl p-4 border border-soot/6 transition-all hover:border-soot/12">
                <div className="text-[11px] font-medium uppercase tracking-wider text-moss mb-1 flex items-center gap-1.5">
                  <span className="font-mono text-xs">@</span>
                  Username
                </div>
                <div className="text-sm sm:text-base font-normal text-soot">
                  @{usernameDisplay}
                </div>
              </div>

              {/* Email Address */}
              <div className="bg-[#F9F8F5] rounded-2xl p-4 border border-soot/6 transition-all hover:border-soot/12">
                <div className="text-[11px] font-medium uppercase tracking-wider text-moss mb-1 flex items-center gap-1.5">
                  <Mail size={13} className="text-moss/80" />
                  Email Address
                </div>
                <div className="text-sm sm:text-base font-normal text-soot truncate" title={currentUser.email}>
                  {currentUser.email}
                </div>
              </div>

              {/* Phone Number */}
              <div className="bg-[#F9F8F5] rounded-2xl p-4 border border-soot/6 transition-all hover:border-soot/12">
                <div className="text-[11px] font-medium uppercase tracking-wider text-moss mb-1 flex items-center gap-1.5">
                  <Phone size={13} className="text-moss/80" />
                  Phone Number
                </div>
                <div className="text-sm sm:text-base font-normal text-soot">
                  {currentUser.phone || 'Not provided'}
                </div>
              </div>

              {/* Account Type */}
              <div className="bg-[#F9F8F5] rounded-2xl p-4 border border-soot/6 transition-all hover:border-soot/12">
                <div className="text-[11px] font-medium uppercase tracking-wider text-moss mb-1 flex items-center gap-1.5">
                  <Shield size={13} className="text-moss/80" />
                  Account Role
                </div>
                <div className="text-sm sm:text-base font-normal text-soot capitalize">
                  {currentUser.role} Account
                </div>
              </div>

              {/* University / Organization */}
              <div className="bg-[#F9F8F5] rounded-2xl p-4 border border-soot/6 transition-all hover:border-soot/12">
                <div className="text-[11px] font-medium uppercase tracking-wider text-moss mb-1 flex items-center gap-1.5">
                  <GraduationCap size={13} className="text-moss/80" />
                  University / Organization
                </div>
                <div className="text-sm sm:text-base font-normal text-soot">
                  {currentUser.university || currentUser.orgName || 'Not specified'}
                </div>
              </div>

              {/* Member Since */}
              <div className="bg-[#F9F8F5] rounded-2xl p-4 border border-soot/6 sm:col-span-2 transition-all hover:border-soot/12">
                <div className="text-[11px] font-medium uppercase tracking-wider text-moss mb-1 flex items-center gap-1.5">
                  <Calendar size={13} className="text-moss/80" />
                  Member Since
                </div>
                <div className="text-sm font-normal text-soot">
                  {currentUser.joinDate || 'March 2024'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Settings Tab */
        <div className="space-y-6">
          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl border border-soot/8 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-normal text-soot mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Notification Preferences
            </h3>
            <p className="text-moss text-xs mb-6 font-normal">Choose how and when you receive updates</p>

            <div className="space-y-4 divide-y divide-soot/6">
              {[
                { key: 'bookings', label: 'Booking confirmations & pass reminders', desc: 'Get SMS and email notifications for active bookings' },
                { key: 'updates', label: 'Coworking space announcements', desc: 'Receive notices about opening hours, maintenance, and new spaces' },
                { key: 'waitlist', label: 'Waitlist availability alerts', desc: 'Instant alert when a reserved desk becomes available' },
                { key: 'promotions', label: 'Partner deals & promotions', desc: 'Occasional discounts from our coworking network' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between pt-4 first:pt-0">
                  <div className="pr-4">
                    <div className="text-sm font-medium text-soot">{item.label}</div>
                    <div className="text-xs text-moss mt-0.5 font-normal">{item.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNotifications(prev => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof notifications],
                      }))
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${notifications[item.key as keyof typeof notifications] ? 'bg-soot' : 'bg-soot/15'
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Account Actions */}
          <div className="bg-white rounded-3xl border border-soot/8 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-normal text-soot mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Privacy & Security
            </h3>
            <p className="text-moss text-xs mb-6 font-normal">Manage data sharing and account security</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-soot">Public Member Profile</div>
                  <div className="text-xs text-moss font-normal">Allow verified space hosts to see your name on check-in</div>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacy(p => ({ ...p, profileVisible: !p.profileVisible }))}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${privacy.profileVisible ? 'bg-soot' : 'bg-soot/15'
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${privacy.profileVisible ? 'translate-x-7' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile Information"
        size="lg"
      >
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-[#F9F8F5] border border-soot/8">
            <div className="relative shrink-0">
              <UserAvatar
                src={editAvatar}
                name={editName || currentUser.name}
                size="xl"
                ring={true}
              />
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left space-y-2.5">
              <div>
                <div className="text-sm font-medium text-soot">Profile Photo</div>
                <p className="text-xs text-moss font-normal mt-0.5">
                  Upload a custom personal photo or use the clean default silhouette avatar.
                </p>
              </div>

              {/* Action Buttons strictly next to each other on the same line */}
              <div className="flex flex-row items-center justify-center sm:justify-start gap-3 pt-1 flex-nowrap">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 px-3 py-3 rounded-full bg-[#DDE6DF] text-soot hover:bg-[#D0DDD3] text-xs font-medium transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Upload size={14} className="shrink-0" />
                  <span>Upload Photo</span>
                </button>
                {editAvatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="h-9 px-3 py-3 rounded-full bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs  font-medium transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-3"
                  >
                    <Trash2 size={15} className="shrink-0" />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields with generous spacing and clear distinction */}
          <div className="space-y-5">
            {/* Full Name (Editable) */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-1.5 flex items-center justify-between">
                <span>Full Name <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Editable</span>
              </label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="e.g. Hadel Turki"
                className={`w-full px-4 py-3 rounded-2xl border text-sm text-soot outline-none transition-all font-normal ${errors.name ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-200' : 'border-soot/12 bg-white focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20'
                  }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-normal">{errors.name}</p>}
            </div>

            {/* Username (Editable) */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-1.5 flex items-center justify-between">
                <span>Username <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Editable</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moss font-normal text-sm">@</span>
                <input
                  type="text"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  placeholder="username"
                  className={`w-full pl-8 pr-4 py-3 rounded-2xl border text-sm text-soot outline-none transition-all font-normal ${errors.username ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-200' : 'border-soot/12 bg-white focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20'
                    }`}
                />
              </div>
              {errors.username && <p className="text-red-500 text-xs mt-1 font-normal">{errors.username}</p>}
            </div>

            {/* Email Address (Non-Editable / Read-Only with distinction) */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail size={12} />
                  <span>Email Address</span>
                </span>
                <span className="text-[10px] text-moss/80 bg-soot/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock size={10} /> Read-only
                </span>
              </label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-4 py-3 rounded-2xl border border-soot/8 bg-soot/5 text-moss text-sm cursor-not-allowed font-normal"
              />
            </div>

            {/* Phone Number (Editable) */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-1.5 flex items-center justify-between">
                <span>Phone Number</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Editable</span>
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                placeholder="+966 55 123 4567"
                className="w-full px-4 py-3 rounded-2xl border border-soot/12 bg-white text-sm text-soot outline-none focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 font-normal"
              />
            </div>

            {/* Role / Account Type (Non-Editable distinction) */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield size={12} />
                  <span>Account Role</span>
                </span>
                <span className="text-[10px] text-moss/80 bg-soot/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock size={10} /> Read-only
                </span>
              </label>
              <input
                type="text"
                value={`${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Account`}
                disabled
                className="w-full px-4 py-3 rounded-2xl border border-soot/8 bg-soot/5 text-moss text-sm cursor-not-allowed font-normal capitalize"
              />
            </div>

            {/* University / Organization (Editable) */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-1.5 flex items-center justify-between">
                <span>University / Organization</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Editable</span>
              </label>
              <input
                type="text"
                value={editUniversity}
                onChange={e => setEditUniversity(e.target.value)}
                placeholder="e.g. Umm Al-Qura University (UQU)"
                className="w-full px-4 py-3 rounded-2xl border border-soot/12 bg-white text-sm text-soot outline-none focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 font-normal"
              />
            </div>

            {/* Bio / Description (Editable) */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-1.5 flex items-center justify-between">
                <span>About / Bio</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Editable</span>
              </label>
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                rows={3}
                placeholder="A brief introduction about yourself or your work..."
                className="w-full px-4 py-3 rounded-2xl border border-soot/12 bg-white text-sm text-soot outline-none focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 font-normal resize-none"
              />
            </div>
          </div>

          {/* Modal Actions: Same sizes, matching heights, consistent gaps, and no text wrapping */}
          <div className="flex items-center gap-4 pt-4 border-t border-soot/8">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 h-10 py-3 px-6 rounded-full border border-soot/15 hover:bg-soot/5 text-soot text-sm font-medium transition-colors cursor-pointer inline-flex items-center justify-center whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 h-10 py-3 px-6 rounded-full bg-[#DDE6DF] text-soot hover:bg-[#D0DDD3] disabled:opacity-60 text-sm font-medium transition-all shadow-xs border border-soot/8 inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={16} className="shrink-0" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
