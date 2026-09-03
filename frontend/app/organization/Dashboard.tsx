'use client';

import React from 'react';
import { CalendarDays, MapPin, Star, Clock, ArrowRight, Bookmark, Check, Users, Building2 } from 'lucide-react';
import { useApp } from '@/app/store';
import { Space, isUserPassHolder, getEffectiveSpacePrice, Booking, getHourlyPriceForDuration, Employee } from '@/types/types';

export default function OrgDashboard() {
  const { currentUser, spaces, bookings, favorites, navigate } = useApp();

  if (!currentUser) return null;

  // Organization team bookings
  const orgBookings = bookings.filter((b: Booking) => b.userId === currentUser.id);
  const activeBookings = orgBookings.filter((b: Booking) => b.status === 'active');
  const favoriteSpaces = spaces.filter((s: Space) => favorites.includes(s.id) && s.isVisible);
  const employees = currentUser.employees || [];

  const getBookingPrice = (b: Booking) => {
    if (typeof b.totalPrice === 'number' && b.totalPrice > 0) return b.totalPrice;
    const sp = spaces.find(s => s.id === b.spaceId || s.name.toLowerCase() === b.spaceName.toLowerCase());
    if (sp) {
      if (b.plan === 'hourly') {
        return getHourlyPriceForDuration(sp, b.durationHours || 1) * (b.seats || 1);
      }
      const rate = (b.plan === 'daily' ? sp.pricing?.daily : b.plan === 'monthly' ? sp.pricing?.monthly : b.plan === 'yearly' ? sp.pricing?.yearly : 150) || 150;
      return rate * (b.seats || 1);
    }
    return b.totalPrice || 0;
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getEmpName = (id: string) => employees.find((e: Employee) => e.id === id)?.name || id;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
      {/* Welcome Header */}
      <div className="mb-8">
        <p className="text-moss text-base font-normal mb-1">{greeting()},</p>
        <h1 className="text-4xl sm:text-5xl text-soot font-normal" style={{ fontFamily: 'DM Serif Display, serif' }}>
          {currentUser.orgName || currentUser.name}
        </h1>
        <p className="text-moss text-xs sm:text-sm mt-1.5 font-normal">
          {currentUser.industry || 'Enterprise Solutions'} · {employees.length || currentUser.orgSize || 15} team members
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {/* Active bookings */}
        <div className="bg-white rounded-3xl p-6 border border-soot/8 shadow-sm flex flex-col justify-between h-36">
          <div className="text-moss">
            <CalendarDays size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <div className="text-3xl font-semibold text-soot leading-none mb-1.5">{activeBookings.length}</div>
            <div className="text-xs sm:text-sm text-moss font-medium">Active bookings</div>
          </div>
        </div>

        {/* Total bookings */}
        <div className="bg-white rounded-3xl p-6 border border-soot/8 shadow-sm flex flex-col justify-between h-36">
          <div className="text-moss">
            <Bookmark size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <div className="text-3xl font-semibold text-soot leading-none mb-1.5">{orgBookings.length}</div>
            <div className="text-xs sm:text-sm text-moss font-medium">Total bookings</div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-3xl p-6 border border-soot/8 shadow-sm flex flex-col justify-between h-36">
          <div className="text-moss">
            <Users size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <div className="text-3xl font-semibold text-soot leading-none mb-1.5">{employees.length || 1}</div>
            <div className="text-xs sm:text-sm text-moss font-medium">Team members</div>
          </div>
        </div>

        {/* Days booked */}
        <div className="bg-[#E5ECE9] rounded-3xl p-6 border border-eucalyptus/20 shadow-sm flex flex-col justify-between h-36">
          <div className="text-moss">
            <Clock size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <div className="text-3xl font-semibold text-soot leading-none mb-1.5">
              {orgBookings.filter(b => b.status !== 'cancelled').length * 4}
            </div>
            <div className="text-xs sm:text-sm text-moss font-medium">Days booked</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active bookings & Saved spaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Active bookings column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-soot font-normal" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Active bookings
            </h2>
            <button
              onClick={() => navigate('team-bookings')}
              className="text-sm font-medium text-moss hover:text-soot flex items-center gap-1 transition-colors cursor-pointer"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-soot/8 p-12 text-center shadow-sm min-h-[220px] flex flex-col items-center justify-center">
              <CalendarDays size={32} className="text-moss stroke-[1.5] mx-auto mb-3" />
              <div className="text-base font-semibold text-soot mb-2">No active team bookings</div>
              <button
                onClick={() => navigate('browse')}
                className="text-sm font-medium text-moss hover:text-soot flex items-center gap-1 transition-colors cursor-pointer"
              >
                Browse workspaces →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.slice(0, 3).map(b => (
                <div
                  key={b.id}
                  onClick={() => navigate('team-bookings')}
                  className="bg-white rounded-2xl border border-soot/8 p-4 shadow-sm hover:shadow-md hover:border-eucalyptus/40 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={b.spaceImage} alt={b.spaceName} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-soot text-base truncate">{b.spaceName}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-moss mt-0.5">
                        <MapPin size={12} />
                        <span>{b.spaceCity}</span>
                        <span>•</span>
                        <span>{b.startDate} {b.endDate && b.endDate !== b.startDate ? `→ ${b.endDate}` : ''}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-medium bg-eucalyptus/20 text-moss px-2 py-0.5 rounded-full capitalize">
                          {b.plan === 'hourly' ? `${b.durationHours || 1}h Hourly` : `${b.plan} pass`} • {b.seats} seat{b.seats > 1 ? 's' : ''}
                        </span>
                        {b.employees && b.employees.length > 0 && (
                          <span className="text-[11px] text-moss bg-soot/5 px-2 py-0.5 rounded-full">
                            {getEmpName(b.employees[0]).split(' ')[0]} {b.employees.length > 1 ? `+${b.employees.length - 1}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-semibold text-soot">SAR {getBookingPrice(b).toLocaleString()}</div>
                    <span className="text-xs text-moss">Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved spaces column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-soot font-normal" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Saved spaces
            </h2>
            <button
              onClick={() => navigate('browse')}
              className="text-sm font-medium text-moss hover:text-soot flex items-center gap-1 transition-colors cursor-pointer"
            >
              Browse more <ArrowRight size={14} />
            </button>
          </div>

          {favoriteSpaces.length === 0 ? (
            <div className="bg-white rounded-3xl border border-soot/8 p-12 text-center shadow-sm min-h-[220px] flex flex-col items-center justify-center">
              <Star size={32} className="text-moss stroke-[1.5] mx-auto mb-3" />
              <div className="text-base font-semibold text-soot mb-2">No saved spaces yet</div>
              <button
                onClick={() => navigate('browse')}
                className="text-sm font-medium text-moss hover:text-soot flex items-center gap-1 transition-colors cursor-pointer"
              >
                Browse workspaces →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteSpaces.map(space => (
                <div
                  key={space.id}
                  onClick={() => navigate('space-details', { spaceId: space.id })}
                  className="bg-white rounded-2xl border border-soot/8 p-4 shadow-sm hover:shadow-md hover:border-eucalyptus/40 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={space.images[0]}
                      alt={space.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-soot text-base truncate">{space.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-moss mt-0.5">
                        <MapPin size={12} />
                        <span>{space.city}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-moss mt-1 font-medium">
                        <Star size={12} fill="#98AA9D" className="text-eucalyptus" />
                        <span>{space.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {(() => {
                      const planInfo = getEffectiveSpacePrice(currentUser, space, 'daily');
                      if (planInfo.isCovered) {
                        return (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-eucalyptus/30 text-soot font-semibold text-[11px] border border-eucalyptus/40 shadow-2xs">
                            <Check size={11} className="text-moss shrink-0" />
                            <span>Corporate Pass</span>
                          </span>
                        );
                      }
                      if (planInfo.hasDiscount) {
                        return (
                          <div>
                            <div className="text-sm font-semibold text-soot">SAR {planInfo.effectivePrice}/day</div>
                            <div className="text-[10px] text-amber-900 font-semibold">{planInfo.discountPercentage}% Pass Discount</div>
                          </div>
                        );
                      }
                      return <div className="text-sm font-semibold text-soot">SAR {space.pricing.daily}/day</div>;
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-10 grid sm:grid-cols-3 gap-5">
        {[
          { label: 'Browse workspaces', desc: 'Find and reserve desks & team rooms', action: () => navigate('browse'), icon: Building2 },
          { label: 'Team bookings', desc: 'Manage active company reservations', action: () => navigate('team-bookings'), icon: CalendarDays },
          { label: 'Manage team', desc: 'Add colleagues to enterprise pass', action: () => navigate('company-team'), icon: Users },
        ].map(a => (
          <button
            key={a.label}
            onClick={a.action}
            className="bg-white rounded-3xl border border-soot/8 p-6 text-left hover:border-eucalyptus/40 hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-eucalyptus/15 flex items-center justify-center mb-3.5 group-hover:bg-eucalyptus/25 transition-colors">
              <a.icon size={18} className="text-moss" />
            </div>
            <div className="font-semibold text-soot text-base">{a.label}</div>
            <div className="text-xs text-moss mt-1 font-normal">{a.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
