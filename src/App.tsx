import React, { useState, useEffect, useMemo } from 'react';
import { LogOut } from 'lucide-react';
import {
  INITIAL_GROUPS,
  INITIAL_INDICATORS,
  IndicatorItem,
  ModuleKey,
  UserSession,
} from './data/kinerjaData';
import { LoginScreen } from './components/LoginScreen';
import { SimpleMatchingQuiz } from './components/SimpleMatchingQuiz';
import { QuizResultView } from './components/QuizResultView';

type ActiveTab = 'soal' | 'hasil';

const STORAGE_KEYS = {
  USER: 'kinerjaguru_user_v2',
  RECENT_USERS: 'kinerjaguru_recent_users_v2',
  PLACEMENTS: 'kinerjaguru_placements_v2',
};

export default function App() {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.nama && parsed.unitKerja) return parsed;
      }
    } catch {
      // ignore storage read error
    }
    return null;
  });

  const [recentUsers, setRecentUsers] = useState<UserSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage read error
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('soal');
  const [perilakuLengkap, setPerilakuLengkap] = useState<boolean>(false);

  const [placements, setPlacements] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLACEMENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage read error
    }
    return {};
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      // ignore storage write error
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.RECENT_USERS,
        JSON.stringify(recentUsers)
      );
    } catch {
      // ignore storage write error
    }
  }, [recentUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLACEMENTS, JSON.stringify(placements));
    } catch {
      // ignore storage write error
    }
  }, [placements]);

  const activeIndicatorsByModule = useMemo<
    Record<ModuleKey, IndicatorItem[]>
  >(() => {
    const praktik = INITIAL_INDICATORS.filter((i) => i.section === 'praktik');
    const allPerilaku = INITIAL_INDICATORS.filter(
      (i) => i.section === 'perilaku'
    );
    const perilaku = perilakuLengkap
      ? allPerilaku
      : (() => {
          const seen = new Set<string>();
          return allPerilaku.filter((ind) => {
            if (seen.has(ind.groupId)) return false;
            seen.add(ind.groupId);
            return true;
          });
        })();
    const kompetensi = INITIAL_INDICATORS.filter(
      (i) => i.section === 'kompetensi'
    );

    return { praktik, perilaku, kompetensi };
  }, [perilakuLengkap]);

  const handleLogin = (session: UserSession) => {
    setUser(session);
    setRecentUsers((prev) => {
      const filtered = prev.filter(
        (u) =>
          !(
            u.nama.toLowerCase() === session.nama.toLowerCase() &&
            u.unitKerja.toLowerCase() === session.unitKerja.toLowerCase()
          )
      );
      return [session, ...filtered].slice(0, 4);
    });
    setActiveTab('soal');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('soal');
  };

  const handleAssign = (indicatorId: string, groupId: string) => {
    setPlacements((prev) => ({
      ...prev,
      [indicatorId]: groupId,
    }));
  };

  const handleRemovePlacement = (indicatorId: string) => {
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[indicatorId];
      return next;
    });
  };

  const handleResetAll = () => {
    setPlacements({});
    setActiveTab('soal');
  };

  if (!user) {
    return <LoginScreen recentUsers={recentUsers} onLogin={handleLogin} />;
  }

  const navItems: Array<{ key: ActiveTab; label: string }> = [
    { key: 'soal', label: 'Soal Menjodohkan' },
    { key: 'hasil', label: 'Hasil & Download' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="bg-white border-b border-slate-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('soal');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0"
          >
            KinerjaGuru
          </a>

          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'border-blue-700 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              Keluar
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-4 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`py-2 text-xs font-medium border-b-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-blue-700 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Workspace */}
      <main
        id="top"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
      >
        {/* Clean Logged-In Identity Strip */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-900">{user.nama}</span>
            <span aria-hidden="true">·</span>
            <span>{user.unitKerja}</span>
          </div>
          <span className="text-xs text-slate-500">
            Soal Menjodohkan Pengelolaan Kinerja Guru
          </span>
        </div>

        {activeTab === 'soal' && (
          <SimpleMatchingQuiz
            groups={INITIAL_GROUPS}
            activeIndicatorsByModule={activeIndicatorsByModule}
            placements={placements}
            perilakuLengkap={perilakuLengkap}
            onTogglePerilakuLengkap={setPerilakuLengkap}
            onAssign={handleAssign}
            onRemovePlacement={handleRemovePlacement}
            onResetAll={handleResetAll}
            onFinishQuiz={() => setActiveTab('hasil')}
          />
        )}

        {activeTab === 'hasil' && (
          <QuizResultView
            user={user}
            groups={INITIAL_GROUPS}
            activeIndicatorsByModule={activeIndicatorsByModule}
            placements={placements}
            onBackToQuiz={() => setActiveTab('soal')}
            onRetryQuiz={handleResetAll}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            KinerjaGuru · {user.nama} ({user.unitKerja})
          </p>
          <p>Soal Menjodohkan Kinerja Guru</p>
        </div>
      </footer>
    </div>
  );
}
