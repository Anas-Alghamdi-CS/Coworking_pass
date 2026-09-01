'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, Search, CalendarDays, User, Settings, LogOut,
  Building2, Users, BarChart3, BookOpen, Menu, X, ChevronRight,
  Briefcase, Warehouse, AlertCircle
} from 'lucide-react';
import { Screen, UserRole } from '@/types/types';
import { useApp } from './store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LogoImage from '@/components/layout/logo';
import Modal from '@/components/ui/Modal';

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
  icon: typeof LayoutDashboard;
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!currentUser) return <>{children}</>;

  const navItems = currentUser.role === 'admin' ? adminNav
    : currentUser.role === 'organization' ? orgNav
    : currentUser.role === 'provider' ? providerNav
    : individualNav;

  const dashboardScreen: Screen = currentUser.role === 'admin' ? 'admin-dashboard'
    : currentUser.role === 'organization' ? 'org-dashboard'
    : currentUser.role === 'provider' ? 'provider-dashboard'
    : 'ind-dashboard';

  const profileScreen: Screen = currentUser.role === 'admin' ? 'admin-settings'
    : currentUser.role === 'organization' ? 'org-profile'
    : currentUser.role === 'provider' ? 'provider-profile'
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

  const handleProfileClick = () => {
    navigate(profileScreen);
    setMobileOpen(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-soot">
      {/* Brand Logo */}
      <div className="px-5 py-6">
        <button
          onClick={() => { navigate(dashboardScreen); setMobileOpen(false); }}
          className="flex items-center gap-2.5 group"
        >
          <LogoImage className="w-8 h-8 rounded-lg group-hover:scale-105 transition-transform" />
          <span className="font-semibold text-plaster text-base tracking-tight" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Coworking Pass
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const active = isActive(item);
          return (
            <button
              key={item.screen}
              onClick={() => { navigate(item.screen); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[#B3C9D6] text-soot shadow-sm font-semibold'
                  : 'text-plaster/65 hover:bg-white/10 hover:text-plaster'
              }`}
            >
              <item.icon size={18} className={active ? 'text-soot' : 'text-plaster/60'} />
              <span>{item.label}</span>
              {active && <ChevronRight size={15} className="ml-auto text-soot" />}
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer (Clickable Profile & Logout) */}
      <div className="px-3 pb-6 mt-auto border-t border-white/10 pt-4">
        {/* Clickable Profile Card */}
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-white/10 transition-all text-left group cursor-pointer"
          title="Click to view and edit your profile"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-eucalyptus/40 group-hover:ring-eucalyptus group-hover:scale-105 transition-all shrink-0"
            />
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <User size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-plaster truncate group-hover:text-white transition-colors">
              {currentUser.name}
            </div>
            <div className="text-xs text-plaster/50 capitalize truncate group-hover:text-plaster/75 transition-colors">
              {currentUser.role}
            </div>
          </div>
          <ChevronRight size={14} className="text-plaster/30 group-hover:text-plaster/80 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-xl text-sm font-medium text-plaster/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-plaster">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-soot h-screen sticky top-0 border-r border-soot/10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-soot/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="w-64 bg-soot h-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-plaster/60 hover:text-plaster rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-plaster/95 backdrop-blur-sm border-b border-soot/8 h-15 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl hover:bg-soot/5 text-soot transition-colors"
            >
              <Menu size={22} />
            </button>
            <button onClick={() => navigate(dashboardScreen)} className="flex items-center gap-2">
              <LogoImage className="w-7 h-7 rounded-lg" />
              <span className="font-semibold text-soot text-sm tracking-tight" style={{ fontFamily: 'DM Serif Display, serif' }}>
                Coworking Pass
              </span>
            </button>
          </div>

          {/* Clickable Mobile Avatar */}
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-eucalyptus/40 transition-all"
            title="Go to Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-soot/10"
            />
          </button>
        </header>

        <main className="flex-1 bg-plaster">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
              <AlertCircle size={22} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-soot mb-1">
                Are you sure you want to log out?
              </h3>
              <p className="text-xs text-moss leading-relaxed">
                You will need to sign in again to access your active bookings and workspace dashboard.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 py-3 rounded-xl border border-soot/15 text-soot text-sm font-semibold hover:bg-soot/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLogout}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm"
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
    success: 'bg-soot text-plaster border border-eucalyptus/30',
    error: 'bg-red-500 text-white',
    info: 'bg-mist text-soot font-medium',
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-xl text-sm font-medium ${
        colors[toast.type as keyof typeof colors] || colors.info
      } transition-all animate-bounce`}
    >
      {toast.message}
    </div>
  );
}

function AdminSettingsPage() {
  const { currentUser } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useApp();

  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10">
      <h1 className="text-4xl text-soot font-normal mb-8" style={{ fontFamily: 'DM Serif Display, serif' }}>
        Admin Settings
      </h1>
      <div className="bg-white rounded-3xl border border-soot/8 p-8 shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-soot mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Account Details
        </h2>
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-soot/8">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-eucalyptus/30" />
          <div>
            <div className="font-semibold text-soot text-lg">{currentUser.name}</div>
            <div className="text-sm text-moss">{currentUser.email}</div>
            <div className="text-xs text-moss capitalize mt-0.5">{currentUser.role} Account</div>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm"
        >
          Log Out
        </button>
      </div>

      <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Logout" size="sm">
        <div className="p-6">
          <p className="text-sm text-soot mb-6">Are you sure you want to log out of admin account?</p>
          <div className="flex gap-3">
            <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 rounded-xl border border-soot/15 text-soot text-sm font-medium">Cancel</button>
            <button onClick={() => { setShowLogoutModal(false); logout(); }} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold">Log Out</button>
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

  // Individual flow
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
