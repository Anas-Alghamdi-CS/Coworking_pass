'use client';

import { useState } from 'react';
import { ArrowRight, MapPin, Star, Users, Zap, Shield, Headphones, ChevronDown, Quote } from 'lucide-react';
import { useApp } from './store';
import GuestNav from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const cities = ['All Cities', 'Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Madinah', 'Makkah'];

export default function Landing() {
  const { navigate, spaces } = useApp();
  const [searchCity, setSearchCity] = useState('');

  const featured = spaces.filter(s => s.isFeatured && s.isVisible).slice(0, 3);

  const handleSearch = () => {
    navigate('browse', { city: searchCity });
  };

  return (
    <div className="min-h-screen flex flex-col bg-plaster">
      <GuestNav />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/landing-hero.jpg"
            alt="Modern coworking space"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle overlay for clean brightness and clear text */}
          <div className="absolute inset-0 bg-gradient-to-t from-soot/60 via-soot/20 to-transparent pointer-events-none" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full flex flex-col items-center justify-center text-center">
          <Badge variant="mist" className="mb-6 bg-soot/40 backdrop-blur-md text-plaster border-soot/30 px-4 py-1.5 text-xs font-semibold">
            <Zap size={13} className="text-eucalyptus" />
            Saudi Arabia's Premier Coworking Network
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.15] mb-6 tracking-tight drop-shadow-md text-center font-serif-display">
            Your Perfect Workspace,<br />
            <span className="text-eucalyptus italic font-serif">Anywhere in the Kingdom.</span>
          </h1>

          <p className="text-plaster/95 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal text-center mx-auto">
            Instantly access flexible, fully equipped coworking spaces in Riyadh, Jeddah, Dammam, and beyond. Book by the day, month, or year.
          </p>

          {/* Search Bar Widget */}
          <div className="bg-plaster-surface/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-soot/15 flex flex-col sm:flex-row gap-3 w-full max-w-xl mx-auto">
            <div className="flex items-center gap-3 flex-1 px-4 py-1 border border-soot/15 rounded-xl bg-plaster-dark/30 hover:bg-plaster-dark/50 focus-within:border-eucalyptus focus-within:ring-2 focus-within:ring-eucalyptus/30 transition-colors duration-200">
              <MapPin size={18} className="text-moss shrink-0" />
              <select
                className="flex-1 bg-transparent text-soot text-sm font-medium outline-none cursor-pointer py-2.5"
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
              >
                {cities.map(c => <option key={c} value={c === 'All Cities' ? '' : c}>{c}</option>)}
              </select>
            </div>
            <Button
              onClick={handleSearch}
              variant="primary"
              className="px-7 py-3 font-medium text-sm shrink-0 bg-soot text-plaster hover:bg-moss transition-colors duration-200"
            >
              Find Spaces
              <ArrowRight size={16} />
            </Button>
          </div>

          {/* Key Trust Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-8 text-plaster/90 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Star size={14} fill="currentColor" className="text-eucalyptus" />
              <span>4.8 Avg Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-eucalyptus" />
              <span>2,400+ Active Members</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-eucalyptus" />
              <span>Verified Workspaces</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 animate-bounce pointer-events-none">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* Stats Band */}
      <section className="bg-soot py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '8+', label: 'Verified Spaces' },
            { value: '6', label: 'Saudi Cities' },
            { value: '2,400+', label: 'Active Members' },
            { value: '4.8★', label: 'Average Rating' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-normal text-eucalyptus mb-1 font-serif-display">{s.value}</div>
              <div className="text-plaster/90 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Spaces Section */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-moss text-xs font-semibold uppercase tracking-wider mb-2">Featured Workspaces</p>
            <h2 className="text-4xl sm:text-5xl text-soot font-normal font-serif-display">Popular spaces</h2>
          </div>
          <button
            onClick={() => navigate('browse')}
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-soot hover:text-moss transition-colors duration-200 cursor-pointer"
          >
            View all <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(space => (
            <div
              key={space.id}
              className="group cursor-pointer bg-plaster-dark/40 hover:bg-plaster-dark/80 rounded-3xl border border-soot/12 overflow-hidden transition-colors duration-200 active:scale-[0.99]"
              onClick={() => navigate('space-details', { spaceId: space.id })}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={space.images[0]}
                  alt={space.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-soot/70 via-soot/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-semibold text-lg leading-snug font-serif-display">{space.name}</div>
                  <div className="flex items-center gap-1.5 text-plaster/90 text-xs font-medium mt-1">
                    <MapPin size={13} className="text-eucalyptus" />
                    {space.city} • {space.address}
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-plaster-surface/95 backdrop-blur-md rounded-2xl px-3 py-1.5 text-center border border-soot/12">
                  <div className="text-soot font-bold text-sm">SAR {space.pricing.daily}</div>
                  <div className="text-moss text-[10px] font-medium">/ day</div>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-soot font-semibold">
                  <Star size={14} fill="currentColor" className="text-eucalyptus" />
                  <span>{space.rating}</span>
                  <span className="text-moss font-normal text-xs">({space.reviewCount} reviews)</span>
                </div>
                <Badge variant={space.availableCapacity === 0 ? 'danger' : space.availableCapacity <= 5 ? 'warning' : 'eucalyptus'}>
                  {space.availableCapacity === 0 ? 'Fully Booked' : space.availableCapacity <= 5 ? 'Limited Seats' : 'Available'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Button
            onClick={() => navigate('browse')}
            variant="secondary"
            className="px-6 py-2.5 text-sm font-medium"
          >
            View all spaces
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-mist-light/40 py-20 border-y border-soot/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-moss text-xs font-semibold uppercase tracking-wider mb-2">Simple Process</p>
            <h2 className="text-4xl sm:text-5xl text-soot font-normal font-serif-display">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse & Discover', desc: 'Explore verified coworking spaces across Saudi Arabia, filtered by city, workspace type, and amenities.' },
              { step: '02', title: 'Choose Your Plan', desc: 'Select a flexible daily, monthly, or corporate pass that fits your schedule and budget.' },
              { step: '03', title: 'Book & Work', desc: 'Confirm instantly and access your space. Manage, edit, or cancel anytime from your dashboard.' },
            ].map(item => (
              <div key={item.step} className="bg-plaster-dark/40 hover:bg-plaster-dark/80 rounded-3xl p-7 border border-soot/12 text-center transition-colors duration-200 active:scale-[0.99] cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-eucalyptus/20 text-soot flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                  {item.step}
                </div>
                <h3 className="font-semibold text-soot text-xl mb-2 font-serif-display">{item.title}</h3>
                <p className="text-moss text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Coworking Pass */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-moss text-xs font-semibold uppercase tracking-wider mb-2">Why Coworking Pass</p>
            <h2 className="text-4xl sm:text-5xl text-soot mb-6 font-serif-display">Built for the modern professional</h2>
            <div className="space-y-5">
              {[
                { icon: Zap, title: 'Instant Booking', desc: 'Book any space in under 2 minutes with real-time availability confirmation.', bg: 'bg-eucalyptus/20' },
                { icon: Shield, title: 'Secure & Verified', desc: 'Every space is verified and all payments are processed securely.', bg: 'bg-mist-light' },
                { icon: Headphones, title: 'Dedicated Support', desc: 'Our customer care team is always here to assist with your bookings.', bg: 'bg-eucalyptus/20' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl ${f.bg} flex items-center justify-center shrink-0 text-soot`}>
                    <f.icon size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-soot text-base mb-1">{f.title}</div>
                    <div className="text-moss text-sm leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-80 rounded-3xl overflow-hidden border border-soot/10">
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&auto=format"
              alt="Coworking professionals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-soot/15 rounded-3xl" />
          </div>
        </div>
      </section>

      {/* Testimonials Band */}
      <section className="bg-plaster-dark/40 py-16 border-y border-soot/10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <Quote size={32} className="text-eucalyptus mx-auto opacity-80" />
          <p className="text-xl sm:text-2xl text-soot font-serif-display italic leading-relaxed">
            "Coworking Pass simplified remote work for our entire team across Riyadh and Jeddah. Seamless booking and outstanding space quality."
          </p>
          <div className="pt-2">
            <div className="text-sm font-semibold text-soot">Sarah Al-Qahtani</div>
            <div className="text-xs text-moss">Head of People & Culture, TechFlow Saudi</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-soot py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl text-white mb-4 font-serif-display">
            Ready to find your workspace?
          </h2>
          <p className="text-plaster/90 text-base sm:text-lg mb-8 leading-relaxed font-normal">
            Join thousands of professionals working smarter across Saudi Arabia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate('signup')}
              variant="primary"
              className="px-8 py-3.5 font-medium text-base bg-plaster text-soot hover:bg-eucalyptus hover:text-soot transition-colors duration-200 cursor-pointer active:scale-[0.98]"
            >
              Get started free
            </Button>
            <Button
              onClick={() => navigate('browse')}
              variant="secondary"
              className="px-8 py-3.5 font-medium text-base bg-plaster-dark/40 text-plaster hover:bg-plaster-dark hover:text-soot transition-colors duration-200 cursor-pointer active:scale-[0.98]"
            >
              Browse spaces
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
