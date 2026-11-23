import { GoogleGenAI } from '@google/genai';
import type { NewsItem } from '../src/types';

export interface ApiResult {
  status: number;
  body: unknown;
}

interface CachedFeed {
  dateKey: string;
  fetchedAt: number;
  isLive: boolean;
  items: NewsItem[];
}

interface GeminiHeadline {
  title: string;
  category: string;
  summary: string;
  sourceName: string;
  url?: string;
}

interface GeminiNewsCacheEntry {
  dateKey: string;
  displayDate: string;
  fetchedAt: number;
  headlines: GeminiHeadline[];
  groundingSources: { title: string; uri: string }[];
}

const feedCache = new Map<string, CachedFeed>();
const geminiNewsCache = new Map<string, GeminiNewsCacheEntry>();
const CACHE_TTL_MS = 25 * 60 * 1000; // 25 minutes (RSS aggregator)
const GEMINI_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours (21600 seconds) per language

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getIndiaDateKey(overrideDate?: string): string {
  if (overrideDate && /^\d{4}-\d{2}-\d{2}$/.test(overrideDate)) {
    return overrideDate;
  }
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function formatDisplayDate(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
  }
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeHtmlEntities(match[1]) : '';
}

function classifyAndEnrich(
  rawTitle: string,
  rawDesc: string,
  sourceName: string,
  pubDate: string,
  link: string,
  idx: number
): NewsItem {
  const titleLower = rawTitle.toLowerCase();
  const fullLower = `${rawTitle} ${rawDesc}`.toLowerCase();

  let category: NewsItem['category'] = 'Big Tech & Startups';
  if (/starlink|jio|ambani|airtel|telecom|satellite internet|5g|6g|broadband|spectrum/.test(titleLower)) {
    category = 'Telecom & Satellite';
  } else if (/gta|rockstar|gaming|ps5|playstation|xbox|nintendo|gpu|console|iphone|android|pixel|samsung|gadget|smartphone/.test(titleLower)) {
    category = 'Gaming & Gadgets';
  } else if (/isro|space|rocket|satellite|insat|chandrayaan|gaganyaan|nasa|spacex|orbit/.test(titleLower)) {
    category = 'ISRO & Space';
  } else if (/scam|fraud|cyber|hack|breach|phishing|malware|ransomware|cert-in|password|privacy|upi/.test(titleLower)) {
    category = 'Cybersecurity';
  } else if (/\bai\b|openai|gemini|anthropic|claude|chatgpt|llm|agent|nvidia|robot|machine learning/.test(titleLower)) {
    category = 'AI & Automation';
  } else if (/starlink|jio|ambani|airtel/.test(fullLower)) {
    category = 'Telecom & Satellite';
  } else if (/gta|rockstar/.test(fullLower)) {
    category = 'Gaming & Gadgets';
  } else if (/\bai\b|openai|gemini|chatgpt|nvidia/.test(fullLower)) {
    category = 'AI & Automation';
  }

  let companySummary: NewsItem['companySummary'] | undefined;
  let whyItMatters: NewsItem['whyItMatters'] = {
    en: 'Following daily industry updates helps you speak confidently in tech interviews and spot real project ideas.',
    hi: 'Rozana tech news padhne se aap interviews mein confidently baat kar paate hain aur naye project ideas milte hain.',
  };

  if (/starlink|jio|ambani|airtel|satellite/.test(fullLower)) {
    companySummary = {
      en: 'What is Starlink & the Jio Challenge? Starlink (by Elon Musk’s SpaceX) beams broadband internet from thousands of low-orbit satellites. Mukesh Ambani’s Reliance Jio is building its own satellite & 5G network to rival Starlink in India—shaping how rural India gets high-speed internet.',
      hi: 'Starlink aur Jio kya hai? Starlink (Elon Musk ki SpaceX company ka project) space ke satellites se seedha internet deta hai. Mukesh Ambani ki Reliance Jio bhi apna satellite aur 5G network bana kar Starlink ko takkar de rahi hai.',
    };
    whyItMatters = {
      en: 'Satellite + 5G competition drives cheaper high-speed internet across Tier-2/3 cities, creating massive cloud and networking jobs.',
      hi: 'Satellite aur 5G competition se chhote shahron mein bhi fast internet aayega aur networking/cloud jobs badhengi.',
    };
  } else if (/gta|rockstar|gaming|ps5|xbox|console/.test(fullLower)) {
    companySummary = {
      en: 'About Rockstar Games & GTA 6: Rockstar Games is the studio behind Grand Theft Auto, one of the largest software launches in history. GTA 6 runs on advanced 3D graphics rendering, GPU ray-tracing physics, and smart autonomous AI systems.',
      hi: 'Rockstar Games & GTA 6 kya hai? Rockstar Games duniya ke sabse bade open-world game Grand Theft Auto ko banati hai. GTA 6 mein next-level 3D graphics, GPU programming aur smart AI behavior use ho raha hai.',
    };
    whyItMatters = {
      en: 'Modern AAA games like GTA 6 run on C++, Python tooling, GPUs, and AI simulation—showing how coding powers multi-billion-dollar entertainment.',
      hi: 'GTA 6 jaise games dikhate hain ki coding, GPUs aur AI kaise billion-dollar gaming industry chalate hain.',
    };
  } else if (/openai|chatgpt|anthropic|gemini|nvidia|\bai\b/.test(fullLower)) {
    companySummary = {
      en: 'Company Context: Top AI labs (OpenAI, Google DeepMind, Anthropic) and chipmaker Nvidia build the models and GPUs powering modern coding copilots, research labs, and automation tools.',
      hi: 'Company Context: OpenAI, Google DeepMind, Anthropic aur chipmaker Nvidia woh companies hain jo AI models aur GPUs banati hain.',
    };
    whyItMatters = {
      en: 'Employers want developers who understand Python & debugging well enough to review and ship reliable software alongside AI tools.',
      hi: 'Companies aise developers chahti hain jo Python aur logic samajhte hon taaki AI tools ke code ko verify aur fix kar sakein.',
    };
  } else if (/isro|chandrayaan|gaganyaan|insat/.test(fullLower)) {
    companySummary = {
      en: 'About ISRO: Indian Space Research Organisation builds India’s satellites (INSAT, NavIC) and rockets (PSLV, LVM3), powering weather alerts, UPI bank timing, and space missions at fraction-of-global cost.',
      hi: 'ISRO kya hai? Indian Space Research Organisation Bharat ke rockets aur INSAT satellites banati hai jo mausam, maps aur telecom chalate hain.',
    };
    whyItMatters = {
      en: 'Space software relies heavily on Python data analysis, C/C++ flight systems, and strict bug-free testing.',
      hi: 'Space missions mein Python data analysis aur bug-free testing skills sabse zyada kaam aati hain.',
    };
  } else if (/upi|cyber|scam|phishing|cert-in|fraud/.test(fullLower)) {
    companySummary = {
      en: 'Security Context: CERT-In is India’s national cybersecurity agency tracking phishing, fake apps, and payment scams to protect everyday smartphone users.',
      hi: 'Security Context: CERT-In Bharat ki cyber security agency hai jo fake apps, phishing links aur UPI scams se logon ko bachati hai.',
    };
    whyItMatters = {
      en: 'Understanding URL checks, 2FA, and Python input validation keeps both your personal bank account and your apps secure.',
      hi: 'URL check, 2FA aur safe coding seekh kar aap khud ko aur apne apps ko hackers se bacha sakte hain.',
    };
  }

  const cleanTitle = rawTitle.replace(/\s+-\s+[^-]+$/, '').trim() || rawTitle;
  const parsedDate = pubDate ? new Date(pubDate) : new Date();
  const safeParsedDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const formattedDate = formatDisplayDate(safeParsedDate.toISOString());
  const descClean = rawDesc && rawDesc.length > 28 && !rawDesc.toLowerCase().includes(cleanTitle.toLowerCase().slice(0, 18))
    ? rawDesc.slice(0, 240) + (rawDesc.length > 240 ? '...' : '')
    : '';
  const summaryTextEn =
    descClean ||
    (companySummary?.en
      ? `${companySummary.en.slice(0, 210)}${companySummary.en.length > 210 ? '...' : ''}`
      : whyItMatters.en);
  const summaryTextHi =
    descClean ||
    (companySummary?.hi
      ? `${companySummary.hi.slice(0, 210)}${companySummary.hi.length > 210 ? '...' : ''}`
      : whyItMatters.hi);

  return {
    id: `live-${idx}-${safeParsedDate.getTime()}`,
    category,
    highlightStat: `${sourceName || category} · ${formattedDate}`,
    title: {
      en: cleanTitle,
      hi: cleanTitle,
    },
    summary: {
      en: summaryTextEn,
      hi: summaryTextHi,
    },
    companySummary,
    whyItMatters,
    date: formattedDate,
    readTime: 'Live Update',
    sourceName: sourceName || 'Global Tech Wire',
    externalUrl: link || 'https://news.google.com',
    isLiveFetched: true,
  };
}

async function fetchRssItems(url: string, maxItems = 6): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'TechStartIndia-EduReader/1.0',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
    });
    if (!resp.ok) return [];
    const xml = await resp.text();
    const matches = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];
    return matches.slice(0, maxItems).map((block, idx) => {
      const title = extractTag(block, 'title');
      const link = extractTag(block, 'link');
      const pubDate = extractTag(block, 'pubDate');
      const source = extractTag(block, 'source') || 'Google Tech News';
      const desc = extractTag(block, 'description');
      return classifyAndEnrich(title, desc, source, pubDate, link, idx);
    }).filter((item) => Boolean(item.title.en));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function fetchHackerNewsItems(): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const topResp = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { signal: controller.signal });
    if (!topResp.ok) return [];
    const ids = (await topResp.json()) as number[];
    const slice = ids.slice(0, 4);
    const stories = await Promise.all(
      slice.map(async (id) => {
        const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { signal: controller.signal });
        return r.ok ? r.json() : null;
      })
    );
    return stories
      .filter((s): s is { id: number; title?: string; url?: string; time?: number } => Boolean(s && s.title))
      .map((s, idx) =>
        classifyAndEnrich(
          s.title || 'Developer Update',
          '',
          'Hacker News',
          s.time ? new Date(s.time * 1000).toISOString() : new Date().toISOString(),
          s.url || `https://news.ycombinator.com/item?id=${s.id}`,
          100 + idx
        )
      );
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function fetchDevToItems(): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const resp = await fetch('https://dev.to/api/articles?top=1&per_page=4', {
      signal: controller.signal,
      headers: { 'User-Agent': 'TechStartIndia-EduReader/1.0' },
    });
    if (!resp.ok) return [];
    const articles = (await resp.json()) as Array<{
      id: number;
      title?: string;
      description?: string;
      url?: string;
      published_at?: string;
    }>;
    return articles
      .filter((a) => Boolean(a && a.title))
      .map((a, idx) =>
        classifyAndEnrich(
          a.title || 'Developer Article',
          a.description || '',
          'DEV Community',
          a.published_at || new Date().toISOString(),
          a.url || 'https://dev.to',
          200 + idx
        )
      );
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function buildDailySpotlightPool(dateKey: string): NewsItem[] {
  const formatted = formatDisplayDate(`${dateKey}T09:00:00+05:30`);
  const dayNum = Number(dateKey.split('-')[2] || '1');

  const pool: NewsItem[] = [
    {
      id: `spotlight-starlink-jio-${dateKey}`,
      category: 'Telecom & Satellite',
      highlightStat: `India Telecom Watch · ${formatted}`,
      title: {
        en: 'Reliance Jio vs Elon Musk’s Starlink: The Battle for India’s Satellite Internet',
        hi: 'Reliance Jio vs Elon Musk ka Starlink: Bharat mein Satellite Internet ki badi takkar',
      },
      summary: {
        en: 'Mukesh Ambani’s Reliance Jio and Sunil Mittal’s Airtel are challenging how satellite spectrum is allocated in India as Elon Musk’s Starlink prepares to enter the Indian broadband market.',
        hi: 'Mukesh Ambani ki Reliance Jio aur Airtel ne maang ki hai ki Elon Musk ki company Starlink ko satellite spectrum bina nilami ke na mile, taaki sabhi companies ke liye barabar competition rahe.',
      },
      companySummary: {
        en: 'What is Starlink & Jio? Starlink is a satellite internet service built by Elon Musk’s space company SpaceX—it uses thousands of low-Earth satellites to beam high-speed Wi-Fi even to villages without cables. Reliance Jio is India’s largest 4G/5G telecom network led by Mukesh Ambani.',
        hi: 'Starlink aur Jio kya hai? Starlink, Elon Musk ki space company SpaceX ki service hai jo aasmaan mein satellites ke zariye bina tower ya taar ke fast internet deti hai. Reliance Jio, Mukesh Ambani ki Bharat ki sabse badi 5G telecom company hai.',
      },
      whyItMatters: {
        en: 'Faster internet in villages and Tier-3 towns means millions more Indian students can learn Python, run remote jobs, and build startups.',
        hi: 'Gaon aur chhote shahron tak fast satellite internet pahunchne se har student ghar baithe coding aur remote IT job kar sakega.',
      },
      date: formatted,
      readTime: '1 min read',
      sourceName: 'TechStart India Daily Wire',
      externalUrl: 'https://www.trai.gov.in/',
      isLiveFetched: false,
    },
    {
      id: `spotlight-gta6-${dateKey}`,
      category: 'Gaming & Gadgets',
      highlightStat: `Gaming Tech · Rockstar Games · ${formatted}`,
      title: {
        en: 'GTA 6 Buzz & Next-Gen Console Tech: Why Gamers and Developers Are Watching Closely',
        hi: 'GTA 6 Latest Update: Duniya ka sabse bada game kaise GPU aur AI tech ko badal raha hai',
      },
      summary: {
        en: 'Anticipation around Grand Theft Auto VI (GTA 6) continues to dominate tech feeds as fans track console hardware upgrades, ray-tracing physics, and realistic AI city simulation.',
        hi: 'Grand Theft Auto VI (GTA 6) ke launch aur trailer updates tech duniya mein trend kar rahe hain, jisme ultra-realistic graphics aur smart AI characters dikhaye gaye hain.',
      },
      companySummary: {
        en: 'What is Rockstar Games / GTA 6? Rockstar Games is the global game studio creating GTA 6—projected to be one of the largest software launches in entertainment history, running advanced 3D rendering, physics engines, and AI NPCs.',
        hi: 'Rockstar Games aur GTA 6 kya hai? Rockstar Games woh company hai jo GTA series banati hai. GTA 6 ek massive open-world software project hai jisme advanced 3D graphics, real-time physics aur AI engines lagte hain.',
      },
      whyItMatters: {
        en: 'Game development combines Python automation tools, C++ engines, 3D math, and GPU optimization—a huge career path for coders.',
        hi: 'Gaming industry mein 3D math, GPU programming, C++ aur Python tools sikhne walon ke liye high-paying jobs hoti hain.',
      },
      date: formatted,
      readTime: '45s read',
      sourceName: 'Gaming & GPU Desk',
      externalUrl: 'https://www.rockstargames.com/',
      isLiveFetched: false,
    },
    {
      id: `spotlight-ai-agents-${dateKey}`,
      category: 'AI & Automation',
      highlightStat: `AI Coding Workflows · ${formatted}`,
      title: {
        en: 'AI Agents Shift from Simple Chat to Multi-Step Coding & Excel Automation',
        hi: 'AI Agents ab sirf chat nahi, multi-step coding aur Excel reports bhi bana rahe hain',
      },
      summary: {
        en: 'Companies are adopting personal AI agents that read spreadsheets, test Python scripts, and organize workflows—while skilled humans check edge cases and logic.',
        hi: 'Tech companies ab aise AI agents use kar rahi hain jo Python scripts test karte hain aur Excel data clean karte hain—lekin final check insaan hi karta hai.',
      },
      companySummary: {
        en: 'About AI Agents: Unlike basic chatbots that only answer one question, AI Agents use tools (code runners, databases, browsers) step-by-step to finish whole tasks.',
        hi: 'AI Agents kya hote hain? Simple chatbot sirf jawab deta hai, jabki AI Agent tools aur Python code chala kar poora kaam step-by-step complete karta hai.',
      },
      whyItMatters: {
        en: 'Practicing Bug Hunter and Step Visualizer ensures YOU understand how code executes—making you the reviewer companies hire.',
        hi: 'Bug Hunter aur Step Visualizer se practice karne par aap khud code ki galtiyan pakad sakte hain—yahi skill companies dhoondhti hain.',
      },
      date: formatted,
      readTime: '40s read',
      sourceName: 'AI & Dev Digest',
      externalUrl: 'https://docs.python.org/3/',
      isLiveFetched: false,
    },
    {
      id: `spotlight-upi-cyber-${dateKey}`,
      category: 'Cybersecurity',
      highlightStat: `CERT-In Advisory · ${formatted}`,
      title: {
        en: 'Cyber Alert: Spot Fake AI Voice Calls, Screen-Share Scams & Phishing APK Files',
        hi: 'Cyber Alert: Fake AI voice calls, screen-share scams aur nakli APK files se savdhan',
      },
      summary: {
        en: 'Security agencies warn users never to install unknown `.apk` files sent on WhatsApp or type UPI PINs when someone promises a cashback or refund.',
        hi: 'Cyber experts ne alert diya hai ki WhatsApp par aayi unknown `.apk` files install na karein aur paise receive karne ke liye kabhi UPI PIN na dalein.',
      },
      companySummary: {
        en: 'About CERT-In: Indian Computer Emergency Response Team (CERT-In) is India’s official cyber defense body monitoring fraud trends and software vulnerabilities.',
        hi: 'CERT-In kya hai? Ye Bharat sarkar ki official cyber security agency hai jo online scams aur hacking threats par alert jaari karti hai.',
      },
      whyItMatters: {
        en: 'Checking file extensions, HTTPS URLs, and enabling 2FA protects every digital account you own.',
        hi: 'File extension, official URL aur 2FA check karne ki aadat aapke bank aur social media accounts ko safe rakhti hai.',
      },
      date: formatted,
      readTime: '35s read',
      sourceName: 'Cyber Safety India',
      externalUrl: 'https://www.cert-in.org.in/',
      isLiveFetched: false,
    },
    {
      id: `spotlight-isro-space-${dateKey}`,
      category: 'ISRO & Space',
      highlightStat: `ISRO Tech · Satellites & Telemetry · ${formatted}`,
      title: {
        en: 'ISRO Expands Satellite Data & Communication Tech for Weather & Disaster Alerts',
        hi: 'ISRO ke naye satellites se weather alerts, cyclone tracking aur telecom aur behtar hua',
      },
      summary: {
        en: 'India’s INSAT weather satellites and upcoming orbital missions process huge streams of sensor telemetry using ground-station software and Python pipelines.',
        hi: 'Bharat ke INSAT satellites aur space missions lagatar weather aur ocean data bhejte hain jise ground stations par software se analyze kiya jata hai.',
      },
      companySummary: {
        en: 'About ISRO & INSAT: ISRO designs launch vehicles and INSAT communication/weather satellites that keep Indian railways, airlines, fishermen, and UPI banks synchronized.',
        hi: 'ISRO & INSAT kya hai? ISRO ke INSAT satellites weather forecast, cyclone warning aur telecom networks ke liye space se signal bhejte hain.',
      },
      whyItMatters: {
        en: 'Every satellite mission runs on clean data pipelines, automated checks, and reliable engineering—skills you start building here.',
        hi: 'Space engineering mein data processing, loops aur error-free coding ka bada role hota hai.',
      },
      date: formatted,
      readTime: '40s read',
      sourceName: 'Space & Science India',
      externalUrl: 'https://www.isro.gov.in/',
      isLiveFetched: false,
    },
  ];

  const offset = dayNum % pool.length;
  return [...pool.slice(offset), ...pool.slice(0, offset)];
}

async function getDailyTechNews(dateKey: string, forceRefresh: boolean): Promise<CachedFeed> {
  const existing = feedCache.get(dateKey);
  if (!forceRefresh && existing && Date.now() - existing.fetchedAt < CACHE_TTL_MS) {
    return existing;
  }

  const [indiaTech, aiCyberSpace, starlinkNews, gtaNews, devToStories, hnStories] = await Promise.all([
    fetchRssItems('https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en', 6),
    fetchRssItems('https://news.google.com/rss/search?q=(ISRO+OR+"cybersecurity+India"+OR+OpenAI+OR+Gemini+OR+Python)+when:2d&hl=en-IN&gl=IN&ceid=IN:en', 4),
    fetchRssItems('https://news.google.com/rss/search?q=(Starlink+AND+(Jio+OR+Ambani))+when:7d&hl=en-IN&gl=IN&ceid=IN:en', 2),
    fetchRssItems('https://news.google.com/rss/search?q=("GTA+6"+OR+"GTA+VI")+when:7d&hl=en-IN&gl=IN&ceid=IN:en', 2),
    fetchDevToItems(),
    fetchHackerNewsItems(),
  ]);

  const seenTitles = new Set<string>();
  const categoryCount = new Map<string, number>();
  const combinedLive: NewsItem[] = [];

  const merged = [...indiaTech, ...aiCyberSpace, ...devToStories, ...hnStories, ...starlinkNews, ...gtaNews].sort((a, b) => {
    const ta = Number(a.id.split('-')[2] || '0');
    const tb = Number(b.id.split('-')[2] || '0');
    return tb - ta;
  });

  for (const item of merged) {
    const key = item.title.en.toLowerCase().slice(0, 42);
    const catCount = categoryCount.get(item.category) || 0;
    if (!seenTitles.has(key) && catCount < 3) {
      seenTitles.add(key);
      categoryCount.set(item.category, catCount + 1);
      combinedLive.push(item);
    }
  }

  const spotlight = buildDailySpotlightPool(dateKey);
  const finalItems: NewsItem[] = [];
  if (combinedLive.length > 0) {
    finalItems.push(...combinedLive.slice(0, 10));
    for (const sp of spotlight) {
      const hasCategory = (categoryCount.get(sp.category) || 0) > 0;
      if (!hasCategory && finalItems.length < 12) {
        finalItems.push(sp);
      }
    }
  } else {
    finalItems.push(...spotlight);
  }

  const result: CachedFeed = {
    dateKey,
    fetchedAt: Date.now(),
    isLive: combinedLive.length > 0,
    items: finalItems,
  };
  feedCache.set(dateKey, result);
  return result;
}

export async function fetchGeminiTechNews(langParam: unknown): Promise<ApiResult> {
    const lang = langParam === 'hi' ? 'hi' : 'en';
    const dateKey = getIndiaDateKey();
    const displayDate = formatDisplayDate(`${dateKey}T09:00:00+05:30`);
    const cacheKey = `${dateKey}:${lang}`;

    const cached = geminiNewsCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < GEMINI_CACHE_TTL_MS) {
      return { status: 200, body: cached };
    }

    const ai = getGeminiClient();
    if (!ai) {
      return { status: 503, body: { error: 'GEMINI_API_KEY is not configured in Settings > Secrets.' } };
    }

    try {
      const langInstruction =
        lang === 'hi'
          ? 'Write each headline summary in simple conversational Hinglish (keep English tech terms like AI, Starlink, GPU, API intact).'
          : 'Write each headline summary in crisp, beginner-friendly English.';

      const prompt = `Search today's (${displayDate}) top breaking technology news across India and the global tech industry (covering AI, telecom/satellite internet like Jio/Starlink, gaming/gadgets like GTA 6 or smartphones, cybersecurity, startups, and ISRO/space).
Return ONLY a valid JSON array of exactly 6 items with these keys:
[
  {
    "title": "Short accurate headline from today",
    "category": "One of: AI & Automation | Telecom & Satellite | Gaming & Gadgets | Big Tech & Startups | Cybersecurity | ISRO & Space",
    "summary": "2 concise sentences explaining what happened today and quick context for a beginner.",
    "sourceName": "Publisher name",
    "url": "Direct article URL if known, otherwise empty string"
  }
]
${langInstruction}
Do not include markdown commentary outside the JSON array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a concise tech news editor for Indian students. Always use Google Search results from today and return strictly valid JSON.',
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = (response.text ?? '').trim();
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const groundingSources: { title: string; uri: string }[] = [];
      const seenUris = new Set<string>();
      for (const ch of chunks) {
        const uri = ch.web?.uri;
        const title = ch.web?.title;
        if (uri && !seenUris.has(uri)) {
          seenUris.add(uri);
          groundingSources.push({ title: title || uri, uri });
        }
      }

      let parsedHeadlines: GeminiHeadline[] = [];
      const cleanedJson = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const arrayMatch = cleanedJson.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        try {
          const arr = JSON.parse(arrayMatch[0]) as unknown[];
          parsedHeadlines = arr
            .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
            .map((item, idx) => ({
              title: typeof item.title === 'string' ? item.title.trim() : 'Tech Headline',
              category: typeof item.category === 'string' ? item.category.trim() : 'Tech',
              summary: typeof item.summary === 'string' ? item.summary.trim() : '',
              sourceName: typeof item.sourceName === 'string' ? item.sourceName.trim() : 'Google Search',
              url:
                typeof item.url === 'string' && /^https?:\/\//i.test(item.url)
                  ? item.url
                  : groundingSources[idx]?.uri,
            }))
            .filter((h) => Boolean(h.title && h.summary))
            .slice(0, 6);
        } catch {
          parsedHeadlines = [];
        }
      }

      if (parsedHeadlines.length === 0 && rawText) {
        parsedHeadlines = [
          {
            title: `Top Technology Updates (${displayDate})`,
            category: 'AI & Automation',
            summary: rawText.slice(0, 420),
            sourceName: 'Google Search',
            url: groundingSources[0]?.uri,
          },
        ];
      }

      const payload: GeminiNewsCacheEntry = {
        dateKey,
        displayDate,
        fetchedAt: Date.now(),
        headlines: parsedHeadlines,
        groundingSources: groundingSources.slice(0, 6),
      };
      geminiNewsCache.set(cacheKey, payload);
      return { status: 200, body: payload };
    } catch (err) {
      let status = 502;
      let message = 'Failed to fetch live Google Search tech headlines.';
      if (err instanceof Error && err.message) {
        message = err.message;
        try {
          const parsed = JSON.parse(err.message) as {
            error?: { code?: number; message?: string; status?: string };
          };
          if (parsed?.error?.code && parsed.error.code >= 400 && parsed.error.code < 600) {
            status = parsed.error.code;
          }
          if (parsed?.error?.message) {
            message = parsed.error.message;
          }
        } catch {
          // Keep raw message string if not JSON
        }
      }
      if (status === 429) {
        message =
          'Gemini API quota exceeded for the current key. Check your plan or billing key in Settings > Secrets, then click Retry.';
      }
      return { status, body: { error: message } };
    }
}


export async function fetchTechNews(dateParam: unknown, refreshParam: unknown): Promise<ApiResult> {
  const requestedDate = typeof dateParam === 'string' ? dateParam : undefined;
  const forceRefresh = refreshParam === '1';
  const dateKey = getIndiaDateKey(requestedDate);
  try {
    const feed = await getDailyTechNews(dateKey, forceRefresh);
    return {
      status: 200,
      body: {
        dateKey: feed.dateKey,
        displayDate: formatDisplayDate(`${feed.dateKey}T09:00:00+05:30`),
        isLive: feed.isLive,
        fetchedAt: new Date(feed.fetchedAt).toISOString(),
        items: feed.items,
      },
    };
  } catch {
    const fallback = buildDailySpotlightPool(dateKey);
    return {
      status: 200,
      body: {
        dateKey,
        displayDate: formatDisplayDate(`${dateKey}T09:00:00+05:30`),
        isLive: false,
        fetchedAt: new Date().toISOString(),
        items: fallback,
      },
    };
  }
}
