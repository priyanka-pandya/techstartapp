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
import { Language, LearnModule, UserProgress } from '../types';
import { runPythonCode, TraceStep } from '../utils/pythonRunner';
import { CodeEditorWithToolbar, StepVisualizerPanel } from './CodeEditorWithToolbar';
import { ExcelLab } from './ExcelLab';

interface LearnHubProps {
  lang: Language;
  activeModule: LearnModule;
  onChangeModule: (mod: LearnModule) => void;
  progress: UserProgress;
  onCompleteLesson: (type: 'computer' | 'windows' | 'python', id: string, xp: number) => void;
  onToggleDownload: (id: string) => void;
  initialPythonLessonId?: string;
}

export const LearnHub: React.FC<LearnHubProps> = ({
  lang,
  activeModule,
  onChangeModule,
  progress,
  onCompleteLesson,
  onToggleDownload,
  initialPythonLessonId,
}) => {
  const t = UI_TEXT[lang];

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
      lesson.unit.toLowerCase().includes(q) ||
      String(lesson.number) === q;
    return matchesLevel && matchesSearch;
  });

  const handleRunLessonExample = () => {
    setPyExampleTrace(null);
    const res = runPythonCode(activePyLesson.code);
    setPyExampleOut(res.error ? `${res.error.type}: ${lang === 'hi' ? res.error.friendlyHi : res.error.friendlyEn}` : res.stdout);
  };

  const handleVisualizeLessonExample = () => {
    const res = runPythonCode(activePyLesson.code, '', true);
    setPyExampleOut(res.error ? `${res.error.type}: ${lang === 'hi' ? res.error.friendlyHi : res.error.friendlyEn}` : res.stdout);
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
          err: lang === 'hi' ? res.error!.friendlyHi : res.error!.friendlyEn,
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
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <img
            src={activeComputerTopic.image}
            alt={activeComputerTopic.title[lang]}
            referrerPolicy="no-referrer"
            className="w-full max-h-[340px] object-contain mx-auto"
          />
        </div>
      );
    }

    // Crisp interactive SVG diagram fallback/visuals for CPU, Storage, OS, Network
    return (
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
        {activeComputerTopic.diagramType === 'cpu' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-center">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <Keyboard className="w-6 h-6 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">1. Input</div>
              <div className="text-xs text-slate-500 mt-1">Keyboard · Mouse · Mic</div>
            </div>
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800">
              <Cpu className="w-6 h-6 text-teal-700 dark:text-teal-300 mx-auto mb-2" />
              <div className="text-sm font-semibold text-teal-900 dark:text-teal-100">2. Process (CPU)</div>
              <div className="text-xs text-teal-700 dark:text-teal-300 mt-1">Calculates & Decides</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <Monitor className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">3. Output</div>
              <div className="text-xs text-slate-500 mt-1">Screen · Speaker · Printer</div>
            </div>
          </div>
        )}
        {activeComputerTopic.diagramType === 'storage' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <HardDrive className="w-6 h-6 text-slate-500 mb-2" />
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">HDD (Spinning Disk)</div>
              <div className="text-xs text-slate-500 mt-1 tabular-nums">~100 MB/s · Boot: 90s · Moving parts</div>
            </div>
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <HardDrive className="w-6 h-6 text-teal-600 dark:text-teal-400 mb-2" />
              <div className="text-sm font-semibold text-teal-900 dark:text-teal-100">SSD (Solid State Chip)</div>
              <div className="text-xs text-teal-700 dark:text-teal-300 mt-1 tabular-nums">~3,500 MB/s · Boot: 10s · Silent & Fast</div>
            </div>
          </div>
        )}
        {(activeComputerTopic.diagramType === 'os' || activeComputerTopic.diagramType === 'network') && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <Wifi className="w-6 h-6 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {activeComputerTopic.diagramType === 'network' ? 'Wi-Fi / Bluetooth' : 'Apps (.py, Excel)'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <Shield className="w-6 h-6 text-teal-700 dark:text-teal-300 mx-auto mb-2" />
              <div className="text-sm font-semibold text-teal-900 dark:text-teal-100">
                {activeComputerTopic.diagramType === 'network' ? 'Router & Browser' : 'Operating System'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <Cpu className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {activeComputerTopic.diagramType === 'network' ? 'Internet Servers' : 'Hardware (CPU/RAM)'}
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
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        {[
          { id: 'computer' as LearnModule, label: t.computerBasics, icon: Cpu },
          { id: 'windows-excel' as LearnModule, label: t.windowsExcel, icon: FileSpreadsheet },
          { id: 'python' as LearnModule, label: `${t.pythonCourse} (${PYTHON_LESSONS.length})`, icon: Code2 },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeModule === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeModule(item.id)}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
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

      {/* MODULE 1: COMPUTER BASICS */}
      {activeModule === 'computer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Topic Sidebar */}
          <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              {lang === 'en' ? 'Module 1: Computer Basics (28 Topics)' : 'मॉड्यूल 1: कंप्यूटर बेसिक्स (28 विषय)'}
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
                    className={`w-full min-h-[48px] px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm leading-snug">
                      {topic.order}. {topic.title[lang]}
                    </span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Topic Reader */}
          <article className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'en' ? 'Topic' : 'विषय'} {activeComputerTopic.order} · {activeComputerTopic.durationMin} min · {activeComputerTopic.category}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {activeComputerTopic.title[lang]}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleDownload(activeComputerTopic.id)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  {progress.downloadedLessonIds.includes(activeComputerTopic.id) ? t.savedOffline : t.downloadOffline}
                </button>
                <button
                  type="button"
                  onClick={() => onCompleteLesson('computer', activeComputerTopic.id, 20)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    progress.completedComputerIds.includes(activeComputerTopic.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
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
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {lang === 'en' ? 'Interactive RAM Capacity Simulator' : 'इंटरैक्टिव RAM क्षमता सिम्युलेटर'}
                  </span>
                  <div className="flex gap-1.5">
                    {(['4', '8', '16'] as const).map((gb) => (
                      <button
                        key={gb}
                        type="button"
                        onClick={() => setRamChoice(gb)}
                        className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold tabular-nums cursor-pointer ${
                          ramChoice === gb
                            ? 'bg-teal-600 text-white'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {gb} GB
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {ramChoice === '4' &&
                    (lang === 'en'
                      ? '4 GB Study Desk: Fits 1 browser with 3 tabs + Notepad. Opening Excel + VS Code + Zoom together will feel slow.'
                      : '4 GB डेस्क: 3 ब्राउज़र टैब + नोटपैड ठीक चलता है। Excel + VS Code + Zoom एक साथ चलाने पर धीमा होगा।')}
                  {ramChoice === '8' &&
                    (lang === 'en'
                      ? '8 GB Study Desk: Comfortably fits Chrome (10 tabs) + Excel + VS Code Python + music without lagging.'
                      : '8 GB डेस्क: Chrome (10 टैब) + Excel + VS Code Python आराम से एक साथ चलते हैं।')}
                  {ramChoice === '16' &&
                    (lang === 'en'
                      ? '16 GB Study Desk: Spacious desk for heavy Python data projects, Android Studio, Docker, or video editing.'
                      : '16 GB डेस्क: बड़े Python प्रोजेक्ट, Android Studio और वीडियो एडिटिंग के लिए बेहतरीन।')}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
                <h3 className="text-xs font-semibold text-teal-700 dark:text-teal-400">{t.simpleDefinition}</h3>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {activeComputerTopic.simpleDefinition[lang]}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
                <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-400">{t.realLifeExample}</h3>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {activeComputerTopic.realLifeExample[lang]}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.whyItMatters}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeComputerTopic.whyItMatters[lang]}
              </p>
            </div>

            {activeComputerTopic.keySpecs && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                {activeComputerTopic.keySpecs.map((spec) => (
                  <div key={spec.label} className="p-3.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 sm:w-44 shrink-0">
                      {spec.label}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {spec.detail[lang]}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-1.5">
              <h3 className="text-xs font-semibold text-teal-800 dark:text-teal-300">{t.practicalTask}</h3>
              <p className="text-sm text-slate-800 dark:text-slate-200">{activeComputerTopic.practicalTask[lang]}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                {activeComputerTopic.videoScriptSummary[lang]}
              </p>
            </div>

            {/* 3 Quiz Questions */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{t.quickQuiz}</h3>
              {activeComputerTopic.quiz.map((q, qIdx) => {
                const chosen = quizAnswers[q.id];
                const isChecked = quizChecked[q.id];
                const isCorrect = chosen === q.correctIndex;
                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {qIdx + 1}. {q.question[lang]}
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
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-medium'
                                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {opt[lang]}
                        </button>
                      ))}
                    </div>
                    {isChecked && (
                      <p className={`text-xs font-medium ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                        {isCorrect ? t.correctFeedback : t.tryAgainFeedback} — {q.explanation[lang]}
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
              { id: 'excel' as const, label: lang === 'en' ? 'Interactive Excel Lab' : 'लाइव Excel लैब' },
              { id: 'shortcuts' as const, label: lang === 'en' ? 'Keyboard Shortcuts (15)' : 'कीबोर्ड शॉर्टकट (15)' },
              { id: 'windows' as const, label: lang === 'en' ? 'Windows & Cyber Safety' : 'Windows व साइबर सुरक्षा' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setWinTab(sub.id)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  winTab === sub.id
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {lang === 'en' ? 'Modern Windows & Productivity Shortcuts' : 'जरूरी Windows और एडिटिंग शॉर्टकट्स'}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'editing', 'navigation', 'windows'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setShortcutFilter(cat)}
                      className={`min-h-[38px] px-3 py-1 rounded-lg text-xs font-medium capitalize cursor-pointer ${
                        shortcutFilter === cat
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{sc.action[lang]}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{sc.example[lang]}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                      {sc.keys.map((k) => (
                        <kbd
                          key={k}
                          className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-semibold"
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
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {lesson.category === 'safety' ? 'Cyber Safety' : 'Windows Skill'} · {lesson.durationMin} min
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                            {lesson.title[lang]}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => onCompleteLesson('windows', lesson.id, 20)}
                          className={`min-h-[38px] px-3 py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                            done ? 'bg-emerald-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'
                          }`}
                        >
                          {done ? t.completed : t.markComplete}
                        </button>
                      </div>
                      <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
                        {lesson.steps.map((st, idx) => (
                          <li key={idx}>{st[lang]}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div><strong>{t.practicalTask}:</strong> {lesson.practicalTask[lang]}</div>
                      <div className="text-teal-700 dark:text-teal-400">Tip: {lesson.tip[lang]}</div>
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
          <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {lang === 'en' ? 'Python Path (120 Lessons)' : 'Python Course (120 Lessons)'}
              </h2>
              <span className="text-xs font-mono tabular-nums text-teal-600 dark:text-teal-400">
                {progress.completedPythonIds.length}/{PYTHON_LESSONS.length}
              </span>
            </div>

            <input
              type="search"
              value={pySearch}
              onChange={(e) => setPySearch(e.target.value)}
              placeholder={lang === 'en' ? 'Search topic or lesson #...' : 'Lesson search karein (loops, OOP, 15)...'}
              className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100"
            />

            <div className="grid grid-cols-4 gap-1">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPyLevelFilter(lvl)}
                  className={`min-h-[36px] px-1.5 py-1 rounded-lg text-[11px] font-medium truncate cursor-pointer ${
                    pyLevelFilter === lvl
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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
                    className={`w-full min-h-[46px] px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSel
                        ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">
                        {lesson.number}. {lesson.title[lang]}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {lesson.level} · {lesson.durationMin}m
                      </div>
                    </div>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Python Lesson Reader */}
          <article className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {activePyLesson.unit} · Lesson {activePyLesson.number} · {activePyLesson.level} · {activePyLesson.durationMin} min
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {activePyLesson.title[lang]}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleDownload(activePyLesson.id)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  {progress.downloadedLessonIds.includes(activePyLesson.id) ? t.savedOffline : t.downloadOffline}
                </button>
                <button
                  type="button"
                  onClick={() => onCompleteLesson('python', activePyLesson.id, 25)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    progress.completedPythonIds.includes(activePyLesson.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {progress.completedPythonIds.includes(activePyLesson.id) ? t.completed : t.markComplete}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
                <h3 className="text-xs font-semibold text-teal-700 dark:text-teal-400">{t.simpleDefinition}</h3>
                <p className="text-sm text-slate-800 dark:text-slate-200">{activePyLesson.simpleExplanation[lang]}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
                <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-400">{t.realLifeExample}</h3>
                <p className="text-sm text-slate-800 dark:text-slate-200">{activePyLesson.realLifeExample[lang]}</p>
              </div>
            </div>

            <div className="text-sm text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100">{t.whyItMatters}: </strong>
              {activePyLesson.whyItMatters[lang]}
            </div>

            {/* Runnable Code Example + Step Visualizer */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 truncate">
                  Syntax: {activePyLesson.syntax.split('\n')[0]}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVisualizeLessonExample}
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    {lang === 'en' ? 'Visualize Steps' : 'Step Visualizer'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRunLessonExample}
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {t.runCode}
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-slate-950 text-slate-100 text-xs sm:text-sm overflow-x-auto leading-relaxed">
                <code>{activePyLesson.code}</code>
              </pre>
              {pyExampleOut !== null && (
                <div className="p-3.5 bg-slate-900 border-t border-slate-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap">
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
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {lang === 'en' ? 'Line-by-Line Explanation' : 'Line-by-Line Explanation'}
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {activePyLesson.lineByLine.map((item, i) => (
                    <li key={i}>
                      <code className="text-teal-700 dark:text-teal-400 font-semibold">{item.line}</code> — {item.explanation[lang]}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                  {lang === 'en' ? 'Common Mistake to Avoid' : 'Common Mistake (Isse Bachein)'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {activePyLesson.commonMistakes[0]?.[lang]}
                </p>
                <div className="pt-2 text-xs text-slate-500">
                  <strong>{lang === 'en' ? 'Project Idea' : 'Project Idea'}:</strong> {activePyLesson.projectIdea[lang]}
                </div>
              </div>
            </div>

            {/* Scaffolded Interactive Modes: Fill-in-Blank & Parsons Block Ordering */}
            {(activePyLesson.fillBlank || activePyLesson.parsons) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePyLesson.fillBlank && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                      {lang === 'en' ? 'Quick Recall: Fill the Missing Keyword' : 'Quick Recall: Missing Keyword Bharein'}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {activePyLesson.fillBlank.prompt[lang]}
                    </p>
                    <pre className="p-3 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                      {activePyLesson.fillBlank.codeBefore}
                      <span className="px-1.5 py-0.5 rounded bg-teal-800/80 text-teal-200 border border-teal-500">
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
                        placeholder={activePyLesson.fillBlank.hint[lang]}
                        className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-slate-100"
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
                        className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        {t.checkAnswer}
                      </button>
                    </div>
                    {fillBlankFeedback[activePyLesson.id] && (
                      <div
                        className={`text-xs font-semibold ${
                          fillBlankFeedback[activePyLesson.id] === 'correct'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {fillBlankFeedback[activePyLesson.id] === 'correct'
                          ? t.correctFeedback
                          : `${t.tryAgainFeedback} (${activePyLesson.fillBlank.hint[lang]})`}
                      </div>
                    )}
                  </div>
                )}

                {activePyLesson.parsons && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                        {lang === 'en' ? 'Tap-to-Order Code Blocks' : 'Tap-to-Order Code Blocks'}
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
                        className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {activePyLesson.parsons.prompt[lang]}
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
                                ? 'opacity-40 bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-teal-500 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {item.text}
                          </button>
                        );
                      })}
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 text-teal-300 font-mono text-[11px] min-h-[54px] space-y-0.5">
                      {(parsonsPicked[activePyLesson.id] || []).length === 0 ? (
                        <span className="text-slate-500">
                          {lang === 'en' ? 'Tap blocks above to assemble code here...' : 'Code banane ke liye upar ke blocks tap karein...'}
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
                        className="min-h-[38px] px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        {lang === 'en' ? 'Verify Order' : 'Order Check Karein'}
                      </button>
                      {parsonsFeedback[activePyLesson.id] && (
                        <span
                          className={`text-xs font-semibold ${
                            parsonsFeedback[activePyLesson.id] === 'correct'
                              ? 'text-emerald-700 dark:text-emerald-400'
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
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  {lang === 'en' ? 'Topic Mini Challenge' : 'Topic Mini Challenge'}
                </h3>
                <span className="text-xs font-mono text-teal-700 dark:text-teal-400">
                  Expected: {activePyLesson.miniChallenge.expectedOutput.replace(/\n/g, ' | ')}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                {activePyLesson.miniChallenge.prompt[lang]}
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
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  {t.submitSolution}
                </button>
                {pyChallengeResult[activePyLesson.id] && (
                  <span
                    className={`text-xs font-semibold ${
                      pyChallengeResult[activePyLesson.id].passed
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {pyChallengeResult[activePyLesson.id].passed
                      ? `${t.passed}! (+25 XP)`
                      : pyChallengeResult[activePyLesson.id].err ||
                        `${t.failed}: Output was "${pyChallengeResult[activePyLesson.id].out}"`}
                  </span>
                )}
              </div>
            </div>

            {/* Inline Quick Quiz */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.quickQuiz}: {activePyLesson.quiz.question[lang]}
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
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {opt[lang]}
                    </button>
                  );
                })}
              </div>
              {quizAnswers[activePyLesson.quiz.id] !== undefined && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {quizAnswers[activePyLesson.quiz.id] === activePyLesson.quiz.correctIndex
                    ? t.correctFeedback
                    : t.tryAgainFeedback}{' '}
                  {activePyLesson.quiz.explanation[lang]}
                </p>
              )}
            </div>
          </article>
        </div>
      )}
    </div>
  );
};
