import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Award,
  BookMarked,
  Briefcase,
  Check,
  CheckSquare,
  Copy,
  Download,
  ExternalLink,
  FolderGit2,
  GraduationCap,
  Newspaper,
  Play,
  RefreshCw,
  Rocket,
  Search,
  Sparkles,
  Square,
  UserCheck,
  X,
} from 'lucide-react';
import { CHEAT_SHEETS, INTERVIEW_QA } from '../data/interviewAndCheatsheets';
import {
  ALL_PROJECT_TITLES,
  CAREER_TRACKS,
  DAILY_CAREER_TIPS,
  DAILY_MICRO_CHALLENGES,
  DAILY_TECH_FACTS,
  JOB_READY_CHECKLIST,
  PROJECTS,
  SUCCESS_STORIES,
  TECH_NEWS,
  getDayOfYearIndex,
} from '../data/projectsNewsCareer';
import { PYTHON_LESSONS } from '../data/pythonCourse';
import { BuildMode, Language, NewsItem, UserProgress } from '../types';
import { runPythonCode } from '../utils/pythonRunner';
import { CodeEditorWithToolbar } from './CodeEditorWithToolbar';

interface BuildAndGrowProps {
  lang: Language;
  mode: BuildMode;
  onChangeMode: (mode: BuildMode) => void;
  progress: UserProgress;
  onToggleChecklist: (id: string) => void;
  onBonusXp?: (xp: number) => void;
}

const NEWS_CATEGORIES = [
  'All',
  'Telecom & Satellite',
  'Gaming & Gadgets',
  'AI & Automation',
  'Big Tech & Startups',
  'Cybersecurity',
  'ISRO & Space',
] as const;

const QA_CATEGORIES = [
  'All',
  'Python Basics',
  'OOP & DSA',
  'Excel & Computer',
  'Projects & HR',
] as const;

const SHEET_CATEGORIES = ['All', 'Python', 'Excel', 'Git'] as const;

export const BuildAndGrow: React.FC<BuildAndGrowProps> = ({
  lang,
  mode,
  onChangeMode,
  progress,
  onToggleChecklist,
  onBonusXp,
}) => {
  const [selectedProjId, setSelectedProjId] = useState(PROJECTS[0].id);
  const [projCodeMap, setProjCodeMap] = useState<Record<string, string>>({});
  const [projOutput, setProjOutput] = useState<string | null>(null);
  const [newsCategory, setNewsCategory] = useState<string>('All');
  const [newsItems, setNewsItems] = useState<NewsItem[]>(TECH_NEWS);
  const [newsDateLabel, setNewsDateLabel] = useState<string>(() =>
    new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date())
  );
  const [newsIsLive, setNewsIsLive] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);

  const loadDailyNews = useCallback(async (forceRefresh = false) => {
    setNewsLoading(true);
    try {
      const todayKey = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
      const res = await fetch(`/api/tech-news?date=${todayKey}${forceRefresh ? '&refresh=1' : ''}`);
      if (res.ok) {
        const data = (await res.json()) as {
          displayDate?: string;
          isLive?: boolean;
          items?: NewsItem[];
        };
        if (Array.isArray(data.items) && data.items.length > 0) {
          setNewsItems(data.items);
          setNewsIsLive(Boolean(data.isLive));
        }
        if (data.displayDate) {
          setNewsDateLabel(data.displayDate);
        }
      }
    } catch {
      // Offline fallback remains active seamlessly
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === 'news') {
      loadDailyNews(false);
    }
  }, [mode, loadDailyNews]);

  // Skill Card PNG Generator state
  const [showSkillCardModal, setShowSkillCardModal] = useState(false);
  const [cardLearnerName, setCardLearnerName] = useState(progress.displayName || 'Future Tech Pro');
  const [shareCopied, setShareCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Daily 60-Second Micro-Challenge & Tech Fact state
  const dayIndex = getDayOfYearIndex();
  const [factOffset, setFactOffset] = useState(0);
  const dailyFact = DAILY_TECH_FACTS[(dayIndex + factOffset) % DAILY_TECH_FACTS.length];
  const dailyTip = DAILY_CAREER_TIPS[dayIndex % DAILY_CAREER_TIPS.length];
  const dailyMicro = DAILY_MICRO_CHALLENGES[dayIndex % DAILY_MICRO_CHALLENGES.length];
  const istTodayKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const todayStorageKey = `techstart_daily_micro_${istTodayKey}`;

  const [microCode, setMicroCode] = useState(dailyMicro.starterCode);
  const [microResult, setMicroResult] = useState<{ passed: boolean; output: string } | null>(null);
  const [microClaimed, setMicroClaimed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(todayStorageKey) === '1';
    } catch {
      return false;
    }
  });

  // Cheat Sheets & Interview Q&A state
  const [sheetCategory, setSheetCategory] = useState<string>('All');
  const [copiedSheetId, setCopiedSheetId] = useState<string | null>(null);
  const [qaCategory, setQaCategory] = useState<string>('All');
  const [qaSearch, setQaSearch] = useState('');
  const [revealedQaIds, setRevealedQaIds] = useState<Record<string, boolean>>({});
  const [deckIndex, setDeckIndex] = useState(0);
  const [deckFlipped, setDeckFlipped] = useState(false);

  const activeProject = PROJECTS.find((p) => p.id === selectedProjId) || PROJECTS[0];
  const activeProjCode = projCodeMap[activeProject.id] ?? activeProject.starterCode;

  const handleRunProjectCode = () => {
    const res = runPythonCode(activeProjCode);
    setProjOutput(
      res.error
        ? `${res.error.type}: ${lang === 'en' ? res.error.friendlyEn : res.error.friendlyHi}`
        : res.stdout || '(No printed output)'
    );
  };

  const handleRunDailyMicro = () => {
    const res = runPythonCode(microCode);
    if (res.error) {
      setMicroResult({
        passed: false,
        output: `${res.error.type}: ${lang === 'en' ? res.error.friendlyEn : res.error.friendlyHi}`,
      });
      return;
    }
    const normalizedActual = res.stdout.trim();
    const passed = normalizedActual === dailyMicro.expectedOutput.trim();
    setMicroResult({ passed, output: normalizedActual || '(empty)' });
    if (passed && !microClaimed) {
      setMicroClaimed(true);
      try {
        localStorage.setItem(todayStorageKey, '1');
      } catch {
        // Ignore storage error
      }
      onBonusXp?.(15);
    }
  };

  // Draw Verified Skill Card onto HTML5 <canvas> whenever modal opens or name/project changes
  useEffect(() => {
    if (!showSkillCardModal || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1200;
    const h = 630;

    // Background gradient (deep slate -> deep teal)
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.6, '#0f292e');
    grad.addColorStop(1, '#115e59');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle geometric border frame
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, w - 56, h - 56);

    // Header brand + badge label
    ctx.fillStyle = '#2dd4bf';
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.fillText('TECHSTART INDIA · VERIFIED SKILL CARD', 68, 92);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    ctx.fillText(`MIT OPEN SOURCE · ${new Date().toISOString().slice(0, 10)}`, 68, 126);

    // Learner Name
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px Inter, system-ui, sans-serif';
    ctx.fillText('AWARDED TO', 68, 200);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px Inter, system-ui, sans-serif';
    ctx.fillText((cardLearnerName || 'Future Tech Pro').slice(0, 28), 68, 260);

    // Project Completed
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    ctx.fillText('BUILT HANDS-ON PYTHON PROTOTYPE', 68, 330);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 34px Inter, system-ui, sans-serif';
    ctx.fillText(activeProject.title.en.slice(0, 48), 68, 376);

    ctx.fillStyle = '#99f6e4';
    ctx.font = '20px monospace';
    ctx.fillText(`Skills: ${activeProject.topicsUsed.join(' · ')}`, 68, 418);

    // Divider
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(68, 466);
    ctx.lineTo(w - 68, 466);
    ctx.stroke();

    // Stats Row
    const stats = [
      { label: 'TOTAL XP', value: `${progress.xp} XP` },
      { label: 'PYTHON LESSONS', value: `${progress.completedPythonIds.length} / ${PYTHON_LESSONS.length}` },
      { label: 'CHALLENGES SOLVED', value: `${progress.solvedChallengeIds.length + progress.solvedBugIds.length}` },
      { label: 'DAILY STREAK', value: `${progress.streakDays} Days` },
    ];
    stats.forEach((st, idx) => {
      const x = 68 + idx * 270;
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.fillText(st.label, x, 514);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px monospace';
      ctx.fillText(st.value, x, 554);
    });
  }, [showSkillCardModal, cardLearnerName, activeProject, progress]);

  const handleDownloadSkillCard = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `techstart-${activeProject.id}-skill-card.png`;
    a.click();
  };

  const handleCopyShareText = () => {
    const msg = `I just built "${activeProject.title.en}" on TechStart India (Free & Open-Source Zero-to-Advanced Python & Computer Skills)! Skills: ${activeProject.topicsUsed.join(', ')} · Current XP: ${progress.xp}. #TechStartIndia #Python #LearnToCode`;
    navigator.clipboard?.writeText(msg);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleCopySheet = (sheetId: string) => {
    const sheet = CHEAT_SHEETS.find((s) => s.id === sheetId);
    if (!sheet) return;
    const text = `${sheet.title}\n${'='.repeat(sheet.title.length)}\n` +
      sheet.entries.map((e) => `${e.syntax}  -->  ${e.meaning[lang]}`).join('\n');
    navigator.clipboard?.writeText(text);
    setCopiedSheetId(sheetId);
    setTimeout(() => setCopiedSheetId(null), 1800);
  };

  const handleDownloadSheet = (sheetId: string) => {
    const sheet = CHEAT_SHEETS.find((s) => s.id === sheetId);
    if (!sheet) return;
    const text = `${sheet.title}\n${'='.repeat(sheet.title.length)}\n` +
      sheet.entries.map((e) => `${e.syntax}\n  ${e.meaning.en} | ${e.meaning.hi}\n`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sheet.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredQa = INTERVIEW_QA.filter((item) => {
    const catOk = qaCategory === 'All' || item.category === qaCategory;
    const q = qaSearch.trim().toLowerCase();
    const searchOk =
      !q ||
      item.question.en.toLowerCase().includes(q) ||
      item.question.hi.toLowerCase().includes(q) ||
      item.answer.en.toLowerCase().includes(q) ||
      item.answer.hi.toLowerCase().includes(q);
    return catOk && searchOk;
  });

  const safeDeckIdx = filteredQa.length > 0 ? Math.min(deckIndex, filteredQa.length - 1) : 0;
  const deckCard = filteredQa[safeDeckIdx];

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        {[
          {
            id: 'projects' as BuildMode,
            label: lang === 'en' ? 'Real-World Projects (22)' : 'Real Projects (22)',
            icon: FolderGit2,
          },
          {
            id: 'news' as BuildMode,
            label: lang === 'en' ? 'Daily Tech Pulse' : 'Daily Tech Pulse',
            icon: Newspaper,
          },
          {
            id: 'career' as BuildMode,
            label: lang === 'en' ? 'Career Roadmap' : 'Career Roadmap',
            icon: Briefcase,
          },
          {
            id: 'interview' as BuildMode,
            label: lang === 'en' ? 'Cheat Sheets & 50 Q&A' : 'Cheat Sheets & 50 Q&A',
            icon: GraduationCap,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeMode(item.id)}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === item.id
                  ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* MODULE 6: REAL-WORLD PROJECTS + LIVE RUNNER + SKILL CARD */}
      {mode === 'projects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
                {lang === 'en' ? 'Interactive Project Guides' : 'Step-by-Step Project Guides'}
              </h2>
              <div className="space-y-1">
                {PROJECTS.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => {
                      setSelectedProjId(proj.id);
                      setProjOutput(null);
                    }}
                    className={`w-full min-h-[48px] px-3 py-2 rounded-xl text-left cursor-pointer ${
                      proj.id === activeProject.id
                        ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">{proj.title[lang]}</div>
                    <div className="text-[11px] text-slate-500">
                      {proj.level} · {proj.duration}
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <article className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {activeProject.level} · {activeProject.duration} · {activeProject.topicsUsed.join(' / ')}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                    {activeProject.title[lang]}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{activeProject.goal[lang]}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSkillCardModal(true)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  {lang === 'en' ? 'Verified Skill Card (PNG)' : 'Skill Card PNG Banayein'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <h3 className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                    {lang === 'en' ? 'Step-by-Step Build Plan' : 'Step-by-Step Build Plan'}
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    {activeProject.stepByStepPlan.map((step, i) => (
                      <li key={i}>{step[lang]}</li>
                    ))}
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {lang === 'en' ? 'Common Bugs & Improvements' : 'Common Bugs aur Improvements'}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    {activeProject.commonBugs.map((b, i) => (
                      <li key={i}>{b[lang]}</li>
                    ))}
                    {activeProject.improvementIdeas.map((imp, i) => (
                      <li key={`imp-${i}`} className="text-teal-700 dark:text-teal-300">
                        Idea: {imp[lang]}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Editable Starter Working Prototype */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {lang === 'en'
                      ? 'Editable Working Prototype — customize numbers & run!'
                      : 'Editable Working Prototype — apna data badal kar run karein!'}
                  </span>
                  <button
                    type="button"
                    onClick={handleRunProjectCode}
                    className="min-h-[40px] px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Run Prototype' : 'Prototype Run Karein'}
                  </button>
                </div>

                <CodeEditorWithToolbar
                  value={activeProjCode}
                  onChange={(next) =>
                    setProjCodeMap((prev) => ({
                      ...prev,
                      [activeProject.id]: next,
                    }))
                  }
                  onReset={() => {
                    setProjCodeMap((prev) => {
                      const copy = { ...prev };
                      delete copy[activeProject.id];
                      return copy;
                    });
                    setProjOutput(null);
                  }}
                  resetLabel={lang === 'en' ? 'Reset' : 'Reset'}
                  rows={10}
                  lang={lang}
                  filename={`${activeProject.id}.py`}
                  ariaLabel="Project starter code editor"
                />

                {projOutput !== null && (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                    {projOutput}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-1">
                <div>
                  <strong>GitHub Upload Guide:</strong> {activeProject.githubGuide[lang]}
                </div>
                <div>
                  <strong>Code Explanation:</strong> {activeProject.codeExplanation[lang]}
                </div>
              </div>
            </article>
          </div>

          {/* Complete 22 Project Catalog */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-3">
                {lang === 'en' ? 'Beginner Project Track (10 Projects)' : 'Beginner Project Track (10 Projects)'}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {ALL_PROJECT_TITLES.beginner.map((name, i) => (
                  <li key={name} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    {i + 1}. {name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-3">
                {lang === 'en' ? 'Intermediate Project Track (12 Projects)' : 'Intermediate Project Track (12 Projects)'}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {ALL_PROJECT_TITLES.intermediate.map((name, i) => (
                  <li key={name} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    {i + 1}. {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 7: DYNAMIC DAILY TECH PULSE + 60-SEC MICRO-CHALLENGE */}
      {mode === 'news' && (
        <div className="space-y-6">
          {/* Date-Rotated Daily Fact + Tip + Playable 60-Second Micro-Challenge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {lang === 'en' ? "Today's Tech Fact" : 'Aaj ka Tech Fact'}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      #{((dayIndex + factOffset) % DAILY_TECH_FACTS.length) + 1}/{DAILY_TECH_FACTS.length}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{dailyFact[lang]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFactOffset((n) => n + 1)}
                  className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline self-start cursor-pointer"
                >
                  {lang === 'en' ? 'Next Tech Fact ->' : 'Agla Tech Fact ->'}
                </button>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {lang === 'en' ? "Today's Career Tip" : 'Aaj ki Career Tip'}
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{dailyTip[lang]}</p>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5" />
                  {dailyMicro.title[lang]}
                </div>
                {microClaimed && (
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {lang === 'en' ? '+15 Daily XP Claimed' : '+15 Daily XP Mil Chuka Hai'}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">{dailyMicro.prompt[lang]}</p>

              <CodeEditorWithToolbar
                value={microCode}
                onChange={setMicroCode}
                onReset={() => {
                  setMicroCode(dailyMicro.starterCode);
                  setMicroResult(null);
                }}
                rows={4}
                lang={lang}
                filename="daily_pulse.py"
                ariaLabel="60-second daily challenge editor"
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleRunDailyMicro}
                  className="min-h-[40px] px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  {microClaimed
                    ? lang === 'en'
                      ? 'Run & Verify'
                      : 'Run & Check'
                    : lang === 'en'
                    ? 'Run & Claim +15 XP'
                    : 'Run & +15 XP Payein'}
                </button>
                {microResult && (
                  <span
                    className={`text-xs font-semibold ${
                      microResult.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {microResult.passed
                      ? `${lang === 'en' ? 'Solved! Output:' : 'Sahi jawab! Output:'} ${microResult.output}`
                      : `${lang === 'en' ? 'Output:' : 'Output:'} ${microResult.output} (Expected: ${dailyMicro.expectedOutput})`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* News Filter & Live Daily Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {lang === 'en' ? `Today’s Tech Headlines · ${newsDateLabel}` : `Aaj ki Tech News · ${newsDateLabel}`}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {newsIsLive
                    ? lang === 'en'
                      ? 'Auto-updated live from global & Indian tech feeds based on today’s date'
                      : 'Aaj ki date ke hisab se global aur Indian tech feeds se auto-updated'
                    : lang === 'en'
                    ? 'Daily India & World Tech Wire (auto-rotates by today’s date even offline)'
                    : 'Daily India & World Tech Wire (offline mein bhi aaj ki date ke hisab se updated)'}
                </p>
              </div>
              <button
                type="button"
                disabled={newsLoading}
                onClick={() => loadDailyNews(true)}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${newsLoading ? 'animate-spin' : ''}`} />
                {newsLoading
                  ? lang === 'en'
                    ? 'Updating...'
                    : 'Update ho raha hai...'
                  : lang === 'en'
                  ? 'Refresh Today’s News'
                  : 'Aaj ki News Refresh Karein'}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {NEWS_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setNewsCategory(cat)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    newsCategory === cat
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {(() => {
              const filteredNews = newsItems.filter(
                (n) => newsCategory === 'All' || n.category === newsCategory
              );
              if (filteredNews.length === 0) {
                return (
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300">
                    {lang === 'en'
                      ? 'No headlines in this category right now. Tap "All" or "Refresh Today’s News".'
                      : 'Is category mein abhi koi headline nahi hai. "All" par click karein.'}
                  </div>
                );
              }
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNews.map((item) => (
                    <article
                      key={item.id}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2.5">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {item.category} · {item.date} · {item.readTime}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">
                          {item.title[lang]}
                        </h3>
                        <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-xs font-mono font-semibold text-teal-700 dark:text-teal-300">
                          {item.highlightStat}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.summary[lang]}
                        </p>
                        {item.companySummary && (
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                            <strong className="text-teal-700 dark:text-teal-400">
                              {lang === 'en' ? 'Company & Context: ' : 'Company / Topic Samjhein: '}
                            </strong>
                            {item.companySummary[lang]}
                          </div>
                        )}
                        <p className="text-xs text-slate-700 dark:text-slate-200 pt-1">
                          <strong className="text-amber-700 dark:text-amber-400">
                            {lang === 'en' ? 'Why it matters: ' : 'Ye kyun zaroori hai: '}
                          </strong>
                          {item.whyItMatters[lang]}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">{item.sourceName}</span>
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 dark:text-teal-400 font-semibold inline-flex items-center gap-1 hover:underline"
                        >
                          {lang === 'en' ? 'Read more' : 'Poora padhein'}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Indian Self-Taught Developer Stories */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {lang === 'en' ? 'Indian Self-Taught Tech Journeys' : 'Indian Self-Taught Tech Journeys'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUCCESS_STORIES.map((st) => (
                <div
                  key={st.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      {st.name}
                    </div>
                    <span className="text-xs text-slate-500">
                      {st.city} · {st.role}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{st.background[lang]}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{st.journey[lang]}</p>
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 pt-1">
                    “{st.advice[lang]}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 8: CAREER ROADMAP */}
      {mode === 'career' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CAREER_TRACKS.map((track) => (
              <div
                key={track.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <div className="space-y-1">
                  <div className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                    {track.timelineMonths} · {track.entryRoles.join(' / ')}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{track.title[lang]}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Skills: {track.coreSkills.join(' · ')}
                  </div>
                </div>

                <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                  {track.firstSteps.map((s, idx) => (
                    <li key={idx}>{s[lang]}</li>
                  ))}
                </ol>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                  <strong>{lang === 'en' ? 'Free Certifications:' : 'Free Certifications:'}</strong>{' '}
                  {track.freeCerts.join(' · ')}
                </div>
              </div>
            ))}
          </div>

          {/* Job-Ready Interactive Checklist */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50">
                {lang === 'en' ? 'Job-Ready Resume, GitHub & Portfolio Checklist' : 'Job-Ready Resume & GitHub Checklist'}
              </h3>
              <span className="text-xs font-mono tabular-nums text-teal-600 dark:text-teal-400">
                {progress.completedChecklistIds.length}/{JOB_READY_CHECKLIST.length}
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {JOB_READY_CHECKLIST.map((item) => {
                const checked = progress.completedChecklistIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleChecklist(item.id)}
                    className="w-full min-h-[48px] py-3 flex items-center gap-3 text-left cursor-pointer"
                  >
                    {checked ? (
                      <CheckSquare className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        checked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {item.text[lang]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 9: CHEAT SHEETS & TOP 50 INTERVIEW Q&A FLASHCARDS */}
      {mode === 'interview' && (
        <div className="space-y-8">
          {/* Section A: Downloadable Cheat Sheets */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  {lang === 'en' ? 'Quick Revision Cheat Sheets' : 'Quick Revision Cheat Sheets'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {lang === 'en'
                    ? 'Copy or download one-page summaries for Python, OOP/DSA, Excel, and Git.'
                    : 'Interview se pehle Python, OOP/DSA, Excel aur Git ki quick sheet revise ya download karein.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SHEET_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSheetCategory(cat)}
                    className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                      sheetCategory === cat
                        ? 'bg-teal-600 text-white'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHEAT_SHEETS.filter((s) => sheetCategory === 'All' || s.category === sheetCategory).map((sheet) => (
                <div
                  key={sheet.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                        {sheet.category}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">{sheet.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopySheet(sheet.id)}
                        className="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSheetId === sheet.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSheetId === sheet.id ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSheet(sheet.id)}
                        className="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        .txt
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {sheet.entries.map((entry, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                        <pre className="text-xs font-mono text-teal-800 dark:text-teal-300 whitespace-pre-wrap">
                          {entry.syntax}
                        </pre>
                        <div className="text-xs text-slate-600 dark:text-slate-300">{entry.meaning[lang]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section B: Top 50 Interview Q&A Flashcards */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {lang === 'en'
                    ? `Top ${INTERVIEW_QA.length} Entry-Level IT Interview Q&A`
                    : `Top ${INTERVIEW_QA.length} Fresher IT Interview Q&A Flashcards`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {lang === 'en'
                    ? 'Quiz yourself with the focus deck first, then browse or search all 50 cards below.'
                    : 'Pehle Focus Deck par khud ko test karein, ya neeche kisi bhi card ko tap kar ke answer dekhein.'}
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={qaSearch}
                  onChange={(e) => {
                    setQaSearch(e.target.value);
                    setDeckIndex(0);
                    setDeckFlipped(false);
                  }}
                  placeholder={lang === 'en' ? 'Search Python, OOP, Excel...' : 'Search Python, OOP, Excel...'}
                  className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {QA_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setQaCategory(cat);
                    setDeckIndex(0);
                    setDeckFlipped(false);
                  }}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    qaCategory === cat
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Interactive Flashcard Focus Deck */}
            {deckCard && (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-slate-100 border border-teal-500/40 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-teal-400">
                    {deckCard.category} · Focus Flashcard
                  </span>
                  <span className="font-mono tabular-nums">
                    {safeDeckIdx + 1} / {filteredQa.length}
                  </span>
                </div>

                <h3 className="text-base sm:text-xl font-bold text-white leading-snug">
                  {deckCard.question[lang]}
                </h3>

                {deckFlipped && (
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
                    <p className="text-sm text-slate-100 leading-relaxed">{deckCard.answer[lang]}</p>
                    {deckCard.codeSnippet && (
                      <pre className="p-3 rounded-lg bg-slate-950 text-xs font-mono text-teal-300 overflow-x-auto">
                        <code>{deckCard.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDeckFlipped((f) => !f)}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
                  >
                    {deckFlipped
                      ? lang === 'en'
                        ? 'Hide Answer'
                        : 'Answer Chhupayein'
                      : lang === 'en'
                      ? 'Reveal Answer'
                      : 'Answer Dekhein'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safeDeckIdx === 0}
                      onClick={() => {
                        setDeckIndex((i) => Math.max(0, i - 1));
                        setDeckFlipped(false);
                      }}
                      className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold cursor-pointer"
                    >
                      {lang === 'en' ? 'Prev Card' : 'Pichhla'}
                    </button>
                    <button
                      type="button"
                      disabled={safeDeckIdx >= filteredQa.length - 1}
                      onClick={() => {
                        setDeckIndex((i) => Math.min(filteredQa.length - 1, i + 1));
                        setDeckFlipped(false);
                      }}
                      className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold cursor-pointer"
                    >
                      {lang === 'en' ? 'Next Card' : 'Agla'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Complete Filterable List of All Matching Q&A Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredQa.map((qa, idx) => {
                const isOpen = !!revealedQaIds[qa.id];
                return (
                  <div
                    key={qa.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>
                        #{idx + 1} · {qa.category}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedQaIds((prev) => ({
                            ...prev,
                            [qa.id]: !prev[qa.id],
                          }))
                        }
                        className="text-teal-700 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
                      >
                        {isOpen
                          ? lang === 'en'
                            ? 'Hide Answer'
                            : 'Chhupayein'
                          : lang === 'en'
                          ? 'Show Answer'
                          : 'Answer Dekhein'}
                      </button>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {qa.question[lang]}
                    </h4>
                    {isOpen && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {qa.answer[lang]}
                        </p>
                        {qa.codeSnippet && (
                          <pre className="p-2.5 rounded-lg bg-slate-950 text-xs font-mono text-teal-300 overflow-x-auto">
                            <code>{qa.codeSnippet}</code>
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* VERIFIED SKILL CARD PNG GENERATOR MODAL */}
      {showSkillCardModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-card-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-2xl w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="skill-card-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {lang === 'en' ? 'Verified Skill & Project Card' : 'Verified Skill & Project Card'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'en'
                    ? 'Download your proof-of-work PNG card for LinkedIn, WhatsApp, or resumes.'
                    : 'Apne project ka PNG certificate card download karein aur LinkedIn ya resume par lagayein.'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowSkillCardModal(false)}
                className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'en' ? 'Your Name on Card' : 'Card par Aapka Naam'}
              </label>
              <input
                type="text"
                value={cardLearnerName}
                onChange={(e) => setCardLearnerName(e.target.value)}
                maxLength={32}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950">
              <canvas ref={canvasRef} width={1200} height={630} className="w-full h-auto block" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadSkillCard}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {lang === 'en' ? 'Download PNG Card' : 'PNG Card Download Karein'}
              </button>
              <button
                type="button"
                onClick={handleCopyShareText}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                {shareCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {shareCopied
                  ? lang === 'en'
                    ? 'LinkedIn Text Copied!'
                    : 'Share Text Copy Ho Gaya!'
                  : lang === 'en'
                  ? 'Copy LinkedIn / WhatsApp Text'
                  : 'LinkedIn / WhatsApp Text Copy Karein'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
