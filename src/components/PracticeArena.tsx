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
import { Language, PracticeMode, UserProgress } from '../types';
import { PythonRunResult, runPythonCode, TraceStep } from '../utils/pythonRunner';
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
    return `${linePrefix}${lang === 'hi' ? err.friendlyHi : err.friendlyEn}`;
  }
  const userLines = userCode.split('\n').map((l) => l.trimEnd());
  const fixedLines = expectedFixedCode.split('\n').map((l) => l.trimEnd());
  for (let i = 0; i < Math.max(userLines.length, fixedLines.length); i++) {
    const u = (userLines[i] ?? '').trim();
    const f = (fixedLines[i] ?? '').trim();
    if (u !== f) {
      return lang === 'en'
        ? `Check Line ${i + 1}: currently \`${u || '(empty)'}\`. Compare variables, operators, or loop bounds carefully with what the expected output requires.`
        : `Line ${i + 1} check karein: abhi \`${u || '(empty)'}\` likha hai. Is line mein variable, operator (\`==\` vs \`=\`) ya range check karein.`;
    }
  }
  return lang === 'en'
    ? 'Code runs without crashing, so compare your printed value against Expected Output line by line.'
    : 'Code bina error ke chal raha hai — apna output Expected Output se line-by-line match karein.';
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
        errorMsg: res.error ? (lang === 'hi' ? res.error.friendlyHi : res.error.friendlyEn) : undefined,
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
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        {[
          { id: 'challenges' as PracticeMode, label: lang === 'en' ? 'Coding Challenges (12)' : 'Coding Challenges (12)', icon: Terminal },
          { id: 'bughunter' as PracticeMode, label: lang === 'en' ? 'Bug Hunter' : 'Bug Hunter Game', icon: Bug },
          { id: 'dsa-viz' as PracticeMode, label: lang === 'en' ? 'DSA Visualizer' : 'DSA Visualizer', icon: BarChart3 },
          { id: 'think-dev' as PracticeMode, label: lang === 'en' ? 'Think Like a Dev' : 'Think Like a Dev', icon: Wrench },
        ].map((item) => {
          const Icon = item.icon;
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeMode(item.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

      {/* MODULE 4: CODING CHALLENGES WITH TEST CASES */}
      {mode === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Challenge List */}
          <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {lang === 'en' ? 'Coding Challenges' : 'Coding Challenges'}
              </h2>
              <span className="text-xs font-mono tabular-nums text-teal-600 dark:text-teal-400">
                {progress.solvedChallengeIds.length}/{CODING_CHALLENGES.length}
              </span>
            </div>

            <div className="flex gap-1.5">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiffFilter(d)}
                  className={`flex-1 min-h-[36px] px-2 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                    diffFilter === d
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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
                    className={`w-full min-h-[52px] px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSel
                        ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm truncate">
                        {ch.number}. {ch.title[lang]}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {ch.difficulty} · {ch.topic} · +{ch.xp} XP {ch.isDaily ? '· Daily' : ''}
                      </div>
                    </div>
                    {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Code Editor & Test Case Runner */}
          <section className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-1">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {activeChallenge.difficulty} · {activeChallenge.topic} · +{activeChallenge.xp} XP
                {activeChallenge.isDaily ? ' · Today’s Challenge' : ''}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {activeChallenge.title[lang]}
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 pt-1">
                {activeChallenge.description[lang]}
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
                <label htmlFor="custom-stdin" className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {lang === 'en' ? 'Sample Input (for Run)' : 'Sample Input (Run ke liye)'}
                </label>
                <textarea
                  id="custom-stdin"
                  rows={2}
                  value={currentStdin}
                  onChange={(e) => setCustomStdin((p) => ({ ...p, [activeChallenge.id]: e.target.value }))}
                  className="code-editor w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-8 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunCustom}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Play className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  {t.runCode}
                </button>
                <button
                  type="button"
                  onClick={handleVisualizeChallenge}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  {lang === 'en' ? 'Visualize' : 'Step Trace'}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitTests}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
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
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
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
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                {activeChallenge.hints.slice(0, hintsShown[activeChallenge.id]).map((h, idx) => (
                  <div key={idx}>
                    <strong>Hint {idx + 1}:</strong> {h[lang]}
                  </div>
                ))}
              </div>
            )}

            {/* Solution Reveal after 3 failed attempts */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>
                {attemptsCount < 3
                  ? `${3 - attemptsCount} ${t.attemptsLeftForSolution}`
                  : lang === 'en'
                  ? 'Solution unlocked! Study it carefully and type it yourself.'
                  : 'Solution unlock ho gaya! Ise samajh kar khud type karein.'}
              </span>
              {attemptsCount >= 3 && (
                <button
                  type="button"
                  onClick={() =>
                    setSolutionRevealed((p) => ({ ...p, [activeChallenge.id]: !p[activeChallenge.id] }))
                  }
                  className="min-h-[36px] px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-teal-700 dark:text-teal-300 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {t.revealSolution}
                </button>
              )}
            </div>

            {solutionRevealed[activeChallenge.id] && (
              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 text-xs sm:text-sm overflow-x-auto border border-slate-700">
                <code>{activeChallenge.solutionCode}</code>
              </pre>
            )}

            {/* Single Run Output */}
            {runResult && !challengeTrace && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm whitespace-pre-wrap border border-slate-800">
                  <div className="text-slate-400 mb-1">Output:</div>
                  {runResult.stdout || (runResult.error ? '' : '(No output printed)')}
                </div>
                {runResult.error && (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
                      <AlertTriangle className="w-4 h-4" />
                      {t.friendlyErrorTitle} ({runResult.error.type})
                    </div>
                    <p className="text-sm text-rose-900 dark:text-rose-200">
                      {lang === 'hi' ? runResult.error.friendlyHi : runResult.error.friendlyEn}
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
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  {testReports.every((r) => r.passed)
                    ? lang === 'en'
                      ? `All ${testReports.length} Test Cases Passed! (+${activeChallenge.xp} XP)`
                      : `Sabhi ${testReports.length} Test Cases Pass! (+${activeChallenge.xp} XP)`
                    : lang === 'en'
                    ? 'Some Test Cases Need Fixing'
                    : 'Kuch Test Cases Abhi Pass Nahi Hue'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {testReports.map((rep) => (
                    <div
                      key={rep.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        rep.passed
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-900 dark:text-slate-100">{rep.label}</span>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            rep.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {rep.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {rep.passed ? t.passed : t.failed}
                        </span>
                      </div>

                      {!rep.isHidden ? (
                        <div className="font-mono space-y-0.5 text-[11px] text-slate-700 dark:text-slate-300">
                          <div>Input: {rep.input.replace(/\n/g, ' | ')}</div>
                          <div>{t.expectedOutput}: {rep.expected.replace(/\n/g, ' | ')}</div>
                          {!rep.passed && <div>{t.actualOutput}: {rep.actual || '(empty)'}</div>}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-600 dark:text-slate-400">
                          {rep.passed
                            ? lang === 'en'
                              ? 'Hidden edge case passed!'
                              : 'Hidden test case pass hua!'
                            : lang === 'en'
                            ? `Hidden test failed (your output: ${rep.actual || 'empty'})`
                            : `Hidden test fail (aapka output: ${rep.actual || 'empty'})`}
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
          <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {lang === 'en' ? 'Bug Hunter Levels' : 'Bug Hunter Levels'}
              </h2>
              <span className="text-xs font-mono tabular-nums text-teal-600 dark:text-teal-400">
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
                    className={`w-full min-h-[48px] px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2 cursor-pointer ${
                      isSel
                        ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm">
                        #{bug.number} {bug.title[lang]}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {bug.difficulty} · +{bug.xp} XP
                      </div>
                    </div>
                    {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Bug #{activeBug.number} · {activeBug.difficulty} ·{' '}
                  {lang === 'en' ? 'Solve without hints for 100% XP' : 'Bina hint ke solve karne par 100% XP'}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                  {activeBug.title[lang]}
                </h2>
              </div>
              <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200">
                Expected Output: <strong>{activeBug.expectedOutput.replace(/\n/g, ' | ')}</strong>
              </div>
            </div>

            {activeBug.sampleInput && (
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Simulated Input: {activeBug.sampleInput.replace(/\n/g, ' , ')}
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
                className="min-h-[44px] px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Bug className="w-4 h-4" />
                {lang === 'en' ? 'Fix & Test Bug' : 'Bug Fix & Test Karein'}
              </button>
              <button
                type="button"
                onClick={() =>
                  setBugExplainShown((p) => ({ ...p, [activeBug.id]: !p[activeBug.id] }))
                }
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                {lang === 'en' ? 'Explain My Code' : 'Mera Code Samjhayein'}
              </button>
              <button
                type="button"
                onClick={() =>
                  setBugHintsShown((p) => ({
                    ...p,
                    [activeBug.id]: Math.min(activeBug.hints.length, (p[activeBug.id] ?? 0) + 1),
                  }))
                }
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                {t.showHint} ({currentBugHints}/{activeBug.hints.length})
              </button>
            </div>

            {bugExplainShown[activeBug.id] && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-1">
                <div className="font-semibold text-teal-700 dark:text-teal-400">
                  {lang === 'en' ? 'Line-by-Line Diagnostic' : 'Line-by-Line Diagnostic'}
                </div>
                <p>{diagnoseUserBugCode(currentBugCode, activeBug.fixedCode, bugStatus[activeBug.id], lang)}</p>
              </div>
            )}

            {currentBugHints > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                {activeBug.hints.slice(0, currentBugHints).map((h, i) => (
                  <div key={i}>
                    <strong>Hint {i + 1}:</strong> {h[lang]}
                  </div>
                ))}
              </div>
            )}

            {bugStatus[activeBug.id] && (
              <div className="space-y-4">
                {bugStatus[activeBug.id].passed ? (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                    <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                      {lang === 'en' ? 'Bug Squashed! Great debugging.' : 'Bug Fix Ho Gaya! Bahut Badhiya.'}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                      <strong>{lang === 'en' ? 'Why it happened:' : 'Ye bug kyun aaya:'}</strong> {activeBug.whyItHappened[lang]}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800">
                        <div className="text-rose-600 font-semibold mb-1">Before (Buggy)</div>
                        <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{activeBug.buggyCode}</pre>
                      </div>
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800">
                        <div className="text-emerald-600 font-semibold mb-1">After (Clean)</div>
                        <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{activeBug.fixedCode}</pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1 text-xs sm:text-sm">
                    <div className="font-bold text-rose-800 dark:text-rose-300">
                      {bugStatus[activeBug.id].error
                        ? `${bugStatus[activeBug.id].error!.type}: ${
                            lang === 'hi'
                              ? bugStatus[activeBug.id].error!.friendlyHi
                              : bugStatus[activeBug.id].error!.friendlyEn
                          }`
                        : `${t.actualOutput}: "${bugStatus[activeBug.id].output}" (Expected: "${activeBug.expectedOutput}")`}
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {lang === 'en' ? 'Interactive DSA & Complexity Lab' : 'Interactive DSA & Complexity Lab'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                {lang === 'en'
                  ? 'Tap step-by-step to watch pointers, stacks, queues, and sorting in action.'
                  : 'Step-by-step tap kar ke Binary Search, Stack, Queue aur Sorting live dekhein.'}
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
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    dsaTool === tool.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {lang === 'en' ? 'Pick Target:' : 'Target Chunein:'}
                  </span>
                  {[10, 30, 50, 70, 90, 55].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleBsReset(num)}
                      className={`min-h-[36px] px-3 py-1 rounded-lg font-mono text-xs font-semibold cursor-pointer ${
                        bsTarget === num
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {num}{num === 55 ? ' (Missing)' : ''}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={bsFound !== null || bsLow > bsHigh}
                    onClick={handleBsStep}
                    className="min-h-[40px] px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer"
                  >
                    {lang === 'en' ? 'Next Step (Check Mid)' : 'Agla Step (Check Mid)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBsReset()}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Reset
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
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isMatch
                          ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                          : isMid
                          ? 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300 font-bold'
                          : inRange
                          ? 'bg-slate-50 dark:bg-slate-800 border-teal-500/40 text-slate-900 dark:text-slate-100'
                          : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-35'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">idx {idx}</div>
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

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span>
                  {bsFound !== null
                    ? lang === 'en'
                      ? `Found ${bsTarget} at index ${bsFound} in just ${bsSteps} comparisons!`
                      : `${bsTarget} index ${bsFound} par sirf ${bsSteps} steps mein mil gaya!`
                    : bsLow > bsHigh
                    ? lang === 'en'
                      ? `${bsTarget} is NOT in the list (stopped after ${bsSteps} comparisons -> return -1).`
                      : `${bsTarget} list mein nahi hai (${bsSteps} steps baad -1 return).`
                    : lang === 'en'
                    ? `Active window: [${bsLow}..${bsHigh}], checking mid=${bsMid} (value ${bsArray[bsMid]})`
                    : `Active range: [${bsLow}..${bsHigh}], abhi mid=${bsMid} (value ${bsArray[bsMid]}) check hoga`}
                </span>
                <span className="font-mono text-teal-700 dark:text-teal-400 font-semibold">
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
                  className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100"
                  placeholder="Item name"
                />
                <button
                  type="button"
                  onClick={() => {
                    const label = sqInput.trim() || `Item_${sqItems.length + 1}`;
                    setSqItems((prev) => [...prev, label]);
                    setSqLog(`append("${label}") -> added to end / top`);
                  }}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
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
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
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
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  Queue Dequeue (FIFO)
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-2 min-h-[72px]">
                {sqItems.length === 0 ? (
                  <span className="text-xs font-mono text-slate-400">[] Empty list</span>
                ) : (
                  sqItems.map((item, idx) => (
                    <div
                      key={`${item}-${idx}`}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-teal-500/40 text-xs font-mono text-slate-100"
                    >
                      <span className="text-slate-400 mr-1.5">[{idx}]</span>
                      <strong>{item}</strong>
                      {idx === 0 && <span className="ml-1.5 text-[10px] text-amber-400">FRONT</span>}
                      {idx === sqItems.length - 1 && <span className="ml-1.5 text-[10px] text-teal-400">TOP</span>}
                    </div>
                  ))
                )}
              </div>

              <div className="text-xs font-mono text-teal-700 dark:text-teal-400">
                Action Log: {sqLog}
              </div>
            </div>
          )}

          {/* 3. Bubble Sort Visualizer */}
          {dsaTool === 'bubble-sort' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {sortPointer.sorted
                    ? lang === 'en'
                      ? 'Sorting complete! Largest numbers bubbled to the right.'
                      : 'Sorting complete! Sabse bade numbers right mein aa gaye.'
                    : lang === 'en'
                    ? `Comparing index ${sortPointer.j} (${sortArr[sortPointer.j]}) and ${sortPointer.j + 1} (${sortArr[sortPointer.j + 1]})`
                    : `Index ${sortPointer.j} (${sortArr[sortPointer.j]}) aur ${sortPointer.j + 1} (${sortArr[sortPointer.j + 1]}) compare ho rahe hain`}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={sortPointer.sorted}
                    onClick={handleBubbleStep}
                    className="min-h-[40px] px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer"
                  >
                    {lang === 'en' ? 'Next Compare/Swap' : 'Agla Compare/Swap'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortArr([64, 25, 42, 12, 55, 19]);
                      setSortPointer({ i: 0, j: 0, sorted: false });
                    }}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="h-48 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-end justify-center gap-3">
                {sortArr.map((val, idx) => {
                  const isComparing = !sortPointer.sorted && (idx === sortPointer.j || idx === sortPointer.j + 1);
                  const isLockedSorted = idx >= sortArr.length - sortPointer.i;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[68px]">
                      <span className="text-xs font-mono text-slate-200 tabular-nums">{val}</span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-200 ${
                          sortPointer.sorted || isLockedSorted
                            ? 'bg-emerald-500'
                            : isComparing
                            ? 'bg-amber-400'
                            : 'bg-teal-600'
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <strong className="text-emerald-700 dark:text-emerald-400 font-mono">O(1) Instant</strong>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Dict key lookup, list `.append()`, array index `arr[i]`
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <strong className="text-teal-700 dark:text-teal-400 font-mono">O(log n) Fast Halving</strong>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Binary Search checks 1,000,000 sorted items in ~20 steps
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <strong className="text-amber-700 dark:text-amber-400 font-mono">O(n) / O(n^2) Loops</strong>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Single loop scan is O(n); nested Bubble Sort is O(n^2)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5B: THINK LIKE A DEVELOPER */}
      {mode === 'think-dev' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {THINK_LIKE_DEV_GUIDES.map((guide) => (
            <article
              key={guide.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50">
                {guide.title[lang]}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {guide.summary[lang]}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 pt-1">
                {guide.steps.map((s, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    {s[lang]}
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
