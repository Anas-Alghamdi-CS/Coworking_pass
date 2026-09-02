import { Bell, CheckCheck, CalendarDays, Info, Clock, XCircle } from 'lucide-react';
import { useApp } from '@/app/store';

export default function Notifications() {
  const { notifications, markAllNotificationsRead, markNotificationRead } = useApp();

  const iconFor = (type: string) => {
    if (type === 'booking') return <CalendarDays size={17} />;
    if (type === 'cancelled') return <XCircle size={17} />;
    if (type === 'reminder') return <Clock size={17} />;
    return <Info size={17} />;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl text-soot" style={{ fontFamily: 'DM Serif Display, serif' }}>Notifications</h1>
          <p className="text-sm text-moss mt-1">All your account updates in one place.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllNotificationsRead} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-soot/12 text-xs font-medium text-soot hover:bg-soot/5">
            <CheckCheck size={14} /> Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-soot/8 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-20 text-center">
            <Bell size={30} className="mx-auto text-moss/50 mb-3" />
            <p className="text-sm text-moss">You have no notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-soot/5">
            {notifications.map(notification => (
              <button key={notification.id} onClick={() => markNotificationRead(notification.id)} className={`w-full text-left flex gap-3 p-5 transition-colors hover:bg-soot/3 ${notification.read ? 'bg-white' : 'bg-[#EAF1F5]/60'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${notification.read ? 'bg-soot/8 text-moss' : 'bg-[#B3C9D6] text-soot'}`}>
                  {iconFor(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className={`text-sm ${notification.read ? 'font-medium' : 'font-semibold'} text-soot`}>{notification.title}</h2>
                    {!notification.read && <span className="w-2 h-2 rounded-full bg-eucalyptus shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-sm text-moss mt-1 leading-relaxed">{notification.message}</p>
                  <p className="text-xs text-moss/70 mt-2">{notification.createdAt}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
