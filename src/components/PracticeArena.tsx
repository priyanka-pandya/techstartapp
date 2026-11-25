import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Bug,
  CheckCircle2,
  Cpu,
  Eye,
  Lightbulb,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Terminal,
  Trash2,
  Wrench,
  XCircle,
} from 'lucide-react';
import {
  BUG_HUNTER_CHALLENGES,
  CODING_CHALLENGES,
  THINK_LIKE_DEV_GUIDES,
} from '../data/challengesAndBugs';
import { UI_TEXT } from '../data/translations';
import { Language, PracticeMode, UserProgress, pickText } from '../types';
import { PythonRunResult, getFriendlyPythonError, runPythonCode, TraceStep } from '../utils/pythonRunner';
import { CodeEditorWithToolbar, StepVisualizerPanel } from './CodeEditorWithToolbar';

interface PracticeArenaProps {
  lang: Language;
  mode: PracticeMode;
  onChangeMode: (mode: PracticeMode) => void;
  progress: UserProgress;
  onSolveChallenge: (id: string, xp: number) => void;
  onSolveBug: (id: string, xp: number) => void;
  initialChallengeId?: string;
}

interface TestRunReport {
  id: string;
  label: string;
  isHidden: boolean;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  errorMsg?: string;
}

function diagnoseUserBugCode(
  userCode: string,
  expectedFixedCode: string,
  bugStatusEntry: { passed: boolean; output: string; error?: PythonRunResult['error'] } | undefined,
  lang: Language
): string {
  if (bugStatusEntry?.error) {
    const err = bugStatusEntry.error;
    const linePrefix = err.line ? `Line ${err.line}: ` : '';
    return `${linePrefix}${getFriendlyPythonError(err, lang)}`;
  }
  const userLines = userCode.split('\n').map((l) => l.trimEnd());
  const fixedLines = expectedFixedCode.split('\n').map((l) => l.trimEnd());
  for (let i = 0; i < Math.max(userLines.length, fixedLines.length); i++) {
    const u = (userLines[i] ?? '').trim();
    const f = (fixedLines[i] ?? '').trim();
    if (u !== f) {
      if (lang === 'gu') {
        return `Line ${i + 1} તપાસો: હાલમાં \`${u || '(ખાલી)'}\` લખેલું છે. અપેક્ષિત આઉટપુટ મુજબ વેરિયેબલ, ઓપરેટર (\`==\` વિરુદ્ધ \`=\`) અથવા રેન્જ તપાસો.`;
      }
      if (lang === 'hi') {
        return `Line ${i + 1} check karein: abhi \`${u || '(empty)'}\` likha hai. Is line mein variable, operator (\`==\` vs \`=\`) ya range check karein.`;
      }
      return `Check Line ${i + 1}: currently \`${u || '(empty)'}\`. Compare variables, operators, or loop bounds carefully with what the expected output requires.`;
    }
  }
  if (lang === 'gu') {
    return 'કોડ કોઈ એરર વગર ચાલી રહ્યો છે — તમારું આઉટપુટ અપેક્ષિત આઉટપુટ સાથે લાઇન-બાય-લાઇન મેચ કરો.';
  }
  return lang === 'hi'
    ? 'Code bina error ke chal raha hai — apna output Expected Output se line-by-line match karein.'
    : 'Code runs without crashing, so compare your printed value against Expected Output line by line.';
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  lang,
  mode,
  onChangeMode,
  progress,
  onSolveChallenge,
  onSolveBug,
  initialChallengeId,
}) => {
  const t = UI_TEXT[lang];
  const tr = (en: string, hi: string, gu: string) => (lang === 'gu' ? gu : lang === 'hi' ? hi : en);

  // Coding Challenges state
  const [diffFilter, setDiffFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedChallengeId, setSelectedChallengeId] = useState(initialChallengeId || CODING_CHALLENGES[0].id);
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [customStdin, setCustomStdin] = useState<Record<string, string>>({});
  const [runResult, setRunResult] = useState<PythonRunResult | null>(null);
  const [challengeTrace, setChallengeTrace] = useState<TraceStep[] | null>(null);
  const [testReports, setTestReports] = useState<TestRunReport[] | null>(null);
  const [hintsShown, setHintsShown] = useState<Record<string, number>>({});
  const [failedAttempts, setFailedAttempts] = useState<Record<string, number>>({});
  const [solutionRevealed, setSolutionRevealed] = useState<Record<string, boolean>>({});

  // Bug Hunter state
  const [selectedBugId, setSelectedBugId] = useState(BUG_HUNTER_CHALLENGES[0].id);
  const [bugCodeMap, setBugCodeMap] = useState<Record<string, string>>({});
  const [bugHintsShown, setBugHintsShown] = useState<Record<string, number>>({});
  const [bugExplainShown, setBugExplainShown] = useState<Record<string, boolean>>({});
  const [bugStatus, setBugStatus] = useState<
    Record<string, { passed: boolean; output: string; error?: PythonRunResult['error'] }>
  >({});

  // DSA Visualizer interactive state
  const [dsaTool, setDsaTool] = useState<'binary-search' | 'stack-queue' | 'bubble-sort'>('binary-search');
  const bsArray = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const [bsTarget, setBsTarget] = useState(70);
  const [bsLow, setBsLow] = useState(0);
  const [bsHigh, setBsHigh] = useState(8);
  const [bsSteps, setBsSteps] = useState(0);
  const [bsFound, setBsFound] = useState<number | null>(null);

  const [sqItems, setSqItems] = useState<string[]>(['Task_A', 'Task_B', 'Task_C']);
  const [sqInput, setSqInput] = useState('Task_D');
  const [sqLog, setSqLog] = useState<string>('Ready: try Stack Pop (LIFO) or Queue Dequeue (FIFO)');

  const [sortArr, setSortArr] = useState<number[]>([64, 25, 42, 12, 55, 19]);
  const [sortPointer, setSortPointer] = useState<{ i: number; j: number; sorted: boolean }>({
    i: 0,
    j: 0,
    sorted: false,
  });

  useEffect(() => {
    if (initialChallengeId) {
      setSelectedChallengeId(initialChallengeId);
      setRunResult(null);
      setTestReports(null);
      setChallengeTrace(null);
    }
  }, [initialChallengeId]);

  const activeChallenge = CODING_CHALLENGES.find((c) => c.id === selectedChallengeId) || CODING_CHALLENGES[0];
  const currentCode = codeMap[activeChallenge.id] ?? activeChallenge.starterCode;
  const currentStdin = customStdin[activeChallenge.id] ?? activeChallenge.testCases[0]?.input ?? '';
  const attemptsCount = failedAttempts[activeChallenge.id] ?? 0;

  const activeBug = BUG_HUNTER_CHALLENGES.find((b) => b.id === selectedBugId) || BUG_HUNTER_CHALLENGES[0];
  const currentBugCode = bugCodeMap[activeBug.id] ?? activeBug.buggyCode;
  const currentBugHints = bugHintsShown[activeBug.id] ?? 0;

  const handleRunCustom = () => {
    setTestReports(null);
    setChallengeTrace(null);
    const res = runPythonCode(currentCode, currentStdin);
    setRunResult(res);
  };

  const handleVisualizeChallenge = () => {
    setTestReports(null);
    const res = runPythonCode(currentCode, currentStdin, true);
    setRunResult(res);
    setChallengeTrace(res.trace || []);
  };

  const handleSubmitTests = () => {
    setRunResult(null);
    setChallengeTrace(null);
    const reports: TestRunReport[] = activeChallenge.testCases.map((tc) => {
      const res = runPythonCode(currentCode, tc.input);
      const actualClean = res.stdout.trim();
      const expectedClean = tc.expectedOutput.trim();
      const passed = !res.error && actualClean === expectedClean;
      return {
        id: tc.id,
        label: tc.label,
        isHidden: tc.isHidden,
        input: tc.input,
        expected: expectedClean,
        actual: res.error ? `[${res.error.type}]` : actualClean,
        passed,
        errorMsg: res.error ? getFriendlyPythonError(res.error, lang) : undefined,
      };
    });
    setTestReports(reports);

    if (reports.every((r) => r.passed)) {
      onSolveChallenge(activeChallenge.id, activeChallenge.xp);
    } else {
      setFailedAttempts((prev) => ({
        ...prev,
        [activeChallenge.id]: (prev[activeChallenge.id] ?? 0) + 1,
      }));
    }
  };

  const handleCheckBugFix = () => {
    const res = runPythonCode(currentBugCode, activeBug.sampleInput ?? '');
    const passed = !res.error && res.stdout.trim() === activeBug.expectedOutput.trim();
    setBugStatus((prev) => ({
      ...prev,
      [activeBug.id]: { passed, output: res.stdout.trim(), error: res.error },
    }));
    if (passed) {
      const bonusMultiplier = currentBugHints === 0 ? 1 : currentBugHints === 1 ? 0.75 : 0.5;
      onSolveBug(activeBug.id, Math.round(activeBug.xp * bonusMultiplier));
    }
  };

  const handleBsReset = (nextTarget = bsTarget) => {
    setBsTarget(nextTarget);
    setBsLow(0);
    setBsHigh(bsArray.length - 1);
    setBsSteps(0);
    setBsFound(null);
  };

  const handleBsStep = () => {
    if (bsFound !== null || bsLow > bsHigh) return;
    const mid = Math.floor((bsLow + bsHigh) / 2);
    setBsSteps((s) => s + 1);
    if (bsArray[mid] === bsTarget) {
      setBsFound(mid);
    } else if (bsArray[mid] < bsTarget) {
      setBsLow(mid + 1);
    } else {
      setBsHigh(mid - 1);
    }
  };

  const handleBubbleStep = () => {
    if (sortPointer.sorted) return;
    const arr = [...sortArr];
    const n = arr.length;
    let { i, j } = sortPointer;
    if (arr[j] > arr[j + 1]) {
      const tmp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = tmp;
      setSortArr(arr);
    }
    j++;
    if (j >= n - i - 1) {
      j = 0;
      i++;
    }
    const done = i >= n - 1;
    setSortPointer({ i, j, sorted: done });
  };

  const filteredChallenges = CODING_CHALLENGES.filter(
    (c) => diffFilter === 'All' || c.difficulty === diffFilter
  );

  const bsMid = bsLow <= bsHigh ? Math.floor((bsLow + bsHigh) / 2) : -1;

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#121614] border border-slate-200 dark:border-[#222925] max-w-full overflow-x-auto">
        {[
          { id: 'challenges' as PracticeMode, label: tr('Coding Challenges (12)', 'Coding Challenges (12)', 'કોડિંગ ચેલેન્જ (12)'), icon: Terminal },
          { id: 'bughunter' as PracticeMode, label: tr('Bug Hunter', 'Bug Hunter Game', 'બગ હન્ટર ગેમ'), icon: Bug },
          { id: 'dsa-viz' as PracticeMode, label: tr('DSA Visualizer', 'DSA Visualizer', 'DSA વિઝ્યુલાઇઝર'), icon: BarChart3 },
          { id: 'think-dev' as PracticeMode, label: tr('Think Like a Dev', 'Think Like a Dev', 'ડેવલપરની જેમ વિચારો'), icon: Wrench },
        ].map((item) => {
          const Icon = item.icon;
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeMode(item.id)}
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

      {/* MODULE 4: CODING CHALLENGES WITH TEST CASES */}
      {mode === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Challenge List */}
          <aside className="lg:col-span-4 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B]">
                {tr('Coding Challenges', 'Coding Challenges', 'કોડિંગ ચેલેન્જ')}
              </h2>
              <span className="text-xs font-mono font-bold tabular-nums text-emerald-700 dark:text-[#00F59B]">
                {progress.solvedChallengeIds.length}/{CODING_CHALLENGES.length}
              </span>
            </div>

            <div className="flex gap-1.5">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiffFilter(d)}
                  className={`flex-1 min-h-[36px] px-2 py-1 rounded-lg font-mono text-xs font-medium cursor-pointer ${
                    diffFilter === d
                      ? 'bg-emerald-600 dark:bg-[#00F59B] text-white dark:text-[#05130D] font-bold'
                      : 'bg-slate-100 dark:bg-[#171C19] border border-slate-200 dark:border-[#222925] text-slate-600 dark:text-[#98A39D]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredChallenges.map((ch) => {
                const isSolved = progress.solvedChallengeIds.includes(ch.id);
                const isSel = ch.id === activeChallenge.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setSelectedChallengeId(ch.id);
                      setRunResult(null);
                      setTestReports(null);
                      setChallengeTrace(null);
                    }}
                    className={`w-full min-h-[52px] px-3 py-2.5 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSel
                        ? 'bg-emerald-50 dark:bg-[#151D19] border-emerald-500/40 dark:border-[#00E58F]/50 text-emerald-900 dark:text-white font-semibold'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-[#171C19] text-slate-700 dark:text-[#98A39D]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm truncate">
                        {ch.number}. {pickText(ch.title, lang)}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-[#6F7A74] tabular-nums">
                        {ch.difficulty} · {ch.topic} · +{ch.xp} XP {ch.isDaily ? `· ${tr('Daily', 'Daily', 'દૈનિક')}` : ''}
                      </div>
                    </div>
                    {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00F59B] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Code Editor & Test Case Runner */}
          <section className="lg:col-span-8 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] rounded-xl p-5 sm:p-6 space-y-5">
            <div className="border-b border-slate-100 dark:border-[#1E2420] pb-4 space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B] tabular-nums">
                {activeChallenge.difficulty} // {activeChallenge.topic} // +{activeChallenge.xp} XP
                {activeChallenge.isDaily ? ` · ${tr("Today's Challenge", 'Aaj ka Challenge', 'આજનો ચેલેન્જ')}` : ''}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {pickText(activeChallenge.title, lang)}
              </h2>
              <p className="text-sm text-slate-700 dark:text-[#D5DDD8] pt-1">
                {pickText(activeChallenge.description, lang)}
              </p>
            </div>

            <CodeEditorWithToolbar
              ariaLabel="Python practice code editor"
              rows={9}
              lang={lang}
              filename="solution.py"
              value={currentCode}
              onChange={(val) => setCodeMap((p) => ({ ...p, [activeChallenge.id]: val }))}
              onReset={() => {
                setCodeMap((p) => ({ ...p, [activeChallenge.id]: activeChallenge.starterCode }));
                setRunResult(null);
                setTestReports(null);
                setChallengeTrace(null);
              }}
              resetLabel={t.resetCode}
            />

            {/* Custom Input + Run / Visualize / Submit Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4 space-y-1">
                <label htmlFor="custom-stdin" className="text-xs font-mono font-medium text-slate-600 dark:text-[#8A968F]">
                  {tr('Sample Input (for Run)', 'Sample Input (Run ke liye)', 'સેમ્પલ ઇનપુટ (Run માટે)')}
                </label>
                <textarea
                  id="custom-stdin"
                  rows={2}
                  value={currentStdin}
                  onChange={(e) => setCustomStdin((p) => ({ ...p, [activeChallenge.id]: e.target.value }))}
                  className="code-editor w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-50 dark:bg-[#090C0B] text-xs text-slate-900 dark:text-[#E6ECE8]"
                />
              </div>

              <div className="sm:col-span-8 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunCustom}
                  className="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 dark:border-[#2A332E] bg-white dark:bg-[#171C19] hover:bg-slate-50 dark:hover:bg-[#1E2521] text-slate-900 dark:text-[#E6ECE8] text-xs sm:text-sm font-mono font-medium inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Play className="w-4 h-4 text-emerald-700 dark:text-[#00F59B]" />
                  {t.runCode}
                </button>
                <button
                  type="button"
                  onClick={handleVisualizeChallenge}
                  className="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 dark:border-[#2A332E] bg-slate-100 dark:bg-[#171C19] hover:bg-slate-200 dark:hover:bg-[#1E2521] text-slate-900 dark:text-[#E6ECE8] text-xs sm:text-sm font-mono font-medium inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-emerald-700 dark:text-[#00F59B]" />
                  {tr('Visualize', 'Step Trace', 'સ્ટેપ ટ્રેસ')}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitTests}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs sm:text-sm font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t.submitSolution}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setHintsShown((p) => ({
                      ...p,
                      [activeChallenge.id]: Math.min(activeChallenge.hints.length, (p[activeChallenge.id] ?? 0) + 1),
                    }))
                  }
                  className="min-h-[44px] px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-[#171C19] text-amber-800 dark:text-amber-300 text-xs font-mono font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4" />
                  {t.showHint}
                </button>
              </div>
            </div>

            {challengeTrace && (
              <StepVisualizerPanel
                code={currentCode}
                trace={challengeTrace}
                lang={lang}
                onClose={() => setChallengeTrace(null)}
              />
            )}

            {/* Hints Display */}
            {(hintsShown[activeChallenge.id] ?? 0) > 0 && (
              <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-[#0D100F] border border-amber-200 dark:border-amber-500/30 space-y-1 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                {activeChallenge.hints.slice(0, hintsShown[activeChallenge.id]).map((h, idx) => (
                  <div key={idx}>
                    <strong>Hint {idx + 1}:</strong> {pickText(h, lang)}
                  </div>
                ))}
              </div>
            )}

            {/* Solution Reveal after 3 failed attempts */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-[#8A968F]">
              <span>
                {attemptsCount < 3
                  ? `${3 - attemptsCount} ${t.attemptsLeftForSolution}`
                  : tr(
                      'Solution unlocked! Study it carefully and type it yourself.',
                      'Solution unlock ho gaya! Ise samajh kar khud type karein.',
                      'ઉકેલ અનલોક થયો! તેને ધ્યાનથી સમજો અને જાતે ટાઇપ કરો.'
                    )}
              </span>
              {attemptsCount >= 3 && (
                <button
                  type="button"
                  onClick={() =>
                    setSolutionRevealed((p) => ({ ...p, [activeChallenge.id]: !p[activeChallenge.id] }))
                  }
                  className="min-h-[36px] px-3 py-1 rounded-lg border border-slate-200 dark:border-[#2A332E] text-xs font-mono font-semibold text-emerald-700 dark:text-[#00F59B] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {t.revealSolution}
                </button>
              )}
            </div>

            {solutionRevealed[activeChallenge.id] && (
              <pre className="p-4 rounded-lg bg-[#090C0B] text-[#00F59B] text-xs sm:text-sm overflow-x-auto border border-[#222925]">
                <code>{activeChallenge.solutionCode}</code>
              </pre>
            )}

            {/* Single Run Output */}
            {runResult && !challengeTrace && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-[#090C0B] text-[#E6ECE8] font-mono text-xs sm:text-sm whitespace-pre-wrap border border-[#222925]">
                  <div className="text-[#8A968F] mb-1">Output:</div>
                  {runResult.stdout || (runResult.error ? '' : tr('(No output printed)', '(Koi output print nahi hua)', '(કોઈ આઉટપુટ પ્રિન્ટ થયું નથી)'))}
                </div>
                {runResult.error && (
                  <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
                      <AlertTriangle className="w-4 h-4" />
                      {t.friendlyErrorTitle} ({runResult.error.type})
                    </div>
                    <p className="text-sm text-rose-900 dark:text-rose-200">
                      {getFriendlyPythonError(runResult.error, lang)}
                    </p>
                    <p className="text-xs font-mono text-rose-700 dark:text-rose-400">
                      {runResult.error.rawMessage}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Automatic Sample & Hidden Test Case Results */}
            {testReports && (
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#1E2420]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {testReports.every((r) => r.passed)
                    ? tr(
                        `All ${testReports.length} Test Cases Passed! (+${activeChallenge.xp} XP)`,
                        `Sabhi ${testReports.length} Test Cases Pass! (+${activeChallenge.xp} XP)`,
                        `બધા ${testReports.length} ટેસ્ટ કેસ પાસ થયા! (+${activeChallenge.xp} XP)`
                      )
                    : tr(
                        'Some Test Cases Need Fixing',
                        'Kuch Test Cases Abhi Pass Nahi Hue',
                        'કેટલાક ટેસ્ટ કેસ સુધારવાની જરૂર છે'
                      )}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {testReports.map((rep) => (
                    <div
                      key={rep.id}
                      className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                        rep.passed
                          ? 'bg-emerald-50/70 dark:bg-[#0D100F] border-emerald-200 dark:border-[#00E58F]/50'
                          : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-900 dark:text-white">{rep.label}</span>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            rep.passed ? 'text-emerald-700 dark:text-[#00F59B]' : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {rep.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {rep.passed ? t.passed : t.failed}
                        </span>
                      </div>

                      {!rep.isHidden ? (
                        <div className="font-mono space-y-0.5 text-[11px] text-slate-700 dark:text-[#D5DDD8]">
                          <div>Input: {rep.input.replace(/\n/g, ' | ')}</div>
                          <div>{t.expectedOutput}: {rep.expected.replace(/\n/g, ' | ')}</div>
                          {!rep.passed && <div>{t.actualOutput}: {rep.actual || '(empty)'}</div>}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-600 dark:text-[#8A968F]">
                          {rep.passed
                            ? tr('Hidden edge case passed!', 'Hidden test case pass hua!', 'હિડન એજ કેસ પાસ થયો!')
                            : tr(
                                `Hidden test failed (your output: ${rep.actual || 'empty'})`,
                                `Hidden test fail (aapka output: ${rep.actual || 'empty'})`,
                                `હિડન ટેસ્ટ ફેલ (તમારું આઉટપુટ: ${rep.actual || 'ખાલી'})`
                              )}
                        </div>
                      )}
                      {rep.errorMsg && <div className="text-rose-800 dark:text-rose-300 pt-1">{rep.errorMsg}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* MODULE 5A: BUG HUNTER GAME WITH EXPLAIN MY CODE */}
      {mode === 'bughunter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <aside className="lg:col-span-4 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-[#222925]">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {tr('Bug Hunter Levels', 'Bug Hunter Levels', 'બગ હન્ટર લેવલ્સ')}
              </h2>
              <span className="text-xs font-mono font-semibold tabular-nums text-emerald-700 dark:text-[#00F59B]">
                {progress.solvedBugIds.length}/{BUG_HUNTER_CHALLENGES.length}
              </span>
            </div>
            <div className="space-y-1">
              {BUG_HUNTER_CHALLENGES.map((bug) => {
                const isSolved = progress.solvedBugIds.includes(bug.id);
                const isSel = bug.id === activeBug.id;
                return (
                  <button
                    key={bug.id}
                    type="button"
                    onClick={() => setSelectedBugId(bug.id)}
                    className={`w-full min-h-[48px] px-3 py-2 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSel
                        ? 'bg-emerald-50 dark:bg-[#151D19] border-emerald-500/40 dark:border-[#00E58F]/50 text-emerald-900 dark:text-white font-semibold'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-[#171C19] text-slate-700 dark:text-[#98A39D]'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm">
                        <span className="font-mono text-emerald-700 dark:text-[#00F59B] mr-1">#{bug.number}</span>
                        {pickText(bug.title, lang)}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-[#6F7A74] tabular-nums">
                        {bug.difficulty} // +{bug.xp} XP
                      </div>
                    </div>
                    {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00F59B] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="lg:col-span-8 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-[#222925] pb-4">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B]">
                  BUG_0{activeBug.number} // {activeBug.difficulty} //{' '}
                  {tr(
                    'Solve without hints for 100% XP',
                    'Bina hint ke solve karne par 100% XP',
                    'હિન્ટ વગર સોલ્વ કરવા પર 100% XP'
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {pickText(activeBug.title, lang)}
                </h2>
              </div>
              <div className="text-xs font-mono bg-slate-100 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] px-3 py-2 rounded-lg text-slate-700 dark:text-[#D5DDD8]">
                {t.expectedOutput}: <strong className="text-emerald-700 dark:text-[#00F59B]">{activeBug.expectedOutput.replace(/\n/g, ' | ')}</strong>
              </div>
            </div>

            {activeBug.sampleInput && (
              <div className="text-xs font-mono text-slate-600 dark:text-[#8A968F]">
                {tr('Simulated Input:', 'Simulated Input:', 'સિમ્યુલેટેડ ઇનપુટ:')} {activeBug.sampleInput.replace(/\n/g, ' , ')}
              </div>
            )}

            <CodeEditorWithToolbar
              ariaLabel="Bug Hunter code editor"
              rows={7}
              lang={lang}
              filename={`bug_${activeBug.number}.py`}
              value={currentBugCode}
              onChange={(val) => setBugCodeMap((p) => ({ ...p, [activeBug.id]: val }))}
              onReset={() => setBugCodeMap((p) => ({ ...p, [activeBug.id]: activeBug.buggyCode }))}
              resetLabel={t.resetCode}
            />

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCheckBugFix}
                className="min-h-[44px] px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs font-mono font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Bug className="w-4 h-4" />
                {tr('Fix & Test Bug', 'Bug Fix & Test Karein', 'બગ ફિક્સ અને ટેસ્ટ કરો')}
              </button>
              <button
                type="button"
                onClick={() =>
                  setBugExplainShown((p) => ({ ...p, [activeBug.id]: !p[activeBug.id] }))
                }
                className="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-100 hover:bg-slate-200 dark:bg-[#171C19] dark:hover:bg-[#1E2521] text-slate-800 dark:text-[#D5DDD8] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-700 dark:text-[#00F59B]" />
                {tr('Explain My Code', 'Mera Code Samjhayein', 'મારો કોડ સમજાવો')}
              </button>
              <button
                type="button"
                onClick={() =>
                  setBugHintsShown((p) => ({
                    ...p,
                    [activeBug.id]: Math.min(activeBug.hints.length, (p[activeBug.id] ?? 0) + 1),
                  }))
                }
                className="min-h-[44px] px-3.5 py-2 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                {t.showHint} ({currentBugHints}/{activeBug.hints.length})
              </button>
            </div>

            {bugExplainShown[activeBug.id] && (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] text-xs sm:text-sm text-slate-800 dark:text-[#D5DDD8] space-y-1">
                <div className="font-mono font-semibold text-emerald-700 dark:text-[#00F59B]">
                  {tr('Line-by-Line Diagnostic', 'Line-by-Line Diagnostic', 'લાઇન-બાય-લાઇન ડાયગ્નોસ્ટિક')}
                </div>
                <p>{diagnoseUserBugCode(currentBugCode, activeBug.fixedCode, bugStatus[activeBug.id], lang)}</p>
              </div>
            )}

            {currentBugHints > 0 && (
              <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                {activeBug.hints.slice(0, currentBugHints).map((h, i) => (
                  <div key={i}>
                    <strong>Hint {i + 1}:</strong> {pickText(h, lang)}
                  </div>
                ))}
              </div>
            )}

            {bugStatus[activeBug.id] && (
              <div className="space-y-4">
                {bugStatus[activeBug.id].passed ? (
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-[#151D19] border border-emerald-200 dark:border-[#00E58F]/40 space-y-3">
                    <div className="text-sm font-bold text-emerald-800 dark:text-[#00F59B]">
                      {tr('Bug Squashed! Great debugging.', 'Bug Fix Ho Gaya! Bahut Badhiya.', 'બગ દૂર થઈ ગયો! સરસ ડિબગિંગ.')}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-[#D5DDD8]">
                      <strong>{tr('Why it happened:', 'Ye bug kyun aaya:', 'આ બગ કેમ આવ્યો:')}</strong> {pickText(activeBug.whyItHappened, lang)}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-lg bg-white dark:bg-[#090C0B] border border-rose-200 dark:border-rose-800/60">
                        <div className="text-rose-600 dark:text-rose-400 font-semibold mb-1">{tr('Before (Buggy)', 'Pehle (Buggy)', 'પહેલાં (Buggy)')}</div>
                        <pre className="whitespace-pre-wrap text-slate-700 dark:text-[#98A39D]">{activeBug.buggyCode}</pre>
                      </div>
                      <div className="p-3 rounded-lg bg-white dark:bg-[#090C0B] border border-emerald-200 dark:border-[#00E58F]/40">
                        <div className="text-emerald-600 dark:text-[#00F59B] font-semibold mb-1">{tr('After (Clean)', 'Baad mein (Clean)', 'પછી (Clean)')}</div>
                        <pre className="whitespace-pre-wrap text-slate-700 dark:text-[#D5DDD8]">{activeBug.fixedCode}</pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-1 text-xs sm:text-sm">
                    <div className="font-bold text-rose-800 dark:text-rose-300">
                      {bugStatus[activeBug.id].error
                        ? `${bugStatus[activeBug.id].error!.type}: ${getFriendlyPythonError(bugStatus[activeBug.id].error!, lang)}`
                        : `${t.actualOutput}: "${bugStatus[activeBug.id].output}" (${t.expectedOutput}: "${activeBug.expectedOutput}")`}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {/* MODULE 5C: INTERACTIVE DSA & MEMORY VISUALIZER */}
      {mode === 'dsa-viz' && (
        <div className="bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] rounded-xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-[#222925] pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {tr('Interactive DSA & Complexity Lab', 'Interactive DSA & Complexity Lab', 'ઇન્ટરેક્ટિવ DSA અને કોમ્પ્લેક્સિટી લેબ')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A968F] mt-0.5">
                {tr(
                  'Tap step-by-step to watch pointers, stacks, queues, and sorting in action.',
                  'Step-by-step tap kar ke Binary Search, Stack, Queue aur Sorting live dekhein.',
                  'સ્ટેપ-બાય-સ્ટેપ ટેપ કરીને Binary Search, Stack, Queue અને Sorting લાઇવ જુઓ.'
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'binary-search' as const, label: 'Binary Search O(log n)' },
                { id: 'stack-queue' as const, label: 'Stack & Queue' },
                { id: 'bubble-sort' as const, label: 'Bubble Sort O(n^2)' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setDsaTool(tool.id)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold cursor-pointer ${
                    dsaTool === tool.id
                      ? 'bg-emerald-600 dark:bg-[#00F59B] border-emerald-600 dark:border-[#00F59B] text-white dark:text-[#05130D]'
                      : 'bg-slate-100 dark:bg-[#171C19] border-slate-200 dark:border-[#2A332E] text-slate-700 dark:text-[#D5DDD8] hover:dark:bg-[#1E2521]'
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </div>

          {/* 1. Binary Search Visualizer */}
          {dsaTool === 'binary-search' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-[#8A968F]">
                    {tr('Pick Target:', 'Target Chunein:', 'ટાર્ગેટ પસંદ કરો:')}
                  </span>
                  {[10, 30, 50, 70, 90, 55].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleBsReset(num)}
                      className={`min-h-[36px] px-3 py-1 rounded-lg border font-mono text-xs font-semibold cursor-pointer ${
                        bsTarget === num
                          ? 'bg-amber-500 border-amber-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-[#0D100F] border-slate-200 dark:border-[#222925] text-slate-700 dark:text-[#D5DDD8]'
                      }`}
                    >
                      {num}{num === 55 ? ` (${tr('Missing', 'Missing', 'નથી')})` : ''}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={bsFound !== null || bsLow > bsHigh}
                    onClick={handleBsStep}
                    className="min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] disabled:opacity-40 text-white dark:text-[#05130D] text-xs font-mono font-bold cursor-pointer"
                  >
                    {tr('Next Step (Check Mid)', 'Agla Step (Check Mid)', 'આગળનું સ્ટેપ (Mid તપાસો)')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBsReset()}
                    className="min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-100 dark:bg-[#171C19] text-slate-700 dark:text-[#D5DDD8] text-xs font-medium cursor-pointer"
                  >
                    {t.resetCode}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {bsArray.map((val, idx) => {
                  const inRange = idx >= bsLow && idx <= bsHigh;
                  const isMid = idx === bsMid && bsFound === null;
                  const isMatch = bsFound === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        isMatch
                          ? 'bg-emerald-600 dark:bg-[#00F59B] text-white dark:text-[#05130D] border-emerald-500 dark:border-[#00F59B] font-bold'
                          : isMid
                          ? 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300 font-bold'
                          : inRange
                          ? 'bg-slate-50 dark:bg-[#151D19] border-emerald-500/40 dark:border-[#00E58F]/40 text-slate-900 dark:text-white'
                          : 'bg-slate-100 dark:bg-[#090C0B] border-slate-200 dark:border-[#222925] opacity-35'
                      }`}
                    >
                      <div className="text-[10px] font-mono opacity-75">idx {idx}</div>
                      <div className="text-base font-mono font-bold tabular-nums">{val}</div>
                      <div className="text-[10px] font-mono mt-1 min-h-[14px]">
                        {idx === bsLow ? 'L ' : ''}
                        {isMid ? 'MID ' : ''}
                        {idx === bsHigh ? 'H' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] text-xs sm:text-sm text-slate-800 dark:text-[#D5DDD8] flex flex-wrap items-center justify-between gap-2">
                <span>
                  {bsFound !== null
                    ? tr(
                        `Found ${bsTarget} at index ${bsFound} in just ${bsSteps} comparisons!`,
                        `${bsTarget} index ${bsFound} par sirf ${bsSteps} steps mein mil gaya!`,
                        `${bsTarget} ઇન્ડેક્સ ${bsFound} પર માત્ર ${bsSteps} સ્ટેપ્સમાં મળી ગયું!`
                      )
                    : bsLow > bsHigh
                    ? tr(
                        `${bsTarget} is NOT in the list (stopped after ${bsSteps} comparisons -> return -1).`,
                        `${bsTarget} list mein nahi hai (${bsSteps} steps baad -1 return).`,
                        `${bsTarget} લિસ્ટમાં નથી (${bsSteps} સ્ટેપ્સ પછી -1 રિટર્ન).`
                      )
                    : tr(
                        `Active window: [${bsLow}..${bsHigh}], checking mid=${bsMid} (value ${bsArray[bsMid]})`,
                        `Active range: [${bsLow}..${bsHigh}], abhi mid=${bsMid} (value ${bsArray[bsMid]}) check hoga`,
                        `સક્રિય રેન્જ: [${bsLow}..${bsHigh}], હાલમાં mid=${bsMid} (વેલ્યુ ${bsArray[bsMid]}) તપાસી રહ્યા છીએ`
                      )}
                </span>
                <span className="font-mono text-emerald-700 dark:text-[#00F59B] font-semibold tabular-nums">
                  Steps: {bsSteps} · Max O(log 9) = 4
                </span>
              </div>
            </div>
          )}

          {/* 2. Stack & Queue Visualizer */}
          {dsaTool === 'stack-queue' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  maxLength={14}
                  value={sqInput}
                  onChange={(e) => setSqInput(e.target.value)}
                  className="min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#222925] bg-slate-50 dark:bg-[#0D100F] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-[#00F59B]"
                  placeholder="Item name"
                />
                <button
                  type="button"
                  onClick={() => {
                    const label = sqInput.trim() || `Item_${sqItems.length + 1}`;
                    setSqItems((prev) => [...prev, label]);
                    setSqLog(`append("${label}") -> added to end / top`);
                  }}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs font-mono font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Push / Enqueue (.append)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (sqItems.length === 0) return;
                    const popped = sqItems[sqItems.length - 1];
                    setSqItems((prev) => prev.slice(0, -1));
                    setSqLog(`Stack .pop() -> removed LAST item "${popped}" (LIFO)`);
                  }}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Stack Pop (LIFO)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (sqItems.length === 0) return;
                    const first = sqItems[0];
                    setSqItems((prev) => prev.slice(1));
                    setSqLog(`Queue .pop(0) -> served FIRST item "${first}" (FIFO)`);
                  }}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-100 dark:bg-[#171C19] text-slate-800 dark:text-[#D5DDD8] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  Queue Dequeue (FIFO)
                </button>
              </div>

              <div className="p-4 rounded-lg bg-[#090C0B] border border-[#222925] flex flex-wrap items-center gap-2 min-h-[72px]">
                {sqItems.length === 0 ? (
                  <span className="text-xs font-mono text-[#6F7A74]">[] Empty list</span>
                ) : (
                  sqItems.map((item, idx) => (
                    <div
                      key={`${item}-${idx}`}
                      className="px-3 py-2 rounded-lg bg-[#121614] border border-[#00E58F]/40 text-xs font-mono text-white"
                    >
                      <span className="text-[#6F7A74] mr-1.5">[{idx}]</span>
                      <strong>{item}</strong>
                      {idx === 0 && <span className="ml-1.5 text-[10px] text-amber-400">FRONT</span>}
                      {idx === sqItems.length - 1 && <span className="ml-1.5 text-[10px] text-[#00F59B]">TOP</span>}
                    </div>
                  ))
                )}
              </div>

              <div className="text-xs font-mono text-emerald-700 dark:text-[#00F59B]">
                Action Log: {sqLog}
              </div>
            </div>
          )}

          {/* 3. Bubble Sort Visualizer */}
          {dsaTool === 'bubble-sort' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-slate-600 dark:text-[#8A968F]">
                  {sortPointer.sorted
                    ? tr(
                        'Sorting complete! Largest numbers bubbled to the right.',
                        'Sorting complete! Sabse bade numbers right mein aa gaye.',
                        'સોર્ટિંગ પૂર્ણ થયું! સૌથી મોટી સંખ્યાઓ જમણી બાજુ ગોઠવાઈ ગઈ.'
                      )
                    : tr(
                        `Comparing index ${sortPointer.j} (${sortArr[sortPointer.j]}) and ${sortPointer.j + 1} (${sortArr[sortPointer.j + 1]})`,
                        `Index ${sortPointer.j} (${sortArr[sortPointer.j]}) aur ${sortPointer.j + 1} (${sortArr[sortPointer.j + 1]}) compare ho rahe hain`,
                        `ઇન્ડેક્સ ${sortPointer.j} (${sortArr[sortPointer.j]}) અને ${sortPointer.j + 1} (${sortArr[sortPointer.j + 1]}) ની સરખામણી થઈ રહી છે`
                      )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={sortPointer.sorted}
                    onClick={handleBubbleStep}
                    className="min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] disabled:opacity-40 text-white dark:text-[#05130D] text-xs font-mono font-bold cursor-pointer"
                  >
                    {tr('Next Compare/Swap', 'Agla Compare/Swap', 'આગળ Compare/Swap')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortArr([64, 25, 42, 12, 55, 19]);
                      setSortPointer({ i: 0, j: 0, sorted: false });
                    }}
                    className="min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-100 dark:bg-[#171C19] text-slate-700 dark:text-[#D5DDD8] text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {t.resetCode}
                  </button>
                </div>
              </div>

              <div className="h-48 p-4 rounded-lg bg-[#090C0B] border border-[#222925] flex items-end justify-center gap-3">
                {sortArr.map((val, idx) => {
                  const isComparing = !sortPointer.sorted && (idx === sortPointer.j || idx === sortPointer.j + 1);
                  const isLockedSorted = idx >= sortArr.length - sortPointer.i;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[68px]">
                      <span className="text-xs font-mono text-[#D5DDD8] tabular-nums">{val}</span>
                      <div
                        className={`w-full rounded-t-md transition-all duration-200 ${
                          sortPointer.sorted || isLockedSorted
                            ? 'bg-[#00F59B]'
                            : isComparing
                            ? 'bg-amber-400'
                            : 'bg-emerald-600/80 dark:bg-[#1E4D3B]'
                        }`}
                        style={{ height: `${Math.max(24, val * 2)}px` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Big-O Reference Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-[#222925] text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925]">
              <strong className="text-emerald-700 dark:text-[#00F59B] font-mono">O(1) Instant</strong>
              <p className="text-slate-600 dark:text-[#8A968F] mt-0.5">
                {tr(
                  'Dict key lookup, list `.append()`, array index `arr[i]`',
                  'Dict key lookup, list `.append()`, array index `arr[i]`',
                  'Dict કી લુકઅપ, લિસ્ટ `.append()`, એરે ઇન્ડેક્સ `arr[i]`'
                )}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925]">
              <strong className="text-emerald-700 dark:text-[#00E58F] font-mono">O(log n) Fast Halving</strong>
              <p className="text-slate-600 dark:text-[#8A968F] mt-0.5">
                {tr(
                  'Binary Search checks 1,000,000 sorted items in ~20 steps',
                  'Binary Search 10 lakh sorted items mein sirf ~20 steps mein dhundh leta hai',
                  'Binary Search 10 લાખ સોર્ટેડ આઇટમ્સમાંથી માત્ર ~20 સ્ટેપ્સમાં શોધી લે છે'
                )}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925]">
              <strong className="text-amber-700 dark:text-amber-400 font-mono">O(n) / O(n^2) Loops</strong>
              <p className="text-slate-600 dark:text-[#8A968F] mt-0.5">
                {tr(
                  'Single loop scan is O(n); nested Bubble Sort is O(n^2)',
                  'Single loop scan O(n) hai; nested Bubble Sort O(n^2) hai',
                  'સિંગલ લૂપ સ્કેન O(n) છે; નેસ્ટેડ Bubble Sort O(n^2) છે'
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5B: THINK LIKE A DEVELOPER */}
      {mode === 'think-dev' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {THINK_LIKE_DEV_GUIDES.map((guide, gIdx) => (
            <article
              key={guide.id}
              className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] space-y-3"
            >
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B]">
                DEV_MINDSET_0{gIdx + 1}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {pickText(guide.title, lang)}
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#8A968F] leading-relaxed">
                {pickText(guide.summary, lang)}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-[#D5DDD8] pt-1">
                {guide.steps.map((s, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925]">
                    {pickText(s, lang)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
