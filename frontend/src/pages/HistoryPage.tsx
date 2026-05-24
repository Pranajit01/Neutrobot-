import React, { useEffect, useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { useAuth } from '../context/AuthContext';

export const HistoryPage: React.FC = () => {
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authFetch('/nutrition/history');
        if (res.ok) {
          const json = await res.json();
          setLogs(json);
        }
      } catch (err) {
        console.error('Failed to fetch history logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getCalorieStatus = (calories: number) => {
    if (calories > 800) return 'surplus';
    if (calories < 500) return 'deficit';
    return 'balanced';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    return {
      date: `${month} ${day}`,
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-heading text-4xl">
        SYNCHRONIZING ARCHIVE...
      </div>
    );
  }

  return (
    <PageTransition className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-24 flex justify-between items-end border-b-4 border-primary pb-8">
          <h1 className="text-6xl sm:text-8xl">ARCHIVE</h1>
          <span className="font-heading text-xl opacity-50">{logs.length} LOGS</span>
        </header>

        {logs.length > 0 ? (
          <div className="flex flex-col gap-12">
            {logs.map((log) => {
              const { date, time } = formatDate(log.createdAt);
              const status = getCalorieStatus(log.calories);
              
              return (
                <div key={log.id} className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start border-b border-primary/20 pb-12 hover:border-primary transition-colors">
                  <div className="w-48 flex-shrink-0">
                    <div className="font-heading text-4xl sm:text-5xl font-bold tracking-tighter">{date}</div>
                    <div className="text-sm opacity-50 uppercase tracking-widest mt-2">{time}</div>
                  </div>
                  
                  <div className="flex-grow max-w-lg">
                    <p className="text-xl sm:text-2xl font-medium leading-relaxed group-hover:text-accent-red transition-colors">
                      "{log.query}"
                    </p>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                    <div className="font-heading text-3xl font-bold">
                      {log.calories} <span className="text-sm font-sans font-normal opacity-50 uppercase">kcal</span>
                    </div>
                    <div className={`px-4 py-1 text-xs font-bold uppercase tracking-widest text-background
                      ${status === 'deficit' ? 'bg-accent-orange' : ''}
                      ${status === 'balanced' ? 'bg-primary' : ''}
                      ${status === 'surplus' ? 'bg-accent-red' : ''}
                    `}>
                      {status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-primary/30">
            <p className="font-heading text-2xl opacity-60 mb-6 uppercase">ARCHIVE EMPTY</p>
            <p className="text-base opacity-50 max-w-md mx-auto mb-8">
              You haven't logged any nutritional entries yet. Begin tracking to construct your health archive.
            </p>
            <button
              onClick={() => window.location.href = '/log'}
              className="bg-primary text-background font-heading font-bold uppercase px-8 py-4 hover:bg-accent-red transition-colors"
            >
              Log Your First Intake
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default HistoryPage;
