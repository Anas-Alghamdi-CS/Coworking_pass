import { useState } from 'react';
import {
  LayoutDashboard, Search, CalendarDays, User, Settings, LogOut,
  Building2, Users, BarChart3, BookOpen, Menu, X, ChevronRight,
  Briefcase
} from 'lucide-react';
import { Screen } from '@/types/types';
import { useApp } from '@/app/store';
import LogoImage from '@/components/layout/logo';

interface NavItem {
  label: string;
  screen: Screen;
  icon: typeof LayoutDashboard;
}

const individualNav: NavItem[] = [
  { label: 'Dashboard', screen: 'ind-dashboard', icon: LayoutDashboard },
  { label: 'Browse Spaces', screen: 'browse', icon: Search },
  { label: 'My Bookings', screen: 'my-bookings', icon: CalendarDays },
  { label: 'Profile', screen: 'ind-profile', icon: User },
  { label: 'Settings', screen: 'ind-settings', icon: Settings },
];

const orgNav: NavItem[] = [
  { label: 'Dashboard', screen: 'org-dashboard', icon: LayoutDashboard },
  { label: 'Browse Spaces', screen: 'browse', icon: Search },
  { label: 'Team Bookings', screen: 'team-bookings', icon: Briefcase },
  { label: 'Org Profile', screen: 'org-profile', icon: Building2 },
  { label: 'Settings', screen: 'org-settings', icon: Settings },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', screen: 'admin-dashboard', icon: LayoutDashboard },
  { label: 'Spaces', screen: 'admin-spaces', icon: Building2 },
  { label: 'Users', screen: 'admin-users', icon: Users },
  { label: 'Bookings', screen: 'admin-bookings', icon: BookOpen },
  { label: 'Reports', screen: 'admin-reports', icon: BarChart3 },
  { label: 'Settings', screen: 'admin-settings', icon: Settings },
];

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5">
      <LogoImage className="w-8 h-8 rounded-lg" />
      <span className="font-semibold text-soot text-[15px] tracking-tight">
        Coworking Pass
      </span>
    </button>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, navigate, logout, nav } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const navItems = currentUser.role === 'admin' ? adminNav
    : currentUser.role === 'organization' ? orgNav
    : individualNav;

  const dashboardScreen: Screen = currentUser.role === 'admin' ? 'admin-dashboard'
    : currentUser.role === 'organization' ? 'org-dashboard'
    : 'ind-dashboard';

  const isActive = (item: NavItem) => {
    if (item.screen === nav.screen) return true;
    if (item.screen === 'browse' && (nav.screen === 'browse' || nav.screen === 'space-details' || nav.screen === 'booking-flow' || nav.screen === 'team-booking')) return true;
    return false;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5">
        <Logo onClick={() => { navigate(dashboardScreen); setMobileOpen(false); }} />
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(item => {
          const active = isActive(item);
          return (
            <button
              key={item.screen}
              onClick={() => { navigate(item.screen); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'mist-active'
                  : 'text-moss mist-hover hover:text-soot'
              }`}
            >
              <item.icon size={17} className={active ? 'text-soot' : ''} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5 mt-4 border-t border-plaster/10 pt-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-eucalyptus/30"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-plaster truncate">{currentUser.name}</div>
            <div className="text-xs text-plaster/50 capitalize truncate">{currentUser.role}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-plaster/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-plaster">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-soot h-full">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ backgroundColor: 'rgba(45,53,54,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="w-64 bg-soot h-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <button onClick={() => setMobileOpen(false)} className="p-2 text-plaster/60 hover:text-plaster">
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-plaster/95 backdrop-blur-sm border-b border-soot/8 h-14 flex items-center px-4 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-soot/5 text-soot"
          >
            <Menu size={20} />
          </button>
          <Logo onClick={() => navigate(dashboardScreen)} />
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}