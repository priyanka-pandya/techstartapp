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
import { BuildMode, Language, NewsItem, UserProgress, pickText } from '../types';
import { getFriendlyPythonError, runPythonCode } from '../utils/pythonRunner';
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
  const tr = (en: string, hi: string, gu: string) => (lang === 'gu' ? gu : lang === 'hi' ? hi : en);
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
        ? `${res.error.type}: ${getFriendlyPythonError(res.error, lang)}`
        : res.stdout || tr('(No printed output)', '(Koi output print nahi hua)', '(કોઈ આઉટપુટ પ્રિન્ટ થયું નથી)')
    );
  };

  const handleRunDailyMicro = () => {
    const res = runPythonCode(microCode);
    if (res.error) {
      setMicroResult({
        passed: false,
        output: `${res.error.type}: ${getFriendlyPythonError(res.error, lang)}`,
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
      sheet.entries.map((e) => `${e.syntax}  -->  ${pickText(e.meaning, lang)}`).join('\n');
    navigator.clipboard?.writeText(text);
    setCopiedSheetId(sheetId);
    setTimeout(() => setCopiedSheetId(null), 1800);
  };

  const handleDownloadSheet = (sheetId: string) => {
    const sheet = CHEAT_SHEETS.find((s) => s.id === sheetId);
    if (!sheet) return;
    const text = `${sheet.title}\n${'='.repeat(sheet.title.length)}\n` +
      sheet.entries
        .map((e) => `${e.syntax}\n  EN: ${e.meaning.en}\n  HI: ${e.meaning.hi}${e.meaning.gu ? `\n  GU: ${e.meaning.gu}` : ''}\n`)
        .join('\n');
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
      (item.question.gu || '').toLowerCase().includes(q) ||
      item.answer.en.toLowerCase().includes(q) ||
      item.answer.hi.toLowerCase().includes(q) ||
      (item.answer.gu || '').toLowerCase().includes(q);
    return catOk && searchOk;
  });

  const safeDeckIdx = filteredQa.length > 0 ? Math.min(deckIndex, filteredQa.length - 1) : 0;
  const deckCard = filteredQa[safeDeckIdx];

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#121614] border border-slate-200 dark:border-[#222925] max-w-full overflow-x-auto">
        {[
          {
            id: 'projects' as BuildMode,
            label: tr('Real Projects (22)', 'Real Projects (22)', 'રિયલ પ્રોજેક્ટ્સ (22)'),
            icon: FolderGit2,
          },
          {
            id: 'news' as BuildMode,
            label: tr('Daily Tech Pulse', 'Daily Tech Pulse', 'દૈનિક ટેક પલ્સ'),
            icon: Newspaper,
          },
          {
            id: 'career' as BuildMode,
            label: tr('Career Roadmap', 'Career Roadmap', 'કરિયર રોડમેપ'),
            icon: Briefcase,
          },
          {
            id: 'cheatsheets' as BuildMode,
            label: tr('Cheat Sheets', 'Cheat Sheets', 'ચીટ શીટ્સ'),
            icon: BookMarked,
          },
          {
            id: 'qa' as BuildMode,
            label: '50 Q&A',
            icon: GraduationCap,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeMode(item.id)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === item.id
                  ? 'bg-white dark:bg-[#00F59B]/12 text-emerald-700 dark:text-[#00F59B] border border-emerald-500/40 dark:border-[#00E58F]'
                  : 'text-slate-600 dark:text-[#8A968F] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* MODULE 6: REAL-WORLD PROJECTS + LIVE RUNNER + SKILL CARD */}
      {mode === 'projects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className="lg:col-span-4 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] rounded-xl p-4 space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B] pb-2 border-b border-slate-100 dark:border-[#1E2420]">
                {tr('Interactive Project Guides', 'Step-by-Step Project Guides', 'સ્ટેપ-બાય-સ્ટેપ પ્રોજેક્ટ ગાઇડ')}
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
                    className={`w-full min-h-[48px] px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
                      proj.id === activeProject.id
                        ? 'bg-emerald-50 dark:bg-[#151D19] border-emerald-500/40 dark:border-[#00E58F]/50 text-emerald-900 dark:text-white font-semibold'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-[#171C19] text-slate-700 dark:text-[#98A39D]'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">{pickText(proj.title, lang)}</div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-[#6F7A74]">
                      {proj.level} · {proj.duration}
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <article className="lg:col-span-8 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] rounded-xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-100 dark:border-[#1E2420] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-emerald-700 dark:text-[#00F59B]">
                    {activeProject.level} · {activeProject.duration} · {activeProject.topicsUsed.join(' / ')}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {pickText(activeProject.title, lang)}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-[#98A39D] mt-1">{pickText(activeProject.goal, lang)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSkillCardModal(true)}
                  className="min-h-[42px] px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#24FFA9] text-white dark:text-[#05130D] font-mono text-xs font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  {tr('Verified Skill Card (PNG)', 'Skill Card PNG Banayein', 'વેરિફાઇડ સ્કિલ કાર્ડ (PNG)')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D100F] border border-slate-200/80 dark:border-[#1F2622] space-y-2">
                  <h3 className="text-xs font-mono font-semibold text-emerald-700 dark:text-[#00F59B]">
                    {tr('Step-by-Step Build Plan', 'Step-by-Step Build Plan', 'સ્ટેપ-બાય-સ્ટેપ બિલ્ડ પ્લાન')}
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-[#A4B0AA]">
                    {activeProject.stepByStepPlan.map((step, i) => (
                      <li key={i}>{pickText(step, lang)}</li>
                    ))}
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D100F] border border-slate-200/80 dark:border-[#1F2622] space-y-2">
                  <h3 className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                    {tr('Common Bugs & Improvements', 'Common Bugs aur Improvements', 'સામાન્ય બગ્સ અને સુધારાઓ')}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-[#A4B0AA]">
                    {activeProject.commonBugs.map((b, i) => (
                      <li key={i}>{pickText(b, lang)}</li>
                    ))}
                    {activeProject.improvementIdeas.map((imp, i) => (
                      <li key={`imp-${i}`} className="text-emerald-700 dark:text-[#00F59B]">
                        {tr('Idea:', 'Idea:', 'આઇડિયા:')} {pickText(imp, lang)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Editable Starter Working Prototype */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {tr(
                      'Editable Working Prototype — customize numbers & run!',
                      'Editable Working Prototype — apna data badal kar run karein!',
                      'એડિટેબલ વર્કિંગ પ્રોટોટાઇપ — તમારો ડેટા બદલીને રન કરો!'
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleRunProjectCode}
                    className="min-h-[38px] px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#24FFA9] text-white dark:text-[#05130D] font-mono text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {tr('Run Prototype', 'Prototype Run Karein', 'પ્રોટોટાઇપ રન કરો')}
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
                  resetLabel={tr('Reset', 'Reset', 'રીસેટ')}
                  rows={10}
                  lang={lang}
                  filename={`${activeProject.id}.py`}
                  ariaLabel="Project starter code editor"
                />

                {projOutput !== null && (
                  <div className="p-3.5 rounded-xl bg-[#090C0B] border border-[#222925] text-xs font-mono text-[#00F59B] whitespace-pre-wrap">
                    {projOutput}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-[#0D1411] border border-emerald-200 dark:border-[#1E3329] text-xs sm:text-sm text-slate-800 dark:text-[#B9C4BE] space-y-1">
                <div>
                  <strong className="text-emerald-800 dark:text-[#00F59B]">
                    {tr('GitHub Upload Guide:', 'GitHub Upload Guide:', 'GitHub અપલોડ ગાઇડ:')}
                  </strong>{' '}
                  {pickText(activeProject.githubGuide, lang)}
                </div>
                <div>
                  <strong className="text-emerald-800 dark:text-[#00F59B]">
                    {tr('Code Explanation:', 'Code Explanation:', 'કોડની સમજૂતી:')}
                  </strong>{' '}
                  {pickText(activeProject.codeExplanation, lang)}
                </div>
              </div>
            </article>
          </div>

          {/* Complete 22 Project Catalog */}
          <div className="bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] rounded-xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                {tr('Beginner Project Track (10 Projects)', 'Beginner Project Track (10 Projects)', 'બિગિનર પ્રોજેક્ટ ટ્રેક (10 પ્રોજેક્ટ્સ)')}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-[#A4B0AA]">
                {ALL_PROJECT_TITLES.beginner.map((name, i) => (
                  <li key={name} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200/60 dark:border-[#1E2420]">
                    {i + 1}. {name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                {tr('Intermediate Project Track (12 Projects)', 'Intermediate Project Track (12 Projects)', 'ઇન્ટરમીડિયેટ પ્રોજેક્ટ ટ્રેક (12 પ્રોજેક્ટ્સ)')}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-[#A4B0AA]">
                {ALL_PROJECT_TITLES.intermediate.map((name, i) => (
                  <li key={name} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200/60 dark:border-[#1E2420]">
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
              <div className="p-5 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-mono font-semibold text-emerald-700 dark:text-[#00F59B] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {tr("Today's Tech Fact", 'Aaj ka Tech Fact', 'આજનું ટેક ફેક્ટ')}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      #{((dayIndex + factOffset) % DAILY_TECH_FACTS.length) + 1}/{DAILY_TECH_FACTS.length}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-[#D5DDD8] leading-relaxed">{pickText(dailyFact, lang)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFactOffset((n) => n + 1)}
                  className="text-xs font-mono font-semibold text-emerald-700 dark:text-[#00F59B] hover:underline self-start cursor-pointer"
                >
                  {tr('Next Tech Fact ->', 'Agla Tech Fact ->', 'આગળનું ટેક ફેક્ટ ->')}
                </button>
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] space-y-2">
                <div className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                  {tr("Today's Career Tip", 'Aaj ki Career Tip', 'આજની કરિયર ટિપ')}
                </div>
                <p className="text-sm text-slate-800 dark:text-[#D5DDD8] leading-relaxed">{pickText(dailyTip, lang)}</p>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-xl bg-emerald-50/70 dark:bg-[#121614] border border-emerald-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-mono font-semibold text-emerald-800 dark:text-[#00F59B] flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5" />
                  {pickText(dailyMicro.title, lang)}
                </div>
                {microClaimed && (
                  <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-[#00F59B]">
                    {tr('+15 Daily XP Claimed', '+15 Daily XP Mil Chuka Hai', '+15 દૈનિક XP મળી ગયા')}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-[#D5DDD8]">{pickText(dailyMicro.prompt, lang)}</p>

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
                  className="min-h-[38px] px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#24FFA9] text-white dark:text-[#05130D] font-mono text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  {microClaimed
                    ? tr('Run & Verify', 'Run & Check', 'રન અને ચકાસો')
                    : tr('Run & Claim +15 XP', 'Run & +15 XP Payein', 'રન કરો અને +15 XP મેળવો')}
                </button>
                {microResult && (
                  <span
                    className={`text-xs font-mono font-semibold ${
                      microResult.passed ? 'text-emerald-700 dark:text-[#00F59B]' : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {microResult.passed
                      ? `${tr('Solved! Output:', 'Sahi jawab! Output:', 'સાચો જવાબ! આઉટપુટ:')} ${microResult.output}`
                      : `${tr('Output:', 'Output:', 'આઉટપુટ:')} ${microResult.output} (${tr('Expected:', 'Expected:', 'અપેક્ષિત:')} ${dailyMicro.expectedOutput})`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* News Filter & Live Daily Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {tr(
                    `Today’s Tech Headlines · ${newsDateLabel}`,
                    `Aaj ki Tech News · ${newsDateLabel}`,
                    `આજના ટેક સમાચાર · ${newsDateLabel}`
                  )}
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#8A968F]">
                  {newsIsLive
                    ? tr(
                        'Auto-updated live from global & Indian tech feeds based on today’s date',
                        'Aaj ki date ke hisab se global aur Indian tech feeds se auto-updated',
                        'આજની તારીખ મુજબ વૈશ્વિક અને ભારતીય ટેક ફીડ્સમાંથી લાઇવ અપડેટેડ'
                      )
                    : tr(
                        'Daily India & World Tech Wire (auto-rotates by today’s date even offline)',
                        'Daily India & World Tech Wire (offline mein bhi aaj ki date ke hisab se updated)',
                        'દૈનિક ભારત અને વિશ્વ ટેક વાયર (ઓફલાઇનમાં પણ આજની તારીખ મુજબ અપડેટેડ)'
                      )}
                </p>
              </div>
              <button
                type="button"
                disabled={newsLoading}
                onClick={() => loadDailyNews(true)}
                className="min-h-[38px] px-3.5 py-1.5 rounded-md bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#242B27] hover:border-[#00E58F]/60 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${newsLoading ? 'animate-spin' : ''}`} />
                {newsLoading
                  ? tr('Updating...', 'Update ho raha hai...', 'અપડેટ થઈ રહ્યું છે...')
                  : tr('Refresh Today’s News', 'Aaj ki News Refresh Karein', 'આજના સમાચાર રિફ્રેશ કરો')}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {NEWS_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setNewsCategory(cat)}
                  className={`min-h-[36px] px-3 py-1 rounded-md font-mono text-xs font-medium border cursor-pointer ${
                    newsCategory === cat
                      ? 'bg-emerald-600 dark:bg-[#00F59B]/12 border-emerald-600 dark:border-[#00E58F] text-white dark:text-[#00F59B]'
                      : 'bg-white dark:bg-[#121614] border-slate-200 dark:border-[#222925] text-slate-600 dark:text-[#8A968F]'
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
                  <div className="p-6 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] text-sm text-slate-600 dark:text-[#98A39D]">
                    {tr(
                      'No headlines in this category right now. Tap "All" or "Refresh Today’s News".',
                      'Is category mein abhi koi headline nahi hai. "All" par click karein.',
                      'આ કેટેગરીમાં હમણાં કોઈ સમાચાર નથી. "All" પર ક્લિક કરો.'
                    )}
                  </div>
                );
              }
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNews.map((item) => (
                    <article
                      key={item.id}
                      className="p-5 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2.5">
                        <div className="text-xs font-mono text-slate-500 dark:text-[#7D8882] tabular-nums">
                          {item.category} · {item.date} · {item.readTime}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                          {pickText(item.title, lang)}
                        </h3>
                        <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200/70 dark:border-[#1E2420] text-xs font-mono font-semibold text-emerald-700 dark:text-[#00F59B]">
                          {item.highlightStat}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-[#98A39D] leading-relaxed">
                          {pickText(item.summary, lang)}
                        </p>
                        {item.companySummary && (
                          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200/80 dark:border-[#1E2420] text-xs text-slate-700 dark:text-[#B5C0BA] leading-relaxed">
                            <strong className="text-emerald-700 dark:text-[#00F59B]">
                              {tr('Company & Context: ', 'Company / Topic Samjhein: ', 'કંપની અને સંદર્ભ: ')}
                            </strong>
                            {pickText(item.companySummary, lang)}
                          </div>
                        )}
                        <p className="text-xs text-slate-700 dark:text-[#B5C0BA] pt-1">
                          <strong className="text-amber-700 dark:text-amber-400">
                            {tr('Why it matters: ', 'Ye kyun zaroori hai: ', 'આ કેમ મહત્વનું છે: ')}
                          </strong>
                          {pickText(item.whyItMatters, lang)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-[#1E2420]">
                        <span className="text-slate-500 font-mono">{item.sourceName}</span>
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 dark:text-[#00F59B] font-mono font-semibold inline-flex items-center gap-1 hover:underline"
                        >
                          {tr('Read more', 'Poora padhein', 'પૂરું વાંચો')}
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {tr('Indian Self-Taught Tech Journeys', 'Indian Self-Taught Tech Journeys', 'ભારતીય સેલ્ફ-ટોટ ટેક સફળતાની વાર્તાઓ')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUCCESS_STORIES.map((st) => (
                <div
                  key={st.id}
                  className="p-5 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600 dark:text-[#00F59B]" />
                      {st.name}
                    </div>
                    <span className="text-xs font-mono text-slate-500 dark:text-[#7D8882]">
                      {st.city} · {st.role}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-[#8A968F]">{pickText(st.background, lang)}</p>
                  <p className="text-sm text-slate-700 dark:text-[#B5C0BA]">{pickText(st.journey, lang)}</p>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-[#00F59B] pt-1">
                    “{pickText(st.advice, lang)}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 8: CAREER ROADMAP (SYS_PATH architectural cards matching reference screenshot) */}
      {mode === 'career' && (
        <div className="space-y-5">
          <div className="space-y-4">
            {CAREER_TRACKS.map((track, idx) => (
              <div
                key={track.id}
                className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] space-y-3.5"
              >
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-semibold tracking-wider text-emerald-700 dark:text-[#00F59B] uppercase">
                    SYS_PATH_0{idx + 1} // {track.timelineMonths.replace(/months/i, 'MO')}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {pickText(track.title, lang)}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 dark:text-[#7A857F]">
                    {track.entryRoles.join(' / ')} · {track.coreSkills.join(' · ')}
                  </div>
                </div>

                <ul className="space-y-1.5 text-sm text-slate-700 dark:text-[#8E9993]">
                  {track.firstSteps.map((s, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2.5">
                      <span className="text-emerald-600 dark:text-[#00F59B] select-none">•</span>
                      <span>{pickText(s, lang)}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-slate-100 dark:border-[#1E2420] text-xs font-mono text-slate-600 dark:text-[#7D8882]">
                  <strong className="text-slate-800 dark:text-[#C8D3CD]">
                    {tr('Free Certifications:', 'Free Certifications:', 'મફત સર્ટિફિકેશન:')}
                  </strong>{' '}
                  {track.freeCerts.join(' · ')}
                </div>
              </div>
            ))}
          </div>

          {/* Job-Ready Interactive Checklist */}
          <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {tr(
                  'Job-Ready Resume, GitHub & Portfolio Checklist',
                  'Job-Ready Resume & GitHub Checklist',
                  'જોબ-રેડી રિઝ્યુમ, GitHub અને પોર્ટફોલિયો ચેકલિસ્ટ'
                )}
              </h3>
              <span className="text-xs font-mono tabular-nums text-emerald-700 dark:text-[#00F59B]">
                {progress.completedChecklistIds.length}/{JOB_READY_CHECKLIST.length}
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-[#1E2420]">
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
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-[#00F59B] shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 dark:text-[#6F7A74] shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        checked ? 'line-through text-slate-400 dark:text-[#5B6660]' : 'text-slate-800 dark:text-[#D5DDD8]'
                      }`}
                    >
                      {pickText(item.text, lang)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 9A: CHEAT SHEETS */}
      {mode === 'cheatsheets' && (
        <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-emerald-600 dark:text-[#00F59B]" />
                  {tr('Quick Revision Cheat Sheets', 'Quick Revision Cheat Sheets', 'ઝડપી રિવિઝન ચીટ શીટ્સ')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A968F]">
                  {tr(
                    'Copy or download one-page summaries for Python, OOP/DSA, Excel, and Git.',
                    'Interview se pehle Python, OOP/DSA, Excel aur Git ki quick sheet revise ya download karein.',
                    'ઇન્ટરવ્યુ પહેલાં Python, OOP/DSA, Excel અને Git ની ઝડપી ચીટ શીટ રિવાઇઝ અથવા ડાઉનલોડ કરો.'
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SHEET_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSheetCategory(cat)}
                    className={`min-h-[36px] px-3 py-1 rounded-md font-mono text-xs font-medium border cursor-pointer ${
                      sheetCategory === cat
                        ? 'bg-emerald-600 dark:bg-[#00F59B]/12 border-emerald-600 dark:border-[#00E58F] text-white dark:text-[#00F59B]'
                        : 'bg-white dark:bg-[#121614] border-slate-200 dark:border-[#222925] text-slate-600 dark:text-[#8A968F]'
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
                  className="p-5 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1E2420]">
                    <div>
                      <div className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-[#00F59B]">
                        {sheet.category}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{sheet.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopySheet(sheet.id)}
                        className="min-h-[34px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#181D1A] border border-slate-200 dark:border-[#262E29] text-xs font-mono text-slate-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSheetId === sheet.id ? <Check className="w-3.5 h-3.5 text-[#00F59B]" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSheetId === sheet.id ? tr('Copied', 'Copied', 'કોપી થયું') : tr('Copy', 'Copy', 'કોપી')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSheet(sheet.id)}
                        className="min-h-[34px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#181D1A] border border-slate-200 dark:border-[#262E29] text-xs font-mono text-slate-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        .txt
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {sheet.entries.map((entry, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200/60 dark:border-[#1E2420] space-y-1">
                        <pre className="text-xs font-mono text-emerald-700 dark:text-[#00F59B] whitespace-pre-wrap">
                          {entry.syntax}
                        </pre>
                        <div className="text-xs text-slate-600 dark:text-[#98A39D]">{pickText(entry.meaning, lang)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
        </section>
      )}

      {/* MODULE 9B: TOP 50 INTERVIEW Q&A FLASHCARDS */}
      {mode === 'qa' && (
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {tr(
                    `Top ${INTERVIEW_QA.length} Entry-Level IT Interview Q&A`,
                    `Top ${INTERVIEW_QA.length} Fresher IT Interview Q&A Flashcards`,
                    `ટોચના ${INTERVIEW_QA.length} ફ્રેશર IT ઇન્ટરવ્યુ Q&A ફ્લેશકાર્ડ્સ`
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A968F]">
                  {tr(
                    'Quiz yourself with the focus deck first, then browse or search all 50 cards below.',
                    'Pehle Focus Deck par khud ko test karein, ya neeche kisi bhi card ko tap kar ke answer dekhein.',
                    'પહેલાં ફોકસ ડેક પર તમારી જાતને ટેસ્ટ કરો, અથવા નીચે કોઈપણ કાર્ડ પર ટેપ કરીને જવાબ જુઓ.'
                  )}
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
                  placeholder={tr('Search Python, OOP, Excel...', 'Search Python, OOP, Excel...', 'શોધો (Python, OOP, Excel)...')}
                  className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#242B27] text-xs sm:text-sm text-slate-800 dark:text-white"
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
                  className={`min-h-[36px] px-3 py-1 rounded-md font-mono text-xs font-medium border cursor-pointer ${
                    qaCategory === cat
                      ? 'bg-emerald-600 dark:bg-[#00F59B]/12 border-emerald-600 dark:border-[#00E58F] text-white dark:text-[#00F59B]'
                      : 'bg-white dark:bg-[#121614] border-slate-200 dark:border-[#222925] text-slate-600 dark:text-[#8A968F]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Interactive Flashcard Focus Deck */}
            {deckCard && (
              <div className="p-5 sm:p-6 rounded-xl bg-slate-900 dark:bg-[#121614] text-slate-100 border border-[#222925] border-l-[3px] border-l-[#00F59B] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="font-semibold text-[#00F59B]">
                    {deckCard.category} · {tr('Focus Flashcard', 'Focus Flashcard', 'ફોકસ ફ્લેશકાર્ડ')}
                  </span>
                  <span className="tabular-nums">
                    {safeDeckIdx + 1} / {filteredQa.length}
                  </span>
                </div>

                <h3 className="text-base sm:text-xl font-bold text-white leading-snug">
                  {pickText(deckCard.question, lang)}
                </h3>

                {deckFlipped && (
                  <div className="p-4 rounded-xl bg-[#0D100F] border border-[#222925] space-y-2.5">
                    <p className="text-sm text-[#D5DDD8] leading-relaxed">{pickText(deckCard.answer, lang)}</p>
                    {deckCard.codeSnippet && (
                      <pre className="p-3 rounded-lg bg-[#090C0B] text-xs font-mono text-[#00F59B] overflow-x-auto">
                        <code>{deckCard.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDeckFlipped((f) => !f)}
                    className="min-h-[40px] px-4 py-2 rounded-md bg-[#00F59B] hover:bg-[#24FFA9] text-[#05130D] font-mono text-xs font-bold cursor-pointer"
                  >
                    {deckFlipped
                      ? tr('Hide Answer', 'Answer Chhupayein', 'જવાબ છુપાવો')
                      : tr('Reveal Answer', 'Answer Dekhein', 'જવાબ જુઓ')}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safeDeckIdx === 0}
                      onClick={() => {
                        setDeckIndex((i) => Math.max(0, i - 1));
                        setDeckFlipped(false);
                      }}
                      className="min-h-[40px] px-3.5 py-2 rounded-md bg-[#181D1A] border border-[#262E29] hover:border-[#39453E] disabled:opacity-40 font-mono text-xs font-semibold cursor-pointer"
                    >
                      {tr('Prev Card', 'Pichhla', 'પાછળનું')}
                    </button>
                    <button
                      type="button"
                      disabled={safeDeckIdx >= filteredQa.length - 1}
                      onClick={() => {
                        setDeckIndex((i) => Math.min(filteredQa.length - 1, i + 1));
                        setDeckFlipped(false);
                      }}
                      className="min-h-[40px] px-3.5 py-2 rounded-md bg-[#181D1A] border border-[#262E29] hover:border-[#39453E] disabled:opacity-40 font-mono text-xs font-semibold cursor-pointer"
                    >
                      {tr('Next Card', 'Agla', 'આગળનું')}
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
                    className="p-4 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#7D8882]">
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
                        className="text-emerald-700 dark:text-[#00F59B] font-semibold hover:underline cursor-pointer"
                      >
                        {isOpen
                          ? tr('Hide Answer', 'Chhupayein', 'જવાબ છુપાવો')
                          : tr('Show Answer', 'Answer Dekhein', 'જવાબ જુઓ')}
                      </button>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                      {pickText(qa.question, lang)}
                    </h4>
                    {isOpen && (
                      <div className="pt-2 border-t border-slate-100 dark:border-[#1E2420] space-y-2">
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-[#A4B0AA] leading-relaxed">
                          {pickText(qa.answer, lang)}
                        </p>
                        {qa.codeSnippet && (
                          <pre className="p-2.5 rounded-lg bg-[#090C0B] text-xs font-mono text-[#00F59B] overflow-x-auto">
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
      )}

      {/* VERIFIED SKILL CARD PNG GENERATOR MODAL */}
      {showSkillCardModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-card-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-2xl w-full rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#242B27] p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="skill-card-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  {tr('Verified Skill & Project Card', 'Verified Skill & Project Card', 'વેરિફાઇડ સ્કિલ અને પ્રોજેક્ટ કાર્ડ')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#8A968F]">
                  {tr(
                    'Download your proof-of-work PNG card for LinkedIn, WhatsApp, or resumes.',
                    'Apne project ka PNG certificate card download karein aur LinkedIn ya resume par lagayein.',
                    'LinkedIn, WhatsApp અથવા રિઝ્યુમ માટે તમારું પ્રૂફ-ઓફ-વર્ક PNG કાર્ડ ડાઉનલોડ કરો.'
                  )}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowSkillCardModal(false)}
                className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1C221F] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {tr('Your Name on Card', 'Card par Aapka Naam', 'કાર્ડ પર તમારું નામ')}
              </label>
              <input
                type="text"
                value={cardLearnerName}
                onChange={(e) => setCardLearnerName(e.target.value)}
                maxLength={32}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#242B27] text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#242B27] bg-[#090C0B]">
              <canvas ref={canvasRef} width={1200} height={630} className="w-full h-auto block" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadSkillCard}
                className="min-h-[42px] px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#24FFA9] text-white dark:text-[#05130D] font-mono text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {tr('Download PNG Card', 'PNG Card Download Karein', 'PNG કાર્ડ ડાઉનલોડ કરો')}
              </button>
              <button
                type="button"
                onClick={handleCopyShareText}
                className="min-h-[42px] px-4 py-2 rounded-md bg-slate-100 dark:bg-[#181D1A] border border-slate-200 dark:border-[#262E29] text-slate-800 dark:text-slate-100 font-mono text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                {shareCopied ? <Check className="w-4 h-4 text-[#00F59B]" /> : <Copy className="w-4 h-4" />}
                {shareCopied
                  ? tr('LinkedIn Text Copied!', 'Share Text Copy Ho Gaya!', 'શેર ટેક્સ્ટ કોપી થઈ ગયું!')
                  : tr('Copy LinkedIn / WhatsApp Text', 'LinkedIn / WhatsApp Text Copy Karein', 'LinkedIn / WhatsApp ટેક્સ્ટ કોપી કરો')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
