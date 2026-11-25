import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Cpu,
  Download,
  FileSpreadsheet,
  HardDrive,
  Keyboard,
  Layers,
  Monitor,
  Play,
  RotateCcw,
  Shield,
  Wifi,
} from 'lucide-react';
import { COMPUTER_TOPICS } from '../data/computerBasics';
import { PYTHON_LESSONS } from '../data/pythonCourse';
import { UI_TEXT } from '../data/translations';
import { WINDOWS_SKILLS, KEYBOARD_SHORTCUTS } from '../data/windowsExcel';
import { Language, LearnModule, PythonDomainId, UserProgress, pickText } from '../types';
import { getFriendlyPythonError, runPythonCode, TraceStep } from '../utils/pythonRunner';
import { CodeEditorWithToolbar, StepVisualizerPanel } from './CodeEditorWithToolbar';
import { ExcelLab } from './ExcelLab';
import { PythonDomainsLab } from './PythonDomainsLab';

interface LearnHubProps {
  lang: Language;
  activeModule: LearnModule;
  onChangeModule: (mod: LearnModule) => void;
  progress: UserProgress;
  onCompleteLesson: (type: 'computer' | 'windows' | 'python' | 'library', id: string, xp: number) => void;
  onToggleDownload: (id: string) => void;
  initialPythonLessonId?: string;
  initialPythonDomainId?: PythonDomainId;
}

export const LearnHub: React.FC<LearnHubProps> = ({
  lang,
  activeModule,
  onChangeModule,
  progress,
  onCompleteLesson,
  onToggleDownload,
  initialPythonLessonId,
  initialPythonDomainId,
}) => {
  const t = UI_TEXT[lang];
  const tr = (en: string, hi: string, gu: string) => (lang === 'gu' ? gu : lang === 'hi' ? hi : en);

  // Computer Basics state
  const [selectedTopicId, setSelectedTopicId] = useState(COMPUTER_TOPICS[4].id);
  const [ramChoice, setRamChoice] = useState<'4' | '8' | '16'>('8');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  // Windows & Excel state
  const [winTab, setWinTab] = useState<'windows' | 'shortcuts' | 'excel'>('excel');
  const [shortcutFilter, setShortcutFilter] = useState<'all' | 'editing' | 'navigation' | 'windows'>('all');

  // Python 120-lesson state
  const [selectedPyId, setSelectedPyId] = useState(initialPythonLessonId || 'py-15');
  const [pyLevelFilter, setPyLevelFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [pySearch, setPySearch] = useState('');
  const [pyExampleOut, setPyExampleOut] = useState<string | null>(null);
  const [pyExampleTrace, setPyExampleTrace] = useState<TraceStep[] | null>(null);
  const [fillBlankInputs, setFillBlankInputs] = useState<Record<string, string>>({});
  const [fillBlankFeedback, setFillBlankFeedback] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [parsonsPicked, setParsonsPicked] = useState<Record<string, number[]>>({});
  const [parsonsFeedback, setParsonsFeedback] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [pyChallengeCode, setPyChallengeCode] = useState<Record<string, string>>({});
  const [pyChallengeResult, setPyChallengeResult] = useState<Record<string, { out: string; passed: boolean; err?: string }>>({});

  useEffect(() => {
    if (initialPythonLessonId) {
      setSelectedPyId(initialPythonLessonId);
      setPyExampleOut(null);
      setPyExampleTrace(null);
    }
  }, [initialPythonLessonId]);

  const activeComputerTopic = COMPUTER_TOPICS.find((c) => c.id === selectedTopicId) || COMPUTER_TOPICS[0];
  const activePyLesson = PYTHON_LESSONS.find((p) => p.id === selectedPyId) || PYTHON_LESSONS[0];

  // Deterministic scramble for Parsons blocks per lesson
  const scrambledParsonsLines = useMemo(() => {
    const blocks = activePyLesson.parsons?.correctOrder || [];
    if (blocks.length <= 1) return blocks.map((text, idx) => ({ text, origIdx: idx }));
    const indexed = blocks.map((text, idx) => ({ text, origIdx: idx }));
    // Deterministic rotation + swap so order is visibly scrambled
    const rotated = [...indexed.slice(1), indexed[0]];
    if (rotated.length >= 3) {
      const tmp = rotated[0];
      rotated[0] = rotated[rotated.length - 1];
      rotated[rotated.length - 1] = tmp;
    }
    return rotated;
  }, [activePyLesson]);

  const filteredPyLessons = PYTHON_LESSONS.filter((lesson) => {
    const matchesLevel = pyLevelFilter === 'All' || lesson.level === pyLevelFilter;
    const q = pySearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      lesson.title.en.toLowerCase().includes(q) ||
      lesson.title.hi.toLowerCase().includes(q) ||
      (lesson.title.gu || '').toLowerCase().includes(q) ||
      lesson.unit.toLowerCase().includes(q) ||
      String(lesson.number) === q;
    return matchesLevel && matchesSearch;
  });

  const handleRunLessonExample = () => {
    setPyExampleTrace(null);
    const res = runPythonCode(activePyLesson.code);
    setPyExampleOut(res.error ? `${res.error.type}: ${getFriendlyPythonError(res.error, lang)}` : res.stdout);
  };

  const handleVisualizeLessonExample = () => {
    const res = runPythonCode(activePyLesson.code, '', true);
    setPyExampleOut(res.error ? `${res.error.type}: ${getFriendlyPythonError(res.error, lang)}` : res.stdout);
    setPyExampleTrace(res.trace || []);
  };

  const handleRunMiniChallenge = () => {
    const code = pyChallengeCode[activePyLesson.id] ?? activePyLesson.miniChallenge.starterCode;
    const res = runPythonCode(code);
    if (res.error) {
      setPyChallengeResult((prev) => ({
        ...prev,
        [activePyLesson.id]: {
          out: res.stdout,
          passed: false,
          err: getFriendlyPythonError(res.error!, lang),
        },
      }));
      return;
    }
    const cleanOut = res.stdout.trim();
    const cleanExp = activePyLesson.miniChallenge.expectedOutput.trim();
    const passed = cleanOut === cleanExp;
    setPyChallengeResult((prev) => ({
      ...prev,
      [activePyLesson.id]: { out: cleanOut, passed },
    }));
    if (passed) {
      onCompleteLesson('python', activePyLesson.id, 25);
    }
  };

  const renderHardwareVisual = () => {
    if (activeComputerTopic.image) {
      return (
        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-[#222925] bg-slate-50 dark:bg-[#090C0B]">
          <img
            src={activeComputerTopic.image}
            alt={pickText(activeComputerTopic.title, lang)}
            referrerPolicy="no-referrer"
            className="w-full max-h-[340px] object-contain mx-auto"
          />
        </div>
      );
    }

    // Crisp interactive SVG diagram fallback/visuals for CPU, Storage, OS, Network
    return (
      <div className="p-5 rounded-lg border border-slate-200 dark:border-[#222925] bg-slate-50 dark:bg-[#0D100F]">
        {activeComputerTopic.diagramType === 'cpu' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-center">
            <div className="p-4 rounded-lg bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925]">
              <Keyboard className="w-6 h-6 text-emerald-700 dark:text-[#00F59B] mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {tr('1. Input', '1. Input', '1. ઇનપુટ (Input)')}
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8A968F] mt-1">
                {tr('Keyboard · Mouse · Mic', 'Keyboard · Mouse · Mic', 'કીબોર્ડ · માઉસ · માઇક')}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-[#151D19] border border-emerald-300 dark:border-[#00E58F]/50">
              <Cpu className="w-6 h-6 text-emerald-700 dark:text-[#00F59B] mx-auto mb-2" />
              <div className="text-sm font-semibold text-emerald-900 dark:text-white">
                {tr('2. Process (CPU)', '2. Process (CPU)', '2. પ્રોસેસ (CPU)')}
              </div>
              <div className="text-xs text-emerald-700 dark:text-[#00F59B] mt-1">
                {tr('Calculates & Decides', 'Sochta aur Calculate Karta Hai', 'ગણતરી અને નિર્ણય કરે છે')}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925]">
              <Monitor className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {tr('3. Output', '3. Output', '3. આઉટપુટ (Output)')}
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8A968F] mt-1">
                {tr('Screen · Speaker · Printer', 'Screen · Speaker · Printer', 'સ્ક્રીન · સ્પીકર · પ્રિન્ટર')}
              </div>
            </div>
          </div>
        )}
        {activeComputerTopic.diagramType === 'storage' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925]">
              <HardDrive className="w-6 h-6 text-slate-500 dark:text-[#8A968F] mb-2" />
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {tr('HDD (Spinning Disk)', 'HDD (Ghoomne Wali Disk)', 'HDD (ફરતી ડિસ્ક)')}
              </div>
              <div className="text-xs text-slate-500 dark:text-[#8A968F] mt-1 tabular-nums">
                {tr('~100 MB/s · Boot: 90s · Moving parts', '~100 MB/s · Boot: 90s · Moving parts', '~100 MB/s · બૂટ: 90s · ફરતા ભાગો')}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-[#151D19] border border-emerald-300 dark:border-[#00E58F]/50">
              <HardDrive className="w-6 h-6 text-emerald-700 dark:text-[#00F59B] mb-2" />
              <div className="text-sm font-semibold text-emerald-900 dark:text-white">
                {tr('SSD (Solid State Chip)', 'SSD (Fast Memory Chip)', 'SSD (સોલિડ સ્ટેટ ચિપ)')}
              </div>
              <div className="text-xs text-emerald-700 dark:text-[#00F59B] mt-1 tabular-nums">
                {tr('~3,500 MB/s · Boot: 10s · Silent & Fast', '~3,500 MB/s · Boot: 10s · Silent & Fast', '~3,500 MB/s · બૂટ: 10s · શાંત અને સુપરફાસ્ટ')}
              </div>
            </div>
          </div>
        )}
        {(activeComputerTopic.diagramType === 'os' || activeComputerTopic.diagramType === 'network') && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-lg bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925]">
              <Wifi className="w-6 h-6 text-emerald-700 dark:text-[#00F59B] mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {activeComputerTopic.diagramType === 'network' ? 'Wi-Fi / Bluetooth' : tr('Apps (.py, Excel)', 'Apps (.py, Excel)', 'એપ્સ (.py, Excel)')}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-[#151D19] border border-emerald-300 dark:border-[#00E58F]/50">
              <Shield className="w-6 h-6 text-emerald-700 dark:text-[#00F59B] mx-auto mb-2" />
              <div className="text-sm font-semibold text-emerald-900 dark:text-white">
                {activeComputerTopic.diagramType === 'network'
                  ? tr('Router & Browser', 'Router aur Browser', 'રાઉટર અને બ્રાઉઝર')
                  : tr('Operating System', 'Operating System', 'ઓપરેટિંગ સિસ્ટમ')}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925]">
              <Cpu className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {activeComputerTopic.diagramType === 'network'
                  ? tr('Internet Servers', 'Internet Servers', 'ઇન્ટરનેટ સર્વર્સ')
                  : tr('Hardware (CPU/RAM)', 'Hardware (CPU/RAM)', 'હાર્ડવેર (CPU/RAM)')}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Module Switcher */}
      <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#121614] border border-slate-200 dark:border-[#222925] max-w-full overflow-x-auto">
        {[
          { id: 'computer' as LearnModule, label: t.computerBasics, icon: Cpu },
          { id: 'windows-excel' as LearnModule, label: t.windowsExcel, icon: FileSpreadsheet },
          { id: 'python' as LearnModule, label: `${t.pythonCourse} (${PYTHON_LESSONS.length})`, icon: Code2 },
          {
            id: 'python-domains' as LearnModule,
            label: tr('Python Domains (4 Fields)', 'Python Fields & Libraries', 'Python ડોમેન્સ (4 ક્ષેત્રો)'),
            icon: Layers,
          },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeModule === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeModule(item.id)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
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

      {/* MODULE 1: COMPUTER BASICS */}
      {activeModule === 'computer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Topic Sidebar */}
          <aside className="lg:col-span-4 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] rounded-xl p-4 space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B] px-2 pb-2 border-b border-slate-100 dark:border-[#1E2420]">
              {tr(
                'Module 1: Computer Basics (28 Topics)',
                'Module 1: Computer Basics (28 Topics)',
                'મોડ્યુલ 1: કોમ્પ્યુટર બેઝિક્સ (28 વિષયો)'
              )}
            </h2>
            <div className="space-y-1 max-h-[540px] overflow-y-auto pr-1">
              {COMPUTER_TOPICS.map((topic) => {
                const isDone = progress.completedComputerIds.includes(topic.id);
                const isSelected = topic.id === activeComputerTopic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`w-full min-h-[48px] px-3 py-2.5 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-[#151D19] border-emerald-500/40 dark:border-[#00E58F]/50 text-emerald-900 dark:text-white font-semibold'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-[#171C19] text-slate-700 dark:text-[#98A39D]'
                    }`}
                  >
                    <span className="text-xs sm:text-sm leading-snug">
                      {topic.order}. {pickText(topic.title, lang)}
                    </span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00F59B] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Topic Reader */}
          <article className="lg:col-span-8 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] rounded-xl p-5 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-[#1E2420] pb-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B] tabular-nums">
                  {tr('TOPIC', 'TOPIC', 'વિષય')} #{activeComputerTopic.order} // {activeComputerTopic.durationMin} {tr('MIN', 'MIN', 'મિનિટ')} · {activeComputerTopic.category}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {pickText(activeComputerTopic.title, lang)}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleDownload(activeComputerTopic.id)}
                  className="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-50 dark:bg-[#171C19] text-xs font-mono font-medium text-slate-700 dark:text-[#D5DDD8] hover:bg-slate-100 dark:hover:bg-[#1E2521] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  {progress.downloadedLessonIds.includes(activeComputerTopic.id) ? t.savedOffline : t.downloadOffline}
                </button>
                <button
                  type="button"
                  onClick={() => onCompleteLesson('computer', activeComputerTopic.id, 20)}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    progress.completedComputerIds.includes(activeComputerTopic.id)
                      ? 'bg-emerald-600 text-white dark:bg-[#00F59B]/20 dark:text-[#00F59B] dark:border dark:border-[#00E58F]'
                      : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {progress.completedComputerIds.includes(activeComputerTopic.id) ? t.completed : t.markComplete}
                </button>
              </div>
            </div>

            {renderHardwareVisual()}

            {/* Interactive RAM Desk Explorer when on RAM topic */}
            {activeComputerTopic.id === 'comp-ram' && (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {tr('Interactive RAM Capacity Simulator', 'Interactive RAM Capacity Simulator', 'ઇન્ટરેક્ટિવ RAM ક્ષમતા સિમ્યુલેટર')}
                  </span>
                  <div className="flex gap-1.5">
                    {(['4', '8', '16'] as const).map((gb) => (
                      <button
                        key={gb}
                        type="button"
                        onClick={() => setRamChoice(gb)}
                        className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-mono font-bold tabular-nums cursor-pointer ${
                          ramChoice === gb
                            ? 'bg-emerald-600 dark:bg-[#00F59B] text-white dark:text-[#05130D]'
                            : 'bg-white dark:bg-[#171C19] border border-slate-200 dark:border-[#2A332E] text-slate-700 dark:text-[#98A39D]'
                        }`}
                      >
                        {gb} GB
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-[#D5DDD8]">
                  {ramChoice === '4' &&
                    tr(
                      '4 GB Study Desk: Fits 1 browser with 3 tabs + Notepad. Opening Excel + VS Code + Zoom together will feel slow.',
                      '4 GB Study Desk: 3 browser tabs + Notepad theek chalta hai. Excel + VS Code + Zoom ek saath chalane par slow lag sakta hai.',
                      '4 GB સ્ટડી ડેસ્ક: 3 બ્રાઉઝર ટેબ + નોટપેડ સરળતાથી ચાલે છે. Excel + VS Code + Zoom એકસાથે ચલાવવા પર ધીમું લાગી શકે.'
                    )}
                  {ramChoice === '8' &&
                    tr(
                      '8 GB Study Desk: Comfortably fits Chrome (10 tabs) + Excel + VS Code Python + music without lagging.',
                      '8 GB Study Desk: Chrome (10 tabs) + Excel + VS Code Python aaram se bina hang hue ek saath chalte hain.',
                      '8 GB સ્ટડી ડેસ્ક: Chrome (10 ટેબ) + Excel + VS Code Python કોઈપણ અડચણ વગર આરામથી એકસાથે ચાલે છે.'
                    )}
                  {ramChoice === '16' &&
                    tr(
                      '16 GB Study Desk: Spacious desk for heavy Python data projects, Android Studio, Docker, or video editing.',
                      '16 GB Study Desk: Heavy Python data projects, Android Studio, Docker aur video editing ke liye best hai.',
                      '16 GB સ્ટડી ડેસ્ક: હેવી Python ડેટા પ્રોજેક્ટ્સ, Android Studio, Docker અને વીડિયો એડિટિંગ માટે ઉત્તમ છે.'
                    )}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-1.5">
                <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-700 dark:text-[#00F59B]">{t.simpleDefinition}</h3>
                <p className="text-sm text-slate-800 dark:text-[#E6ECE8] leading-relaxed">
                  {pickText(activeComputerTopic.simpleDefinition, lang)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-1.5">
                <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">{t.realLifeExample}</h3>
                <p className="text-sm text-slate-800 dark:text-[#E6ECE8] leading-relaxed">
                  {pickText(activeComputerTopic.realLifeExample, lang)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t.whyItMatters}</h3>
              <p className="text-sm text-slate-600 dark:text-[#98A39D] leading-relaxed">
                {pickText(activeComputerTopic.whyItMatters, lang)}
              </p>
            </div>

            {activeComputerTopic.keySpecs && (
              <div className="divide-y divide-slate-100 dark:divide-[#1E2420] border border-slate-200 dark:border-[#222925] bg-slate-50/50 dark:bg-[#0D100F] rounded-lg">
                {activeComputerTopic.keySpecs.map((spec) => (
                  <div key={spec.label} className="p-3.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-xs font-mono font-semibold text-slate-900 dark:text-[#00F59B] sm:w-44 shrink-0">
                      {spec.label}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-[#D5DDD8]">
                      {pickText(spec.detail, lang)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 rounded-lg bg-emerald-50/70 dark:bg-[#0D100F] border border-emerald-200 dark:border-[#00E58F]/40 space-y-1.5">
              <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-800 dark:text-[#00F59B]">{t.practicalTask}</h3>
              <p className="text-sm text-slate-800 dark:text-[#E6ECE8]">{pickText(activeComputerTopic.practicalTask, lang)}</p>
              <p className="text-xs text-slate-500 dark:text-[#8A968F] pt-1">
                {pickText(activeComputerTopic.videoScriptSummary, lang)}
              </p>
            </div>

            {/* 3 Quiz Questions */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-[#1E2420]">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t.quickQuiz}</h3>
              {activeComputerTopic.quiz.map((q, qIdx) => {
                const chosen = quizAnswers[q.id];
                const isChecked = quizChecked[q.id];
                const isCorrect = chosen === q.correctIndex;
                return (
                  <div key={q.id} className="p-4 rounded-lg bg-slate-50/60 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-[#E6ECE8]">
                      {qIdx + 1}. {pickText(q.question, lang)}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                            setQuizChecked((prev) => ({ ...prev, [q.id]: true }));
                          }}
                          className={`w-full min-h-[44px] px-3.5 py-2 rounded-lg border text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                            chosen === optIdx
                              ? optIdx === q.correctIndex
                                ? 'bg-emerald-50 dark:bg-[#00F59B]/15 border-emerald-500 dark:border-[#00E58F] text-emerald-800 dark:text-[#00F59B] font-medium'
                                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-300'
                              : 'bg-white dark:bg-[#121614] border-slate-200 dark:border-[#222925] hover:border-slate-300 dark:hover:border-[#2A332E] text-slate-700 dark:text-[#D5DDD8]'
                          }`}
                        >
                          {pickText(opt, lang)}
                        </button>
                      ))}
                    </div>
                    {isChecked && (
                      <p className={`text-xs font-medium ${isCorrect ? 'text-emerald-700 dark:text-[#00F59B]' : 'text-rose-700 dark:text-rose-400'}`}>
                        {isCorrect ? t.correctFeedback : t.tryAgainFeedback} — {pickText(q.explanation, lang)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      )}

      {/* MODULE 2: WINDOWS & EXCEL */}
      {activeModule === 'windows-excel' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'excel' as const, label: tr('Interactive Excel Lab', 'Interactive Excel Lab', 'ઇન્ટરેક્ટિવ Excel લેબ') },
              { id: 'shortcuts' as const, label: tr('Keyboard Shortcuts (15)', 'Keyboard Shortcuts (15)', 'કીબોર્ડ શોર્ટકટ્સ (15)') },
              { id: 'windows' as const, label: tr('Windows & Cyber Safety', 'Windows & Cyber Safety', 'Windows અને સાયબર સુરક્ષા') },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setWinTab(sub.id)}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-mono font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  winTab === sub.id
                    ? 'bg-emerald-600 dark:bg-[#00F59B] text-white dark:text-[#05130D] border-emerald-600 dark:border-[#00F59B]'
                    : 'bg-white dark:bg-[#121614] border-slate-200 dark:border-[#222925] text-slate-700 dark:text-[#98A39D] hover:border-slate-300 dark:hover:border-[#2A332E]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {winTab === 'excel' && (
            <ExcelLab
              lang={lang}
              completedIds={progress.completedWindowsIds}
              onCompleteSheet={(sheetId) => onCompleteLesson('windows', sheetId, 25)}
            />
          )}

          {winTab === 'shortcuts' && (
            <div className="bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {tr(
                    'Modern Windows & Productivity Shortcuts',
                    'Zaroori Windows aur Editing Shortcuts',
                    'મહત્વપૂર્ણ Windows અને એડિટિંગ શોર્ટકટ્સ'
                  )}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'editing', 'navigation', 'windows'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setShortcutFilter(cat)}
                      className={`min-h-[38px] px-3 py-1 rounded-lg font-mono text-xs font-medium capitalize cursor-pointer ${
                        shortcutFilter === cat
                          ? 'bg-emerald-600 dark:bg-[#00F59B] text-white dark:text-[#05130D] font-bold'
                          : 'bg-slate-100 dark:bg-[#171C19] border border-slate-200 dark:border-[#2A332E] text-slate-600 dark:text-[#98A39D]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {KEYBOARD_SHORTCUTS.filter((s) => shortcutFilter === 'all' || s.category === shortcutFilter).map((sc) => (
                  <div
                    key={sc.id}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{pickText(sc.action, lang)}</div>
                      <div className="text-xs text-slate-500 dark:text-[#8A968F]">{pickText(sc.example, lang)}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                      {sc.keys.map((k) => (
                        <kbd
                          key={k}
                          className="px-2 py-1 rounded-md bg-white dark:bg-[#171C19] border border-slate-300 dark:border-[#2A332E] text-slate-800 dark:text-[#00F59B] font-semibold"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {winTab === 'windows' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WINDOWS_SKILLS.map((lesson) => {
                const done = progress.completedWindowsIds.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className="p-5 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-mono text-emerald-700 dark:text-[#00F59B]">
                            {lesson.category === 'safety'
                              ? tr('CYBER_SAFETY', 'CYBER_SAFETY', 'સાયબર સુરક્ષા')
                              : tr('WINDOWS_SKILL', 'WINDOWS_SKILL', 'Windows કૌશલ્ય')}{' '}
                            // {lesson.durationMin} {tr('MIN', 'MIN', 'મિનિટ')}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                            {pickText(lesson.title, lang)}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => onCompleteLesson('windows', lesson.id, 20)}
                          className={`min-h-[38px] px-3 py-1 rounded-lg font-mono text-xs font-bold shrink-0 cursor-pointer ${
                            done
                              ? 'bg-emerald-600 text-white dark:bg-[#00F59B]/20 dark:text-[#00F59B] dark:border dark:border-[#00E58F]'
                              : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D]'
                          }`}
                        >
                          {done ? t.completed : t.markComplete}
                        </button>
                      </div>
                      <ul className="space-y-1.5 text-sm text-slate-700 dark:text-[#D5DDD8] list-disc pl-5">
                        {lesson.steps.map((st, idx) => (
                          <li key={idx}>{pickText(st, lang)}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] text-xs text-slate-700 dark:text-[#D5DDD8] space-y-1">
                      <div><strong>{t.practicalTask}:</strong> {pickText(lesson.practicalTask, lang)}</div>
                      <div className="text-emerald-700 dark:text-[#00F59B]">{tr('Tip:', 'Tip:', 'ટિપ:')} {pickText(lesson.tip, lang)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODULE 3: PYTHON 120 LESSONS */}
      {activeModule === 'python' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 120-Lesson Navigator */}
          <aside className="lg:col-span-4 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B]">
                {tr('Python Path (120 Lessons)', 'Python Course (120 Lessons)', 'Python પાઠમાળા (120 પાઠ)')}
              </h2>
              <span className="text-xs font-mono font-bold tabular-nums text-emerald-700 dark:text-[#00F59B]">
                {progress.completedPythonIds.length}/{PYTHON_LESSONS.length}
              </span>
            </div>

            <input
              type="search"
              value={pySearch}
              onChange={(e) => setPySearch(e.target.value)}
              placeholder={tr(
                'Search topic or lesson #...',
                'Lesson search karein (loops, OOP, 15)...',
                'પાઠ શોધો (loops, OOP, 15)...'
              )}
              className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-50 dark:bg-[#0D100F] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#00F59B]"
            />

            <div className="grid grid-cols-4 gap-1">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPyLevelFilter(lvl)}
                  className={`min-h-[36px] px-1.5 py-1 rounded-lg text-[11px] font-mono font-medium truncate cursor-pointer ${
                    pyLevelFilter === lvl
                      ? 'bg-emerald-600 dark:bg-[#00F59B] text-white dark:text-[#05130D] font-bold'
                      : 'bg-slate-100 dark:bg-[#171C19] border border-slate-200 dark:border-[#222925] text-slate-600 dark:text-[#98A39D]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
              {filteredPyLessons.map((lesson) => {
                const isDone = progress.completedPythonIds.includes(lesson.id);
                const isSel = lesson.id === activePyLesson.id;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => {
                      setSelectedPyId(lesson.id);
                      setPyExampleOut(null);
                      setPyExampleTrace(null);
                    }}
                    className={`w-full min-h-[46px] px-3 py-2 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSel
                        ? 'bg-emerald-50 dark:bg-[#151D19] border-emerald-500/40 dark:border-[#00E58F]/50 text-emerald-900 dark:text-white font-semibold'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-[#171C19] text-slate-700 dark:text-[#98A39D]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">
                        {lesson.number}. {pickText(lesson.title, lang)}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-[#6F7A74] truncate tabular-nums">
                        {lesson.level} · {lesson.durationMin}m
                      </div>
                    </div>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00F59B] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Python Lesson Reader */}
          <article className="lg:col-span-8 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] rounded-xl p-5 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-[#1E2420] pb-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B] tabular-nums">
                  {activePyLesson.unit} // {tr(`LESSON ${activePyLesson.number}`, `LESSON ${activePyLesson.number}`, `પાઠ ${activePyLesson.number}`)} · {activePyLesson.level} · {activePyLesson.durationMin} {tr('MIN', 'MIN', 'મિનિટ')}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {pickText(activePyLesson.title, lang)}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleDownload(activePyLesson.id)}
                  className="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-50 dark:bg-[#171C19] text-xs font-mono font-medium text-slate-700 dark:text-[#D5DDD8] hover:bg-slate-100 dark:hover:bg-[#1E2521] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  {progress.downloadedLessonIds.includes(activePyLesson.id) ? t.savedOffline : t.downloadOffline}
                </button>
                <button
                  type="button"
                  onClick={() => onCompleteLesson('python', activePyLesson.id, 25)}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    progress.completedPythonIds.includes(activePyLesson.id)
                      ? 'bg-emerald-600 text-white dark:bg-[#00F59B]/20 dark:text-[#00F59B] dark:border dark:border-[#00E58F]'
                      : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {progress.completedPythonIds.includes(activePyLesson.id) ? t.completed : t.markComplete}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-1.5">
                <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-700 dark:text-[#00F59B]">{t.simpleDefinition}</h3>
                <p className="text-sm text-slate-800 dark:text-[#E6ECE8]">{pickText(activePyLesson.simpleExplanation, lang)}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-1.5">
                <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">{t.realLifeExample}</h3>
                <p className="text-sm text-slate-800 dark:text-[#E6ECE8]">{pickText(activePyLesson.realLifeExample, lang)}</p>
              </div>
            </div>

            <div className="text-sm text-slate-700 dark:text-[#D5DDD8]">
              <strong className="text-slate-900 dark:text-white">{t.whyItMatters}: </strong>
              {pickText(activePyLesson.whyItMatters, lang)}
            </div>

            {/* Runnable Code Example + Step Visualizer */}
            <div className="rounded-xl border border-slate-200 dark:border-[#222925] overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-100 dark:bg-[#0D100F] border-b border-slate-200 dark:border-[#222925] flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-slate-700 dark:text-[#D5DDD8] truncate">
                  Syntax: {activePyLesson.syntax.split('\n')[0]}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVisualizeLessonExample}
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-white hover:bg-slate-200 dark:bg-[#171C19] dark:hover:bg-[#1E2521] border border-slate-200 dark:border-[#2A332E] text-slate-900 dark:text-[#E6ECE8] text-xs font-mono font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 text-emerald-700 dark:text-[#00F59B]" />
                    {tr('Visualize Steps', 'Step Visualizer', 'સ્ટેપ વિઝ્યુલાઇઝર')}
                  </button>
                  <button
                    type="button"
                    onClick={handleRunLessonExample}
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {t.runCode}
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-[#090C0B] text-[#E6ECE8] text-xs sm:text-sm overflow-x-auto leading-relaxed">
                <code>{activePyLesson.code}</code>
              </pre>
              {pyExampleOut !== null && (
                <div className="p-3.5 bg-[#0D100F] border-t border-[#222925] text-xs font-mono text-[#00F59B] whitespace-pre-wrap">
                  Output:{'\n'}{pyExampleOut}
                </div>
              )}
            </div>

            {pyExampleTrace && (
              <StepVisualizerPanel
                code={activePyLesson.code}
                trace={pyExampleTrace}
                lang={lang}
                onClose={() => setPyExampleTrace(null)}
              />
            )}

            {/* Line-by-line & Common Mistake */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-2">
                <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-white">
                  {tr('Line-by-Line Explanation', 'Line-by-Line Explanation', 'લાઇન-બાય-લાઇન સમજૂતી')}
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-[#D5DDD8]">
                  {activePyLesson.lineByLine.map((item, i) => (
                    <li key={i}>
                      <code className="text-emerald-700 dark:text-[#00F59B] font-semibold">{item.line}</code> — {pickText(item.explanation, lang)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-2">
                <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-rose-700 dark:text-rose-400">
                  {tr('Common Mistake to Avoid', 'Common Mistake (Isse Bachein)', 'આ સામાન્ય ભૂલ ટાળો')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#D5DDD8]">
                  {activePyLesson.commonMistakes[0] ? pickText(activePyLesson.commonMistakes[0], lang) : ''}
                </p>
                <div className="pt-2 text-xs text-slate-500 dark:text-[#8A968F]">
                  <strong>{tr('Project Idea', 'Project Idea', 'પ્રોજેક્ટ આઇડિયા')}:</strong> {pickText(activePyLesson.projectIdea, lang)}
                </div>
              </div>
            </div>

            {/* Scaffolded Interactive Modes: Fill-in-Blank & Parsons Block Ordering */}
            {(activePyLesson.fillBlank || activePyLesson.parsons) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePyLesson.fillBlank && (
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-3">
                    <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-700 dark:text-[#00F59B]">
                      {tr(
                        'Quick Recall: Fill the Missing Keyword',
                        'Quick Recall: Missing Keyword Bharein',
                        'ઝડપી રિવિઝન: ખૂટતો કીવર્ડ ભરો'
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-[#D5DDD8]">
                      {pickText(activePyLesson.fillBlank.prompt, lang)}
                    </p>
                    <pre className="p-3 rounded-lg bg-[#090C0B] border border-[#222925] text-[#E6ECE8] text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                      {activePyLesson.fillBlank.codeBefore}
                      <span className="px-1.5 py-0.5 rounded bg-[#00F59B]/20 text-[#00F59B] border border-[#00E58F]">
                        {fillBlankInputs[activePyLesson.id] || '____'}
                      </span>
                      {activePyLesson.fillBlank.codeAfter}
                    </pre>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={fillBlankInputs[activePyLesson.id] ?? ''}
                        onChange={(e) =>
                          setFillBlankInputs((p) => ({ ...p, [activePyLesson.id]: e.target.value }))
                        }
                        placeholder={pickText(activePyLesson.fillBlank.hint, lang)}
                        className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#2A332E] bg-white dark:bg-[#121614] text-xs font-mono text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const typed = (fillBlankInputs[activePyLesson.id] ?? '').trim();
                          const ok = typed === activePyLesson.fillBlank!.answer;
                          setFillBlankFeedback((p) => ({
                            ...p,
                            [activePyLesson.id]: ok ? 'correct' : 'wrong',
                          }));
                        }}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs font-mono font-bold cursor-pointer"
                      >
                        {t.checkAnswer}
                      </button>
                    </div>
                    {fillBlankFeedback[activePyLesson.id] && (
                      <div
                        className={`text-xs font-semibold ${
                          fillBlankFeedback[activePyLesson.id] === 'correct'
                            ? 'text-emerald-700 dark:text-[#00F59B]'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {fillBlankFeedback[activePyLesson.id] === 'correct'
                          ? t.correctFeedback
                          : `${t.tryAgainFeedback} (${pickText(activePyLesson.fillBlank.hint, lang)})`}
                      </div>
                    )}
                  </div>
                )}

                {activePyLesson.parsons && (
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
                        {tr('Tap-to-Order Code Blocks', 'Tap-to-Order Code Blocks', 'કોડ બ્લોક્સને યોગ્ય ક્રમમાં ગોઠવો')}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setParsonsPicked((p) => ({ ...p, [activePyLesson.id]: [] }));
                          setParsonsFeedback((p) => {
                            const next = { ...p };
                            delete next[activePyLesson.id];
                            return next;
                          });
                        }}
                        className="text-xs font-mono text-slate-500 dark:text-[#8A968F] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        {t.resetCode}
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-[#D5DDD8]">
                      {pickText(activePyLesson.parsons.prompt, lang)}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scrambledParsonsLines.map((item) => {
                        const picked = parsonsPicked[activePyLesson.id] || [];
                        const already = picked.includes(item.origIdx);
                        return (
                          <button
                            key={item.origIdx}
                            type="button"
                            disabled={already}
                            onClick={() =>
                              setParsonsPicked((p) => ({
                                ...p,
                                [activePyLesson.id]: [...(p[activePyLesson.id] || []), item.origIdx],
                              }))
                            }
                            className={`min-h-[36px] px-2.5 py-1 rounded-lg border font-mono text-[11px] text-left transition-colors cursor-pointer ${
                              already
                                ? 'opacity-40 bg-slate-200 dark:bg-[#171C19] border-slate-300 dark:border-[#222925]'
                                : 'bg-white dark:bg-[#121614] border-slate-300 dark:border-[#2A332E] hover:border-emerald-500 dark:hover:border-[#00F59B] text-slate-800 dark:text-[#E6ECE8]'
                            }`}
                          >
                            {item.text}
                          </button>
                        );
                      })}
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#090C0B] border border-[#222925] text-[#00F59B] font-mono text-[11px] min-h-[54px] space-y-0.5">
                      {(parsonsPicked[activePyLesson.id] || []).length === 0 ? (
                        <span className="text-[#6F7A74]">
                          {tr(
                            'Tap blocks above to assemble code here...',
                            'Code banane ke liye upar ke blocks tap karein...',
                            'અહીં કોડ બનાવવા માટે ઉપરના બ્લોક્સ પર ટેપ કરો...'
                          )}
                        </span>
                      ) : (
                        (parsonsPicked[activePyLesson.id] || []).map((origIdx, stepIdx) => (
                          <div key={stepIdx} className="whitespace-pre">
                            {activePyLesson.parsons!.correctOrder[origIdx]}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const picked = parsonsPicked[activePyLesson.id] || [];
                          const expected = activePyLesson.parsons!.correctOrder;
                          const ok =
                            picked.length === expected.length &&
                            picked.every((origIdx, pos) => origIdx === pos);
                          setParsonsFeedback((p) => ({
                            ...p,
                            [activePyLesson.id]: ok ? 'correct' : 'wrong',
                          }));
                        }}
                        className="min-h-[38px] px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs font-mono font-bold cursor-pointer"
                      >
                        {tr('Verify Order', 'Order Check Karein', 'ક્રમ તપાસો')}
                      </button>
                      {parsonsFeedback[activePyLesson.id] && (
                        <span
                          className={`text-xs font-semibold ${
                            parsonsFeedback[activePyLesson.id] === 'correct'
                              ? 'text-emerald-700 dark:text-[#00F59B]'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {parsonsFeedback[activePyLesson.id] === 'correct'
                            ? t.correctFeedback
                            : t.tryAgainFeedback}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mini Coding Challenge inside Lesson */}
            <div className="p-4 sm:p-5 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {tr('Topic Mini Challenge', 'Topic Mini Challenge', 'વિષય મિની ચેલેન્જ')}
                </h3>
                <span className="text-xs font-mono text-emerald-700 dark:text-[#00F59B]">
                  {tr('Expected:', 'Expected:', 'અપેક્ષિત:')} {activePyLesson.miniChallenge.expectedOutput.replace(/\n/g, ' | ')}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-[#D5DDD8]">
                {pickText(activePyLesson.miniChallenge.prompt, lang)}
              </p>
              <CodeEditorWithToolbar
                ariaLabel="Lesson mini challenge code editor"
                rows={5}
                lang={lang}
                filename={`lesson_${activePyLesson.number}.py`}
                value={pyChallengeCode[activePyLesson.id] ?? activePyLesson.miniChallenge.starterCode}
                onChange={(val) =>
                  setPyChallengeCode((prev) => ({ ...prev, [activePyLesson.id]: val }))
                }
                onReset={() =>
                  setPyChallengeCode((prev) => ({
                    ...prev,
                    [activePyLesson.id]: activePyLesson.miniChallenge.starterCode,
                  }))
                }
                resetLabel={t.resetCode}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleRunMiniChallenge}
                  className="min-h-[42px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  {t.submitSolution}
                </button>
                {pyChallengeResult[activePyLesson.id] && (
                  <span
                    className={`text-xs font-semibold ${
                      pyChallengeResult[activePyLesson.id].passed
                        ? 'text-emerald-700 dark:text-[#00F59B]'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {pyChallengeResult[activePyLesson.id].passed
                      ? `${t.passed}! (+25 XP)`
                      : pyChallengeResult[activePyLesson.id].err ||
                        `${t.failed}: ${tr('Output was', 'Output aaya', 'આઉટપુટ આવ્યું')} "${pyChallengeResult[activePyLesson.id].out}"`}
                  </span>
                )}
              </div>
            </div>

            {/* Inline Quick Quiz */}
            <div className="p-4 rounded-lg bg-slate-50/60 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.quickQuiz}: {pickText(activePyLesson.quiz.question, lang)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {activePyLesson.quiz.options.map((opt, idx) => {
                  const chosen = quizAnswers[activePyLesson.quiz.id];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuizAnswers((prev) => ({ ...prev, [activePyLesson.quiz.id]: idx }))}
                      className={`min-h-[44px] px-3 py-2 rounded-lg border text-xs font-mono text-left cursor-pointer ${
                        chosen === idx
                          ? idx === activePyLesson.quiz.correctIndex
                            ? 'bg-emerald-50 dark:bg-[#00F59B]/15 border-emerald-500 dark:border-[#00E58F] text-emerald-800 dark:text-[#00F59B]'
                            : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-300'
                          : 'bg-white dark:bg-[#121614] border-slate-200 dark:border-[#222925] text-slate-700 dark:text-[#D5DDD8]'
                      }`}
                    >
                      {pickText(opt, lang)}
                    </button>
                  );
                })}
              </div>
              {quizAnswers[activePyLesson.quiz.id] !== undefined && (
                <p className="text-xs text-slate-600 dark:text-[#98A39D]">
                  {quizAnswers[activePyLesson.quiz.id] === activePyLesson.quiz.correctIndex
                    ? t.correctFeedback
                    : t.tryAgainFeedback}{' '}
                  {pickText(activePyLesson.quiz.explanation, lang)}
                </p>
              )}
            </div>
          </article>
        </div>
      )}

      {/* MODULE 4: PYTHON LIBRARIES BY DOMAIN */}
      {activeModule === 'python-domains' && (
        <PythonDomainsLab
          lang={lang}
          progress={progress}
          onCompleteLibrary={(id, xp) => onCompleteLesson('library', id, xp)}
          initialDomainId={initialPythonDomainId}
        />
      )}
    </div>
  );
};
