import React, { useCallback, useEffect, useState } from 'react';
import { ArrowRight, BookmarkCheck, ExternalLink, Globe, Lightbulb, RefreshCw, Sparkles } from 'lucide-react';
import { DAILY_TECH_FACTS, getDayOfYearIndex } from '../data/projectsNewsCareer';
import { Language, NewsItem } from '../types';

interface GeminiHeadline {
  title: string;
  category: string;
  summary: string;
  sourceName: string;
  url?: string;
}

interface GroundingSource {
  title: string;
  uri: string;
}

interface CachedNewsPayload {
  displayDate: string;
  headlines: GeminiHeadline[];
  groundingSources: GroundingSource[];
  savedAt: number;
}

type FeedSourceMode = 'gemini' | 'live-wire' | 'saved' | 'evergreen';

interface TechNewsFeedProps {
  lang: Language;
  onOpenFullPulse?: () => void;
}

const EVERGREEN_CAREER_INSIGHTS: Record<'en' | 'hi', GeminiHeadline[]> = {
  en: [
    {
      title: 'Why Python + Excel Remains the Fastest Entry Combo for Indian IT & Analyst Jobs',
      category: 'Career & Skills',
      summary:
        'Companies across Bengaluru, Pune, Noida, and Tier-2 hubs hire freshers who can clean CSV sheets in Excel and automate repetitive reports using Python loops and dictionaries.',
      sourceName: 'TechStart India Career Desk',
      url: 'https://docs.python.org/3/',
    },
    {
      title: 'How India’s Digital Public Infrastructure (UPI, Aadhaar, ONDC) Creates Tech Roles',
      category: 'Big Tech & Startups',
      summary:
        'India processes billions of monthly UPI transactions built on secure APIs, databases, and backend validation—creating steady demand for junior QA testers, support engineers, and backend developers.',
      sourceName: 'Digital India Engineering Brief',
      url: 'https://www.npci.org.in/',
    },
    {
      title: 'AI Coding Assistants Change Interviews: Debugging Matters More Than Memorizing Syntax',
      category: 'AI & Automation',
      summary:
        'While AI tools can draft starter code, employers test whether you can read tracebacks, spot off-by-one bugs, and verify edge cases on your own without guessing.',
      sourceName: 'AI & Dev Digest',
    },
    {
      title: 'Satellite Internet & 5G Expansion Opens Remote Tech Work Across Tier-2 and Tier-3 Towns',
      category: 'Telecom & Satellite',
      summary:
        'Affordable high-speed connectivity lets students in smaller cities push code to GitHub, join live technical interviews, and earn freelance gigs without relocating immediately.',
      sourceName: 'India Telecom Watch',
    },
    {
      title: 'Cyber Hygiene Basics Every New Developer Must Know Before Deploying an App',
      category: 'Cybersecurity',
      summary:
        'Never push API keys or passwords into public repositories, always validate user input, and double-check APK or payment links against official domains to prevent phishing attacks.',
      sourceName: 'Cyber Safety India',
      url: 'https://www.cert-in.org.in/',
    },
    {
      title: 'From First Mini-Project to GitHub Portfolio: What Recruiters Check in 60 Seconds',
      category: 'Projects & Portfolio',
      summary:
        'A clean README explaining what your Python CLI tool solves, sample input/output, and automated test cases impresses hiring managers far more than copied tutorial certificates.',
      sourceName: 'TechStart Placement Guide',
    },
  ],
  hi: [
    {
      title: 'Bharat mein IT aur Analyst Jobs ke liye Python + Excel Sabse Fast Entry Combo Kyun Hai',
      category: 'Career & Skills',
      summary:
        'Bengaluru, Pune, Noida aur Tier-2 shahron ki companies aise freshers ko hire karti hain jo Excel mein data clean kar sakein aur Python loops se daily reports automate kar sakein.',
      sourceName: 'TechStart India Career Desk',
      url: 'https://docs.python.org/3/',
    },
    {
      title: 'UPI, Aadhaar aur ONDC Jaise Digital Platforms Se Nayi Tech Jobs Kaise Ban Rahi Hain',
      category: 'Big Tech & Startups',
      summary:
        'Bharat mein har mahine billions UPI transactions APIs aur secure databases par chalte hain—jisse junior QA testers, support engineers aur backend developers ki demand lagatar badh rahi hai.',
      sourceName: 'Digital India Engineering Brief',
      url: 'https://www.npci.org.in/',
    },
    {
      title: 'AI Coding Tools ke Daur Mein Debugging Skill Ratta Maarne Se Zyada Zaroori Hai',
      category: 'AI & Automation',
      summary:
        'AI starter code likh sakta hai, lekin interviews mein companies ye dekhti hain ki kya aap khud error traceback padh kar bug fix kar sakte hain aur edge cases check kar sakte hain.',
      sourceName: 'AI & Dev Digest',
    },
    {
      title: '5G aur Satellite Internet Se Chhote Shahron ke Students ke Liye Remote IT Work Aasaan',
      category: 'Telecom & Satellite',
      summary:
        'Tez aur sasta internet aane se Tier-2/3 shahron ke students ghar baithe GitHub projects bana kar remote internships aur freelance kaam shuru kar sakte hain.',
      sourceName: 'India Telecom Watch',
    },
    {
      title: 'Har Naye Developer ke Liye Zaroori Cyber Security Rules: Keys aur UPI Safety',
      category: 'Cybersecurity',
      summary:
        'Kabhi bhi API key ya password public GitHub par upload na karein, user input ko validate karein, aur unknown WhatsApp APK files ya fake payment links se savdhan rahein.',
      sourceName: 'Cyber Safety India',
      url: 'https://www.cert-in.org.in/',
    },
    {
      title: 'Apne Pehle Mini-Project Se Recruiter Ko 60 Seconds Mein Impress Kaise Karein',
      category: 'Projects & Portfolio',
      summary:
        'Copied certificates se zyada asar ek clean README, working Python CLI project aur test cases ka padhta hai jisse recruiter turant samajh jata hai ki aap code likh sakte hain.',
      sourceName: 'TechStart Placement Guide',
    },
  ],
};

function getCacheKey(lang: Language): string {
  return `techstart_news_cache_${lang}`;
}

function getTodayDateKey(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function getTodayDisplayDate(): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());
}

function readSavedCache(lang: Language): CachedNewsPayload | null {
  try {
    const raw = localStorage.getItem(getCacheKey(lang));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedNewsPayload>;
    if (!Array.isArray(parsed.headlines) || parsed.headlines.length === 0) return null;
    return {
      displayDate: typeof parsed.displayDate === 'string' && parsed.displayDate ? parsed.displayDate : getTodayDisplayDate(),
      headlines: parsed.headlines,
      groundingSources: Array.isArray(parsed.groundingSources) ? parsed.groundingSources : [],
      savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

function writeSavedCache(lang: Language, payload: CachedNewsPayload): void {
  try {
    localStorage.setItem(getCacheKey(lang), JSON.stringify(payload));
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

export const TechNewsFeed: React.FC<TechNewsFeedProps> = ({ lang, onOpenFullPulse }) => {
  const [headlines, setHeadlines] = useState<GeminiHeadline[]>([]);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [displayDate, setDisplayDate] = useState<string>(getTodayDisplayDate);
  const [sourceMode, setSourceMode] = useState<FeedSourceMode>('gemini');
  const [loading, setLoading] = useState<boolean>(true);
  const [factOffset, setFactOffset] = useState<number>(0);

  const dayIndex = getDayOfYearIndex();
  const activeFact = DAILY_TECH_FACTS[(dayIndex + factOffset) % DAILY_TECH_FACTS.length];

  const applyOfflineFallback = useCallback((currentLang: Language) => {
    const saved = readSavedCache(currentLang);
    if (saved) {
      setDisplayDate(saved.displayDate);
      setHeadlines(saved.headlines);
      setGroundingSources(saved.groundingSources);
      setSourceMode('saved');
      return;
    }

    setDisplayDate(getTodayDisplayDate());
    const fallbackLang = currentLang === 'hi' ? 'hi' : 'en';
    setHeadlines(EVERGREEN_CAREER_INSIGHTS[fallbackLang]);
    setGroundingSources([]);
    setSourceMode('evergreen');
  }, []);

  const fetchHeadlines = useCallback(
    async (manualRefresh = false) => {
      setLoading(true);
      try {
        // 1. Try Gemini + Google Search endpoint (6-hour shared server cache)
        const geminiRes = await fetch(`/api/gemini/tech-news?lang=${lang}`);
        if (geminiRes.ok) {
          const data = (await geminiRes.json()) as {
            displayDate?: string;
            headlines?: GeminiHeadline[];
            groundingSources?: GroundingSource[];
          };
          const validHeadlines = Array.isArray(data.headlines) ? data.headlines : [];
          if (validHeadlines.length > 0) {
            const nextDisplayDate = data.displayDate || getTodayDisplayDate();
            const nextSources = Array.isArray(data.groundingSources) ? data.groundingSources : [];
            setDisplayDate(nextDisplayDate);
            setHeadlines(validHeadlines);
            setGroundingSources(nextSources);
            setSourceMode('gemini');
            writeSavedCache(lang, {
              displayDate: nextDisplayDate,
              headlines: validHeadlines,
              groundingSources: nextSources,
              savedAt: Date.now(),
            });
            return;
          }
        }

        // 2. Free Unlimited Daily Fallback: live RSS + Dev.to + Hacker News feed (/api/tech-news)
        const todayKey = getTodayDateKey();
        const rssRes = await fetch(
          `/api/tech-news?date=${todayKey}${manualRefresh ? '&refresh=1' : ''}`
        );
        if (rssRes.ok) {
          const rssData = (await rssRes.json()) as {
            displayDate?: string;
            isLive?: boolean;
            items?: NewsItem[];
          };
          const items = Array.isArray(rssData.items) ? rssData.items : [];
          if (items.length > 0) {
            const mapped: GeminiHeadline[] = items.slice(0, 8).map((item) => ({
              title: item.title[lang] || item.title.en,
              category: item.category,
              summary: item.summary[lang] || item.whyItMatters[lang] || item.summary.en,
              sourceName: item.sourceName,
              url: item.externalUrl,
            }));
            const nextDisplayDate = rssData.displayDate || getTodayDisplayDate();
            setDisplayDate(nextDisplayDate);
            setHeadlines(mapped);
            setGroundingSources([]);
            setSourceMode(rssData.isLive ? 'live-wire' : 'evergreen');
            writeSavedCache(lang, {
              displayDate: nextDisplayDate,
              headlines: mapped,
              groundingSources: [],
              savedAt: Date.now(),
            });
            return;
          }
        }

        // 3. Offline fallback: localStorage -> 6 curated evergreen insights
        applyOfflineFallback(lang);
      } catch {
        applyOfflineFallback(lang);
      } finally {
        setLoading(false);
      }
    },
    [applyOfflineFallback, lang]
  );

  useEffect(() => {
    fetchHeadlines(false);
  }, [fetchHeadlines]);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                {lang === 'en'
                  ? `Today's Top Tech News · ${displayDate}`
                  : `Aaj ki Top Tech News · ${displayDate}`}
              </span>
            </h2>

            {sourceMode === 'live-wire' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/70">
                <Globe className="w-3 h-3 shrink-0" />
                Live Daily Feed
              </span>
            )}

            {sourceMode === 'saved' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/70">
                <BookmarkCheck className="w-3 h-3 shrink-0" />
                Offline / Saved Pulse
              </span>
            )}

            {sourceMode === 'evergreen' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800/70">
                <BookmarkCheck className="w-3 h-3 shrink-0" />
                Indian Tech & AI Career Insights
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {sourceMode === 'gemini'
              ? lang === 'en'
                ? 'Google Search headlines with short AI-generated summaries for students'
                : 'Google Search se aaj ki headlines aur asaan AI summary'
              : sourceMode === 'live-wire'
              ? lang === 'en'
                ? 'Auto-updated today from Google News Tech India, Dev.to & Hacker News'
                : 'Aaj ki live headlines — Google News Tech India, Dev.to aur Hacker News se updated'
              : sourceMode === 'saved'
              ? lang === 'en'
                ? 'Showing your last saved headlines while offline'
                : 'Offline hone par aapki pichhli save ki gayi headlines dikh rahi hain'
              : lang === 'en'
              ? 'Curated Indian Tech, Python & AI Career Insights available anytime offline'
              : 'Indian Tech, Python aur AI Career Insights — bina internet ke bhi hamesha uplabdh'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => fetchHeadlines(true)}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading
              ? lang === 'en'
                ? 'Updating...'
                : 'Update ho raha hai...'
              : 'Refresh'}
          </button>

          {onOpenFullPulse && (
            <button
              type="button"
              onClick={onOpenFullPulse}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{lang === 'en' ? 'Full Tech Pulse' : 'Poora Tech Pulse'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Today's Rotating Tech Fact Strip */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 shrink-0" />
            <span>
              {lang === 'en'
                ? `Today's Tech Fact (#${((dayIndex + factOffset) % DAILY_TECH_FACTS.length) + 1}/${DAILY_TECH_FACTS.length})`
                : `Aaj ka Tech Fact (#${((dayIndex + factOffset) % DAILY_TECH_FACTS.length) + 1}/${DAILY_TECH_FACTS.length})`}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {activeFact[lang === 'hi' ? 'hi' : 'en']}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFactOffset((n) => n + 1)}
          className="min-h-[34px] px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-semibold text-amber-900 dark:text-amber-200 inline-flex items-center gap-1 shrink-0 self-start sm:self-center cursor-pointer"
        >
          <span>{lang === 'en' ? 'Next Fact' : 'Agla Fact'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && headlines.length === 0 && (
        <div className="space-y-3" aria-busy="true">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2 animate-pulse"
            >
              <div className="h-3 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Clean Scrollable Card List */}
      {headlines.length > 0 && (
        <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3">
          {headlines.map((item, idx) => (
            <article
              key={`${item.title}-${idx}`}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 transition-colors hover:border-teal-500/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {item.category} · {item.sourceName} · {displayDate}
                </span>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 dark:text-teal-400 font-semibold inline-flex items-center gap-1 hover:underline shrink-0"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-teal-700 dark:text-teal-400">
                  {sourceMode === 'evergreen'
                    ? 'Career Insight: '
                    : sourceMode === 'gemini'
                    ? 'AI Summary: '
                    : 'Summary: '}
                </strong>
                {item.summary}
              </p>
            </article>
          ))}
        </div>
      )}

      {/* Grounded Google Search Source Links */}
      {groundingSources.length > 0 && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Google Search Sources:
          </span>
          {groundingSources.slice(0, 4).map((src, i) => (
            <a
              key={`${src.uri}-${i}`}
              href={src.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 dark:text-teal-400 hover:underline truncate max-w-[200px]"
              title={src.title}
            >
              {src.title}
            </a>
          ))}
        </div>
      )}
    </section>
  );
};
