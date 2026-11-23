import React, { useMemo, useState } from 'react';
import { Check, Plus, RotateCcw } from 'lucide-react';
import { Language } from '../types';

interface CellData {
  raw: string;
  bold?: boolean;
  currency?: boolean;
}

interface SheetState {
  id: string;
  tabLabel: string;
  title: { en: string; hi: string };
  explanation: { en: string; hi: string };
  guidedTasks: { en: string; hi: string }[];
  rows: CellData[][];
}

interface ExcelLabProps {
  lang: Language;
  completedIds: string[];
  onCompleteSheet: (sheetId: string) => void;
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];

function makeInitialSheets(): SheetState[] {
  return [
    {
      id: 'excel-marks-sheet',
      tabLabel: 'Marks_Sheet',
      title: {
        en: 'Student Marks Sheet (SUM, AVERAGE, IF)',
        hi: 'Student Marks Sheet (SUM, AVERAGE, IF)',
      },
      explanation: {
        en: 'Click any cell (like E2 or F2) to inspect its real formula in the fx bar. Change marks in columns B–D or type your own =SUM / =IF formula!',
        hi: 'Kisi bhi cell (jaise E2 ya F2) par click kar ke upar fx Formula Bar mein asli formula dekhein. Columns B–D ke marks badlein aur result turant update hote dekhein!',
      },
      guidedTasks: [
        {
          en: '1. Click cell E2 to see =SUM(B2:D2), then change Math mark in B4 from 31 to 65 so Rohan passes.',
          hi: '1. Cell E2 par click kar ke =SUM(B2:D2) dekhein, phir B4 mein 31 ko 65 banayein taaki F4 "Pass" ho jaye.',
        },
        {
          en: '2. Click cell B6 and edit it to =MAX(B2:B5) to find the highest Math score.',
          hi: '2. Cell B6 par click karein aur =MAX(B2:B5) likh kar Math ka highest score nikalein.',
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
      },
      explanation: {
        en: 'Practice subtraction (=B2-C2) and budget warning rules (=IF(E2>=0, "Within", "Over")). Toggle ₹ Currency format from the toolbar.',
        hi: 'Subtraction (=B2-C2) aur budget alerts (=IF(E2>=0, "Within", "Over")) practice karein. Toolbar se ₹ Currency button try karein.',
      },
      guidedTasks: [
        {
          en: '1. Lower Food & Tiffin Spent in cell C3 from 3650 to 2900 and watch E3 and F3 flip to savings!',
          hi: '1. Cell C3 (Food Spent) ko 3650 se 2900 karein aur E3/F3 ko "Within" bante dekhein!',
        },
        {
          en: '2. Click C6 to verify total monthly spending with =SUM(C2:C5).',
          hi: '2. Total monthly spending check karne ke liye C6 mein =SUM(C2:C5) formula dekhein.',
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
      },
      explanation: {
        en: 'Multiply Units * Price (=B2*C2) and find peak revenue day using =MAX(E2:E5). Useful for shopkeeper, billing, and MIS Analyst roles.',
        hi: 'Units * Price (=B2*C2) aur peak sales day (=MAX(E2:E5)) nikalein — MIS Analyst aur billing jobs ke liye zaroori skill.',
      },
      guidedTasks: [
        {
          en: '1. Change Thursday Units Sold in B5 to 45 and see Total Revenue in E6 update instantly.',
          hi: '1. Thursday Units Sold (B5) ko 45 karein aur E6 mein Total Revenue badalte dekhein.',
        },
        {
          en: '2. Click cell F6 to inspect =MAX(E2:E5) finding the best single-day revenue.',
          hi: '2. Cell F6 par click kar ke =MAX(E2:E5) se sabse zyada kamai wala din dekhein.',
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
      },
      explanation: {
        en: 'Build your own table from scratch! Type numbers in A1–D5 and practice formulas like =SUM(A2:C2), =AVERAGE(B2:B4), or =IF(D2>100, "High", "Low").',
        hi: 'Yahan apni khud ki Excel sheet banayein! Numbers type karein aur =SUM, =AVERAGE, =IF formulas test karein.',
      },
      guidedTasks: [
        {
          en: '1. Click B2, type 120, press Enter, type 80 in B3, then type =SUM(B2:B3) in B4.',
          hi: '1. B2 mein 120 likh kar Enter dabaye, B3 mein 80 likhein, aur B4 mein =SUM(B2:B3) test karein.',
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

function parseCellRef(ref: string): { r: number; c: number } | null {
  const m = ref.trim().toUpperCase().match(/^([A-F])(\d+)$/);
  if (!m) return null;
  const c = m[1].charCodeAt(0) - 65;
  const r = Number(m[2]) - 1;
  if (c < 0 || c >= COLS.length || r < 0) return null;
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

function evaluateSheet(rows: CellData[][]): (string | number)[][] {
  const visiting = new Set<string>();
  const memo = new Map<string, string | number>();

  const expandRangeValues = (rangeStr: string): (string | number)[] => {
    const parts = rangeStr.split(':').map((s) => s.trim());
    if (parts.length !== 2) return [evalExpr(rangeStr)];
    const start = parseCellRef(parts[0]);
    const end = parseCellRef(parts[1]);
    if (!start || !end) return [];
    const vals: (string | number)[] = [];
    for (let r = Math.min(start.r, end.r); r <= Math.max(start.r, end.r); r++) {
      for (let c = Math.min(start.c, end.c); c <= Math.max(start.c, end.c); c++) {
        if (r < rows.length && c < COLS.length) {
          vals.push(getCellVal(r, c));
        }
      }
    }
    return vals;
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
    // Replace cell references with their numeric values
    const replaced = expr.replace(/\b([A-Fa-f]\d+)\b/g, (full) => {
      const ref = parseCellRef(full);
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
      // Safe math-only recursive descent parser (no eval)
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
        return args[2] !== undefined ? evalExpr(args[2]) : false ? '' : 'FALSE';
      }
      return '#NAME?';
    }

    const singleRef = parseCellRef(expr);
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

export const ExcelLab: React.FC<ExcelLabProps> = ({ lang, completedIds, onCompleteSheet }) => {
  const [sheets, setSheets] = useState<SheetState[]>(() => makeInitialSheets());
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 1, c: 4 }); // Start on E2 so user immediately sees =SUM(B2:D2)
  const [editingCell, setEditingCell] = useState<{ r: number; c: number } | null>(null);
  const [draftValue, setDraftValue] = useState('');

  const sheet = sheets[activeSheetIdx];
  const evaluated = useMemo(() => evaluateSheet(sheet.rows), [sheet.rows]);

  const activeCellObj = sheet.rows[selectedCell.r]?.[selectedCell.c] || { raw: '' };
  const activeCoord = `${COLS[selectedCell.c]}${selectedCell.r + 1}`;
  const isDone = completedIds.includes(sheet.id);

  const commitCellEdit = (r: number, c: number, newRaw: string) => {
    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeSheetIdx) return s;
        const nextRows = s.rows.map((row, rIdx) =>
          rIdx === r ? row.map((cell, cIdx) => (cIdx === c ? { ...cell, raw: newRaw } : cell)) : row
        );
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
        if (idx !== activeSheetIdx) return s;
        const nextRows = s.rows.map((row, rIdx) =>
          rIdx === selectedCell.r
            ? row.map((cell, cIdx) => (cIdx === selectedCell.c ? { ...cell, [prop]: !cell[prop] } : cell))
            : row
        );
        return { ...s, rows: nextRows };
      })
    );
  };

  const insertFormulaStarter = (formulaName: string) => {
    const rNum = selectedCell.r + 1;
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
        : `=IF(E${rNum}>=150, "Pass", "Check")`;
    setEditingCell(selectedCell);
    setDraftValue(starter);
    commitCellEdit(selectedCell.r, selectedCell.c, starter);
  };

  const handleAddRow = () => {
    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeSheetIdx) return s;
        const newRow: CellData[] = COLS.map(() => ({ raw: '' }));
        return { ...s, rows: [...s.rows, newRow] };
      })
    );
  };

  const handleResetSheet = () => {
    const fresh = makeInitialSheets()[activeSheetIdx];
    setSheets((prev) => prev.map((s, idx) => (idx === activeSheetIdx ? fresh : s)));
    setEditingCell(null);
  };

  // Compute live selection column stats for the Excel bottom status bar
  const colNums = evaluated
    .slice(1)
    .map((row) => row[selectedCell.c])
    .filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
  const colSum = colNums.reduce((a, b) => a + b, 0);
  const colAvg = colNums.length ? Math.round((colSum / colNums.length) * 10) / 10 : 0;

  return (
    <div className="space-y-4">
      {/* Main Authentic Excel Workbook Window */}
      <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {/* 1. Excel Green-Teal Title Ribbon */}
        <div className="px-4 py-2.5 bg-emerald-800 dark:bg-emerald-950 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-semibold text-sm truncate">TechStart_Practice.xlsx — {sheet.title[lang]}</span>
          </div>
          <button
            type="button"
            onClick={() => onCompleteSheet(sheet.id)}
            className={`min-h-[36px] px-3.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              isDone ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            {isDone
              ? lang === 'en'
                ? 'Sheet Completed'
                : 'Sheet Completed'
              : lang === 'en'
              ? 'Mark Practice Done (+25 XP)'
              : 'Practice Complete (+25 XP)'}
          </button>
        </div>

        {/* 2. Excel Ribbon Quick Tools (Formatting + Formula Shortcuts) */}
        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => toggleFormat('bold')}
            title="Toggle Bold"
            className={`min-h-[34px] min-w-[34px] px-2.5 rounded border font-bold cursor-pointer ${
              activeCellObj.bold
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100'
            }`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('currency')}
            title="Toggle Rupee ₹ Format"
            className={`min-h-[34px] min-w-[34px] px-2.5 rounded border font-semibold cursor-pointer ${
              activeCellObj.currency
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100'
            }`}
          >
            ₹
          </button>

          <span className="h-5 w-px bg-slate-300 dark:bg-slate-600 mx-1" aria-hidden="true" />

          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
            {lang === 'en' ? 'Insert Formula:' : 'Formula Dalein:'}
          </span>
          {['SUM', 'AVERAGE', 'IF', 'MAX', 'MIN', 'COUNT'].map((fn) => (
            <button
              key={fn}
              type="button"
              onClick={() => insertFormulaStarter(fn)}
              className="min-h-[34px] px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 hover:border-emerald-600 text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold cursor-pointer"
            >
              ={fn}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAddRow}
              className="min-h-[34px] px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Row' : 'Row'}
            </button>
            <button
              type="button"
              onClick={handleResetSheet}
              className="min-h-[34px] px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Reset' : 'Reset'}
            </button>
          </div>
        </div>

        {/* 3. Authentic Name Box + fx Formula Bar */}
        <div className="px-3 py-2 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <div
            aria-label="Active cell reference"
            className="w-16 min-h-[36px] px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-mono text-xs font-bold text-slate-900 dark:text-slate-100 shrink-0 tabular-nums"
          >
            {activeCoord}
          </div>
          <div className="text-sm font-serif italic font-bold text-emerald-700 dark:text-emerald-400 px-1.5 select-none">
            fx
          </div>
          <input
            type="text"
            aria-label="Formula bar"
            value={
              editingCell && editingCell.r === selectedCell.r && editingCell.c === selectedCell.c
                ? draftValue
                : activeCellObj.raw
            }
            onFocus={() => {
              if (!editingCell || editingCell.r !== selectedCell.r || editingCell.c !== selectedCell.c) {
                setEditingCell(selectedCell);
                setDraftValue(activeCellObj.raw);
              }
            }}
            onChange={(e) => {
              const val = e.target.value;
              setEditingCell(selectedCell);
              setDraftValue(val);
              commitCellEdit(selectedCell.r, selectedCell.c, val);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setEditingCell(null);
                setSelectedCell((prev) => ({ r: Math.min(sheet.rows.length - 1, prev.r + 1), c: prev.c }));
              }
            }}
            placeholder={lang === 'en' ? 'Type a number, text, or =SUM(B2:D2)...' : 'Number, text ya =SUM(B2:D2) likhein...'}
            className="flex-1 min-h-[36px] px-3 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* 4. Spreadsheet Grid with Column Letters (A–F) & Row Numbers (1–N) */}
        <div className="overflow-x-auto bg-slate-50 dark:bg-slate-950">
          <table className="w-full border-collapse text-xs sm:text-sm tabular-nums min-w-[660px]">
            <thead>
              <tr>
                <th className="w-11 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1.5 text-center text-[11px] font-semibold text-slate-500 select-none">
                  ◢
                </th>
                {COLS.map((col, cIdx) => (
                  <th
                    key={col}
                    className={`border border-slate-300 dark:border-slate-700 py-1.5 px-2 text-center text-xs font-semibold select-none ${
                      selectedCell.c === cIdx
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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
                  {/* Row Header Number */}
                  <td
                    className={`border border-slate-300 dark:border-slate-700 px-2 py-1 text-center font-mono text-xs font-semibold select-none ${
                      selectedCell.r === rIdx
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {rIdx + 1}
                  </td>

                  {row.map((cell, cIdx) => {
                    const isSelected = selectedCell.r === rIdx && selectedCell.c === cIdx;
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
                        className={`relative border border-slate-200 dark:border-slate-800 p-0 h-10 min-w-[100px] bg-white dark:bg-slate-900 cursor-cell ${
                          rIdx === 0 ? 'bg-slate-100/90 dark:bg-slate-800/70' : ''
                        } ${isSelected ? 'outline-2 -outline-offset-2 outline-emerald-600 dark:outline-emerald-400 z-10' : ''}`}
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
                                setSelectedCell({ r: rIdx, c: (cIdx + 1) % COLS.length });
                              } else if (e.key === 'Escape') {
                                setEditingCell(null);
                              }
                            }}
                            className="w-full h-full px-2.5 bg-white dark:bg-slate-950 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                        ) : (
                          <div
                            className={`w-full h-full px-2.5 flex items-center ${
                              isNumeric ? 'justify-end font-mono' : 'justify-start'
                            } ${cell.bold || rIdx === 0 ? 'font-semibold' : ''} ${
                              isError
                                ? 'text-rose-600 dark:text-rose-400 font-mono'
                                : isFormula
                                ? 'text-teal-700 dark:text-teal-300'
                                : displayText === 'Pass' || displayText === 'Within' || displayText === 'Hit' || displayText === 'Healthy'
                                ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                                : displayText === 'Needs Help' || displayText === 'Over' || displayText === 'Cut Cost'
                                ? 'text-rose-700 dark:text-rose-400 font-semibold'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            <span className="truncate">{displayText}</span>
                          </div>
                        )}

                        {/* Classic Excel fill-handle corner dot on active cell */}
                        {isSelected && !isEditing && (
                          <span
                            aria-hidden="true"
                            className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 absolute -bottom-0.5 -right-0.5 pointer-events-none"
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
        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1">
            {sheets.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveSheetIdx(idx);
                  setEditingCell(null);
                  setSelectedCell({ r: 1, c: 4 });
                }}
                className={`min-h-[34px] px-3 py-1 rounded-t-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  activeSheetIdx === idx
                    ? 'bg-white dark:bg-slate-950 text-emerald-700 dark:text-emerald-400 border-slate-300 dark:border-slate-700 shadow-sm'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {s.tabLabel}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 tabular-nums flex flex-wrap items-center gap-3">
            <span>
              Col {COLS[selectedCell.c]} · Count: <strong>{colNums.length}</strong>
            </span>
            <span>
              Sum: <strong>{Math.round(colSum * 100) / 100}</strong>
            </span>
            <span>
              Avg: <strong>{colAvg}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Guided Practice Instructions Below Sheet */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">{sheet.explanation[lang]}</p>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            {lang === 'en' ? 'Try These Real Excel Tasks:' : 'Ye Real Excel Tasks Try Karein:'}
          </div>
          {sheet.guidedTasks.map((task, idx) => (
            <p key={idx} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              {task[lang]}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
