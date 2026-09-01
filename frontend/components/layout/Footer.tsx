'use client';

import LogoImage from './logo';
import { useApp } from '@/app/store';

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="bg-soot text-plaster mt-auto border-t border-soot-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-soot-light/30">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => navigate('landing')}
              className="flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-eucalyptus rounded-xl p-0.5"
            >
              <LogoImage className="h-8 w-auto " />
              <span className="font-semibold text-plaster text-lg tracking-tight group-hover:text-eucalyptus transition-colors duration-200">
                Coworking Pass
              </span>
            </button>
            <p className="text-plaster/80 text-sm leading-relaxed max-w-sm">
              Connecting professionals, freelancers, and enterprise teams with premium coworking spaces across Saudi Arabia.
            </p>
            <div className="flex items-center gap-3 text-xs text-eucalyptus font-medium pt-1">
              <span className="px-3 py-1 rounded-full bg-soot-light/30 border border-soot-light/40 text-eucalyptus">
                🇸🇦 Made in Saudi Arabia
              </span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-plaster font-serif-display text-base font-semibold tracking-wide mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => navigate('landing')} 
                  className="text-plaster/75 hover:text-eucalyptus transition-colors duration-200 text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('browse')} 
                  className="text-plaster/75 hover:text-eucalyptus transition-colors duration-200 text-left"
                >
                  Browse Spaces
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('pricing')} 
                  className="text-plaster/75 hover:text-eucalyptus transition-colors duration-200 text-left"
                >
                  Plans & Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('contact')} 
                  className="text-plaster/75 hover:text-eucalyptus transition-colors duration-200 text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Cities Column */}
          <div>
            <h3 className="text-plaster font-serif-display text-base font-semibold tracking-wide mb-4">
              Top Locations
            </h3>
            <ul className="space-y-2.5 text-sm">
              {['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Madinah'].map(city => (
                <li key={city}>
                  <button
                    onClick={() => navigate('browse', { city })}
                    className="text-plaster/75 hover:text-eucalyptus transition-colors duration-200 text-left"
                  >
                    {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Access */}
          <div>
            <h3 className="text-plaster font-serif-display text-base font-semibold tracking-wide mb-4">
              Get Started
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => navigate('login')} 
                  className="text-plaster/75 hover:text-eucalyptus transition-colors duration-200 text-left"
                >
                  Member Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('signup')} 
                  className="text-plaster/75 hover:text-eucalyptus transition-colors duration-200 text-left"
                >
                  Create Account
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('choose-type')} 
                  className="text-plaster/75 hover:text-eucalyptus transition-colors duration-200 text-left"
                >
                  List Your Space
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-plaster/65">
          <p>© {new Date().getFullYear()} Coworking Pass Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('contact')} className="hover:text-eucalyptus transition-colors duration-200">
              Privacy Policy
            </button>
            <button onClick={() => navigate('contact')} className="hover:text-eucalyptus transition-colors duration-200">
              Terms of Service
            </button>
            <button onClick={() => navigate('contact')} className="hover:text-eucalyptus transition-colors duration-200">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
