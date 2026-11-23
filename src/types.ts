export type Language = 'en' | 'hi';
export type ThemeMode = 'light' | 'dark';
export type MainTab = 'home' | 'learn' | 'practice' | 'build' | 'spec';
export type LearnModule = 'computer' | 'windows-excel' | 'python';
export type PracticeMode = 'challenges' | 'bughunter' | 'dsa-viz' | 'think-dev';
export type BuildMode = 'projects' | 'news' | 'career' | 'interview';

export interface BilingualText {
  en: string;
  hi: string;
}

export interface QuizQuestion {
  id: string;
  question: BilingualText;
  options: { en: string; hi: string }[];
  correctIndex: number;
  explanation: BilingualText;
}

export interface ComputerTopic {
  id: string;
  order: number;
  title: BilingualText;
  category: 'hardware' | 'software' | 'connectivity' | 'daily-use';
  durationMin: number;
  image?: string;
  diagramType?: 'ram' | 'motherboard' | 'ports' | 'cpu' | 'storage' | 'os' | 'network';
  simpleDefinition: BilingualText;
  realLifeExample: BilingualText;
  whyItMatters: BilingualText;
  keySpecs?: { label: string; detail: BilingualText }[];
  practicalTask: BilingualText;
  videoScriptSummary: BilingualText;
  quiz: QuizQuestion[];
}

export interface ShortcutItem {
  id: string;
  keys: string[];
  action: BilingualText;
  example: BilingualText;
  category: 'editing' | 'navigation' | 'windows';
}

export interface WindowsSkillLesson {
  id: string;
  title: BilingualText;
  category: 'windows' | 'safety';
  durationMin: number;
  steps: BilingualText[];
  practicalTask: BilingualText;
  tip: BilingualText;
}

export interface ExcelTemplateLesson {
  id: string;
  title: BilingualText;
  subtitle: BilingualText;
  formulasCovered: string[];
  columns: string[];
  rows: (string | number)[][];
  sampleFormula: string;
  explanation: BilingualText;
  practicalTask: BilingualText;
}

export interface PythonLesson {
  id: string;
  number: number;
  unit: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  title: BilingualText;
  durationMin: number;
  simpleExplanation: BilingualText;
  whyItMatters: BilingualText;
  realLifeExample: BilingualText;
  syntax: string;
  code: string;
  lineByLine: { line: string; explanation: BilingualText }[];
  expectedOutput: string;
  commonMistakes: BilingualText[];
  practiceExercise: BilingualText;
  fillBlank?: {
    prompt: BilingualText;
    codeBefore: string;
    codeAfter: string;
    answer: string;
    hint: BilingualText;
  };
  parsons?: {
    prompt: BilingualText;
    correctOrder: string[];
  };
  miniChallenge: {
    prompt: BilingualText;
    starterCode: string;
    expectedOutput: string;
  };
  projectIdea: BilingualText;
  quiz: QuizQuestion;
}

export interface InterviewQA {
  id: string;
  category: 'Python Basics' | 'OOP & DSA' | 'Excel & Computer' | 'Projects & HR';
  question: BilingualText;
  answer: BilingualText;
  codeSnippet?: string;
}

export interface CheatSheetItem {
  id: string;
  title: string;
  category: 'Python' | 'Excel' | 'Git';
  entries: { syntax: string; meaning: BilingualText }[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  label: string;
}

export interface CodingChallenge {
  id: string;
  number: number;
  title: BilingualText;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  xp: number;
  isDaily?: boolean;
  description: BilingualText;
  starterCode: string;
  hints: BilingualText[];
  solutionCode: string;
  testCases: TestCase[];
}

export interface BugHunterChallenge {
  id: string;
  number: number;
  title: BilingualText;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  buggyCode: string;
  expectedOutput: string;
  sampleInput?: string;
  hints: BilingualText[];
  fixedCode: string;
  whyItHappened: BilingualText;
}

export interface ProjectSpec {
  id: string;
  title: BilingualText;
  level: 'Beginner' | 'Intermediate';
  duration: string;
  topicsUsed: string[];
  goal: BilingualText;
  features: BilingualText[];
  stepByStepPlan: BilingualText[];
  starterCode: string;
  codeExplanation: BilingualText;
  commonBugs: BilingualText[];
  testCases: { input: string; output: string }[];
  improvementIdeas: BilingualText[];
  githubGuide: BilingualText;
}

export interface NewsItem {
  id: string;
  category:
    | 'AI & Automation'
    | 'Gaming & Gadgets'
    | 'Telecom & Satellite'
    | 'Gadgets & Leaks'
    | 'Social & Apps'
    | 'Big Tech & Startups'
    | 'Cybersecurity'
    | 'ISRO & Space';
  highlightStat: string;
  title: BilingualText;
  summary: BilingualText;
  companySummary?: BilingualText;
  whyItMatters: BilingualText;
  date: string;
  readTime: string;
  sourceName: string;
  externalUrl: string;
  isLiveFetched?: boolean;
}

export interface SuccessStory {
  id: string;
  name: string;
  city: string;
  role: string;
  background: BilingualText;
  journey: BilingualText;
  advice: BilingualText;
}

export interface CareerTrack {
  id: string;
  title: BilingualText;
  entryRoles: string[];
  coreSkills: string[];
  timelineMonths: string;
  firstSteps: BilingualText[];
  freeCerts: string[];
}

export interface BadgeItem {
  id: string;
  title: BilingualText;
  description: BilingualText;
  requirementText: BilingualText;
  techHistory: {
    person: string;
    year: string;
    story: BilingualText;
  };
}

export interface UserProgress {
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  completedComputerIds: string[];
  completedWindowsIds: string[];
  completedPythonIds: string[];
  solvedChallengeIds: string[];
  solvedBugIds: string[];
  downloadedLessonIds: string[];
  completedChecklistIds: string[];
  leaderboardOptIn: boolean;
  displayName: string;
}
