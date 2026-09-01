'use client';

import { useEffect } from 'react';
import { AppProvider, useApp } from '@/app/store';
import GuestNav from '@/components/layout/Navbar';

// Guest screens
import Landing from '@/app/Landing';
import Browse from '@/app/spaces/page';
import SpaceDetails from '@/app/spaces/[id]/page';
import Pricing from '@/app/Pricing';
import Contact from '@/app/contact';
import { LoginScreen, SignUpScreen, ChooseAccountType } from '@/app/Auth/page';

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

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const colors = {
    success: 'bg-soot text-plaster',
    error: 'bg-red-500 text-white',
    info: 'bg-mist text-soot',
  };
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${colors[toast.type]} transition-all`}>
      {toast.message}
    </div>
  );
}

export function Router() {
  const { nav, currentUser } = useApp();
  const screen = nav.screen;

  // Unauthenticated flow
  if (!currentUser) {
    if (screen === 'landing') return <Landing />;

    return (
      <div className="min-h-full flex flex-col bg-plaster">
        {screen !== 'login' && screen !== 'signup' && screen !== 'choose-type' && <GuestNav />}
        <div className="flex-1">
          {screen === 'browse' && <Browse />}
          {screen === 'space-details' && <SpaceDetails />}
          {screen === 'pricing' && <Pricing />}
          {screen === 'contact' && <Contact />}
          {screen === 'login' && <LoginScreen />}
          {screen === 'signup' && <SignUpScreen />}
          {screen === 'choose-type' && <ChooseAccountType />}
        </div>
      </div>
    );
  }

  const role = currentUser.role;

  // Admin flow
  if (role === 'admin') {
    return (
      <div className="flex h-screen">
        {screen === 'admin-dashboard' && <AdminDashboard />}
        {screen === 'admin-spaces' && <SpacesAdmin />}
        {screen === 'admin-users' && <UsersAdmin />}
        {screen === 'admin-bookings' && <BookingsAdmin />}
        {screen === 'admin-reports' && <Reports />}
        {screen === 'admin-settings' && <AdminSettingsPage />}
      </div>
    );
  }

  // Organization flow
  if (role === 'organization') {
    return (
      <div className="flex h-screen">
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
      </div>
    );
  }

  // Space Provider flow
  if (role === 'provider') {
    return (
      <div className="flex h-screen">
        {screen === 'provider-dashboard' && <ProviderDashboard />}
        {screen === 'provider-spaces' && <ProviderMySpaces />}
        {screen === 'provider-bookings' && <ProviderSpaceBookings />}
        {screen === 'provider-profile' && <ProviderProfileSettings />}
        {screen === 'provider-settings' && <ProviderProfileSettings />}
      </div>
    );
  }

  // Individual flow
  return (
    <div className="flex h-screen">
      {screen === 'ind-dashboard' && <IndividualDashboard />}
      {screen === 'browse' && <Browse />}
      {screen === 'space-details' && <SpaceDetails />}
      {screen === 'booking-flow' && <BookingFlow />}
      {screen === 'booking-confirm' && <BookingFlow />}
      {screen === 'my-bookings' && <MyBookings />}
      {screen === 'booking-details' && <MyBookings />}
      {screen === 'ind-profile' && <ProfileSettings mode="profile" />}
      {screen === 'ind-settings' && <ProfileSettings mode="settings" />}
    </div>
  );
}

function AdminSettingsPage() {
  const { currentUser, logout } = useApp();
  if (!currentUser) return null;
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl text-soot mb-8" style={{ fontFamily: 'DM Serif Display, serif' }}>Admin Settings</h1>
      <div className="bg-white rounded-2xl border border-soot/8 p-6 mb-4">
        <h2 className="font-semibold text-soot mb-4">Account</h2>
        <div className="flex items-center gap-4 mb-4">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-14 h-14 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-soot">{currentUser.name}</div>
            <div className="text-sm text-moss">{currentUser.email}</div>
            <div className="text-xs text-moss capitalize mt-0.5">{currentUser.role}</div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-soot/8 p-6">
        <button onClick={logout} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium">Log out</button>
      </div>
    </div>
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
