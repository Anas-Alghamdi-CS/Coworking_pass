'use client';

import { Check, ArrowRight, HelpCircle } from 'lucide-react';
import { useApp } from './store';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const plans = [
  {
    name: 'Day Pass',
    price: 120,
    period: 'per day',
    desc: 'Perfect for occasional visits and short business trips.',
    features: ['Any hot desk space', 'Full amenity access', 'Weekday booking', 'Cancel anytime'],
    cta: 'Get started',
    featured: false,
  },
  {
    name: 'Monthly Pass',
    price: 1500,
    period: 'per month',
    desc: 'Great for freelancers, solo founders, and remote professionals.',
    features: ['Any hot desk space', 'Full amenity access', 'Priority booking', 'Cancel anytime', 'Guest passes (2/mo)', 'Meeting room credits (2h)'],
    cta: 'Most popular',
    featured: true,
  },
  {
    name: 'Annual Pass',
    price: 15000,
    period: 'per year',
    desc: 'Best overall value for dedicated professionals and consultants.',
    features: ['Any hot desk space', 'Full amenity access', 'Priority booking', 'Cancel anytime', 'Guest passes (5/mo)', 'Meeting room credits (8h)', 'Dedicated locker', 'Printed business address'],
    cta: 'Best value',
    featured: false,
  },
];

const orgPlans = [
  {
    name: 'Team Pass',
    seats: '5–20 seats',
    price: 7500,
    period: 'per month',
    desc: 'For growing startups needing flexible workspace credits.',
    features: ['Hot desks for team', 'Meeting rooms (10h/mo)', 'Team admin dashboard', 'Flexible seat count'],
    featured: false,
  },
  {
    name: 'Business Pass',
    seats: '21–50 seats',
    price: 18000,
    period: 'per month',
    desc: 'For established companies requiring full Kingdom coverage.',
    features: ['Private offices & desks', 'Unlimited meeting room credits', 'Team admin dashboard', 'Dedicated account manager', 'Custom corporate billing', 'On-site support'],
    featured: true,
  },
  {
    name: 'Enterprise',
    seats: '50+ seats',
    price: null,
    period: 'custom pricing',
    desc: 'For large organizations with complex hybrid setup requirements.',
    features: ['Everything in Business', 'Multi-city access', 'SLA guarantees', 'Custom HRIS integrations', 'On-site branding'],
    featured: false,
  },
];

export default function Pricing() {
  const { navigate } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <Badge variant="eucalyptus" className="mb-4 px-4 py-1.5 text-xs font-semibold">
          Transparent Pricing
        </Badge>
        <h1 className="text-4xl sm:text-5xl text-soot font-normal mb-4 font-serif-display">
          Plans for Every Professional & Team
        </h1>
        <p className="text-moss text-base sm:text-lg leading-relaxed font-normal">
          Whether you work solo or lead a corporate team, choose a flexible pass that fits your needs across Saudi Arabia.
        </p>
      </div>

      {/* Individual Plans */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-normal text-soot font-serif-display">Individual Member Plans</h2>
          <Badge variant="mist">B2C Passes</Badge>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`rounded-3xl p-7 border flex flex-col justify-between relative transition-all duration-200 ease-out active:scale-[0.98] ${
                plan.featured
                  ? 'bg-soot border-soot text-plaster shadow-2xl scale-[1.02]'
                  : 'bg-plaster-dark/30 border-soot/12 text-soot shadow-xs hover:bg-plaster-dark/50 ui-hover-card'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="eucalyptus" className="px-4 py-1 text-xs font-bold shadow-md">
                    ★ Most Popular
                  </Badge>
                </div>
              )}
              <div>
                <div className="mb-6">
                  <h3 className={`font-normal text-2xl mb-1 font-serif-display ${plan.featured ? 'text-plaster' : 'text-soot'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs leading-relaxed ${plan.featured ? 'text-plaster/80' : 'text-moss'}`}>{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className={`text-4xl font-normal font-serif-display ${plan.featured ? 'text-white' : 'text-soot'}`}>
                    SAR {plan.price.toLocaleString()}
                  </span>
                  <span className={`text-sm ml-1.5 font-medium ${plan.featured ? 'text-plaster/70' : 'text-moss'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-center gap-3 text-sm ${plan.featured ? 'text-plaster/95' : 'text-soot/90'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.featured ? 'bg-eucalyptus text-soot' : 'bg-eucalyptus/20 text-soot'}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => navigate('signup')}
                variant={plan.featured ? 'primary' : 'secondary'}
                fullWidth
                className="py-3"
              >
                Get Started
                <ArrowRight size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Organization Plans */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-normal text-soot font-serif-display">Organization & Corporate Plans</h2>
          <Badge variant="soot">HR_ADMIN (B2B)</Badge>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {orgPlans.map(plan => (
            <div
              key={plan.name}
              className={`rounded-3xl p-7 border flex flex-col justify-between transition-all duration-200 ease-out active:scale-[0.98] ${
                plan.featured
                  ? 'bg-eucalyptus/20 border-eucalyptus text-soot shadow-xl'
                  : 'bg-plaster-dark/30 border-soot/12 text-soot shadow-xs hover:bg-plaster-dark/50 ui-hover-card'
              }`}
            >
              <div>
                <div className="mb-2">
                  <Badge variant="soot" className="text-[11px] px-3 py-0.5">
                    {plan.seats}
                  </Badge>
                </div>
                <div className="mb-4 mt-2">
                  <h3 className="font-normal text-2xl text-soot mb-1 font-serif-display">{plan.name}</h3>
                  <p className="text-xs text-moss leading-relaxed">{plan.desc}</p>
                </div>
                <div className="mb-6">
                  {plan.price ? (
                    <>
                      <span className="text-4xl font-normal text-soot font-serif-display">SAR {plan.price.toLocaleString()}</span>
                      <span className="text-sm ml-1.5 text-moss font-medium">{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-normal text-soot font-serif-display">Custom Pricing</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-soot/90">
                      <div className="w-5 h-5 rounded-full bg-eucalyptus/20 text-soot flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => navigate(plan.price ? 'signup' : 'contact')}
                variant={plan.featured ? 'secondary' : 'outline'}
                fullWidth
                className="py-3"
              >
                {plan.price ? 'Get Started' : 'Contact Sales'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-plaster-surface rounded-3xl border border-soot/12 p-8 sm:p-10 shadow-xs">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <HelpCircle size={20} className="text-eucalyptus" />
          <h2 className="text-2xl font-normal text-soot font-serif-display">Frequently Asked Questions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { q: 'Can I cancel or upgrade my pass anytime?', a: 'Yes. All daily and monthly passes can be cancelled or upgraded anytime directly from your user dashboard with zero hidden penalties.' },
            { q: 'Which cities in Saudi Arabia are covered?', a: 'We operate in Riyadh, Jeddah, Dammam, Khobar, Madinah, and Makkah, with ongoing network expansions.' },
            { q: 'How do corporate team passes work?', a: 'Organization plans grant HR Admins a centralized dashboard to allocate passes, invite employees, and track team usage.' },
            { q: 'Are displayed prices inclusive of VAT?', a: 'Yes, all listed prices transparently include VAT with tax invoice documentation available for corporate accounts.' },
          ].map(item => (
            <div key={item.q} className="p-4 rounded-2xl bg-plaster/50 border border-soot/8 space-y-1.5">
              <h3 className="font-semibold text-soot text-sm">{item.q}</h3>
              <p className="text-moss text-xs sm:text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
