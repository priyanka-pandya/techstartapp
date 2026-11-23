// Upgraded offline-first Python 3 subset interpreter + Step-by-Step Execution Tracer
// Supports variables, expressions, control flow, functions (*args, recursion),
// OOP classes (__init__, self, inheritance, @property, __str__, __len__),
// and conversational Hinglish + English beginner-friendly error guidance.

export interface TraceStep {
  step: number;
  line: number;
  codeLine: string;
  variables: Record<string, string>;
  outputSoFar: string;
}

export interface PythonRunResult {
  stdout: string;
  trace?: TraceStep[];
  error?: {
    type: string;
    line?: number;
    rawMessage: string;
    friendlyEn: string;
    friendlyHi: string;
  };
}

class PythonRuntimeError extends Error {
  errorType: string;
  line?: number;
  friendlyEn: string;
  friendlyHi: string;

  constructor(
    errorType: string,
    rawMessage: string,
    friendlyEn: string,
    friendlyHi: string,
    line?: number
  ) {
    super(rawMessage);
    this.errorType = errorType;
    this.friendlyEn = friendlyEn;
    this.friendlyHi = friendlyHi;
    this.line = line;
  }
}

class BreakSignal {}
class ContinueSignal {}
class ReturnSignal {
  value: unknown;
  constructor(value: unknown) {
    this.value = value;
  }
}

type Env = Record<string, unknown>;

interface UserFunc {
  __pyFunc: true;
  params: string[];
  varargName?: string;
  defaults: (unknown | undefined)[];
  body: Stmt[];
  closure: Env;
  isProperty?: boolean;
}

interface PyClass {
  __pyClass: true;
  name: string;
  parent?: PyClass;
  methods: Record<string, UserFunc>;
}

interface PyInstance {
  __pyInstance: true;
  cls: PyClass;
  attrs: Record<string, unknown>;
}

interface Stmt {
  line: number;
  indent: number;
  text: string;
  decorators?: string[];
  children?: Stmt[];
}

function splitTopLevel(expr: string, sep: string): string[] {
  const parts: string[] = [];
  let current = '';
  let depthParen = 0;
  let depthBracket = 0;
  let depthBrace = 0;
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    const prev = i > 0 ? expr[i - 1] : '';
    if (ch === "'" && !inDouble && prev !== '\\') inSingle = !inSingle;
    else if (ch === '"' && !inSingle && prev !== '\\') inDouble = !inDouble;
    else if (!inSingle && !inDouble) {
      if (ch === '(') depthParen++;
      else if (ch === ')') depthParen--;
      else if (ch === '[') depthBracket++;
      else if (ch === ']') depthBracket--;
      else if (ch === '{') depthBrace++;
      else if (ch === '}') depthBrace--;

      if (
        depthParen === 0 &&
        depthBracket === 0 &&
        depthBrace === 0 &&
        expr.slice(i, i + sep.length) === sep
      ) {
        parts.push(current.trim());
        current = '';
        i += sep.length - 1;
        continue;
      }
    }
    current += ch;
  }
  if (current.trim() !== '' || parts.length > 0) {
    parts.push(current.trim());
  }
  return parts;
}

function stripInlineComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const prev = i > 0 ? line[i - 1] : '';
    if (ch === "'" && !inDouble && prev !== '\\') inSingle = !inSingle;
    else if (ch === '"' && !inSingle && prev !== '\\') inDouble = !inDouble;
    else if (ch === '#' && !inSingle && !inDouble) {
      return line.slice(0, i).trimEnd();
    }
  }
  return line.trimEnd();
}

function checkBalancedBrackets(code: string) {
  const lines = code.split('\n');
  const stack: { ch: string; line: number }[] = [];
  const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
  const closeToOpen: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

  for (let l = 0; l < lines.length; l++) {
    const line = stripInlineComment(lines[l]);
    let inSingle = false;
    let inDouble = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const prev = i > 0 ? line[i - 1] : '';
      if (ch === "'" && !inDouble && prev !== '\\') inSingle = !inSingle;
      else if (ch === '"' && !inSingle && prev !== '\\') inDouble = !inDouble;
      else if (!inSingle && !inDouble) {
        if (pairs[ch]) stack.push({ ch, line: l + 1 });
        else if (closeToOpen[ch]) {
          const last = stack.pop();
          if (!last || last.ch !== closeToOpen[ch]) {
            throw new PythonRuntimeError(
              'SyntaxError',
              `Unexpected '${ch}' on line ${l + 1}`,
              `Check line ${l + 1}: you have an extra or mismatched '${ch}' bracket.`,
              `Line ${l + 1} check karo: yahan '${ch}' bracket extra ya galat laga hai.`,
              l + 1
            );
          }
        }
      }
    }
    if (inSingle || inDouble) {
      throw new PythonRuntimeError(
        'SyntaxError',
        `Unterminated string literal on line ${l + 1}`,
        `On line ${l + 1}, you opened a quote (" or ') for text but forgot to close it.`,
        `Line ${l + 1} par aapne text ke liye quote (" ya ') start kiya par end mein close karna bhool gaye.`,
        l + 1
      );
    }
  }
  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    throw new PythonRuntimeError(
      'SyntaxError',
      `Missing closing '${pairs[unclosed.ch]}' for '${unclosed.ch}' opened on line ${unclosed.line}`,
      `You opened '${unclosed.ch}' on line ${unclosed.line}, so Python expects a closing '${pairs[unclosed.ch]}'.`,
      `Line ${unclosed.line} par '${unclosed.ch}' open hua hai, usko close karne ke liye '${pairs[unclosed.ch]}' lagao.`,
      unclosed.line
    );
  }
}

function parseStatements(code: string): Stmt[] {
  const rawLines = code.split('\n');
  const flat: Stmt[] = [];
  let pendingDecorators: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const cleaned = stripInlineComment(rawLines[i]);
    if (!cleaned.trim()) continue;
    const indent = cleaned.length - cleaned.trimStart().length;
    const trimmed = cleaned.trim();
    if (trimmed.startsWith('@')) {
      pendingDecorators.push(trimmed);
      continue;
    }
    flat.push({
      line: i + 1,
      indent,
      text: trimmed,
      decorators: pendingDecorators.length ? pendingDecorators : undefined,
    });
    pendingDecorators = [];
  }

  function buildBlock(startIdx: number, expectedIndent: number): { stmts: Stmt[]; nextIdx: number } {
    const stmts: Stmt[] = [];
    let idx = startIdx;
    while (idx < flat.length) {
      const curr = flat[idx];
      if (curr.indent < expectedIndent) break;
      if (curr.indent > expectedIndent) {
        throw new PythonRuntimeError(
          'IndentationError',
          `Unexpected indent on line ${curr.line}`,
          `Line ${curr.line} has extra spaces at the start. Align it cleanly with the lines above.`,
          `Line ${curr.line} ke start mein extra spaces hain. Upar wali lines ke barabar align karo.`,
          curr.line
        );
      }

      const needsBlock = /^(if|elif|else|for|while|def|class|try|except|finally)\b/.test(curr.text);
      if (needsBlock && !curr.text.endsWith(':')) {
        throw new PythonRuntimeError(
          'SyntaxError',
          `Missing ':' at the end of line ${curr.line}`,
          `In Python, '${curr.text.split(' ')[0]}' statements must end with a colon ':' on line ${curr.line}.`,
          `Python mein '${curr.text.split(' ')[0]}' line ke end mein colon ':' lagana zaroori hota hai (line ${curr.line}).`,
          curr.line
        );
      }

      if (curr.text.endsWith(':') && needsBlock) {
        idx++;
        if (idx >= flat.length || flat[idx].indent <= curr.indent) {
          throw new PythonRuntimeError(
            'IndentationError',
            `Expected an indented block after line ${curr.line}`,
            `After ':' on line ${curr.line}, the next line must be indented (4 spaces to the right).`,
            `Line ${curr.line} par ':' ke baad agli line ko 4 spaces andar (indent) likho.`,
            curr.line
          );
        }
        const sub = buildBlock(idx, flat[idx].indent);
        curr.children = sub.stmts;
        stmts.push(curr);
        idx = sub.nextIdx;
      } else {
        stmts.push(curr);
        idx++;
      }
    }
    return { stmts, nextIdx: idx };
  }

  if (flat.length === 0) return [];
  if (flat[0].indent !== 0) {
    throw new PythonRuntimeError(
      'IndentationError',
      `Unexpected indent on line ${flat[0].line}`,
      `The first line of code should start at the left edge without extra spaces.`,
      `Code ki first line bina kisi starting space ke left side se start honi chahiye.`,
      flat[0].line
    );
  }
  return buildBlock(0, 0).stmts;
}

function formatPyValue(val: unknown): string {
  if (val === null || val === undefined) return 'None';
  if (typeof val === 'boolean') return val ? 'True' : 'False';
  if (Array.isArray(val)) {
    return `[${val.map((v) => (typeof v === 'string' ? `'${v}'` : formatPyValue(v))).join(', ')}]`;
  }
  if (val instanceof Set) {
    if (val.size === 0) return 'set()';
    return `{${Array.from(val).map((v) => (typeof v === 'string' ? `'${v}'` : formatPyValue(v))).join(', ')}}`;
  }
  if (val && typeof val === 'object' && (val as PyInstance).__pyInstance) {
    const inst = val as PyInstance;
    return `<${inst.cls.name} object>`;
  }
  if (val && typeof val === 'object' && (val as PyClass).__pyClass) {
    return `<class '${(val as PyClass).name}'>`;
  }
  if (val && typeof val === 'object' && (val as UserFunc).__pyFunc) {
    return `<function>`;
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val as Record<string, unknown>).map(
      ([k, v]) => `'${k}': ${typeof v === 'string' ? `'${v}'` : formatPyValue(v)}`
    );
    return `{${entries.join(', ')}}`;
  }
  return String(val);
}

function isTruthy(val: unknown): boolean {
  if (val === false || val === null || val === undefined || val === 0 || val === '') return false;
  if (Array.isArray(val)) return val.length > 0;
  if (val instanceof Set) return val.size > 0;
  if (val && typeof val === 'object' && (val as PyInstance).__pyInstance) return true;
  if (typeof val === 'object') return Object.keys(val as object).length > 0;
  return Boolean(val);
}

export function runPythonCode(code: string, stdinText = '', collectTrace = false): PythonRunResult {
  const outputs: string[] = [];
  const trace: TraceStep[] = [];
  const inputLines = stdinText.split('\n');
  let inputIdx = 0;
  let stepCount = 0;
  const MAX_STEPS = 12000;

  try {
    checkBalancedBrackets(code);
    const ast = parseStatements(code);
    const globalEnv: Env = {};

    function snapshotVars(env: Env): Record<string, string> {
      const snap: Record<string, string> = {};
      const merged = { ...globalEnv, ...env };
      for (const [k, v] of Object.entries(merged)) {
        if (k.startsWith('__')) continue;
        if (v && typeof v === 'object' && ((v as UserFunc).__pyFunc || (v as PyClass).__pyClass)) continue;
        if (typeof v === 'function') continue;
        if (v && typeof v === 'object' && (v as PyInstance).__pyInstance) {
          const inst = v as PyInstance;
          const attrStr = Object.entries(inst.attrs)
            .map(([ak, av]) => `${ak}=${formatPyValue(av)}`)
            .join(', ');
          snap[k] = `${inst.cls.name}(${attrStr})`;
        } else {
          snap[k] = formatPyValue(v);
        }
      }
      return snap;
    }

    function findMethodOnClass(cls: PyClass | undefined, methodName: string): UserFunc | undefined {
      let curr = cls;
      while (curr) {
        if (methodName in curr.methods) return curr.methods[methodName];
        curr = curr.parent;
      }
      return undefined;
    }

    function callUserFunc(uf: UserFunc, args: unknown[], line: number): unknown {
      const localEnv: Env = { ...uf.closure };
      let argIdx = 0;
      for (let i = 0; i < uf.params.length; i++) {
        if (argIdx < args.length) {
          localEnv[uf.params[i]] = args[argIdx++];
        } else if (uf.defaults[i] !== undefined) {
          localEnv[uf.params[i]] = uf.defaults[i];
        } else {
          throw new PythonRuntimeError(
            'TypeError',
            `Missing required argument '${uf.params[i]}'`,
            `Your function needs at least ${uf.params.length} argument(s), but received ${args.length}.`,
            `Function ko ${uf.params.length} inputs chahiye the, par ${args.length} hi mile.`,
            line
          );
        }
      }
      if (uf.varargName) {
        localEnv[uf.varargName] = args.slice(argIdx);
      }
      try {
        execBlock(uf.body, localEnv);
      } catch (sig) {
        if (sig instanceof ReturnSignal) return sig.value;
        throw sig;
      }
      return null;
    }

    function formatValueWithDunder(val: unknown, line: number): string {
      if (val && typeof val === 'object' && (val as PyInstance).__pyInstance) {
        const inst = val as PyInstance;
        const strFn = findMethodOnClass(inst.cls, '__str__');
        if (strFn) {
          return String(callUserFunc(strFn, [inst], line));
        }
      }
      return formatPyValue(val);
    }

    function evalFString(rawContent: string, env: Env, line: number): string {
      return rawContent.replace(/\{([^}]+)\}/g, (_, inner) => {
        const val = evalExpr(inner.trim(), env, line);
        return formatValueWithDunder(val, line);
      });
    }

    function callCallable(fn: unknown, args: unknown[], line: number): unknown {
      if (typeof fn === 'function') {
        return fn(...args);
      }
      if (fn && typeof fn === 'object' && (fn as PyClass).__pyClass) {
        const cls = fn as PyClass;
        const inst: PyInstance = { __pyInstance: true, cls, attrs: {} };
        const initMethod = findMethodOnClass(cls, '__init__');
        if (initMethod) {
          callUserFunc(initMethod, [inst, ...args], line);
        }
        return inst;
      }
      if (fn && typeof fn === 'object' && (fn as UserFunc).__pyFunc) {
        return callUserFunc(fn as UserFunc, args, line);
      }
      throw new PythonRuntimeError(
        'TypeError',
        `Object is not callable`,
        `Line ${line}: You tried to call something with () that is not a function or class.`,
        `Line ${line}: Aapne () laga kar kisi aisi cheez ko call kiya jo function ya class nahi hai.`,
        line
      );
    }

    function lookupVar(name: string, env: Env, line: number): unknown {
      if (name in env) return env[name];
      if (name in globalEnv) return globalEnv[name];
      throw new PythonRuntimeError(
        'NameError',
        `name '${name}' is not defined`,
        `Variable or function '${name}' on line ${line} hasn't been created yet. Check spelling or assign it first.`,
        `Line ${line} par '${name}' abhi define nahi hua hai. Spelling check karo ya pehle value assign karo.`,
        line
      );
    }

    function evalMethodOrAttr(target: unknown, methodCall: string, env: Env, line: number): unknown {
      const parenIdx = methodCall.indexOf('(');

      // Class instance attributes / @property / methods
      if (target && typeof target === 'object' && (target as PyInstance).__pyInstance) {
        const inst = target as PyInstance;
        if (parenIdx === -1) {
          if (methodCall in inst.attrs) return inst.attrs[methodCall];
          const propMethod = findMethodOnClass(inst.cls, methodCall);
          if (propMethod && propMethod.isProperty) {
            return callUserFunc(propMethod, [inst], line);
          }
          if (propMethod) {
            return (...mArgs: unknown[]) => callUserFunc(propMethod, [inst, ...mArgs], line);
          }
          throw new PythonRuntimeError(
            'AttributeError',
            `'${inst.cls.name}' object has no attribute '${methodCall}'`,
            `Line ${line}: Object '${inst.cls.name}' does not have '${methodCall}'.`,
            `Line ${line}: '${inst.cls.name}' object ke andar '${methodCall}' attribute nahi mila.`,
            line
          );
        }
        const methodName = methodCall.slice(0, parenIdx).trim();
        const argsStr = methodCall.slice(parenIdx + 1, -1).trim();
        const args = argsStr ? splitTopLevel(argsStr, ',').map((a) => evalExpr(a, env, line)) : [];
        const method = findMethodOnClass(inst.cls, methodName);
        if (!method) {
          throw new PythonRuntimeError(
            'AttributeError',
            `'${inst.cls.name}' has no method '${methodName}'`,
            `Line ${line}: Class '${inst.cls.name}' has no method '${methodName}()'.`,
            `Line ${line}: Class '${inst.cls.name}' mein '${methodName}()' method nahi hai.`,
            line
          );
        }
        return callUserFunc(method, [inst, ...args], line);
      }

      if (parenIdx === -1) {
        if (typeof target === 'object' && target !== null && methodCall in (target as Env)) {
          return (target as Env)[methodCall];
        }
        throw new PythonRuntimeError(
          'AttributeError',
          `Attribute '${methodCall}' not found`,
          `Line ${line}: '${methodCall}' does not exist on this value.`,
          `Line ${line}: Is value par '${methodCall}' attribute maujood nahi hai.`,
          line
        );
      }
      const methodName = methodCall.slice(0, parenIdx).trim();
      const argsStr = methodCall.slice(parenIdx + 1, -1).trim();
      const args = argsStr ? splitTopLevel(argsStr, ',').map((a) => evalExpr(a, env, line)) : [];

      if (typeof target === 'string') {
        switch (methodName) {
          case 'lower': return target.toLowerCase();
          case 'upper': return target.toUpperCase();
          case 'title': return target.replace(/\b\w/g, (c) => c.toUpperCase());
          case 'strip': return target.trim();
          case 'lstrip': return target.trimStart();
          case 'rstrip': return target.trimEnd();
          case 'split': {
            if (args.length === 0) return target.trim() ? target.trim().split(/\s+/) : [];
            return target.split(String(args[0]));
          }
          case 'join': {
            const items = Array.isArray(args[0]) ? args[0].map((x) => String(x)) : [];
            return items.join(target);
          }
          case 'replace': return target.split(String(args[0])).join(String(args[1] ?? ''));
          case 'find': return target.indexOf(String(args[0]));
          case 'count': return target.split(String(args[0])).length - 1;
          case 'startswith': return target.startsWith(String(args[0]));
          case 'endswith': return target.endsWith(String(args[0]));
          case 'isdigit': return /^\d+$/.test(target);
          case 'isalpha': return /^[A-Za-z]+$/.test(target);
          case 'isupper': return target === target.toUpperCase() && /[A-Z]/.test(target);
          case 'islower': return target === target.toLowerCase() && /[a-z]/.test(target);
          default:
            throw new PythonRuntimeError('AttributeError', `str has no method '${methodName}'`, `String has no method '${methodName}' on line ${line}.`, `Line ${line}: String mein '${methodName}' method nahi hota.`, line);
        }
      }

      if (Array.isArray(target)) {
        switch (methodName) {
          case 'append': target.push(args[0]); return null;
          case 'extend': target.push(...toIterableArray(args[0], line)); return null;
          case 'pop': return args.length ? target.splice(Number(args[0]), 1)[0] : target.pop();
          case 'insert': target.splice(Number(args[0]), 0, args[1]); return null;
          case 'remove': {
            const idx = target.indexOf(args[0]);
            if (idx === -1) throw new PythonRuntimeError('ValueError', `list.remove(x): x not in list`, `Item not found in list on line ${line}.`, `Line ${line}: Ye item list mein nahi mila.`, line);
            target.splice(idx, 1);
            return null;
          }
          case 'sort': target.sort((a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b)))); return null;
          case 'reverse': target.reverse(); return null;
          case 'count': return target.filter((x) => x === args[0]).length;
          case 'index': return target.indexOf(args[0]);
          case 'clear': target.length = 0; return null;
          case 'copy': return [...target];
          default:
            throw new PythonRuntimeError('AttributeError', `list has no method '${methodName}'`, `List has no method '${methodName}' on line ${line}.`, `Line ${line}: List mein '${methodName}' method nahi hota.`, line);
        }
      }

      if (target && typeof target === 'object' && !(target instanceof Set)) {
        const dict = target as Record<string, unknown>;
        switch (methodName) {
          case 'keys': return Object.keys(dict);
          case 'values': return Object.values(dict);
          case 'items': return Object.entries(dict);
          case 'get': return args[0] !== undefined && String(args[0]) in dict ? dict[String(args[0])] : (args[1] ?? null);
          case 'pop': {
            const k = String(args[0]);
            const v = dict[k];
            delete dict[k];
            return v;
          }
        }
      }

      if (target instanceof Set) {
        switch (methodName) {
          case 'add': target.add(args[0]); return null;
          case 'remove': target.delete(args[0]); return null;
        }
      }

      throw new PythonRuntimeError('AttributeError', `Cannot call '${methodName}'`, `Cannot use '.${methodName}()' on this value on line ${line}.`, `Line ${line}: Is value par '.${methodName}()' kaam nahi karta.`, line);
    }

    function evalExpr(raw: string, env: Env, line: number): unknown {
      const expr = raw.trim();
      if (!expr) return null;

      // Strip outer matching parens if entire expr is wrapped
      if (expr.startsWith('(') && expr.endsWith(')')) {
        let depth = 0;
        let wrapsAll = true;
        let inS = false;
        let inD = false;
        for (let i = 0; i < expr.length; i++) {
          const c = expr[i];
          const p = i > 0 ? expr[i - 1] : '';
          if (c === "'" && !inD && p !== '\\') inS = !inS;
          else if (c === '"' && !inS && p !== '\\') inD = !inD;
          else if (!inS && !inD) {
            if (c === '(') depth++;
            else if (c === ')') depth--;
            if (depth === 0 && i < expr.length - 1) {
              wrapsAll = false;
              break;
            }
          }
        }
        if (wrapsAll) {
          const inner = expr.slice(1, -1);
          const tupleParts = splitTopLevel(inner, ',');
          if (tupleParts.length > 1) {
            return tupleParts.map((p) => evalExpr(p, env, line));
          }
          return evalExpr(inner, env, line);
        }
      }

      // Ternary: a if cond else b
      const ternaryMatch = splitTernary(expr);
      if (ternaryMatch) {
        const condVal = evalExpr(ternaryMatch.cond, env, line);
        return isTruthy(condVal)
          ? evalExpr(ternaryMatch.ifTrue, env, line)
          : evalExpr(ternaryMatch.ifFalse, env, line);
      }

      // Lambda
      if (expr.startsWith('lambda ')) {
        const colonIdx = expr.indexOf(':');
        const paramsStr = expr.slice(7, colonIdx).trim();
        const bodyExpr = expr.slice(colonIdx + 1).trim();
        const params = paramsStr ? paramsStr.split(',').map((p) => p.trim()) : [];
        return (...callArgs: unknown[]) => {
          const localEnv: Env = { ...env };
          params.forEach((p, idx) => {
            localEnv[p] = callArgs[idx];
          });
          return evalExpr(bodyExpr, localEnv, line);
        };
      }

      // Logical operators
      const orParts = splitKeywordOp(expr, 'or');
      if (orParts.length > 1) {
        let result: unknown = false;
        for (const part of orParts) {
          result = evalExpr(part, env, line);
          if (isTruthy(result)) return result;
        }
        return result;
      }

      const andParts = splitKeywordOp(expr, 'and');
      if (andParts.length > 1) {
        let result: unknown = true;
        for (const part of andParts) {
          result = evalExpr(part, env, line);
          if (!isTruthy(result)) return result;
        }
        return result;
      }

      if (expr.startsWith('not ')) {
        return !isTruthy(evalExpr(expr.slice(4), env, line));
      }

      // Comparison operators
      const compOps = ['==', '!=', '<=', '>=', '<', '>', ' not in ', ' in '];
      const comp = findTopLevelOp(expr, compOps);
      if (comp) {
        const left = evalExpr(comp.left, env, line);
        const right = evalExpr(comp.right, env, line);
        switch (comp.op) {
          case '==': return JSON.stringify(left) === JSON.stringify(right) || left === right;
          case '!=': return JSON.stringify(left) !== JSON.stringify(right) && left !== right;
          case '<': return Number(left) < Number(right);
          case '>': return Number(left) > Number(right);
          case '<=': return Number(left) <= Number(right);
          case '>=': return Number(left) >= Number(right);
          case ' in ':
            if (typeof right === 'string') return right.includes(String(left));
            if (Array.isArray(right)) return right.includes(left);
            if (right instanceof Set) return right.has(left);
            if (right && typeof right === 'object') return String(left) in (right as object);
            return false;
          case ' not in ':
            if (typeof right === 'string') return !right.includes(String(left));
            if (Array.isArray(right)) return !right.includes(left);
            if (right instanceof Set) return !right.has(left);
            if (right && typeof right === 'object') return !(String(left) in (right as object));
            return true;
        }
      }

      // Add / Sub
      const addSub = findRightmostAddSub(expr);
      if (addSub) {
        const left = evalExpr(addSub.left, env, line);
        const right = evalExpr(addSub.right, env, line);
        if (addSub.op === '+') {
          if (Array.isArray(left) && Array.isArray(right)) return [...left, ...right];
          if (typeof left === 'string' && typeof right === 'string') return left + right;
          if (typeof left === 'string' || typeof right === 'string') {
            throw new PythonRuntimeError(
              'TypeError',
              `can only concatenate str to str`,
              `Line ${line}: You cannot add text (str) and a number directly with '+'. Wrap the number in str(...) or use an f-string.`,
              `Line ${line}: '+' se text aur number ko seedhe nahi jod sakte. Number par str(...) lagao ya f-string use karo.`,
              line
            );
          }
          return Number(left) + Number(right);
        }
        return Number(left) - Number(right);
      }

      // Mul / Div / Mod
      const mulDiv = findRightmostMulDiv(expr);
      if (mulDiv) {
        const left = evalExpr(mulDiv.left, env, line);
        const right = evalExpr(mulDiv.right, env, line);
        if (mulDiv.op === '*') {
          if (typeof left === 'string' && typeof right === 'number') return left.repeat(Math.max(0, right));
          if (typeof left === 'number' && typeof right === 'string') return right.repeat(Math.max(0, left));
          if (Array.isArray(left) && typeof right === 'number') {
            const out: unknown[] = [];
            for (let k = 0; k < right; k++) out.push(...left);
            return out;
          }
          return Number(left) * Number(right);
        }
        if (mulDiv.op === '/') {
          if (Number(right) === 0) {
            throw new PythonRuntimeError('ZeroDivisionError', 'division by zero', `Line ${line}: You cannot divide a number by 0.`, `Line ${line}: Kisi bhi number ko 0 se divide nahi kar sakte.`, line);
          }
          return Number(left) / Number(right);
        }
        if (mulDiv.op === '//') {
          if (Number(right) === 0) {
            throw new PythonRuntimeError('ZeroDivisionError', 'integer division by zero', `Line ${line}: You cannot divide by 0.`, `Line ${line}: 0 se divide nahi kar sakte.`, line);
          }
          return Math.floor(Number(left) / Number(right));
        }
        if (mulDiv.op === '%') {
          if (Number(right) === 0) {
            throw new PythonRuntimeError('ZeroDivisionError', 'modulo by zero', `Line ${line}: Cannot take remainder (%) with 0.`, `Line ${line}: 0 se remainder (%) nahi nikal sakte.`, line);
          }
          return ((Number(left) % Number(right)) + Number(right)) % Number(right);
        }
      }

      const powSplit = findTopLevelOp(expr, ['**']);
      if (powSplit) {
        return Math.pow(Number(evalExpr(powSplit.left, env, line)), Number(evalExpr(powSplit.right, env, line)));
      }

      if (expr.startsWith('-')) return -Number(evalExpr(expr.slice(1), env, line));
      if (expr.startsWith('+')) return +Number(evalExpr(expr.slice(1), env, line));

      if ((expr.startsWith('f"') && expr.endsWith('"')) || (expr.startsWith("f'") && expr.endsWith("'"))) {
        return evalFString(expr.slice(2, -1), env, line);
      }

      if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
        return expr.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      }

      if (/^\d+$/.test(expr)) return parseInt(expr, 10);
      if (/^\d+\.\d+$/.test(expr)) return parseFloat(expr);
      if (expr === 'True') return true;
      if (expr === 'False') return false;
      if (expr === 'None') return null;

      // List literal or comprehension
      if (expr.startsWith('[') && expr.endsWith(']')) {
        const inner = expr.slice(1, -1).trim();
        if (!inner) return [];
        const compMatch = inner.match(/^(.+?)\s+for\s+([A-Za-z_]\w*)\s+in\s+(.+?)(?:\s+if\s+(.+))?$/);
        if (compMatch) {
          const [, mapExpr, loopVar, iterExpr, filterExpr] = compMatch;
          const iterable = evalExpr(iterExpr, env, line);
          const arr = toIterableArray(iterable, line);
          const res: unknown[] = [];
          for (const item of arr) {
            const subEnv = { ...env, [loopVar]: item };
            if (filterExpr && !isTruthy(evalExpr(filterExpr, subEnv, line))) continue;
            res.push(evalExpr(mapExpr, subEnv, line));
          }
          return res;
        }
        return splitTopLevel(inner, ',').map((el) => evalExpr(el, env, line));
      }

      // Dict / Set
      if (expr.startsWith('{') && expr.endsWith('}')) {
        const inner = expr.slice(1, -1).trim();
        if (!inner) return {};
        const items = splitTopLevel(inner, ',');
        const firstColon = splitTopLevel(items[0], ':');
        if (firstColon.length >= 2) {
          const dict: Record<string, unknown> = {};
          for (const item of items) {
            const [k, v] = splitTopLevel(item, ':');
            dict[String(evalExpr(k, env, line))] = evalExpr(v, env, line);
          }
          return dict;
        }
        const s = new Set<unknown>();
        for (const item of items) s.add(evalExpr(item, env, line));
        return s;
      }

      // Indexing / slicing
      const bracketMatch = splitTrailingBracket(expr);
      if (bracketMatch) {
        const target = evalExpr(bracketMatch.base, env, line);
        const indexExpr = bracketMatch.index.trim();
        if (indexExpr.includes(':')) {
          const [startStr, endStr, stepStr] = indexExpr.split(':').map((s) => s.trim());
          const seq = Array.isArray(target) ? target : typeof target === 'string' ? target : [];
          const len = seq.length;
          const step = stepStr ? Number(evalExpr(stepStr, env, line)) : 1;
          let start = startStr ? Number(evalExpr(startStr, env, line)) : step > 0 ? 0 : len - 1;
          let end = endStr ? Number(evalExpr(endStr, env, line)) : step > 0 ? len : -len - 1;
          if (start < 0 && startStr) start = len + start;
          if (end < 0 && endStr) end = len + end;
          const out: unknown[] = [];
          if (step > 0) {
            for (let idx = Math.max(0, start); idx < Math.min(len, end); idx += step) out.push(seq[idx]);
          } else if (step < 0) {
            for (let idx = Math.min(len - 1, start); idx > Math.max(-1, end); idx += step) out.push(seq[idx]);
          }
          return typeof target === 'string' ? out.join('') : out;
        }
        const idx = evalExpr(indexExpr, env, line);
        if (Array.isArray(target) || typeof target === 'string') {
          let i = Number(idx);
          if (i < 0) i = target.length + i;
          if (i < 0 || i >= target.length) {
            throw new PythonRuntimeError('IndexError', 'index out of range', `Line ${line}: Position ${idx} does not exist (length is ${target.length}).`, `Line ${line}: Index ${idx} range se bahar hai (total length ${target.length} hai).`, line);
          }
          return target[i];
        }
        if (target && typeof target === 'object') {
          const key = String(idx);
          if (!(key in (target as Record<string, unknown>))) {
            throw new PythonRuntimeError('KeyError', `Key '${key}' not found`, `Line ${line}: Key '${key}' is not in the dictionary.`, `Line ${line}: Dictionary mein '${key}' key nahi mili.`, line);
          }
          return (target as Record<string, unknown>)[key];
        }
      }

      // Attribute or method chain
      const dotSplit = splitTopLevelDot(expr);
      if (dotSplit) {
        const target = evalExpr(dotSplit.base, env, line);
        return evalMethodOrAttr(target, dotSplit.tail, env, line);
      }

      // Function / Class instantiation call
      const callSplit = splitTrailingCall(expr);
      if (callSplit) {
        const fnName = callSplit.base.trim();
        const rawArgs = callSplit.args ? splitTopLevel(callSplit.args, ',') : [];
        const positional: unknown[] = [];
        const kwargs: Record<string, unknown> = {};
        for (const a of rawArgs) {
          const eqIdx = findKeywordArgEq(a);
          if (eqIdx !== -1) {
            const k = a.slice(0, eqIdx).trim();
            const v = evalExpr(a.slice(eqIdx + 1), env, line);
            kwargs[k] = v;
          } else {
            positional.push(evalExpr(a, env, line));
          }
        }
        return invokeBuiltinOrUser(fnName, positional, kwargs, env, line);
      }

      if (/^[A-Za-z_]\w*$/.test(expr)) {
        return lookupVar(expr, env, line);
      }

      throw new PythonRuntimeError(
        'SyntaxError',
        `Could not understand '${expr}' on line ${line}`,
        `Line ${line}: Check syntax near '${expr}'.`,
        `Line ${line}: '${expr}' ke paas syntax check karo.`,
        line
      );
    }

    function invokeBuiltinOrUser(
      fnName: string,
      args: unknown[],
      kwargs: Record<string, unknown>,
      env: Env,
      line: number
    ): unknown {
      switch (fnName) {
        case 'print': {
          const sep = kwargs.sep !== undefined ? String(kwargs.sep) : ' ';
          const end = kwargs.end !== undefined ? String(kwargs.end) : '\n';
          const text = args.map((a) => formatValueWithDunder(a, line)).join(sep);
          if (end === '\n') {
            outputs.push(text);
          } else {
            if (outputs.length === 0) outputs.push(text + end);
            else outputs[outputs.length - 1] += text + end;
          }
          return null;
        }
        case 'input': {
          if (inputIdx < inputLines.length) {
            return inputLines[inputIdx++].replace(/\r$/, '');
          }
          return '';
        }
        case 'int': {
          const val = Number(String(args[0] ?? '0').trim());
          if (Number.isNaN(val)) {
            throw new PythonRuntimeError('ValueError', `invalid literal for int()`, `Line ${line}: Cannot convert '${args[0]}' into an integer.`, `Line ${line}: '${args[0]}' ko integer number mein convert nahi kar sakte.`, line);
          }
          return Math.trunc(val);
        }
        case 'float': {
          const val = parseFloat(String(args[0] ?? '0').trim());
          if (Number.isNaN(val)) {
            throw new PythonRuntimeError('ValueError', `could not convert string to float`, `Line ${line}: Cannot convert '${args[0]}' into a decimal number.`, `Line ${line}: '${args[0]}' ko decimal (float) mein convert nahi kar sakte.`, line);
          }
          return val;
        }
        case 'str': return formatValueWithDunder(args[0], line);
        case 'bool': return isTruthy(args[0]);
        case 'len': {
          const v = args[0];
          if (v && typeof v === 'object' && (v as PyInstance).__pyInstance) {
            const inst = v as PyInstance;
            const lenFn = findMethodOnClass(inst.cls, '__len__');
            if (lenFn) return callUserFunc(lenFn, [inst], line);
          }
          if (typeof v === 'string' || Array.isArray(v)) return v.length;
          if (v instanceof Set) return v.size;
          if (v && typeof v === 'object') return Object.keys(v as object).length;
          throw new PythonRuntimeError('TypeError', `object has no len()`, `Line ${line}: len() works on text, lists, sets, or dictionaries.`, `Line ${line}: len() sirf text, list, set ya dictionary par kaam karta hai.`, line);
        }
        case 'range': {
          let start = 0;
          let stop = 0;
          let step = 1;
          if (args.length === 1) stop = Number(args[0]);
          else if (args.length === 2) { start = Number(args[0]); stop = Number(args[1]); }
          else if (args.length >= 3) { start = Number(args[0]); stop = Number(args[1]); step = Number(args[2]); }
          const arr: number[] = [];
          if (step > 0) for (let i = start; i < stop && arr.length < 5000; i += step) arr.push(i);
          else if (step < 0) for (let i = start; i > stop && arr.length < 5000; i += step) arr.push(i);
          return arr;
        }
        case 'sum': return toIterableArray(args[0], line).reduce<number>((acc, x) => acc + Number(x), 0);
        case 'min': {
          const arr = args.length === 1 ? toIterableArray(args[0], line) : args;
          return Math.min(...arr.map(Number));
        }
        case 'max': {
          const arr = args.length === 1 ? toIterableArray(args[0], line) : args;
          return Math.max(...arr.map(Number));
        }
        case 'abs': return Math.abs(Number(args[0]));
        case 'pow': return Math.pow(Number(args[0]), Number(args[1]));
        case 'round': return args.length > 1 ? Number(Number(args[0]).toFixed(Number(args[1]))) : Math.round(Number(args[0]));
        case 'sorted': {
          const arr = [...toIterableArray(args[0], line)];
          arr.sort((a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))));
          if (kwargs.reverse) arr.reverse();
          return arr;
        }
        case 'reversed': return [...toIterableArray(args[0], line)].reverse();
        case 'list': return toIterableArray(args[0] ?? [], line);
        case 'set': return new Set(toIterableArray(args[0] ?? [], line));
        case 'enumerate': {
          const startIdx = Number(args[1] ?? 0);
          return toIterableArray(args[0], line).map((item, idx) => [idx + startIdx, item]);
        }
        case 'zip': {
          const arrs = args.map((a) => toIterableArray(a, line));
          const minLen = Math.min(...arrs.map((a) => a.length));
          return Array.from({ length: minLen }, (_, idx) => arrs.map((a) => a[idx]));
        }
        case 'any': return toIterableArray(args[0], line).some((x) => isTruthy(x));
        case 'all': return toIterableArray(args[0], line).every((x) => isTruthy(x));
        case 'map': {
          const fn = args[0];
          return toIterableArray(args[1], line).map((x) => callCallable(fn, [x], line));
        }
        case 'filter': {
          const fn = args[0];
          return toIterableArray(args[1], line).filter((x) => isTruthy(callCallable(fn, [x], line)));
        }
        case 'isinstance': {
          const obj = args[0];
          const cls = args[1];
          if (obj && typeof obj === 'object' && (obj as PyInstance).__pyInstance && cls && (cls as PyClass).__pyClass) {
            let curr: PyClass | undefined = (obj as PyInstance).cls;
            while (curr) {
              if (curr === cls) return true;
              curr = curr.parent;
            }
            return false;
          }
          return false;
        }
        case 'type': {
          const v = args[0];
          if (typeof v === 'boolean') return "<class 'bool'>";
          if (typeof v === 'number') return Number.isInteger(v) ? "<class 'int'>" : "<class 'float'>";
          if (typeof v === 'string') return "<class 'str'>";
          if (Array.isArray(v)) return "<class 'list'>";
          if (v === null) return "<class 'NoneType'>";
          if (v && typeof v === 'object' && (v as PyInstance).__pyInstance) return `<class '${(v as PyInstance).cls.name}'>`;
          return "<class 'dict'>";
        }
        default: {
          const fn = lookupVar(fnName, env, line);
          return callCallable(fn, args, line);
        }
      }
    }

    function toIterableArray(val: unknown, line: number): unknown[] {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return val.split('');
      if (val instanceof Set) return Array.from(val);
      if (val && typeof val === 'object') return Object.keys(val as object);
      throw new PythonRuntimeError('TypeError', 'object is not iterable', `Line ${line}: You can only loop over a list, range, string, or dictionary.`, `Line ${line}: Loop sirf list, range, string ya dictionary par chal sakta hai.`, line);
    }

    function parseDefStatement(stmt: Stmt, env: Env): { fnName: string; fnObj: UserFunc } {
      const match = stmt.text.match(/^def\s+([A-Za-z_]\w*)\s*\((.*)\)\s*:$/);
      if (!match) {
        throw new PythonRuntimeError('SyntaxError', `Invalid function definition on line ${stmt.line}`, `Check function format on line ${stmt.line}: def my_func(arg):`, `Line ${stmt.line} par function format check karo: def my_func(arg):`, stmt.line);
      }
      const [, fnName, paramsRaw] = match;
      const paramParts = paramsRaw.trim() ? splitTopLevel(paramsRaw, ',') : [];
      const params: string[] = [];
      const defaults: (unknown | undefined)[] = [];
      let varargName: string | undefined;
      for (const p of paramParts) {
        if (p.startsWith('*')) {
          varargName = p.slice(1).trim();
        } else if (p.includes('=')) {
          const [pn, pd] = p.split('=');
          params.push(pn.trim());
          defaults.push(evalExpr(pd.trim(), env, stmt.line));
        } else {
          params.push(p.trim());
          defaults.push(undefined);
        }
      }
      const isProperty = stmt.decorators?.some((d) => d.trim() === '@property');
      return {
        fnName,
        fnObj: {
          __pyFunc: true,
          params,
          varargName,
          defaults,
          body: stmt.children || [],
          closure: env,
          isProperty,
        },
      };
    }

    function recordTrace(stmt: Stmt, env: Env) {
      if (!collectTrace || trace.length >= 120) return;
      trace.push({
        step: trace.length + 1,
        line: stmt.line,
        codeLine: stmt.text,
        variables: snapshotVars(env),
        outputSoFar: outputs.join('\n'),
      });
    }

    function execBlock(stmts: Stmt[], env: Env) {
      let i = 0;
      while (i < stmts.length) {
        stepCount++;
        if (stepCount > MAX_STEPS) {
          throw new PythonRuntimeError(
            'TimeoutError',
            'Infinite loop detected',
            'Your loop ran too many times! Check your while condition or counter so the loop can stop.',
            'Aapka loop bahut zyada baar chal gaya (Infinite loop)! while condition ya counter check karo taaki loop ruk sake.',
            stmts[i].line
          );
        }

        const stmt = stmts[i];
        const t = stmt.text;

        if (t === 'pass') { recordTrace(stmt, env); i++; continue; }
        if (t === 'break') { recordTrace(stmt, env); throw new BreakSignal(); }
        if (t === 'continue') { recordTrace(stmt, env); throw new ContinueSignal(); }
        if (t === 'return') { recordTrace(stmt, env); throw new ReturnSignal(null); }
        if (t.startsWith('return ')) {
          const val = evalExpr(t.slice(7), env, stmt.line);
          recordTrace(stmt, env);
          throw new ReturnSignal(val);
        }

        // class definition
        if (t.startsWith('class ')) {
          const clsMatch = t.match(/^class\s+([A-Za-z_]\w*)(?:\(([A-Za-z_]\w*)\))?\s*:$/);
          if (!clsMatch) {
            throw new PythonRuntimeError('SyntaxError', `Invalid class definition on line ${stmt.line}`, `Check class format on line ${stmt.line}: class MyClass:`, `Line ${stmt.line} par class syntax check karo: class MyClass:`, stmt.line);
          }
          const [, clsName, parentName] = clsMatch;
          const parentCls = parentName ? (lookupVar(parentName, env, stmt.line) as PyClass) : undefined;
          const methods: Record<string, UserFunc> = {};
          for (const child of stmt.children || []) {
            if (child.text.startsWith('def ')) {
              const parsed = parseDefStatement(child, env);
              methods[parsed.fnName] = parsed.fnObj;
            }
          }
          env[clsName] = { __pyClass: true, name: clsName, parent: parentCls, methods } as PyClass;
          recordTrace(stmt, env);
          i++;
          continue;
        }

        // if / elif / else
        if (t.startsWith('if ')) {
          const cond = t.slice(3, -1).trim();
          recordTrace(stmt, env);
          let executed = false;
          if (isTruthy(evalExpr(cond, env, stmt.line))) {
            execBlock(stmt.children || [], env);
            executed = true;
          }
          i++;
          while (i < stmts.length && (stmts[i].text.startsWith('elif ') || stmts[i].text === 'else:')) {
            const branch = stmts[i];
            if (!executed) {
              if (branch.text === 'else:') {
                recordTrace(branch, env);
                execBlock(branch.children || [], env);
                executed = true;
              } else {
                const elifCond = branch.text.slice(5, -1).trim();
                if (isTruthy(evalExpr(elifCond, env, branch.line))) {
                  recordTrace(branch, env);
                  execBlock(branch.children || [], env);
                  executed = true;
                }
              }
            }
            i++;
          }
          continue;
        }

        // for loop
        if (t.startsWith('for ')) {
          const match = t.slice(4, -1).match(/^(.+?)\s+in\s+(.+)$/);
          if (!match) {
            throw new PythonRuntimeError('SyntaxError', `Invalid for loop on line ${stmt.line}`, `Check your 'for' loop format on line ${stmt.line}: for item in collection:`, `Line ${stmt.line} par 'for' loop format check karo: for item in collection:`, stmt.line);
          }
          const [, targetStr, iterStr] = match;
          const items = toIterableArray(evalExpr(iterStr, env, stmt.line), stmt.line);
          const targetVars = targetStr.split(',').map((s) => s.trim());
          for (const item of items) {
            if (targetVars.length > 1 && Array.isArray(item)) {
              targetVars.forEach((v, idx) => { env[v] = item[idx]; });
            } else {
              env[targetVars[0]] = item;
            }
            recordTrace(stmt, env);
            try {
              execBlock(stmt.children || [], env);
            } catch (sig) {
              if (sig instanceof BreakSignal) break;
              if (sig instanceof ContinueSignal) continue;
              throw sig;
            }
          }
          i++;
          continue;
        }

        // while loop
        if (t.startsWith('while ')) {
          const cond = t.slice(6, -1).trim();
          while (isTruthy(evalExpr(cond, env, stmt.line))) {
            stepCount++;
            if (stepCount > MAX_STEPS) {
              throw new PythonRuntimeError('TimeoutError', 'Infinite while loop', `Line ${stmt.line}: Your while loop never stopped. Make sure the variable inside changes!`, `Line ${stmt.line}: Aapka while loop ruk nahi raha! Loop ke andar variable ko update zaroor karo.`, stmt.line);
            }
            recordTrace(stmt, env);
            try {
              execBlock(stmt.children || [], env);
            } catch (sig) {
              if (sig instanceof BreakSignal) break;
              if (sig instanceof ContinueSignal) continue;
              throw sig;
            }
          }
          i++;
          continue;
        }

        // def function
        if (t.startsWith('def ')) {
          const { fnName, fnObj } = parseDefStatement(stmt, env);
          env[fnName] = fnObj;
          recordTrace(stmt, env);
          i++;
          continue;
        }

        // try / except
        if (t === 'try:') {
          recordTrace(stmt, env);
          try {
            execBlock(stmt.children || [], env);
          } catch (err) {
            if (err instanceof ReturnSignal || err instanceof BreakSignal || err instanceof ContinueSignal) throw err;
            if (i + 1 < stmts.length && stmts[i + 1].text.startsWith('except')) {
              execBlock(stmts[i + 1].children || [], env);
            }
          }
          i++;
          while (i < stmts.length && (stmts[i].text.startsWith('except') || stmts[i].text === 'finally:')) {
            if (stmts[i].text === 'finally:') execBlock(stmts[i].children || [], env);
            i++;
          }
          continue;
        }

        // Augmented assignments
        const augMatch = findTopLevelOp(t, ['+=', '-=', '*=', '/=']);
        if (augMatch) {
          const lhs = augMatch.left.trim();
          const rhs = evalExpr(augMatch.right, env, stmt.line);
          const dotLhs = splitTopLevelDot(lhs);
          if (dotLhs) {
            const target = evalExpr(dotLhs.base, env, stmt.line);
            if (target && typeof target === 'object' && (target as PyInstance).__pyInstance) {
              const inst = target as PyInstance;
              const curr = inst.attrs[dotLhs.tail];
              if (augMatch.op === '+=') inst.attrs[dotLhs.tail] = Number(curr) + Number(rhs);
              else if (augMatch.op === '-=') inst.attrs[dotLhs.tail] = Number(curr) - Number(rhs);
              else if (augMatch.op === '*=') inst.attrs[dotLhs.tail] = Number(curr) * Number(rhs);
              else if (augMatch.op === '/=') inst.attrs[dotLhs.tail] = Number(curr) / Number(rhs);
            }
          } else {
            const curr = lookupVar(lhs, env, stmt.line);
            if (augMatch.op === '+=') env[lhs] = (typeof curr === 'string' || typeof rhs === 'string') ? String(curr) + String(rhs) : Array.isArray(curr) && Array.isArray(rhs) ? [...curr, ...rhs] : Number(curr) + Number(rhs);
            else if (augMatch.op === '-=') env[lhs] = Number(curr) - Number(rhs);
            else if (augMatch.op === '*=') env[lhs] = Number(curr) * Number(rhs);
            else if (augMatch.op === '/=') env[lhs] = Number(curr) / Number(rhs);
          }
          recordTrace(stmt, env);
          i++;
          continue;
        }

        // Assignment
        const eqPos = findAssignmentEq(t);
        if (eqPos !== -1) {
          const lhs = t.slice(0, eqPos).trim();
          const rhs = t.slice(eqPos + 1).trim();
          const val = evalExpr(rhs, env, stmt.line);

          const dotLhs = splitTopLevelDot(lhs);
          const bracketLhs = splitTrailingBracket(lhs);
          if (dotLhs && !bracketLhs) {
            const target = evalExpr(dotLhs.base, env, stmt.line);
            if (target && typeof target === 'object' && (target as PyInstance).__pyInstance) {
              (target as PyInstance).attrs[dotLhs.tail] = val;
            }
          } else if (bracketLhs) {
            const container = evalExpr(bracketLhs.base, env, stmt.line);
            const key = evalExpr(bracketLhs.index, env, stmt.line);
            if (Array.isArray(container)) container[Number(key)] = val;
            else if (container && typeof container === 'object') (container as Env)[String(key)] = val;
          } else {
            const targets = splitTopLevel(lhs, ',');
            if (targets.length > 1 && Array.isArray(val)) {
              targets.forEach((vName, idx) => { env[vName] = val[idx]; });
            } else {
              env[lhs] = val;
            }
          }
          recordTrace(stmt, env);
          i++;
          continue;
        }

        evalExpr(t, env, stmt.line);
        recordTrace(stmt, env);
        i++;
      }
    }

    execBlock(ast, globalEnv);
    return { stdout: outputs.join('\n'), trace: collectTrace ? trace : undefined };
  } catch (err) {
    if (err instanceof PythonRuntimeError) {
      return {
        stdout: outputs.join('\n'),
        trace: collectTrace ? trace : undefined,
        error: {
          type: err.errorType,
          line: err.line,
          rawMessage: err.message,
          friendlyEn: err.friendlyEn,
          friendlyHi: err.friendlyHi,
        },
      };
    }
    const msg = err instanceof Error ? err.message : String(err);
    return {
      stdout: outputs.join('\n'),
      trace: collectTrace ? trace : undefined,
      error: {
        type: 'Error',
        rawMessage: msg,
        friendlyEn: 'Something in your code could not run. Check spelling, quotes, colons (:), and indentation.',
        friendlyHi: 'Code run nahi hua — spelling, quotes, colon (:) aur indentation (spaces) check karo.',
      },
    };
  }
}

// Helper parsing utilities
function splitTernary(expr: string): { ifTrue: string; cond: string; ifFalse: string } | null {
  let dP = 0, dB = 0, dC = 0, inS = false, inD = false;
  let ifIdx = -1, elseIdx = -1;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    const p = i > 0 ? expr[i - 1] : '';
    if (c === "'" && !inD && p !== '\\') inS = !inS;
    else if (c === '"' && !inS && p !== '\\') inD = !inD;
    else if (!inS && !inD) {
      if (c === '(') dP++; else if (c === ')') dP--;
      else if (c === '[') dB++; else if (c === ']') dB--;
      else if (c === '{') dC++; else if (c === '}') dC--;
      else if (dP === 0 && dB === 0 && dC === 0) {
        if (ifIdx === -1 && expr.slice(i, i + 4) === ' if ') ifIdx = i;
        else if (ifIdx !== -1 && expr.slice(i, i + 6) === ' else ') { elseIdx = i; break; }
      }
    }
  }
  if (ifIdx !== -1 && elseIdx !== -1) {
    return {
      ifTrue: expr.slice(0, ifIdx),
      cond: expr.slice(ifIdx + 4, elseIdx),
      ifFalse: expr.slice(elseIdx + 6),
    };
  }
  return null;
}

function splitKeywordOp(expr: string, kw: 'and' | 'or'): string[] {
  return splitTopLevel(expr, ` ${kw} `);
}

function findTopLevelOp(expr: string, ops: string[]): { left: string; op: string; right: string } | null {
  let dP = 0, dB = 0, dC = 0, inS = false, inD = false;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    const p = i > 0 ? expr[i - 1] : '';
    if (c === "'" && !inD && p !== '\\') inS = !inS;
    else if (c === '"' && !inS && p !== '\\') inD = !inD;
    else if (!inS && !inD) {
      if (c === '(') dP++; else if (c === ')') dP--;
      else if (c === '[') dB++; else if (c === ']') dB--;
      else if (c === '{') dC++; else if (c === '}') dC--;
      else if (dP === 0 && dB === 0 && dC === 0) {
        for (const op of ops) {
          if (expr.slice(i, i + op.length) === op) {
            return { left: expr.slice(0, i), op, right: expr.slice(i + op.length) };
          }
        }
      }
    }
  }
  return null;
}

function findRightmostAddSub(expr: string): { left: string; op: '+' | '-'; right: string } | null {
  let dP = 0, dB = 0, dC = 0, inS = false, inD = false;
  let found: { left: string; op: '+' | '-'; right: string } | null = null;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    const p = i > 0 ? expr[i - 1] : '';
    if (c === "'" && !inD && p !== '\\') inS = !inS;
    else if (c === '"' && !inS && p !== '\\') inD = !inD;
    else if (!inS && !inD) {
      if (c === '(') dP++; else if (c === ')') dP--;
      else if (c === '[') dB++; else if (c === ']') dB--;
      else if (c === '{') dC++; else if (c === '}') dC--;
      else if (dP === 0 && dB === 0 && dC === 0 && (c === '+' || c === '-') && i > 0) {
        const before = expr.slice(0, i).trimEnd();
        const prevChar = before[before.length - 1];
        if (prevChar && !'+-*/%(=<>!,'.includes(prevChar)) {
          found = { left: expr.slice(0, i), op: c, right: expr.slice(i + 1) };
        }
      }
    }
  }
  return found;
}

function findRightmostMulDiv(expr: string): { left: string; op: '*' | '/' | '//' | '%'; right: string } | null {
  let dP = 0, dB = 0, dC = 0, inS = false, inD = false;
  let found: { left: string; op: '*' | '/' | '//' | '%'; right: string } | null = null;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    const p = i > 0 ? expr[i - 1] : '';
    if (c === "'" && !inD && p !== '\\') inS = !inS;
    else if (c === '"' && !inS && p !== '\\') inD = !inD;
    else if (!inS && !inD) {
      if (c === '(') dP++; else if (c === ')') dP--;
      else if (c === '[') dB++; else if (c === ']') dB--;
      else if (c === '{') dC++; else if (c === '}') dC--;
      else if (dP === 0 && dB === 0 && dC === 0 && i > 0) {
        if (expr.slice(i, i + 2) === '//') {
          found = { left: expr.slice(0, i), op: '//', right: expr.slice(i + 2) };
          i++;
        } else if (expr.slice(i, i + 2) === '**') {
          i++;
        } else if (c === '*' || c === '/' || c === '%') {
          found = { left: expr.slice(0, i), op: c, right: expr.slice(i + 1) };
        }
      }
    }
  }
  return found;
}

function splitTrailingBracket(expr: string): { base: string; index: string } | null {
  if (!expr.endsWith(']')) return null;
  let depth = 0, inS = false, inD = false;
  for (let i = expr.length - 1; i >= 0; i--) {
    const c = expr[i];
    const p = i > 0 ? expr[i - 1] : '';
    if (c === "'" && !inD && p !== '\\') inS = !inS;
    else if (c === '"' && !inS && p !== '\\') inD = !inD;
    else if (!inS && !inD) {
      if (c === ']') depth++;
      else if (c === '[') {
        depth--;
        if (depth === 0) {
          if (i === 0) return null;
          return { base: expr.slice(0, i), index: expr.slice(i + 1, -1) };
        }
      }
    }
  }
  return null;
}

function splitTrailingCall(expr: string): { base: string; args: string } | null {
  if (!expr.endsWith(')')) return null;
  let depth = 0, inS = false, inD = false;
  for (let i = expr.length - 1; i >= 0; i--) {
    const c = expr[i];
    const p = i > 0 ? expr[i - 1] : '';
    if (c === "'" && !inD && p !== '\\') inS = !inS;
    else if (c === '"' && !inS && p !== '\\') inD = !inD;
    else if (!inS && !inD) {
      if (c === ')') depth++;
      else if (c === '(') {
        depth--;
        if (depth === 0) {
          if (i === 0) return null;
          return { base: expr.slice(0, i), args: expr.slice(i + 1, -1) };
        }
      }
    }
  }
  return null;
}

function splitTopLevelDot(expr: string): { base: string; tail: string } | null {
  let dP = 0, dB = 0, dC = 0, inS = false, inD = false;
  let lastDot = -1;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    const p = i > 0 ? expr[i - 1] : '';
    if (c === "'" && !inD && p !== '\\') inS = !inS;
    else if (c === '"' && !inS && p !== '\\') inD = !inD;
    else if (!inS && !inD) {
      if (c === '(') dP++; else if (c === ')') dP--;
      else if (c === '[') dB++; else if (c === ']') dB--;
      else if (c === '{') dC++; else if (c === '}') dC--;
      else if (c === '.' && dP === 0 && dB === 0 && dC === 0) {
        const prev = expr[i - 1];
        const next = expr[i + 1];
        if (!(/\d/.test(prev) && /\d/.test(next))) {
          lastDot = i;
        }
      }
    }
  }
  if (lastDot > 0) {
    return { base: expr.slice(0, lastDot), tail: expr.slice(lastDot + 1) };
  }
  return null;
}

function findKeywordArgEq(arg: string): number {
  let dP = 0, dB = 0, inS = false, inD = false;
  for (let i = 0; i < arg.length; i++) {
    const c = arg[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (!inS && !inD) {
      if (c === '(') dP++; else if (c === ')') dP--;
      else if (c === '[') dB++; else if (c === ']') dB--;
      else if (c === '=' && dP === 0 && dB === 0 && arg[i + 1] !== '=' && arg[i - 1] !== '!' && arg[i - 1] !== '<' && arg[i - 1] !== '>') {
        return i;
      }
    }
  }
  return -1;
}

function findAssignmentEq(stmt: string): number {
  let dP = 0, dB = 0, dC = 0, inS = false, inD = false;
  for (let i = 0; i < stmt.length; i++) {
    const c = stmt[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (!inS && !inD) {
      if (c === '(') dP++; else if (c === ')') dP--;
      else if (c === '[') dB++; else if (c === ']') dB--;
      else if (c === '{') dC++; else if (c === '}') dC--;
      else if (
        c === '=' &&
        dP === 0 &&
        dB === 0 &&
        dC === 0 &&
        stmt[i + 1] !== '=' &&
        !'!<>+-*/'.includes(stmt[i - 1] || '')
      ) {
        return i;
      }
    }
  }
  return -1;
}
