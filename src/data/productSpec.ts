export interface SpecSection {
  id: number;
  title: string;
  summary: string;
  content: string;
}

export const PRODUCT_SPEC_SECTIONS: SpecSection[] = [
  {
    id: 1,
    title: '1. Complete App Structure',
    summary: '5-pillar mobile-first architecture with zero-login friction and offline lesson caching.',
    content: `TechStart India follows a 5-tab mobile-first information architecture designed to minimize cognitive load on low-end Android phones (2GB RAM, 3G/4G networks):

1. Home Dashboard (/home)
   - Personalized greeting, Today's Micro-Goal, Daily Streak & XP
   - Progress rings/bars for Computer Basics, Windows & Excel, Python, Projects, Coding Practice
   - 4 One-Tap Quick Actions + Badges + Optional Privacy-First Leaderboard

2. Learn Hub (/learn)
   - Module 1: Computer Basics from Zero (28 topics, hardware diagrams, 30-60s explainers, 3 quizzes + 1 task per topic)
   - Module 2: Practical Windows, Shortcuts, Cyber Safety & Interactive Excel Lab (5 real templates)
   - Module 3: Python Beginner-to-Intermediate (104 bite-sized 3–7 min lessons across 10 units)
   - Offline Download Manager (stores lesson JSON + SVG/compressed assets locally)

3. Practice Arena (/practice)
   - Module 4: In-App Python Editor with visible + hidden test cases, progressive hints, and solution unlock after 3 failed attempts
   - Module 5: "Think Like a Developer" Playbook + Bug Hunter interactive debugging game

4. Build & Grow (/build)
   - Module 6: 22 Real-World Projects (10 Beginner + 12 Intermediate) with step-by-step plans & GitHub upload guides
   - Module 7: Lightweight Tech News (8 categories, daily tech fact, Indian self-taught developer stories)
   - Module 8: Career Roadmaps (Python, Data Analyst, Web/Freelance, Cybersecurity) + Resume/LinkedIn/GitHub checklists

5. Settings & Accessibility (Utility Bar / Profile Sheet)
   - Instant English / Hindi toggle, Light / Dark mode, Font size scaling, Offline storage manager, Optional Login for cross-device sync.`,
  },
  {
    id: 2,
    title: '2. Screen-by-Screen UI Plan',
    summary: 'Thumb-zone ergonomic layout, <=15% sticky chrome, 44px touch targets, and dual-theme contrast.',
    content: `- Global Header (52px mobile / 60px desktop): Brand wordmark ("TechStart India"), concise single-line navigation, single Primary CTA ("Continue Learning").
- Mobile Bottom Navigation (64px): 4–5 thumb-reachable tabs (Home, Learn, Practice, Build & Grow, Spec) keeping total sticky height < 15% of mobile viewport.
- Home Screen:
  * Top Strip: Language (EN/हिंदी) + Theme (Light/Dark) + Offline Saved count.
  * Hero Card: Welcome message + Today's Goal + Primary Resume button + Daily Streak & Level readout.
  * 4 Quick Action Buttons (min-height 48px, clear single-line labels).
  * 5 Progress Bars with tabular-nums percentages.
  * Badges Grid + Opt-in Weekly Leaderboard.
- Lesson Reader Screen:
  * Top Breadcrumb + Offline Save toggle + Mark Complete CTA.
  * Visual Diagram / Real-Life Analogy Card (study desk for RAM, chef for CPU, etc.).
  * Why It Matters + Syntax + Line-by-Line Code Breakdown + Common Mistakes.
  * Practical Task Callout + Inline 3-Question Quiz with instant feedback.
- Coding Practice & Bug Hunter Screen:
  * Problem Statement + Difficulty + XP reward.
  * Monospace Code Editor (IBM Plex Mono, 15px readable font, Tab-to-4-spaces).
  * Action Bar: Run Code | Submit & Test | Hint (progressive) | Reset.
  * Output Console + Friendly Error Explanation Box (English/Hindi) + Sample/Hidden Test Case matrix.`,
  },
  {
    id: 3,
    title: '3. Database Design (PostgreSQL / SQLite)',
    summary: 'Clean relational schema supporting offline sync, bilingual content, test cases, and privacy-first gamification.',
    content: `-- Core tables (SQLite for local dev, PostgreSQL for production)

CREATE TABLE users (
  id UUID PRIMARY KEY,
  display_name VARCHAR(60) NOT NULL,
  email VARCHAR(120) UNIQUE,            -- Nullable: no forced login!
  preferred_lang VARCHAR(5) DEFAULT 'en',
  theme_mode VARCHAR(10) DEFAULT 'light',
  leaderboard_opt_in BOOLEAN DEFAULT FALSE,
  xp_total INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
  id VARCHAR(40) PRIMARY KEY,
  module_type VARCHAR(20) NOT NULL,     -- 'computer' | 'windows_excel' | 'python'
  unit_name VARCHAR(80),
  lesson_order INTEGER NOT NULL,
  level VARCHAR(20),                    -- 'Beginner' | 'Intermediate'
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  content_json JSONB NOT NULL,          -- Definition, analogy, code, line_by_line, practical_task
  version INTEGER DEFAULT 1             -- Enables smart offline cache invalidation
);

CREATE TABLE coding_challenges (
  id VARCHAR(40) PRIMARY KEY,
  lesson_id VARCHAR(40) REFERENCES lessons(id),
  difficulty VARCHAR(15) NOT NULL,      -- 'Easy' | 'Medium' | 'Hard'
  xp_reward INTEGER DEFAULT 25,
  is_daily BOOLEAN DEFAULT FALSE,
  starter_code TEXT NOT NULL,
  solution_code TEXT NOT NULL,
  hints_json JSONB NOT NULL
);

CREATE TABLE test_cases (
  id VARCHAR(40) PRIMARY KEY,
  challenge_id VARCHAR(40) REFERENCES coding_challenges(id),
  stdin_input TEXT NOT NULL,
  expected_stdout TEXT NOT NULL,
  is_hidden BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_progress (
  user_id UUID REFERENCES users(id),
  item_id VARCHAR(40) NOT NULL,         -- lesson_id or challenge_id or bug_id
  item_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id),
  badge_id VARCHAR(40) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_id)
);`,
  },
  {
    id: 4,
    title: '4. Complete Python Course Curriculum (104 Lessons)',
    summary: '10 units spanning Absolute Zero to Advanced-Intermediate, 3–7 mins each with a challenge per topic.',
    content: `Unit 1: Getting Started (Lessons 1–5)
  1. What is Programming? | 2. Why Python? | 3. Installing Python & VS Code | 4. First print("Hello, World!") | 5. Comments
Unit 2: Variables, Input & Operators (Lessons 6–12)
  6. Variables & Naming | 7. Data Types (int, float, str, bool) | 8. input() & Output | 9. Arithmetic & Comparison Operators | 10. Type Conversion | 11–12. Applied Labs (Bill Splitter, Temperature Converter)
Unit 3: Strings & Text Mastery (Lessons 13–20)
  13. String Indexing | 14. Slicing [start:end] | 15. String Methods (strip, lower, upper, replace) | 16. split & join | 17. f-Strings | 18–20. Applied Labs (Name Cleaner, Email Masker, Word Counter)
Unit 4: Decisions & Loops (Lessons 21–32)
  21. Logical Operators (and, or, not) | 22. if Statement | 23. if-else & elif | 24. Ternary Expressions | 25. for Loops & range() | 26. while Loops | 27. break, continue, pass | 28. Nested Loops & Patterns | 29–32. Applied Labs (Grade Calculator, Tables, Prime Loop, ATM Menu)
Unit 5: Data Collections (Lessons 33–44)
  33. Lists | 34. List Methods (append, pop, sort) | 35. Tuples & Unpacking | 36. Sets & Uniqueness | 37. Dictionaries | 38. Dict Methods (get, keys, items) | 39–44. Applied Labs (Grocery Manager, Contact Book, Frequency Counter)
Unit 6: Functions & Scope (Lessons 45–54)
  45. Defining Functions (def) | 46. Parameters & Defaults | 47. Return vs Print | 48. *args & **kwargs | 49. Local vs Global Scope | 50–54. Applied Labs (GST Helper, Prime Function, Calculator Module)
Unit 7: Errors, Files, Modules & Debugging (Lessons 55–66)
  55. try/except/finally | 56. Common Exceptions | 57. Reading Text Files | 58. Writing & Appending Files | 59. with Context Manager | 60. Built-in Modules (math, random, datetime) | 61. pip & External Packages | 62. Virtual Environments (venv) | 63. Print Debugging | 64–66. Applied Labs (Crash-Proof Form, Daily Journal Logger)
Unit 8: Functional Python & Comprehensions (Lessons 67–76)
  67. Lambda Functions | 68. map() | 69. filter() | 70. reduce() | 71. List Comprehensions | 72. Conditional Comprehensions | 73. Dict Comprehensions | 74. Recursion | 75. Generators & yield | 76. Decorators Intro
Unit 9: Object-Oriented Programming (Lessons 77–88)
  77. OOP Concepts | 78. Classes & Objects | 79. __init__ Constructors | 80. Instance vs Class Attributes | 81. Inheritance | 82. super() & Method Overriding | 83. Polymorphism | 84. Encapsulation | 85. Dunder Methods (__str__, __len__) | 86–88. Applied Labs (BankAccount, Library Book, Student Class)
Unit 10: Real-World Files, APIs, Concurrency & Pro Code (Lessons 89–104)
  89. Working with JSON | 90. Working with CSV | 91. Using requests Library | 92. Consuming REST APIs | 93. Web Scraping Ethics & BeautifulSoup Basics | 94. Regular Expressions (Regex) | 95. Multithreading Basics | 96. Multiprocessing Basics | 97. Async/Await Basics | 98. PEP 8 Clean Code | 99. Writing Unit Tests (unittest/pytest) | 100. Docstrings & Type Hints | 101–104. Capstone Review & Production Checklist.`,
  },
  {
    id: 5,
    title: '5. Coding Challenge List with Test Cases',
    summary: 'Progressive Easy → Medium → Hard challenges with sample + hidden test cases and 3-attempt solution unlock.',
    content: `1. Sum of Two Numbers (Easy, 25 XP): Sample: "5\\n3" -> "8" | Hidden: "-4\\n10" -> "6", "0\\n0" -> "0"
2. Even or Odd Checker (Easy, 25 XP): Sample: "4" -> "Even", "7" -> "Odd" | Hidden: "0" -> "Even", "99" -> "Odd"
3. Print Even Numbers 1..N (Easy, 30 XP): Sample: "6" -> "2\\n4\\n6" | Hidden: "5" -> "2\\n4"
4. Largest of Three Numbers (Easy, 30 XP): Sample: "10\\n25\\n15" -> "25" | Hidden: "-5\\n-2\\n-9" -> "-2"
5. Count Vowels in Word (Medium, 45 XP): Sample: "India" -> "3" | Hidden: "AEIOU" -> "5", "sky" -> "0"
6. Prime Number Checker (Medium, 50 XP): Sample: "7" -> "Prime", "9" -> "Not Prime" | Hidden: "1" -> "Not Prime", "2" -> "Prime"
7. Palindrome Word Checker (Medium, 45 XP): Sample: "Madam" -> "Yes" | Hidden: "nayan" -> "Yes"
8. Factorial Calculator (Medium, 50 XP): Sample: "5" -> "120" | Hidden: "0" -> "1", "6" -> "720"
9. Nth Fibonacci Number (Hard, 75 XP): Sample: "6" -> "5" | Hidden: "1" -> "0", "8" -> "13"
10. Second Largest Unique Number (Hard, 80 XP): Sample: "10 20 20 5 15" -> "15" | Hidden: "-10 -3 -1 -5" -> "-3"

Test-Case Engine Rules:
- Always show exact input, expected output, and actual output for failed visible tests.
- For hidden tests, report pass/fail and test category (e.g., "Edge case: n=1") without leaking secret input.
- Reveal solution button unlocks automatically after 3 failed submissions.`,
  },
  {
    id: 6,
    title: '6. Bug-Hunter Challenge Ideas',
    summary: 'Gamified debugging exercises teaching beginners to read tracebacks, catch off-by-one errors, and fix types.',
    content: `1. Missing Bracket in Greeting (Easy): \`name = input("Name: "\` -> teaches balanced parentheses.
2. String + Number Trap (Easy): \`a = input(); b = input(); print(a + b)\` -> teaches \`int()\` conversion.
3. Assignment = vs Comparison == (Easy): \`if marks = 100:\` -> teaches equality operator \`==\`.
4. Missing Colon & Indentation (Easy): \`for i in range(3)\\nprint(i)\` -> teaches Python block structure.
5. Off-by-One Loop Range (Medium): \`range(1, 5)\` when expecting sum 1..5 -> teaches exclusive upper bound.
6. Function Prints/Drops Return (Medium): Missing \`return\` keyword gives \`None\`.
7. Infinite While Loop (Medium): Missing \`count += 1\` inside loop.
8. List Index Out of Range (Hard): Accessing \`items[3]\` on 3-element list.
9. Mutable Default Argument Trap (Hard): \`def add_item(x, lst=[]):\` -> teaches \`lst=None\`.
10. Silent Division-by-Zero Crash (Hard): Unchecked denominator in billing script.

Scoring: +100% XP if solved without hints, +75% XP with 1 hint, +50% XP with 2 hints.`,
  },
  {
    id: 7,
    title: '7. Real-World Project List & Step-by-Step Plans',
    summary: '22 original projects (10 Beginner + 12 Intermediate) with test cases, common bugs, and GitHub portfolio instructions.',
    content: `Beginner Projects (10):
1. Smart CLI Calculator | 2. Number Guessing Game | 3. Strong Password Generator | 4. Daily Study To-Do List | 5. Metric/Currency Unit Converter | 6. MCQ Quiz App | 7. Rock-Paper-Scissors | 8. Dice Simulator | 9. Exact Age & Birthday Countdown | 10. Tea-Stall GST Billing Calculator.

Intermediate Projects (12):
1. Hostel Monthly Expense Tracker (CSV export) | 2. Encrypted Password Vault Concept | 3. Downloads Folder Auto-Organizer (os/shutil) | 4. Ethical Headline Scraper | 5. Live Weather CLI (Open-Meteo JSON API) | 6. UPI/Website QR Code Generator | 7. PDF Merger Utility | 8. Bulk Certificate/Email Template Sender | 9. Student Record & Topper Analyzer | 10. Library Book Issue/Return System | 11. Kirana Store Inventory Manager | 12. Census/Sales CSV Data Analysis Project.

Every project card includes: Goal, Feature Checklist, 3-Step Build Plan, Starter Code, Common Bugs, Verification Test Cases, Stretch Improvements, and a GitHub README Template.`,
  },
  {
    id: 8,
    title: '8. Tech News & Motivation Integration Plan',
    summary: 'Low-bandwidth RSS + curated editorial feed keeping news optional and non-distracting.',
    content: `- Sources: Curated open RSS feeds (Python.org Blog, PIB/Digital India Tech, CERT-In advisories, Hacker News top beginner-friendly posts, official Android/AI announcements).
- Backend Sync Worker: Runs every 6 hours on server -> extracts title, 2-sentence plain-English/Hindi summary, category tag (AI, Smartphones, Coding, Cybersecurity, Startups, Jobs, Gadgets, India Tech) -> caches lightweight JSON (<15 KB payload) for 2G/3G efficiency.
- Motivation Section: Daily Tech Fact + Weekly Career Tip + Verified Stories of Self-Taught Indian Developers from Tier-2/3 towns + "Build Something Today" micro-prompt.
- Distraction Guard: Strictly lives in its own tab ("Build & Grow") — zero popups or news tickers during lessons or coding practice.`,
  },
  {
    id: 9,
    title: '9. Gamification System',
    summary: 'Intrinsic motivation through streaks, tabular XP, meaningful skill badges, and opt-in privacy-safe leaderboards.',
    content: `- Daily Streak: Counts consecutive days with at least 1 completed lesson, quiz, coding challenge, or Bug Hunter solve. Includes 1 free "Sunday Rest Grace" per week so students do not burn out.
- XP Economy:
  * Computer/Windows Lesson: +20 XP | Practical Quiz: +15 XP
  * Python Micro-Lesson: +25 XP
  * Coding Challenge: +25 XP (Easy), +50 XP (Medium), +80 XP (Hard)
  * Bug Hunter: +30 to +65 XP (bonus for zero hints)
- Levels: Level = floor(XP / 100) + 1 (Level 1 Explorer -> Level 10 Builder -> Level 25 Problem Solver).
- Badges: First Code, Hardware Hero, Excel Explorer, Loop Master, Bug Hunter, Challenge Solver, Project Builder, 7-Day Streak, 30-Day Streak.
- Privacy-First Leaderboard: Opt-in ONLY. Never exposes real email, phone number, or city without user choice.`,
  },
  {
    id: 10,
    title: '10. Development Roadmap (30 / 60 / 90 Days)',
    summary: 'Phased engineering plan from MVP launch to community-translated regional expansion.',
    content: `Days 1–30 (MVP Foundation & Core Learning):
- Set up MIT-licensed GitHub monorepo (React Native / Web PWA + FastAPI + SQLite/PostgreSQL).
- Ship Module 1 (28 Computer Basics with diagrams & quizzes) + Module 2 (Windows, Shortcuts, 5 Excel labs).
- Ship first 40 Python lessons + offline local cache + English/Hindi switcher + Dark/Light mode.
- Ship in-app sandboxed Python runner (Pyodide offline WebAssembly / sandboxed container) with 15 challenges & 10 Bug Hunter levels.

Days 31–60 (Full Curriculum, Projects & Beta Testing):
- Complete remaining 64 Python lessons (total 104 lessons) + all 22 real-world project guides.
- Add RSS-cached Tech News & Indian Developer Stories + Career Roadmaps.
- Run beta tests with 200 students from Tier-2/3 colleges on ₹7,000–₹10,000 Android phones; optimize bundle size < 5 MB and cold start < 2 seconds.

Days 61–90 (Community, Open Source & Scale):
- Publish "Good First Issues" on GitHub for community contributors (more Bug Hunter puzzles, Hindi proofreading, Marathi/Tamil/Telugu/Bengali translation JSONs).
- Add downloadable PDF completion certificates (verifiable local/hash ID) and automated GitHub Actions CI for test cases.`,
  },
  {
    id: 11,
    title: '11. GitHub Repository Structure',
    summary: 'Clean monorepo layout welcoming first-time open-source contributors.',
    content: `techstart-india/
├── README.md                 # Project mission, screenshots, 3-step local setup
├── LICENSE                   # MIT License
├── CONTRIBUTING.md           # Beginner-friendly PR guide & Hindi translation rules
├── CODE_OF_CONDUCT.md
├── mobile/                   # React Native (Expo) or Flutter mobile client
│   ├── src/
│   │   ├── screens/          # Home, Learn, Practice, BugHunter, Build, Career
│   │   ├── components/       # CodeEditor, DiagramViewer, QuizCard, OfflineBadge
│   │   ├── i18n/             # en.json, hi.json
│   │   └── storage/          # Offline SQLite / AsyncStorage lesson cache
├── backend/                  # FastAPI Python API
│   ├── app/
│   │   ├── main.py
│   │   ├── models/           # SQLAlchemy User, Lesson, Challenge, Progress
│   │   ├── routers/          # lessons, challenges, news, leaderboard
│   │   └── sandbox/          # Isolated Python runner (CPU/RAM/time limits, no network)
├── content/                  # Human-editable JSON/Markdown curriculum!
│   ├── computer_basics/      # Easy for teachers/volunteers to submit PRs
│   ├── windows_excel/
│   ├── python_104/
│   ├── challenges/
│   └── bug_hunter/
└── .github/workflows/        # Automated lint, test-case verification, and build CI`,
  },
  {
    id: 12,
    title: '12. Open-Source Contribution Guide',
    summary: 'How students, teachers, and senior devs can contribute code, translations, or test cases.',
    content: `1. Fork the repository and create a branch (\`git checkout -b fix/hindi-lesson-12\`).
2. Non-coders & teachers can contribute directly inside \`content/\` JSON files:
   - Fix Hindi/English phrasing so every term is explained in 1 simple line.
   - Add new Bug Hunter puzzles with at least 2 progressive hints.
   - Add real-life Indian analogies (railways, kirana shop, chai stall, cricket).
3. Developers can pick \`good-first-issue\` tickets:
   - UI accessibility improvements (44px tap targets, TalkBack labels).
   - Automated unit tests verifying every challenge's \`solution_code\` passes 100% of its \`test_cases\`.
4. Pull Request Rules: Keep PRs focused on 1 feature/lesson, run \`npm test\` / \`pytest\`, and never commit API keys or copyrighted third-party course material.`,
  },
  {
    id: 13,
    title: '13. Marketing Plan for Indian Students',
    summary: 'Zero-budget grassroots distribution focused on colleges, polytechnics, and regional communities.',
    content: `1. Campus Ambassadors & NSS/Coding Clubs: Partner with B.Com, BA, BCA, and Polytechnic colleges in Tier-2/3 cities (Indore, Patna, Jaipur, Nagpur, Ranchi, Madurai) to run 1-hour "First Python Program" workshops.
2. Offline-Friendly Sharing: Allow exporting/sharing lightweight lesson packs over WhatsApp/Telegram without heavy 500MB video downloads.
3. Regional Language Short Reels (30–45s): Post zero-hype practical reels like "How RAM Works Like Your Study Desk (Hindi)" or "Spot the Python Bug in 15 Seconds" linking to the free open-source app.
4. Teacher & Cyber-Cafe Kits: Provide a free printable 1-page keyboard shortcuts & Python starter poster for local computer coaching centers and cyber cafes.`,
  },
  {
    id: 14,
    title: '14. Ethical Monetization (Core Learning 100% Free Forever)',
    summary: 'Sustainable funding without paywalling lessons, challenges, or showing intrusive ads.',
    content: `Strict Guarantee: All lessons (Computer Basics, Windows/Excel, 104 Python lessons), Coding Challenges, Bug Hunter, Projects, and Offline Downloads remain 100% FREE with ZERO in-lesson ads forever.

Sustainable Revenue & Funding Channels:
1. CSR & Educational Grants: Partner with Indian corporate CSR programs and foundations funding digital literacy in rural/semi-urban colleges.
2. GitHub Sponsors & Community Donations: Transparent OpenCollective ledger covering server/domain hosting (~₹3,000–₹8,000/month).
3. Optional Verified Assessment / College White-Label Portal: Colleges or NGOs running large computer labs can pay a nominal institutional hosting fee for batch progress reports while students use the app free.
4. Optional Printed Pocket Handbooks: Low-cost physical bilingual cheat-sheet books (Shortcuts + Excel + Python) sold at cost + tiny margin to fund servers.`,
  },
];
