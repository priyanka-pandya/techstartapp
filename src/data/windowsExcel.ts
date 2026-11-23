import { ExcelTemplateLesson, ShortcutItem, WindowsSkillLesson } from '../types';

export const WINDOWS_SKILLS: WindowsSkillLesson[] = [
  {
    id: 'win-desktop-explorer',
    title: { en: 'Desktop, Taskbar, Start Menu & File Explorer', hi: 'डेस्कटॉप, टास्कबार, स्टार्ट मेन्यू और फाइल एक्सप्लोरर' },
    category: 'windows',
    durationMin: 4,
    steps: [
      { en: 'The Desktop is your main workspace screen where pinned shortcuts and wallpaper live.', hi: 'डेस्कटॉप आपकी मुख्य स्क्रीन है जहाँ शॉर्टकट आइकन और वॉलपेपर दिखते हैं।' },
      { en: 'The Taskbar at the bottom holds the Start button, open apps, Wi-Fi, sound, and clock.', hi: 'नीचे की पट्टी को टास्कबार कहते हैं — इसमें स्टार्ट बटन, खुले ऐप, Wi-Fi, आवाज़ और समय होता है।' },
      { en: 'Press Windows + E to open File Explorer and see Drives (C:, D:), Documents, and Downloads.', hi: 'File Explorer खोलने के लिए Windows + E दबाएँ ताकि Documents और Downloads देख सकें।' },
    ],
    practicalTask: { en: 'Open File Explorer with Windows + E and pin your Practice folder to Quick Access.', hi: 'Windows + E से File Explorer खोलें और अपना प्रैक्टिस फोल्डर पिन करें।' },
    tip: { en: 'Keep your Desktop clean! Save big files in Documents or D: drive instead of cluttering Desktop.', hi: 'डेस्कटॉप साफ रखें! बड़ी फाइलें Documents या D: ड्राइव में सेव करें।' },
  },
  {
    id: 'win-folders-recovery',
    title: { en: 'Creating, Moving, Recovering & Searching Files', hi: 'फोल्डर बनाना, हटाई गई फाइल वापस लाना और तेज़ सर्च' },
    category: 'windows',
    durationMin: 5,
    steps: [
      { en: 'Right-click → New → Folder (or press Ctrl + Shift + N) to create a folder instantly.', hi: 'नया फोल्डर बनाने के लिए Ctrl + Shift + N दबाएँ।' },
      { en: 'If you delete a file with Delete, it goes to the Recycle Bin where you can right-click → Restore.', hi: 'सामान्य Delete दबाने पर फाइल Recycle Bin में जाती है — वहाँ से Restore कर सकते हैं।' },
      { en: 'Warning: Shift + Delete skips Recycle Bin permanently! Use carefully.', hi: 'चेतावनी: Shift + Delete से फाइल हमेशा के लिए हट जाती है, Recycle Bin में नहीं जाती!' },
    ],
    practicalTask: { en: 'Create a dummy text file, delete it, then open Recycle Bin and Restore it.', hi: 'एक टेस्ट फाइल बनाएँ, डिलीट करें, और Recycle Bin से वापस Restore करें।' },
    tip: { en: 'Use Windows Search (press Windows key and start typing the file name) to find lost files fast.', hi: 'खोई फाइल ढूँढने के लिए Windows कुंजी दबाकर सीधा नाम टाइप करें।' },
  },
  {
    id: 'win-settings-specs',
    title: { en: 'Display, Sleep, Privacy & Checking PC Specs', hi: 'डिस्प्ले, स्लीप, प्राइवेसी और कंप्यूटर स्पेसिफिकेशन जाँचना' },
    category: 'windows',
    durationMin: 5,
    steps: [
      { en: 'Press Windows + I to open Settings. Go to System → Display to adjust brightness and Night Light.', hi: 'Settings खोलने के लिए Windows + I दबाएँ। आँखों के आराम के लिए Night Light चालू करें।' },
      { en: 'Go to System → About to verify your exact Processor, Installed RAM, and Windows version.', hi: 'System → About में जाकर अपना Processor, RAM और Windows वर्ज़न जाँचें।' },
      { en: 'Go to Accounts → Sign-in options to add a PIN/password so strangers cannot open your laptop.', hi: 'Accounts → Sign-in options में PIN या पासवर्ड सेट करें।' },
    ],
    practicalTask: { en: 'Open Settings (Windows + I) and write down your exact RAM and Windows edition.', hi: 'Windows + I खोलें और अपने कंप्यूटर की RAM व Windows वर्ज़न नोट करें।' },
    tip: { en: 'Turn on Night Light after 7 PM to reduce eye strain during evening coding.', hi: 'शाम को कोडिंग करते समय आँखें बचाने के लिए Night Light का इस्तेमाल करें।' },
  },
  {
    id: 'win-apps-troubleshoot',
    title: { en: 'Installing Apps Safely, Task Manager & Basic Troubleshooting', hi: 'सुरक्षित ऐप इंस्टॉल, टास्क मैनेजर और बेसिक ट्रबलशूटिंग' },
    category: 'windows',
    durationMin: 5,
    steps: [
      { en: 'Only download software from official websites (like python.org or code.visualstudio.com) or Microsoft Store.', hi: 'सॉफ्टवेयर केवल ऑफिशियल वेबसाइट (python.org) या Microsoft Store से ही डाउनलोड करें।' },
      { en: 'Uninstall unused apps cleanly via Settings → Apps → Installed Apps (never just delete desktop icons).', hi: 'ऐप हटाने के लिए Settings → Apps में जाकर Uninstall करें, सिर्फ आइकन डिलीट करने से ऐप नहीं हटता।' },
      { en: 'If an app freezes, press Ctrl + Shift + Esc → select the app → click End Task.', hi: 'अगर कोई ऐप अटक जाए, तो Ctrl + Shift + Esc दबाकर उसे चुनें और End Task पर क्लिक करें।' },
    ],
    practicalTask: { en: 'Open Installed Apps in Settings and check how much storage your largest app uses.', hi: 'Settings में Installed Apps खोलकर देखें कि सबसे बड़ा ऐप कितनी जगह ले रहा है।' },
    tip: { en: 'Restarting your PC (Start → Power → Restart) fixes 70% of temporary glitches!', hi: 'अधिकांश छोटी तकनीकी दिक्कतें कंप्यूटर को Restart करने से ठीक हो जाती हैं!' },
  },
  {
    id: 'safe-passwords-phishing',
    title: { en: 'Strong Passwords, Phishing Links & Avoiding Scams', hi: 'मज़बूत पासवर्ड, फर्जी लिंक और ऑनलाइन स्कैम से बचाव' },
    category: 'safety',
    durationMin: 5,
    steps: [
      { en: 'Never use "123456", your birth date, or phone number as a password. Use 12+ characters mixing words, numbers, and symbols (e.g., Chai@Code#2026).', hi: 'कभी भी "123456" या जन्मतिथि पासवर्ड न रखें। कम से कम 12 अक्षर, नंबर और चिह्न मिलाएँ।' },
      { en: 'Check the URL carefully before logging in: "paytm-free-bonus.xyz" is fake; real websites use exact official domains with https://.', hi: 'लॉगिन करने से पहले लिंक ध्यान से पढ़ें — फर्जी ऑफर या लॉटरी लिंक पर कभी क्लिक न करें।' },
      { en: 'Never share OTP, UPI PIN, or remote-access codes (AnyDesk/TeamViewer) with unknown callers.', hi: 'किसी अनजान कॉलर को कभी OTP, UPI पिन या AnyDesk कोड न दें।' },
    ],
    practicalTask: { en: 'Check if your email password is unique and enable 2-Step Verification on your Google account.', hi: 'सुनिश्चित करें कि आपके मुख्य ईमेल पर 2-Step Verification चालू है।' },
    tip: { en: 'Banks, internships, and genuine IT companies NEVER ask you to pay a security deposit for a job.', hi: 'असली कंपनियाँ कभी नौकरी या इंटर्नशिप देने के बदले पैसे नहीं माँगतीं।' },
  },
  {
    id: 'safe-downloads-wifi',
    title: { en: 'Safe Downloading & Public Wi-Fi Habits', hi: 'सुरक्षित डाउनलोड और पब्लिक Wi-Fi के नियम' },
    category: 'safety',
    durationMin: 4,
    steps: [
      { en: 'Avoid "cracked" software sites — they often hide viruses that steal passwords and photos.', hi: 'फ्री क्रैक सॉफ्टवेयर वाली वेबसाइट से बचें — इनमें अक्सर वायरस छिपे होते हैं।' },
      { en: 'On railway station or cafe public Wi-Fi, avoid banking/UPI apps or switch to mobile data for payments.', hi: 'रेलवे स्टेशन या कैफे के फ्री Wi-Fi पर बैंकिंग या UPI करने से बचें।' },
      { en: 'Keep Windows Defender and your browser updated — updates patch security holes.', hi: 'Windows Defender और ब्राउज़र को हमेशा अपडेट रखें।' },
    ],
    practicalTask: { en: 'Open Windows Security → Virus & threat protection and run a Quick Scan.', hi: 'Windows Security खोलें और Quick Scan चलाएँ।' },
    tip: { en: 'A genuine PDF file ends in .pdf, never .pdf.exe! Turn on "File name extensions" in File Explorer.', hi: 'असली PDF हमेशा .pdf से खत्म होती है, .pdf.exe वायरस हो सकता है!' },
  },
];

export const KEYBOARD_SHORTCUTS: ShortcutItem[] = [
  { id: 'sc-copy', keys: ['Ctrl', 'C'], action: { en: 'Copy selected text or file', hi: 'चुने हुए टेक्स्ट या फाइल को कॉपी करें' }, example: { en: 'Copy code snippet to paste in editor', hi: 'कोड को कॉपी करके एडिटर में चिपकाना' }, category: 'editing' },
  { id: 'sc-paste', keys: ['Ctrl', 'V'], action: { en: 'Paste copied item', hi: 'कॉपी किया हुआ पेस्ट करें' }, example: { en: 'Paste copied text into Notepad', hi: 'नोटपैड में कॉपी किया टेक्स्ट पेस्ट करना' }, category: 'editing' },
  { id: 'sc-cut', keys: ['Ctrl', 'X'], action: { en: 'Cut (move) selected item', hi: 'कट (एक जगह से हटाकर दूसरी जगह ले जाना)' }, example: { en: 'Move a file from Desktop to Documents', hi: 'डेस्कटॉप से फाइल को Documents में ले जाना' }, category: 'editing' },
  { id: 'sc-undo', keys: ['Ctrl', 'Z'], action: { en: 'Undo last mistake', hi: 'पिछली गलती को वापस पलटें (Undo)' }, example: { en: 'Accidentally deleted a paragraph? Press Ctrl+Z!', hi: 'गलती से पैराग्राफ मिट गया? तुरंत Ctrl+Z दबाएँ!' }, category: 'editing' },
  { id: 'sc-redo', keys: ['Ctrl', 'Y'], action: { en: 'Redo undone action', hi: 'पलटे गए काम को फिर लागू करें (Redo)' }, example: { en: 'Bring back the step you just undid', hi: 'Undo की गई चीज़ वापस लाना' }, category: 'editing' },
  { id: 'sc-all', keys: ['Ctrl', 'A'], action: { en: 'Select everything', hi: 'सब कुछ एक साथ चुनें (Select All)' }, example: { en: 'Select all code in editor before copying', hi: 'एडिटर का पूरा कोड एक साथ चुनना' }, category: 'editing' },
  { id: 'sc-save', keys: ['Ctrl', 'S'], action: { en: 'Save current file', hi: 'मौजूदा फाइल सेव करें' }, example: { en: 'Save your Python file before running it', hi: 'कोड चलाने से पहले फाइल सेव करना' }, category: 'editing' },
  { id: 'sc-find', keys: ['Ctrl', 'F'], action: { en: 'Find a word on page or in code', hi: 'पेज या कोड में कोई शब्द खोजें' }, example: { en: 'Search for a formula name in a webpage', hi: 'वेबपेज पर किसी शब्द को तुरंत खोजना' }, category: 'navigation' },
  { id: 'sc-alttab', keys: ['Alt', 'Tab'], action: { en: 'Switch quickly between open apps', hi: 'खुले ऐप्स के बीच तुरंत स्विच करें' }, example: { en: 'Jump between Chrome and VS Code in 1 second', hi: 'Chrome और VS Code के बीच 1 सेकंड में बदलना' }, category: 'navigation' },
  { id: 'sc-wind', keys: ['Win', 'D'], action: { en: 'Minimize everything & show Desktop', hi: 'सभी विंडो छुपाकर डेस्कटॉप दिखाएँ' }, example: { en: 'Quickly reach a desktop folder', hi: 'तुरंत डेस्कटॉप पर पहुँचना' }, category: 'windows' },
  { id: 'sc-wine', keys: ['Win', 'E'], action: { en: 'Open File Explorer', hi: 'File Explorer खोलें' }, example: { en: 'Browse your folders without mouse clicks', hi: 'बिना माउस क्लिक के फोल्डर खोलना' }, category: 'windows' },
  { id: 'sc-winl', keys: ['Win', 'L'], action: { en: 'Lock your computer screen', hi: 'कंप्यूटर स्क्रीन तुरंत लॉक करें' }, example: { en: 'Always press Win+L before stepping away from desk', hi: 'डेस्क से उठते समय स्क्रीन लॉक करना' }, category: 'windows' },
  { id: 'sc-winshot', keys: ['Win', 'Shift', 'S'], action: { en: 'Capture custom screenshot', hi: 'स्क्रीनशॉट कैप्चर करें' }, example: { en: 'Screenshot an error to ask a mentor', hi: 'एरर का स्क्रीनशॉट लेकर मदद माँगना' }, category: 'windows' },
  { id: 'sc-winv', keys: ['Win', 'V'], action: { en: 'Open Clipboard History', hi: 'क्लिपबोर्ड हिस्ट्री (पिछली कॉपी की लिस्ट) खोलें' }, example: { en: 'Paste something you copied 3 steps ago', hi: 'थोड़ी देर पहले कॉपी किया हुआ टेक्स्ट फिर पाना' }, category: 'windows' },
  { id: 'sc-taskmgr', keys: ['Ctrl', 'Shift', 'Esc'], action: { en: 'Open Task Manager directly', hi: 'सीधे Task Manager खोलें' }, example: { en: 'Close a frozen app or check RAM usage', hi: 'अटके ऐप बंद करना या RAM देखना' }, category: 'windows' },
];

export const EXCEL_TEMPLATES: ExcelTemplateLesson[] = [
  {
    id: 'excel-marks-sheet',
    title: { en: 'Student Marks Sheet (SUM, AVERAGE, IF)', hi: 'स्टूडेंट मार्क्स शीट (SUM, AVERAGE, IF)' },
    subtitle: { en: 'Calculate total marks, percentage, and Pass/Fail automatically', hi: 'कुल अंक, औसत और पास/फेल अपने आप निकालें' },
    formulasCovered: ['SUM', 'AVERAGE', 'IF', 'MAX', 'MIN'],
    columns: ['Student', 'Math', 'Science', 'English'],
    rows: [
      ['Aarav Sharma', 78, 84, 72],
      ['Priya Verma', 92, 88, 95],
      ['Rohan Das', 31, 40, 35],
      ['Sneha Patel', 65, 74, 80],
    ],
    sampleFormula: '=IF(AVERAGE(B2:D2)>=40, "Pass", "Needs Help")',
    explanation: {
      en: 'Cells are named by Column Letter + Row Number (like B2). `=SUM(B2:D2)` adds scores from B2 through D2. `=IF(...)` checks a condition and prints "Pass" or "Needs Help".',
      hi: 'सेल का नाम कॉलम अक्षर और रो नंबर से बनता है (जैसे B2)। `=SUM(B2:D2)` अंकों को जोड़ता है और `=IF(...)` तय करता है कि छात्र पास है या नहीं।',
    },
    practicalTask: {
      en: 'Edit any mark in the interactive spreadsheet below and watch SUM, AVERAGE, and Pass/Fail update automatically!',
      hi: 'नीचे दी गई लाइव शीट में किसी भी अंक को बदलें और देखें कि कुल योग और परिणाम तुरंत कैसे बदलते हैं!',
    },
  },
  {
    id: 'excel-expense-tracker',
    title: { en: 'Monthly Expense & Budget Tracker', hi: 'मासिक खर्च और बजट ट्रैकर' },
    subtitle: { en: 'Track hostel/home expenses with SUM, MAX, and Conditional Formatting', hi: 'SUM और MAX से अपने महीने के खर्च पर नज़र रखें' },
    formulasCovered: ['SUM', 'MAX', 'MIN', 'COUNT'],
    columns: ['Category', 'Budget (₹)', 'Spent (₹)', 'Days'],
    rows: [
      ['Room Rent', 4500, 4500, 30],
      ['Food & Tiffin', 3200, 3650, 30],
      ['Mobile & Wi-Fi', 600, 599, 28],
      ['Books & Courses', 800, 450, 15],
    ],
    sampleFormula: '=SUM(C2:C5)',
    explanation: {
      en: 'Subtract Spent from Budget (`=B2-C2`) to see savings or overspending. Negative numbers highlight where to cut costs.',
      hi: 'बजट में से खर्च घटाकर (`=B2-C2`) बचत या अधिक खर्च का तुरंत पता चलता है।',
    },
    practicalTask: {
      en: 'Try lowering Food & Tiffin spent amount to 2900 in the interactive sheet and check total savings.',
      hi: 'नीचे इंटरैक्टिव शीट में Food & Tiffin का खर्च 2900 करके देखें कि कुल बचत कितनी बढ़ी।',
    },
  },
  {
    id: 'excel-attendance-sheet',
    title: { en: 'Attendance & Sales Record Sheet', hi: 'उपस्थिति (Attendance) और बिक्री रिकॉर्ड' },
    subtitle: { en: 'Count attendance and find highest sales day using COUNT, MAX, MIN', hi: 'COUNT, MAX और MIN से डेटा विश्लेषण करें' },
    formulasCovered: ['COUNT', 'SUM', 'MAX', 'MIN', 'AVERAGE'],
    columns: ['Item / Day', 'Units Sold', 'Price (₹)', 'Attendance %'],
    rows: [
      ['Monday', 18, 250, 92],
      ['Tuesday', 25, 250, 88],
      ['Wednesday', 14, 250, 76],
      ['Thursday', 32, 250, 95],
    ],
    sampleFormula: '=MAX(B2:B5)',
    explanation: {
      en: 'Small shopkeepers and HR teams use `=MAX(...)` to find peak sales days and `=AVERAGE(...)` to track weekly consistency.',
      hi: 'छोटे दुकानदार और HR टीमें `=MAX(...)` से सबसे ज़्यादा बिक्री वाला दिन और `=AVERAGE(...)` से औसत निकालते हैं।',
    },
    practicalTask: {
      en: 'Change Thursday units sold to 45 and observe the new Maximum and Average values.',
      hi: 'गुरुवार की बिक्री को 45 करके देखें कि नया अधिकतम (MAX) और औसत (AVERAGE) क्या आता है।',
    },
  },
];
