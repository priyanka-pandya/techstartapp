import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Cpu, Play, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { TraceStep } from '../utils/pythonRunner';

interface CodeEditorWithToolbarProps {
  value: string;
  onChange: (nextValue: string) => void;
  rows?: number;
  ariaLabel: string;
  placeholder?: string;
  lang?: Language;
  filename?: string;
  onReset?: () => void;
  resetLabel?: string;
}

const QUICK_SYMBOLS: { label: string; insert: string; title: string }[] = [
  { label: 'Tab (4sp)', insert: '    ', title: 'Insert 4 spaces' },
  { label: ':', insert: ':', title: 'Colon' },
  { label: '(', insert: '(', title: 'Left parenthesis' },
  { label: ')', insert: ')', title: 'Right parenthesis' },
  { label: '[', insert: '[', title: 'Left bracket' },
  { label: ']', insert: ']', title: 'Right bracket' },
  { label: '{', insert: '{', title: 'Left brace' },
  { label: '}', insert: '}', title: 'Right brace' },
  { label: '"', insert: '"', title: 'Double quote' },
  { label: "'", insert: "'", title: 'Single quote' },
  { label: '=', insert: '=', title: 'Equals' },
  { label: '#', insert: '#', title: 'Comment hash' },
];

export const CodeEditorWithToolbar: React.FC<CodeEditorWithToolbarProps> = ({
  value,
  onChange,
  rows = 8,
  ariaLabel,
  placeholder,
  lang = 'en',
  filename = 'main.py',
  onReset,
  resetLabel = 'Reset',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertAtCursor = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(value + snippet);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + snippet + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + snippet.length;
      el.selectionStart = cursor;
      el.selectionEnd = cursor;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertAtCursor('    ');
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-sm">
      {/* Editor Header */}
      <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-400">
        <span className="font-mono truncate">
          {filename} · {lang === 'en' ? 'Tap symbols below or use Tab' : 'Neeche diye symbols tap karein ya Tab dabaye'}
        </span>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="min-h-[32px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            {resetLabel}
          </button>
        )}
      </div>

      {/* Mobile-First Quick Symbol Toolbar */}
      <div
        role="toolbar"
        aria-label="Quick Python symbol buttons"
        className="px-2.5 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto"
      >
        {QUICK_SYMBOLS.map((sym) => (
          <button
            key={sym.label}
            type="button"
            title={sym.title}
            onClick={() => insertAtCursor(sym.insert)}
            className="min-h-[38px] min-w-[38px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-teal-700 active:bg-teal-600 text-slate-100 font-mono text-xs font-semibold border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {sym.label}
          </button>
        ))}
      </div>

      {/* Code Textarea */}
      <textarea
        ref={textareaRef}
        aria-label={ariaLabel}
        rows={rows}
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="code-editor w-full p-4 bg-slate-950 text-slate-100 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
      />
    </div>
  );
};

interface StepVisualizerPanelProps {
  code: string;
  trace: TraceStep[];
  lang: Language;
  onClose?: () => void;
}

export const StepVisualizerPanel: React.FC<StepVisualizerPanelProps> = ({
  code,
  trace,
  lang,
  onClose,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  if (trace.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
        {lang === 'en'
          ? 'No executable steps recorded. Add at least one statement to visualize memory.'
          : 'Koi step record nahi hua. Memory dekhne ke liye kam se kam ek Python line likhein.'}
      </div>
    );
  }

  const safeIdx = Math.min(stepIndex, trace.length - 1);
  const currentStep = trace[safeIdx];
  const codeLines = code.split('\n');
  const varEntries = Object.entries(currentStep.variables);

  return (
    <div className="rounded-xl border border-teal-500/40 bg-slate-950 text-slate-100 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
          <Cpu className="w-4 h-4" />
          <span>
            {lang === 'en' ? 'Step-by-Step Memory Visualizer' : 'Step-by-Step Memory Visualizer'}
          </span>
          <span className="font-mono text-slate-400 tabular-nums">
            ({safeIdx + 1}/{trace.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={safeIdx === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Prev' : 'Pichhla'}
          </button>
          <button
            type="button"
            disabled={safeIdx >= trace.length - 1}
            onClick={() => setStepIndex((i) => Math.min(trace.length - 1, i + 1))}
            className="min-h-[36px] px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            {lang === 'en' ? 'Next' : 'Agla'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setStepIndex(0)}
            className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 inline-flex items-center gap-1 cursor-pointer"
          >
            <Play className="w-3 h-3" />
            {lang === 'en' ? 'Restart' : 'Start'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
            >
              {lang === 'en' ? 'Hide' : 'Band'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Highlighted Source Lines */}
        <div className="md:col-span-7 p-3 font-mono text-xs overflow-x-auto space-y-0.5">
          {codeLines.map((ln, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum === currentStep.line;
            return (
              <div
                key={lineNum}
                className={`px-2 py-1 rounded flex items-start gap-3 ${
                  isActive ? 'bg-teal-900/60 text-teal-200 font-semibold' : 'text-slate-400'
                }`}
              >
                <span className="w-5 text-right select-none text-slate-500 tabular-nums shrink-0">
                  {isActive ? '▶' : lineNum}
                </span>
                <span className="whitespace-pre">{ln || ' '}</span>
              </div>
            );
          })}
        </div>

        {/* Variable Memory Boxes + Console */}
        <div className="md:col-span-5 p-3.5 space-y-3 bg-slate-900/40">
          <div>
            <div className="text-[11px] font-semibold text-amber-400 mb-2">
              {lang === 'en' ? 'Memory (Variables Snapshot)' : 'Memory (Variables ka Live State)'}
            </div>
            {varEntries.length === 0 ? (
              <div className="text-xs text-slate-400 font-mono">
                {lang === 'en' ? '(No variables stored yet)' : '(Abhi koi variable store nahi hua)'}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {varEntries.map(([name, val]) => (
                  <div
                    key={name}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs"
                  >
                    <div className="text-[10px] text-slate-400 truncate">{name}</div>
                    <div className="text-teal-300 font-semibold truncate" title={val}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 mb-1">
              {lang === 'en' ? 'Output So Far' : 'Ab tak ka Output'}
            </div>
            <pre className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap min-h-[40px]">
              {currentStep.outputSoFar || (lang === 'en' ? '(nothing printed yet)' : '(abhi print nahi hua)')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
