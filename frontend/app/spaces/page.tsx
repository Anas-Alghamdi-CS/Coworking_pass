'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, MapPin, ChevronDown } from 'lucide-react';
import { useApp } from '@/app/store';
import SpaceCard from '@/components/spaces/spaceCard';

const CITIES = ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Madinah', 'Makkah'];
const TYPES = ['all', 'hot-desk', 'private-office', 'meeting-room', 'mixed'];
const AMENITIES = ['WiFi', 'Coffee', 'Printer', 'Parking', 'Prayer Room', 'Meeting Rooms'];
const SORT_OPTIONS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Availability'];

export default function Browse() {
  const { spaces, navigate, currentUser, nav } = useApp();
  const initialCity = nav?.params?.city || (typeof window !== 'undefined' ? (window as any).__browseCity || '' : '');

  const [query, setQuery] = useState('');
  const [city, setCity] = useState(initialCity);
  const [spaceType, setSpaceType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(300);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState('Recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const visible = spaces.filter(s => currentUser?.role === 'admin' ? true : s.isVisible);

  const filtered = useMemo(() => {
    let list = visible.filter(s => {
      if (
        query &&
        !s.name.toLowerCase().includes(query.toLowerCase()) &&
        !s.city.toLowerCase().includes(query.toLowerCase()) &&
        !s.address.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }
      if (city && s.city !== city) return false;
      if (spaceType !== 'all' && s.type !== spaceType) return false;
      if (s.pricing.daily > maxPrice) return false;
      if (availableOnly && s.availableCapacity === 0) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every(a => s.amenities.includes(a))) return false;
      return true;
    });

    if (sort === 'Price: Low to High') list = [...list].sort((a, b) => a.pricing.daily - b.pricing.daily);
    else if (sort === 'Price: High to Low') list = [...list].sort((a, b) => b.pricing.daily - a.pricing.daily);
    else if (sort === 'Rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === 'Availability') list = [...list].sort((a, b) => b.availableCapacity - a.availableCapacity);

    return list;
  }, [visible, query, city, spaceType, maxPrice, availableOnly, selectedAmenities, sort]);

  const clearFilters = () => {
    setQuery('');
    setCity('');
    setSpaceType('all');
    setMaxPrice(300);
    setSelectedAmenities([]);
    setAvailableOnly(false);
  };

  const hasActiveFilters = query || city || spaceType !== 'all' || maxPrice < 300 || selectedAmenities.length > 0 || availableOnly;

  const toggleAmenity = (a: string) => {
    setSelectedAmenities(prev => (prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl text-soot font-normal mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Browse Spaces
        </h1>
        <p className="text-moss text-sm font-medium">{filtered.length} spaces found</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-8">
        {/* Search input */}
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-moss stroke-[1.7]" />
          <input
            type="text"
            placeholder="Search by space name or city..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-soot/10 bg-white text-soot text-sm outline-none focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 placeholder:text-moss/70 shadow-sm transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-moss hover:text-soot"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* City Filter */}
        <div className="relative">
          <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-moss pointer-events-none" />
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full md:w-auto pl-9 pr-9 py-3 rounded-2xl border border-soot/10 bg-white text-soot text-sm outline-none focus:border-eucalyptus appearance-none cursor-pointer shadow-sm font-medium"
          >
            <option value="">All Cities</option>
            {CITIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-moss pointer-events-none" />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-sm font-medium transition-all shadow-sm ${
            showFilters || hasActiveFilters
              ? 'bg-soot text-plaster border-soot shadow-md'
              : 'border-soot/10 bg-white text-soot hover:bg-soot/5'
          }`}
        >
          <SlidersHorizontal size={15} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-4 h-4 rounded-full bg-eucalyptus text-soot text-[10px] flex items-center justify-center font-bold">
              •
            </span>
          )}
        </button>

        {/* Sort Select */}
        <div className="relative">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="w-full md:w-auto pl-4 pr-9 py-3 rounded-2xl border border-soot/10 bg-white text-soot text-sm outline-none focus:border-eucalyptus appearance-none cursor-pointer shadow-sm font-medium"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-moss pointer-events-none" />
        </div>
      </div>

      {/* Filter Drawer / Panel */}
      {showFilters && (
        <div className="bg-white rounded-3xl border border-soot/10 p-6 sm:p-8 mb-8 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-soot/8">
            <span className="font-semibold text-soot text-base">Filter Options</span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline">
                <X size={13} /> Clear all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Space Type */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-moss mb-3 block">
                Space Type
              </label>
              <div className="flex flex-col gap-1.5">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setSpaceType(t)}
                    className={`text-left text-sm px-3.5 py-2 rounded-xl transition-colors font-medium ${
                      spaceType === t
                        ? 'bg-soot text-plaster'
                        : 'text-moss hover:bg-soot/5 hover:text-soot'
                    }`}
                  >
                    {t === 'all' ? 'All types' : t.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-moss mb-3 block">
                Max price / day: <span className="text-soot font-bold">SAR {maxPrice}</span>
              </label>
              <input
                type="range"
                min={50}
                max={300}
                step={10}
                value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
                className="w-full accent-soot cursor-pointer"
              />
              <div className="flex justify-between text-xs text-moss mt-2 font-medium">
                <span>SAR 50</span>
                <span>SAR 300</span>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-moss mb-3 block">
                Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(a => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                      selectedAmenities.includes(a)
                        ? 'bg-eucalyptus text-soot border-eucalyptus shadow-sm'
                        : 'border-soot/12 text-moss hover:border-soot/30 hover:text-soot bg-plaster/50'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-moss mb-3 block">
                Availability
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setAvailableOnly(!availableOnly)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    availableOnly ? 'bg-eucalyptus' : 'bg-soot/15'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      availableOnly ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-soot">Available only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-soot/8 p-16 text-center shadow-sm max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-soot/5 flex items-center justify-center mx-auto mb-4">
            <Search size={26} className="text-moss" />
          </div>
          <h3 className="text-xl font-semibold text-soot mb-2">No spaces found</h3>
          <p className="text-moss text-sm mb-6">
            We couldn't find any spaces matching your current filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 rounded-xl bg-soot text-plaster text-sm font-semibold hover:bg-soot-light transition-colors shadow-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(space => (
            <SpaceCard
              key={space.id}
              space={space}
              onSelect={s => navigate('space-details', { spaceId: s.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
