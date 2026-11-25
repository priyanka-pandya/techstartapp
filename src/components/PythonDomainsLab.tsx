import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  Copy,
  Globe,
  Play,
  Server,
  Terminal,
} from 'lucide-react';
import { PYTHON_DOMAIN_TRACKS } from '../data/pythonDomains';
import { UI_TEXT } from '../data/translations';
import { Language, PythonDomainId, UserProgress, pickText } from '../types';
import { getFriendlyPythonError, runPythonCode } from '../utils/pythonRunner';
import { CodeEditorWithToolbar } from './CodeEditorWithToolbar';

interface PythonDomainsLabProps {
  lang: Language;
  progress: UserProgress;
  onCompleteLibrary: (libId: string, xp: number) => void;
  initialDomainId?: PythonDomainId;
}

const DOMAIN_ICONS: Record<PythonDomainId, React.ComponentType<{ className?: string }>> = {
  'data-science': BarChart3,
  'ml-ai': Brain,
  'web-apis': Server,
  'web-scraping': Globe,
};

export const PythonDomainsLab: React.FC<PythonDomainsLabProps> = ({
  lang,
  progress,
  onCompleteLibrary,
  initialDomainId,
}) => {
  const t = UI_TEXT[lang];
  const tr = (en: string, hi: string, gu: string) => (lang === 'gu' ? gu : lang === 'hi' ? hi : en);

  const [selectedDomainId, setSelectedDomainId] = useState<PythonDomainId>(
    initialDomainId || 'data-science'
  );
  const activeDomain =
    PYTHON_DOMAIN_TRACKS.find((d) => d.id === selectedDomainId) || PYTHON_DOMAIN_TRACKS[0];

  const [selectedLibId, setSelectedLibId] = useState<string>(activeDomain.libraries[0].id);
  const [copiedPip, setCopiedPip] = useState(false);

  // Interactive Domain Simulator states
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [mlHours, setMlHours] = useState<number>(5);
  const [apiEndpoint, setApiEndpoint] = useState<'health' | 'order'>('health');
  const [scrapeMode, setScrapeMode] = useState<'html' | 'extracted'>('extracted');

  // Sandbox & Quiz state
  const [sandboxCodeMap, setSandboxCodeMap] = useState<Record<string, string>>({});
  const [sandboxResultMap, setSandboxResultMap] = useState<
    Record<string, { out: string; passed: boolean; err?: string }>
  >({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialDomainId) {
      setSelectedDomainId(initialDomainId);
      const found = PYTHON_DOMAIN_TRACKS.find((d) => d.id === initialDomainId);
      if (found) setSelectedLibId(found.libraries[0].id);
    }
  }, [initialDomainId]);

  const handleSelectDomain = (domainId: PythonDomainId) => {
    setSelectedDomainId(domainId);
    const found = PYTHON_DOMAIN_TRACKS.find((d) => d.id === domainId);
    if (found) setSelectedLibId(found.libraries[0].id);
  };

  const activeLib =
    activeDomain.libraries.find((l) => l.id === selectedLibId) || activeDomain.libraries[0];

  const completedLibs = progress.completedLibraryIds || [];
  const totalLibsCount = PYTHON_DOMAIN_TRACKS.reduce((acc, d) => acc + d.libraries.length, 0);
  const isLibDone = completedLibs.includes(activeLib.id);

  const currentSandboxCode = sandboxCodeMap[activeLib.id] ?? activeLib.sandboxStarterCode;
  const currentSandboxRes = sandboxResultMap[activeLib.id];

  const handleCopyPip = () => {
    navigator.clipboard?.writeText(activeLib.pipInstall);
    setCopiedPip(true);
    setTimeout(() => setCopiedPip(false), 1600);
  };

  const handleRunSandbox = () => {
    const res = runPythonCode(currentSandboxCode);
    if (res.error) {
      setSandboxResultMap((prev) => ({
        ...prev,
        [activeLib.id]: {
          out: res.stdout,
          passed: false,
          err: getFriendlyPythonError(res.error!, lang),
        },
      }));
      return;
    }
    const cleanOut = res.stdout.trim();
    const cleanExp = activeLib.sandboxExpectedOutput.trim();
    const passed = cleanOut === cleanExp;
    setSandboxResultMap((prev) => ({
      ...prev,
      [activeLib.id]: { out: cleanOut, passed },
    }));
    if (passed) {
      onCompleteLibrary(activeLib.id, 25);
    }
  };

  const salesSample = [
    { label: 'Jan', val: 42 },
    { label: 'Feb', val: 51 },
    { label: 'Mar', val: 48 },
    { label: 'Apr', val: 63 },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Goal/Field Selection Grid */}
      <section className="bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B]">
              {tr(
                'PYTHON_CAREER_DOMAINS // CHOOSE YOUR PATH',
                'PYTHON_CAREER_DOMAINS // APNA FIELD CHUNEIN',
                'PYTHON_CAREER_DOMAINS // તમારું ક્ષેત્ર પસંદ કરો'
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {tr(
                'Learn Python Libraries for Any Goal',
                'Kisi Bhi Field Ke Liye Top Python Libraries Seekhein',
                'કોઈપણ ક્ષેત્ર માટે ટોચની Python લાઇબ્રેરીઓ શીખો'
              )}
            </h2>
          </div>
          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] text-emerald-700 dark:text-[#00F59B] tabular-nums">
            {completedLibs.length}/{totalLibsCount}{' '}
            {tr('LIBRARIES MASTERED', 'LIBRARIES MASTERED', 'લાઇબ્રેરી પૂર્ણ')}
          </div>
        </div>

        {/* 4 Goal/Field Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PYTHON_DOMAIN_TRACKS.map((domain) => {
            const Icon = DOMAIN_ICONS[domain.id];
            const isSelected = domain.id === activeDomain.id;
            const doneCount = domain.libraries.filter((l) => completedLibs.includes(l.id)).length;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => handleSelectDomain(domain.id)}
                className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-[#151D19] border-emerald-500/60 dark:border-[#00F59B]'
                    : 'bg-slate-50 dark:bg-[#0D100F] border-slate-200 dark:border-[#222925] hover:border-emerald-400 dark:hover:border-[#00E58F]/50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        isSelected
                          ? 'bg-emerald-600 dark:bg-[#00F59B] border-emerald-600 dark:border-[#00F59B] text-white dark:text-[#05130D]'
                          : 'bg-white dark:bg-[#121614] border-slate-200 dark:border-[#222925] text-emerald-700 dark:text-[#00F59B]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-[#8A968F]">
                      {doneCount}/{domain.libraries.length}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {pickText(domain.goalTitle, lang)}
                  </div>
                  <div className="text-xs font-mono text-emerald-700 dark:text-[#00F59B]">
                    {domain.topLibrariesSummary}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#98A39D] leading-snug">
                  {pickText(domain.primaryPurpose, lang)}
                </p>
              </button>
            );
          })}
        </div>

        {/* Quick Reference Comparison Matrix */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#222925]">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#0D100F] border-b border-slate-200 dark:border-[#222925] font-mono text-[11px] uppercase tracking-wider text-slate-600 dark:text-[#8A968F]">
                <th className="px-3.5 py-2.5">{tr('Goal / Field', 'Goal / Field', 'ક્ષેત્ર / ગોલ')}</th>
                <th className="px-3.5 py-2.5">{tr('Top Libraries to Learn', 'Top Libraries', 'શીખવા માટેની ટોપ લાઇબ્રેરી')}</th>
                <th className="px-3.5 py-2.5">{tr('Primary Purpose', 'Primary Purpose', 'મુખ્ય હેતુ')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#222925]">
              {PYTHON_DOMAIN_TRACKS.map((row) => {
                const activeRow = row.id === activeDomain.id;
                return (
                  <tr
                    key={row.id}
                    onClick={() => handleSelectDomain(row.id)}
                    className={`cursor-pointer transition-colors ${
                      activeRow
                        ? 'bg-emerald-50/60 dark:bg-[#151D19]'
                        : 'bg-white dark:bg-[#121614] hover:bg-slate-50 dark:hover:bg-[#171C19]'
                    }`}
                  >
                    <td className="px-3.5 py-2.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {pickText(row.goalTitle, lang)}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-xs text-emerald-700 dark:text-[#00F59B] whitespace-nowrap">
                      {row.topLibrariesSummary}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600 dark:text-[#98A39D]">
                      {pickText(row.primaryPurpose, lang)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Active Domain Library Switcher + Lesson Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Library List for Selected Field */}
        <aside className="lg:col-span-4 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] rounded-xl p-4 space-y-3">
          <div className="pb-2 border-b border-slate-100 dark:border-[#1E2420]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B]">
              {tr('LIBRARIES IN THIS TRACK', 'IS TRACK KI LIBRARIES', 'આ ટ્રેકની લાઇબ્રેરીઓ')}
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {pickText(activeDomain.goalTitle, lang)}
            </h3>
          </div>

          <div className="space-y-1.5">
            {activeDomain.libraries.map((lib) => {
              const isSel = lib.id === activeLib.id;
              const done = completedLibs.includes(lib.id);
              return (
                <button
                  key={lib.id}
                  type="button"
                  onClick={() => setSelectedLibId(lib.id)}
                  className={`w-full min-h-[52px] px-3.5 py-2.5 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSel
                      ? 'bg-emerald-50 dark:bg-[#151D19] border-emerald-500/40 dark:border-[#00E58F]/50 text-emerald-900 dark:text-white font-semibold'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-[#171C19] text-slate-700 dark:text-[#98A39D]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{lib.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-[#6F7A74] truncate">
                      {lib.pipInstall}
                    </div>
                  </div>
                  {done && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00F59B] shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8A968F]">
              {tr('Target Job Roles', 'Target Job Roles', 'ટાર્ગેટ જોબ રોલ્સ')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeDomain.careerRoles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 rounded bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] text-[11px] font-mono text-slate-700 dark:text-[#D5DDD8]"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Interactive Library Guide */}
        <article className="lg:col-span-8 bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] rounded-xl p-5 sm:p-7 space-y-6">
          {/* Library Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-[#1E2420] pb-4">
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B]">
                {pickText(activeDomain.goalTitle, lang)} // {activeLib.name.toUpperCase()}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {activeLib.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-[#98A39D]">
                {pickText(activeLib.tagline, lang)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onCompleteLibrary(activeLib.id, 25)}
              className={`min-h-[42px] px-4 py-2 rounded-lg text-xs font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                isLibDone
                  ? 'bg-emerald-600 text-white dark:bg-[#00F59B]/20 dark:text-[#00F59B] dark:border dark:border-[#00E58F]'
                  : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {isLibDone
                ? tr('Mastered (+25 XP)', 'Mastered (+25 XP)', 'પૂર્ણ (+25 XP)')
                : tr('Mark Mastered (+25 XP)', 'Complete Mark (+25 XP)', 'પૂર્ણ માર્ક કરો (+25 XP)')}
            </button>
          </div>

          {/* Install Command Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-[#090C0B] border border-[#222925]">
            <div className="font-mono text-xs sm:text-sm text-[#00F59B] flex items-center gap-2 overflow-x-auto">
              <span className="text-[#6F7A74] select-none">$</span>
              <span>{activeLib.pipInstall}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyPip}
              className="min-h-[32px] px-2.5 py-1 rounded bg-[#171C19] hover:bg-[#1E2521] border border-[#2A332E] text-xs font-mono text-[#D5DDD8] inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copiedPip ? <Check className="w-3.5 h-3.5 text-[#00F59B]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedPip ? tr('Copied', 'Copied', 'કોપી થયું') : tr('Copy pip', 'Copy pip', 'કોપી')}
            </button>
          </div>

          {/* When to use + India Tech Example */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-700 dark:text-[#00F59B]">
                {tr('When to Use', 'Kab Use Karein', 'ક્યારે વાપરવું')}
              </div>
              <p className="text-sm text-slate-800 dark:text-[#E6ECE8]">
                {pickText(activeLib.whenToUse, lang)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
                {tr('Real-World Use Case', 'Real-World Example', 'રિયલ-વર્લ્ડ ઉદાહરણ')}
              </div>
              <p className="text-sm text-slate-800 dark:text-[#E6ECE8]">
                {pickText(activeLib.indiaExample, lang)}
              </p>
            </div>
          </div>

          {/* Domain-Specific Interactive Visual Preview */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-[#00F59B]">
                {tr('Interactive Domain Preview', 'Interactive Domain Preview', 'ઇન્ટરેક્ટિવ ડોમેન પ્રિવ્યૂ')}
              </span>
              {activeDomain.id === 'data-science' && (
                <div className="flex gap-1.5">
                  {(['bar', 'line'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setChartType(type)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold cursor-pointer ${
                        chartType === type
                          ? 'bg-emerald-600 dark:bg-[#00F59B] text-white dark:text-[#05130D]'
                          : 'bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] text-slate-600 dark:text-[#8A968F]'
                      }`}
                    >
                      {type === 'bar' ? 'plt.bar()' : 'plt.plot()'}
                    </button>
                  ))}
                </div>
              )}
              {activeDomain.id === 'web-apis' && (
                <div className="flex gap-1.5">
                  {(['health', 'order'] as const).map((ep) => (
                    <button
                      key={ep}
                      type="button"
                      onClick={() => setApiEndpoint(ep)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold cursor-pointer ${
                        apiEndpoint === ep
                          ? 'bg-emerald-600 dark:bg-[#00F59B] text-white dark:text-[#05130D]'
                          : 'bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] text-slate-600 dark:text-[#8A968F]'
                      }`}
                    >
                      {ep === 'health' ? 'GET /health' : 'POST /order'}
                    </button>
                  ))}
                </div>
              )}
              {activeDomain.id === 'web-scraping' && (
                <div className="flex gap-1.5">
                  {(['html', 'extracted'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setScrapeMode(m)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold cursor-pointer ${
                        scrapeMode === m
                          ? 'bg-emerald-600 dark:bg-[#00F59B] text-white dark:text-[#05130D]'
                          : 'bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] text-slate-600 dark:text-[#8A968F]'
                      }`}
                    >
                      {m === 'html' ? 'Raw HTML' : 'Extracted JSON'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activeDomain.id === 'data-science' && (
              <div className="p-4 rounded-lg bg-[#090C0B] border border-[#222925]">
                {chartType === 'bar' ? (
                  <div className="h-32 flex items-end justify-around gap-4 pt-3">
                    {salesSample.map((pt) => (
                      <div key={pt.label} className="flex flex-col items-center gap-1.5 flex-1 max-w-[64px]">
                        <span className="text-[11px] font-mono text-[#00F59B] tabular-nums">₹{pt.val}k</span>
                        <div
                          className="w-full rounded-t bg-[#00F59B]/85 transition-all"
                          style={{ height: `${pt.val * 1.2}px` }}
                        />
                        <span className="text-[11px] font-mono text-[#8A968F]">{pt.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 py-2">
                    <svg viewBox="0 0 320 90" className="w-full h-24">
                      <polyline
                        fill="none"
                        stroke="#00F59B"
                        strokeWidth="3"
                        points="25,52 115,34 205,40 295,14"
                      />
                      {[
                        { x: 25, y: 52, lbl: 'Jan (42k)' },
                        { x: 115, y: 34, lbl: 'Feb (51k)' },
                        { x: 205, y: 40, lbl: 'Mar (48k)' },
                        { x: 295, y: 14, lbl: 'Apr (63k)' },
                      ].map((dot) => (
                        <g key={dot.lbl}>
                          <circle cx={dot.x} cy={dot.y} r="5" fill="#00F59B" />
                          <text x={dot.x} y="84" textAnchor="middle" fill="#8A968F" fontSize="10" fontFamily="monospace">
                            {dot.lbl}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                )}
              </div>
            )}

            {activeDomain.id === 'ml-ai' && (
              <div className="p-4 rounded-lg bg-[#090C0B] border border-[#222925] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <label htmlFor="ml-hours-slider" className="text-[#D5DDD8]">
                    {tr('Input Study Hours (X):', 'Input Study Hours (X):', 'અભ્યાસના કલાકો (X):')}{' '}
                    <strong className="text-[#00F59B]">{mlHours} hrs</strong>
                  </label>
                  <span className="text-[#00F59B] tabular-nums">
                    model.predict([[{mlHours}]]) =&gt;{' '}
                    <strong>{Math.min(100, Math.round(11.1 * mlHours + 25))} / 100</strong>
                  </span>
                </div>
                <input
                  id="ml-hours-slider"
                  type="range"
                  min={1}
                  max={7}
                  value={mlHours}
                  onChange={(e) => setMlHours(Number(e.target.value))}
                  className="w-full accent-[#00F59B] cursor-pointer"
                />
              </div>
            )}

            {activeDomain.id === 'web-apis' && (
              <div className="p-3.5 rounded-lg bg-[#090C0B] border border-[#222925] font-mono text-xs space-y-1.5">
                <div className="text-[#00F59B]">
                  200 OK · 4ms · {apiEndpoint === 'health' ? 'GET /health' : 'POST /order'}
                </div>
                <pre className="text-[#D5DDD8] overflow-x-auto">
                  {apiEndpoint === 'health'
                    ? '{\n  "status": "ok",\n  "framework": "' + activeLib.name + '"\n}'
                    : '{\n  "confirmed": "Laptop",\n  "qty": 1,\n  "served_by": "' + activeLib.name + '"\n}'}
                </pre>
              </div>
            )}

            {activeDomain.id === 'web-scraping' && (
              <div className="p-3.5 rounded-lg bg-[#090C0B] border border-[#222925] font-mono text-xs text-[#D5DDD8] overflow-x-auto">
                <pre>
                  {scrapeMode === 'html'
                    ? `<div class="card">\n  <h2>Laptop</h2>\n  <span class="price">45000</span>\n</div>`
                    : `{\n  "title": "Laptop",\n  "price_inr": 45000,\n  "extractor": "${activeLib.name}"\n}`}
                </pre>
              </div>
            )}
          </div>

          {/* Key APIs Reference */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00F59B]">
              {tr('Essential Methods to Know', 'Zaroori Methods & Functions', 'જાણવા જેવા મુખ્ય ફંક્શન્સ')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeLib.keyApis.map((item) => (
                <div
                  key={item.api}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925]"
                >
                  <code className="text-xs font-mono font-bold text-emerald-700 dark:text-[#00F59B]">
                    {item.api}
                  </code>
                  <p className="text-xs text-slate-600 dark:text-[#98A39D] mt-1">
                    {pickText(item.purpose, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Production Code Example + Line-by-Line */}
          <div className="rounded-xl border border-slate-200 dark:border-[#222925] overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-[#0D100F] border-b border-slate-200 dark:border-[#222925] flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-[#D5DDD8]">
                {tr('Real-World Python Code', 'Real-World Python Code', 'રિયલ-વર્લ્ડ Python કોડ')} ({activeLib.name})
              </span>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-[#00F59B]">
                {activeLib.id}.py
              </span>
            </div>
            <pre className="p-4 bg-[#090C0B] text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
              <code>{activeLib.productionCode}</code>
            </pre>
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0D100F] border-t border-slate-200 dark:border-[#222925] font-mono text-xs text-slate-700 dark:text-[#D5DDD8]">
              <span className="text-emerald-700 dark:text-[#00F59B] font-semibold">Output: </span>
              {activeLib.expectedOutput}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-[#8A968F]">
              {tr('Line-by-Line Breakdown', 'Line-by-Line Samajh', 'લાઇન-બાય-લાઇન સમજૂતી')}
            </h3>
            <div className="space-y-1.5">
              {activeLib.lineByLine.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D100F] border border-slate-200 dark:border-[#222925] flex flex-col sm:flex-row sm:items-center gap-2 text-xs"
                >
                  <code className="font-mono text-emerald-700 dark:text-[#00F59B] shrink-0">
                    {item.line}
                  </code>
                  <span className="text-slate-600 dark:text-[#98A39D]">
                    — {pickText(item.explanation, lang)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Browser Python Logic Sandbox */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D100F] border border-emerald-500/30 dark:border-[#00E58F]/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-mono font-bold text-emerald-700 dark:text-[#00F59B] inline-flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                {tr('Try Core Logic Live in Browser', 'Browser Sandbox Mein Practice Karein', 'બ્રાઉઝર સેન્ડબોક્સમાં પ્રેક્ટિસ કરો')}
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A968F]">
                {t.expectedOutput}: {activeLib.sandboxExpectedOutput.replace(/\n/g, ' | ')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-[#D5DDD8]">
              {pickText(activeLib.sandboxPrompt, lang)}
            </p>

            <CodeEditorWithToolbar
              ariaLabel={`${activeLib.name} logic sandbox`}
              rows={5}
              lang={lang}
              filename={`practice_${activeLib.id}.py`}
              value={currentSandboxCode}
              onChange={(val) => setSandboxCodeMap((p) => ({ ...p, [activeLib.id]: val }))}
              onReset={() =>
                setSandboxCodeMap((p) => ({ ...p, [activeLib.id]: activeLib.sandboxStarterCode }))
              }
              resetLabel={t.resetCode}
            />

            <button
              type="button"
              onClick={handleRunSandbox}
              className="min-h-[42px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              {tr('Run & Verify (+25 XP)', 'Run & Check Karein (+25 XP)', 'ચલાવો અને ચકાસો (+25 XP)')}
            </button>

            {currentSandboxRes && (
              <div
                className={`p-3 rounded-lg text-xs font-mono ${
                  currentSandboxRes.passed
                    ? 'bg-emerald-50 dark:bg-[#151D19] text-emerald-800 dark:text-[#00F59B] border border-emerald-200 dark:border-[#00E58F]/40'
                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                }`}
              >
                {currentSandboxRes.err
                  ? currentSandboxRes.err
                  : currentSandboxRes.passed
                  ? tr(
                      `Passed! Output matches: ${currentSandboxRes.out.replace(/\n/g, ' | ')}`,
                      `Shabash! Bilkul sahi output: ${currentSandboxRes.out.replace(/\n/g, ' | ')}`,
                      `શાબાશ! એકદમ સાચું આઉટપુટ: ${currentSandboxRes.out.replace(/\n/g, ' | ')}`
                    )
                  : `${t.actualOutput}: "${currentSandboxRes.out}" | ${t.expectedOutput}: "${activeLib.sandboxExpectedOutput}"`}
              </div>
            )}
          </div>

          {/* Quick Quiz */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#1E2420] space-y-3">
            <h3 className="text-sm font-mono font-bold text-slate-900 dark:text-white">
              {t.quickQuiz}: {pickText(activeLib.quiz.question, lang)}
            </h3>
            <div className="space-y-2">
              {activeLib.quiz.options.map((opt, idx) => {
                const picked = quizAnswers[activeLib.id] === idx;
                const checked = quizChecked[activeLib.id];
                const isCorrect = idx === activeLib.quiz.correctIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuizAnswers((p) => ({ ...p, [activeLib.id]: idx }))}
                    className={`w-full min-h-[44px] px-4 py-2 rounded-lg border text-left text-xs sm:text-sm cursor-pointer ${
                      checked && isCorrect
                        ? 'border-emerald-500 dark:border-[#00F59B] bg-emerald-50 dark:bg-[#151D19] text-emerald-900 dark:text-[#00F59B]'
                        : checked && picked && !isCorrect
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
                        : picked
                        ? 'border-emerald-600 dark:border-[#00F59B] bg-emerald-50/70 dark:bg-[#151D19] text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-[#222925] bg-slate-50 dark:bg-[#0D100F] text-slate-700 dark:text-[#D5DDD8]'
                    }`}
                  >
                    {pickText(opt, lang)}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuizChecked((p) => ({ ...p, [activeLib.id]: true }));
                  if (quizAnswers[activeLib.id] === activeLib.quiz.correctIndex) {
                    onCompleteLibrary(activeLib.id, 25);
                  }
                }}
                className="min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs font-mono font-bold cursor-pointer"
              >
                {t.checkAnswer}
              </button>
              {quizChecked[activeLib.id] && (
                <span className="text-xs text-slate-600 dark:text-[#98A39D]">
                  {pickText(activeLib.quiz.explanation, lang)}
                </span>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
