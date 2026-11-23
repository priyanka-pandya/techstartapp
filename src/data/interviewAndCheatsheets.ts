import { CheatSheetItem, InterviewQA } from '../types';

export const CHEAT_SHEETS: CheatSheetItem[] = [
  {
    id: 'cs-python-core',
    title: 'Python Core & Collections Quick Sheet',
    category: 'Python',
    entries: [
      { syntax: 'x = 10; name = "Aarav"', meaning: { en: 'Store int and str in variables', hi: 'Variables mein number aur text store karein' } },
      { syntax: 'f"Hi {name}, score={x}"', meaning: { en: 'Format text cleanly with f-strings', hi: 'f-string se text aur variable ko asani se jodein' } },
      { syntax: 'if a >= 10: ... elif a > 0: ... else:', meaning: { en: 'Decision branching with 4-space indent', hi: 'Condition check kar ke alag actions chalayein' } },
      { syntax: 'for i in range(1, 6):', meaning: { en: 'Loop 1, 2, 3, 4, 5 (stop value excluded)', hi: '1 se 5 tak loop chalayein (last number include nahi hota)' } },
      { syntax: 'nums = [1, 2]; nums.append(3)', meaning: { en: 'List operations: append, pop, sort, len', hi: 'List mein item add/remove aur sort karein' } },
      { syntax: 'd = {"k": 1}; d.get("m", 0)', meaning: { en: 'Safe dictionary lookup without KeyError', hi: 'Dictionary se bina crash hue safe value nikalein' } },
      { syntax: '[x * 2 for x in nums if x > 0]', meaning: { en: 'List comprehension transform & filter', hi: 'Ek line mein list ko filter aur transform karein' } },
      { syntax: 'try: ... except Exception:', meaning: { en: 'Prevent runtime crashes gracefully', hi: 'Error aane par app crash hone se bachayein' } },
    ],
  },
  {
    id: 'cs-python-oop-dsa',
    title: 'Python OOP & DSA Interview Sheet',
    category: 'Python',
    entries: [
      { syntax: 'class Student:\n  def __init__(self, n): self.n = n', meaning: { en: 'Class blueprint and constructor method', hi: 'Class blueprint aur __init__ constructor' } },
      { syntax: 'class Intern(Student):', meaning: { en: 'Single inheritance reusing parent methods', hi: 'Inheritance: Child class ko Parent ke features milte hain' } },
      { syntax: 'def __str__(self): return f"{self.n}"', meaning: { en: 'Custom readable text when calling print(obj)', hi: 'print(object) karne par readable text dikhaye' } },
      { syntax: 'stack.append(x) / stack.pop()', meaning: { en: 'LIFO Stack in O(1) time', hi: 'Stack (Last In First Out) — O(1) fast operation' } },
      { syntax: 'queue.append(x) / queue.pop(0)', meaning: { en: 'FIFO Queue (first in, first served)', hi: 'Queue (First In First Out) line ki tarah' } },
      { syntax: 'Binary Search: O(log n)', meaning: { en: 'Halves sorted array each step using low/mid/high', hi: 'Sorted list ko har step mein aadha kar ke tez search' } },
    ],
  },
  {
    id: 'cs-excel',
    title: 'Excel Job-Ready Formulas & Shortcuts',
    category: 'Excel',
    entries: [
      { syntax: '=SUM(B2:B10)', meaning: { en: 'Add all numbers in a vertical/horizontal range', hi: 'Range ke sabhi numbers ka total nikalein' } },
      { syntax: '=AVERAGE(C2:C10)', meaning: { en: 'Calculate arithmetic mean', hi: 'Average (ausat) nikalein' } },
      { syntax: '=IF(D2>=40, "Pass", "Fail")', meaning: { en: 'Conditional Pass/Fail or Bonus rule', hi: 'Condition ke hisab se Pass/Fail ya text dikhayein' } },
      { syntax: '=COUNTIF(E2:E20, "Done")', meaning: { en: 'Count cells matching a specific condition', hi: 'Sirf matching cells ki ginti karein' } },
      { syntax: 'Ctrl+C / Ctrl+V / Ctrl+Z', meaning: { en: 'Copy, Paste, Undo anywhere on Windows', hi: 'Copy, Paste aur galti sudharne ke liye Undo' } },
      { syntax: 'Ctrl + Shift + L', meaning: { en: 'Toggle instant data filters in Excel', hi: 'Excel table mein turant Filter lagayein/hatayein' } },
    ],
  },
  {
    id: 'cs-git',
    title: 'Git & GitHub Essential Workflow',
    category: 'Git',
    entries: [
      { syntax: 'git init', meaning: { en: 'Start version tracking in a new project folder', hi: 'Naye folder mein Git tracking shuru karein' } },
      { syntax: 'git status', meaning: { en: 'See modified and untracked files', hi: 'Kaun si files change hui hain check karein' } },
      { syntax: 'git add .', meaning: { en: 'Stage all changed files for next checkpoint', hi: 'Sabhi changes ko save karne ke liye ready karein' } },
      { syntax: 'git commit -m "Add login"', meaning: { en: 'Save a permanent labeled snapshot locally', hi: 'Message ke saath ek permanent checkpoint save karein' } },
      { syntax: 'git push -u origin main', meaning: { en: 'Upload commits safely to your GitHub repo', hi: 'Apna code GitHub profile par upload karein' } },
      { syntax: 'git pull', meaning: { en: 'Download latest team updates from GitHub', hi: 'GitHub se naye updates apne computer par layein' } },
    ],
  },
];

export const INTERVIEW_QA: InterviewQA[] = [
  {
    id: 'iq-1',
    category: 'Python Basics',
    question: { en: 'What is the difference between a List and a Tuple in Python?', hi: 'Python mein List aur Tuple mein kya farq hai?' },
    answer: {
      en: 'A List `[1, 2]` is mutable (you can add, remove, or change items). A Tuple `(1, 2)` is immutable (fixed once created, faster and safer for constant data).',
      hi: 'List `[1, 2]` mutable hoti hai (badal sakte hain), jabki Tuple `(1, 2)` immutable hota hai (ek baar banne ke baad change nahi hota aur zyada fast hota hai).',
    },
    codeSnippet: 'items = [1, 2]\nitems.append(3)\ncoords = (26.9, 75.7)  # fixed',
  },
  {
    id: 'iq-2',
    category: 'Python Basics',
    question: { en: 'Explain `==` vs `is` in Python.', hi: 'Python mein `==` aur `is` mein kya antar hai?' },
    answer: {
      en: '`==` compares values (do they look equal?), while `is` checks memory identity (are both names pointing to the exact same object?).',
      hi: '`==` dono ki value compare karta hai, jabki `is` check karta hai ki dono ek hi memory address par hain ya nahi.',
    },
  },
  {
    id: 'iq-3',
    category: 'Python Basics',
    question: { en: 'How do you avoid KeyError when reading a Dictionary?', hi: 'Dictionary padhte waqt KeyError se kaise bachte hain?' },
    answer: {
      en: 'Use `.get(key, default_value)` instead of `dict[key]`. If the key is missing, `.get()` safely returns the default value.',
      hi: '`dict[key]` ki jagah `dict.get(key, default)` use karein — agar key nahi hogi toh program crash nahi hoga.',
    },
    codeSnippet: 'marks = {"Amit": 85}\nprint(marks.get("Neha", 0))',
  },
  {
    id: 'iq-4',
    category: 'Python Basics',
    question: { en: 'What does `pass`, `continue`, and `break` do in loops?', hi: 'Loops mein `pass`, `continue` aur `break` ka kya kaam hai?' },
    answer: {
      en: '`break` exits the loop completely, `continue` skips only the current iteration to the next one, and `pass` is an empty placeholder doing nothing.',
      hi: '`break` loop ko poori tarah rok deta hai, `continue` sirf current round skip karta hai, aur `pass` khaali placeholder hota hai.',
    },
  },
  {
    id: 'iq-5',
    category: 'Python Basics',
    question: { en: 'Why does `"5" + "3"` give `"53"` instead of `8`?', hi: '`"5" + "3"` ka output `8` ki jagah `"53"` kyun aata hai?' },
    answer: {
      en: 'Because quotes create strings (`str`), and `+` joins strings together. Convert with `int("5") + int("3")` for math.',
      hi: 'Quotes lagane se woh string (`str`) ban jata hai aur `+` text jod deta hai. Math ke liye `int()` lagana padta hai.',
    },
  },
  {
    id: 'iq-6',
    category: 'Python Basics',
    question: { en: 'What is the difference between `return` and `print()` inside a function?', hi: 'Function ke andar `return` aur `print()` mein kya difference hai?' },
    answer: {
      en: '`print()` only displays text on screen; `return` sends the computed result back to the caller so you can store or reuse it.',
      hi: '`print()` sirf screen par dikhata hai, jabki `return` value ko wapas code mein bhejta hai taaki variable mein save kar sakein.',
    },
  },
  {
    id: 'iq-7',
    category: 'Python Basics',
    question: { en: 'What are `*args` in Python functions?', hi: 'Python function mein `*args` kyun use hota hai?' },
    answer: {
      en: '`*args` lets a function accept any number of positional arguments without knowing the exact count beforehand.',
      hi: '`*args` ki madad se ek function kitne bhi arguments accept kar sakta hai, chahe 2 dein ya 10.',
    },
    codeSnippet: 'def total(*nums):\n    return sum(nums)\nprint(total(10, 20, 30))',
  },
  {
    id: 'iq-8',
    category: 'Python Basics',
    question: { en: 'How do Sets help clean data in Python?', hi: 'Python mein Sets data saaf karne mein kaise help karte hain?' },
    answer: {
      en: 'Sets store only unique items and support fast `in` lookups and math operations like union and intersection.',
      hi: 'Set apne aap duplicate values hata deta hai aur kisi item ko dhoondhna bahut fast banata hai.',
    },
  },
  {
    id: 'iq-9',
    category: 'Python Basics',
    question: { en: 'What is negative indexing and slicing (`[::-1]`)?', hi: 'Negative indexing aur `[::-1]` slicing kya hoti hai?' },
    answer: {
      en: '`arr[-1]` gets the last item without needing `len(arr)`. `text[::-1]` steps backward with `-1`, reversing the string or list.',
      hi: '`arr[-1]` last item deta hai aur `[::-1]` string ya list ko reverse (ulta) kar deta hai.',
    },
  },
  {
    id: 'iq-10',
    category: 'Python Basics',
    question: { en: 'What is a Lambda function and when should you use it?', hi: 'Lambda function kya hai aur kab use karna chahiye?' },
    answer: {
      en: 'A small anonymous single-expression function (`lambda x: x * 2`), ideal for quick callbacks in `map()`, `filter()`, or `sorted()`.',
      hi: 'Ek chhota single-line function bina `def` ke, jo `map()`, `filter()` ya sorting key ke liye kaam aata hai.',
    },
  },
  {
    id: 'iq-11',
    category: 'Python Basics',
    question: { en: 'What is List Comprehension?', hi: 'List Comprehension kya hota hai?' },
    answer: {
      en: 'A compact, Pythonic syntax `[expr for item in seq if cond]` to create transformed lists faster than a manual `append()` loop.',
      hi: 'Ek clean aur fast tarika `[x*2 for x in nums]` jisse ek hi line mein nayi list ban jati hai.',
    },
  },
  {
    id: 'iq-12',
    category: 'Python Basics',
    question: { en: 'Explain `try`, `except`, and `finally`.', hi: '`try`, `except` aur `finally` kaise kaam karte hain?' },
    answer: {
      en: '`try` runs risky code, `except` catches errors without crashing, and `finally` always runs (useful for closing files/connections).',
      hi: '`try` mein risky code chalta hai, `except` error pakadta hai, aur `finally` har haal mein end mein run hota hai.',
    },
  },
  {
    id: 'iq-13',
    category: 'Python Basics',
    question: { en: 'What is PEP 8?', hi: 'PEP 8 kya hota hai?' },
    answer: {
      en: 'Python’s official style guide: 4 spaces for indentation, snake_case variable names, clear spacing, and readable lines.',
      hi: 'Python ka official style guide: 4 spaces indentation, `snake_case` naming aur saaf readable code likhne ke rules.',
    },
  },
  {
    id: 'iq-14',
    category: 'Python Basics',
    question: { en: 'What is a Virtual Environment (`venv`)?', hi: 'Virtual Environment (`venv`) kyun banate hain?' },
    answer: {
      en: 'An isolated folder holding package versions (`pip install`) per project so two projects never clash over library versions.',
      hi: 'Har project ke liye alag isolated folder taaki ek project ke libraries dusre project se clash na karein.',
    },
  },
  {
    id: 'iq-15',
    category: 'Python Basics',
    question: { en: 'How is `/` different from `//` in Python?', hi: 'Python mein `/` aur `//` mein kya farq hai?' },
    answer: {
      en: '`/` gives true float division (`7 / 2 == 3.5`), while `//` gives floor integer division (`7 // 2 == 3`).',
      hi: '`/` decimal answer deta hai (`3.5`), jabki `//` integer part (floor) deta hai (`3`).',
    },
  },
  {
    id: 'iq-16',
    category: 'Python Basics',
    question: { en: 'What is `enumerate()` used for?', hi: '`enumerate()` kyun use karte hain?' },
    answer: {
      en: '`enumerate(items)` gives both index and value together during a `for` loop without writing `i = 0; i += 1`.',
      hi: '`enumerate()` loop mein index number aur item value dono ek saath de deta hai.',
    },
  },
  {
    id: 'iq-17',
    category: 'OOP & DSA',
    question: { en: 'What is the difference between a Class and an Object?', hi: 'Class aur Object mein kya antar hai?' },
    answer: {
      en: 'A Class is a blueprint (like a house map). An Object is a real instance created from that blueprint holding its own data.',
      hi: 'Class ek blueprint (naksha) hai aur Object us naksha se bani asli cheez jisme apna data hota hai.',
    },
    codeSnippet: 'class Car:\n    def __init__(self, model):\n        self.model = model\nc1 = Car("Punch")',
  },
  {
    id: 'iq-18',
    category: 'OOP & DSA',
    question: { en: 'Why is `self` the first parameter in class methods?', hi: 'Class ke methods mein pehla parameter `self` kyun likhte hain?' },
    answer: {
      en: '`self` refers to the specific object calling the method, letting Python access `self.balance` or `self.name` for that exact instance.',
      hi: '`self` current object ko point karta hai taaki method ko pata rahe kis student ya account ka data badalna hai.',
    },
  },
  {
    id: 'iq-19',
    category: 'OOP & DSA',
    question: { en: 'What does `__init__` do in a Python class?', hi: 'Python class mein `__init__` ka kya kaam hai?' },
    answer: {
      en: '`__init__` is the constructor method that runs automatically when a new object is created to set its initial attributes.',
      hi: '`__init__` constructor hai jo naya object bante hi automatically chal kar starting values set karta hai.',
    },
  },
  {
    id: 'iq-20',
    category: 'OOP & DSA',
    question: { en: 'Explain Inheritance with a simple example.', hi: 'Inheritance ko asaan example se samjhayein.' },
    answer: {
      en: 'Inheritance lets a Child class (`class ElectricCar(Car):`) inherit attributes and methods from a Parent class, avoiding duplicate code.',
      hi: 'Inheritance mein Child class Parent class ke saare features aur methods inherit kar leti hai, code repeat nahi hota.',
    },
  },
  {
    id: 'iq-21',
    category: 'OOP & DSA',
    question: { en: 'What is Polymorphism in OOP?', hi: 'OOP mein Polymorphism kya hota hai?' },
    answer: {
      en: 'Same method name behaving differently based on the object — e.g., `UPI.pay()` and `Card.pay()` both share `.pay()` interface.',
      hi: 'Ek hi method naam alag-alag classes mein alag tarah kaam kare — jaise `Dog.speak()` aur `Cat.speak()`.',
    },
  },
  {
    id: 'iq-22',
    category: 'OOP & DSA',
    question: { en: 'What is Encapsulation and `@property`?', hi: 'Encapsulation aur `@property` kya hai?' },
    answer: {
      en: 'Bundling data + methods together and protecting sensitive fields (like `_balance`) behind validation getters/methods.',
      hi: 'Data aur methods ko ek saath rakhna aur sensitive fields ko direct galat changes se bachana.',
    },
  },
  {
    id: 'iq-23',
    category: 'OOP & DSA',
    question: { en: 'What are Magic / Dunder methods like `__str__` and `__len__`?', hi: '`__str__` aur `__len__` jaise Dunder methods kya hote hain?' },
    answer: {
      en: 'Double-underscore methods customize built-in Python behavior: `__str__` controls `print(obj)` and `__len__` controls `len(obj)`.',
      hi: 'Double underscore (`__`) wale special methods jo `print(obj)` ya `len(obj)` par custom behavior dete hain.',
    },
  },
  {
    id: 'iq-24',
    category: 'OOP & DSA',
    question: { en: 'What is Big-O Notation (`O(1)`, `O(n)`, `O(log n)`)?', hi: 'Big-O Notation (`O(1)`, `O(n)`, `O(log n)`) kya batata hai?' },
    answer: {
      en: 'It measures how fast an algorithm scales as input size `n` grows. `O(1)` is instant, `O(log n)` halves search space, `O(n)` checks each item.',
      hi: 'Ye batata hai ki input badhne par code kitna time lega: `O(1)` instant, `O(log n)` super fast, `O(n)` har item check karta hai.',
    },
  },
  {
    id: 'iq-25',
    category: 'OOP & DSA',
    question: { en: 'Difference between Stack and Queue?', hi: 'Stack aur Queue mein kya antar hai?' },
    answer: {
      en: 'Stack is LIFO (Last In, First Out — like stacked plates, Undo history). Queue is FIFO (First In, First Out — like ticket counter line).',
      hi: 'Stack LIFO hota hai (jo last mein aaya woh pehle niklega — Undo feature). Queue FIFO hota hai (pehle aao pehle pao).',
    },
  },
  {
    id: 'iq-26',
    category: 'OOP & DSA',
    question: { en: 'When does Binary Search work, and why is it fast?', hi: 'Binary Search kab kaam karta hai aur itna fast kyun hai?' },
    answer: {
      en: 'Binary Search requires a **sorted** list. Checking the middle element eliminates half the remaining elements each step (`O(log n)`).',
      hi: 'Binary Search ke liye list **sorted** honi chahiye. Har step mein middle check kar ke aadhi list skip ho jati hai (`O(log n)`).',
    },
  },
  {
    id: 'iq-27',
    category: 'OOP & DSA',
    question: { en: 'What is Recursion and what is a Base Case?', hi: 'Recursion aur Base Case kya hota hai?' },
    answer: {
      en: 'A function calling itself on a smaller problem. The Base Case is the stopping condition (e.g., `if n <= 1: return 1`) to prevent infinite crash.',
      hi: 'Jab function khud ko chhote input par call kare. Base Case woh condition hai jahan recursion rukta hai.',
    },
  },
  {
    id: 'iq-28',
    category: 'OOP & DSA',
    question: { en: 'Why are Dictionaries (`dict`) faster for lookup than Lists (`list`)?', hi: 'Search karne mein Dictionary List se itni fast kyun hoti hai?' },
    answer: {
      en: 'Dictionaries use a Hash Table (`O(1)` average lookup), whereas checking `x in list` scans elements one by one (`O(n)`).',
      hi: 'Dictionary Hash Table use karti hai (`O(1)` instant lookup), jabki List ek-ek item check karti hai (`O(n)`).',
    },
  },
  {
    id: 'iq-29',
    category: 'OOP & DSA',
    question: { en: 'How does Bubble Sort work and what is its complexity?', hi: 'Bubble Sort kaise kaam karta hai?' },
    answer: {
      en: 'It repeatedly compares neighboring items and swaps them if out of order, bubbling the largest element to the end (`O(n^2)`).',
      hi: 'Ye bagal wale 2 numbers ko compare kar ke galat order par swap karta hai, jisse sabse bada number end mein pahunch jata hai (`O(n^2)`).',
    },
  },
  {
    id: 'iq-30',
    category: 'OOP & DSA',
    question: { en: 'What is Two-Pointer technique?', hi: 'Two-Pointer technique kya hoti hai?' },
    answer: {
      en: 'Using `left` and `right` indices moving inward (or same direction) to solve palindrome checks or sorted pair-sum in `O(n)` time.',
      hi: 'Do indices (`left` aur `right`) use kar ke palindrome ya pair-sum jaise problems ko `O(n)` fast time mein solve karna.',
    },
  },
  {
    id: 'iq-31',
    category: 'OOP & DSA',
    question: { en: 'What is a Linked List vs an Array/Python List?', hi: 'Linked List aur normal Python List mein kya farq hai?' },
    answer: {
      en: 'Python lists store contiguous references (`arr[5]` is `O(1)`). Linked Lists store Nodes `(value, next_ptr)` linked by references.',
      hi: 'Python list mein index access `O(1)` hota hai; Linked List mein har Node apne agle Node ka address (`next`) rakhta hai.',
    },
  },
  {
    id: 'iq-32',
    category: 'OOP & DSA',
    question: { en: 'What is Shallow Copy vs Deep Copy?', hi: 'Shallow Copy aur Deep Copy mein kya farq hai?' },
    answer: {
      en: 'Shallow copy copies outer references (nested lists remain shared); Deep copy duplicates nested objects recursively too.',
      hi: 'Shallow copy mein andar ki nested list shared rehti hai; Deep copy poora nested data alag copy banata hai.',
    },
  },
  {
    id: 'iq-33',
    category: 'Excel & Computer',
    question: { en: 'What is the difference between RAM and SSD/Hard Drive?', hi: 'RAM aur SSD/Hard Drive mein kya difference hai?' },
    answer: {
      en: 'RAM is fast temporary workspace memory cleared when power turns off. SSD/HDD is permanent storage keeping your files safely.',
      hi: 'RAM fast temporary workspace hai jo shut down par clear ho jati hai; SSD permanent storage hai jahan files hamesha save rehti hain.',
    },
  },
  {
    id: 'iq-34',
    category: 'Excel & Computer',
    question: { en: 'What does an Operating System (Windows/Linux) do?', hi: 'Operating System (Windows/Linux) ka main kaam kya hai?' },
    answer: {
      en: 'The OS manages CPU, RAM, storage, and hardware drivers so apps like Python, Chrome, and Excel can run smoothly.',
      hi: 'OS CPU, RAM, files aur apps ke beech manager ka kaam karta hai taaki sab programs bina takraye chalein.',
    },
  },
  {
    id: 'iq-35',
    category: 'Excel & Computer',
    question: { en: 'What is DNS and IP Address in simple words?', hi: 'Asaan shabdon mein DNS aur IP Address kya hai?' },
    answer: {
      en: 'IP Address is a computer’s numeric street address; DNS is the internet phonebook translating domain names like `google.com` to IPs.',
      hi: 'IP address computer ka numeric pata hai, aur DNS internet ki phonebook hai jo website naam ko IP mein badalti hai.',
    },
  },
  {
    id: 'iq-36',
    category: 'Excel & Computer',
    question: { en: 'Difference between `SUM`, `COUNT`, and `COUNTA` in Excel?', hi: 'Excel mein `SUM`, `COUNT` aur `COUNTA` mein kya farq hai?' },
    answer: {
      en: '`SUM` adds numbers, `COUNT` counts only cells with numbers, and `COUNTA` counts all non-empty cells including text.',
      hi: '`SUM` numbers jodta hai, `COUNT` sirf number cells ginta hai, aur `COUNTA` text + number sabhi bhare cells ginta hai.',
    },
  },
  {
    id: 'iq-37',
    category: 'Excel & Computer',
    question: { en: 'How does Excel’s `IF` formula work?', hi: 'Excel ka `IF` formula kaise kaam karta hai?' },
    answer: {
      en: '`=IF(condition, value_if_true, value_if_false)` — e.g., `=IF(C2>=40, "Pass", "Retry")`.',
      hi: '`=IF(shart, sahi_output, galat_output)` — jaise marks >= 40 par "Pass" dikhana.',
    },
  },
  {
    id: 'iq-38',
    category: 'Excel & Computer',
    question: { en: 'What is `VLOOKUP` / `XLOOKUP` used for?', hi: 'Excel mein `VLOOKUP` / `XLOOKUP` kyun use hota hai?' },
    answer: {
      en: 'To search a key (like Roll Number or Product ID) in one table and pull matching columns (Name, Price) automatically.',
      hi: 'Ek table mein ID ya Roll Number dhoondh kar dusre column se Name ya Price automatic lane ke liye.',
    },
  },
  {
    id: 'iq-39',
    category: 'Excel & Computer',
    question: { en: 'What is a Pivot Table in Excel?', hi: 'Excel mein Pivot Table kya hoti hai?' },
    answer: {
      en: 'An interactive summary tool that groups thousands of rows by category, month, or city in seconds without writing formulas.',
      hi: 'Hazaron rows ke data ko bina formula likhe category ya mahine ke hisab se turant summarize karne ka tool.',
    },
  },
  {
    id: 'iq-40',
    category: 'Excel & Computer',
    question: { en: 'What is Two-Factor Authentication (2FA) and why use it?', hi: 'Two-Factor Authentication (2FA) kya hai aur kyun zaroori hai?' },
    answer: {
      en: 'An extra verification step (OTP or Authenticator app) after your password so hackers cannot enter even if they steal your password.',
      hi: 'Password ke baad ek extra security lock (OTP/App), jisse password chori hone par bhi account safe rehta hai.',
    },
  },
  {
    id: 'iq-41',
    category: 'Excel & Computer',
    question: { en: 'How do you spot a phishing scam or fake UPI link?', hi: 'Phishing scam ya fake UPI link kaise pehchanein?' },
    answer: {
      en: 'Check misspelled URLs, avoid urgency threats, never share OTP/CVV, and remember UPI PIN is ONLY needed to SEND money—never to receive.',
      hi: 'Galat spelling wale URL check karein, jaldbazi wale messages se bachein, aur yaad rakhein UPI PIN sirf paise BHEJNE ke liye hota hai.',
    },
  },
  {
    id: 'iq-42',
    category: 'Projects & HR',
    question: { en: 'What is an API and what does JSON look like?', hi: 'API kya hoti hai aur JSON kaisa dikhta hai?' },
    answer: {
      en: 'An API lets two programs exchange data (like your app asking a weather server). JSON is lightweight key-value text matching Python dicts.',
      hi: 'API do apps ke beech data exchange karti hai. JSON ek lightweight key-value format hai jo Python dictionary jaisa dikhta hai.',
    },
  },
  {
    id: 'iq-43',
    category: 'Projects & HR',
    question: { en: 'How do you explain a beginner project in an interview?', hi: 'Interview mein apna beginner project kaise explain karein?' },
    answer: {
      en: 'Follow Problem -> Tech Stack -> Key Feature -> Bug You Solved. Example: "I built a Hostel Expense Tracker in Python using dicts & JSON to flag budget overruns."',
      hi: '4 steps mein batayein: Problem -> Skills Used -> Main Feature -> Ek Bug jo aapne khud solve kiya.',
    },
  },
  {
    id: 'iq-44',
    category: 'Projects & HR',
    question: { en: 'Why should you never push `.env` or API keys to GitHub?', hi: 'GitHub par `.env` ya API keys kyun upload nahi karni chahiye?' },
    answer: {
      en: 'Bots scan public GitHub repos in seconds and can misuse stolen API keys or passwords. Always list `.env` inside `.gitignore`.',
      hi: 'Public GitHub par bots seconds mein leaked keys dhoondh kar misuse kar sakte hain. Hamesha `.env` ko `.gitignore` mein rakhein.',
    },
  },
  {
    id: 'iq-45',
    category: 'Projects & HR',
    question: { en: 'What is `git commit` vs `git push`?', hi: '`git commit` aur `git push` mein kya farq hai?' },
    answer: {
      en: '`git commit` saves changes locally on your computer; `git push` uploads those saved commits to remote GitHub.',
      hi: '`git commit` aapke apne laptop par snapshot save karta hai, aur `git push` usko GitHub server par bhejta hai.',
    },
  },
  {
    id: 'iq-46',
    category: 'Projects & HR',
    question: { en: 'How do you handle a bug when your code gives wrong output with no error?', hi: 'Jab code bina error ke galat output de toh debug kaise karte hain?' },
    answer: {
      en: 'Reproduce with a tiny input, trace variables step-by-step (using `print()` or visualizer), and verify loop bounds & data types.',
      hi: 'Chhote input par run karein, Step Visualizer ya `print()` se variables ka state dekhein, aur loop range/types check karein.',
    },
  },
  {
    id: 'iq-47',
    category: 'Projects & HR',
    question: { en: 'I am from a non-CS / Arts / Commerce background. How do I justify entering IT?', hi: 'Main non-CS background se hoon. Interview mein IT switch kaise justify karoon?' },
    answer: {
      en: 'Show proof of work: point to your solved coding challenges, live GitHub projects, and how your domain knowledge (accounts/ops) + Python solves real business tasks.',
      hi: 'Apna Proof of Work dikhayein — GitHub projects, Excel/Python automation aur kaise aapka domain knowledge business problems solve karta hai.',
    },
  },
  {
    id: 'iq-48',
    category: 'Projects & HR',
    question: { en: 'What makes a clean `README.md` on GitHub?', hi: 'GitHub par ek achha `README.md` kaise likhein?' },
    answer: {
      en: 'Include Project Title, Problem Solved, Features list, How to Run (`python main.py`), and sample terminal output.',
      hi: 'Project title, kya problem solve karta hai, run karne ke steps aur sample output screenshot zaroor dalein.',
    },
  },
  {
    id: 'iq-49',
    category: 'Projects & HR',
    question: { en: 'Difference between SQL Database and CSV/Excel File?', hi: 'SQL Database aur CSV/Excel File mein kya antar hai?' },
    answer: {
      en: 'CSV/Excel works great for smaller single-user files; SQL databases handle millions of rows, concurrent users, and fast structured queries safely.',
      hi: 'CSV/Excel chhote data ke liye best hai; SQL database lakho rows aur multiple users ko ek saath safe tarike se handle karta hai.',
    },
  },
  {
    id: 'iq-50',
    category: 'Projects & HR',
    question: { en: 'What question should YOU ask the interviewer at the end?', hi: 'Interview ke end mein aapko interviewer se kya sawal puchna chahiye?' },
    answer: {
      en: 'Ask: "What would a typical week look like for a junior/intern in this role, and which skill would help me contribute fastest in the first 30 days?"',
      hi: 'Puchein: "Is role mein pehle 30 din mein team ko sabse zyada help karne ke liye mujhe kis skill par focus karna chahiye?"',
    },
  },
];
