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
  Languages,
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
  ThemeMode,
  UserProgress,
} from './types';

const STORAGE_KEY_PROGRESS = 'techstart_india_progress_v1';
const STORAGE_KEY_LANG = 'techstart_india_lang_v1';
const STORAGE_KEY_THEME = 'techstart_india_theme_v1';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 115,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  completedComputerIds: ['comp-what-is-computer', 'comp-types-of-pcs', 'comp-cpu'],
  completedWindowsIds: ['excel-marks-sheet'],
  completedPythonIds: ['py-1', 'py-4', 'py-6', 'py-8', 'py-11', 'py-14'],
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
    return saved === 'hi' ? 'hi' : 'en';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved === 'dark' ? 'dark' : 'light';
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
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  }, [progress]);

  const t = UI_TEXT[lang];

  const handleNavigate = (
    tab: MainTab,
    opts?: {
      learnModule?: LearnModule;
      practiceMode?: PracticeMode;
      buildMode?: BuildMode;
      pythonLessonId?: string;
      computerTopicId?: string;
      challengeId?: string;
    }
  ) => {
    setActiveTab(tab);
    if (opts?.learnModule) setLearnModule(opts.learnModule);
    if (opts?.practiceMode) setPracticeMode(opts.practiceMode);
    if (opts?.buildMode) setBuildMode(opts.buildMode);
    if (opts?.pythonLessonId) setSelectedPythonLessonId(opts.pythonLessonId);
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

  const handleCompleteLesson = (type: 'computer' | 'windows' | 'python', id: string, xp: number) => {
    updateProgressAndCheckBadges((prev) => {
      const key =
        type === 'computer'
          ? 'completedComputerIds'
          : type === 'windows'
          ? 'completedWindowsIds'
          : 'completedPythonIds';
      if (prev[key].includes(id)) return prev;
      return {
        ...prev,
        xp: prev.xp + xp,
        [key]: [...prev[key], id],
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

  // Strictly 4 focused learning tabs in primary navigation (Product Spec moved to subtle footer)
  const navItems: { id: MainTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
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
        message:
          lang === 'en'
            ? 'Invalid backup key or JSON. Please paste the full key copied earlier.'
            : 'Galat backup key ya JSON. Kripya pehle copy kiya gaya poora key paste karein.',
      });
      return;
    }
    setProgress(restored);
    setBackupInput('');
    setBackupStatus({
      ok: true,
      message:
        lang === 'en'
          ? `Progress restored cleanly! (${restored.xp} XP, ${restored.completedPythonIds.length} Python lessons)`
          : `Progress restore ho gaya! (${restored.xp} XP, ${restored.completedPythonIds.length} Python lessons)`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 pb-20 md:pb-0">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 h-13 md:h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line brand wordmark */}
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.brand}
          </button>

          {/* Zone 2: 4 concise single-line learning links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`py-1.5 text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                    active
                      ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300'
                      : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => handleNavigate('learn', { learnModule: 'python' })}
              className="min-h-[38px] md:min-h-[40px] px-3.5 md:px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {t.resumeLearning}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-6">
        {/* Workspace Utility Toolbar (Stats, Achievements, Backup Key, Language, Theme) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {t.xpLabel}: <strong className="text-slate-900 dark:text-slate-100">{progress.xp}</strong> · {t.dailyStreak}:{' '}
            <strong className="text-slate-900 dark:text-slate-100">
              {progress.streakDays} {t.daysLabel}
            </strong>{' '}
            · {t.offlineReady}:{' '}
            <strong className="text-slate-900 dark:text-slate-100">{progress.downloadedLessonIds.length}</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Achievements / Leaderboard Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowAchievementsModal(true)}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {t.achievementsBtn} ({earnedBadges.length}/{BADGES.length})
              </span>
            </button>

            {/* Export / Import Progress Key Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                setBackupStatus(null);
                setShowBackupModal(true);
              }}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <KeyRound className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{t.backupBtn}</span>
            </button>

            {/* Language Switch */}
            <div className="inline-flex items-center p-0.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Languages className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                  lang === 'en' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {t.englishLabel}
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                  lang === 'hi' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {t.hindiLabel}
              </button>
            </div>

            {/* Theme Switch */}
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              aria-label="Toggle Light or Dark mode"
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{theme === 'light' ? t.darkMode : t.lightMode}</span>
            </button>
          </div>
        </div>

        {/* Active View */}
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
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              {lang === 'en' ? 'Back to Learning Dashboard' : 'Home Dashboard par Wapas Jayein'}
            </button>
            <ProductSpecView />
          </div>
        )}

        {/* Mobile/Tablet Subtle About Link (keeps primary nav clean) */}
        {activeTab !== 'spec' && (
          <div className="md:hidden pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>TechStart India · MIT Open Source</span>
            <button
              type="button"
              onClick={() => handleNavigate('spec')}
              className="text-teal-700 dark:text-teal-400 font-medium hover:underline cursor-pointer"
            >
              {t.navSpec}
            </button>
          </div>
        )}
      </main>

      {/* Quiet Desktop Footer with About / Open-Source Contributors Spec Link */}
      <footer className="hidden md:block border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-5 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>TechStart India · Free & Open-Source Learning Platform (MIT License)</span>
          <div className="flex items-center gap-4">
            <span>Original educational content · English & Hinglish · Accessible Mobile-First Design</span>
            <button
              type="button"
              onClick={() => handleNavigate('spec')}
              className="text-teal-700 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
            >
              {lang === 'en' ? 'About / For Contributors (Specs)' : 'About & Open-Source Specs'}
            </button>
          </div>
        </div>
      </footer>

      {/* Achievements & Weekly Leaderboard Modal */}
      {showAchievementsModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="achievements-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-3xl w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="achievements-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {t.badgesEarned} & {t.weeklyLeaderboard}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {earnedBadges.length} / {BADGES.length}{' '}
                  {lang === 'en' ? 'badges unlocked · Tap any milestone to read real tech history.' : 'badges unlocked'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowAchievementsModal(false)}
                className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGES.map((badge) => {
                const earned = earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      earned
                        ? 'border-amber-300 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {badge.title[lang]}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          earned ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400'
                        }`}
                      >
                        {earned ? 'Earned' : badge.requirementText[lang]}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{badge.description[lang]}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/70 dark:border-slate-700/60">
                      <strong className="text-teal-700 dark:text-teal-400">
                        {badge.techHistory.person} ({badge.techHistory.year}):
                      </strong>{' '}
                      {badge.techHistory.story[lang]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Opt-In Weekly Leaderboard */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {t.weeklyLeaderboard}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.leaderboardPrivacyNote}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProgress((p) => ({ ...p, leaderboardOptIn: !p.leaderboardOptIn }))}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    progress.leaderboardOptIn
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  {progress.leaderboardOptIn ? t.leaveLeaderboard : t.joinLeaderboard}
                </button>
              </div>

              {progress.leaderboardOptIn && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 shrink-0">
                    {lang === 'en' ? 'Nickname:' : 'Nickname:'}
                  </label>
                  <input
                    type="text"
                    value={progress.displayName}
                    maxLength={24}
                    onChange={(e) => setProgress((p) => ({ ...p, displayName: e.target.value }))}
                    className="flex-1 min-h-[38px] px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              )}

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {leaderboardRows.map((entry, idx) => (
                  <div key={`${entry.name}-${idx}`} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 text-center font-mono text-slate-500">#{idx + 1}</span>
                      <span
                        className={
                          entry.isMe
                            ? 'font-bold text-teal-700 dark:text-teal-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }
                      >
                        {entry.name} {entry.isMe ? `(${t.youLabel})` : ''}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-600 dark:text-slate-300 tabular-nums">
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
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="backup-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {lang === 'en' ? 'Backup & Restore Progress' : 'Progress Backup & Restore Karein'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === 'en'
                    ? 'Save your XP, streak, and 120-lesson progress safely without needing an account or login.'
                    : 'Bina login kiye apna XP, streak aur lesson progress safe rakhein ya naye phone/laptop par transfer karein.'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowBackupModal(false)}
                className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Export Section */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                {lang === 'en' ? '1. Export Your Progress Key' : '1. Apna Progress Key Save Karein'}
              </div>
              <textarea
                readOnly
                rows={3}
                value={exportCode}
                aria-label="Exported progress key"
                className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyBackup}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {backupCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {backupCopied
                    ? lang === 'en'
                      ? 'Backup Key Copied!'
                      : 'Key Copy Ho Gaya!'
                    : lang === 'en'
                    ? 'Copy Progress Key'
                    : 'Progress Key Copy Karein'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBackupJson}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Download JSON File' : 'JSON File Download Karein'}
                </button>
              </div>
            </div>

            {/* Import Section */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                {lang === 'en' ? '2. Restore from Saved Key or JSON' : '2. Purana Key ya JSON Paste Karein'}
              </div>
              <textarea
                rows={3}
                value={backupInput}
                onChange={(e) => setBackupInput(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'Paste your saved progress key or JSON here...'
                    : 'Apna purana progress key ya JSON yahan paste karein...'
                }
                aria-label="Paste progress key to restore"
                className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleRestoreProgress}
                className="min-h-[40px] px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Restore Progress' : 'Progress Restore Karein'}
              </button>
              {backupStatus && (
                <p
                  className={`text-xs font-medium ${
                    backupStatus.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {backupStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Badge Unlocked + Short Tech History Motivation Modal */}
      {unlockedBadgeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {lang === 'en' ? 'New Badge Unlocked!' : 'Naya Badge Unlock Hua!'}
                  </div>
                  <h2 id="badge-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {unlockedBadgeModal.title[lang]}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setUnlockedBadgeModal(null)}
                className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">{unlockedBadgeModal.description[lang]}</p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                {lang === 'en' ? 'Tech History Motivation' : 'Tech History se Prerna'} ·{' '}
                {unlockedBadgeModal.techHistory.person} ({unlockedBadgeModal.techHistory.year})
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {unlockedBadgeModal.techHistory.story[lang]}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setUnlockedBadgeModal(null)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold cursor-pointer"
            >
              {lang === 'en' ? 'Keep Learning' : 'Seekhna Jaari Rakhein'}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Thumb Navigation (< 15% viewport height, 4 primary tabs) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center"
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
                active ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
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
