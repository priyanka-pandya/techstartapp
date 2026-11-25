import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ClipboardPaste,
  Download,
  FilePlus2,
  FileSpreadsheet,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { BilingualText, Language, pickText } from '../types';

interface CellData {
  raw: string;
  bold?: boolean;
  currency?: boolean;
}

interface SheetState {
  id: string;
  tabLabel: string;
  isCustom?: boolean;
  title: BilingualText;
  explanation: BilingualText;
  guidedTasks: BilingualText[];
  rows: CellData[][];
}

interface ExcelLabProps {
  lang: Language;
  completedIds: string[];
  onCompleteSheet: (sheetId: string) => void;
}

const CUSTOM_SHEETS_STORAGE_KEY = 'techstart_custom_excel_sheets_v1';

function colIndexToLabel(idx: number): string {
  let n = idx;
  let label = '';
  while (n >= 0) {
    label = String.fromCharCode((n % 26) + 65) + label;
    n = Math.floor(n / 26) - 1;
  }
  return label;
}

function labelToColIndex(label: string): number {
  let idx = 0;
  const upper = label.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    idx = idx * 26 + (upper.charCodeAt(i) - 64);
  }
  return idx - 1;
}

function makeInitialSheets(): SheetState[] {
  return [
    {
      id: 'excel-marks-sheet',
      tabLabel: 'Marks_Sheet',
      title: {
        en: 'Student Marks Sheet (SUM, AVERAGE, IF)',
        hi: 'Student Marks Sheet (SUM, AVERAGE, IF)',
        gu: 'વિદ્યાર્થી માર્ક્સ શીટ (SUM, AVERAGE, IF)',
      },
      explanation: {
        en: 'Click any cell (like E2 or F2) to inspect its real formula in the fx bar. Change marks in columns B–D or type your own =SUM / =IF formula!',
        hi: 'Kisi bhi cell (jaise E2 ya F2) par click karke upar fx Formula Bar mein asli formula dekho. Columns B–D ke marks badlo aur result turant update hote dekho!',
        gu: 'કોઈપણ સેલ (જેમ કે E2 કે F2) પર ક્લિક કરીને ઉપર fx Formula Bar માં અસલી ફોર્મ્યુલા જુઓ. B–D કોલમમાં માર્ક્સ બદલો અને પરિણામ તરત અપડેટ થતું જુઓ!',
      },
      guidedTasks: [
        {
          en: '1. Click cell E2 to see =SUM(B2:D2), then change Math mark in B4 from 31 to 65 so Rohan passes.',
          hi: '1. Cell E2 par click karke =SUM(B2:D2) dekho, phir B4 mein 31 ko 65 banao taaki F4 "Pass" ho jaye.',
          gu: '1. સેલ E2 પર ક્લિક કરીને =SUM(B2:D2) જુઓ, પછી B4 માં 31 ને 65 કરો જેથી F4 "Pass" થઈ જાય.',
        },
        {
          en: '2. Click cell B6 and edit it to =MAX(B2:B5) to find the highest Math score.',
          hi: '2. Cell B6 par click karo aur =MAX(B2:B5) likh kar Math ka highest score nikaalo.',
          gu: '2. સેલ B6 પર ક્લિક કરો અને =MAX(B2:B5) લખીને Math નો સૌથી વધુ સ્કોર શોધો.',
        },
      ],
      rows: [
        [
          { raw: 'Student', bold: true },
          { raw: 'Math', bold: true },
          { raw: 'Science', bold: true },
          { raw: 'English', bold: true },
          { raw: 'Total', bold: true },
          { raw: 'Status', bold: true },
        ],
        [
          { raw: 'Aarav Sharma' },
          { raw: '78' },
          { raw: '84' },
          { raw: '72' },
          { raw: '=SUM(B2:D2)', bold: true },
          { raw: '=IF(AVERAGE(B2:D2)>=40, "Pass", "Needs Help")' },
        ],
        [
          { raw: 'Priya Verma' },
          { raw: '92' },
          { raw: '88' },
          { raw: '95' },
          { raw: '=SUM(B3:D3)', bold: true },
          { raw: '=IF(AVERAGE(B3:D3)>=40, "Pass", "Needs Help")' },
        ],
        [
          { raw: 'Rohan Das' },
          { raw: '31' },
          { raw: '40' },
          { raw: '35' },
          { raw: '=SUM(B4:D4)', bold: true },
          { raw: '=IF(AVERAGE(B4:D4)>=40, "Pass", "Needs Help")' },
        ],
        [
          { raw: 'Sneha Patel' },
          { raw: '65' },
          { raw: '74' },
          { raw: '80' },
          { raw: '=SUM(B5:D5)', bold: true },
          { raw: '=IF(AVERAGE(B5:D5)>=40, "Pass", "Needs Help")' },
        ],
        [
          { raw: 'Class Avg / Sum', bold: true },
          { raw: '=AVERAGE(B2:B5)', bold: true },
          { raw: '=AVERAGE(C2:C5)', bold: true },
          { raw: '=AVERAGE(D2:D5)', bold: true },
          { raw: '=SUM(E2:E5)', bold: true },
          { raw: '=COUNTIF(F2:F5, "Pass")', bold: true },
        ],
      ],
    },
    {
      id: 'excel-expense-tracker',
      tabLabel: 'Monthly_Budget',
      title: {
        en: 'Monthly Hostel & Home Budget Sheet',
        hi: 'Monthly Hostel & Home Budget Sheet',
        gu: 'માસિક હોસ્ટેલ અને ઘર બજેટ શીટ',
      },
      explanation: {
        en: 'Practice subtraction (=B2-C2) and budget warning rules (=IF(E2>=0, "Within", "Over")). Toggle ₹ Currency format from the toolbar.',
        hi: 'Subtraction (=B2-C2) aur budget alerts (=IF(E2>=0, "Within", "Over")) practice karo. Toolbar se ₹ Currency button try karo.',
        gu: 'બાદબાકી (=B2-C2) અને બજેટ ચેતવણી (=IF(E2>=0, "Within", "Over")) ની પ્રેક્ટિસ કરો. ટૂલબારમાંથી ₹ બટન અજમાવો.',
      },
      guidedTasks: [
        {
          en: '1. Lower Food & Tiffin Spent in cell C3 from 3650 to 2900 and watch E3 and F3 flip to savings!',
          hi: '1. Cell C3 (Food Spent) ko 3650 se 2900 karo aur E3/F3 ko "Within" bante dekho!',
          gu: '1. સેલ C3 (Food Spent) ને 3650 થી 2900 કરો અને E3/F3 ને "Within" થતું જુઓ!',
        },
        {
          en: '2. Click C6 to verify total monthly spending with =SUM(C2:C5).',
          hi: '2. Total monthly spending check karne ke liye C6 mein =SUM(C2:C5) formula dekho.',
          gu: '2. કુલ માસિક ખર્ચ તપાસવા માટે C6 માં =SUM(C2:C5) ફોર્મ્યુલા જુઓ.',
        },
      ],
      rows: [
        [
          { raw: 'Category', bold: true },
          { raw: 'Budget', bold: true },
          { raw: 'Spent', bold: true },
          { raw: 'Days', bold: true },
          { raw: 'Saved', bold: true },
          { raw: 'Alert', bold: true },
        ],
        [
          { raw: 'Room Rent' },
          { raw: '4500', currency: true },
          { raw: '4500', currency: true },
          { raw: '30' },
          { raw: '=B2-C2', currency: true, bold: true },
          { raw: '=IF(E2>=0, "Within", "Over")' },
        ],
        [
          { raw: 'Food & Tiffin' },
          { raw: '3200', currency: true },
          { raw: '3650', currency: true },
          { raw: '30' },
          { raw: '=B3-C3', currency: true, bold: true },
          { raw: '=IF(E3>=0, "Within", "Over")' },
        ],
        [
          { raw: 'Mobile & Wi-Fi' },
          { raw: '600', currency: true },
          { raw: '599', currency: true },
          { raw: '28' },
          { raw: '=B4-C4', currency: true, bold: true },
          { raw: '=IF(E4>=0, "Within", "Over")' },
        ],
        [
          { raw: 'Books & Data' },
          { raw: '800', currency: true },
          { raw: '450', currency: true },
          { raw: '15' },
          { raw: '=B5-C5', currency: true, bold: true },
          { raw: '=IF(E5>=0, "Within", "Over")' },
        ],
        [
          { raw: 'Total', bold: true },
          { raw: '=SUM(B2:B5)', currency: true, bold: true },
          { raw: '=SUM(C2:C5)', currency: true, bold: true },
          { raw: '=AVERAGE(D2:D5)', bold: true },
          { raw: '=SUM(E2:E5)', currency: true, bold: true },
          { raw: '=IF(E6>=0, "Healthy", "Cut Cost")', bold: true },
        ],
      ],
    },
    {
      id: 'excel-attendance-sheet',
      tabLabel: 'Shop_Sales',
      title: {
        en: 'Shop Sales & Daily Revenue Tracker',
        hi: 'Shop Sales & Daily Revenue Tracker',
        gu: 'દુકાન વેચાણ અને દૈનિક આવક ટ્રેકર',
      },
      explanation: {
        en: 'Multiply Units * Price (=B2*C2) and find peak revenue day using =MAX(E2:E5). Useful for shopkeeper, billing, and MIS Analyst roles.',
        hi: 'Units * Price (=B2*C2) aur peak sales day (=MAX(E2:E5)) nikaalo — MIS Analyst aur billing jobs ke liye zaroori skill.',
        gu: 'Units * Price (=B2*C2) અને સૌથી વધુ વેચાણનો દિવસ (=MAX(E2:E5)) શોધો — બિલિંગ અને MIS એનાલિસ્ટ જોબ્સ માટે ખૂબ ઉપયોગી.',
      },
      guidedTasks: [
        {
          en: '1. Change Thursday Units Sold in B5 to 45 and see Total Revenue in E6 update instantly.',
          hi: '1. Thursday Units Sold (B5) ko 45 karo aur E6 mein Total Revenue badalte dekho.',
          gu: '1. ગુરુવારના Units Sold (B5) ને 45 કરો અને E6 માં કુલ આવક તરત બદલાતી જુઓ.',
        },
        {
          en: '2. Click cell F6 to inspect =MAX(E2:E5) finding the best single-day revenue.',
          hi: '2. Cell F6 par click karke =MAX(E2:E5) se sabse zyada kamai wala din dekho.',
          gu: '2. સેલ F6 પર ક્લિક કરીને =MAX(E2:E5) વડે સૌથી વધુ કમાણીનો દિવસ જુઓ.',
        },
      ],
      rows: [
        [
          { raw: 'Day', bold: true },
          { raw: 'Units', bold: true },
          { raw: 'Price', bold: true },
          { raw: 'Discount', bold: true },
          { raw: 'Revenue', bold: true },
          { raw: 'Target', bold: true },
        ],
        [
          { raw: 'Monday' },
          { raw: '18' },
          { raw: '250', currency: true },
          { raw: '100', currency: true },
          { raw: '=B2*C2-D2', currency: true, bold: true },
          { raw: '=IF(E2>=5000, "Hit", "Below")' },
        ],
        [
          { raw: 'Tuesday' },
          { raw: '25' },
          { raw: '250', currency: true },
          { raw: '150', currency: true },
          { raw: '=B3*C3-D3', currency: true, bold: true },
          { raw: '=IF(E3>=5000, "Hit", "Below")' },
        ],
        [
          { raw: 'Wednesday' },
          { raw: '14' },
          { raw: '250', currency: true },
          { raw: '0', currency: true },
          { raw: '=B4*C4-D4', currency: true, bold: true },
          { raw: '=IF(E4>=5000, "Hit", "Below")' },
        ],
        [
          { raw: 'Thursday' },
          { raw: '32' },
          { raw: '250', currency: true },
          { raw: '200', currency: true },
          { raw: '=B5*C5-D5', currency: true, bold: true },
          { raw: '=IF(E5>=5000, "Hit", "Below")' },
        ],
        [
          { raw: 'Total / Peak', bold: true },
          { raw: '=SUM(B2:B5)', bold: true },
          { raw: '=AVERAGE(C2:C5)', currency: true, bold: true },
          { raw: '=SUM(D2:D5)', currency: true, bold: true },
          { raw: '=SUM(E2:E5)', currency: true, bold: true },
          { raw: '=MAX(E2:E5)', currency: true, bold: true },
        ],
      ],
    },
    {
      id: 'excel-sandbox-sheet',
      tabLabel: 'Blank_Sandbox',
      title: {
        en: 'Free Practice Sandbox Sheet',
        hi: 'Free Practice Sandbox Sheet',
        gu: 'ફ્રી પ્રેક્ટિસ સેન્ડબોક્સ શીટ',
      },
      explanation: {
        en: 'Build your own table from scratch! Type numbers or upload your own .xlsx/.csv sheet above to practice =SUM, =AVERAGE, =IF, =VLOOKUP, and more.',
        hi: 'Yahan apni khud ki Excel sheet banao ya upar se apni .xlsx/.csv file upload karke =SUM, =AVERAGE, =IF, =VLOOKUP practice karo!',
        gu: 'અહીં તમારી પોતાની શીટ બનાવો અથવા ઉપરથી તમારી .xlsx/.csv ફાઇલ અપલોડ કરીને =SUM, =AVERAGE, =IF, =VLOOKUP પ્રેક્ટિસ કરો!',
      },
      guidedTasks: [
        {
          en: '1. Click B2, type 120, press Enter, type 80 in B3, then type =SUM(B2:B3) in B4.',
          hi: '1. B2 mein 120 likh kar Enter dabao, B3 mein 80 likho, aur B4 mein =SUM(B2:B3) test karo.',
          gu: '1. B2 માં 120 લખી Enter દબાવો, B3 માં 80 લખો, અને B4 માં =SUM(B2:B3) ચકાસો.',
        },
      ],
      rows: [
        [{ raw: 'Item', bold: true }, { raw: 'Val 1', bold: true }, { raw: 'Val 2', bold: true }, { raw: 'Total', bold: true }, { raw: 'Check', bold: true }, { raw: 'Notes', bold: true }],
        [{ raw: 'Sample A' }, { raw: '120' }, { raw: '80' }, { raw: '=B2+C2', bold: true }, { raw: '=IF(D2>=150, "Good", "Low")' }, { raw: '' }],
        [{ raw: 'Sample B' }, { raw: '45' }, { raw: '55' }, { raw: '=B3+C3', bold: true }, { raw: '=IF(D3>=150, "Good", "Low")' }, { raw: '' }],
        [{ raw: '' }, { raw: '' }, { raw: '' }, { raw: '' }, { raw: '' }, { raw: '' }],
        [{ raw: '' }, { raw: '' }, { raw: '' }, { raw: '' }, { raw: '' }, { raw: '' }],
        [{ raw: 'Total', bold: true }, { raw: '=SUM(B2:B3)', bold: true }, { raw: '=SUM(C2:C3)', bold: true }, { raw: '=SUM(D2:D3)', bold: true }, { raw: '' }, { raw: '' }],
      ],
    },
  ];
}

function parseCellRef(ref: string, maxCols: number): { r: number; c: number } | null {
  const m = ref.trim().toUpperCase().match(/^([A-Z]{1,2})(\d+)$/);
  if (!m) return null;
  const c = labelToColIndex(m[1]);
  const r = Number(m[2]) - 1;
  if (c < 0 || c >= maxCols || r < 0) return null;
  return { r, c };
}

function splitTopLevelArgs(input: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === '"') inQuotes = !inQuotes;
    if (!inQuotes) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ',' && depth === 0) {
        args.push(current.trim());
        current = '';
        continue;
      }
    }
    current += ch;
  }
  if (current.trim() !== '' || input.endsWith(',')) args.push(current.trim());
  return args;
}

function evaluateSheet(rows: CellData[][], colCount: number): (string | number)[][] {
  const visiting = new Set<string>();
  const memo = new Map<string, string | number>();

  const expandRangeMatrix = (rangeStr: string): (string | number)[][] => {
    const parts = rangeStr.split(':').map((s) => s.trim());
    if (parts.length !== 2) return [[evalExpr(rangeStr)]];
    const start = parseCellRef(parts[0], colCount);
    const end = parseCellRef(parts[1], colCount);
    if (!start || !end) return [];
    const matrix: (string | number)[][] = [];
    for (let r = Math.min(start.r, end.r); r <= Math.max(start.r, end.r); r++) {
      const rowVals: (string | number)[] = [];
      for (let c = Math.min(start.c, end.c); c <= Math.max(start.c, end.c); c++) {
        if (r < rows.length && c < colCount) {
          rowVals.push(getCellVal(r, c));
        }
      }
      matrix.push(rowVals);
    }
    return matrix;
  };

  const expandRangeValues = (rangeStr: string): (string | number)[] => {
    return expandRangeMatrix(rangeStr).flat();
  };

  const toNumericList = (args: string[]): number[] => {
    const nums: number[] = [];
    for (const arg of args) {
      if (arg.includes(':')) {
        for (const v of expandRangeValues(arg)) {
          if (typeof v === 'number' && !Number.isNaN(v)) nums.push(v);
        }
      } else {
        const v = evalExpr(arg);
        if (typeof v === 'number' && !Number.isNaN(v)) nums.push(v);
      }
    }
    return nums;
  };

  const evalArithmetic = (expr: string): number | string => {
    const replaced = expr.replace(/\b([A-Za-z]{1,2}\d+)\b/g, (full) => {
      const ref = parseCellRef(full, colCount);
      if (!ref || ref.r >= rows.length) return '0';
      const v = getCellVal(ref.r, ref.c);
      if (typeof v === 'number') return String(v);
      if (typeof v === 'string' && v.startsWith('#')) return 'NaN';
      const parsed = Number(v);
      return Number.isNaN(parsed) ? '0' : String(parsed);
    });

    if (!/^[\d+\-*/().\sNaN]+$/.test(replaced)) {
      return '#NAME?';
    }
    try {
      let pos = 0;
      const str = replaced.replace(/\s+/g, '');
      const parseNumOrParen = (): number => {
        if (str[pos] === '+') {
          pos++;
          return parseNumOrParen();
        }
        if (str[pos] === '-') {
          pos++;
          return -parseNumOrParen();
        }
        if (str[pos] === '(') {
          pos++;
          const val = parseAddSub();
          if (str[pos] === ')') pos++;
          return val;
        }
        const start = pos;
        while (pos < str.length && /[\d.]/.test(str[pos])) pos++;
        if (start === pos) return NaN;
        return Number(str.slice(start, pos));
      };
      const parseMulDiv = (): number => {
        let left = parseNumOrParen();
        while (pos < str.length && (str[pos] === '*' || str[pos] === '/')) {
          const op = str[pos++];
          const right = parseNumOrParen();
          left = op === '*' ? left * right : right === 0 ? NaN : left / right;
        }
        return left;
      };
      const parseAddSub = (): number => {
        let left = parseMulDiv();
        while (pos < str.length && (str[pos] === '+' || str[pos] === '-')) {
          const op = str[pos++];
          const right = parseMulDiv();
          left = op === '+' ? left + right : left - right;
        }
        return left;
      };
      const out = parseAddSub();
      if (pos !== str.length || Number.isNaN(out)) return '#VALUE!';
      return Math.round(out * 100) / 100;
    } catch {
      return '#VALUE!';
    }
  };

  const evalCondition = (cond: string): boolean => {
    const ops = ['>=', '<=', '<>', '!=', '=', '>', '<'];
    for (const op of ops) {
      let inQ = false;
      let depth = 0;
      for (let i = 0; i <= cond.length - op.length; i++) {
        if (cond[i] === '"') inQ = !inQ;
        if (!inQ) {
          if (cond[i] === '(') depth++;
          else if (cond[i] === ')') depth--;
          else if (depth === 0 && cond.slice(i, i + op.length) === op) {
            const left = evalExpr(cond.slice(0, i).trim());
            const right = evalExpr(cond.slice(i + op.length).trim());
            const ln = typeof left === 'number' ? left : Number(left);
            const rn = typeof right === 'number' ? right : Number(right);
            const bothNum = !Number.isNaN(ln) && !Number.isNaN(rn) && left !== '' && right !== '';
            if (op === '>=') return bothNum ? ln >= rn : String(left) >= String(right);
            if (op === '<=') return bothNum ? ln <= rn : String(left) <= String(right);
            if (op === '<>' || op === '!=') return bothNum ? ln !== rn : String(left) !== String(right);
            if (op === '=') return bothNum ? ln === rn : String(left) === String(right);
            if (op === '>') return bothNum ? ln > rn : String(left) > String(right);
            if (op === '<') return bothNum ? ln < rn : String(left) < String(right);
          }
        }
      }
    }
    return Boolean(evalExpr(cond));
  };

  const evalExpr = (rawExpr: string): string | number => {
    const expr = rawExpr.trim();
    if (!expr) return '';
    if (expr.startsWith('"') && expr.endsWith('"') && expr.length >= 2) {
      return expr.slice(1, -1);
    }

    const fnMatch = expr.match(/^([A-Z]+)\(([\s\S]*)\)$/i);
    if (fnMatch) {
      const fn = fnMatch[1].toUpperCase();
      const args = splitTopLevelArgs(fnMatch[2]);
      if (fn === 'SUM') {
        const nums = toNumericList(args);
        return Math.round(nums.reduce((a, b) => a + b, 0) * 100) / 100;
      }
      if (fn === 'AVERAGE' || fn === 'AVG') {
        const nums = toNumericList(args);
        if (nums.length === 0) return 0;
        return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
      }
      if (fn === 'MAX') {
        const nums = toNumericList(args);
        return nums.length ? Math.max(...nums) : 0;
      }
      if (fn === 'MIN') {
        const nums = toNumericList(args);
        return nums.length ? Math.min(...nums) : 0;
      }
      if (fn === 'COUNT') {
        return toNumericList(args).length;
      }
      if (fn === 'COUNTA') {
        let count = 0;
        for (const arg of args) {
          const vals = arg.includes(':') ? expandRangeValues(arg) : [evalExpr(arg)];
          for (const v of vals) {
            if (v !== '' && v !== null && v !== undefined) count++;
          }
        }
        return count;
      }
      if (fn === 'COUNTIF' && args.length >= 2) {
        const vals = expandRangeValues(args[0]);
        const crit = evalExpr(args[1]);
        const critStr = String(crit).trim();
        let count = 0;
        for (const v of vals) {
          if (/^(>=|<=|>|<)/.test(critStr)) {
            const m = critStr.match(/^(>=|<=|>|<)\s*(.+)$/);
            if (m && typeof v === 'number') {
              const target = Number(m[2]);
              if (m[1] === '>=' && v >= target) count++;
              if (m[1] === '<=' && v <= target) count++;
              if (m[1] === '>' && v > target) count++;
              if (m[1] === '<' && v < target) count++;
            }
          } else if (String(v).toLowerCase() === critStr.toLowerCase()) {
            count++;
          }
        }
        return count;
      }
      if (fn === 'ROUND' && args.length >= 2) {
        const num = Number(evalExpr(args[0]));
        const digits = Number(evalExpr(args[1])) || 0;
        if (Number.isNaN(num)) return '#VALUE!';
        const factor = Math.pow(10, digits);
        return Math.round(num * factor) / factor;
      }
      if (fn === 'IF' && args.length >= 2) {
        const condOk = evalCondition(args[0]);
        if (condOk) return evalExpr(args[1]);
        return args[2] !== undefined ? evalExpr(args[2]) : 'FALSE';
      }
      if (fn === 'VLOOKUP' && args.length >= 3) {
        const lookupVal = evalExpr(args[0]);
        const matrix = expandRangeMatrix(args[1]);
        const colIdx = Number(evalExpr(args[2]));
        if (Number.isNaN(colIdx) || colIdx < 1) return '#VALUE!';
        if (matrix.length === 0 || colIdx > (matrix[0]?.length || 0)) return '#REF!';
        const needle = String(lookupVal).trim().toLowerCase();
        for (const row of matrix) {
          const cellKey = String(row[0] ?? '').trim().toLowerCase();
          if (cellKey === needle) {
            return row[colIdx - 1] ?? '';
          }
        }
        return '#N/A';
      }
      if (fn === 'LEN' && args.length >= 1) {
        return String(evalExpr(args[0])).length;
      }
      if (fn === 'UPPER' && args.length >= 1) {
        return String(evalExpr(args[0])).toUpperCase();
      }
      if (fn === 'LOWER' && args.length >= 1) {
        return String(evalExpr(args[0])).toLowerCase();
      }
      if (fn === 'TRIM' && args.length >= 1) {
        return String(evalExpr(args[0])).trim().replace(/\s+/g, ' ');
      }
      return '#NAME?';
    }

    const singleRef = parseCellRef(expr, colCount);
    if (singleRef) {
      if (singleRef.r >= rows.length) return '#REF!';
      return getCellVal(singleRef.r, singleRef.c);
    }

    const numVal = Number(expr);
    if (!Number.isNaN(numVal)) return numVal;

    return evalArithmetic(expr);
  };

  const getCellVal = (r: number, c: number): string | number => {
    const key = `${r}:${c}`;
    if (memo.has(key)) return memo.get(key)!;
    if (visiting.has(key)) return '#REF!';
    visiting.add(key);

    const cell = rows[r]?.[c];
    let result: string | number = '';
    if (cell) {
      const raw = cell.raw.trim();
      if (raw.startsWith('=')) {
        result = evalExpr(raw.slice(1));
      } else if (raw !== '' && !Number.isNaN(Number(raw))) {
        result = Number(raw);
      } else {
        result = cell.raw;
      }
    }

    visiting.delete(key);
    memo.set(key, result);
    return result;
  };

  return rows.map((row, r) => row.map((_cell, c) => getCellVal(r, c)));
}

function parseDelimitedLine(line: string, delimiter: string): string[] {
  if (delimiter === '\t') {
    return line.split('\t').map((s) => s.trim());
  }
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    } else if (ch === delimiter && !inQ) {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

function buildCustomSheetState(tabLabel: string, rawGrid: string[][]): SheetState {
  const safeRows = Math.min(Math.max(rawGrid.length, 6), 100);
  const maxRawCols = rawGrid.reduce((mx, r) => Math.max(mx, r.length), 0);
  const safeCols = Math.min(Math.max(maxRawCols, 6), 26);

  const rows: CellData[][] = Array.from({ length: safeRows }, (_, r) =>
    Array.from({ length: safeCols }, (_, c) => ({
      raw: rawGrid[r]?.[c] ?? '',
      bold: r === 0 && Boolean(rawGrid[0]?.[c]),
    }))
  );

  const safeLabel = tabLabel.replace(/[^\w\- ]+/g, '').trim().slice(0, 22) || 'Custom_Sheet';
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tabLabel: safeLabel,
    isCustom: true,
    title: {
      en: `${safeLabel} (Your Sheet)`,
      hi: `${safeLabel} (Aapki Sheet)`,
      gu: `${safeLabel} (તમારી શીટ)`,
    },
    explanation: {
      en: 'Custom uploaded/pasted sheet! Click any cell, inspect or write formulas like =SUM(B2:B5), =AVERAGE, =IF, =VLOOKUP in the fx bar, and export back to .xlsx anytime.',
      hi: 'Ye aapki custom sheet hai! Kisi bhi cell par click karke fx bar mein =SUM, =AVERAGE, =IF, =VLOOKUP formulas lagao aur kabhi bhi .xlsx export karo.',
      gu: 'આ તમારી કસ્ટમ શીટ છે! કોઈપણ સેલ પર ક્લિક કરીને fx બારમાં =SUM, =AVERAGE, =IF, =VLOOKUP ફોર્મ્યુલા અજમાવો અને ગમે ત્યારે .xlsx તરીકે એક્સપોર્ટ કરો.',
    },
    guidedTasks: [
      {
        en: '1. Select an empty cell next to your numbers and click =SUM or =AVERAGE in the toolbar to test formulas on your own data.',
        hi: '1. Apne numbers ke bagal wale empty cell ko select karo aur toolbar se =SUM ya =AVERAGE click karke test karo.',
        gu: '1. તમારા નંબરોની બાજુના ખાલી સેલને પસંદ કરો અને ટૂલબારમાંથી =SUM અથવા =AVERAGE પર ક્લિક કરીને ફોર્મ્યુલા તપાસો.',
      },
    ],
    rows,
  };
}

export const ExcelLab: React.FC<ExcelLabProps> = ({ lang, completedIds, onCompleteSheet }) => {
  const [sheets, setSheets] = useState<SheetState[]>(() => {
    const defaults = makeInitialSheets();
    try {
      const savedRaw = localStorage.getItem(CUSTOM_SHEETS_STORAGE_KEY);
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw) as SheetState[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...defaults, ...parsed.filter((s) => s && s.isCustom && Array.isArray(s.rows))];
        }
      }
    } catch {
      // Ignore storage error
    }
    return defaults;
  });

  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 1, c: 4 });
  const [editingCell, setEditingCell] = useState<{ r: number; c: number } | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteSheetName, setPasteSheetName] = useState('My_Practice_Sheet');
  const [pasteText, setPasteText] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const customOnly = sheets.filter((s) => s.isCustom);
      localStorage.setItem(CUSTOM_SHEETS_STORAGE_KEY, JSON.stringify(customOnly));
    } catch {
      // Ignore storage quota errors
    }
  }, [sheets]);

  const safeSheetIdx = Math.min(activeSheetIdx, sheets.length - 1);
  const sheet = sheets[safeSheetIdx] || sheets[0];
  const colCount = useMemo(
    () => Math.max(6, sheet.rows.reduce((mx, r) => Math.max(mx, r.length), 0)),
    [sheet.rows]
  );
  const colHeaders = useMemo(
    () => Array.from({ length: colCount }, (_, i) => colIndexToLabel(i)),
    [colCount]
  );

  const evaluated = useMemo(() => evaluateSheet(sheet.rows, colCount), [sheet.rows, colCount]);

  const safeR = Math.min(selectedCell.r, sheet.rows.length - 1);
  const safeC = Math.min(selectedCell.c, colCount - 1);
  const activeCellObj = sheet.rows[safeR]?.[safeC] || { raw: '' };
  const activeCoord = `${colHeaders[safeC] || 'A'}${safeR + 1}`;
  const isDone = completedIds.includes(sheet.id);

  const commitCellEdit = (r: number, c: number, newRaw: string) => {
    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== safeSheetIdx) return s;
        const nextRows = s.rows.map((row, rIdx) => {
          if (rIdx !== r) return row;
          const padded = [...row];
          while (padded.length < colCount) padded.push({ raw: '' });
          return padded.map((cell, cIdx) => (cIdx === c ? { ...cell, raw: newRaw } : cell));
        });
        return { ...s, rows: nextRows };
      })
    );
  };

  const startCellEdit = (r: number, c: number, seedChar?: string) => {
    const existing = sheet.rows[r]?.[c]?.raw ?? '';
    setSelectedCell({ r, c });
    setEditingCell({ r, c });
    setDraftValue(seedChar !== undefined ? seedChar : existing);
  };

  const toggleFormat = (prop: 'bold' | 'currency') => {
    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== safeSheetIdx) return s;
        const nextRows = s.rows.map((row, rIdx) =>
          rIdx === safeR
            ? row.map((cell, cIdx) => (cIdx === safeC ? { ...cell, [prop]: !cell[prop] } : cell))
            : row
        );
        return { ...s, rows: nextRows };
      })
    );
  };

  const insertFormulaStarter = (formulaName: string) => {
    const rNum = safeR + 1;
    const starter =
      formulaName === 'SUM'
        ? `=SUM(B${rNum}:D${rNum})`
        : formulaName === 'AVERAGE'
        ? `=AVERAGE(B${rNum}:D${rNum})`
        : formulaName === 'MAX'
        ? `=MAX(B2:B5)`
        : formulaName === 'MIN'
        ? `=MIN(B2:B5)`
        : formulaName === 'COUNT'
        ? `=COUNT(B2:B5)`
        : formulaName === 'VLOOKUP'
        ? `=VLOOKUP(A${rNum}, A2:E5, 2)`
        : `=IF(E${rNum}>=150, "Pass", "Check")`;
    setEditingCell({ r: safeR, c: safeC });
    setDraftValue(starter);
    commitCellEdit(safeR, safeC, starter);
  };

  const handleAddRow = () => {
    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== safeSheetIdx) return s;
        const newRow: CellData[] = Array.from({ length: colCount }, () => ({ raw: '' }));
        return { ...s, rows: [...s.rows, newRow] };
      })
    );
  };

  const handleAddColumn = () => {
    if (colCount >= 26) {
      setUploadStatus({
        ok: false,
        msg:
          lang === 'gu'
            ? 'મહત્તમ 26 કોલમ (A–Z) સપોર્ટેડ છે.'
            : lang === 'hi'
            ? 'Maximum 26 columns (A–Z) hi add kar sakte ho.'
            : 'Maximum 26 columns (A–Z) reached.',
      });
      return;
    }
    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== safeSheetIdx) return s;
        return {
          ...s,
          rows: s.rows.map((row) => [...row, { raw: '' }]),
        };
      })
    );
  };

  const handleResetSheet = () => {
    if (sheet.isCustom) {
      const blankGrid = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => ''));
      setSheets((prev) =>
        prev.map((s, idx) => (idx === safeSheetIdx ? { ...buildCustomSheetState(s.tabLabel, blankGrid), id: s.id } : s))
      );
    } else {
      const freshDefaults = makeInitialSheets();
      const fresh = freshDefaults.find((d) => d.id === sheet.id) || freshDefaults[0];
      setSheets((prev) => prev.map((s, idx) => (idx === safeSheetIdx ? fresh : s)));
    }
    setEditingCell(null);
  };

  const handleCreateBlankCustomSheet = () => {
    const customCount = sheets.filter((s) => s.isCustom).length + 1;
    const blank = buildCustomSheetState(`My_Sheet_${customCount}`, [
      ['Item', 'Qty', 'Price', 'Total', 'Status', 'Notes'],
      ['Notebook', '3', '50', '=B2*C2', '=IF(D2>=100,"Bulk","Single")', ''],
      ['Pen', '5', '15', '=B3*C3', '=IF(D3>=100,"Bulk","Single")', ''],
    ]);
    setSheets((prev) => [...prev, blank]);
    setActiveSheetIdx(sheets.length);
    setSelectedCell({ r: 1, c: 3 });
    setUploadStatus({
      ok: true,
      msg:
        lang === 'gu'
          ? `નવી પ્રેક્ટિસ શીટ "${blank.tabLabel}" બનાવવામાં આવી!`
          : lang === 'hi'
          ? `Nayi custom sheet "${blank.tabLabel}" create ho gayi!`
          : `Created new custom sheet "${blank.tabLabel}"!`,
    });
  };

  const handleDeleteCustomSheet = (idxToDelete: number) => {
    if (!sheets[idxToDelete]?.isCustom) return;
    setSheets((prev) => prev.filter((_, idx) => idx !== idxToDelete));
    setActiveSheetIdx((prevIdx) => (prevIdx >= idxToDelete ? Math.max(0, prevIdx - 1) : prevIdx));
    setEditingCell(null);
  };

  const handleExcelFile = async (file: File) => {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!['xlsx', 'xls', 'csv', 'tsv'].includes(ext)) {
        setUploadStatus({
          ok: false,
          msg:
            lang === 'gu'
              ? 'કૃપા કરીને .xlsx, .xls, .csv અથવા .tsv ફાઇલ અપલોડ કરો.'
              : lang === 'hi'
              ? 'Kripya sirf .xlsx, .xls, .csv ya .tsv file upload karo.'
              : 'Please upload a valid .xlsx, .xls, .csv, or .tsv file.',
        });
        return;
      }

      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array', cellFormula: true });
      const importedSheets: SheetState[] = [];

      for (const sheetName of wb.SheetNames.slice(0, 3)) {
        const ws = wb.Sheets[sheetName];
        if (!ws) continue;
        const refStr = ws['!ref'] || 'A1:F6';
        const range = XLSX.utils.decode_range(refStr);
        const maxR = Math.min(range.e.r + 1, 100);
        const maxC = Math.min(range.e.c + 1, 26);

        const grid: string[][] = [];
        for (let r = 0; r < maxR; r++) {
          const rowVals: string[] = [];
          for (let c = 0; c < maxC; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = ws[addr] as XLSX.CellObject | undefined;
            if (!cell) {
              rowVals.push('');
            } else if (cell.f) {
              rowVals.push(`=${cell.f}`);
            } else if (cell.v !== undefined && cell.v !== null) {
              rowVals.push(String(cell.v));
            } else {
              rowVals.push('');
            }
          }
          grid.push(rowVals);
        }

        const label =
          wb.SheetNames.length === 1
            ? file.name.replace(/\.[^.]+$/, '')
            : sheetName;
        importedSheets.push(buildCustomSheetState(label, grid));
      }

      if (importedSheets.length === 0) {
        setUploadStatus({
          ok: false,
          msg:
            lang === 'gu'
              ? 'આ ફાઇલમાં કોઈ વાંચી શકાય તેવો ડેટા મળ્યો નથી.'
              : lang === 'hi'
              ? 'Is file mein koi readable data nahi mila.'
              : 'No readable rows found in that file.',
        });
        return;
      }

      const firstNewIdx = sheets.length;
      setSheets((prev) => [...prev, ...importedSheets]);
      setActiveSheetIdx(firstNewIdx);
      setSelectedCell({ r: 0, c: 0 });
      setEditingCell(null);
      setUploadStatus({
        ok: true,
        msg:
          lang === 'gu'
            ? `"${file.name}" (${importedSheets.length} શીટ) સફળતાપૂર્વક અપલોડ થઈ! હવે તમે સેલ્સ એડિટ કરી શકો છો.`
            : lang === 'hi'
            ? `"${file.name}" (${importedSheets.length} sheet) import ho gayi! Ab cells edit aur formulas test karo.`
            : `Imported "${file.name}" (${importedSheets.length} sheet${importedSheets.length > 1 ? 's' : ''})! Edit cells and test formulas live.`,
      });
    } catch {
      setUploadStatus({
        ok: false,
        msg:
          lang === 'gu'
            ? 'ફાઇલ વાંચવામાં ભૂલ આવી. કૃપા કરીને અન્ય .xlsx અથવા .csv ફાઇલ અજમાવો.'
            : lang === 'hi'
            ? 'File read karne mein error aaya. Koi aur .xlsx ya .csv file try karo.'
            : 'Could not parse that spreadsheet file. Please check the file format and retry.',
      });
    }
  };

  const handleImportPastedData = () => {
    const lines = pasteText
      .split(/\r?\n/)
      .map((l) => l.trimEnd())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setUploadStatus({
        ok: false,
        msg:
          lang === 'gu'
            ? 'પહેલા ડેટા પેસ્ટ કરો (દા.ત. CSV અથવા Excel માંથી કોપી કરેલ ટેબલ).'
            : lang === 'hi'
            ? 'Pehle CSV ya Excel table data paste karo.'
            : 'Please paste CSV or tab-separated spreadsheet data first.',
      });
      return;
    }

    const delimiter = lines.some((l) => l.includes('\t')) ? '\t' : ',';
    const grid = lines.slice(0, 100).map((l) => parseDelimitedLine(l, delimiter));
    const newSheet = buildCustomSheetState(pasteSheetName || 'Pasted_Sheet', grid);

    const nextIdx = sheets.length;
    setSheets((prev) => [...prev, newSheet]);
    setActiveSheetIdx(nextIdx);
    setSelectedCell({ r: 0, c: 0 });
    setEditingCell(null);
    setShowPasteModal(false);
    setPasteText('');
    setUploadStatus({
      ok: true,
      msg:
        lang === 'gu'
          ? `"${newSheet.tabLabel}" શીટ (${lines.length} હરોળ) ઉમેરાઈ ગઈ!`
          : lang === 'hi'
          ? `"${newSheet.tabLabel}" (${lines.length} rows) add ho gayi!`
          : `Added "${newSheet.tabLabel}" with ${lines.length} rows!`,
    });
  };

  const handleExportWorkbook = (format: 'xlsx' | 'csv') => {
    const aoa = sheet.rows.map((row) =>
      row.map((cell) => {
        const raw = cell.raw.trim();
        if (raw.startsWith('=')) return { f: raw.slice(1) };
        if (raw !== '' && !Number.isNaN(Number(raw))) return Number(raw);
        return cell.raw;
      })
    );
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheet.tabLabel.slice(0, 31));
    XLSX.writeFile(wb, `${sheet.tabLabel}.${format}`);
  };

  // Compute live selection column stats for the Excel bottom status bar
  const colNums = evaluated
    .slice(1)
    .map((row) => row[safeC])
    .filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
  const colSum = colNums.reduce((a, b) => a + b, 0);
  const colAvg = colNums.length ? Math.round((colSum / colNums.length) * 10) / 10 : 0;

  return (
    <div className="space-y-4">
      {/* Bring Your Own Excel / CSV Dropzone & Quick Import Bar */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingFile(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleExcelFile(f);
        }}
        className={`p-4 rounded-xl border transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
          isDraggingFile
            ? 'border-emerald-500 dark:border-[#00F59B] bg-emerald-50/70 dark:bg-[#151D19]'
            : 'border-slate-200 dark:border-[#222925] bg-white dark:bg-[#121614]'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-[#151D19] border border-emerald-200 dark:border-[#00E58F]/30 text-emerald-700 dark:text-[#00F59B] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'gu'
                ? 'તમારી પોતાની Excel / CSV શીટ અપલોડ કરો અને પ્રેક્ટિસ કરો'
                : lang === 'hi'
                ? 'Apni Khud Ki Excel / CSV Sheet Upload Karke Practice Karo'
                : 'Upload or Paste Your Own Excel / CSV Sheet to Practice'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8A968F]">
              {lang === 'gu'
                ? '.xlsx, .xls, અથવા .csv ફાઇલ અહીં ડ્રોપ કરો અથવા Excel/Sheets માંથી કોપી કરીને પેસ્ટ કરો — ફોર્મ્યુલા સાચવીને લાઇવ ચાલશે.'
                : lang === 'hi'
                ? '.xlsx, .xls ya .csv file drop karo ya Excel/Google Sheets se copy-paste karo — aapke formulas live chalenge.'
                : 'Drop a .xlsx, .xls, or .csv file here or paste rows from Excel/Google Sheets — your formulas stay live.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.tsv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleExcelFile(f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            {lang === 'gu' ? '.xlsx / .csv અપલોડ કરો' : lang === 'hi' ? 'Upload .xlsx / .csv' : 'Upload .xlsx / .csv'}
          </button>

          <button
            type="button"
            onClick={() => setShowPasteModal(true)}
            className="min-h-[40px] px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-100 hover:bg-slate-200 dark:bg-[#171C19] dark:hover:bg-[#1E2521] text-slate-800 dark:text-[#D5DDD8] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-emerald-700 dark:text-[#00F59B]" />
            {lang === 'gu' ? 'ડેટા પેસ્ટ કરો' : lang === 'hi' ? 'Paste Data' : 'Paste Sheet Data'}
          </button>

          <button
            type="button"
            onClick={handleCreateBlankCustomSheet}
            className="min-h-[40px] px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-white dark:bg-[#0D100F] hover:bg-slate-50 dark:hover:bg-[#171C19] text-slate-800 dark:text-[#D5DDD8] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <FilePlus2 className="w-3.5 h-3.5 text-emerald-700 dark:text-[#00F59B]" />
            {lang === 'gu' ? '+ નવી શીટ' : lang === 'hi' ? '+ New Sheet' : '+ New Sheet'}
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div
          className={`px-4 py-2.5 rounded-lg border text-xs font-medium flex items-center justify-between gap-3 ${
            uploadStatus.ok
              ? 'bg-emerald-50 dark:bg-[#151D19] border-emerald-200 dark:border-[#00E58F]/40 text-emerald-800 dark:text-[#00F59B]'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200'
          }`}
        >
          <span>{uploadStatus.msg}</span>
          <button
            type="button"
            onClick={() => setUploadStatus(null)}
            aria-label="Dismiss"
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Authentic Excel Workbook Window */}
      <div className="rounded-xl border border-slate-200 dark:border-[#222925] bg-white dark:bg-[#121614] overflow-hidden shadow-sm">
        {/* 1. Excel Title Ribbon */}
        <div className="px-4 py-2.5 bg-emerald-800 dark:bg-[#0D100F] border-b border-emerald-900/20 dark:border-[#222925] text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono font-semibold text-xs sm:text-sm truncate dark:text-[#00F59B]">
              TechStart_Workbook.xlsx — <span className="font-sans text-white">{pickText(sheet.title, lang)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleExportWorkbook('xlsx')}
              className="min-h-[36px] px-3 py-1 rounded-lg bg-emerald-900/80 hover:bg-emerald-900 dark:bg-[#171C19] dark:hover:bg-[#1E2521] border border-emerald-600/60 dark:border-[#2A332E] text-white dark:text-[#D5DDD8] text-xs font-mono font-medium inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              .xlsx
            </button>
            <button
              type="button"
              onClick={() => onCompleteSheet(sheet.id)}
              className={`min-h-[36px] px-3.5 py-1 rounded-lg text-xs font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                isDone
                  ? 'bg-emerald-600 dark:bg-[#151D19] dark:border dark:border-[#00E58F]/50 text-white dark:text-[#00F59B]'
                  : 'bg-white text-emerald-900 hover:bg-emerald-50 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] dark:text-[#05130D]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {isDone
                ? lang === 'gu'
                  ? 'શીટ પૂર્ણ થઈ'
                  : lang === 'hi'
                  ? 'Sheet Complete'
                  : 'Sheet Completed'
                : lang === 'gu'
                ? 'પ્રેક્ટિસ પૂર્ણ (+25 XP)'
                : lang === 'hi'
                ? 'Practice Complete (+25 XP)'
                : 'Mark Practice Done (+25 XP)'}
            </button>
          </div>
        </div>

        {/* 2. Excel Ribbon Quick Tools (Formatting + Formula Shortcuts) */}
        <div className="px-3 py-2 bg-slate-100 dark:bg-[#121614] border-b border-slate-200 dark:border-[#222925] flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => toggleFormat('bold')}
            title="Toggle Bold"
            className={`min-h-[34px] min-w-[34px] px-2.5 rounded-md border font-bold cursor-pointer ${
              activeCellObj.bold
                ? 'bg-emerald-700 dark:bg-[#00F59B] text-white dark:text-[#05130D] border-emerald-700 dark:border-[#00F59B]'
                : 'bg-white dark:bg-[#0D100F] border-slate-300 dark:border-[#2A332E] text-slate-800 dark:text-[#D5DDD8]'
            }`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('currency')}
            title="Toggle Rupee ₹ Format"
            className={`min-h-[34px] min-w-[34px] px-2.5 rounded-md border font-semibold cursor-pointer ${
              activeCellObj.currency
                ? 'bg-emerald-700 dark:bg-[#00F59B] text-white dark:text-[#05130D] border-emerald-700 dark:border-[#00F59B]'
                : 'bg-white dark:bg-[#0D100F] border-slate-300 dark:border-[#2A332E] text-slate-800 dark:text-[#D5DDD8]'
            }`}
          >
            ₹
          </button>

          <span className="h-5 w-px bg-slate-300 dark:bg-[#222925] mx-1" aria-hidden="true" />

          <span className="text-[11px] font-mono text-slate-500 dark:text-[#6F7A74] mr-1 hidden sm:inline">
            {lang === 'gu' ? 'ફોર્મ્યુલા ઉમેરો:' : lang === 'hi' ? 'Formula Daalo:' : 'Insert Formula:'}
          </span>
          {['SUM', 'AVERAGE', 'IF', 'MAX', 'MIN', 'COUNT', 'VLOOKUP'].map((fn) => (
            <button
              key={fn}
              type="button"
              onClick={() => insertFormulaStarter(fn)}
              className="min-h-[34px] px-2.5 py-1 rounded-md bg-white dark:bg-[#0D100F] border border-slate-300 dark:border-[#2A332E] hover:border-emerald-600 dark:hover:border-[#00F59B] text-slate-800 dark:text-[#D5DDD8] font-mono text-[11px] font-semibold cursor-pointer"
            >
              ={fn}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAddRow}
              className="min-h-[34px] px-2.5 py-1 rounded-md bg-white dark:bg-[#0D100F] border border-slate-300 dark:border-[#2A332E] hover:border-emerald-600 dark:hover:border-[#00E58F]/50 text-slate-700 dark:text-[#D5DDD8] inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {lang === 'gu' ? 'હરોળ' : 'Row'}
            </button>
            <button
              type="button"
              onClick={handleAddColumn}
              className="min-h-[34px] px-2.5 py-1 rounded-md bg-white dark:bg-[#0D100F] border border-slate-300 dark:border-[#2A332E] hover:border-emerald-600 dark:hover:border-[#00E58F]/50 text-slate-700 dark:text-[#D5DDD8] inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {lang === 'gu' ? 'કોલમ' : 'Col'}
            </button>
            <button
              type="button"
              onClick={handleResetSheet}
              className="min-h-[34px] px-2.5 py-1 rounded-md bg-white dark:bg-[#0D100F] border border-slate-300 dark:border-[#2A332E] hover:border-emerald-600 dark:hover:border-[#00E58F]/50 text-slate-700 dark:text-[#D5DDD8] inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {lang === 'gu' ? 'રીસેટ' : 'Reset'}
            </button>
          </div>
        </div>

        {/* 3. Authentic Name Box + fx Formula Bar */}
        <div className="px-3 py-2 bg-white dark:bg-[#090C0B] border-b border-slate-200 dark:border-[#222925] flex items-center gap-2">
          <div
            aria-label="Active cell reference"
            className="w-16 min-h-[36px] px-2.5 rounded-md border border-slate-300 dark:border-[#222925] bg-slate-50 dark:bg-[#121614] flex items-center justify-center font-mono text-xs font-bold text-slate-900 dark:text-[#00F59B] shrink-0 tabular-nums"
          >
            {activeCoord}
          </div>
          <div className="text-sm font-serif italic font-bold text-emerald-700 dark:text-[#00F59B] px-1.5 select-none">
            fx
          </div>
          <input
            type="text"
            aria-label="Formula bar"
            value={
              editingCell && editingCell.r === safeR && editingCell.c === safeC
                ? draftValue
                : activeCellObj.raw
            }
            onFocus={() => {
              if (!editingCell || editingCell.r !== safeR || editingCell.c !== safeC) {
                setEditingCell({ r: safeR, c: safeC });
                setDraftValue(activeCellObj.raw);
              }
            }}
            onChange={(e) => {
              const val = e.target.value;
              setEditingCell({ r: safeR, c: safeC });
              setDraftValue(val);
              commitCellEdit(safeR, safeC, val);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setEditingCell(null);
                setSelectedCell((prev) => ({ r: Math.min(sheet.rows.length - 1, prev.r + 1), c: prev.c }));
              }
            }}
            placeholder={
              lang === 'gu'
                ? 'નંબર, ટેક્સ્ટ અથવા =SUM(B2:D2) લખો...'
                : lang === 'hi'
                ? 'Number, text ya =SUM(B2:D2) likho...'
                : 'Type a number, text, or =SUM(B2:D2)...'
            }
            className="flex-1 min-h-[36px] px-3 py-1 rounded-md border border-slate-200 dark:border-[#222925] bg-slate-50 dark:bg-[#121614] font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-[#00F59B]"
          />
        </div>

        {/* 4. Spreadsheet Grid with Dynamic Column Letters (A–Z) & Row Numbers (1–N) */}
        <div className="overflow-auto max-h-[460px] bg-slate-50 dark:bg-[#090C0B]">
          <table className="w-full border-collapse text-xs sm:text-sm tabular-nums min-w-[660px]">
            <thead className="sticky top-0 z-20">
              <tr>
                <th className="w-11 bg-slate-200 dark:bg-[#121614] border border-slate-300 dark:border-[#222925] p-1.5 text-center text-[11px] font-semibold text-slate-500 dark:text-[#6F7A74] select-none">
                  ◢
                </th>
                {colHeaders.map((col, cIdx) => (
                  <th
                    key={col}
                    className={`border border-slate-300 dark:border-[#222925] py-1.5 px-2 text-center font-mono text-xs font-semibold select-none ${
                      safeC === cIdx
                        ? 'bg-emerald-100 dark:bg-[#151D19] text-emerald-800 dark:text-[#00F59B]'
                        : 'bg-slate-200/90 dark:bg-[#121614] text-slate-700 dark:text-[#8A968F]'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheet.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td
                    className={`border border-slate-300 dark:border-[#222925] px-2 py-1 text-center font-mono text-xs font-semibold select-none ${
                      safeR === rIdx
                        ? 'bg-emerald-100 dark:bg-[#151D19] text-emerald-800 dark:text-[#00F59B]'
                        : 'bg-slate-200/80 dark:bg-[#121614] text-slate-600 dark:text-[#8A968F]'
                    }`}
                  >
                    {rIdx + 1}
                  </td>

                  {colHeaders.map((_col, cIdx) => {
                    const cell = row[cIdx] || { raw: '' };
                    const isSelected = safeR === rIdx && safeC === cIdx;
                    const isEditing = editingCell?.r === rIdx && editingCell?.c === cIdx;
                    const val = evaluated[rIdx]?.[cIdx] ?? '';
                    const isFormula = cell.raw.trim().startsWith('=');
                    const isError = typeof val === 'string' && val.startsWith('#');
                    const isNumeric = typeof val === 'number';

                    let displayText = String(val);
                    if (cell.currency && isNumeric) {
                      displayText = `₹${val.toLocaleString('en-IN')}`;
                    }

                    return (
                      <td
                        key={cIdx}
                        onClick={() => {
                          if (isSelected && !isEditing) {
                            startCellEdit(rIdx, cIdx);
                          } else {
                            setSelectedCell({ r: rIdx, c: cIdx });
                            setEditingCell(null);
                          }
                        }}
                        onDoubleClick={() => startCellEdit(rIdx, cIdx)}
                        className={`relative border border-slate-200 dark:border-[#222925] p-0 h-10 min-w-[100px] bg-white dark:bg-[#0D100F] cursor-cell ${
                          rIdx === 0 ? 'bg-slate-100/90 dark:bg-[#121614]' : ''
                        } ${isSelected ? 'outline-2 -outline-offset-2 outline-emerald-600 dark:outline-[#00F59B] z-10' : ''}`}
                      >
                        {isEditing ? (
                          <input
                            autoFocus
                            type="text"
                            value={draftValue}
                            onChange={(e) => {
                              setDraftValue(e.target.value);
                              commitCellEdit(rIdx, cIdx, e.target.value);
                            }}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setEditingCell(null);
                                setSelectedCell({ r: Math.min(sheet.rows.length - 1, rIdx + 1), c: cIdx });
                              } else if (e.key === 'Tab') {
                                e.preventDefault();
                                setEditingCell(null);
                                setSelectedCell({ r: rIdx, c: (cIdx + 1) % colCount });
                              } else if (e.key === 'Escape') {
                                setEditingCell(null);
                              }
                            }}
                            className="w-full h-full px-2.5 bg-white dark:bg-[#090C0B] font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                          />
                        ) : (
                          <div
                            className={`w-full h-full px-2.5 flex items-center ${
                              isNumeric ? 'justify-end font-mono' : 'justify-start'
                            } ${cell.bold || rIdx === 0 ? 'font-semibold' : ''} ${
                              isError
                                ? 'text-rose-600 dark:text-rose-400 font-mono'
                                : isFormula
                                ? 'text-emerald-700 dark:text-[#00F59B]'
                                : displayText === 'Pass' || displayText === 'Within' || displayText === 'Hit' || displayText === 'Healthy'
                                ? 'text-emerald-700 dark:text-[#00F59B] font-semibold'
                                : displayText === 'Needs Help' || displayText === 'Over' || displayText === 'Cut Cost'
                                ? 'text-rose-700 dark:text-rose-400 font-semibold'
                                : 'text-slate-900 dark:text-[#E5ECE8]'
                            }`}
                          >
                            <span className="truncate">{displayText}</span>
                          </div>
                        )}

                        {isSelected && !isEditing && (
                          <span
                            aria-hidden="true"
                            className="w-2 h-2 bg-emerald-600 dark:bg-[#00F59B] absolute -bottom-0.5 -right-0.5 pointer-events-none"
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Bottom Excel Sheet Tabs + Live Calculation Status Bar */}
        <div className="px-3 py-2 bg-slate-100 dark:bg-[#0D100F] border-t border-slate-200 dark:border-[#222925] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1">
            {sheets.map((s, idx) => (
              <div key={s.id} className="inline-flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSheetIdx(idx);
                    setEditingCell(null);
                    setSelectedCell({ r: 0, c: 0 });
                  }}
                  className={`min-h-[34px] px-3 py-1 ${
                    s.isCustom ? 'rounded-tl-md pr-2' : 'rounded-t-md'
                  } text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                    safeSheetIdx === idx
                      ? 'bg-white dark:bg-[#151D19] text-emerald-700 dark:text-[#00F59B] border-slate-300 dark:border-[#00E58F]/50 shadow-sm'
                      : 'bg-slate-200/70 dark:bg-[#121614] text-slate-600 dark:text-[#8A968F] border-transparent hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {s.tabLabel}
                </button>
                {s.isCustom && (
                  <button
                    type="button"
                    aria-label={`Remove ${s.tabLabel}`}
                    onClick={() => handleDeleteCustomSheet(idx)}
                    className="min-h-[34px] px-1.5 rounded-tr-md bg-slate-200/70 dark:bg-[#121614] hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="text-[11px] font-mono text-slate-600 dark:text-[#8A968F] tabular-nums flex flex-wrap items-center gap-3">
            <span>
              Col {colHeaders[safeC]} // Count: <strong className="dark:text-white">{colNums.length}</strong>
            </span>
            <span>
              Sum: <strong className="dark:text-[#00F59B]">{Math.round(colSum * 100) / 100}</strong>
            </span>
            <span>
              Avg: <strong className="dark:text-white">{colAvg}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Supported Formulas & Guided Practice Instructions */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] border-l-[3px] border-l-emerald-600 dark:border-l-[#00F59B] space-y-2.5">
        <p className="text-xs sm:text-sm text-slate-700 dark:text-[#D5DDD8]">{pickText(sheet.explanation, lang)}</p>
        <div className="pt-2 border-t border-slate-100 dark:border-[#222925] space-y-1">
          <div className="text-xs font-mono font-semibold text-emerald-700 dark:text-[#00F59B]">
            {lang === 'gu'
              ? 'આ રિયલ Excel ટાસ્ક અજમાવો:'
              : lang === 'hi'
              ? 'Ye Real Excel Tasks Try Karo:'
              : 'Try These Real Excel Tasks:'}
          </div>
          {sheet.guidedTasks.map((task, idx) => (
            <p key={idx} className="text-xs sm:text-sm text-slate-800 dark:text-[#D5DDD8]">
              {pickText(task, lang)}
            </p>
          ))}
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-[#222925] text-[11px] font-mono text-slate-500 dark:text-[#6F7A74]">
          {lang === 'gu'
            ? 'સપોર્ટેડ ફોર્મ્યુલા:'
            : lang === 'hi'
            ? 'Supported Formulas:'
            : 'Supported Formulas:'}{' '}
          SUM, AVERAGE, IF, MAX, MIN, COUNT, COUNTA, COUNTIF, ROUND, VLOOKUP, LEN, UPPER, LOWER, TRIM
        </div>
      </div>

      {/* Paste Sheet Data Modal */}
      {showPasteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="paste-sheet-modal-title"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-lg w-full rounded-xl bg-white dark:bg-[#121614] border border-slate-200 dark:border-[#222925] p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="paste-sheet-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'gu'
                    ? 'Excel / CSV ડેટા પેસ્ટ કરો'
                    : lang === 'hi'
                    ? 'Excel / CSV Data Paste Karo'
                    : 'Paste Excel or CSV Data'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#8A968F] mt-0.5">
                  {lang === 'gu'
                    ? 'Excel કે Google Sheets માંથી કોપી કરીને અહીં પેસ્ટ કરો (અથવા CSV લાઇન્સ લખો).'
                    : lang === 'hi'
                    ? 'Excel ya Google Sheets se rows copy karke yahan paste karo (ya CSV lines likho).'
                    : 'Copy cells directly from Excel or Google Sheets and paste below, or paste CSV text.'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowPasteModal(false)}
                className="min-h-[36px] min-w-[36px] rounded-lg flex items-center justify-center text-slate-500 dark:text-[#8A968F] hover:bg-slate-100 dark:hover:bg-[#171C19] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-[#D5DDD8] mb-1">
                {lang === 'gu' ? 'શીટ ટેબ નામ' : lang === 'hi' ? 'Sheet Tab Naam' : 'Sheet Tab Name'}
              </label>
              <input
                type="text"
                value={pasteSheetName}
                maxLength={22}
                onChange={(e) => setPasteSheetName(e.target.value)}
                className="w-full min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#222925] bg-slate-50 dark:bg-[#0D100F] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-[#00F59B]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-[#D5DDD8] mb-1">
                {lang === 'gu' ? 'ડેટા (Tab અથવા Comma થી અલગ કરેલ)' : lang === 'hi' ? 'Data (Tab ya Comma separated)' : 'Spreadsheet Rows'}
              </label>
              <textarea
                rows={7}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={'Product,Jan,Feb,Total\nLaptop,42000,45000,=SUM(B2:C2)\nTablet,18000,21000,=SUM(B3:C3)'}
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-[#222925] bg-slate-50 dark:bg-[#090C0B] font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-[#00F59B]"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="min-h-[40px] px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A332E] bg-slate-100 dark:bg-[#171C19] text-xs font-medium text-slate-700 dark:text-[#D5DDD8] cursor-pointer"
              >
                {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleImportPastedData}
                className="min-h-[40px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00F59B] dark:hover:bg-[#00E08C] text-white dark:text-[#05130D] text-xs font-mono font-bold cursor-pointer"
              >
                {lang === 'gu' ? 'શીટ બનાવો' : lang === 'hi' ? 'Sheet Load Karo' : 'Load into Grid'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
