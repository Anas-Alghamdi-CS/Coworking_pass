'use client';

import React, { useState } from 'react';
import { Building2, Settings, Users, Globe, Phone, Mail, Plus, Trash2, Camera, Check, AlertCircle } from 'lucide-react';
import { useApp } from '@/app/store';
import { Employee } from '@/types/types';
import Modal from '@/components/ui/Modal';
import UserAvatar from '@/components/ui/UserAvatar';

export default function OrgProfile() {
  const { currentUser, navigate, nav, updateCurrentUser, showToast } = useApp();
  if (!currentUser) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(
    nav.screen === 'org-settings' ? 'settings' : 'profile'
  );

  const [orgName, setOrgName] = useState(currentUser.orgName || currentUser.name || '');
  const [orgSize, setOrgSize] = useState(String(currentUser.orgSize || '15'));
  const [industry, setIndustry] = useState(currentUser.industry || 'Technology');
  const [website, setWebsite] = useState(currentUser.website || 'https://sauditech.sa');
  const [orgDescription, setOrgDescription] = useState(
    currentUser.orgDescription || 'Leading technology consulting firm specializing in digital transformation for Saudi enterprises.'
  );
  const [phone, setPhone] = useState(currentUser.phone || '+966 56 456 7890');
  const [saved, setSaved] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>(currentUser.employees || []);
  const [addEmpModal, setAddEmpModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', department: '' });

  const handleSaveProfile = () => {
    updateCurrentUser({
      orgName,
      orgSize: parseInt(orgSize) || 0,
      industry,
      website,
      orgDescription,
      phone,
    });
    setSaved(true);
    showToast('Organization profile updated.', 'success');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddEmployee = () => {
    if (!newEmp.name || !newEmp.email) {
      showToast('Name and email are required.', 'error');
      return;
    }
    const emp: Employee = { id: `emp-${Date.now()}`, ...newEmp };
    const updated = [...employees, emp];
    setEmployees(updated);
    updateCurrentUser({ employees: updated });
    setNewEmp({ name: '', email: '', department: '' });
    setAddEmpModal(false);
    showToast('Team member added successfully.', 'success');
  };

  const handleRemoveEmployee = (id: string) => {
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    updateCurrentUser({ employees: updated });
    showToast('Employee removed.');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl text-soot font-normal mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>
          {activeTab === 'profile' ? 'Organization Profile' : 'Company Settings'}
        </h1>
        <p className="text-moss text-sm font-medium">Manage company information, team members, and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="inline-flex items-center gap-2 bg-white rounded-full p-1.5 border border-soot/8 shadow-xs mb-8">
        <button
          onClick={() => {
            setActiveTab('profile');
            navigate('org-profile');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'profile'
              ? 'bg-[#DDE6DF] text-soot shadow-xs border border-soot/6'
              : 'text-moss hover:text-soot hover:bg-soot/5'
          }`}
        >
          <Building2 size={16} />
          <span>Profile & Team</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('settings');
            navigate('org-settings');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'settings'
              ? 'bg-[#DDE6DF] text-soot shadow-xs border border-soot/6'
              : 'text-moss hover:text-soot hover:bg-soot/5'
          }`}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-8">
          {/* Organization Info Card */}
          <div className="bg-white rounded-3xl border border-soot/8 p-8 shadow-sm">
            <h2 className="text-xl font-normal text-soot mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Company Details
            </h2>

            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-soot/8">
              <div className="relative">
                <UserAvatar
                  src={currentUser.avatar}
                  name={currentUser.orgName || currentUser.name}
                  size="xl"
                  ring={true}
                  showCameraBadge={true}
                />
              </div>
              <div>
                <div className="font-medium text-soot text-xl">{currentUser.orgName || currentUser.name}</div>
                <div className="text-sm text-moss font-normal">{currentUser.email}</div>
                <div className="inline-block text-xs font-medium text-soot bg-[#DDE6DF] border border-soot/6 px-3 py-0.5 rounded-full mt-1.5">
                  Organization Account • {employees.length} Team Members
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-2">
                  Total Team Size
                </label>
                <input
                  type="number"
                  value={orgSize}
                  onChange={e => setOrgSize(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white font-normal"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white font-normal"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-moss mb-2">
                  Company Overview
                </label>
                <textarea
                  value={orgDescription}
                  onChange={e => setOrgDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white resize-none font-normal"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveProfile}
                className="px-8 py-3 rounded-full bg-[#DDE6DF] text-soot hover:bg-[#D0DDD3] font-medium text-sm transition-all shadow-xs border border-soot/8 cursor-pointer"
              >
                {saved ? '✓ Saved Changes' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Team Members Card */}
          <div className="bg-white rounded-3xl border border-soot/8 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-soot/8">
              <div>
                <h2 className="text-xl font-normal text-soot" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  Team Members ({employees.length})
                </h2>
                <p className="text-moss text-xs mt-0.5 font-normal">Manage employees who can access booked workspaces</p>
              </div>
              <button
                onClick={() => setAddEmpModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DDE6DF] text-soot text-xs font-medium hover:bg-[#D0DDD3] transition-all shadow-xs border border-soot/8 cursor-pointer"
              >
                <Plus size={14} /> Add Member
              </button>
            </div>

            {employees.length === 0 ? (
              <div className="text-center py-10 text-moss text-sm">
                No team members added yet. Click &quot;Add Member&quot; to invite colleagues.
              </div>
            ) : (
              <div className="divide-y divide-soot/6">
                {employees.map(emp => (
                  <div key={emp.id} className="flex items-center justify-between py-3.5 group">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-eucalyptus/20 flex items-center justify-center text-sm font-bold text-moss shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-soot">{emp.name}</div>
                        <div className="text-xs text-moss">
                          {emp.department} • {emp.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveEmployee(emp.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-moss hover:text-red-500 transition-colors"
                      title="Remove member"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-soot/8 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-soot mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Contact Information
            </h2>
            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-2 flex items-center gap-1.5">
                  <Phone size={13} /> Official Phone Number
                </label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-soot/10 bg-[#F9F8F5] text-soot text-sm outline-none focus:border-eucalyptus focus:bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-2 flex items-center gap-1.5">
                  <Mail size={13} /> Admin Email
                </label>
                <input
                  value={currentUser.email}
                  disabled
                  className="w-full px-4 py-3 rounded-2xl border border-soot/8 bg-soot/5 text-moss text-sm cursor-not-allowed font-medium"
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              className="px-6 py-3 rounded-2xl bg-soot text-plaster text-sm font-semibold hover:bg-soot-light transition-all shadow-sm"
            >
              Save Contact Info
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-red-200 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-red-600 mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Danger Zone
            </h2>
            <p className="text-sm text-moss mb-5 leading-relaxed">
              Deleting your organization account will remove all team access, active bookings, and company profiles.
            </p>
            <button className="px-5 py-2.5 rounded-xl border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
              Delete Organization
            </button>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      <Modal open={addEmpModal} onClose={() => setAddEmpModal(false)} title="Add Team Member" size="sm">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-1.5">Full Name</label>
            <input
              value={newEmp.name}
              onChange={e => setNewEmp(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Fahad Al-Dosari"
              className="w-full px-4 py-3 rounded-xl border border-soot/12 bg-plaster text-soot text-sm outline-none focus:border-eucalyptus font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-1.5">Email Address</label>
            <input
              type="email"
              value={newEmp.email}
              onChange={e => setNewEmp(prev => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. fahad@sauditech.sa"
              className="w-full px-4 py-3 rounded-xl border border-soot/12 bg-plaster text-soot text-sm outline-none focus:border-eucalyptus font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-moss mb-1.5">Department</label>
            <input
              value={newEmp.department}
              onChange={e => setNewEmp(prev => ({ ...prev, department: e.target.value }))}
              placeholder="e.g. Engineering"
              className="w-full px-4 py-3 rounded-xl border border-soot/12 bg-plaster text-soot text-sm outline-none focus:border-eucalyptus font-medium"
            />
          </div>
          <div className="flex gap-4 pt-3">
            <button
              onClick={() => setAddEmpModal(false)}
              className="flex-1 py-3 px-6 rounded-full border border-soot/15 text-soot text-sm font-medium hover:bg-soot/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEmployee}
              className="flex-1 py-3 px-6 rounded-full bg-[#DDE6DF] text-soot hover:bg-[#D0DDD3] text-sm font-medium transition-all shadow-xs border border-soot/8 cursor-pointer"
            >
              Add Member
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
