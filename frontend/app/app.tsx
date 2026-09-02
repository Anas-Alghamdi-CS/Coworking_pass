'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, Search, CalendarDays, User, Settings, LogOut,
  Building2, Users, BarChart3, BookOpen, ChevronRight,
  Briefcase, AlertCircle
} from 'lucide-react';
import { Screen, UserRole } from '@/types/types';
import { useApp } from './store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LogoImage from '@/components/layout/logo';
import Modal from '@/components/ui/Modal';
import UserAvatar from '@/components/ui/UserAvatar';

// Guest screens
import Landing from './Landing';
import Browse from './spaces/page';
import SpaceDetails from './spaces/[id]/page';
import Pricing from './Pricing';
import Contact from './contact';
import { LoginScreen, SignUpScreen, ChooseAccountType } from './Auth/page';

// Individual screens
import IndividualDashboard from './individual/Dashboard';
import BookingFlow from './individual/BookingFlow';
import MyBookings from './individual/MyBookings';
import ProfileSettings from './individual/ProfileSettings';

// Organization screens
import OrgDashboard from './organization/Dashboard';
import TeamBooking from './organization/TeamBooking';
import TeamBookings from './organization/TeamBookings';
import OrgProfile from './organization/OrgProfile';
import AddWorkspace from './organization/AddWorkspace';
import CompanyBookings from './organization/CompanyBookings';
import CompanyReports from './organization/CompanyReports';
import CompanyTeam from './organization/CompanyTeam';
import MyWorkspaces from './organization/MyWorkspaces';

// Provider screens
import ProviderDashboard from './provider/Dashboard';
import ProviderMySpaces from './provider/MySpaces';
import ProviderSpaceBookings from './provider/SpaceBookings';
import ProviderProfileSettings from './provider/ProfileSettings';

// Admin screens
import AdminDashboard from './admin/Dashboard';
import SpacesAdmin from './admin/SpacesAdmin';
import UsersAdmin from './admin/UsersAdmin';
import BookingsAdmin from './admin/BookingsAdmin';
import Reports from './admin/Reports';

interface NavItem {
  label: string;
  screen: Screen;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const individualNav: NavItem[] = [
  { label: 'Dashboard', screen: 'ind-dashboard', icon: LayoutDashboard },
  { label: 'Browse Spaces', screen: 'browse', icon: Search },
  { label: 'My Bookings', screen: 'my-bookings', icon: CalendarDays },
  { label: 'Settings', screen: 'ind-settings', icon: Settings },
];

const orgNav: NavItem[] = [
  { label: 'Dashboard', screen: 'org-dashboard', icon: LayoutDashboard },
  { label: 'Workspaces', screen: 'company-workspaces', icon: Building2 },
  { label: 'Browse Spaces', screen: 'browse', icon: Search },
  { label: 'Team Bookings', screen: 'team-bookings', icon: Briefcase },
  { label: 'Team Members', screen: 'company-team', icon: Users },
  { label: 'Reports', screen: 'company-reports', icon: BarChart3 },
  { label: 'Settings', screen: 'org-settings', icon: Settings },
];

const providerNav: NavItem[] = [
  { label: 'Dashboard', screen: 'provider-dashboard', icon: LayoutDashboard },
  { label: 'My Spaces', screen: 'provider-spaces', icon: Building2 },
  { label: 'Bookings', screen: 'provider-bookings', icon: BookOpen },
  { label: 'Settings', screen: 'provider-settings', icon: Settings },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', screen: 'admin-dashboard', icon: LayoutDashboard },
  { label: 'Spaces', screen: 'admin-spaces', icon: Building2 },
  { label: 'Users', screen: 'admin-users', icon: Users },
  { label: 'Bookings', screen: 'admin-bookings', icon: BookOpen },
  { label: 'Reports', screen: 'admin-reports', icon: BarChart3 },
  { label: 'Settings', screen: 'admin-settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, navigate, logout, nav } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!currentUser) return <>{children}</>;

  const role = currentUser.role;

  const navItems = role === 'admin' ? adminNav
    : role === 'organization' ? orgNav
    : role === 'provider' ? providerNav
    : individualNav;

  const dashboardScreen: Screen = role === 'admin' ? 'admin-dashboard'
    : role === 'organization' ? 'org-dashboard'
    : role === 'provider' ? 'provider-dashboard'
    : 'ind-dashboard';

  const profileScreen: Screen = role === 'admin' ? 'admin-settings'
    : role === 'organization' ? 'org-profile'
    : role === 'provider' ? 'provider-profile'
    : 'ind-profile';

  const isActive = (item: NavItem) => {
    if (item.screen === nav.screen) return true;
    if (item.screen === 'browse' && (nav.screen === 'browse' || nav.screen === 'space-details' || nav.screen === 'booking-flow' || nav.screen === 'team-booking')) return true;
    if (item.screen === 'ind-profile' && nav.screen === 'ind-profile') return true;
    if (item.screen === 'ind-settings' && nav.screen === 'ind-settings') return true;
    if (item.screen === 'org-profile' && nav.screen === 'org-profile') return true;
    if (item.screen === 'org-settings' && nav.screen === 'org-settings') return true;
    return false;
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-plaster text-soot">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-soot/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo without Border */}
          <button
            type="button"
            onClick={() => navigate(dashboardScreen)}
            className="flex items-center gap-3 cursor-pointer focus:outline-none shrink-0"
          >
            <LogoImage className="w-10 h-10 object-contain" />
            <span className="font-serif-display font-normal text-soot text-2xl tracking-tight hidden sm:block">
              Coworking Pass
            </span>
          </button>

          {/* Centered Navigation Row at Logo Level */}
          <nav className="hidden lg:flex items-center justify-center gap-1.5 flex-1 mx-4">
            {navItems.map(item => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => navigate(item.screen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs xl:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#DDE6DF] text-soot shadow-xs border border-soot/6'
                      : 'text-moss hover:text-soot hover:bg-soot/5'
                  }`}
                >
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    <Icon size={17} className={active ? 'text-soot' : 'text-moss'} />
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Role Tag, Profile, & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex text-xs font-medium uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#DDE6DF]/70 text-soot border border-soot/6">
              {role} portal
            </span>

            <button
              type="button"
              onClick={() => navigate(profileScreen)}
              className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-soot/5 border border-transparent hover:border-soot/10 transition-all cursor-pointer"
            >
              <UserAvatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="sm"
              />
              <span className="hidden md:block text-sm font-medium text-soot">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="p-2.5 rounded-2xl text-moss hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut size={19} />
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Subnav Row */}
        <div className="lg:hidden border-t border-soot/8 bg-white py-2 px-4 overflow-x-auto scrollbar-none flex items-center gap-2">
          {navItems.map(item => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => navigate(item.screen)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  active
                    ? 'bg-[#E2E8E4] text-[#2D3536] ring-1 ring-[#2D3536]/15 shadow-2xs'
                    : 'text-moss hover:text-soot'
                }`}
              >
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  <Icon size={15} className={active ? 'text-[#2D3536]' : 'text-moss'} />
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        size="sm"
      >
        <div className="p-6 bg-plaster-surface rounded-3xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <AlertCircle size={22} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-soot mb-1 font-serif-display">
                Are you sure you want to log out?
              </h3>
              <p className="text-xs text-moss leading-relaxed">
                You will need to sign in again to access your active bookings and workspace dashboard.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-soot/15 text-soot text-sm font-medium hover:bg-plaster-dark transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmLogout}
              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const colors = {
    success: 'bg-moss text-plaster border border-plaster/30',
    error: 'bg-red-600 text-white',
    info: 'bg-plaster-surface text-soot font-medium border border-soot/10',
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-100 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium ${
        colors[toast.type as keyof typeof colors] || colors.info
      } transition-all animate-bounce`}
    >
      {toast.message}
    </div>
  );
}

function AdminSettingsPage() {
  const { currentUser, logout } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl text-soot font-normal mb-6 font-serif-display">
        Admin Settings
      </h1>
      <div className="bg-plaster-surface rounded-3xl border border-soot/10 p-6 sm:p-8 shadow-xs mb-6">
        <h2 className="text-lg font-semibold text-soot mb-6 font-serif-display">
          Account Details
        </h2>
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-soot/10">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-moss" />
          <div>
            <div className="font-semibold text-soot text-lg">{currentUser.name}</div>
            <div className="text-sm text-moss">{currentUser.email}</div>
            <div className="text-xs text-moss capitalize mt-0.5">{currentUser.role} Account</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
        >
          Log Out
        </button>
      </div>

      <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Logout" size="sm">
        <div className="p-6 bg-plaster-surface rounded-3xl">
          <p className="text-sm text-soot mb-6">Are you sure you want to log out of admin account?</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowLogoutModal(false)} className="flex-1 py-2 rounded-xl border border-soot/15 text-soot text-sm font-medium hover:bg-plaster-dark cursor-pointer">Cancel</button>
            <button type="button" onClick={() => { setShowLogoutModal(false); logout(); }} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 cursor-pointer">Log Out</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function Router() {
  const { nav, currentUser } = useApp();
  const screen = nav.screen;

  // Unauthenticated / Guest flow
  if (!currentUser) {
    if (screen === 'landing') return <Landing />;

    return (
      <div className="min-h-screen flex flex-col bg-plaster">
        {screen !== 'login' && screen !== 'signup' && screen !== 'choose-type' && <Navbar />}
        <div className="flex-1">
          {screen === 'browse' && <Browse />}
          {screen === 'space-details' && <SpaceDetails />}
          {screen === 'pricing' && <Pricing />}
          {screen === 'contact' && <Contact />}
          {screen === 'login' && <LoginScreen />}
          {screen === 'signup' && <SignUpScreen />}
          {screen === 'choose-type' && <ChooseAccountType />}
        </div>
        {screen !== 'login' && screen !== 'signup' && screen !== 'choose-type' && <Footer />}
      </div>
    );
  }

  const role = currentUser.role;

  // Admin flow
  if (role === 'admin') {
    return (
      <DashboardLayout>
        {screen === 'admin-dashboard' && <AdminDashboard />}
        {screen === 'admin-spaces' && <SpacesAdmin />}
        {screen === 'admin-users' && <UsersAdmin />}
        {screen === 'admin-bookings' && <BookingsAdmin />}
        {screen === 'admin-reports' && <Reports />}
        {screen === 'admin-settings' && <AdminSettingsPage />}
        {screen === 'browse' && <Browse />}
        {screen === 'space-details' && <SpaceDetails />}
        {screen === 'pricing' && <Pricing />}
        {screen === 'contact' && <Contact />}
      </DashboardLayout>
    );
  }

  // Organization flow
  if (role === 'organization') {
    return (
      <DashboardLayout>
        {screen === 'org-dashboard' && <OrgDashboard />}
        {screen === 'company-workspaces' && <MyWorkspaces />}
        {screen === 'company-add-workspace' && <AddWorkspace />}
        {screen === 'company-bookings' && <CompanyBookings />}
        {screen === 'company-team' && <CompanyTeam />}
        {screen === 'company-reports' && <CompanyReports />}
        {screen === 'browse' && <Browse />}
        {screen === 'space-details' && <SpaceDetails />}
        {screen === 'team-booking' && <TeamBooking />}
        {screen === 'team-bookings' && <TeamBookings />}
        {screen === 'org-profile' && <OrgProfile />}
        {screen === 'org-settings' && <OrgProfile />}
        {screen === 'pricing' && <Pricing />}
        {screen === 'contact' && <Contact />}
      </DashboardLayout>
    );
  }

  // Space Provider flow
  if (role === 'provider') {
    return (
      <DashboardLayout>
        {screen === 'provider-dashboard' && <ProviderDashboard />}
        {screen === 'provider-spaces' && <ProviderMySpaces />}
        {screen === 'provider-bookings' && <ProviderSpaceBookings />}
        {screen === 'provider-profile' && <ProviderProfileSettings />}
        {screen === 'provider-settings' && <ProviderProfileSettings />}
        {screen === 'browse' && <Browse />}
        {screen === 'space-details' && <SpaceDetails />}
        {screen === 'pricing' && <Pricing />}
        {screen === 'contact' && <Contact />}
      </DashboardLayout>
    );
  }

  // Individual Member flow
  return (
    <DashboardLayout>
      {screen === 'ind-dashboard' && <IndividualDashboard />}
      {screen === 'browse' && <Browse />}
      {screen === 'space-details' && <SpaceDetails />}
      {screen === 'booking-flow' && <BookingFlow />}
      {screen === 'booking-confirm' && <BookingFlow />}
      {screen === 'my-bookings' && <MyBookings />}
      {screen === 'booking-details' && <MyBookings />}
      {screen === 'ind-profile' && <ProfileSettings mode="profile" />}
      {screen === 'ind-settings' && <ProfileSettings mode="settings" />}
      {screen === 'pricing' && <Pricing />}
      {screen === 'contact' && <Contact />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <>
      <Router />
      <Toast />
    </>
  );
}
