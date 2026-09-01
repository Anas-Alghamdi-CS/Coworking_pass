'use client';

import React from 'react';
import { Heart, MapPin, Star, Users } from 'lucide-react';
import { Space } from '@/types/types';
import { useApp } from '@/app/store';

interface SpaceCardProps {
  space: Space;
  onSelect: (space: Space) => void;
}

export default function SpaceCard({ space, onSelect }: SpaceCardProps) {
  const { favorites, toggleFavorite, currentUser } = useApp();
  const isFav = favorites.includes(space.id);

  const availability = space.availableCapacity === 0
    ? { label: 'Fully Booked', badgeStyle: 'bg-white/95 text-red-600' }
    : space.availableCapacity <= 5
    ? { label: 'Limited', badgeStyle: 'bg-white/95 text-amber-700' }
    : { label: 'Available', badgeStyle: 'bg-white/95 text-[#516B5D]' };

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-soot/8 flex flex-col justify-between"
      onClick={() => onSelect(space)}
    >
      {/* Image Thumbnail */}
      <div className="relative overflow-hidden h-48 sm:h-52">
        <img
          src={space.images[0]}
          alt={space.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-soot/40 via-transparent to-black/10" />

        {/* Top-left Status Badge */}
        <span className={`absolute top-3.5 left-3.5 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${availability.badgeStyle}`}>
          {availability.label}
        </span>

        {/* Top-right Favorite Button */}
        {currentUser && (
          <button
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform active:scale-90"
            onClick={e => {
              e.stopPropagation();
              toggleFavorite(space.id);
            }}
          >
            <Heart
              size={15}
              fill={isFav ? '#98AA9D' : 'none'}
              stroke={isFav ? '#98AA9D' : '#2D3536'}
              className="transition-colors"
            />
          </button>
        )}

        {/* Bottom-left Rating Overlay */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-white text-xs font-medium drop-shadow-sm">
          <Star size={12} fill="#FDB813" stroke="#FDB813" />
          <span>{space.rating}</span>
          <span className="opacity-80">({space.reviewCount})</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Price */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="font-semibold text-soot text-base leading-snug group-hover:text-moss transition-colors">
              {space.name}
            </h3>
            <div className="text-right shrink-0">
              <div className="text-soot font-semibold text-sm">SAR {space.pricing.daily}</div>
              <div className="text-moss text-[11px] font-normal">/ day</div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-moss text-xs mb-3">
            <MapPin size={13} className="shrink-0" />
            <span>{space.city}</span>
          </div>

          {/* Amenities Chips */}
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {space.amenities.slice(0, 2).map(a => (
              <span
                key={a}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F2EFE8] text-soot/80 font-medium border border-soot/5"
              >
                {a}
              </span>
            ))}
            {space.amenities.length > 2 && (
              <span className="text-[11px] px-2 py-1 rounded-lg bg-[#F2EFE8] text-moss font-medium border border-soot/5">
                +{space.amenities.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Capacity Footer */}
        <div className="flex items-center gap-1.5 text-xs text-moss pt-3 border-t border-soot/6">
          <Users size={13} />
          <span>{space.availableCapacity}/{space.totalCapacity} available</span>
        </div>
      </div>
    </div>
  );
}
