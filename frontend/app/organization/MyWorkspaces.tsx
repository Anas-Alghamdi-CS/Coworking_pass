'use client';

import { useState } from 'react';
import { Search, Building2, Plus, Eye, EyeOff, Edit2, Trash2, LayoutGrid, List, MapPin, Users, CalendarDays, MoreVertical, Filter } from 'lucide-react';
import { useApp } from '@/app/store';
import { Booking, Space } from '@/types';
import Modal from '@/components/Modal';

const SPACE_TYPES = ['All types', 'hot-desk', 'private-office', 'meeting-room', 'mixed'];
const CITIES = ['All cities', 'Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Madinah', 'Makkah'];
const STATUSES = ['All', 'published', 'draft', 'hidden'];

export default function MyWorkspaces() {
  const { currentUser, spaces, navigate, toggleSpaceVisibility, deleteSpace, bookings } = useApp();
  if (!currentUser) return null;

  const companySpaces = spaces.filter((s: Space) => s.ownerId === currentUser.id);

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All cities');
  const [typeFilter, setTypeFilter] = useState('All types');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [deleteModal, setDeleteModal] = useState<Space | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = companySpaces.filter((s: Space) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase());
    const matchCity = cityFilter === 'All cities' || s.city === cityFilter;
    const matchType = typeFilter === 'All types' || s.type === typeFilter;
    const matchStatus = statusFilter === 'All'
      || (statusFilter === 'published' && s.isVisible && s.status !== 'draft')
      || (statusFilter === 'draft' && s.status === 'draft')
      || (statusFilter === 'hidden' && !s.isVisible && s.status !== 'draft');
    return matchSearch && matchCity && matchType && matchStatus;
  });

  const getBookingCount = (spaceId: string) =>
    bookings.filter((b: Booking) => b.spaceId === spaceId && b.status !== 'cancelled').length;

  const getStatusLabel = (space: Space) => {
    if (space.status === 'draft') return { label: 'Draft', cls: 'bg-amber-50 text-amber-600 border-amber-100' };
    if (!space.isVisible) return { label: 'Hidden', cls: 'bg-soot/8 text-moss border-soot/12' };
    return { label: 'Active', cls: 'bg-eucalyptus/15 text-moss border-eucalyptus/20' };
  };

  const handleDelete = (space: Space) => {
    deleteSpace(space.id);
    setDeleteModal(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl text-soot" style={{ fontFamily: 'DM Serif Display, serif' }}>My Workspaces</h1>
          <p className="text-moss text-sm mt-1">{companySpaces.length} workspace{companySpaces.length !== 1 ? 's' : ''} listed</p>
        </div>
        <button
          onClick={() => navigate('company-add-workspace')}
          className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#374142] text-[#FAF8F5] text-sm font-medium ring-1 ring-white/15 shadow-sm hover:bg-[#2D3536] transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <Plus size={15} />
          Add workspace
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-soot/8 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-40 px-3 py-2 rounded-xl border border-soot/10 bg-plaster">
          <Search size={14} className="text-moss shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search workspaces..."
            className="flex-1 bg-transparent text-soot text-sm outline-none"
          />
        </div>
        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-soot/10 bg-plaster text-soot text-sm outline-none">
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-soot/10 bg-plaster text-soot text-sm outline-none capitalize">
          {SPACE_TYPES.map(t => <option key={t} className="capitalize">{t === 'All types' ? t : t.replace('-', ' ')}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-soot/10 bg-plaster text-soot text-sm outline-none capitalize">
          {STATUSES.map(s => <option key={s} className="capitalize">{s}</option>)}
        </select>
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => setViewMode('card')} className={`p-2 rounded-lg transition-colors ${viewMode === 'card' ? 'bg-soot text-plaster' : 'text-moss hover:bg-soot/5'}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-soot text-plaster' : 'text-moss hover:bg-soot/5'}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-soot/8 p-16 text-center">
          <Building2 size={32} className="text-moss mx-auto mb-4" />
          <h3 className="font-semibold text-soot mb-2">
            {companySpaces.length === 0 ? 'No workspaces yet' : 'No workspaces match your filters'}
          </h3>
          <p className="text-sm text-moss mb-5">
            {companySpaces.length === 0 ? 'Add your first workspace to start accepting bookings.' : 'Try adjusting the filters above.'}
          </p>
          {companySpaces.length === 0 && (
            <button onClick={() => navigate('company-add-workspace')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-soot text-plaster font-medium text-sm">
              <Plus size={14} />
              Add your first workspace
            </button>
          )}
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((space: Space) => {
            const { label, cls } = getStatusLabel(space);
            const occupancy = space.totalCapacity > 0
              ? Math.round(((space.totalCapacity - space.availableCapacity) / space.totalCapacity) * 100)
              : 0;
            const bookingCount = getBookingCount(space.id);
            return (
              <div key={space.id} className="bg-white rounded-2xl border border-soot/8 overflow-hidden hover:shadow-sm transition-shadow">
                <div className="relative h-44">
                  <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${cls}`}>{label}</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === space.id ? null : space.id)}
                        className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
                      >
                        <MoreVertical size={14} className="text-soot" />
                      </button>
                      {menuOpen === space.id && (
                        <div className="absolute right-0 top-9 bg-white rounded-xl border border-soot/8 shadow-lg z-10 w-44 py-1">
                          <button
                            onClick={() => { navigate('company-workspace-details', { spaceId: space.id }); setMenuOpen(null); }}
                            className="w-full px-4 py-2 text-sm text-soot text-left hover:bg-plaster"
                          >View details</button>
                          <button
                            onClick={() => { toggleSpaceVisibility(space.id); setMenuOpen(null); }}
                            className="w-full px-4 py-2 text-sm text-soot text-left hover:bg-plaster flex items-center gap-2"
                          >
                            {space.isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                            {space.isVisible ? 'Hide workspace' : 'Show workspace'}
                          </button>
                          <button
                            onClick={() => { setDeleteModal(space); setMenuOpen(null); }}
                            className="w-full px-4 py-2 text-sm text-red-500 text-left hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-soot mb-0.5">{space.name}</div>
                  <div className="flex items-center gap-1 text-xs text-moss mb-3">
                    <MapPin size={11} />
                    {space.city} · <span className="capitalize">{space.type.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-moss mb-3">
                    <span className="flex items-center gap-1"><Users size={11} />{space.availableCapacity}/{space.totalCapacity} available</span>
                    <span className="flex items-center gap-1"><CalendarDays size={11} />{bookingCount} bookings</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-1.5 bg-soot/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-eucalyptus" style={{ width: `${occupancy}%` }} />
                    </div>
                    <span className="text-[10px] text-moss">{occupancy}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-soot">SAR {space.pricing.daily}<span className="text-xs font-normal text-moss">/day</span></div>
                    <button
                      onClick={() => navigate('company-workspace-details', { spaceId: space.id })}
                      className="text-xs text-moss hover:text-soot font-medium transition-colors"
                    >
                      Manage →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table view */
        <div className="bg-white rounded-2xl border border-soot/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-soot/8 bg-plaster/50">
                  {['Workspace', 'City', 'Type', 'Capacity', 'Occupancy', 'Price/day', 'Bookings', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-moss">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-soot/5">
                {filtered.map((space: Space) => {
                  const { label, cls } = getStatusLabel(space);
                  const occupancy = space.totalCapacity > 0
                    ? Math.round(((space.totalCapacity - space.availableCapacity) / space.totalCapacity) * 100) : 0;
                  return (
                    <tr key={space.id} className="hover:bg-plaster/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={space.images[0]} alt={space.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                          <span className="font-medium text-soot">{space.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-moss">{space.city}</td>
                      <td className="px-4 py-3 text-moss capitalize">{space.type.replace('-', ' ')}</td>
                      <td className="px-4 py-3 text-moss">{space.availableCapacity}/{space.totalCapacity}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-soot/8 rounded-full overflow-hidden">
                            <div className="h-full bg-eucalyptus rounded-full" style={{ width: `${occupancy}%` }} />
                          </div>
                          <span className="text-xs text-moss">{occupancy}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-soot">SAR {space.pricing.daily}</td>
                      <td className="px-4 py-3 text-moss">{getBookingCount(space.id)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${cls}`}>{label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSpaceVisibility(space.id)}
                            className="p-1.5 rounded-lg hover:bg-soot/5 text-moss transition-colors"
                            title={space.isVisible ? 'Hide' : 'Show'}
                          >
                            {space.isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            onClick={() => setDeleteModal(space)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-moss hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete workspace" size="sm">
        {deleteModal && (
          <div className="p-6">
            <p className="text-sm text-moss mb-1">
              Are you sure you want to delete <span className="font-semibold text-soot">{deleteModal.name}</span>?
            </p>
            <p className="text-xs text-moss/70 mb-6">This action cannot be undone. All workspace data will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl border border-soot/15 text-soot text-sm font-medium">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteModal)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold">
                Delete workspace
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
