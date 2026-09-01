'use client';

import { useApp } from '@/app/store';
import { DashboardLayout } from '@/app/app';
import ProfileSettings from '@/app/individual/ProfileSettings';
import OrgProfile from '@/app/organization/OrgProfile';
import ProviderProfileSettings from '@/app/provider/ProfileSettings';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ProfilePage() {
  const { currentUser, navigate } = useApp();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-plaster">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-bold text-soot mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Please sign in
          </h1>
          <p className="text-sm text-moss mb-4">You must be logged in to view and manage your profile.</p>
          <button
            onClick={() => navigate('login')}
            className="px-6 py-2.5 rounded-xl bg-soot text-plaster font-semibold text-sm hover:bg-soot-light transition-colors"
          >
            Sign In
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <DashboardLayout>
      {currentUser.role === 'organization' && <OrgProfile />}
      {currentUser.role === 'provider' && <ProviderProfileSettings />}
      {currentUser.role === 'individual' && <ProfileSettings mode="profile" />}
      {currentUser.role === 'admin' && <ProfileSettings mode="profile" />}
    </DashboardLayout>
  );
}
