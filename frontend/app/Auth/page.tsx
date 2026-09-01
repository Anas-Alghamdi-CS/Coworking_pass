'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Building2, User as UserIcon, ArrowRight, ArrowLeft, Warehouse, Check } from 'lucide-react';
import { useApp } from '@/app/store';
import LogoImage from '@/components/layout/logo';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 group focus:outline-none cursor-pointer"
    >
      <LogoImage className="h-11 sm:h-12 w-auto" />
      <span className="font-semibold text-soot text-lg sm:text-xl group-hover:text-soot/80 transition-colors duration-200">
        Coworking Pass
      </span>
    </button>
  );
}

export function LoginScreen() {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) setError(result.error || 'Login failed.');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-plaster relative">
      <div className="w-full max-w-md bg-plaster-surface rounded-3xl border border-soot/12 p-6 sm:p-8 shadow-xl">
        <button
          type="button"
          onClick={() => navigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-moss hover:text-soot mb-6 group transition-colors duration-200 focus:outline-none cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Logo onClick={() => navigate('landing')} />
          </div>
          <h1 className="text-2xl sm:text-3xl text-soot font-normal font-serif-display">Welcome Back</h1>
          <p className="text-moss text-sm mt-1">Sign in to your Coworking Pass account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <div>
            <label className="block text-xs font-semibold text-soot/85 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-10 rounded-xl border border-soot/15 bg-plaster-dark/35 hover:bg-plaster-dark/60 focus:bg-plaster-surface focus:border-eucalyptus-dark focus:ring-2 focus:ring-eucalyptus/30 text-soot text-sm outline-none transition-all duration-200 placeholder:text-soot/50 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-moss hover:text-soot cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            className="mt-3 py-3"
          >
            {loading ? 'Signing in...' : 'Sign in'}
            {!loading && <ArrowRight size={16} />}
          </Button>
        </form>

        <p className="text-center text-sm text-moss mt-6 pt-4 border-t border-soot/10">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('signup')}
            className="text-soot font-semibold hover:underline cursor-pointer"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}

export function SignUpScreen() {
  const { signup, completeSignup, setPendingUser, navigate } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'individual' | 'organization' | 'provider'>('individual');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [orgName, setOrgName] = useState('');
  const [orgSize, setOrgSize] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [crNumber, setCrNumber] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectRoleAndNext = (selectedRole: 'individual' | 'organization' | 'provider') => {
    setRole(selectedRole);
    setStep(2);
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!email.trim()) e.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.';
    if (!phone.trim()) e.phone = 'Phone number is required.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (password !== confirm) e.confirm = 'Passwords do not match.';

    if (role === 'organization') {
      if (!orgName.trim()) e.orgName = 'Organization / Company name is required.';
    } else if (role === 'provider') {
      if (!businessName.trim()) e.businessName = 'Partner / Business brand name is required.';
    }
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep2();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newUser = signup(name, email, password, phone);
    setPendingUser(newUser);

    if (role === 'organization') {
      (completeSignup as (r: string, d?: unknown) => void)(role, { orgName, orgSize: parseInt(orgSize, 10) || 10, industry });
    } else if (role === 'provider') {
      (completeSignup as (r: string, d?: unknown) => void)(role, { businessName, crNumber });
    } else {
      (completeSignup as (r: string) => void)(role);
    }
  };

  const erdBadge = {
    individual: { label: 'Individual Member', code: 'B2C' },
    organization: { label: 'Organization HR Admin', code: 'HR_ADMIN' },
    provider: { label: 'Space Venue Partner', code: 'PARTNER_ADMIN' },
  }[role];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-plaster relative">
      <div className="w-full max-w-md bg-plaster-surface rounded-3xl border border-soot/12 p-6 sm:p-8 shadow-xl">
        <button
          type="button"
          onClick={() => (step === 2 ? setStep(1) : navigate('landing'))}
          className="inline-flex items-center gap-2 text-xs font-semibold text-moss hover:text-soot mb-6 group transition-colors duration-200 focus:outline-none cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {step === 2 ? 'Back to Role Selection' : 'Back to Home'}
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-5">
            <Logo onClick={() => navigate('landing')} />
          </div>
          <h1 className="text-2xl sm:text-3xl text-soot font-normal font-serif-display">
            {step === 1 ? 'Select Account Type' : 'Registration Form'}
          </h1>
          <p className="text-moss text-xs sm:text-sm mt-1">
            {step === 1 ? 'Step 1 of 2: Choose your account type to proceed' : `Step 2 of 2: ${erdBadge.label} (${erdBadge.code})`}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-moss' : 'bg-soot/10'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-moss' : 'bg-soot/10'}`} />
        </div>

        {step === 1 ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSelectRoleAndNext('individual')}
              className="w-full p-5 rounded-2xl border border-soot/12 bg-plaster-dark/30 hover:bg-plaster-dark/70 text-left transition-all duration-200 group shadow-xs hover:shadow-md focus:outline-none cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-eucalyptus/25 text-soot flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <UserIcon size={22} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-soot text-base flex items-center justify-between">
                    <span>Individual Member</span>
                    <Badge variant="eucalyptus">B2C</Badge>
                  </div>
                  <p className="text-xs text-moss mt-1 leading-relaxed">
                    For freelancers, remote professionals, and students needing flexible day or monthly passes.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRoleAndNext('organization')}
              className="w-full p-5 rounded-2xl border border-soot/12 bg-plaster-dark/30 hover:bg-plaster-dark/70 text-left transition-all duration-200 group shadow-xs hover:shadow-md focus:outline-none cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-soot text-plaster flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Building2 size={22} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-soot text-base flex items-center justify-between">
                    <span>Organization / B2B</span>
                    <Badge variant="soot">HR_ADMIN</Badge>
                  </div>
                  <p className="text-xs text-moss mt-1 leading-relaxed">
                    For corporate teams purchasing employee passes, managing corporate billing and team bookings.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRoleAndNext('provider')}
              className="w-full p-5 rounded-2xl border border-soot/12 bg-plaster-dark/30 hover:bg-plaster-dark/70 text-left transition-all duration-200 group shadow-xs hover:shadow-md focus:outline-none cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-mist-light text-soot flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Warehouse size={22} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-soot text-base flex items-center justify-between">
                    <span>Space Venue Partner</span>
                    <Badge variant="mist">PARTNER_ADMIN</Badge>
                  </div>
                  <p className="text-xs text-moss mt-1 leading-relaxed">
                    For venue owners and space providers listing coworking locations across Saudi Arabia.
                  </p>
                </div>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name *"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Ahmed Al-Mansoori"
              error={errors.name}
            />

            <Input
              label="Email Address *"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={errors.email}
            />

            <Input
              label="Phone Number *"
              type="tel"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              placeholder="+966 55 123 4567"
              error={errors.phone}
            />

            {role === 'organization' && (
              <div className="p-4 rounded-2xl bg-plaster-dark/30 border border-soot/12 space-y-3.5 my-2">
                <div className="text-xs font-semibold text-soot uppercase tracking-wider flex items-center justify-between">
                  <span>Organization Fields (COMPANIES)</span>
                  <Badge variant="soot">HR_ADMIN</Badge>
                </div>
                <Input
                  label="Company / Organization Name *"
                  value={orgName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrgName(e.target.value)}
                  placeholder="Saudi Tech Solutions LLC"
                  error={errors.orgName}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Passes / Team Size"
                    type="number"
                    min="1"
                    value={orgSize}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrgSize(e.target.value)}
                    placeholder="e.g. 15"
                  />
                  <Input
                    label="Industry"
                    value={industry}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
                    placeholder="e.g. Technology"
                  />
                </div>
              </div>
            )}

            {role === 'provider' && (
              <div className="p-4 rounded-2xl bg-plaster-dark/30 border border-soot/12 space-y-3.5 my-2">
                <div className="text-xs font-semibold text-soot uppercase tracking-wider flex items-center justify-between">
                  <span>Partner Fields (PARTNERS)</span>
                  <Badge variant="mist">PARTNER_ADMIN</Badge>
                </div>
                <Input
                  label="Partner / Brand Name *"
                  value={businessName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusinessName(e.target.value)}
                  placeholder="The Hub Riyadh Holdings"
                  error={errors.businessName}
                />
                <Input
                  label="Commercial Registration (CR) Number"
                  value={crNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCrNumber(e.target.value)}
                  placeholder="1010xxxxxx"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-soot/85 mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`w-full px-4 py-3 pr-10 rounded-xl border ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-500/10'
                      : 'border-soot/15 bg-plaster-dark/35 hover:bg-plaster-dark/60 focus:bg-plaster-surface focus:border-eucalyptus-dark focus:ring-2 focus:ring-eucalyptus/30'
                  } text-soot text-sm outline-none transition-all duration-200 placeholder:text-soot/50 shadow-xs`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-moss hover:text-soot cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
            </div>

            <Input
              label="Confirm Password *"
              type="password"
              value={confirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              error={errors.confirm}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-4 py-3"
            >
              Complete Registration & Sign In
              <ArrowRight size={16} />
            </Button>
          </form>
        )}

        <p className="text-center text-xs sm:text-sm text-moss mt-6 pt-4 border-t border-soot/10">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('login')}
            className="text-soot font-semibold hover:underline cursor-pointer"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export function ChooseAccountType() {
  const { navigate, completeSignup, pendingUser, setPendingUser } = useApp();
  const [selected, setSelected] = useState<'individual' | 'organization' | 'provider' | null>(null);
  const [orgName, setOrgName] = useState('');
  const [orgSize, setOrgSize] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [crNumber, setCrNumber] = useState('');

  const handleContinue = () => {
    if (!selected) return;
    if (selected === 'organization' && !orgName.trim()) return;
    if (selected === 'provider' && !businessName.trim()) return;

    if (!pendingUser) {
      const tempUser = {
        id: `user-${Date.now()}`,
        name: 'New Member',
        email: 'member@coworkingpass.sa',
        password: 'password',
        role: selected,
        phone: '+966 50 123 4567',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
        isBlocked: false,
        joinDate: new Date().toISOString().split('T')[0],
      };
      setPendingUser(tempUser);
    }

    if (selected === 'organization') {
      (completeSignup as (r: string, d?: unknown) => void)(selected, { orgName, orgSize: parseInt(orgSize, 10) || 10, industry: industry || 'Technology' });
    } else if (selected === 'provider') {
      (completeSignup as (r: string, d?: unknown) => void)(selected, { businessName, crNumber });
    } else {
      (completeSignup as (r: string) => void)(selected);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-plaster relative">
      <div className="w-full max-w-md bg-plaster-surface rounded-3xl border border-soot/12 p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Logo onClick={() => navigate('landing')} />
          </div>
          <h1 className="text-2xl sm:text-3xl text-soot font-normal font-serif-display">
            How will you use Coworking Pass?
          </h1>
          <p className="text-moss text-sm mt-1">Choose your account type to finish registration</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => setSelected('individual')}
            className={`w-full p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              selected === 'individual'
                ? 'border-eucalyptus-dark bg-eucalyptus/20 shadow-xs'
                : 'border-soot/12 bg-plaster-dark/25 hover:bg-plaster-dark/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selected === 'individual' ? 'bg-eucalyptus text-soot' : 'bg-soot/10 text-soot'}`}>
                <UserIcon size={20} />
              </div>
              <div>
                <div className="font-semibold text-soot text-base">Individual Member</div>
                <div className="text-xs text-moss mt-1 leading-relaxed">
                  For freelancers, remote workers, and solo professionals looking for flexible workspace.
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelected('organization')}
            className={`w-full p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              selected === 'organization'
                ? 'border-soot bg-soot text-plaster shadow-xs'
                : 'border-soot/12 bg-plaster-dark/25 hover:bg-plaster-dark/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selected === 'organization' ? 'bg-plaster text-soot' : 'bg-soot/10 text-soot'}`}>
                <Building2 size={20} />
              </div>
              <div>
                <div className={`font-semibold text-base ${selected === 'organization' ? 'text-plaster' : 'text-soot'}`}>Organization / B2B</div>
                <div className={`text-xs mt-1 leading-relaxed ${selected === 'organization' ? 'text-plaster/80' : 'text-moss'}`}>
                  For companies booking spaces for teams, managing multiple employees, and team bookings.
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelected('provider')}
            className={`w-full p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              selected === 'provider'
                ? 'border-mist-dark bg-mist-light/60 shadow-xs'
                : 'border-soot/12 bg-plaster-dark/25 hover:bg-plaster-dark/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selected === 'provider' ? 'bg-mist text-soot' : 'bg-soot/10 text-soot'}`}>
                <Warehouse size={20} />
              </div>
              <div>
                <div className="font-semibold text-soot text-base">Space Venue Partner</div>
                <div className="text-xs text-moss mt-1 leading-relaxed">
                  For businesses that own a coworking space and want to list it and track its bookings.
                </div>
              </div>
            </div>
          </button>
        </div>

        {selected === 'provider' && (
          <div className="bg-plaster-dark/30 rounded-2xl border border-soot/12 p-4 sm:p-5 mb-5 space-y-4">
            <Input
              label="Business name *"
              value={businessName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusinessName(e.target.value)}
              placeholder="The Hub Riyadh Holdings"
            />
            <Input
              label="Commercial Registration (CR) number"
              value={crNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCrNumber(e.target.value)}
              placeholder="1010xxxxxx"
            />
          </div>
        )}

        {selected === 'organization' && (
          <div className="bg-plaster-dark/30 rounded-2xl border border-soot/12 p-4 sm:p-5 mb-5 space-y-4">
            <Input
              label="Organization name *"
              value={orgName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrgName(e.target.value)}
              placeholder="Saudi Tech Solutions"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Team size"
                type="number"
                min="1"
                value={orgSize}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrgSize(e.target.value)}
                placeholder="e.g. 15"
              />
              <Input
                label="Industry"
                value={industry}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
                placeholder="e.g. Technology"
              />
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selected || (selected === 'organization' && !orgName.trim()) || (selected === 'provider' && !businessName.trim())}
            className="w-full py-3.5 px-6 rounded-2xl bg-soot text-plaster font-semibold text-sm hover:bg-moss disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] cursor-pointer"
          >
            <Check size={18} className="text-eucalyptus" />
            <span>Complete Sign Up</span>
            <ArrowRight size={16} />
          </button>
          {!selected && (
            <p className="text-center text-xs text-moss/80 mt-2.5 font-medium">
              Please select an account type above to complete your sign up
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const { nav } = useApp();
  if (nav.screen === 'signup') return <SignUpScreen />;
  if (nav.screen === 'choose-type') return <ChooseAccountType />;
  return <LoginScreen />;
}
