import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Code2,
  Download,
  Flame,
  Newspaper,
  Play,
  Terminal,
  Trophy,
} from 'lucide-react';
import { CODING_CHALLENGES } from '../data/challengesAndBugs';
import { COMPUTER_TOPICS } from '../data/computerBasics';
import { BADGES, getEarnedBadgeIds } from '../data/projectsNewsCareer';
import { PYTHON_LESSONS } from '../data/pythonCourse';
import { UI_TEXT } from '../data/translations';
import { BuildMode, Language, LearnModule, MainTab, PracticeMode, UserProgress } from '../types';
import { TechNewsFeed } from './TechNewsFeed';

interface HomeDashboardProps {
  lang: Language;
  progress: UserProgress;
  onNavigate: (
    tab: MainTab,
    opts?: {
      learnModule?: LearnModule;
      practiceMode?: PracticeMode;
      buildMode?: BuildMode;
      pythonLessonId?: string;
      computerTopicId?: string;
      challengeId?: string;
    }
  ) => void;
  onOpenAchievements: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  lang,
  progress,
  onNavigate,
  onOpenAchievements,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const t = UI_TEXT[lang];
  const level = Math.floor(progress.xp / 100) + 1;

  const totalComputer = COMPUTER_TOPICS.length; // 12 core units
  const totalWindows = 9; // 6 windows/safety + 3 excel templates
  const totalPython = PYTHON_LESSONS.length; // 120 lessons
  const totalPractice = 20; // 12 challenges + 8 bugs
  const totalChecklist = 5;

  const computerPct = Math.min(100, Math.round((progress.completedComputerIds.length / totalComputer) * 100));
  const windowsPct = Math.min(100, Math.round((progress.completedWindowsIds.length / totalWindows) * 100));
  const pythonPct = Math.min(100, Math.round((progress.completedPythonIds.length / totalPython) * 100));
  const practicePct = Math.min(
    100,
    Math.round(((progress.solvedChallengeIds.length + progress.solvedBugIds.length) / totalPractice) * 100)
  );
  const projectPct = Math.min(100, Math.round((progress.completedChecklistIds.length / totalChecklist) * 100));

  const overallMasteryPct = Math.round((computerPct + windowsPct + pythonPct + practicePct + projectPct) / 5);

  const earnedBadges = new Set<string>(getEarnedBadgeIds(progress));

  // Compute Dynamic Today's Goal directly from user's real progress
  const nextComputerTopic = COMPUTER_TOPICS.find((c) => !progress.completedComputerIds.includes(c.id));
  const nextPythonLesson =
    PYTHON_LESSONS.find((l) => !progress.completedPythonIds.includes(l.id)) || PYTHON_LESSONS[0];
  const nextChallenge =
    CODING_CHALLENGES.find((ch) => !progress.solvedChallengeIds.includes(ch.id)) || CODING_CHALLENGES[0];

  const dynamicGoalSummary = nextComputerTopic
    ? lang === 'en'
      ? `Finish "${nextComputerTopic.title.en}" or Lesson ${nextPythonLesson.number} (${nextPythonLesson.title.en}), and solve "${nextChallenge.title.en}".`
      : `"${nextComputerTopic.title.hi}" ya Python Lesson ${nextPythonLesson.number} (${nextPythonLesson.title.hi}) poora karein, aur "${nextChallenge.title.hi}" solve karein.`
    : lang === 'en'
    ? `Complete Python Lesson ${nextPythonLesson.number}: "${nextPythonLesson.title.en}" and solve "${nextChallenge.title.en}".`
    : `Python Lesson ${nextPythonLesson.number}: "${nextPythonLesson.title.hi}" complete karein aur "${nextChallenge.title.hi}" solve karein.`;

  const ringRadius = 46;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (overallMasteryPct / 100) * ringCirc;

  return (
    <div className="space-y-6">
      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-5">
          <div className="space-y-3.5">
            <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
              {t.openSourceNotice}
            </p>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 headline-balance">
              {t.welcomeGreeting}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Dynamic Today's Goal Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                  {t.todaysGoalLabel}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Lesson #{nextPythonLesson.number} · +{nextChallenge.xp} XP
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                {dynamicGoalSummary}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onNavigate('learn', {
                  learnModule: 'python',
                  pythonLessonId: nextPythonLesson.id,
                })
              }
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              {lang === 'en' ? `Resume Lesson ${nextPythonLesson.number}` : `Lesson ${nextPythonLesson.number} Shuru Karein`}
            </button>
            <button
              type="button"
              onClick={() =>
                onNavigate('practice', {
                  practiceMode: 'challenges',
                  challengeId: nextChallenge.id,
                })
              }
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              {t.solveTodaysChallenge}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[210px] lg:min-h-full bg-slate-100 dark:bg-slate-800">
          <img
            src="/src/assets/images/genz_tech_setup_1795345006836.jpg"
            alt="Aesthetic Gen-Z developer desk with a dark-mode Python laptop, teal-and-amber custom mechanical keyboard, wireless headphones, prism lamp, and iced coffee"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs font-medium text-slate-200">
              {lang === 'en'
                ? 'Zero to Advanced Python · Hinglish & English · Offline Sandbox'
                : 'Zero se Advanced Python · Hinglish & English · Offline Sandbox'}
            </p>
          </div>
        </div>
      </section>

      {/* 4-Column Compact KPI Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            <span>{t.dailyStreak}</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
            {progress.streakDays} <span className="text-sm font-medium text-slate-500">{t.daysLabel}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            <span>{t.xpLabel}</span>
            <Trophy className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
            {progress.xp} <span className="text-sm font-medium text-slate-500">· {t.levelLabel} {level}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            <span>{t.offlineReady}</span>
            <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
            {progress.downloadedLessonIds.length}{' '}
            <span className="text-sm font-medium text-slate-500">{lang === 'en' ? 'lessons' : 'lessons'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAchievements}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            <span>{t.badgesEarned}</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
              {earnedBadges.size} <span className="text-sm font-medium text-slate-500">/ {BADGES.length}</span>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
              {lang === 'en' ? 'View Rank ->' : 'Rank Dekhein ->'}
            </span>
          </div>
        </button>
      </section>

      {/* Quick Actions + Unified Overall Mastery Ring */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {t.quickActions}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onNavigate('learn', { learnModule: 'computer' })}
              className="min-h-[52px] px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                {t.startComputerBasics}
              </span>
              <span className="text-xs text-slate-500 shrink-0">28</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('learn', { learnModule: 'python', pythonLessonId: nextPythonLesson.id })}
              className="min-h-[52px] px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                <Code2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                {t.continuePython}
              </span>
              <span className="text-xs text-slate-500 shrink-0">120</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('practice', { practiceMode: 'dsa-viz' })}
              className="min-h-[52px] px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                <Terminal className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                {lang === 'en' ? 'DSA & Memory Visualizer' : 'DSA Visualizer'}
              </span>
              <span className="text-xs text-slate-500 shrink-0">Live</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('build', { buildMode: 'news' })}
              className="min-h-[52px] px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                <Newspaper className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                {t.readTechNews}
              </span>
              <span className="text-xs text-slate-500 shrink-0">60s</span>
            </button>
          </div>
        </div>

        {/* Overall Course Mastery Ring with Expandable Breakdown */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                  <circle
                    cx="56"
                    cy="56"
                    r={ringRadius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r={ringRadius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={ringCirc}
                    strokeDashoffset={ringOffset}
                    className="text-teal-600 dark:text-teal-400 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                    {overallMasteryPct}%
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Mastery</span>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {t.yourProgress}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {lang === 'en'
                    ? `${progress.completedPythonIds.length}/${totalPython} Python lessons · ${progress.solvedChallengeIds.length + progress.solvedBugIds.length}/${totalPractice} coding & bug tasks`
                    : `${progress.completedPythonIds.length}/${totalPython} Python lessons · ${progress.solvedChallengeIds.length + progress.solvedBugIds.length}/${totalPractice} coding tasks poore`}
                </p>
                <button
                  type="button"
                  onClick={() => setShowBreakdown((s) => !s)}
                  className="min-h-[36px] text-xs font-semibold text-teal-700 dark:text-teal-400 inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {showBreakdown
                    ? lang === 'en'
                      ? 'Hide Module Breakdown'
                      : 'Details Chhupayein'
                    : lang === 'en'
                    ? 'Show Module Breakdown'
                    : 'Module Breakdown Dekhein'}
                  {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {showBreakdown && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {[
                { label: t.computerBasics, pct: computerPct, detail: `${progress.completedComputerIds.length}/${totalComputer}` },
                { label: t.windowsExcel, pct: windowsPct, detail: `${progress.completedWindowsIds.length}/${totalWindows}` },
                { label: t.pythonCourse, pct: pythonPct, detail: `${progress.completedPythonIds.length}/${totalPython}` },
                { label: t.codingPractice, pct: practicePct, detail: `${progress.solvedChallengeIds.length + progress.solvedBugIds.length}/${totalPractice}` },
                { label: t.projectsTrack, pct: projectPct, detail: `${progress.completedChecklistIds.length}/${totalChecklist}` },
              ].map((bar) => (
                <div key={bar.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{bar.label}</span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {bar.detail} · {bar.pct}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-600 dark:bg-teal-500 transition-all duration-300"
                      style={{ width: `${Math.max(4, bar.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Live Google Search Tech Headlines + AI Summaries */}
      <TechNewsFeed
        lang={lang}
        onOpenFullPulse={() => onNavigate('build', { buildMode: 'news' })}
      />
    </div>
  );
};
