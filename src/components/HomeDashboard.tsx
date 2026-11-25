import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Code2,
  Download,
  Flame,
  Globe,
  Newspaper,
  Play,
  Server,
  Terminal,
  Trophy,
} from 'lucide-react';
import { CODING_CHALLENGES } from '../data/challengesAndBugs';
import { COMPUTER_TOPICS } from '../data/computerBasics';
import { BADGES, getEarnedBadgeIds } from '../data/projectsNewsCareer';
import { PYTHON_DOMAIN_TRACKS } from '../data/pythonDomains';
import { PYTHON_LESSONS } from '../data/pythonCourse';
import { UI_TEXT } from '../data/translations';
import { BuildMode, Language, LearnModule, MainTab, PracticeMode, PythonDomainId, UserProgress, pickText } from '../types';
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
      pythonDomainId?: PythonDomainId;
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

  const tr = (en: string, hi: string, gu: string) => (lang === 'gu' ? gu : lang === 'hi' ? hi : en);

  const dynamicGoalSummary = nextComputerTopic
    ? tr(
        `Finish "${pickText(nextComputerTopic.title, lang)}" or Lesson ${nextPythonLesson.number} (${pickText(nextPythonLesson.title, lang)}), and solve "${pickText(nextChallenge.title, lang)}".`,
        `"${pickText(nextComputerTopic.title, lang)}" ya Python Lesson ${nextPythonLesson.number} (${pickText(nextPythonLesson.title, lang)}) poora karein, aur "${pickText(nextChallenge.title, lang)}" solve karein.`,
        `"${pickText(nextComputerTopic.title, lang)}" અથવા Python પાઠ ${nextPythonLesson.number} (${pickText(nextPythonLesson.title, lang)}) પૂર્ણ કરો, અને "${pickText(nextChallenge.title, lang)}" ઉકેલો.`
      )
    : tr(
        `Complete Python Lesson ${nextPythonLesson.number}: "${pickText(nextPythonLesson.title, lang)}" and solve "${pickText(nextChallenge.title, lang)}".`,
        `Python Lesson ${nextPythonLesson.number}: "${pickText(nextPythonLesson.title, lang)}" complete karein aur "${pickText(nextChallenge.title, lang)}" solve karein.`,
        `Python પાઠ ${nextPythonLesson.number}: "${pickText(nextPythonLesson.title, lang)}" પૂર્ણ કરો અને "${pickText(nextChallenge.title, lang)}" ઉકેલો.`
      );

  const ringRadius = 46;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (overallMasteryPct / 100) * ringCirc;

  return (
    <div className="space-y-6">
      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] rounded-xl overflow-hidden">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-5">
          <div className="space-y-3.5">
            <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-emerald-700 dark:text-[#00F59B]">
              {t.openSourceNotice}
            </p>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white headline-balance">
              {t.welcomeGreeting}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#98A39D] max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Dynamic Today's Goal Card */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-700 dark:text-[#00F59B]">
                  {t.todaysGoalLabel}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A968F] tabular-nums">
                  {tr(`LESSON #${nextPythonLesson.number}`, `LESSON #${nextPythonLesson.number}`, `પાઠ #${nextPythonLesson.number}`)} // +{nextChallenge.xp} XP
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-[#E6ECE8] leading-snug">
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
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs sm:text-sm font-mono font-bold tracking-wide inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              {tr(
                `Resume Lesson ${nextPythonLesson.number}`,
                `Lesson ${nextPythonLesson.number} Shuru Karein`,
                `પાઠ ${nextPythonLesson.number} ચાલુ કરો`
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                onNavigate('practice', {
                  practiceMode: 'challenges',
                  challengeId: nextChallenge.id,
                })
              }
              className="min-h-[44px] px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#171C19] dark:hover:bg-[#1E2521] border border-slate-200 dark:border-[#2A332E] text-slate-900 dark:text-[#E6ECE8] text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-emerald-700 dark:text-[#00F59B]" />
              {t.solveTodaysChallenge}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[210px] lg:min-h-full bg-slate-100 dark:bg-[#090C0B] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-[#222925]">
          <img
            src="/src/assets/images/genz_tech_setup_1795345006836.jpg"
            alt="Aesthetic Gen-Z developer desk with a dark-mode Python laptop, teal-and-amber custom mechanical keyboard, wireless headphones, prism lamp, and iced coffee"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090C0B]/90 via-[#090C0B]/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-[11px] font-mono text-[#00F59B] tracking-wide">
              {tr(
                'PYTHON_CORE · EN / HI / GU · OFFLINE_SANDBOX',
                'PYTHON_CORE · EN / HI / GU · OFFLINE_SANDBOX',
                'PYTHON_CORE · EN / HI / GU · ઓફલાઇન સેન્ડબોક્સ'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 4-Column Compact KPI Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925]">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8A968F] mb-1.5">
            <span>{t.dailyStreak}</span>
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {progress.streakDays}{' '}
            <span className="text-xs font-medium text-slate-500 dark:text-[#8A968F]">{t.daysLabel}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925]">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8A968F] mb-1.5">
            <span>{t.xpLabel}</span>
            <Trophy className="w-4 h-4 text-emerald-700 dark:text-[#00F59B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-[#00F59B] tabular-nums">
            {progress.xp}{' '}
            <span className="text-xs font-medium text-slate-500 dark:text-[#8A968F]">
              · {t.levelLabel} {level}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925]">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8A968F] mb-1.5">
            <span>{t.offlineReady}</span>
            <Download className="w-4 h-4 text-emerald-700 dark:text-[#00F59B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {progress.downloadedLessonIds.length}{' '}
            <span className="text-xs font-medium text-slate-500 dark:text-[#8A968F]">
              {tr('files', 'files', 'ફાઇલ્સ')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAchievements}
          className="p-4 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] hover:border-emerald-500/60 dark:hover:border-[#00E58F]/70 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8A968F] mb-1.5">
            <span>{t.badgesEarned}</span>
            <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {earnedBadges.size}{' '}
              <span className="text-xs font-medium text-slate-500 dark:text-[#8A968F]">/ {BADGES.length}</span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-[#00F59B]">
              {tr('View Rank ->', 'Rank Dekhein ->', 'રેન્ક જુઓ ->')}
            </span>
          </div>
        </button>
      </section>

      {/* Quick Actions + Unified Overall Mastery Ring */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] rounded-xl p-5 sm:p-6 space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider font-semibold text-emerald-700 dark:text-[#00F59B]">
            {t.quickActions}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onNavigate('learn', { learnModule: 'computer' })}
              className="min-h-[52px] px-4 py-3 rounded-lg border border-slate-200 dark:border-[#222925] hover:border-emerald-500/70 dark:hover:border-[#00E58F]/70 bg-slate-50 dark:bg-[#0D100F] flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-slate-900 dark:text-[#E6ECE8]">
                <BookOpen className="w-4 h-4 text-emerald-700 dark:text-[#00F59B] shrink-0" />
                {t.startComputerBasics}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-[#8A968F] shrink-0 tabular-nums">28</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('learn', { learnModule: 'python', pythonLessonId: nextPythonLesson.id })}
              className="min-h-[52px] px-4 py-3 rounded-lg border border-slate-200 dark:border-[#222925] hover:border-emerald-500/70 dark:hover:border-[#00E58F]/70 bg-slate-50 dark:bg-[#0D100F] flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-slate-900 dark:text-[#E6ECE8]">
                <Code2 className="w-4 h-4 text-emerald-700 dark:text-[#00F59B] shrink-0" />
                {t.continuePython}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-[#8A968F] shrink-0 tabular-nums">120</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('practice', { practiceMode: 'dsa-viz' })}
              className="min-h-[52px] px-4 py-3 rounded-lg border border-slate-200 dark:border-[#222925] hover:border-emerald-500/70 dark:hover:border-[#00E58F]/70 bg-slate-50 dark:bg-[#0D100F] flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-slate-900 dark:text-[#E6ECE8]">
                <Terminal className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                {tr('DSA & Memory Visualizer', 'DSA & Memory Visualizer', 'DSA અને મેમરી વિઝ્યુલાઇઝર')}
              </span>
              <span className="text-xs font-mono text-emerald-700 dark:text-[#00F59B] shrink-0">
                {tr('LIVE', 'LIVE', 'લાઇવ')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('build', { buildMode: 'news' })}
              className="min-h-[52px] px-4 py-3 rounded-lg border border-slate-200 dark:border-[#222925] hover:border-emerald-500/70 dark:hover:border-[#00E58F]/70 bg-slate-50 dark:bg-[#0D100F] flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-slate-900 dark:text-[#E6ECE8]">
                <Newspaper className="w-4 h-4 text-emerald-700 dark:text-[#00F59B] shrink-0" />
                {t.readTechNews}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-[#8A968F] shrink-0">60s</span>
            </button>
          </div>
        </div>

        {/* Overall Course Mastery Ring with Expandable Breakdown */}
        <div className="lg:col-span-6 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] rounded-xl p-5 sm:p-6 space-y-4">
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
                    strokeWidth="9"
                    className="text-slate-100 dark:text-[#1D2420]"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r={ringRadius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={ringCirc}
                    strokeDashoffset={ringOffset}
                    className="text-emerald-600 dark:text-[#00F59B] transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {overallMasteryPct}%
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#8A968F]">
                    {tr('Mastery', 'Mastery', 'પ્રગતિ')}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                  {t.yourProgress}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#98A39D] tabular-nums">
                  {tr(
                    `${progress.completedPythonIds.length}/${totalPython} Python lessons · ${progress.solvedChallengeIds.length + progress.solvedBugIds.length}/${totalPractice} coding & bug tasks`,
                    `${progress.completedPythonIds.length}/${totalPython} Python lessons · ${progress.solvedChallengeIds.length + progress.solvedBugIds.length}/${totalPractice} coding tasks poore`,
                    `${progress.completedPythonIds.length}/${totalPython} Python પાઠ · ${progress.solvedChallengeIds.length + progress.solvedBugIds.length}/${totalPractice} કોડિંગ ટાસ્ક પૂર્ણ`
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setShowBreakdown((s) => !s)}
                  className="min-h-[36px] text-xs font-mono font-semibold text-emerald-700 dark:text-[#00F59B] inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {showBreakdown
                    ? tr('Hide Module Breakdown', 'Details Chhupayein', 'વિગતો છુપાવો')
                    : tr('Show Module Breakdown', 'Module Breakdown Dekhein', 'મોડ્યુલ મુજબ વિગત જુઓ')}
                  {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {showBreakdown && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-[#1E2420]">
              {[
                { label: t.computerBasics, pct: computerPct, detail: `${progress.completedComputerIds.length}/${totalComputer}` },
                { label: t.windowsExcel, pct: windowsPct, detail: `${progress.completedWindowsIds.length}/${totalWindows}` },
                { label: t.pythonCourse, pct: pythonPct, detail: `${progress.completedPythonIds.length}/${totalPython}` },
                { label: t.codingPractice, pct: practicePct, detail: `${progress.solvedChallengeIds.length + progress.solvedBugIds.length}/${totalPractice}` },
                { label: t.projectsTrack, pct: projectPct, detail: `${progress.completedChecklistIds.length}/${totalChecklist}` },
              ].map((bar) => (
                <div key={bar.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-[#D5DDD8]">{bar.label}</span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-[#8A968F]">
                      {bar.detail} · <span className="text-emerald-700 dark:text-[#00F59B]">{bar.pct}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#1D2420] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600 dark:bg-[#00F59B] transition-all duration-300"
                      style={{ width: `${Math.max(4, bar.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pick Your Python Career Domain & Top Libraries */}
      <section className="bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-wider font-semibold text-emerald-700 dark:text-[#00F59B]">
              {tr(
                'PYTHON LIBRARIES BY DOMAIN // PICK YOUR FIELD',
                'PYTHON LIBRARIES BY DOMAIN // APNA FIELD CHUNEIN',
                'PYTHON ડોમેન મુજબ લાઇબ્રેરી // તમારું ક્ષેત્ર પસંદ કરો'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#98A39D] mt-0.5">
              {tr(
                'Select whichever goal you want to pursue and learn its essential Python libraries hands-on.',
                'Aap jis bhi field mein jaana chahte hain use select karein aur uski top Python libraries seekhein.',
                'તમે જે ક્ષેત્રમાં જવા માંગતા હોવ તે પસંદ કરો અને તેની મુખ્ય Python લાઇબ્રેરીઓ પ્રેક્ટિકલી શીખો.'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('learn', { learnModule: 'python-domains' })}
            className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-100 hover:bg-slate-200 dark:bg-[#171C19] dark:hover:bg-[#1E2521] text-xs font-mono font-semibold text-emerald-700 dark:text-[#00F59B] cursor-pointer"
          >
            {tr('Explore All 4 Fields ->', 'Sabhi 4 Fields Dekhein ->', 'બધા 4 ક્ષેત્રો જુઓ ->')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PYTHON_DOMAIN_TRACKS.map((domain) => {
            const Icon =
              domain.id === 'data-science'
                ? BarChart3
                : domain.id === 'ml-ai'
                ? Brain
                : domain.id === 'web-apis'
                ? Server
                : Globe;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() =>
                  onNavigate('learn', {
                    learnModule: 'python-domains',
                    pythonDomainId: domain.id,
                  })
                }
                className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] hover:border-emerald-500/70 dark:hover:border-[#00F59B] text-left space-y-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-emerald-700 dark:text-[#00F59B] shrink-0" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {pickText(domain.goalTitle, lang)}
                  </span>
                </div>
                <div className="text-xs font-mono text-emerald-700 dark:text-[#00F59B]">
                  {domain.topLibrariesSummary}
                </div>
                <p className="text-xs text-slate-600 dark:text-[#8A968F] leading-snug">
                  {pickText(domain.primaryPurpose, lang)}
                </p>
              </button>
            );
          })}
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
