import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  Check,
  Copy,
  Download,
  Home,
  KeyRound,
  Moon,
  Sun,
  Terminal,
  Trophy,
  Upload,
  X,
} from 'lucide-react';
import { BuildAndGrow } from './components/BuildAndGrow';
import { HomeDashboard } from './components/HomeDashboard';
import { LearnHub } from './components/LearnHub';
import { PracticeArena } from './components/PracticeArena';
import { ProductSpecView } from './components/ProductSpecView';
import { BADGES, SAMPLE_LEADERBOARD, getEarnedBadgeIds } from './data/projectsNewsCareer';
import { UI_TEXT } from './data/translations';
import {
  BadgeItem,
  BuildMode,
  Language,
  LearnModule,
  MainTab,
  PracticeMode,
  PythonDomainId,
  ThemeMode,
  UserProgress,
  pickText,
} from './types';

const STORAGE_KEY_PROGRESS = 'techstart_india_progress_v1';
const STORAGE_KEY_LANG = 'techstart_india_lang_v1';
const STORAGE_KEY_THEME = 'techstart_india_theme_v2';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 115,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  completedComputerIds: ['comp-what-is-computer', 'comp-types-of-pcs', 'comp-cpu'],
  completedWindowsIds: ['excel-marks-sheet'],
  completedPythonIds: ['py-1', 'py-4', 'py-6', 'py-8', 'py-11', 'py-14'],
  completedLibraryIds: [],
  solvedChallengeIds: [],
  solvedBugIds: [],
  downloadedLessonIds: ['comp-ram', 'py-15'],
  completedChecklistIds: [],
  leaderboardOptIn: false,
  displayName: 'Aarav_IN',
};

function encodeProgressKey(progress: UserProgress): string {
  const json = JSON.stringify(progress);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function decodeProgressKey(raw: string): UserProgress | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let parsed: unknown = null;
  try {
    if (trimmed.startsWith('{')) {
      parsed = JSON.parse(trimmed);
    } else {
      const binary = atob(trimmed);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const json = new TextDecoder().decode(bytes);
      parsed = JSON.parse(json);
    }
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== 'object') return null;
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.xp !== 'number' || !Array.isArray(obj.completedPythonIds) || !Array.isArray(obj.completedComputerIds)) {
    return null;
  }
  return {
    ...DEFAULT_PROGRESS,
    xp: obj.xp,
    streakDays: typeof obj.streakDays === 'number' ? obj.streakDays : DEFAULT_PROGRESS.streakDays,
    lastActiveDate: typeof obj.lastActiveDate === 'string' ? obj.lastActiveDate : DEFAULT_PROGRESS.lastActiveDate,
    completedComputerIds: obj.completedComputerIds.filter((x): x is string => typeof x === 'string'),
    completedWindowsIds: Array.isArray(obj.completedWindowsIds)
      ? obj.completedWindowsIds.filter((x): x is string => typeof x === 'string')
      : [],
    completedPythonIds: obj.completedPythonIds.filter((x): x is string => typeof x === 'string'),
    completedLibraryIds: Array.isArray(obj.completedLibraryIds)
      ? obj.completedLibraryIds.filter((x): x is string => typeof x === 'string')
      : [],
    solvedChallengeIds: Array.isArray(obj.solvedChallengeIds)
      ? obj.solvedChallengeIds.filter((x): x is string => typeof x === 'string')
      : [],
    solvedBugIds: Array.isArray(obj.solvedBugIds)
      ? obj.solvedBugIds.filter((x): x is string => typeof x === 'string')
      : [],
    downloadedLessonIds: Array.isArray(obj.downloadedLessonIds)
      ? obj.downloadedLessonIds.filter((x): x is string => typeof x === 'string')
      : [],
    completedChecklistIds: Array.isArray(obj.completedChecklistIds)
      ? obj.completedChecklistIds.filter((x): x is string => typeof x === 'string')
      : [],
    leaderboardOptIn: Boolean(obj.leaderboardOptIn),
    displayName: typeof obj.displayName === 'string' ? obj.displayName : DEFAULT_PROGRESS.displayName,
  };
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return saved === 'gu' ? 'gu' : saved === 'hi' ? 'hi' : 'en';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved === 'light' ? 'light' : 'dark';
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
    } catch {
      // Fallback to default
    }
    return DEFAULT_PROGRESS;
  });

  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [learnModule, setLearnModule] = useState<LearnModule>('computer');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('challenges');
  const [buildMode, setBuildMode] = useState<BuildMode>('projects');
  const [selectedPythonLessonId, setSelectedPythonLessonId] = useState<string | undefined>(undefined);
  const [selectedPythonDomainId, setSelectedPythonDomainId] = useState<PythonDomainId | undefined>(undefined);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | undefined>(undefined);

  const [unlockedBadgeModal, setUnlockedBadgeModal] = useState<BadgeItem | null>(null);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupCopied, setBackupCopied] = useState(false);
  const [backupInput, setBackupInput] = useState('');
  const [backupStatus, setBackupStatus] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  }, [progress]);

  const t = UI_TEXT[lang];
  const tr = (en: string, hi: string, gu: string) => (lang === 'gu' ? gu : lang === 'hi' ? hi : en);

  const handleNavigate = (
    tab: MainTab,
    opts?: {
      learnModule?: LearnModule;
      practiceMode?: PracticeMode;
      buildMode?: BuildMode;
      pythonLessonId?: string;
      pythonDomainId?: PythonDomainId;
      computerTopicId?: string;
      challengeId?: string;
    }
  ) => {
    setActiveTab(tab);
    if (opts?.learnModule) setLearnModule(opts.learnModule);
    if (opts?.practiceMode) setPracticeMode(opts.practiceMode);
    if (opts?.buildMode) setBuildMode(opts.buildMode);
    if (opts?.pythonLessonId) setSelectedPythonLessonId(opts.pythonLessonId);
    if (opts?.pythonDomainId) setSelectedPythonDomainId(opts.pythonDomainId);
    if (opts?.challengeId) setSelectedChallengeId(opts.challengeId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProgressAndCheckBadges = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const beforeBadges = new Set(getEarnedBadgeIds(prev));
      const next = updater(prev);
      if (next === prev) return prev;
      const afterBadges = getEarnedBadgeIds(next);
      const newlyEarnedId = afterBadges.find((id) => !beforeBadges.has(id));
      if (newlyEarnedId) {
        const badgeObj = BADGES.find((b) => b.id === newlyEarnedId) || null;
        if (badgeObj) {
          setTimeout(() => setUnlockedBadgeModal(badgeObj), 100);
        }
      }
      return next;
    });
  };

  const handleCompleteLesson = (type: 'computer' | 'windows' | 'python' | 'library', id: string, xp: number) => {
    updateProgressAndCheckBadges((prev) => {
      const key =
        type === 'computer'
          ? 'completedComputerIds'
          : type === 'windows'
          ? 'completedWindowsIds'
          : type === 'library'
          ? 'completedLibraryIds'
          : 'completedPythonIds';
      const existing = prev[key] || [];
      if (existing.includes(id)) return prev;
      return {
        ...prev,
        xp: prev.xp + xp,
        [key]: [...existing, id],
      };
    });
  };

  const handleSolveChallenge = (id: string, xp: number) => {
    updateProgressAndCheckBadges((prev) => {
      if (prev.solvedChallengeIds.includes(id)) return prev;
      return {
        ...prev,
        xp: prev.xp + xp,
        solvedChallengeIds: [...prev.solvedChallengeIds, id],
      };
    });
  };

  const handleSolveBug = (id: string, xp: number) => {
    updateProgressAndCheckBadges((prev) => {
      if (prev.solvedBugIds.includes(id)) return prev;
      return {
        ...prev,
        xp: prev.xp + xp,
        solvedBugIds: [...prev.solvedBugIds, id],
      };
    });
  };

  const handleBonusXp = (xp: number) => {
    updateProgressAndCheckBadges((prev) => ({
      ...prev,
      xp: prev.xp + xp,
    }));
  };

  const handleToggleDownload = (id: string) => {
    setProgress((prev) => {
      const exists = prev.downloadedLessonIds.includes(id);
      return {
        ...prev,
        downloadedLessonIds: exists
          ? prev.downloadedLessonIds.filter((x) => x !== id)
          : [...prev.downloadedLessonIds, id],
      };
    });
  };

  const handleToggleChecklist = (id: string) => {
    setProgress((prev) => {
      const exists = prev.completedChecklistIds.includes(id);
      return {
        ...prev,
        completedChecklistIds: exists
          ? prev.completedChecklistIds.filter((x) => x !== id)
          : [...prev.completedChecklistIds, id],
      };
    });
  };

  const navItems: {
    id: MainTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'learn', label: t.navLearn, icon: BookOpen },
    { id: 'practice', label: t.navPractice, icon: Terminal },
    { id: 'build', label: t.navBuild, icon: Briefcase },
  ];

  const earnedBadges = getEarnedBadgeIds(progress);
  const leaderboardRows = [
    ...SAMPLE_LEADERBOARD.map((row) => ({ ...row, isMe: false })),
    ...(progress.leaderboardOptIn
      ? [{ name: progress.displayName || 'Learner', xp: progress.xp, streak: progress.streakDays, isMe: true }]
      : []),
  ].sort((a, b) => b.xp - a.xp);

  const exportCode = showBackupModal ? encodeProgressKey(progress) : '';

  const handleCopyBackup = () => {
    navigator.clipboard?.writeText(exportCode);
    setBackupCopied(true);
    setTimeout(() => setBackupCopied(false), 1800);
  };

  const handleDownloadBackupJson = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techstart-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreProgress = () => {
    const restored = decodeProgressKey(backupInput);
    if (!restored) {
      setBackupStatus({
        ok: false,
        message: tr(
          'Invalid backup key or JSON. Please paste the full key copied earlier.',
          'Galat backup key ya JSON. Kripya pehle copy kiya gaya poora key paste karein.',
          'અમાન્ય બેકઅપ કી અથવા JSON. કૃપા કરીને અગાઉ કોપી કરેલી સંપૂર્ણ કી પેસ્ટ કરો.'
        ),
      });
      return;
    }
    setProgress(restored);
    setBackupInput('');
    setBackupStatus({
      ok: true,
      message: tr(
        `Progress restored cleanly! (${restored.xp} XP, ${restored.completedPythonIds.length} Python lessons)`,
        `Progress restore ho gaya! (${restored.xp} XP, ${restored.completedPythonIds.length} Python lessons)`,
        `પ્રોગ્રેસ સફળતાપૂર્વક રિસ્ટોર થયો! (${restored.xp} XP, ${restored.completedPythonIds.length} Python પાઠ)`
      ),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-tech-grid text-slate-900 dark:text-[#E6ECE8] pb-20 md:pb-0">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#0B0E0D]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1D2420]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="font-mono font-normal tracking-[0.14em] text-lg sm:text-2xl text-emerald-700 dark:text-[#00F59B] whitespace-nowrap shrink-0 cursor-pointer"
          >
            TECHSTART
          </button>

          {/* Desktop Horizontal Navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-emerald-500/50 dark:border-[#00E58F] bg-emerald-50 dark:bg-[#00F59B]/12 text-emerald-700 dark:text-[#00F59B] font-semibold'
                      : 'border-transparent text-slate-600 dark:text-[#8A968F] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-[#151A17]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              title={`${t.achievementsBtn} (${earnedBadges.length}/${BADGES.length})`}
              aria-label={t.achievementsBtn}
              onClick={() => setShowAchievementsModal(true)}
              className="hidden sm:inline-flex min-h-[36px] px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#222925] bg-slate-50 dark:bg-[#121614] hover:border-amber-500/60 text-xs font-mono text-slate-700 dark:text-[#D5DDD8] items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="tabular-nums">
                {earnedBadges.length}/{BADGES.length}
              </span>
            </button>

            <button
              type="button"
              title={t.backupBtn}
              aria-label={t.backupBtn}
              onClick={() => {
                setBackupStatus(null);
                setShowBackupModal(true);
              }}
              className="hidden sm:inline-flex min-h-[36px] px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#222925] bg-slate-50 dark:bg-[#121614] hover:border-emerald-500/60 dark:hover:border-[#00E58F]/60 text-emerald-700 dark:text-[#00F59B] items-center justify-center cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
            </button>

            <div className="inline-flex items-center gap-1" role="group" aria-label="Language switcher">
              {(
                [
                  { code: 'en' as Language, short: 'EN', title: t.englishLabel },
                  { code: 'hi' as Language, short: 'HI', title: t.hindiLabel },
                  { code: 'gu' as Language, short: 'GU', title: t.gujaratiLabel },
                ] as const
              ).map((item) => {
                const isSelected = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    title={item.title}
                    onClick={() => setLang(item.code)}
                    className={`min-h-[36px] min-w-[36px] px-2 sm:px-2.5 rounded-md font-mono text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 dark:border-[#00E58F] bg-emerald-50 dark:bg-[#00E58F]/12 text-emerald-700 dark:text-[#00F59B]'
                        : 'border-slate-200 dark:border-[#262E29] bg-slate-50 dark:bg-[#121614] text-slate-600 dark:text-[#9AA6A0] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-[#39453E]'
                    }`}
                  >
                    {item.short}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              title={theme === 'light' ? t.darkMode : t.lightMode}
              aria-label="Toggle Light or Dark mode"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              className="hidden sm:inline-flex min-h-[36px] w-9 rounded-md border border-slate-200 dark:border-[#222925] bg-slate-50 dark:bg-[#121614] text-slate-600 dark:text-[#8E9993] hover:text-slate-900 dark:hover:text-white items-center justify-center transition-colors cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Centered Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Telemetry Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs tracking-wider uppercase tabular-nums">
            <div className="text-slate-500 dark:text-[#7A857F]">
              XP // <strong className="text-emerald-700 dark:text-[#00F59B] font-bold">{progress.xp}</strong>
            </div>
            <div className="text-slate-500 dark:text-[#7A857F]">
              STREAK //{' '}
              <strong className="text-emerald-700 dark:text-[#00F59B] font-bold">
                {progress.streakDays} DAYS
              </strong>
            </div>
            <div className="text-slate-500 dark:text-[#7A857F]">
              CACHE //{' '}
              <strong className="text-emerald-700 dark:text-[#00F59B] font-bold">
                {progress.downloadedLessonIds.length} FILES
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAchievementsModal(true)}
              className="sm:hidden min-h-[34px] px-2.5 py-1 rounded-md bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#242B27] text-xs font-mono text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {earnedBadges.length}/{BADGES.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setBackupStatus(null);
                setShowBackupModal(true);
              }}
              className="sm:hidden min-h-[34px] px-2.5 py-1 rounded-md bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#242B27] text-xs font-mono text-slate-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#00F59B]" />
            </button>
            <button
              type="button"
              aria-label="Toggle Light or Dark mode"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              className="sm:hidden min-h-[34px] px-2.5 py-1 rounded-md bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#242B27] text-xs text-slate-700 dark:text-slate-200 inline-flex items-center cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('learn', { learnModule: 'python' })}
              className="min-h-[36px] px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#24FFA9] text-white dark:text-[#05130D] font-mono text-xs font-bold tracking-wider whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              SYSTEM.RESUME()
            </button>
          </div>
        </div>

        {activeTab === 'home' && (
          <HomeDashboard
            lang={lang}
            progress={progress}
            onNavigate={handleNavigate}
            onOpenAchievements={() => setShowAchievementsModal(true)}
          />
        )}

        {activeTab === 'learn' && (
          <LearnHub
            lang={lang}
            activeModule={learnModule}
            onChangeModule={setLearnModule}
            progress={progress}
            onCompleteLesson={handleCompleteLesson}
            onToggleDownload={handleToggleDownload}
            initialPythonLessonId={selectedPythonLessonId}
            initialPythonDomainId={selectedPythonDomainId}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeArena
            lang={lang}
            mode={practiceMode}
            onChangeMode={setPracticeMode}
            progress={progress}
            onSolveChallenge={handleSolveChallenge}
            onSolveBug={handleSolveBug}
            initialChallengeId={selectedChallengeId}
          />
        )}

        {activeTab === 'build' && (
          <BuildAndGrow
            lang={lang}
            mode={buildMode}
            onChangeMode={setBuildMode}
            progress={progress}
            onToggleChecklist={handleToggleChecklist}
            onBonusXp={handleBonusXp}
          />
        )}

        {activeTab === 'spec' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#242B27] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer hover:border-[#00E58F]/60"
            >
              <ArrowLeft className="w-4 h-4" />
              {tr(
                'Back to Learning Dashboard',
                'Home Dashboard par Wapas Jayein',
                'લર્નિંગ ડેશબોર્ડ પર પાછા જાઓ'
              )}
            </button>
            <ProductSpecView lang={lang} />
          </div>
        )}

        {activeTab !== 'spec' && (
          <div className="md:hidden pt-4 border-t border-slate-200 dark:border-[#1E2420] flex items-center justify-between font-mono text-xs text-slate-500 dark:text-[#6F7A74]">
            <span>[NODE] TechStart India v2.4.0</span>
            <button
              type="button"
              onClick={() => handleNavigate('spec')}
              className="text-emerald-700 dark:text-[#00F59B] font-medium hover:underline cursor-pointer"
            >
              [ROOT@DOCS] {t.navSpec}
            </button>
          </div>
        )}
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block border-t border-slate-200 dark:border-[#1D2420] bg-white/95 dark:bg-[#0B0E0D]/95 py-3.5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-500 dark:text-[#6F7A74]">
          <span>[NODE] TechStart India v2.4.0 · MIT Open-Source</span>
          <button
            type="button"
            onClick={() => handleNavigate('spec')}
            className="text-emerald-700 dark:text-[#00F59B] font-medium hover:underline cursor-pointer"
          >
            [ROOT@DOCS] {tr('About & Specs', 'About & Specs', 'માહિતી અને સ્પેક્સ')}
          </button>
        </div>
      </footer>

      {/* Achievements & Weekly Leaderboard Modal */}
      {showAchievementsModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="achievements-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-3xl w-full rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#242B27] p-5 sm:p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="achievements-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.badgesEarned} & {t.weeklyLeaderboard}
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#8A968F] mt-0.5 tabular-nums">
                  {earnedBadges.length} / {BADGES.length}{' '}
                  {tr(
                    'badges unlocked · Tap any milestone to read real tech history.',
                    'badges unlocked · Har milestone par real tech history padhein.',
                    'બેજ અનલોક થયા · દરેક માઇલસ્ટોન પર સાચો ટેક ઇતિહાસ વાંચો.'
                  )}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowAchievementsModal(false)}
                className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1C221F] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGES.map((badge) => {
                const earned = earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      earned
                        ? 'border-emerald-500/50 dark:border-[#00E58F]/50 bg-emerald-50/50 dark:bg-[#00E58F]/5'
                        : 'border-slate-200 dark:border-[#222925] bg-slate-50 dark:bg-[#0D100F] opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {pickText(badge.title, lang)}
                      </span>
                      <span
                        className={`text-xs font-mono font-semibold ${
                          earned ? 'text-emerald-700 dark:text-[#00F59B]' : 'text-slate-400'
                        }`}
                      >
                        {earned ? tr('Earned', 'Earned', 'મેળવેલ') : pickText(badge.requirementText, lang)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#98A39D]">{pickText(badge.description, lang)}</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#7D8882] pt-1 border-t border-slate-200/70 dark:border-[#1E2420]">
                      <strong className="text-emerald-700 dark:text-[#00F59B]">
                        {badge.techHistory.person} ({badge.techHistory.year}):
                      </strong>{' '}
                      {pickText(badge.techHistory.story, lang)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-[#222925] bg-slate-50/70 dark:bg-[#0D100F] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {t.weeklyLeaderboard}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8A968F] mt-0.5">{t.leaderboardPrivacyNote}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProgress((p) => ({ ...p, leaderboardOptIn: !p.leaderboardOptIn }))}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-md font-mono text-xs font-semibold cursor-pointer ${
                    progress.leaderboardOptIn
                      ? 'bg-slate-200 dark:bg-[#1E2420] text-slate-800 dark:text-slate-200'
                      : 'bg-emerald-600 dark:bg-[#00F59B] text-white dark:text-[#05130D]'
                  }`}
                >
                  {progress.leaderboardOptIn ? t.leaveLeaderboard : t.joinLeaderboard}
                </button>
              </div>

              {progress.leaderboardOptIn && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 shrink-0">
                    {tr('Nickname:', 'Nickname:', 'નિકનેમ:')}
                  </label>
                  <input
                    type="text"
                    value={progress.displayName}
                    maxLength={24}
                    onChange={(e) => setProgress((p) => ({ ...p, displayName: e.target.value }))}
                    className="flex-1 min-h-[38px] px-3 py-1.5 rounded-md bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#262E29] text-xs text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="divide-y divide-slate-200 dark:divide-[#1E2420]">
                {leaderboardRows.map((entry, idx) => (
                  <div key={`${entry.name}-${idx}`} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 text-center font-mono text-slate-500">#{idx + 1}</span>
                      <span
                        className={
                          entry.isMe
                            ? 'font-bold text-emerald-700 dark:text-[#00F59B]'
                            : 'text-slate-800 dark:text-slate-200'
                        }
                      >
                        {entry.name} {entry.isMe ? `(${t.youLabel})` : ''}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-600 dark:text-[#8A968F] tabular-nums">
                      {entry.xp} XP · {entry.streak}d
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export / Import Progress Key Modal */}
      {showBackupModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="backup-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-lg w-full rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#242B27] p-5 sm:p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="backup-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  {tr('Backup & Restore Progress', 'Progress Backup & Restore Karein', 'પ્રોગ્રેસ બેકઅપ અને રિસ્ટોર કરો')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#8A968F] mt-0.5">
                  {tr(
                    'Save your XP, streak, and 120-lesson progress safely without needing an account or login.',
                    'Bina login kiye apna XP, streak aur lesson progress safe rakhein ya naye phone/laptop par transfer karein.',
                    'કોઈ એકાઉન્ટ કે લોગિન વગર તમારા XP, સ્ટ્રીક અને 120 પાઠની પ્રગતિ સુરક્ષિત રાખો અથવા નવા ઉપકરણ પર ટ્રાન્સફર કરો.'
                  )}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowBackupModal(false)}
                className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1C221F] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-3">
              <div className="text-xs font-mono font-semibold text-emerald-700 dark:text-[#00F59B]">
                {tr('1. Export Your Progress Key', '1. Apna Progress Key Save Karein', '1. તમારી પ્રોગ્રેસ કી સેવ કરો')}
              </div>
              <textarea
                readOnly
                rows={3}
                value={exportCode}
                aria-label="Exported progress key"
                className="w-full p-2.5 rounded-lg bg-white dark:bg-[#090C0B] border border-slate-200 dark:border-[#242B27] font-mono text-[11px] text-slate-700 dark:text-slate-300"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyBackup}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-md bg-emerald-600 dark:bg-[#00F59B] hover:bg-emerald-700 dark:hover:bg-[#24FFA9] text-white dark:text-[#05130D] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {backupCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {backupCopied
                    ? tr('Backup Key Copied!', 'Key Copy Ho Gaya!', 'બેકઅપ કી કોપી થઈ ગઈ!')
                    : tr('Copy Progress Key', 'Progress Key Copy Karein', 'પ્રોગ્રેસ કી કોપી કરો')}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBackupJson}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-md bg-white dark:bg-[#151A17] border border-slate-200 dark:border-[#262E29] text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  {tr('Download JSON File', 'JSON File Download Karein', 'JSON ફાઇલ ડાઉનલોડ કરો')}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-3">
              <div className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                {tr('2. Restore from Saved Key or JSON', '2. Purana Key ya JSON Paste Karein', '2. સેવ કરેલી કી અથવા JSON પેસ્ટ કરો')}
              </div>
              <textarea
                rows={3}
                value={backupInput}
                onChange={(e) => setBackupInput(e.target.value)}
                placeholder={tr(
                  'Paste your saved progress key or JSON here...',
                  'Apna purana progress key ya JSON yahan paste karein...',
                  'તમારી સેવ કરેલી પ્રોગ્રેસ કી અથવા JSON અહીં પેસ્ટ કરો...'
                )}
                aria-label="Paste progress key to restore"
                className="w-full p-2.5 rounded-lg bg-white dark:bg-[#090C0B] border border-slate-200 dark:border-[#242B27] font-mono text-[11px] text-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleRestoreProgress}
                className="min-h-[40px] px-4 py-1.5 rounded-md bg-slate-900 dark:bg-[#1C2420] hover:bg-slate-800 dark:hover:bg-[#26302B] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                {tr('Restore Progress', 'Progress Restore Karein', 'પ્રોગ્રેસ રિસ્ટોર કરો')}
              </button>
              {backupStatus && (
                <p
                  className={`text-xs font-medium ${
                    backupStatus.ok ? 'text-emerald-700 dark:text-[#00F59B]' : 'text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {backupStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Badge Unlocked Modal */}
      {unlockedBadgeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full rounded-xl bg-white dark:bg-[#121614] border border-emerald-500/60 dark:border-[#00E58F]/60 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                    {tr('New Badge Unlocked!', 'Naya Badge Unlock Hua!', 'નવો બેજ અનલોક થયો!')}
                  </div>
                  <h2 id="badge-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                    {pickText(unlockedBadgeModal.title, lang)}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setUnlockedBadgeModal(null)}
                className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1C221F] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-[#98A39D]">{pickText(unlockedBadgeModal.description, lang)}</p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-1.5">
              <div className="text-xs font-mono font-semibold text-emerald-700 dark:text-[#00F59B]">
                {tr('Tech History Motivation', 'Tech History se Prerna', 'ટેક ઇતિહાસમાંથી પ્રેરણા')} ·{' '}
                {unlockedBadgeModal.techHistory.person} ({unlockedBadgeModal.techHistory.year})
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {pickText(unlockedBadgeModal.techHistory.story, lang)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setUnlockedBadgeModal(null)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-md bg-emerald-600 dark:bg-[#00F59B] hover:bg-emerald-700 dark:hover:bg-[#24FFA9] text-white dark:text-[#05130D] text-sm font-bold cursor-pointer"
            >
              {tr('Keep Learning', 'Seekhna Jaari Rakhein', 'શીખવાનું ચાલુ રાખો')}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Thumb Navigation (< 15% viewport height) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-[#0B0E0D]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#1D2420] grid grid-cols-4 items-center"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className={`h-full min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 cursor-pointer ${
                active ? 'text-emerald-600 dark:text-[#00F59B] font-semibold' : 'text-slate-500 dark:text-[#7A857F]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-tight truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
