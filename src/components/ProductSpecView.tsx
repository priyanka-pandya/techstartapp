import React, { useState } from 'react';
import { Check, Copy, Download, FileText } from 'lucide-react';
import { PRODUCT_SPEC_SECTIONS } from '../data/productSpec';

export const ProductSpecView: React.FC = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [copied, setCopied] = useState(false);

  const activeSection = PRODUCT_SPEC_SECTIONS.find((s) => s.id === selectedId) || PRODUCT_SPEC_SECTIONS[0];

  const buildFullMarkdown = () => {
    return `# TechStart India — Complete Product Specification & Development Plan\n\n` +
      PRODUCT_SPEC_SECTIONS.map((s) => `## ${s.title}\n\n${s.summary}\n\n${s.content}`).join('\n\n---\n\n');
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(buildFullMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([buildFullMarkdown()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'techstart-india-product-spec.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-teal-700 dark:text-teal-400">
            Complete 14-Part Deliverable · MIT Open-Source Blueprint
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
            TechStart India — Product Specification & Development Plan
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyAll}
            className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Markdown' : 'Copy Full Spec'}
          </button>
          <button
            type="button"
            onClick={handleDownloadMd}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download .md
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 max-h-[640px] overflow-y-auto">
          {PRODUCT_SPEC_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSelectedId(sec.id)}
              className={`w-full min-h-[44px] px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer ${
                sec.id === activeSection.id
                  ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-semibold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
              <span className="truncate">{sec.title}</span>
            </button>
          ))}
        </aside>

        <article className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50">
              {activeSection.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{activeSection.summary}</p>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {activeSection.content}
          </pre>
        </article>
      </div>
    </div>
  );
};
