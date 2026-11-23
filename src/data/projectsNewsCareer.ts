import { BadgeItem, CareerTrack, NewsItem, ProjectSpec, SuccessStory, UserProgress } from '../types';

export const PROJECTS: ProjectSpec[] = [
  {
    id: 'proj-calculator',
    title: { en: 'Smart CLI Calculator', hi: 'स्मार्ट CLI कैलकुलेटर' },
    level: 'Beginner',
    duration: '45 mins',
    topicsUsed: ['Variables', 'Input/Output', 'if/elif/else', 'try/except'],
    goal: { en: 'Build a crash-proof calculator supporting +, -, *, / with clear error messages.', hi: 'एक सुरक्षित कैलकुलेटर बनाएँ जो +, -, *, / करे और 0 से भाग देने पर क्रैश न हो।' },
    features: [
      { en: 'Reads two numbers and an operator', hi: 'दो संख्याएँ और एक ऑपरेटर (+, -, *, /) लेता है' },
      { en: 'Safely catches division by zero', hi: '0 से भाग देने पर सुरक्षित संदेश दिखाता है' },
      { en: 'Handles invalid non-numeric inputs cleanly', hi: 'गलत इनपुट पर क्रैश नहीं होता' },
    ],
    stepByStepPlan: [
      { en: 'Ask the user for two numbers using float(input()).', hi: 'float(input()) से दो नंबर लें।' },
      { en: 'Ask for the operation (+, -, *, /).', hi: 'ऑपरेटर (+, -, *, /) पूछें।' },
      { en: 'Use if/elif/else to compute the result and check divisor != 0.', hi: 'if/elif/else से गणना करें और भाग में 0 की जाँच करें।' },
    ],
    starterCode: 'def calculate(a, op, b):\n    if op == "+": return a + b\n    if op == "-": return a - b\n    if op == "*": return a * b\n    if op == "/":\n        return "Cannot divide by zero" if b == 0 else a / b\n    return "Unknown operator"\n\nprint(calculate(24, "+", 16))\nprint(calculate(10, "/", 0))',
    codeExplanation: { en: 'Separating calculation into a `calculate()` function makes it reusable and easy to test with automated inputs.', hi: 'गणना को `calculate()` फ़ंक्शन में रखने से उसे दोबारा उपयोग करना और टेस्ट करना आसान हो जाता है।' },
    commonBugs: [
      { en: 'Forgetting `float()` causes `"5" + "3"` to return `"53"` instead of `8`.', hi: '`float()` न लगाने पर `"5" + "3"` का उत्तर `"53"` आ जाता है।' },
      { en: 'Dividing by zero crashes the script if not checked first.', hi: '0 से भाग की जाँच न करने पर प्रोग्राम क्रैश हो जाता है।' },
    ],
    testCases: [
      { input: '24, "+", 16', output: '40' },
      { input: '10, "/", 0', output: 'Cannot divide by zero' },
    ],
    improvementIdeas: [
      { en: 'Add percentage (%) and power (**) operations', hi: 'प्रतिशत (%) और घात (**) जोड़ें' },
      { en: 'Store a history list of past calculations', hi: 'पिछली गणनाओं की हिस्ट्री सेव करें' },
    ],
    githubGuide: { en: 'Create repo `python-smart-calculator`, add `calculator.py` and a `README.md` with sample screenshots.', hi: 'GitHub पर `python-smart-calculator` रिपॉजिटरी बनाएँ और `README.md` में उदाहरण लिखें।' },
  },
  {
    id: 'proj-number-guess',
    title: { en: 'Number Guessing Game', hi: 'नंबर गेसिंग गेम' },
    level: 'Beginner',
    duration: '1 hour',
    topicsUsed: ['Loops', 'Conditions', 'Variables'],
    goal: { en: 'Create a game where players guess a secret number with "Too High" / "Too Low" hints.', hi: 'ऐसा गेम बनाएँ जिसमें खिलाड़ी गुप्त संख्या का अंदाज़ा लगाए और "Too High" / "Too Low" हिंट मिले।' },
    features: [
      { en: 'Counts total attempts taken', hi: 'कुल प्रयासों की गिनती रखता है' },
      { en: 'Gives warm/cold feedback after each guess', hi: 'हर प्रयास पर सही दिशा बताता है' },
    ],
    stepByStepPlan: [
      { en: 'Set a secret target number (or use random.randint(1, 50)).', hi: '1 से 50 के बीच एक गुप्त संख्या तय करें।' },
      { en: 'Run a while loop until guess == secret.', hi: 'जब तक सही जवाब न मिले, while लूप चलाएँ।' },
      { en: 'Print attempts count when solved.', hi: 'सही होने पर प्रयासों की संख्या प्रिंट करें।' },
    ],
    starterCode: 'secret = 27\nguesses = [15, 35, 27]\nfor attempt, g in enumerate(guesses, 1):\n    if g < secret:\n        print(f"Attempt {attempt}: {g} is Too Low")\n    elif g > secret:\n        print(f"Attempt {attempt}: {g} is Too High")\n    else:\n        print(f"Correct in {attempt} attempts!")\n        break',
    codeExplanation: { en: 'Using `enumerate(..., 1)` tracks attempt numbers cleanly without a manual counter.', hi: '`enumerate(..., 1)` अपने आप प्रयास की संख्या 1, 2, 3 गिनता है।' },
    commonBugs: [
      { en: 'Infinite loop when forgeting `break` after winning.', hi: 'जीतने पर `break` न लगाने से लूप चलता रहता है।' },
    ],
    testCases: [
      { input: 'guesses = [15, 35, 27]', output: 'Correct in 3 attempts!' },
    ],
    improvementIdeas: [
      { en: 'Add Easy (1-20) and Hard (1-100) difficulty modes', hi: 'आसान (1-20) और कठिन (1-100) लेवल जोड़ें' },
    ],
    githubGuide: { en: 'Push to GitHub with a short GIF or terminal output example in README.', hi: 'README में टर्मिनल आउटपुट उदाहरण के साथ GitHub पर अपलोड करें।' },
  },
  {
    id: 'proj-password-gen',
    title: { en: 'Strong Password Generator', hi: 'मज़बूत पासवर्ड जनरेटर' },
    level: 'Beginner',
    duration: '1 hour',
    topicsUsed: ['Strings', 'Loops', 'Lists', 'Functions'],
    goal: { en: 'Generate strong, non-guessable passwords mixing letters, digits, and symbols.', hi: 'अक्षर, अंक और चिह्न मिलाकर मज़बूत पासवर्ड बनाने वाला टूल।' },
    features: [
      { en: 'Custom password length', hi: 'मनचाही लंबाई चुनने की सुविधा' },
      { en: 'Checks password strength score', hi: 'पासवर्ड की मज़बूती जाँचता है' },
    ],
    stepByStepPlan: [
      { en: 'Combine uppercase, lowercase, digits, and special characters.', hi: 'बड़े अक्षर, छोटे अक्षर, अंक और चिह्न मिलाएँ।' },
      { en: 'Pick characters deterministically or via `random.choice()`.', hi: 'लूप से एक-एक कर अक्षर चुनें और जोड़ें।' },
    ],
    starterCode: 'def check_strength(pw):\n    has_digit = any(c.isdigit() for c in pw)\n    has_upper = any(c.isupper() for c in pw)\n    if len(pw) >= 10 and has_digit and has_upper:\n        return "Strong Password"\n    return "Weak — add length, digits & capitals"\n\nprint(check_strength("ChaiCode2026!"))',
    codeExplanation: { en: '`any(...)` checks efficiently if at least one character satisfies a rule.', hi: '`any(...)` जांचता है कि कम से कम एक अक्षर नियम पूरा करता है या नहीं।' },
    commonBugs: [
      { en: 'Creating passwords shorter than 8 characters.', hi: '8 अक्षरों से छोटे पासवर्ड कमजोर होते हैं।' },
    ],
    testCases: [{ input: '"ChaiCode2026!"', output: 'Strong Password' }],
    improvementIdeas: [{ en: 'Exclude confusing characters like 0/O and 1/l', hi: '0/O और 1/l जैसे भ्रमित करने वाले अक्षर हटाएँ' }],
    githubGuide: { en: 'Include safety tips in README so beginners learn cybersecurity too.', hi: 'README में पासवर्ड सुरक्षा नियम भी लिखें।' },
  },
  {
    id: 'proj-todo-list',
    title: { en: 'Daily Study To-Do List Manager', hi: 'दैनिक पढ़ाई टू-डू लिस्ट मैनेजर' },
    level: 'Beginner',
    duration: '1 hour',
    topicsUsed: ['Lists', 'Dictionaries', 'Loops', 'Functions'],
    goal: { en: 'Add, complete, and view daily study tasks in a clean terminal list.', hi: 'दैनिक पढ़ाई के काम जोड़ें, पूरा मार्क करें और देखें।' },
    features: [
      { en: 'Add tasks with status (Pending/Done)', hi: 'टास्क जोड़ना और पूरा मार्क करना' },
      { en: 'Summary count of remaining tasks', hi: 'बाकी बचे कामों की गिनती' },
    ],
    stepByStepPlan: [
      { en: 'Store tasks as a list of dictionaries `{"title": ..., "done": False}`.', hi: 'हर टास्क को डिक्शनरी में स्टोर करें।' },
      { en: 'Write functions `add_task`, `mark_done`, and `show_tasks`.', hi: 'अलग-अलग फ़ंक्शन बनाकर लिस्ट अपडेट करें।' },
    ],
    starterCode: 'tasks = [{"title": "Learn RAM", "done": True}, {"title": "Solve 1 Python challenge", "done": False}]\nfor idx, t in enumerate(tasks, 1):\n    mark = "[x]" if t["done"] else "[ ]"\n    print(f"{idx}. {mark} {t[\'title\']}")',
    codeExplanation: { en: 'Representing each task as a dictionary makes extending with due dates effortless.', hi: 'डिक्शनरी से हर टास्क में तारीख या प्राथमिकता जोड़ना आसान होता है।' },
    commonBugs: [{ en: 'Forgetting to subtract 1 when user types task number 1 (index 0).', hi: 'यूज़र द्वारा चुने गए नंबर 1 को इंडेक्स 0 में बदलना भूल जाना।' }],
    testCases: [{ input: '2 tasks', output: '1. [x] Learn RAM\n2. [ ] Solve 1 Python challenge' }],
    improvementIdeas: [{ en: 'Save tasks into a JSON file so they persist after closing', hi: 'टास्क को JSON फाइल में स्थायी सेव करें' }],
    githubGuide: { en: 'Add `todo.py` and sample `tasks.json` in your repo.', hi: 'GitHub पर `todo.py` के साथ सैंपल `tasks.json` अपलोड करें।' },
  },
  {
    id: 'proj-expense-tracker',
    title: { en: 'Hostel Monthly Expense Tracker', hi: 'हॉस्टल मासिक खर्च ट्रैकर' },
    level: 'Intermediate',
    duration: '2 hours',
    topicsUsed: ['Dictionaries', 'List Comprehensions', 'CSV/JSON', 'Functions'],
    goal: { en: 'Categorize expenses (Food, Travel, Study), compute category totals, and alert if budget exceeds.', hi: 'खर्च को श्रेणियों (खाना, सफर, पढ़ाई) में बाँटें और बजट पार होने पर अलर्ट दिखाएँ।' },
    features: [
      { en: 'Category-wise total aggregation', hi: 'हर श्रेणी का कुल खर्च' },
      { en: 'Highest expense detection & budget warning', hi: 'सबसे बड़ा खर्च और बजट चेतावनी' },
    ],
    stepByStepPlan: [
      { en: 'Store entries as `{"item": ..., "cat": ..., "amount": ...}`.', hi: 'हर खर्च को लिस्ट में डिक्शनरी की तरह रखें।' },
      { en: 'Aggregate totals per category using a dictionary.', hi: 'डिक्शनरी की मदद से श्रेणीवार कुल जोड़ें।' },
      { en: 'Compare grand total with monthly budget.', hi: 'कुल खर्च की तुलना मासिक बजट से करें।' },
    ],
    starterCode: 'expenses = [\n    {"cat": "Food", "amt": 120},\n    {"cat": "Books", "amt": 350},\n    {"cat": "Food", "amt": 80}\n]\nsummary = {}\nfor e in expenses:\n    c = e["cat"]\n    summary[c] = summary.get(c, 0) + e["amt"]\nprint(summary)\nprint("Total:", sum(summary.values()))',
    codeExplanation: { en: '`summary.get(c, 0)` avoids KeyError when seeing a category for the first time.', hi: '`summary.get(c, 0)` पहली बार नई श्रेणी आने पर KeyError से बचाता है।' },
    commonBugs: [{ en: 'Trying `summary[c] += amt` before checking if `c` exists in `summary`.', hi: 'पहली बार बिना `get()` उपयोग किए सीधे जोड़ने पर KeyError आता है।' }],
    testCases: [{ input: 'Food 120, Books 350, Food 80', output: "{'Food': 200, 'Books': 350}\nTotal: 550" }],
    improvementIdeas: [{ en: 'Export monthly report to CSV for Excel charts', hi: 'मासिक रिपोर्ट को CSV में सेव करें ताकि Excel में चार्ट बने' }],
    githubGuide: { en: 'Great portfolio project! Add a table of sample monthly output in README.', hi: 'रेज़्यूमे में लगाने के लिए बेहतरीन प्रोजेक्ट — README में सैंपल आउटपुट जोड़ें।' },
  },
  {
    id: 'proj-student-record',
    title: { en: 'Student Record & Marks Analyzer', hi: 'स्टूडेंट रिकॉर्ड और अंक विश्लेषक' },
    level: 'Intermediate',
    duration: '2.5 hours',
    topicsUsed: ['OOP / Dictionaries', 'Sorting', 'Error Handling', 'Files'],
    goal: { en: 'Manage student roll numbers, marks, class topper, and subject averages.', hi: 'छात्रों के रोल नंबर, अंक, क्लास टॉपर और विषय औसत की गणना करें।' },
    features: [
      { en: 'Calculates percentage & grade automatically', hi: 'प्रतिशत और ग्रेड अपने आप निकालता है' },
      { en: 'Ranks topper and flags students needing extra coaching', hi: 'टॉपर चुनता है और कमज़ोर विषयों की पहचान करता है' },
    ],
    stepByStepPlan: [
      { en: 'Model each student record cleanly with roll, name, and scores list.', hi: 'हर छात्र के रोल नंबर, नाम और अंकों का डेटा बनाएँ।' },
      { en: 'Compute average per student and sort descending to find topper.', hi: 'औसत निकालें और घटते क्रम में लगाकर टॉपर ढूँढें।' },
    ],
    starterCode: 'students = [\n    {"name": "Ananya", "marks": [88, 92, 84]},\n    {"name": "Vikram", "marks": [70, 65, 75]},\n    {"name": "Meera", "marks": [95, 91, 94]}\n]\nbest_name = ""\nbest_avg = 0\nfor s in students:\n    avg = sum(s["marks"]) / len(s["marks"])\n    if avg > best_avg:\n        best_avg = avg\n        best_name = s["name"]\nprint(f"Topper: {best_name} ({round(best_avg, 1)}%)")',
    codeExplanation: { en: 'Tracking `best_avg` and `best_name` in a single pass finds the topper cleanly.', hi: 'एक ही लूप में सबसे बड़ा औसत ट्रैक करके टॉपर आसानी से मिल जाता है।' },
    commonBugs: [{ en: 'Dividing by zero if a student has an empty marks list.', hi: 'यदि अंकों की लिस्ट खाली हो तो 0 से भाग होने का खतरा।' }],
    testCases: [{ input: '3 students', output: 'Topper: Meera (93.3%)' }],
    improvementIdeas: [{ en: 'Add search by roll number & CSV import/export', hi: 'रोल नंबर से सर्च और CSV एक्सपोर्ट जोड़ें' }],
    githubGuide: { en: 'Document all functions and include 3 unit tests in `test_records.py`.', hi: '`test_records.py` में 3 छोटे टेस्ट जोड़कर GitHub पर डालें।' },
  },
  {
    id: 'proj-weather-api',
    title: { en: 'Indian City Weather CLI (API + JSON)', hi: 'भारतीय शहर मौसम ऐप (API व JSON)' },
    level: 'Intermediate',
    duration: '2 hours',
    topicsUsed: ['requests', 'JSON', 'try/except', 'Clean Code'],
    goal: { en: 'Fetch and format real-time weather JSON data cleanly without crashing offline.', hi: 'API से JSON मौसम डेटा लाना और नेटवर्क न होने पर सुरक्षित संदेश दिखाना।' },
    features: [
      { en: 'Parses nested JSON response', hi: 'JSON डेटा से तापमान और हवा की जानकारी निकालता है' },
      { en: 'Graceful offline error handling', hi: 'इंटरनेट न होने पर क्रैश नहीं होता' },
    ],
    stepByStepPlan: [
      { en: 'Use Open-Meteo free no-key API URL in real Python (`requests.get`).', hi: 'असली Python में बिना किसी API कुंजी के Open-Meteo API उपयोग करें।' },
      { en: 'Extract temperature, windspeed, and condition code from JSON.', hi: 'JSON से तापमान और मौसम स्थिति निकालें।' },
    ],
    starterCode: '# Simulated API JSON response (works offline!)\napi_response = {\n    "city": "Lucknow",\n    "current": {"temp_c": 27.5, "humidity": 48, "sky": "Clear"}\n}\nc = api_response["current"]\nprint(f"{api_response[\'city\']}: {c[\'temp_c\']}C, Humidity {c[\'humidity\']}%, {c[\'sky\']}")',
    codeExplanation: { en: 'Practicing JSON parsing with a mock response prepares you directly for live `requests.get(url).json()`.', hi: 'सैंपल JSON से अभ्यास करने पर आप असली `requests.get(url).json()` तुरंत चला सकते हैं।' },
    commonBugs: [{ en: 'Forgetting `response.status_code == 200` check before parsing JSON.', hi: 'JSON पढ़ने से पहले `status_code == 200` की जाँच न करना।' }],
    testCases: [{ input: 'Lucknow JSON', output: 'Lucknow: 27.5C, Humidity 48%, Clear' }],
    improvementIdeas: [{ en: 'Compare 3 cities side-by-side and suggest umbrella if rain > 50%', hi: '3 शहरों की तुलना करें और बारिश होने पर छाता लेने की सलाह दें' }],
    githubGuide: { en: 'Add `requirements.txt` listing `requests` so others can install and run easily.', hi: '`requirements.txt` फाइल में `requests` जरूर लिखें।' },
  },
];

export const ALL_PROJECT_TITLES = {
  beginner: [
    'Calculator', 'Number Guessing Game', 'Password Generator', 'To-Do List',
    'Unit Converter', 'Simple Quiz App', 'Rock Paper Scissors Game', 'Dice Roller',
    'Age Calculator', 'Simple Billing Calculator',
  ],
  intermediate: [
    'Expense Tracker', 'Password Manager Concept', 'File Organizer', 'Web Scraper',
    'Weather App using API', 'QR Code Generator', 'PDF Merger', 'Email Automation Concept',
    'Student Record System', 'Library Management System', 'Inventory Management System',
    'Simple Data Analysis Project',
  ],
};

const TODAY_IST_LABEL = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date());

export const TECH_NEWS: NewsItem[] = [
  {
    id: 'news-starlink-jio',
    category: 'Telecom & Satellite',
    highlightStat: `Telecom & Space · ${TODAY_IST_LABEL}`,
    title: {
      en: 'Ambani’s Reliance Jio vs Elon Musk’s Starlink: Satellite Internet Battle in India',
      hi: 'Mukesh Ambani ki Reliance Jio vs Elon Musk ka Starlink: Bharat mein Satellite Internet ki badi jung',
    },
    summary: {
      en: 'Reliance Jio and Airtel are challenging satellite spectrum rules as Elon Musk’s Starlink pushes to launch high-speed space internet directly to Indian homes and rural areas.',
      hi: 'Reliance Jio aur Airtel ne maang ki hai ki Elon Musk ki Starlink company ko spectrum nilami ke zariye mile, taaki Bharat ke gaon aur shahron mein fair internet competition rahe.',
    },
    companySummary: {
      en: 'What is Starlink & Jio? Starlink is SpaceX’s satellite broadband network (thousands of low-orbit satellites beaming internet without cables). Reliance Jio is India’s largest 4G/5G telecom network led by Mukesh Ambani.',
      hi: 'Starlink aur Jio kya hai? Starlink, Elon Musk ki SpaceX company ka satellite internet project hai jo bina mobile tower ke seedha space se internet deta hai. Reliance Jio Bharat ki sabse badi 5G network company hai.',
    },
    whyItMatters: {
      en: 'Affordable broadband in Tier-2/3 cities and villages unlocks remote software jobs and cloud learning for millions of Indian students.',
      hi: 'Chhote shahron aur gaon tak fast internet pahunchne se har student ghar baithe coding aur remote IT job kar sakega.',
    },
    date: TODAY_IST_LABEL,
    readTime: '1 min read',
    sourceName: 'India Telecom Desk',
    externalUrl: 'https://www.trai.gov.in/',
  },
  {
    id: 'news-gta6',
    category: 'Gaming & Gadgets',
    highlightStat: `Rockstar Games · GTA 6 Tech · ${TODAY_IST_LABEL}`,
    title: {
      en: 'GTA 6 Latest Updates: How Next-Gen Graphics & AI Simulation Power the Biggest Game Launch',
      hi: 'GTA 6 Latest Updates: Kaise AI characters aur 3D graphics duniya ka sabse bada game bana rahe hain',
    },
    summary: {
      en: 'Gaming tech fans are tracking Grand Theft Auto VI (GTA 6) milestones as Rockstar Games pushes PS5/Xbox Series GPUs, real-time lighting, and autonomous NPC behavior.',
      hi: 'Grand Theft Auto VI (GTA 6) ke updates tech world mein chhaye hue hain—isme real-time ray-tracing graphics aur smart AI NPCs use ho rahe hain.',
    },
    companySummary: {
      en: 'About Rockstar Games & GTA 6: Rockstar Games builds the Grand Theft Auto series—a multi-billion-dollar software engineering feat blending C++, Python automation tools, 3D shaders, and GPU physics.',
      hi: 'Rockstar Games & GTA 6 kya hai? Rockstar Games woh studio hai jo GTA banati hai. Isme C++, Python tools, 3D math aur advanced GPUs ka istemal hota hai.',
    },
    whyItMatters: {
      en: 'Behind hit games are thousands of software, graphics, QA testing, and Python tool engineers.',
      hi: 'Gaming industry mein bhi coding, bug testing aur Python automation tools ke liye badi opportunities hoti hain.',
    },
    date: TODAY_IST_LABEL,
    readTime: '45s read',
    sourceName: 'Gaming & Hardware Watch',
    externalUrl: 'https://www.rockstargames.com/',
  },
  {
    id: 'news-1',
    category: 'AI & Automation',
    highlightStat: `AI Agents · Coding & Sheets · ${TODAY_IST_LABEL}`,
    title: {
      en: 'Personal AI Agents Now Handle Multi-Step App & Sheet Tasks',
      hi: 'Personal AI Agents ab multi-step coding aur Excel workflows khud handle kar rahe hain',
    },
    summary: {
      en: 'Major AI labs are shifting from simple chatbots to agents that browse, test code, and summarize files while humans verify the final step.',
      hi: 'Badi AI companies ab simple chatbots se aage badh kar aise agents bana rahi hain jo code test aur data summarize karte hain.',
    },
    companySummary: {
      en: 'About AI Agents: Labs like OpenAI, Google DeepMind, and Anthropic train models that can execute Python tools and verify results step by step.',
      hi: 'AI Agents kya hain? OpenAI, Google aur Anthropic ke models jo tools aur Python code chala kar kaam complete karte hain.',
    },
    whyItMatters: {
      en: 'Learn Python basics + debugging so you can inspect and control AI-written code instead of guessing.',
      hi: 'Python aur debugging seekh kar aap AI ke likhe code ko khud verify aur fix kar sakte hain.',
    },
    date: TODAY_IST_LABEL,
    readTime: '30s read',
    sourceName: 'Tech Flash · AI',
    externalUrl: 'https://docs.python.org/3/',
  },
  {
    id: 'news-4',
    category: 'Big Tech & Startups',
    highlightStat: `Indian SaaS & Startups · ${TODAY_IST_LABEL}`,
    title: {
      en: 'Big Tech Deals & Indian Startups Focus on Skill-First Practical Hiring',
      hi: 'Indian Startups aur Big Tech mein degree se zyada Practical Projects dekh kar hiring ho rahi hai',
    },
    summary: {
      en: 'Amid multibillion-dollar AI investments and hardware shifts, Indian startups are hiring problem-solvers who can ship clean Python scripts and Excel dashboards fast.',
      hi: 'Bade tech investments ke beech Indian startups aise freshers ko hire kar rahe hain jo real Python projects aur Excel reports bana sakte hain.',
    },
    whyItMatters: {
      en: 'Even 3 clean projects on GitHub carry more weight in startup interviews than memorizing theory.',
      hi: 'Startup interviews mein ratne se zyada aapke 3 clean GitHub projects aur Skill Cards ka asar hota hai.',
    },
    date: TODAY_IST_LABEL,
    readTime: '40s read',
    sourceName: 'Startup & Tech Biz',
    externalUrl: 'https://www.skillindiadigital.gov.in/',
  },
  {
    id: 'news-5',
    category: 'Cybersecurity',
    highlightStat: `CERT-In Alert · Deepfake & UPI Scams · ${TODAY_IST_LABEL}`,
    title: {
      en: 'Security Alert: Spot AI Voice-Cloning, Fake APKs & Phishing UPI Links',
      hi: 'Security Alert: Fake AI voice calls, nakli APK files aur phishing UPI links se bachein',
    },
    summary: {
      en: 'Scammers are using short voice clips and lookalike URLs to trick students. Always verify caller identity and remember UPI PIN is only to SEND money.',
      hi: 'Scammers nakli links aur AI voice se thagi kar rahe hain. Yaad rakhein: UPI PIN sirf paise BHEJNE ke liye hota hai, receive karne ke liye kabhi nahi.',
    },
    companySummary: {
      en: 'About CERT-In: CERT-In is India’s national cybersecurity agency tracking online fraud, malware, and data breaches to protect citizens.',
      hi: 'CERT-In kya hai? Ye Bharat sarkar ki cyber security agency hai jo digital scams aur hacking se logon ko bachati hai.',
    },
    whyItMatters: {
      en: 'Cyber hygiene protects your bank account, college documents, and social media accounts.',
      hi: 'Basic cyber hygiene aapke bank account aur personal data ko hamesha safe rakhti hai.',
    },
    date: TODAY_IST_LABEL,
    readTime: '30s read',
    sourceName: 'CERT-In Cyber Hygiene',
    externalUrl: 'https://www.cert-in.org.in/',
  },
  {
    id: 'news-6',
    category: 'ISRO & Space',
    highlightStat: `INSAT Satellites · Weather & Telecom · ${TODAY_IST_LABEL}`,
    title: {
      en: 'How India’s INSAT Satellites Power Real-Time Cyclone Alerts & Telecom',
      hi: 'Bharat ke INSAT satellites kaise dete hain real-time cyclone warnings aur telecom signals',
    },
    summary: {
      en: 'ISRO’s INSAT meteorological satellites capture high-resolution cloud and ocean data every few minutes, helping disaster teams save thousands of lives.',
      hi: 'ISRO ke INSAT satellites har kuch minute mein weather aur ocean data bhejte hain jisse samay par alert milta hai.',
    },
    companySummary: {
      en: 'About ISRO & INSAT: Indian Space Research Organisation builds rockets (PSLV, LVM3) and satellites powering weather, GPS (NavIC), and banking sync across India.',
      hi: 'ISRO & INSAT kya hai? ISRO Bharat ke rockets aur satellites banati hai jo weather alerts, navigation aur telecom chalate hain.',
    },
    whyItMatters: {
      en: 'Behind every weather forecast is satellite sensor data processed by Python and automated scripts!',
      hi: 'Har weather forecast ke peeche satellite sensor data ko Python scripts se process kiya jata hai.',
    },
    date: TODAY_IST_LABEL,
    readTime: '35s read',
    sourceName: 'ISRO Space & Tech',
    externalUrl: 'https://www.isro.gov.in/',
  },
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'st-1',
    name: 'Ravi Kushwaha',
    city: 'Satna, MP',
    role: 'Junior Python & Support Engineer',
    background: { en: 'B.Com graduate who had never owned a computer until age 21.', hi: 'B.Com छात्र जिन्होंने 21 साल की उम्र तक कभी खुद का कंप्यूटर नहीं चलाया था।' },
    journey: { en: 'Started at a local cyber cafe learning Windows shortcuts and Excel, then practiced Python loops 45 minutes daily on a second-hand ₹14,000 laptop and uploaded 4 small GitHub projects.', hi: 'साइबर कैफे से Windows और Excel सीखना शुरू किया, फिर सेकंड-हैंड लैपटॉप पर रोज़ 45 मिनट Python अभ्यास करके 4 छोटे प्रोजेक्ट GitHub पर डाले।' },
    advice: { en: 'Do not wait to buy an expensive laptop. Start with what you have and write 10 lines of code every single day.', hi: 'महँगे लैपटॉप का इंतज़ार न करें। जो है उसी से शुरुआत करें और रोज़ कम से कम 10 लाइन कोड लिखें।' },
  },
  {
    id: 'st-2',
    name: 'Pooja Deshmukh',
    city: 'Amravati, Maharashtra',
    role: 'Data Operations Analyst',
    background: { en: 'Arts stream student who feared English technical jargon.', hi: 'आर्ट्स की छात्रा जिन्हें अंग्रेज़ी तकनीकी शब्दों से डर लगता था।' },
    journey: { en: 'Learned Excel SUM/IF formulas first to help her father’s shop accounts, then automated weekly CSV reports in Python.', hi: 'पहले अपने पिता की दुकान का हिसाब रखने के लिए Excel सीखा, फिर Python से साप्ताहिक CSV रिपोर्ट बनाना सीखा।' },
    advice: { en: 'Build tools for real problems in your own home or college — interviewers love genuine stories.', hi: 'अपने घर या कॉलेज की असली समस्या के लिए छोटा टूल बनाएँ — इंटरव्यू में यही सबसे अलग दिखता है।' },
  },
];

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'career-python',
    title: { en: 'Python Backend / Automation Developer', hi: 'Python बैकएंड / ऑटोमेशन डेवलपर' },
    entryRoles: ['Junior Python Developer', 'Automation Engineer', 'QA SDET'],
    coreSkills: ['Python', 'Git & GitHub', 'SQL Basics', 'APIs & JSON', 'FastAPI / Django'],
    timelineMonths: '4–6 Months',
    firstSteps: [
      { en: 'Finish all 120 Python lessons (Zero to Advanced OOP & DSA) + 12 coding challenges', hi: 'Sabhi 120 Python lessons (OOP & DSA sahit) aur 12 coding challenges poore karein' },
      { en: 'Build Expense Tracker & Weather API CLI on GitHub', hi: 'GitHub par Expense Tracker aur Weather API project dalein' },
      { en: 'Learn basic SQL (SELECT, WHERE, JOIN) and FastAPI', hi: 'Basic SQL (SELECT, WHERE, JOIN) aur FastAPI ki shuruat karein' },
    ],
    freeCerts: ['freeCodeCamp Scientific Computing with Python', 'Kaggle Python Certificate', 'CS50P (audit free)'],
  },
  {
    id: 'career-data',
    title: { en: 'Data Analyst (Excel + Python + SQL)', hi: 'Data Analyst (Excel + Python + SQL)' },
    entryRoles: ['MIS Executive', 'Junior Data Analyst', 'Operations Analyst'],
    coreSkills: ['Advanced Excel', 'SQL', 'Python (CSV/Pandas)', 'Charts & Dashboards'],
    timelineMonths: '3–4 Months',
    firstSteps: [
      { en: 'Master Excel Marks Sheet, Sales Tracker, Pivot Tables', hi: 'Excel mein Marks Sheet, Sales Tracker aur Pivot Tables seekhein' },
      { en: 'Learn Python CSV reading and data cleaning', hi: 'Python se CSV files padhna aur data clean karna seekhein' },
      { en: 'Publish 2 data analysis notebooks on GitHub/Kaggle', hi: 'GitHub ya Kaggle par 2 data projects share karein' },
    ],
    freeCerts: ['Kaggle Pandas & Data Cleaning', 'Microsoft Learn Excel Basics'],
  },
  {
    id: 'career-cyber',
    title: { en: 'Cybersecurity & IT Support Beginner', hi: 'Cybersecurity & IT Support Beginner' },
    entryRoles: ['IT Helpdesk Associate', 'SOC Analyst L1 Trainee', 'System Admin Trainee'],
    coreSkills: ['Windows & Linux Basics', 'Networking (Wi-Fi/DNS/IP)', 'Cyber Hygiene', 'Python Scripting'],
    timelineMonths: '4–6 Months',
    firstSteps: [
      { en: 'Master Module 1 & 2 (Hardware, OS, Task Manager, Troubleshooting)', hi: 'Module 1 & 2 (Hardware, OS, Task Manager) pakka karein' },
      { en: 'Try Ubuntu Linux in a virtual machine or live USB', hi: 'Ubuntu Linux chalana seekhein' },
      { en: 'Practice Python scripts for log checking and password auditing', hi: 'Log check karne wali chhoti Python scripts likhein' },
    ],
    freeCerts: ['Cisco Networking Academy Intro to Cybersecurity (Free)', 'Google IT Support (Audit Free)'],
  },
  {
    id: 'career-freelance',
    title: { en: 'Web Development & Freelancing Path', hi: 'Web Development & Freelancing Path' },
    entryRoles: ['Junior Web Developer', 'Freelance Automation Helper', 'Technical VA'],
    coreSkills: ['HTML & CSS', 'JavaScript or Python Flask', 'Excel Cleanup', 'Client Communication'],
    timelineMonths: '4–5 Months',
    firstSteps: [
      { en: 'Build 3 clean static sites + 2 Excel/Python automation scripts for local shops', hi: 'Local shops ke liye 2 Excel/Python tools aur 3 clean websites banayein' },
      { en: 'Create a simple 1-page GitHub portfolio showcasing before/after results', hi: 'Apna kaam dikhane ke liye clean GitHub portfolio banayein' },
    ],
    freeCerts: ['freeCodeCamp Responsive Web Design', 'GitHub Foundations Learning Path'],
  },
];

export const JOB_READY_CHECKLIST = [
  { id: 'chk-resume', text: { en: '1-page clean PDF Resume (no photo clutter, measurable projects listed)', hi: '1 page ka clean PDF Resume (GitHub project links ke saath)' } },
  { id: 'chk-github', text: { en: 'GitHub profile with 3+ original projects & clear README files', hi: 'GitHub par kam se kam 3 projects aur clear README files' } },
  { id: 'chk-linkedin', text: { en: 'Updated LinkedIn headline ("Aspiring Python & Data Learner | Excel, Git")', hi: 'Updated LinkedIn headline aur clean profile' } },
  { id: 'chk-debug', text: { en: 'Can explain your project code line-by-line without reading notes', hi: 'Interview mein bina dekhe apna code line-by-line samjha sakna' } },
  { id: 'chk-interview', text: { en: 'Solved 10+ coding & Bug Hunter problems independently', hi: 'Khud se 10+ coding aur Bug Hunter sawal solve kiye hain' } },
];

export const BADGES: BadgeItem[] = [
  {
    id: 'badge-first-code',
    title: { en: 'First Code', hi: 'First Code' },
    description: { en: 'Completed your first Python lesson', hi: 'Pehla Python lesson complete kiya' },
    requirementText: { en: 'Complete 1 Python lesson', hi: '1 Python lesson complete karein' },
    techHistory: {
      person: 'Guido van Rossum',
      year: '1989',
      story: {
        en: 'Guido started building Python as a hobby project during a quiet holiday week because he wanted a language simple enough for anyone to read like plain English. Today, your first line of Python connects you to that exact same idea!',
        hi: 'Guido ne 1989 ki holidays mein hobby ke taur par Python banana shuru kiya taaki koi bhi aam student English jaisi asaan language mein coding seekh sake. Aaj aapka pehla code usi safar ki shuruat hai!',
      },
    },
  },
  {
    id: 'badge-hw-explorer',
    title: { en: 'Hardware Hero', hi: 'Hardware Hero' },
    description: { en: 'Mastered 3+ Computer Basics topics', hi: '3+ Computer Basics topics poore kiye' },
    requirementText: { en: 'Complete 3 Computer Basics lessons', hi: '3 Computer Basics lessons poore karein' },
    techHistory: {
      person: 'Vinod Dham',
      year: '1993',
      story: {
        en: 'Born in Pune and raised in a modest home, Vinod Dham studied engineering in Delhi and went on to lead the creation of the Intel Pentium chip—called the "Father of Pentium"—powering millions of personal computers worldwide.',
        hi: 'Pune mein janme Vinod Dham ne Delhi se padhai kar ke Intel Pentium chip banayi — jinhe "Father of Pentium" kaha jata hai. Simple shuruat se bhi aap hardware ki duniya samajh sakte hain!',
      },
    },
  },
  {
    id: 'badge-excel-explorer',
    title: { en: 'Excel Explorer', hi: 'Excel Explorer' },
    description: { en: 'Completed Windows & Excel practice', hi: 'Windows aur Excel practice poori ki' },
    requirementText: { en: 'Complete 2 Windows/Excel lessons', hi: '2 Windows/Excel lessons complete karein' },
    techHistory: {
      person: 'Dan Bricklin',
      year: '1979',
      story: {
        en: 'Tired of erasing and recalculating entire paper ledgers when one number changed, student Dan Bricklin invented the first electronic spreadsheet (VisiCalc)—proving simple tools that save time change the world.',
        hi: 'Ek number badalne par poora paper ledger dobara likhne se pareshan ho kar student Dan Bricklin ne pehla electronic spreadsheet banaya — aaj Excel har office ki jaan hai.',
      },
    },
  },
  {
    id: 'badge-bug-hunter',
    title: { en: 'Bug Hunter', hi: 'Bug Hunter' },
    description: { en: 'Fixed 2+ buggy Python programs', hi: '2+ buggy Python programs fix kiye' },
    requirementText: { en: 'Solve 2 Bug Hunter levels', hi: '2 Bug Hunter levels solve karein' },
    techHistory: {
      person: 'Grace Hopper',
      year: '1947',
      story: {
        en: 'When an early computer stopped working, engineer Grace Hopper opened it and found a real moth trapped inside a switch! She taped it into her logbook as the "first actual bug"—teaching programmers to stay curious when errors happen.',
        hi: '1947 mein jab ek computer ruka, toh Grace Hopper ne andar ek asli keeda (moth) fasa paya aur tab se "Debugging" word mashhoor hua. Error dekh kar ghabrayein nahi, detective banein!',
      },
    },
  },
  {
    id: 'badge-loop-master',
    title: { en: 'Challenge Solver', hi: 'Challenge Solver' },
    description: { en: 'Passed all test cases on 3+ coding problems', hi: '3+ coding problems ke sabhi test cases pass kiye' },
    requirementText: { en: 'Solve 3 Coding Challenges', hi: '3 Coding Challenges solve karein' },
    techHistory: {
      person: 'Dr. Vijay Bhatkar',
      year: '1991',
      story: {
        en: 'When India was denied foreign supercomputers, Dr. Vijay Bhatkar and his small team built PARAM 8000 right in Pune in just 3 years. Step-by-step problem solving always beats big obstacles!',
        hi: 'Jab Bharat ko supercomputer nahi mila, toh Dr. Vijay Bhatkar aur unki team ne Pune mein sirf 3 saal mein PARAM 8000 bana dikhaya. Step-by-step logic har mushkil solve karta hai!',
      },
    },
  },
  {
    id: 'badge-streak-3',
    title: { en: '3-Day Streak', hi: '3-Day Streak' },
    description: { en: 'Consistent daily tech practice', hi: 'Lagatar 3 din daily practice' },
    requirementText: { en: 'Maintain a 3-day streak', hi: '3 din lagatar practice karein' },
    techHistory: {
      person: 'Linus Torvalds',
      year: '1991',
      story: {
        en: 'Linus started Linux in his bedroom as a student writing a little bit of code every single day. Today Linux runs Android phones, space rockets, and the internet—all from daily consistency.',
        hi: 'Linus ne student rehte apne kamre se roz thoda-thoda code likh kar Linux banaya. Aaj wahi Linux duniya ke Android phones aur internet ko chalata hai!',
      },
    },
  },
];

export function getEarnedBadgeIds(progress: UserProgress): string[] {
  const earned: string[] = [];
  if (progress.completedPythonIds.length >= 1) earned.push('badge-first-code');
  if (progress.completedComputerIds.length >= 3) earned.push('badge-hw-explorer');
  if (progress.completedWindowsIds.length >= 2) earned.push('badge-excel-explorer');
  if (progress.solvedBugIds.length >= 2) earned.push('badge-bug-hunter');
  if (progress.solvedChallengeIds.length >= 3) earned.push('badge-loop-master');
  if (progress.streakDays >= 3) earned.push('badge-streak-3');
  return earned;
}

export const SAMPLE_LEADERBOARD = [
  { name: 'Ananya_Jaipur', xp: 480, streak: 9 },
  { name: 'Vikram_Patna', xp: 410, streak: 7 },
  { name: 'Meera_Indore', xp: 345, streak: 6 },
  { name: 'Suresh_Nagpur', xp: 290, streak: 4 },
];

export const DAILY_TECH_FACTS = [
  {
    en: 'Python was named after the comedy group "Monty Python", not the snake — its creator wanted coding to feel fun and approachable.',
    hi: 'Python ka naam saanp par nahi balki "Monty Python" comedy show par rakha gaya tha taaki coding boring na lage.',
  },
  {
    en: 'India’s UPI processes billions of real-time transactions every month using clean APIs, queues, and strict verification checks.',
    hi: 'Bharat ka UPI har mahine karodon instant transactions APIs, queues aur strong security checks ki madad se chalata hai.',
  },
  {
    en: 'Your 8 GB RAM smartphone today has thousands of times more memory than the Apollo 11 computer that landed humans on the Moon!',
    hi: 'Aaj aapke 8 GB RAM wale phone mein Apollo 11 Moon rocket computer se hazaron guna zyada memory hai!',
  },
  {
    en: 'Dictionaries in Python use Hash Tables so looking up a key takes constant O(1) time even inside 1 million records.',
    hi: 'Python Dictionary Hash Table use karti hai, isliye 10 lakh items mein se bhi koi key O(1) instant time mein mil jati hai.',
  },
  {
    en: 'Pune-born engineer Vinod Dham led the team that built the Intel Pentium processor in 1993, earning the title "Father of the Pentium".',
    hi: 'Pune mein janme Indian engineer Vinod Dham ne 1993 mein Intel Pentium processor banaya, jinhe "Father of the Pentium" kaha jata hai.',
  },
  {
    en: 'In 1991, Dr. Vijay Bhatkar and his Pune team built India’s first supercomputer PARAM 8000 in 3 years after foreign exports were denied.',
    hi: '1991 mein Dr. Vijay Bhatkar aur Pune ki team ne sirf 3 saal mein Bharat ka pehla supercomputer PARAM 8000 banaya tha.',
  },
  {
    en: 'The word "bug" in programming became famous in 1947 when Grace Hopper’s team found a real moth stuck inside a relay switch.',
    hi: 'Coding mein "Bug" shabd 1947 mein mashhoor hua jab Grace Hopper ki team ko computer ke andar ek asli keeda (moth) fasa mila.',
  },
  {
    en: 'Undersea fiber-optic cables — not satellites — still carry over 95% of the world’s internet traffic across oceans at light speed.',
    hi: 'Duniya ka 95% se zyada internet traffic satellites se nahi, balki samundar ke neeche biche fiber-optic cables se chalta hai.',
  },
  {
    en: 'Linux runs 100% of the world’s top 500 supercomputers and powers the kernel inside billions of Android smartphones.',
    hi: 'Duniya ke top 500 supercomputers aur karodon Android phones ke andar Linux operating system hi chalta hai.',
  },
  {
    en: 'ISRO’s Mars Orbiter Mission (Mangalyaan) reached Mars on a budget lower than a Hollywood sci-fi movie, powered by precision trajectory code.',
    hi: 'ISRO ka Mangalyaan mission ek Hollywood movie se bhi kam budget mein Mars par pahuncha — jisme accurate software calculations ka bada haath tha.',
  },
  {
    en: 'In Python, integers have arbitrary precision — unlike many languages, Python can calculate 2 ** 1000 without overflowing.',
    hi: 'Python mein integers ki koi fixed limit nahi hoti — aap bina overflow error ke 2 ** 1000 jaisi badi sankhya bhi calculate kar sakte hain.',
  },
  {
    en: 'HTTP status code 404 means "Not Found", while 200 means "OK" and 429 means "Too Many Requests" (rate limit reached).',
    hi: 'Web APIs mein HTTP 200 ka matlab "OK", 404 ka matlab "Not Found" aur 429 ka matlab "Too Many Requests" hota hai.',
  },
  {
    en: 'Excel was inspired by VisiCalc (1979), invented by a student who got tired of re-erasing paper accounting tables by hand.',
    hi: 'Excel ka idea 1979 mein VisiCalc se aaya, jise ek student ne baar-baar haath se hisab mitane ki pareshani door karne ke liye banaya tha.',
  },
  {
    en: 'USB-C is reversible because its 24 pins are mirrored symmetrically — ending the old frustration of flipping a USB plug three times!',
    hi: 'USB-C dono taraf se lag jata hai kyunki iske andar 24 pins symmetrically mirror kiye gaye hote hain.',
  },
  {
    en: 'AI Large Language Models don’t read full words — they break text into small pieces called "tokens" (roughly 3–4 letters each).',
    hi: 'AI models poore shabd ek saath nahi padhte, balki text ko chhote tukdon mein todte hain jinhe "Tokens" kaha jata hai.',
  },
  {
    en: 'A single Google search or AI prompt travels through DNS, TLS encryption, load balancers, and SSD servers in under half a second.',
    hi: 'Ek simple search request aadhe second se kam mein DNS, encryption aur cloud servers se guzar kar aapke phone par wapas aati hai.',
  },
  {
    en: 'Over 80% of security breaches happen because of reused weak passwords or phishing links — turning on 2FA blocks most automated attacks.',
    hi: '80% se zyada hacking weak passwords ya fake links se hoti hai — sirf Two-Factor Authentication (2FA) on karne se account kaafi safe ho jata hai.',
  },
  {
    en: 'Git was created by Linus Torvalds in just 10 days in 2005 so thousands of developers worldwide could collaborate on Linux without overwriting code.',
    hi: 'Linus Torvalds ne 2005 mein sirf 10 din mein Git banaya tha taaki hazaron programmers milkar ek hi code par bina conflict kaam kar sakein.',
  },
  {
    en: 'JPEG images shrink file size by removing tiny color details the human eye barely notices — that’s why a 12 MB photo becomes 1.5 MB.',
    hi: 'JPEG format aankhon ko kam dikhne wali color details hata kar 12 MB ki photo ko 1.5 MB ka chhota file bana deta hai.',
  },
  {
    en: 'Clean variable names like `monthly_rent` instead of `x` save hours of debugging when you revisit your own Python script a month later.',
    hi: '`x` ki jagah `monthly_rent` jaise clear variable names rakhne se ek mahine baad apna hi Python code samajhna aur debug karna aasaan hota hai.',
  },
  {
    en: 'India’s open digital networks (UPI, DigiLocker, ONDC) run on open API standards so small startups can build apps without building infrastructure from scratch.',
    hi: 'Bharat ke UPI, DigiLocker aur ONDC open APIs par chalte hain jisse chhote startups bhi bade digital tools asani se bana sakte hain.',
  },
];

export const DAILY_CAREER_TIPS = [
  {
    en: 'Upload even your small Python calculator and Excel budget sheets cleanly on GitHub with a clear README — proof of work beats theory.',
    hi: 'Apne chhote Python calculator aur Excel templates bhi clean README ke saath GitHub par dalein — Proof of Work sabse zyada matter karta hai.',
  },
  {
    en: 'Never copy code blindly: run it with the Step Visualizer until you can explain every line in your own words.',
    hi: 'Code ko ratne ki jagah Step Visualizer mein chala kar dekhein jab tak aap har line apne shabdon mein na samjha sakein.',
  },
  {
    en: 'Keep one public portfolio project tied to a real Indian daily problem (hostel budget, shop GST bill, exam tracker).',
    hi: 'Ek aisa project zaroor banayein jo real daily problem solve kare (jaise hostel expense, dukaan GST bill ya marks analyzer).',
  },
  {
    en: 'In fresher interviews, saying "I don’t know yet, here is how I would test or debug it" scores much higher than guessing.',
    hi: 'Interview mein galat guess karne se behtar hai ye bolna: "Abhi mujhe exact yaad nahi, par main ise test aur debug aise karunga."',
  },
  {
    en: 'Practice typing Python code for 20 minutes daily without autocomplete — muscle memory builds speed in live coding tests.',
    hi: 'Roz 20 minute bina copy-paste ke khud Python code type karein — isse coding test mein speed aur confidence dono badhte hain.',
  },
  {
    en: 'Learn at least 10 Excel formulas (`SUM`, `IF`, `AVERAGE`, `COUNTIF`, `VLOOKUP`) alongside Python — MIS & Analyst roles test both.',
    hi: 'Python ke saath Excel ke kam se kam 10 formulas (`SUM`, `IF`, `COUNTIF`, `VLOOKUP`) pakke rakhein — fresher roles mein dono pooche jate hain.',
  },
  {
    en: 'Keep your resume strictly 1 page with links to your working GitHub projects and verified Skill Cards.',
    hi: 'Apna fresher resume hamesha 1 page ka clean rakhein aur usme apne GitHub projects ke links zaroor lagayein.',
  },
  {
    en: 'Read error messages from the bottom line up: Python’s last line tells you the exact ErrorType and what went wrong.',
    hi: 'Python error aane par hamesha sabse aakhri line pehle padhein — wahi batati hai ki kya aur kis line par galti hui hai.',
  },
  {
    en: 'Solve 1 Bug Hunter problem every day — companies spend more time maintaining existing code than writing brand new files.',
    hi: 'Roz kam se kam 1 Bug Hunter sawal solve karein — IT companies mein naye code se zyada purane code ke bugs fix karne hote hain.',
  },
  {
    en: 'Explain one concept you learned today on LinkedIn or to a friend — teaching is the fastest way to lock knowledge in memory.',
    hi: 'Aaj aapne jo naya concept seekha use apne dost ko samjhayein ya short post likhein — sikhane se concept hamesha yaad rehta hai.',
  },
];

export const DAILY_MICRO_CHALLENGES = [
  {
    id: 'dm-1',
    title: { en: '60-Second Savings Math', hi: '60-Second Bachat Math' },
    prompt: {
      en: 'If you save ₹30 per day for 30 days, print the total savings using Python.',
      hi: 'Agar aap roz ₹30 bachate hain, toh 30 din ki total bachat Python se print karein.',
    },
    starterCode: 'daily_save = 30\ndays = 30\n# Print total savings below\nprint(daily_save * days)',
    expectedOutput: '900',
  },
  {
    id: 'dm-2',
    title: { en: '60-Second UPI Cashback Check', hi: '60-Second UPI Cashback Check' },
    prompt: {
      en: 'Bill is 480 and cashback is 45. Print the final net amount paid.',
      hi: 'Bill ₹480 hai aur cashback ₹45 mila. Final paid amount print karein.',
    },
    starterCode: 'bill = 480\ncashback = 45\nprint(bill - cashback)',
    expectedOutput: '435',
  },
  {
    id: 'dm-3',
    title: { en: '60-Second Pass Count', hi: '60-Second Pass Count' },
    prompt: {
      en: 'Count how many scores in [35, 62, 88, 29, 50] are >= 40 and print the count.',
      hi: 'List [35, 62, 88, 29, 50] mein kitne marks >= 40 hain unki ginti print karein.',
    },
    starterCode: 'marks = [35, 62, 88, 29, 50]\npassed = [m for m in marks if m >= 40]\nprint(len(passed))',
    expectedOutput: '3',
  },
  {
    id: 'dm-4',
    title: { en: '60-Second Chai Bill Split', hi: '60-Second Chai Bill Split' },
    prompt: {
      en: '4 friends split a ₹180 snacks bill equally. Print each person’s integer share.',
      hi: '4 doston ne ₹180 ka bill barabar baanta. Har ek ka hissa print karein.',
    },
    starterCode: 'total_bill = 180\nfriends = 4\nprint(total_bill // friends)',
    expectedOutput: '45',
  },
  {
    id: 'dm-5',
    title: { en: '60-Second Username Formatter', hi: '60-Second Username Formatter' },
    prompt: {
      en: 'Convert "  Aarav_Dev  " to clean lowercase without spaces and print it.',
      hi: '"  Aarav_Dev  " ko bina extra spaces ke lowercase mein print karein.',
    },
    starterCode: 'raw = "  Aarav_Dev  "\nprint(raw.strip().lower())',
    expectedOutput: 'aarav_dev',
  },
  {
    id: 'dm-6',
    title: { en: '60-Second Max Marks Finder', hi: '60-Second Max Marks Finder' },
    prompt: {
      en: 'Print the highest mark from [71, 89, 64, 93, 82].',
      hi: 'List [71, 89, 64, 93, 82] mein sabse zyada marks print karein.',
    },
    starterCode: 'scores = [71, 89, 64, 93, 82]\nprint(max(scores))',
    expectedOutput: '93',
  },
  {
    id: 'dm-7',
    title: { en: '60-Second Discount Price', hi: '60-Second Discount Price' },
    prompt: {
      en: 'A ₹500 course book has a 20% discount. Print the final integer price.',
      hi: '₹500 ki book par 20% discount hai. Final price print karein.',
    },
    starterCode: 'price = 500\ndiscount_pct = 20\nfinal_price = price - (price * discount_pct // 100)\nprint(final_price)',
    expectedOutput: '400',
  },
];

export function getDayOfYearIndex(): number {
  const istDateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const [y, m, d] = istDateStr.split('-').map(Number);
  const utcDay = Date.UTC(y, (m || 1) - 1, d || 1);
  const utcStart = Date.UTC(y, 0, 0);
  return Math.floor((utcDay - utcStart) / (1000 * 60 * 60 * 24));
}
