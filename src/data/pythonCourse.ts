import { PythonLesson } from '../types';

// Complete 104-lesson Python curriculum (Beginner to Advanced-Intermediate)
// Core interactive lessons include full line-by-line walkthroughs, quizzes, and runnable mini-challenges.
// Every lesson 1..104 has structured bilingual titles, syntax, runnable starter code, explanation, and practice tasks.

interface CompactLessonSeed {
  number: number;
  unit: string;
  level: 'Beginner' | 'Intermediate';
  en: string;
  hi: string;
  expEn: string;
  expHi: string;
  whyEn: string;
  whyHi: string;
  exEn: string;
  exHi: string;
  syntax: string;
  code: string;
  output: string;
  mistakeEn: string;
  mistakeHi: string;
  taskEn: string;
  taskHi: string;
  challengeEn: string;
  challengeHi: string;
  starter: string;
  challengeOut: string;
  projectEn: string;
  projectHi: string;
  quizQEn: string;
  quizQHi: string;
  quizOpts: [string, string, string];
  quizAns: number;
}

const CORE_SEEDS: CompactLessonSeed[] = [
  {
    number: 1,
    unit: 'Unit 1: Getting Started',
    level: 'Beginner',
    en: 'What is Programming?',
    hi: 'प्रोग्रामिंग क्या है?',
    expEn: 'Programming is writing clear step-by-step instructions so a computer can solve a problem for you.',
    expHi: 'प्रोग्रामिंग का मतलब कंप्यूटर को आसान और क्रमबद्ध निर्देश देना है ताकि वह आपका काम कर सके।',
    whyEn: 'Computers cannot guess what you want; programming turns your ideas into exact steps.',
    whyHi: 'कंप्यूटर खुद से सोच नहीं सकता; प्रोग्रामिंग आपके विचार को सटीक निर्देशों में बदलती है।',
    exEn: 'Like writing a chai recipe for a friend who has never cooked: exact water, tea leaves, sugar, and time.',
    exHi: 'जैसे किसी दोस्त के लिए चाय बनाने की स्टेप-बाय-स्टेप रेसिपी लिखना।',
    syntax: 'print("Step 1: Boil water")',
    code: 'print("Step 1: Boil water")\nprint("Step 2: Add tea leaves")\nprint("Step 3: Serve hot chai!")',
    output: 'Step 1: Boil water\nStep 2: Add tea leaves\nStep 3: Serve hot chai!',
    mistakeEn: 'Skipping steps or assuming the computer knows what you mean.',
    mistakeHi: 'बीच के स्टेप छोड़ देना या मान लेना कि कंप्यूटर खुद समझ जाएगा।',
    taskEn: 'Change Step 3 to print your favorite snack with chai.',
    taskHi: 'Step 3 को बदलकर चाय के साथ अपना पसंदीदा नाश्ता प्रिंट करें।',
    challengeEn: 'Print 2 lines: "Hello India" and "Ready to learn".',
    challengeHi: '2 लाइनें प्रिंट करें: "Hello India" और "Ready to learn"।',
    starter: 'print("Hello India")\n# Print second line below\n',
    challengeOut: 'Hello India\nReady to learn',
    projectEn: 'Daily Morning Routine Printer',
    projectHi: 'सुबह की दिनचर्या प्रिंटर',
    quizQEn: 'What is a computer program?',
    quizQHi: 'कंप्यूटर प्रोग्राम क्या होता है?',
    quizOpts: ['Step-by-step instructions for a computer', 'A hardware cable', 'A Windows wallpaper'],
    quizAns: 0,
  },
  {
    number: 4,
    unit: 'Unit 1: Getting Started',
    level: 'Beginner',
    en: 'First Program: print("Hello, World!")',
    hi: 'पहला प्रोग्राम: print("Hello, World!")',
    expEn: 'The print() function shows text or numbers on the screen.',
    expHi: 'print() फ़ंक्शन स्क्रीन पर टेक्स्ट या नंबर दिखाता है।',
    whyEn: 'Printing output lets you display answers to users and check what your program is doing.',
    whyHi: 'आउटपुट दिखाने और अपने प्रोग्राम की जाँच करने के लिए print() सबसे ज़्यादा काम आता है।',
    exEn: 'Like a shopkeeper speaking out your bill total so you can hear it.',
    exHi: 'जैसे दुकानदार आपका कुल बिल बोलकर बताता है।',
    syntax: 'print("Your message here")',
    code: 'print("Hello, World!")\nprint("Namaste TechStart India!")',
    output: 'Hello, World!\nNamaste TechStart India!',
    mistakeEn: 'Writing Print with capital P (Python is case-sensitive) or forgetting quotes around text.',
    mistakeHi: 'बड़े P से Print लिखना या टेक्स्ट के दोनों तरफ कोट्स (" ") लगाना भूल जाना।',
    taskEn: 'Print your name and city on two separate lines.',
    taskHi: 'दो अलग लाइनों में अपना नाम और शहर प्रिंट करें।',
    challengeEn: 'Print exactly: Welcome to Python',
    challengeHi: 'बिल्कुल यही प्रिंट करें: Welcome to Python',
    starter: 'print("Welcome to Python")',
    challengeOut: 'Welcome to Python',
    projectEn: 'Digital Visiting Card Printer',
    projectHi: 'डिजिटल विज़िटिंग कार्ड प्रिंटर',
    quizQEn: 'Which statement correctly prints Namaste?',
    quizQHi: 'इनमें से कौन-सा कोड सही तरीके से Namaste प्रिंट करेगा?',
    quizOpts: ['print("Namaste")', 'Print("Namaste")', 'print(Namaste)'],
    quizAns: 0,
  },
  {
    number: 6,
    unit: 'Unit 2: Variables & Data Types',
    level: 'Beginner',
    en: 'Variables: Storing Information',
    hi: 'वेरिएबल्स (Variables): डेटा स्टोर करना',
    expEn: 'A variable is a named container that stores a value in memory so you can reuse it later.',
    expHi: 'वेरिएबल एक नाम वाला डिब्बा है जिसमें आप डेटा रखते हैं ताकि बाद में उसका उपयोग कर सकें।',
    whyEn: 'Without variables, your app could not remember a user’s name, score, or bank balance.',
    whyHi: 'वेरिएबल के बिना कोई ऐप यूज़र का नाम, स्कोर या बैलेंस याद नहीं रख सकता।',
    exEn: 'Like kitchen jars labeled "Sugar", "Tea", and "Rice" — the label stays, and you can change what is inside.',
    exHi: 'रसोई के डिब्बों की तरह जिन पर "चीनी", "चाय" लिखा होता है।',
    syntax: 'variable_name = value',
    code: 'name = "Aarav"\nage = 20\ncity = "Jaipur"\nprint(name)\nprint(age)',
    output: 'Aarav\n20',
    mistakeEn: 'Starting a variable name with a number (like 1name) or putting spaces inside names (my name). Use underscores: my_name.',
    mistakeHi: 'वेरिएबल नाम की शुरुआत नंबर से करना (जैसे 1name) या नाम में स्पेस देना। हमेशा अंडरस्कोर (_) लगाएँ।',
    taskEn: 'Create variables for your college/city and favorite subject, then print both.',
    taskHi: 'अपने शहर और पसंदीदा विषय के लिए वेरिएबल बनाएँ और उन्हें प्रिंट करें।',
    challengeEn: 'Store 15 in variable x and 25 in variable y, then print x + y.',
    challengeHi: 'x में 15 और y में 25 स्टोर करें, फिर x + y प्रिंट करें।',
    starter: 'x = 15\ny = 25\nprint(x + y)',
    challengeOut: '40',
    projectEn: 'Student ID Card Generator',
    projectHi: 'स्टूडेंट आईडी कार्ड जनरेटर',
    quizQEn: 'Which is a valid Python variable name?',
    quizQHi: 'इनमें से कौन-सा वेरिएबल नाम सही है?',
    quizOpts: ['student_marks', '1student', 'student marks'],
    quizAns: 0,
  },
  {
    number: 8,
    unit: 'Unit 2: Variables & Data Types',
    level: 'Beginner',
    en: 'User Input & Type Conversion',
    hi: 'यूज़र इनपुट और टाइप कन्वर्ज़न',
    expEn: 'input() reads text from the user. Use int() or float() when you want to do math with that input.',
    expHi: 'input() यूज़र से टेक्स्ट लेता है। अगर उस पर गणित करना हो, तो int() या float() से नंबर में बदलें।',
    whyEn: 'Interactive programs like calculators, ATM menus, and forms depend on user input.',
    whyHi: 'कैलकुलेटर, फॉर्म और गेम्स सब यूज़र इनपुट से ही चलते हैं।',
    exEn: 'input() always hands you a sealed envelope of text — int() opens it and converts it into a number.',
    exHi: 'input() हमेशा टेक्स्ट देता है — int() उसे गिनती वाले नंबर में बदलता है।',
    syntax: 'num = int(input("Enter number: "))',
    code: 'price = int("120")\ntax = int("18")\nprint("Total:", price + tax)',
    output: 'Total: 138',
    mistakeEn: 'Adding two input() strings directly: "5" + "3" gives "53" instead of 8!',
    mistakeHi: 'input() को बिना int() में बदले जोड़ने पर "5" + "3" का उत्तर 8 की जगह "53" आ जाता है!',
    taskEn: 'Convert string "45" to int and multiply it by 2.',
    taskHi: 'स्ट्रिंग "45" को int() से बदलकर 2 से गुणा करें।',
    challengeEn: 'Given a = "10" and b = "20", convert both to int and print their sum.',
    challengeHi: 'a = "10" और b = "20" को int में बदलें और उनका योग प्रिंट करें।',
    starter: 'a = "10"\nb = "20"\n# Print sum as integer\nprint(int(a) + int(b))',
    challengeOut: '30',
    projectEn: 'Simple Tea Stall Bill Calculator',
    projectHi: 'चाय की दुकान का बिल कैलकुलेटर',
    quizQEn: 'What does "5" + "3" produce in Python?',
    quizQHi: 'Python में "5" + "3" का परिणाम क्या होगा?',
    quizOpts: ['"53"', '8', '15'],
    quizAns: 0,
  },
  {
    number: 11,
    unit: 'Unit 3: Strings & Text',
    level: 'Beginner',
    en: 'Strings, Methods & f-Strings',
    hi: 'स्ट्रिंग्स, मेथड्स और f-Strings',
    expEn: 'Strings hold text. Built-in methods like .upper(), .strip(), and f-strings make text formatting effortless.',
    expHi: 'स्ट्रिंग्स टेक्स्ट रखती हैं। .upper(), .strip() और f-strings से टेक्स्ट को सजाना बहुत आसान होता है।',
    whyEn: 'Cleaning user names, emails, and printing clear messages uses string formatting everywhere.',
    whyHi: 'यूज़र का नाम, ईमेल साफ करना और सही संदेश दिखाना हर प्रोजेक्ट में काम आता है।',
    exEn: 'f-string is like a pre-printed wedding card with blank spaces {name} filled automatically.',
    exHi: 'f-string छपे हुए निमंत्रण कार्ड जैसा है जिसमें {name} की जगह नाम अपने आप भर जाता है।',
    syntax: 'print(f"Hello {name.title()}")',
    code: 'raw_name = "  priya sharma  "\nclean = raw_name.strip().title()\nprint(f"Welcome, {clean}!")',
    output: 'Welcome, Priya Sharma!',
    mistakeEn: 'Forgetting the letter f before the quotes in an f-string.',
    mistakeHi: 'f-string में कोट्स से पहले f लिखना भूल जाना।',
    taskEn: 'Create city = "indore" and print "I live in Indore" using .title() and f-string.',
    taskHi: 'city = "indore" बनाएँ और .title() व f-string से "I live in Indore" प्रिंट करें।',
    challengeEn: 'Print "PYTHON" from text = "python" using a string method.',
    challengeHi: 'text = "python" से स्ट्रिंग मेथड का उपयोग करके "PYTHON" प्रिंट करें।',
    starter: 'text = "python"\nprint(text.upper())',
    challengeOut: 'PYTHON',
    projectEn: 'Certificate Name Formatter',
    projectHi: 'सर्टिफिकेट नाम फॉर्मेटर',
    quizQEn: 'What does "  hello  ".strip() return?',
    quizQHi: '"  hello  ".strip() क्या लौटाएगा?',
    quizOpts: ['"hello"', '"HELLO"', '"  hello"'],
    quizAns: 0,
  },
  {
    number: 14,
    unit: 'Unit 4: Decisions & Loops',
    level: 'Beginner',
    en: 'Conditions: if, elif, else',
    hi: 'निर्णय लेना: if, elif, else',
    expEn: 'if/elif/else lets your program choose different actions depending on whether a condition is True or False.',
    expHi: 'if/elif/else आपके प्रोग्राम को शर्त के सही या गलत होने के आधार पर अलग-अलग फैसला लेने देता है।',
    whyEn: 'Checking exam pass/fail, ATM PIN validation, and discount rules all use conditions.',
    whyHi: 'परीक्षा पास/फेल, ATM पिन जाँच और डिस्काउंट नियम सब इन्हीं शर्तों पर चलते हैं।',
    exEn: 'At a traffic signal: IF green → go, ELIF yellow → slow down, ELSE → stop.',
    exHi: 'ट्रैफिक सिग्नल की तरह: अगर हरा है → चलें, नहीं तो अगर पीला है → धीमे हों, वरना → रुकें।',
    syntax: 'if score >= 40:\n    print("Pass")\nelse:\n    print("Try Again")',
    code: 'marks = 78\nif marks >= 75:\n    print("Distinction")\nelif marks >= 40:\n    print("Pass")\nelse:\n    print("Needs Improvement")',
    output: 'Distinction',
    mistakeEn: 'Using = instead of == for comparison, or forgetting the colon (:) at the end of if.',
    mistakeHi: 'तुलना के लिए == की जगह = लिखना या if के अंत में कोलन (:) भूल जाना।',
    taskEn: 'Change marks to 35 and run to see which branch executes.',
    taskHi: 'marks को 35 करके चलाएँ और देखें कौन-सा संदेश आता है।',
    challengeEn: 'Check age = 19: print "Adult" if age >= 18 else "Minor".',
    challengeHi: 'age = 19 की जाँच करें: अगर age >= 18 हो तो "Adult" नहीं तो "Minor" प्रिंट करें।',
    starter: 'age = 19\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")',
    challengeOut: 'Adult',
    projectEn: 'Scholarship Eligibility Checker',
    projectHi: 'स्कॉलरशिप पात्रता चेकर',
    quizQEn: 'Which symbol checks if two values are equal in Python?',
    quizQHi: 'Python में दो मान बराबर हैं या नहीं, यह किस चिह्न से जांचते हैं?',
    quizOpts: ['==', '=', '!='],
    quizAns: 0,
  },
  {
    number: 15,
    unit: 'Unit 4: Decisions & Loops',
    level: 'Beginner',
    en: 'Loops: for and while',
    hi: 'लूप्स (Loops): for और while',
    expEn: 'A loop repeats a block of code automatically until a count or condition finishes.',
    expHi: 'लूप एक ही काम को अपने आप बार-बार दोहराता है जब तक गिनती या शर्त पूरी न हो जाए।',
    whyEn: 'Instead of writing print() 1,000 times, a 2-line loop processes 1,000 students or bills in milliseconds.',
    whyHi: '1,000 बार print() लिखने की जगह 2 लाइन का लूप सेकंड के हिस्से में पूरा डेटा प्रोसेस कर देता है।',
    exEn: 'If you have to write "I will practice coding" 10 times, a loop does it automatically like a photocopier.',
    exHi: 'अगर आपको "मैं कोडिंग अभ्यास करूँगा" 10 बार लिखना है, तो लूप उसे फोटोकॉपी मशीन की तरह तुरंत कर देता है।',
    syntax: 'for i in range(5):\n    print(i)',
    code: 'for i in range(1, 6):\n    print("Practice day", i)',
    output: 'Practice day 1\nPractice day 2\nPractice day 3\nPractice day 4\nPractice day 5',
    mistakeEn: 'Forgetting indentation (4 spaces) inside the loop, or writing a while loop whose condition never becomes False.',
    mistakeHi: 'लूप के अंदर 4 स्पेस की इंडेंटेशन भूल जाना, या ऐसा while लूप लिखना जो कभी रुके ही नहीं।',
    taskEn: 'Write a program that prints numbers from 1 to 20.',
    taskHi: '1 से 20 तक गिनती प्रिंट करने वाला प्रोग्राम लिखें।',
    challengeEn: 'Print even numbers from 2 to 10 (each on a new line).',
    challengeHi: '2 से 10 तक सम संख्याएँ (even numbers) प्रिंट करें।',
    starter: 'for i in range(2, 11, 2):\n    print(i)',
    challengeOut: '2\n4\n6\n8\n10',
    projectEn: 'Multiplication Table Generator',
    projectHi: 'पहाड़ा (Table) जनरेटर',
    quizQEn: 'What numbers does range(3) produce?',
    quizQHi: 'range(3) कौन-सी संख्याएँ देता है?',
    quizOpts: ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3'],
    quizAns: 0,
  },
  {
    number: 17,
    unit: 'Unit 5: Data Collections',
    level: 'Beginner',
    en: 'Lists, Tuples, Sets & Dictionaries',
    hi: 'लिस्ट, टपल, सेट और डिक्शनरी',
    expEn: 'Lists store ordered changeable items [ ]; Tuples are fixed ( ); Sets remove duplicates { }; Dictionaries store key:value pairs.',
    expHi: 'लिस्ट [ ] में क्रम से बदल सकने वाले आइटम; टपल ( ) में स्थायी डेटा; सेट { } में बिना दोहराव डेटा; डिक्शनरी में key:value डेटा रहता है।',
    whyEn: 'Every real app stores lists of products, sets of unique tags, or dictionaries of user profiles.',
    whyHi: 'हर असली ऐप प्रोडक्ट की लिस्ट या यूज़र प्रोफाइल की डिक्शनरी इन्हीं से बनाता है।',
    exEn: 'List = shopping list; Tuple = GPS coordinates; Set = unique roll numbers; Dictionary = phonebook (Name → Number).',
    exHi: 'लिस्ट = किराना लिस्ट; टपल = पक्का पता; सेट = बिना डुप्लीकेट रोल नंबर; डिक्शनरी = फोनबुक (नाम → नंबर)।',
    syntax: 'student = {"name": "Riya", "marks": 88}',
    code: 'skills = ["Excel", "Python", "Git"]\nskills.append("SQL")\nprint(skills)\nprofile = {"name": "Riya", "city": "Pune"}\nprint(profile["city"])',
    output: "['Excel', 'Python', 'Git', 'SQL']\nPune",
    mistakeEn: 'Trying to access index 3 in a 3-item list (remember Python starts counting at 0!).',
    mistakeHi: '3 आइटम की लिस्ट में इंडेक्स 3 माँगना (याद रखें Python गिनती 0 से शुरू करता है!)।',
    taskEn: 'Create a list of 3 Indian states, add a 4th with .append(), and print its length using len().',
    taskHi: '3 भारतीय राज्यों की लिस्ट बनाएँ, .append() से चौथा जोड़ें और len() से लंबाई प्रिंट करें।',
    challengeEn: 'Given nums = [4, 7, 2], print their sum using sum(nums).',
    challengeHi: 'nums = [4, 7, 2] का कुल योग sum(nums) से प्रिंट करें।',
    starter: 'nums = [4, 7, 2]\nprint(sum(nums))',
    challengeOut: '13',
    projectEn: 'Hostel Grocery List Manager',
    projectHi: 'हॉस्टल किराना लिस्ट मैनेजर',
    quizQEn: 'Which collection stores Key:Value pairs like "name": "Amit"?',
    quizQHi: 'कौन-सा कलेक्शन "name": "Amit" जैसे Key:Value जोड़े रखता है?',
    quizOpts: ['Dictionary', 'Set', 'Tuple'],
    quizAns: 0,
  },
  {
    number: 21,
    unit: 'Unit 6: Functions & Scope',
    level: 'Beginner',
    en: 'Functions, Arguments & Return Values',
    hi: 'फ़ंक्शन्स (Functions), आर्गुमेंट और रिटर्न वैल्यू',
    expEn: 'A function is a reusable mini-machine you write once with `def` and call whenever needed.',
    expHi: 'फ़ंक्शन एक बार बनाया गया उपयोगी कोड ब्लॉक है (`def` से) जिसे आप बार-बार उपयोग कर सकते हैं।',
    whyEn: 'Functions keep code clean, avoid copy-pasting, and make testing easy.',
    whyHi: 'फ़ंक्शन्स से कोड साफ रहता है और एक ही कोड बार-बार कॉपी नहीं करना पड़ता।',
    exEn: 'Like a juice machine: pass oranges in (arguments), and it returns orange juice (return value).',
    exHi: 'जूस मशीन की तरह: अंदर संतरा डालें (arguments) और बाहर जूस मिले (return value)।',
    syntax: 'def add(a, b):\n    return a + b',
    code: 'def apply_discount(price, percent=10):\n    return price - (price * percent / 100)\n\nfinal_bill = apply_discount(500, 20)\nprint(int(final_bill))',
    output: '400',
    mistakeEn: 'Using print() inside a function when you actually needed return, causing the result to be None.',
    mistakeHi: 'फ़ंक्शन में return की जगह print() लिख देने से बाहर मान None मिलता है।',
    taskEn: 'Write a function square(n) that returns n * n and print square(9).',
    taskHi: 'square(n) फ़ंक्शन बनाएँ जो n * n लौटाए और square(9) प्रिंट करें।',
    challengeEn: 'Define greet(name) returning "Hello " + name, then print greet("Kiran").',
    challengeHi: 'greet(name) फ़ंक्शन बनाएँ जो "Hello " + name लौटाए और greet("Kiran") प्रिंट करें।',
    starter: 'def greet(name):\n    return "Hello " + name\n\nprint(greet("Kiran"))',
    challengeOut: 'Hello Kiran',
    projectEn: 'GST & Discount Calculator Library',
    projectHi: 'GST और डिस्काउंट कैलकुलेटर',
    quizQEn: 'Which keyword creates a function in Python?',
    quizQHi: 'Python में फ़ंक्शन बनाने के लिए किस कीवर्ड का उपयोग होता है?',
    quizOpts: ['def', 'function', 'create'],
    quizAns: 0,
  },
  {
    number: 24,
    unit: 'Unit 7: Errors, Files & Modules',
    level: 'Beginner',
    en: 'Error Handling: try, except, finally',
    hi: 'एरर हैंडलिंग: try, except, finally',
    expEn: 'try/except catches unexpected errors gracefully so your program gives a helpful message instead of crashing.',
    expHi: 'try/except अनचाहे एरर को पकड़ लेता है ताकि आपका प्रोग्राम क्रैश होने के बजाय साफ संदेश दे सके।',
    whyEn: 'Real users often type "abc" when asked for a phone number or divide by zero. Good apps never crash.',
    whyHi: 'असली यूज़र कभी-कभी नंबर की जगह अक्षर टाइप कर देते हैं — अच्छा ऐप कभी क्रैश नहीं होता।',
    exEn: 'Like a cricket wicketkeeper standing behind the batsman to catch missed balls safely.',
    exHi: 'क्रिकेट में विकेटकीपर की तरह जो छूटी हुई गेंद को संभाल लेता है।',
    syntax: 'try:\n    x = int("abc")\nexcept:\n    print("Please enter digits only")',
    code: 'try:\n    total = 100 / 0\nexcept:\n    print("Cannot divide by zero!")\nfinally:\n    print("Check complete")',
    output: 'Cannot divide by zero!\nCheck complete',
    mistakeEn: 'Hiding errors silently with empty except blocks without telling the user.',
    mistakeHi: 'except के अंदर कोई संदेश न दिखाकर गलती को चुपचाप छिपा देना।',
    taskEn: 'Try converting "hello" with int() inside a try/except block.',
    taskHi: 'try/except के अंदर "hello" को int() में बदलने का प्रयास करें।',
    challengeEn: 'Catch ZeroDivisionError for 10/0 and print "Safe"',
    challengeHi: '10/0 की गलती को try/except में पकड़ें और "Safe" प्रिंट करें।',
    starter: 'try:\n    ans = 10 / 0\nexcept:\n    print("Safe")',
    challengeOut: 'Safe',
    projectEn: 'Crash-Proof EMI Calculator',
    projectHi: 'क्रैश-प्रूफ EMI कैलकुलेटर',
    quizQEn: 'Which block runs only when an error happens inside try?',
    quizQHi: 'try के अंदर गलती होने पर कौन-सा ब्लॉक चलता है?',
    quizOpts: ['except', 'for', 'return'],
    quizAns: 0,
  },
  {
    number: 31,
    unit: 'Unit 8: Functional Python & Comprehensions',
    level: 'Intermediate',
    en: 'Lambda, map, filter & List Comprehensions',
    hi: 'Lambda, map, filter और List Comprehensions',
    expEn: 'List comprehensions and lambda let you transform and filter lists cleanly in a single readable line.',
    expHi: 'List comprehension और lambda से आप एक ही साफ लाइन में पूरी लिस्ट बदल या छांट सकते हैं।',
    whyEn: 'Data analysts and backend engineers write comprehensions daily to clean datasets fast.',
    whyHi: 'डेटा एनालिस्ट और बैकएंड डेवलपर डेटा साफ करने के लिए इनका रोज़ उपयोग करते हैं।',
    exEn: 'Instead of filling a bucket with apples one by one, a comprehension filters ripe apples straight into a new basket.',
    exHi: 'एक-एक सेब चुनने के बजाय छानकर सीधे नई टोकरी में पके सेब भरना।',
    syntax: 'squares = [x * x for x in nums if x > 0]',
    code: 'prices = [100, 250, 80, 400]\nhigh = [p for p in prices if p >= 100]\ndoubled = list(map(lambda x: x * 2, [1, 2, 3]))\nprint(high)\nprint(doubled)',
    output: '[100, 250, 400]\n[2, 4, 6]',
    mistakeEn: 'Making a comprehension too complex with 3 nested loops — keep it readable!',
    mistakeHi: 'एक ही लाइन में बहुत ज़्यादा जटिल शर्तें लिखना जिससे कोड पढ़ना मुश्किल हो जाए।',
    taskEn: 'Create a list comprehension of squares from 1 to 5.',
    taskHi: '1 से 5 तक की संख्याओं के वर्गों (squares) की लिस्ट बनाएँ।',
    challengeEn: 'Filter even numbers from [1, 2, 3, 4, 5, 6] using list comprehension.',
    challengeHi: '[1, 2, 3, 4, 5, 6] में से सम संख्याएँ छांटकर प्रिंट करें।',
    starter: 'nums = [1, 2, 3, 4, 5, 6]\nevens = [n for n in nums if n % 2 == 0]\nprint(evens)',
    challengeOut: '[2, 4, 6]',
    projectEn: 'Sales Tax Batch Processor',
    projectHi: 'बिक्री टैक्स बैच प्रोसेसर',
    quizQEn: 'What does [x*2 for x in [1, 2, 3]] return?',
    quizQHi: '[x*2 for x in [1, 2, 3]] का आउटपुट क्या होगा?',
    quizOpts: ['[2, 4, 6]', '[1, 2, 3]', '[2, 3, 4]'],
    quizAns: 0,
  },
  {
    number: 36,
    unit: 'Unit 9: Object-Oriented Programming (OOP)',
    level: 'Intermediate',
    en: 'Classes, Objects, Constructors & Inheritance',
    hi: 'Classes, Objects, __init__ Constructor aur Inheritance (OOP)',
    expEn: 'A Class is a blueprint; an Object is the real item built from it. Inheritance lets child classes reuse parent features.',
    expHi: 'Class ek blueprint (naksha) hai aur Object usse bani asli cheez. Inheritance se child class parent class ke features reuse karti hai.',
    whyEn: 'Large software systems (banking, e-commerce, Django/FastAPI) organize thousands of lines using OOP.',
    whyHi: 'Bade software aur backend frameworks (Django/FastAPI) OOP ke blueprint par hi bante hain.',
    exEn: 'Class = House blueprint drawn by an architect; Objects = actual houses built from that same blueprint with different paint colors.',
    exHi: 'Class = Ghar ka naksha; Objects = us naksha se bane alag-alag rang ke asli ghar.',
    syntax: 'class Student:\n    def __init__(self, name):\n        self.name = name',
    code: 'class Student:\n    def __init__(self, name, course):\n        self.name = name\n        self.course = course\n\n    def intro(self):\n        return f"{self.name} studies {self.course}"\n\ns1 = Student("Neha", "Python")\nprint(s1.intro())',
    output: 'Neha studies Python',
    mistakeEn: 'Forgetting `self` as the first parameter inside class methods in Python.',
    mistakeHi: 'Class methods mein pehla parameter `self` likhna bhool jana.',
    taskEn: 'Create a second student object `s2 = Student("Arjun", "Excel")` and print `s2.intro()`.',
    taskHi: 'Ek dusra object `s2 = Student("Arjun", "Excel")` banayein aur `s2.intro()` print karein.',
    challengeEn: 'Create class Car with __init__(self, model) and print "Car: Tata Punch".',
    challengeHi: 'Car class banayein jisme __init__(self, model) ho aur "Car: Tata Punch" print karein.',
    starter: 'class Car:\n    def __init__(self, model):\n        self.model = model\n\nc = Car("Tata Punch")\nprint(f"Car: {c.model}")',
    challengeOut: 'Car: Tata Punch',
    projectEn: 'Library Book & Member System',
    projectHi: 'Library Book & Member OOP System',
    quizQEn: 'What is the special constructor method in a Python class?',
    quizQHi: 'Python class mein special constructor method ka naam kya hota hai?',
    quizOpts: ['__init__', '__start__', 'create'],
    quizAns: 0,
  },
  {
    number: 44,
    unit: 'Unit 10: Files, APIs, Concurrency & Pro Code',
    level: 'Intermediate',
    en: 'JSON, CSV, APIs, Regex & Clean Production Code',
    hi: 'JSON, CSV, API, Regex aur Clean Production Code',
    expEn: 'Real software reads CSV/JSON files, fetches live weather/news from APIs using requests, validates text with Regex, and stays clean.',
    expHi: 'Real software CSV/JSON files padhta hai, API se data lata hai, Regex se text check karta hai aur clean code rakhta hai.',
    whyEn: 'These are the exact skills companies test in entry-level Python developer and data analyst interviews.',
    whyHi: 'Entry-level Python developer aur data analyst interviews mein yahi skills sabse zyada puchi jati hain.',
    exEn: 'An API is a restaurant waiter: your Python script places an order (GET request) and receives structured food (JSON response).',
    exHi: 'API restaurant ke waiter jaisa hai: aapka Python code order bhejta hai aur JSON format mein data lata hai.',
    syntax: 'data = {"city": "Bhopal", "temp": 29}\nprint(data["city"])',
    code: 'weather_json = {"city": "Bhopal", "temp_c": 29, "status": "Sunny"}\nprint(f"{weather_json[\'city\']}: {weather_json[\'temp_c\']}C ({weather_json[\'status\']})")',
    output: 'Bhopal: 29C (Sunny)',
    mistakeEn: 'Hardcoding secret API keys directly inside GitHub files instead of using environment variables (.env).',
    mistakeHi: 'Secret API keys ko seedhe code mein likh kar GitHub par push karna (hamesha .env file use karein).',
    taskEn: 'Read a sample JSON dictionary and extract 2 fields cleanly.',
    taskHi: 'Ek sample JSON dictionary se 2 fields nikal kar print karein.',
    challengeEn: 'Given user = {"role": "intern", "active": True}, print user["role"].upper().',
    challengeHi: 'user = {"role": "intern", "active": True} se role ko uppercase mein print karein.',
    starter: 'user = {"role": "intern", "active": True}\nprint(user["role"].upper())',
    challengeOut: 'INTERN',
    projectEn: 'Live Weather CLI Dashboard',
    projectHi: 'Live Weather CLI Dashboard',
    quizQEn: 'Which data format is most commonly returned by modern web APIs?',
    quizQHi: 'Modern web APIs sabse zyada kis format mein data return karte hain?',
    quizOpts: ['JSON', 'MP3', 'BMP'],
    quizAns: 0,
  },
];

// Full syllabus mapping (54 core + 50 applied intermediate + 16 Advanced OOP/DSA = 120 lessons)
const SYLLABUS_TITLES: { en: string; hi: string; unit: string; level: 'Beginner' | 'Intermediate' | 'Advanced'; code: string; out: string }[] = [
  { en: 'What is Programming?', hi: 'Programming kya hai?', unit: 'Unit 1: Getting Started', level: 'Beginner', code: 'print("Step 1: Learn logic")', out: 'Step 1: Learn logic' },
  { en: 'What is Python & Why Learn It?', hi: 'Python kya hai aur kyun seekhein?', unit: 'Unit 1: Getting Started', level: 'Beginner', code: 'print("Python powers AI, Web, Data!")', out: 'Python powers AI, Web, Data!' },
  { en: 'Installing Python & VS Code', hi: 'Python aur VS Code install karna', unit: 'Unit 1: Getting Started', level: 'Beginner', code: 'print("Python 3 ready!")', out: 'Python 3 ready!' },
  { en: 'First Program: Hello, World!', hi: 'First Program: Hello, World!', unit: 'Unit 1: Getting Started', level: 'Beginner', code: 'print("Hello, World!")', out: 'Hello, World!' },
  { en: 'Comments & Readable Notes', hi: 'Comments (#) aur readable notes likhna', unit: 'Unit 1: Getting Started', level: 'Beginner', code: '# Single-line comment\nprint("Clean code!")', out: 'Clean code!' },
  { en: 'Variables & Naming Rules', hi: 'Variables aur naming rules', unit: 'Unit 2: Variables & Data Types', level: 'Beginner', code: 'city = "Patna"\nprint(city)', out: 'Patna' },
  { en: 'Data Types: int, float, str, bool', hi: 'Data Types: int, float, str, bool', unit: 'Unit 2: Variables & Data Types', level: 'Beginner', code: 'x = 10\ny = 3.5\nprint(type(x))', out: "<class 'int'>" },
  { en: 'Input and Output Basics', hi: 'Input aur Output basics', unit: 'Unit 2: Variables & Data Types', level: 'Beginner', code: 'name = "Rohan"\nprint("Hi", name)', out: 'Hi Rohan' },
  { en: 'Arithmetic & Comparison Operators', hi: 'Math aur Comparison Operators (+, -, ==)', unit: 'Unit 2: Variables & Data Types', level: 'Beginner', code: 'print(17 // 5, 17 % 5)', out: '3 2' },
  { en: 'Type Conversion: int(), float(), str()', hi: 'Type Conversion: int(), float(), str()', unit: 'Unit 2: Variables & Data Types', level: 'Beginner', code: 'print(int("25") + 5)', out: '30' },
  { en: 'Strings & Indexing', hi: 'Strings aur Indexing', unit: 'Unit 3: Strings & Text', level: 'Beginner', code: 'word = "India"\nprint(word[0], word[-1])', out: 'I a' },
  { en: 'String Slicing [start:end]', hi: 'String Slicing [start:end]', unit: 'Unit 3: Strings & Text', level: 'Beginner', code: 's = "TechStart"\nprint(s[0:4])', out: 'Tech' },
  { en: 'String Methods: upper, lower, strip, replace', hi: 'String Methods: upper, strip, replace', unit: 'Unit 3: Strings & Text', level: 'Beginner', code: 'print("  hello ".strip().upper())', out: 'HELLO' },
  { en: 'f-Strings & Formatting', hi: 'f-Strings aur Text Formatting', unit: 'Unit 3: Strings & Text', level: 'Beginner', code: 'xp = 120\nprint(f"Score: {xp}")', out: 'Score: 120' },
  { en: 'Logical Operators: and, or, not', hi: 'Logical Operators: and, or, not', unit: 'Unit 4: Decisions & Loops', level: 'Beginner', code: 'print(True and not False)', out: 'True' },
  { en: 'if Statements', hi: 'if Statements ka use', unit: 'Unit 4: Decisions & Loops', level: 'Beginner', code: 'n = 10\nif n > 5:\n    print("Big")', out: 'Big' },
  { en: 'if-else & if-elif-else Chains', hi: 'if-else aur elif chains', unit: 'Unit 4: Decisions & Loops', level: 'Beginner', code: 'score = 65\nif score >= 80:\n    print("A")\nelif score >= 50:\n    print("B")\nelse:\n    print("C")', out: 'B' },
  { en: 'Nested Conditions & Ternary Shortcut', hi: 'Nested Conditions aur Ternary Shortcut', unit: 'Unit 4: Decisions & Loops', level: 'Beginner', code: 'x = 7\nprint("Odd" if x % 2 else "Even")', out: 'Odd' },
  { en: 'for Loops & range()', hi: 'for Loops aur range()', unit: 'Unit 4: Decisions & Loops', level: 'Beginner', code: 'for i in range(1, 4):\n    print(i)', out: '1\n2\n3' },
  { en: 'while Loops & Counters', hi: 'while Loops aur Counters', unit: 'Unit 4: Decisions & Loops', level: 'Beginner', code: 'c = 3\nwhile c > 0:\n    print(c)\n    c -= 1', out: '3\n2\n1' },
  { en: 'break, continue, and pass', hi: 'break, continue aur pass', unit: 'Unit 4: Decisions & Loops', level: 'Beginner', code: 'for i in range(5):\n    if i == 2:\n        continue\n    if i == 4:\n        break\n    print(i)', out: '0\n1\n3' },
  { en: 'Nested Loops & Pattern Printing', hi: 'Nested Loops aur Star Patterns', unit: 'Unit 4: Decisions & Loops', level: 'Beginner', code: 'for i in range(1, 4):\n    print("*" * i)', out: '*\n**\n***' },
  { en: 'Lists & Accessing Items', hi: 'Lists aur Items access karna', unit: 'Unit 5: Data Collections', level: 'Beginner', code: 'a = ["chai", "samosa"]\nprint(a[1])', out: 'samosa' },
  { en: 'List Methods: append, insert, pop, sort', hi: 'List Methods: append, pop, sort', unit: 'Unit 5: Data Collections', level: 'Beginner', code: 'nums = [3, 1, 2]\nnums.sort()\nprint(nums)', out: '[1, 2, 3]' },
  { en: 'Tuples & Unpacking', hi: 'Tuples aur Unpacking', unit: 'Unit 5: Data Collections', level: 'Beginner', code: 'a, b = (10, 20)\nprint(a + b)', out: '30' },
  { en: 'Sets & Removing Duplicates', hi: 'Sets aur Duplicates hatana', unit: 'Unit 5: Data Collections', level: 'Beginner', code: 's = set([1, 2, 2, 3])\nprint(len(s))', out: '3' },
  { en: 'Dictionaries: Keys & Values', hi: 'Dictionaries: Keys aur Values', unit: 'Unit 5: Data Collections', level: 'Beginner', code: 'd = {"a": 1, "b": 2}\nprint(d["b"])', out: '2' },
  { en: 'Dictionary Methods: get, keys, items', hi: 'Dictionary Methods: get, keys, items', unit: 'Unit 5: Data Collections', level: 'Beginner', code: 'd = {"x": 9}\nprint(d.get("y", 0))', out: '0' },
  { en: 'Defining Functions (def)', hi: 'Functions banana (def)', unit: 'Unit 6: Functions & Scope', level: 'Beginner', code: 'def hi():\n    print("Namaste")\nhi()', out: 'Namaste' },
  { en: 'Parameters & Default Arguments', hi: 'Parameters aur Default Arguments', unit: 'Unit 6: Functions & Scope', level: 'Beginner', code: 'def power(n, p=2):\n    return n ** p\nprint(power(5))', out: '25' },
  { en: 'Return Values vs Print', hi: 'Return Value vs Print', unit: 'Unit 6: Functions & Scope', level: 'Beginner', code: 'def double(x):\n    return x * 2\nprint(double(8))', out: '16' },
  { en: 'Scope: Local vs Global Variables', hi: 'Scope: Local aur Global Variables', unit: 'Unit 6: Functions & Scope', level: 'Beginner', code: 'x = 5\ndef show():\n    y = 10\n    print(x + y)\nshow()', out: '15' },
  { en: 'try, except, finally Error Handling', hi: 'try, except, finally Error Handling', unit: 'Unit 7: Errors, Files & Modules', level: 'Beginner', code: 'try:\n    print(10 / 0)\nexcept:\n    print("Handled!")', out: 'Handled!' },
  { en: 'File Handling Concepts (open, read, write)', hi: 'File Handling (open, read, write)', unit: 'Unit 7: Errors, Files & Modules', level: 'Beginner', code: 'lines = ["Task 1", "Task 2"]\nprint("\\n".join(lines))', out: 'Task 1\nTask 2' },
  { en: 'Modules, Standard Library & pip', hi: 'Modules, Standard Library aur pip', unit: 'Unit 7: Errors, Files & Modules', level: 'Beginner', code: 'print("pip install requests")', out: 'pip install requests' },
  { en: 'Virtual Environments (venv)', hi: 'Virtual Environments (venv)', unit: 'Unit 7: Errors, Files & Modules', level: 'Beginner', code: 'print("python -m venv .venv")', out: 'python -m venv .venv' },
  { en: 'Basic Print Debugging', hi: 'Print statement se Basic Debugging', unit: 'Unit 7: Errors, Files & Modules', level: 'Beginner', code: 'x = 5\nprint("DEBUG x =", x)', out: 'DEBUG x = 5' },
  { en: 'Lambda Functions', hi: 'Lambda (one-line functions)', unit: 'Unit 8: Functional Python & Comprehensions', level: 'Intermediate', code: 'sq = lambda x: x * x\nprint(sq(6))', out: '36' },
  { en: 'map() & filter()', hi: 'map() aur filter() ka use', unit: 'Unit 8: Functional Python & Comprehensions', level: 'Intermediate', code: 'res = list(filter(lambda x: x > 3, [1, 4, 2, 6]))\nprint(res)', out: '[4, 6]' },
  { en: 'reduce() Concept & Accumulation', hi: 'reduce() aur numbers accumulate karna', unit: 'Unit 8: Functional Python & Comprehensions', level: 'Intermediate', code: 'nums = [2, 3, 4]\ntotal = 1\nfor n in nums:\n    total *= n\nprint(total)', out: '24' },
  { en: 'List Comprehension Basics', hi: 'List Comprehension basics', unit: 'Unit 8: Functional Python & Comprehensions', level: 'Intermediate', code: 'print([i * 10 for i in range(1, 4)])', out: '[10, 20, 30]' },
  { en: 'Dictionary Comprehension Concepts', hi: 'Dictionary Comprehension concepts', unit: 'Unit 8: Functional Python & Comprehensions', level: 'Intermediate', code: 'pairs = [[1, 1], [2, 4]]\nprint(pairs)', out: '[[1, 1], [2, 4]]' },
  { en: 'Recursion Basics', hi: 'Recursion ki shuruat', unit: 'Unit 8: Functional Python & Comprehensions', level: 'Intermediate', code: 'def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\nprint(fact(5))', out: '120' },
  { en: 'Generators & yield Concept', hi: 'Generators aur yield concept', unit: 'Unit 8: Functional Python & Comprehensions', level: 'Intermediate', code: 'print(sum(range(1, 6)))', out: '15' },
  { en: 'Decorators Concept', hi: 'Decorators ko samajhna', unit: 'Unit 8: Functional Python & Comprehensions', level: 'Intermediate', code: 'def wrap(fn):\n    print("Before")\n    fn()\nwrap(lambda: print("Inside"))', out: 'Before\nInside' },
  { en: 'Object-Oriented Programming Intro', hi: 'OOP (Object-Oriented Programming) Intro', unit: 'Unit 9: Object-Oriented Programming (OOP)', level: 'Intermediate', code: 'class Greet:\n    def say(self):\n        print("Hello OOP!")\ng = Greet()\ng.say()', out: 'Hello OOP!' },
  { en: 'Classes, Objects & Constructors (__init__)', hi: 'Classes, Objects aur __init__ Constructor', unit: 'Unit 9: Object-Oriented Programming (OOP)', level: 'Intermediate', code: 'class Box:\n    def __init__(self, w):\n        self.w = w\nb = Box(42)\nprint(b.w)', out: '42' },
  { en: 'Inheritance, Polymorphism & Encapsulation', hi: 'Inheritance, Polymorphism aur Encapsulation', unit: 'Unit 9: Object-Oriented Programming (OOP)', level: 'Intermediate', code: 'class Animal:\n    def sound(self):\n        return "..."\nclass Dog(Animal):\n    def sound(self):\n        return "Woof"\nd = Dog()\nprint(d.sound())', out: 'Woof' },
  { en: 'Magic / Dunder Methods (__str__, __len__)', hi: 'Magic (Dunder) Methods (__str__, __len__)', unit: 'Unit 9: Object-Oriented Programming (OOP)', level: 'Intermediate', code: 'class Team:\n    def __init__(self, m):\n        self.m = m\n    def __len__(self):\n        return len(self.m)\nt = Team(["Asha", "Dev"])\nprint(len(t))', out: '2' },
  { en: 'Exception Handling in Depth', hi: 'Exception Handling detail mein', unit: 'Unit 10: Files, APIs, Concurrency & Pro Code', level: 'Intermediate', code: 'try:\n    int("abc")\nexcept:\n    print("ValueError caught")', out: 'ValueError caught' },
  { en: 'Working with JSON & CSV Files', hi: 'JSON aur CSV files ke saath kaam', unit: 'Unit 10: Files, APIs, Concurrency & Pro Code', level: 'Intermediate', code: 'row = "Amit,85,Delhi"\nprint(row.split(","))', out: "['Amit', '85', 'Delhi']" },
  { en: 'Using requests, APIs & Web Scraping', hi: 'requests, APIs aur Web Scraping', unit: 'Unit 10: Files, APIs, Concurrency & Pro Code', level: 'Intermediate', code: 'api_data = {"status": 200, "city": "Mumbai"}\nprint(api_data["status"])', out: '200' },
  { en: 'Regular Expressions (Regex) Basics', hi: 'Regular Expressions (Regex) Basics', unit: 'Unit 10: Files, APIs, Concurrency & Pro Code', level: 'Intermediate', code: 'email = "user@gmail.com"\nprint("@" in email and "." in email)', out: 'True' },
  { en: 'Threads, Multiprocessing, Async & Pro Code', hi: 'Threads, Async aur Pro Code likhna', unit: 'Unit 10: Files, APIs, Concurrency & Pro Code', level: 'Intermediate', code: 'print("PEP 8 + docstrings + tests = Pro Code")', out: 'PEP 8 + docstrings + tests = Pro Code' },
];

const ADVANCED_LESSONS_105_120: {
  number: number;
  unit: string;
  en: string;
  hi: string;
  expEn: string;
  expHi: string;
  exEn: string;
  exHi: string;
  code: string;
  out: string;
}[] = [
  {
    number: 105,
    unit: 'Unit 11: Deep OOP & Design Patterns',
    en: 'Real BankAccount Class with Deposit & Withdraw',
    hi: 'Real BankAccount Class: Deposit & Withdraw Methods',
    expEn: 'Build a real stateful class holding `self.balance` with validation methods.',
    expHi: 'Ek real BankAccount class banayein jo `self.balance` store kare aur safe withdraw check kare.',
    exEn: 'Like an ATM checking your actual account balance before handing out cash.',
    exHi: 'ATM ki tarah jo cash dene se pehle account balance verify karta hai.',
    code: 'class BankAccount:\n    def __init__(self, owner, bal):\n        self.owner = owner\n        self.bal = bal\n    def deposit(self, amt):\n        self.bal += amt\n    def withdraw(self, amt):\n        if amt <= self.bal:\n            self.bal -= amt\nacc = BankAccount("Riya", 500)\nacc.deposit(200)\nacc.withdraw(150)\nprint(acc.bal)',
    out: '550',
  },
  {
    number: 106,
    unit: 'Unit 11: Deep OOP & Design Patterns',
    en: 'Single Inheritance: Vehicle -> ElectricScooter',
    hi: 'Single Inheritance: Vehicle se ElectricScooter banana',
    expEn: 'Child classes automatically receive parent methods and add new specialized ones.',
    expHi: 'Child class parent ke saare methods inherit karti hai aur naye features add karti hai.',
    exEn: 'An Electric Scooter shares wheels and speed from Vehicle, plus adds battery_pct.',
    exHi: 'Electric Scooter ko Vehicle se chalna milta hai aur apna extra battery feature bhi.',
    code: 'class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n    def horn(self):\n        return "Beep!"\nclass ElectricScooter(Vehicle):\n    def charge(self):\n        return f"{self.brand} charging 100%"\ns = ElectricScooter("Ather")\nprint(s.horn(), s.charge())',
    out: 'Beep! Ather charging 100%',
  },
  {
    number: 107,
    unit: 'Unit 11: Deep OOP & Design Patterns',
    en: 'Polymorphism: UPI & Card Payment Gateway',
    hi: 'Polymorphism: Ek hi `.pay()` se UPI aur Card',
    expEn: 'Different classes implement the same `.pay(amt)` method name cleanly.',
    expHi: 'Alag payment classes same `.pay(amt)` method naam use karti hain.',
    exEn: 'Whether you tap UPI or Card at a shop, both answer the action "Pay now".',
    exHi: 'Dukaan par UPI ho ya Card, dono ka action ek hi hai: Pay karna.',
    code: 'class UPI:\n    def pay(self, amt):\n        return f"Paid {amt} via UPI"\nclass Card:\n    def pay(self, amt):\n        return f"Paid {amt} via Card"\nfor method in [UPI(), Card()]:\n    print(method.pay(250))',
    out: 'Paid 250 via UPI\nPaid 250 via Card',
  },
  {
    number: 108,
    unit: 'Unit 11: Deep OOP & Design Patterns',
    en: 'Encapsulation & @property Computed Attributes',
    hi: 'Encapsulation aur @property Computed Attributes',
    expEn: 'Use `@property` so a calculated method behaves like a clean read-only attribute.',
    expHi: '`@property` lagane se method bina `()` lagaye attribute ki tarah read hota hai.',
    exEn: 'Asking `cart.total` instead of calling a separate calculation manually.',
    exHi: 'Direct `rect.area` padhna bina `()` lagaye.',
    code: 'class Rectangle:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n    @property\n    def area(self):\n        return self.w * self.h\nr = Rectangle(8, 5)\nprint(r.area)',
    out: '40',
  },
  {
    number: 109,
    unit: 'Unit 11: Deep OOP & Design Patterns',
    en: 'Custom __str__ & __len__ Dunder Methods',
    hi: 'Custom __str__ aur __len__ Dunder Methods',
    expEn: 'Control how `print(obj)` and `len(obj)` behave on your own classes.',
    expHi: 'Apni class par `print(obj)` aur `len(obj)` ka output customize karein.',
    exEn: 'Printing a PlayList object directly prints "Study Mix (3 songs)".',
    exHi: 'Object print karne par `<object>` ki jagah saaf readable text dikhana.',
    code: 'class Playlist:\n    def __init__(self, name, songs):\n        self.name = name\n        self.songs = songs\n    def __str__(self):\n        return f"{self.name}: {len(self.songs)} tracks"\n    def __len__(self):\n        return len(self.songs)\np = Playlist("Focus", ["A", "B", "C"])\nprint(p)\nprint(len(p))',
    out: 'Focus: 3 tracks\n3',
  },
  {
    number: 110,
    unit: 'Unit 11: Deep OOP & Design Patterns',
    en: 'Checking Object Types with isinstance()',
    hi: 'isinstance() se Object Type Check karna',
    expEn: '`isinstance(obj, Class)` safely verifies if an object belongs to a class or parent class.',
    expHi: '`isinstance(obj, Class)` check karta hai ki object sahi class ya parent class ka hai ya nahi.',
    exEn: 'Checking an ID badge before letting someone enter an office.',
    exHi: 'Entry dene se pehle ID card check karne jaisa.',
    code: 'class User:\n    pass\nclass Admin(User):\n    pass\na = Admin()\nprint(isinstance(a, User))',
    out: 'True',
  },
  {
    number: 111,
    unit: 'Unit 11: Deep OOP & Design Patterns',
    en: 'Composition: Order Has-A List of Products',
    hi: 'Composition: Order Class ke andar Products rakhna',
    expEn: 'Instead of inheriting everything, classes can store instances of other classes inside lists.',
    expHi: 'Ek class ke andar dusri classes ke objects rakh kar real e-commerce cart banayein.',
    exEn: 'A shopping bag "has-a" list of items inside it.',
    exHi: 'Ek shopping cart mein alag-alag Item objects rakhna.',
    code: 'class Item:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\ncart = [Item("Book", 199), Item("Pen", 25)]\ntotal = sum([i.price for i in cart])\nprint("Cart total:", total)',
    out: 'Cart total: 224',
  },
  {
    number: 112,
    unit: 'Unit 11: Deep OOP & Design Patterns',
    en: 'OOP Capstone: Mini Library Borrowing System',
    hi: 'OOP Capstone: Library Book Borrowing System',
    expEn: 'Combine classes, state tracking, and condition checks in a real Book tracker.',
    expHi: 'Class aur state logic mila kar real book issue/return tracker banayein.',
    exEn: 'Preventing two students from borrowing the same physical book copy at once.',
    exHi: 'Ek hi book ko do logon ko issue hone se rokna.',
    code: 'class Book:\n    def __init__(self, title):\n        self.title = title\n        self.borrowed = False\n    def borrow(self):\n        if self.borrowed:\n            return "Already out"\n        self.borrowed = True\n        return f"Issued: {self.title}"\nb = Book("Python 101")\nprint(b.borrow())\nprint(b.borrow())',
    out: 'Issued: Python 101\nAlready out',
  },
  {
    number: 113,
    unit: 'Unit 12: DSA, Algorithms & Automation',
    en: 'Big-O Notation: O(1) vs O(n) Speed',
    hi: 'Big-O Notation: O(1) vs O(n) Speed Samajhna',
    expEn: 'Measure how operations scale as lists grow from 10 to 1,000,000 items.',
    expHi: 'List badi hone par code kitni tez ya dheemi chalegi, ye Big-O batata hai.',
    exEn: 'Dictionary lookup (`O(1)`) is opening a word directly by page index; scanning (`O(n)`) is reading every page.',
    exHi: 'Dictionary lookup seedhe index page kholne jaisa hai (`O(1)`), loop har page padhta hai (`O(n)`).',
    code: 'prices = {"chai": 15, "poha": 30}\nprint("O(1) instant lookup:", prices["chai"])\nitems = [10, 20, 30, 40]\nprint("O(n) scan sum:", sum(items))',
    out: 'O(1) instant lookup: 15\nO(n) scan sum: 100',
  },
  {
    number: 114,
    unit: 'Unit 12: DSA, Algorithms & Automation',
    en: 'Stack (LIFO) & Balanced Parentheses',
    hi: 'Stack (LIFO) aur Bracket Matching',
    expEn: 'A Stack pushes with `.append()` and pops the newest item with `.pop()` (Last In, First Out).',
    expHi: 'Stack mein `.append()` se upar item rakhte hain aur `.pop()` se sabse aakhri item nikalte hain.',
    exEn: 'Like a stack of rotis on a plate or Ctrl+Z Undo history in Word.',
    exHi: 'Thali mein rakhi rotion ki gaddi ya Ctrl+Z Undo button ki tarah.',
    code: 'stack = []\nstack.append("Page 1")\nstack.append("Page 2")\nstack.append("Page 3")\nprint("Back to:", stack.pop())\nprint("Remaining:", stack)',
    out: "Back to: Page 3\nRemaining: ['Page 1', 'Page 2']",
  },
  {
    number: 115,
    unit: 'Unit 12: DSA, Algorithms & Automation',
    en: 'Queue (FIFO) Ticket Counter Simulation',
    hi: 'Queue (FIFO) Line Simulation',
    expEn: 'A Queue serves the earliest item first using `.append()` and `.pop(0)` (First In, First Out).',
    expHi: 'Queue mein jo sabse pehle aata hai uski baari pehle aati hai (`.pop(0)`).',
    exEn: 'Like passengers standing in a railway ticket counter line.',
    exHi: 'Railway ticket line ya customer support queue ki tarah.',
    code: 'queue = []\nqueue.append("Riya")\nqueue.append("Karan")\nserved = queue.pop(0)\nprint("Served:", served)\nprint("Waiting:", queue)',
    out: "Served: Riya\nWaiting: ['Karan']",
  },
  {
    number: 116,
    unit: 'Unit 12: DSA, Algorithms & Automation',
    en: 'Binary Search Algorithm O(log n)',
    hi: 'Binary Search Algorithm O(log n)',
    expEn: 'Find a target in a sorted list by checking the middle index and halving the search space.',
    expHi: 'Sorted list ke beech (mid) ko check kar ke har step mein aadhi list skip karein.',
    exEn: 'Opening a 1,000-page dictionary in the middle instead of checking page 1, 2, 3...',
    exHi: '1,000 page ki dictionary mein beech se khol kar word dhoondhne jaisa.',
    code: 'def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\nprint(binary_search([10, 20, 30, 40, 50], 40))',
    out: '3',
  },
  {
    number: 117,
    unit: 'Unit 12: DSA, Algorithms & Automation',
    en: 'Sorting Algorithms: Bubble Sort Step-by-Step',
    hi: 'Sorting Algorithms: Bubble Sort Step-by-Step',
    expEn: 'Compare adjacent pairs and swap if needed until the whole list is sorted ascending.',
    expHi: 'Bagal wale 2 numbers compare kar ke swap karein jab tak poori list sort na ho jaye.',
    exEn: 'Arranging students in morning assembly from shortest to tallest by swapping neighbors.',
    exHi: 'Assembly line mein height ke hisab se aage-peeche swap karne jaisa.',
    code: 'arr = [5, 1, 4, 2]\nn = len(arr)\nfor i in range(n):\n    for j in range(0, n - i - 1):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]\nprint(arr)',
    out: '[1, 2, 4, 5]',
  },
  {
    number: 118,
    unit: 'Unit 12: DSA, Algorithms & Automation',
    en: 'Recursion Tree: Power & Sum of Digits',
    hi: 'Recursion Tree: Sum of Digits nikalna',
    expEn: 'Break a multi-digit problem down with a clean base case + recursive call.',
    expHi: 'Badi problem ko base case + chhoti problem mein tod kar recursion se solve karein.',
    exEn: 'Peeling an onion one outer digit (`n % 10`) at a time.',
    exHi: 'Har call mein ek last digit (`n % 10`) nikal kar baaki ko jodna.',
    code: 'def digit_sum(n):\n    if n == 0:\n        return 0\n    return (n % 10) + digit_sum(n // 10)\nprint(digit_sum(456))',
    out: '15',
  },
  {
    number: 119,
    unit: 'Unit 12: DSA, Algorithms & Automation',
    en: 'Hash Map Pattern: Frequency Counter',
    hi: 'Hash Map Pattern: Word/Item Frequency Counter',
    expEn: 'Count duplicates in `O(n)` single pass using a dictionary `.get(key, 0) + 1`.',
    expHi: 'Dictionary mein `.get(key, 0) + 1` se ek hi loop mein har item ki ginti nikalein.',
    exEn: 'Tallying votes per candidate into labeled jars in one pass.',
    exHi: 'Ek hi baar mein sabhi votes count kar lena.',
    code: 'votes = ["py", "sql", "py", "excel", "py"]\ncounts = {}\nfor v in votes:\n    counts[v] = counts.get(v, 0) + 1\nprint(counts["py"])',
    out: '3',
  },
  {
    number: 120,
    unit: 'Unit 12: DSA, Algorithms & Automation',
    en: 'Data & Automation Pipeline: Clean & Summarize Sales',
    hi: 'Data & Automation Pipeline: Sales CSV Clean & Summarize',
    expEn: 'Parse raw messy text records, filter valid rows, and compute total revenue.',
    expHi: 'Raw messy records ko clean karein, valid rows filter karein aur total revenue nikalein.',
    exEn: 'Automating a shopkeeper’s evening tally from raw WhatsApp/CSV order lines.',
    exHi: 'Dukaan ke raw order lines se automatic daily revenue report banana.',
    code: 'raw_rows = ["Tea,20", "INVALID", "Samosa,30", "Coffee,50"]\ntotal = 0\nfor r in raw_rows:\n    if "," in r:\n        item, price = r.split(",")\n        total += int(price)\nprint("Verified Revenue:", total)',
    out: 'Verified Revenue: 100',
  },
];

function buildScaffoldExercise(code: string, num: number) {
  const lines = code
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() && !l.trim().startsWith('#'));

  // Build Fill-in-the-Blank on key Python token
  const keywords = ['print', 'return', 'elif', 'else', 'def', 'class', 'for', 'while', 'range', 'append', 'get', 'isinstance'];
  let fillBlank: PythonLesson['fillBlank'] | undefined;
  for (const kw of keywords) {
    if (code.includes(kw)) {
      const idx = code.indexOf(kw);
      fillBlank = {
        prompt: {
          en: `Type the missing Python keyword/function in the blank:`,
          hi: `Khaali jagah (blank) mein sahi Python keyword ya function type karein:`,
        },
        codeBefore: code.slice(0, idx),
        codeAfter: code.slice(idx + kw.length),
        answer: kw,
        hint: {
          en: `Starts with "${kw[0]}" (${kw.length} letters).`,
          hi: `"${kw[0]}" se shuru hota hai (${kw.length} letters).`,
        },
      };
      break;
    }
  }

  // Build Parsons block ordering when lesson has >= 2 distinct lines
  let parsons: PythonLesson['parsons'] | undefined;
  if (lines.length >= 2 && lines.length <= 6) {
    parsons = {
      prompt: {
        en: 'Tap the code blocks in the exact order Python runs them:',
        hi: 'Code blocks ko sahi order mein tap kar ke program banayein:',
      },
      correctOrder: lines,
    };
  }

  // Fallback for single-line lessons on first 10 lessons so students still see scaffolded practice
  if (!parsons && num <= 10 && lines.length === 1) {
    parsons = {
      prompt: {
        en: 'Arrange these steps in logical order:',
        hi: 'In steps ko sahi order mein lagayein:',
      },
      correctOrder: ['# Step 1: Prepare input/value', lines[0], '# Step 2: Verify output'],
    };
  }

  return { fillBlank, parsons };
}

// Expand to 120 lessons cleanly (54 core + 50 applied drills + 16 Advanced OOP & DSA lessons)
export const PYTHON_LESSONS: PythonLesson[] = Array.from({ length: 120 }, (_, idx) => {
  const num = idx + 1;

  // Advanced Units 11 & 12 (Lessons 105..120)
  const advMatch = ADVANCED_LESSONS_105_120.find((a) => a.number === num);
  if (advMatch) {
    const scaffold = buildScaffoldExercise(advMatch.code, num);
    return {
      id: `py-${num}`,
      number: num,
      unit: advMatch.unit,
      level: 'Advanced',
      title: { en: advMatch.en, hi: advMatch.hi },
      durationMin: 7,
      simpleExplanation: { en: advMatch.expEn, hi: advMatch.expHi },
      whyItMatters: {
        en: 'Asked frequently in Python backend, automation, and entry-level DSA interviews across India.',
        hi: 'Indian tech companies ke Python backend aur entry-level DSA interviews mein ye concepts baar-baar puche jate hain.',
      },
      realLifeExample: { en: advMatch.exEn, hi: advMatch.exHi },
      syntax: advMatch.code.split('\n')[0],
      code: advMatch.code,
      lineByLine: advMatch.code.split('\n').slice(0, 5).map((l, i) => ({
        line: l,
        explanation: {
          en: `Step ${i + 1}: Runs \`${l.trim()}\``,
          hi: `Step ${i + 1}: Ye line \`${l.trim()}\` chalati hai`,
        },
      })),
      expectedOutput: advMatch.out,
      commonMistakes: [
        {
          en: 'Check `self` inside methods, loop boundaries (`low <= high`), and exact indentation.',
          hi: 'Class methods mein `self`, loop boundaries aur 4-space indentation dhyan se check karein.',
        },
      ],
      practiceExercise: {
        en: 'Use "Visualize Step-by-Step" below to watch memory boxes update line by line!',
        hi: 'Neeche "Visualize Step-by-Step" dabakar dekhein ki memory boxes har line par kaise badalte hain!',
      },
      fillBlank: scaffold.fillBlank,
      parsons: scaffold.parsons,
      miniChallenge: {
        prompt: {
          en: `Run or adapt this code so output equals: ${advMatch.out.split('\n')[0]}`,
          hi: `Code chalayein aur verify karein ki output "${advMatch.out.split('\n')[0]}" se match ho`,
        },
        starterCode: advMatch.code,
        expectedOutput: advMatch.out,
      },
      projectIdea: {
        en: `Add "${advMatch.en}" into a GitHub portfolio module with unit checks.`,
        hi: `"${advMatch.en}" ko apne GitHub portfolio project mein shamil karein.`,
      },
      quiz: {
        id: `py-q-${num}`,
        question: {
          en: `What is the first output line produced by Lesson ${num}?`,
          hi: `Lesson ${num} ka code chalane par pehli output line kya hogi?`,
        },
        options: [
          { en: advMatch.out.split('\n')[0], hi: advMatch.out.split('\n')[0] },
          { en: 'None', hi: 'None' },
          { en: 'IndentationError', hi: 'IndentationError' },
        ],
        correctIndex: 0,
        explanation: {
          en: `Executing Lesson ${num} prints "${advMatch.out.split('\n')[0]}" first.`,
          hi: `Is code ko chalane par "${advMatch.out.split('\n')[0]}" print hota hai.`,
        },
      },
    };
  }

  const coreMatch = CORE_SEEDS.find((c) => c.number === num);
  if (coreMatch) {
    const scaffold = buildScaffoldExercise(coreMatch.code, num);
    return {
      id: `py-${num}`,
      number: num,
      unit: coreMatch.unit,
      level: coreMatch.level,
      title: { en: coreMatch.en, hi: coreMatch.hi },
      durationMin: 5,
      simpleExplanation: { en: coreMatch.expEn, hi: coreMatch.expHi },
      whyItMatters: { en: coreMatch.whyEn, hi: coreMatch.whyHi },
      realLifeExample: { en: coreMatch.exEn, hi: coreMatch.exHi },
      syntax: coreMatch.syntax,
      code: coreMatch.code,
      lineByLine: coreMatch.code.split('\n').slice(0, 4).map((l, i) => ({
        line: l,
        explanation: {
          en: `Step ${i + 1}: Executes \`${l.trim()}\``,
          hi: `Step ${i + 1}: Ye line \`${l.trim()}\` chalati hai`,
        },
      })),
      expectedOutput: coreMatch.output,
      commonMistakes: [{ en: coreMatch.mistakeEn, hi: coreMatch.mistakeHi }],
      practiceExercise: { en: coreMatch.taskEn, hi: coreMatch.taskHi },
      fillBlank: scaffold.fillBlank,
      parsons: scaffold.parsons,
      miniChallenge: {
        prompt: { en: coreMatch.challengeEn, hi: coreMatch.challengeHi },
        starterCode: coreMatch.starter,
        expectedOutput: coreMatch.challengeOut,
      },
      projectIdea: { en: coreMatch.projectEn, hi: coreMatch.projectHi },
      quiz: {
        id: `py-q-${num}`,
        question: { en: coreMatch.quizQEn, hi: coreMatch.quizQHi },
        options: coreMatch.quizOpts.map((o) => ({ en: o, hi: o })),
        correctIndex: coreMatch.quizAns,
        explanation: { en: coreMatch.expEn, hi: coreMatch.expHi },
      },
    };
  }

  const baseIdx = idx < SYLLABUS_TITLES.length ? idx : idx % SYLLABUS_TITLES.length;
  const seed = SYLLABUS_TITLES[baseIdx];
  const isDrill = idx >= SYLLABUS_TITLES.length;
  const level: 'Beginner' | 'Intermediate' | 'Advanced' = num <= 56 ? 'Beginner' : 'Intermediate';
  const titleEn = isDrill ? `Applied Lab ${num - 54}: ${seed.en}` : seed.en;
  const titleHi = isDrill ? `Applied Lab ${num - 54}: ${seed.hi}` : seed.hi;
  const scaffold = buildScaffoldExercise(seed.code, num);

  return {
    id: `py-${num}`,
    number: num,
    unit: seed.unit,
    level,
    title: { en: titleEn, hi: titleHi },
    durationMin: isDrill ? 6 : 4,
    simpleExplanation: {
      en: isDrill
        ? `Hands-on practice lab reinforcing "${seed.en}" through a realistic mini-program.`
        : `Learn "${seed.en}" step by step with clean syntax and zero jargon.`,
      hi: isDrill
        ? `"${seed.hi}" par based hands-on lab taaki aapka concept pakka ho.`
        : `"${seed.hi}" ko simple example aur clean syntax ke saath seekhein.`,
    },
    whyItMatters: {
      en: 'Practicing each concept immediately builds muscle memory for coding interviews and projects.',
      hi: 'Har concept ki turant practice karne se coding interviews aur projects ka confidence badhta hai.',
    },
    realLifeExample: {
      en: `Think of "${seed.en}" like mastering one tool in a carpenter’s kit before building furniture.`,
      hi: `"${seed.hi}" seekhna furniture banane se pehle ek zaroori tool chalana seekhne jaisa hai.`,
    },
    syntax: seed.code.split('\n')[0],
    code: seed.code,
    lineByLine: seed.code.split('\n').map((l, i) => ({
      line: l,
      explanation: {
        en: `Line ${i + 1} runs: ${l.trim()}`,
        hi: `Line ${i + 1} chalati hai: ${l.trim()}`,
      },
    })),
    expectedOutput: seed.out,
    commonMistakes: [
      {
        en: 'Double-check colons (:), matching quotes, and 4-space indentation inside blocks.',
        hi: 'Colon (:), matching quotes aur block ke andar 4 spaces indentation zaroor check karein.',
      },
    ],
    practiceExercise: {
      en: `Run the code example, modify a value, and predict the output before clicking Run.`,
      hi: 'Code example chalayein, koi value badlein aur Run dabane se pehle output guess karein.',
    },
    fillBlank: scaffold.fillBlank,
    parsons: scaffold.parsons,
    miniChallenge: {
      prompt: {
        en: `Run and verify the output matches: ${seed.out.split('\n')[0]}`,
        hi: `Code chalayein aur check karein ki output "${seed.out.split('\n')[0]}" se match karta hai`,
      },
      starterCode: seed.code,
      expectedOutput: seed.out,
    },
    projectIdea: {
      en: `Combine ${seed.en} into a small daily utility script.`,
      hi: `${seed.hi} ko apne kisi chhote daily tool script mein use karein.`,
    },
    quiz: {
      id: `py-q-${num}`,
      question: {
        en: `What will the example code in Lesson ${num} print first?`,
        hi: `Lesson ${num} ka example code sabse pehle kya print karega?`,
      },
      options: [
        { en: seed.out.split('\n')[0], hi: seed.out.split('\n')[0] },
        { en: 'SyntaxError', hi: 'SyntaxError' },
        { en: 'Nothing (empty)', hi: 'Kuch nahi (empty)' },
      ],
      correctIndex: 0,
      explanation: {
        en: `Running the snippet outputs "${seed.out.split('\n')[0]}".`,
        hi: `Ye code chalane par "${seed.out.split('\n')[0]}" output deta hai.`,
      },
    },
  };
});
