import { Language } from '../types';

interface UIStrings {
  brand: string;
  navHome: string;
  navLearn: string;
  navPractice: string;
  navBuild: string;
  navSpec: string;
  resumeLearning: string;
  welcomeGreeting: string;
  heroSubtitle: string;
  todaysGoalLabel: string;
  todaysGoalText: string;
  dailyStreak: string;
  daysLabel: string;
  xpLabel: string;
  levelLabel: string;
  offlineReady: string;
  quickActions: string;
  startComputerBasics: string;
  continuePython: string;
  solveTodaysChallenge: string;
  readTechNews: string;
  yourProgress: string;
  computerBasics: string;
  windowsExcel: string;
  pythonCourse: string;
  projectsTrack: string;
  codingPractice: string;
  badgesEarned: string;
  weeklyLeaderboard: string;
  leaderboardPrivacyNote: string;
  joinLeaderboard: string;
  leaveLeaderboard: string;
  youLabel: string;
  lightMode: string;
  darkMode: string;
  englishLabel: string;
  hindiLabel: string;
  gujaratiLabel: string;
  downloadOffline: string;
  savedOffline: string;
  markComplete: string;
  completed: string;
  simpleDefinition: string;
  realLifeExample: string;
  whyItMatters: string;
  practicalTask: string;
  quickQuiz: string;
  checkAnswer: string;
  correctFeedback: string;
  tryAgainFeedback: string;
  runCode: string;
  submitSolution: string;
  resetCode: string;
  showHint: string;
  revealSolution: string;
  sampleTestCases: string;
  hiddenTestCases: string;
  expectedOutput: string;
  actualOutput: string;
  passed: string;
  failed: string;
  attemptsLeftForSolution: string;
  friendlyErrorTitle: string;
  openSourceNotice: string;
  achievementsBtn: string;
  backupBtn: string;
}

const UI_TEXT_BY_LANGUAGE: Record<'en' | 'hi', UIStrings> = {
  en: {
    brand: 'TechStart India',
    navHome: 'Home',
    navLearn: 'Learn',
    navPractice: 'Practice',
    navBuild: 'Build & Grow',
    navSpec: 'About & Specs',
    resumeLearning: 'Continue Learning',
    welcomeGreeting: 'Welcome, Future Tech Professional',
    heroSubtitle: 'Learn computers, Excel, and Zero-to-Advanced Python by actually coding in your browser — zero setup, no tutorial hell.',
    todaysGoalLabel: "Today's Dynamic Goal",
    todaysGoalText: 'Finish your next uncompleted lesson and solve 1 Python challenge.',
    dailyStreak: 'Daily Streak',
    daysLabel: 'days',
    xpLabel: 'Total XP',
    levelLabel: 'Level',
    offlineReady: 'Offline Saved',
    quickActions: 'Quick Actions',
    startComputerBasics: 'Start Computer Basics',
    continuePython: 'Continue Python Path',
    solveTodaysChallenge: "Solve Today's Challenge",
    readTechNews: 'Read Daily Tech Pulse',
    yourProgress: 'Overall Mastery',
    computerBasics: 'Computer Basics',
    windowsExcel: 'Windows & Excel',
    pythonCourse: 'Python (Zero to Advanced)',
    projectsTrack: 'Projects & Job Prep',
    codingPractice: 'Coding & Bug Hunter',
    badgesEarned: 'Badges Earned',
    weeklyLeaderboard: 'Weekly Leaderboard',
    leaderboardPrivacyNote: 'Optional and privacy-friendly. Only your chosen nickname and XP appear if you opt in.',
    joinLeaderboard: 'Join Leaderboard',
    leaveLeaderboard: 'Hide Me',
    youLabel: 'You',
    lightMode: 'Light',
    darkMode: 'Dark',
    englishLabel: 'English',
    hindiLabel: 'Hinglish',
    gujaratiLabel: 'Gujarati',
    downloadOffline: 'Save Offline',
    savedOffline: 'Saved Offline',
    markComplete: 'Mark Complete',
    completed: 'Completed',
    simpleDefinition: 'Simple Explanation',
    realLifeExample: 'Real-Life Example',
    whyItMatters: 'Why It Matters',
    practicalTask: 'Practical Task',
    quickQuiz: 'Quick Quiz',
    checkAnswer: 'Check Answer',
    correctFeedback: 'Great job! That is right.',
    tryAgainFeedback: 'Not quite — read the explanation below and try again.',
    runCode: 'Run Code',
    submitSolution: 'Submit & Test',
    resetCode: 'Reset',
    showHint: 'Show Hint',
    revealSolution: 'Reveal Solution',
    sampleTestCases: 'Sample Test Cases',
    hiddenTestCases: 'Hidden Test Cases',
    expectedOutput: 'Expected Output',
    actualOutput: 'Your Output',
    passed: 'Passed',
    failed: 'Failed',
    attemptsLeftForSolution: 'failed attempts before solution unlocks',
    friendlyErrorTitle: 'Friendly Error Guide',
    openSourceNotice: '100% Free · Zero Setup · Browser Python Sandbox · MIT Open Source',
    achievementsBtn: 'Badges & Rank',
    backupBtn: 'Backup / Restore',
  },
  hi: {
    brand: 'TechStart India',
    navHome: 'Home',
    navLearn: 'Seekhein',
    navPractice: 'Practice',
    navBuild: 'Projects & Career',
    navSpec: 'About & Specs',
    resumeLearning: 'Aage Padhein',
    welcomeGreeting: 'Swagat hai, Future Tech Professional',
    heroSubtitle: 'Computer basics, Excel aur Zero-to-Advanced Python seedhe browser mein code likh kar seekhein — bina setup aur bina boring lectures ke.',
    todaysGoalLabel: 'Aaj ka Dynamic Goal',
    todaysGoalText: 'Apna agla baaki lesson complete karein aur 1 Python challenge solve karein.',
    dailyStreak: 'Daily Streak',
    daysLabel: 'din',
    xpLabel: 'Total XP',
    levelLabel: 'Level',
    offlineReady: 'Offline Saved',
    quickActions: 'Quick Start',
    startComputerBasics: 'Computer Basics Start Karein',
    continuePython: 'Python Path Jaari Rakhein',
    solveTodaysChallenge: 'Aaj ka Challenge Solve Karein',
    readTechNews: 'Daily Tech Pulse Padhein',
    yourProgress: 'Overall Mastery',
    computerBasics: 'Computer Basics',
    windowsExcel: 'Windows & Excel',
    pythonCourse: 'Python (Zero to Advanced)',
    projectsTrack: 'Projects & Job Prep',
    codingPractice: 'Coding & Bug Hunter',
    badgesEarned: 'Earned Badges',
    weeklyLeaderboard: 'Weekly Leaderboard',
    leaderboardPrivacyNote: 'Bilkul optional aur privacy-safe. Sirf aapki permission par hi aapka nickname aur XP dikhta hai.',
    joinLeaderboard: 'Leaderboard Join Karein',
    leaveLeaderboard: 'Naam Chhupayein',
    youLabel: 'Aap',
    lightMode: 'Light',
    darkMode: 'Dark',
    englishLabel: 'English',
    hindiLabel: 'Hinglish',
    gujaratiLabel: 'Gujarati',
    downloadOffline: 'Offline Save',
    savedOffline: 'Saved Offline',
    markComplete: 'Complete Mark Karein',
    completed: 'Completed',
    simpleDefinition: 'Asaan Samajh (Simple Explanation)',
    realLifeExample: 'Real-Life Example',
    whyItMatters: 'Ye Kyun Zaroori Hai',
    practicalTask: 'Practical Task',
    quickQuiz: 'Quick Quiz',
    checkAnswer: 'Answer Check Karein',
    correctFeedback: 'Bahut badhiya! Bilkul sahi jawab.',
    tryAgainFeedback: 'Koi baat nahi — neeche explanation padhein aur phir try karein.',
    runCode: 'Run Code',
    submitSolution: 'Submit & Test',
    resetCode: 'Reset',
    showHint: 'Hint Dekhein',
    revealSolution: 'Solution Dekhein',
    sampleTestCases: 'Sample Test Cases',
    hiddenTestCases: 'Hidden Test Cases',
    expectedOutput: 'Expected Output',
    actualOutput: 'Aapka Output',
    passed: 'Passed',
    failed: 'Failed',
    attemptsLeftForSolution: 'galat tries ke baad solution unlock hoga',
    friendlyErrorTitle: 'Friendly Error Guide',
    openSourceNotice: '100% Free · Zero Setup · Browser Python Sandbox · MIT Open Source',
    achievementsBtn: 'Badges & Rank',
    backupBtn: 'Backup / Restore',
  },
};

export const UI_TEXT: Record<Language, UIStrings> = {
  ...UI_TEXT_BY_LANGUAGE,
  gu: UI_TEXT_BY_LANGUAGE.en,
};
