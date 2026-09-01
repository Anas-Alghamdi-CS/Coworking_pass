import { useEffect } from 'react';
import { AppProvider, useApp } from './store';
import GuestNav from './components/GuestNav';
import AppLayout from './components/AppLayout';

// Guest screens
import Landing from './screens/Landing';
import Browse from './screens/Browse';
import SpaceDetails from './screens/SpaceDetails';
import Pricing from './screens/Pricing';
import Contact from './screens/Contact';
import { LoginScreen, SignUpScreen, ChooseAccountType } from './screens/Auth';

// Individual screens
import IndividualDashboard from './screens/individual/Dashboard';
import BookingFlow from './screens/individual/BookingFlow';
import MyBookings from './screens/individual/MyBookings';
import ProfileSettings from './screens/individual/ProfileSettings';

// Organization screens
import OrgDashboard from './screens/organization/Dashboard';
import TeamBooking from './screens/organization/TeamBooking';
import TeamBookings from './screens/organization/TeamBookings';
import OrgProfile from './screens/organization/OrgProfile';

// Admin screens
import AdminDashboard from './screens/admin/Dashboard';
import SpacesAdmin from './screens/admin/SpacesAdmin';
import UsersAdmin from './screens/admin/UsersAdmin';
import BookingsAdmin from './screens/admin/BookingsAdmin';
import Reports from './screens/admin/Reports';

function Toast() {
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

function Router() {
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
      <AppLayout>
        {screen === 'admin-dashboard' && <AdminDashboard />}
        {screen === 'admin-spaces' && <SpacesAdmin />}
        {screen === 'admin-users' && <UsersAdmin />}
        {screen === 'admin-bookings' && <BookingsAdmin />}
        {screen === 'admin-reports' && <Reports />}
        {screen === 'admin-settings' && <AdminSettingsPage />}
      </AppLayout>
    );
  }

  // Organization flow
  if (role === 'organization') {
    return (
      <AppLayout>
        {screen === 'org-dashboard' && <OrgDashboard />}
        {screen === 'browse' && <Browse />}
        {screen === 'space-details' && <SpaceDetails />}
        {screen === 'team-booking' && <TeamBooking />}
        {screen === 'team-bookings' && <TeamBookings />}
        {screen === 'org-profile' && <OrgProfile />}
        {screen === 'org-settings' && <OrgProfile />}
      </AppLayout>
    );
  }

  // Individual flow
  return (
    <AppLayout>
      {screen === 'ind-dashboard' && <IndividualDashboard />}
      {screen === 'browse' && <Browse />}
      {screen === 'space-details' && <SpaceDetails />}
      {screen === 'booking-flow' && <BookingFlow />}
      {screen === 'booking-confirm' && <BookingFlow />}
      {screen === 'my-bookings' && <MyBookings />}
      {screen === 'booking-details' && <MyBookings />}
      {screen === 'ind-profile' && <ProfileSettings mode="profile" />}
      {screen === 'ind-settings' && <ProfileSettings mode="settings" />}
    </AppLayout>
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
    <AppProvider>
      <Router />
      <Toast />
    </AppProvider>
  );
}
