import { ComputerTopic } from '../types';

export const COMPUTER_TOPICS: ComputerTopic[] = [
  {
    id: 'comp-what-is-computer',
    order: 1,
    title: { en: 'What is a Computer?', hi: 'कंप्यूटर क्या है?' },
    category: 'hardware',
    durationMin: 4,
    diagramType: 'cpu',
    simpleDefinition: {
      en: 'A computer is an electronic machine that takes input, processes it, and gives useful output.',
      hi: 'कंप्यूटर एक इलेक्ट्रॉनिक मशीन है जो इनपुट लेती है, उसे प्रोसेस करती है और उपयोगी आउटपुट देती है।',
    },
    realLifeExample: {
      en: 'Think of a mixer-grinder: you put raw spices in (Input), the motor grinds them (Processing), and you get masala powder out (Output).',
      hi: 'मिक्सर-ग्राइंडर की तरह: आप कच्चे मसाले डालते हैं (इनपुट), मोटर उन्हें पीसती है (प्रोसेसिंग), और पिसा मसाला बाहर आता है (आउटपुट)।',
    },
    whyItMatters: {
      en: 'Every IT job, office desk, bank counter, and smartphone uses this same Input → Process → Output rule.',
      hi: 'हर IT नौकरी, ऑफिस डेस्क, बैंक काउंटर और स्मार्टफोन इसी Input → Process → Output नियम पर चलता है।',
    },
    practicalTask: {
      en: 'Look around your home and list 3 devices that work like computers (e.g., phone, ATM, smart TV).',
      hi: 'अपने घर के आसपास 3 ऐसी मशीनें पहचानें जो कंप्यूटर की तरह काम करती हैं (जैसे फोन, ATM, स्मार्ट टीवी)।',
    },
    videoScriptSummary: {
      en: '45s Visual Explainer: Watch how a single key press travels from keyboard (Input) to CPU (Process) to screen (Output).',
      hi: '45 सेकंड एक्सप्लेनर: देखें कि कीबोर्ड से दबाया गया एक अक्षर CPU से होकर स्क्रीन तक कैसे पहुँचता है।',
    },
    quiz: [
      {
        id: 'q1-1',
        question: { en: 'What are the 3 basic steps a computer follows?', hi: 'कंप्यूटर किन 3 मुख्य चरणों पर काम करता है?' },
        options: [
          { en: 'Input → Process → Output', hi: 'इनपुट → प्रोसेस → आउटपुट' },
          { en: 'Print → Save → Delete', hi: 'प्रिंट → सेव → डिलीट' },
          { en: 'Click → Drag → Drop', hi: 'क्लिक → ड्रैग → ड्रॉप' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Every computer takes Input, Processes it, and shows Output.',
          hi: 'हर कंप्यूटर इनपुट लेता है, प्रोसेस करता है और आउटपुट देता है।',
        },
      },
      {
        id: 'q1-2',
        question: { en: 'Which device gives Input to a computer?', hi: 'इनमें से कौन-सा डिवाइस कंप्यूटर को इनपुट देता है?' },
        options: [
          { en: 'Keyboard', hi: 'कीबोर्ड' },
          { en: 'Monitor', hi: 'मॉनिटर' },
          { en: 'Speaker', hi: 'स्पीकर' },
        ],
        correctIndex: 0,
        explanation: { en: 'You type instructions using the keyboard.', hi: 'आप कीबोर्ड से निर्देश टाइप करते हैं।' },
      },
      {
        id: 'q1-3',
        question: { en: 'Is a smartphone also a type of computer?', hi: 'क्या स्मार्टफोन भी एक तरह का कंप्यूटर है?' },
        options: [
          { en: 'Yes, it has a processor, memory, and storage', hi: 'हाँ, इसमें प्रोसेसर, मेमोरी और स्टोरेज होता है' },
          { en: 'No, only big desktops are computers', hi: 'नहीं, केवल बड़े डेस्कटॉप ही कंप्यूटर हैं' },
          { en: 'Only when connected to a printer', hi: 'केवल प्रिंटर से जुड़ने पर' },
        ],
        correctIndex: 0,
        explanation: { en: 'A smartphone is a pocket-sized computer.', hi: 'स्मार्टफोन जेब में आने वाला कंप्यूटर ही है।' },
      },
    ],
  },
  {
    id: 'comp-types-of-pcs',
    order: 2,
    title: { en: 'Desktop vs Laptop vs All-in-One vs Mini PC vs Tablet', hi: 'डेस्कटॉप, लैपटॉप, ऑल-इन-वन, मिनी पीसी और टैबलेट में अंतर' },
    category: 'hardware',
    durationMin: 5,
    diagramType: 'ports',
    image: '/src/assets/images/diagram_desktop_ports_1795003776211.jpg',
    simpleDefinition: {
      en: 'Computers come in different shapes based on whether you need power at one desk or portability on the go.',
      hi: 'जरूरत के हिसाब से कंप्यूटर अलग-अलग आकार में आते हैं — कुछ एक डेस्क पर ज़्यादा पावर के लिए और कुछ साथ ले जाने के लिए।',
    },
    realLifeExample: {
      en: 'A Desktop is like a home refrigerator (powerful, stays in one place); a Laptop is like a tiffin box (carry your work anywhere).',
      hi: 'डेस्कटॉप घर के फ्रिज जैसा है (मज़बूत और एक जगह रहता है); लैपटॉप टिफिन बॉक्स जैसा है (कहीं भी साथ ले जा सकते हैं)।',
    },
    whyItMatters: {
      en: 'Helps you and your family buy the right computer without wasting money on the wrong form factor.',
      hi: 'सही कंप्यूटर खरीदने में मदद करता है ताकि आपके पैसे बर्बाद न हों।',
    },
    keySpecs: [
      { label: 'Desktop PC', detail: { en: 'Separate CPU tower + monitor; easiest to upgrade and repair.', hi: 'अलग CPU बॉक्स और मॉनिटर; अपग्रेड और रिपेयर करना सबसे आसान।' } },
      { label: 'Laptop', detail: { en: 'Screen, keyboard, battery in one foldable unit; best for students.', hi: 'स्क्रीन, कीबोर्ड और बैटरी एक साथ; छात्रों के लिए सबसे बेहतर।' } },
      { label: 'All-in-One PC', detail: { en: 'Computer parts built behind the monitor; clean desk, fewer cables.', hi: 'कंप्यूटर के हिस्से मॉनिटर के पीछे ही लगे होते हैं; कम केबल।' } },
      { label: 'Mini PC', detail: { en: 'Palm-sized box you plug into any TV or monitor.', hi: 'हथेली के आकार का बॉक्स जिसे किसी भी टीवी या मॉनिटर से जोड़ सकते हैं।' } },
      { label: 'Tablet', detail: { en: 'Touchscreen slate great for reading and videos, limited for heavy coding.', hi: 'टचस्क्रीन डिवाइस जो पढ़ने और वीडियो के लिए अच्छा है, भारी कोडिंग के लिए सीमित।' } },
    ],
    practicalTask: {
      en: 'Decide which computer type fits a college student with a ₹30,000 budget and explain why in 2 lines.',
      hi: 'सोचें कि ₹30,000 के बजट वाले कॉलेज छात्र के लिए कौन-सा कंप्यूटर सबसे अच्छा रहेगा और क्यों?',
    },
    videoScriptSummary: {
      en: '50s Comparison: Side-by-side look inside a desktop tower, a laptop, a mini PC, and a tablet.',
      hi: '50 सेकंड तुलना: डेस्कटॉप, लैपटॉप, मिनी पीसी और टैबलेट के अंदरूनी फर्क को समझें।',
    },
    quiz: [
      {
        id: 'q2-1',
        question: { en: 'Which computer is easiest and cheapest to upgrade later?', hi: 'बाद में किसे अपग्रेड करना सबसे आसान और सस्ता होता है?' },
        options: [
          { en: 'Desktop PC', hi: 'डेस्कटॉप पीसी' },
          { en: 'Tablet', hi: 'टैबलेट' },
          { en: 'All-in-One PC', hi: 'ऑल-इन-वन पीसी' },
        ],
        correctIndex: 0,
        explanation: { en: 'Desktop towers have standard open space for extra RAM, SSD, or graphics cards.', hi: 'डेस्कटॉप टावर में RAM, SSD या ग्राफिक्स कार्ड जोड़ना आसान होता है।' },
      },
      {
        id: 'q2-2',
        question: { en: 'Where are the CPU and parts located in an All-in-One PC?', hi: 'All-in-One PC में CPU और पार्ट्स कहाँ होते हैं?' },
        options: [
          { en: 'Built right behind the monitor screen', hi: 'सीधे मॉनिटर स्क्रीन के पीछे' },
          { en: 'Inside the mouse', hi: 'माउस के अंदर' },
          { en: 'In the keyboard cable', hi: 'कीबोर्ड की तार में' },
        ],
        correctIndex: 0,
        explanation: { en: 'All-in-One integrates the system unit behind the display.', hi: 'ऑल-इन-वन में पूरा सिस्टम मॉनिटर के पीछे ही फिट होता है।' },
      },
      {
        id: 'q2-3',
        question: { en: 'Which device works best if you travel daily between home and college?', hi: 'घर से कॉलेज रोज़ आने-जाने के लिए सबसे अच्छा विकल्प कौन-सा है?' },
        options: [
          { en: 'Laptop', hi: 'लैपटॉप' },
          { en: 'Full Desktop Tower', hi: 'बड़ा डेस्कटॉप टावर' },
          { en: 'Server Rack', hi: 'सर्वर रैक' },
        ],
        correctIndex: 0,
        explanation: { en: 'Laptops include a battery and fold neatly into a backpack.', hi: 'लैपटॉप में बैटरी होती है और यह बैग में आसानी से आ जाता है।' },
      },
    ],
  },
  {
    id: 'comp-cpu',
    order: 3,
    title: { en: 'What is a CPU? (And Desktop vs Laptop vs Built-in CPUs)', hi: 'CPU क्या है? (डेस्कटॉप, लैपटॉप और इनबिल्ट CPU में अंतर)' },
    category: 'hardware',
    durationMin: 5,
    diagramType: 'cpu',
    simpleDefinition: {
      en: 'CPU (Central Processing Unit) is the brain of the computer that follows instructions and does calculations.',
      hi: 'CPU (सेंट्रल प्रोसेसिंग यूनिट) कंप्यूटर का दिमाग है जो सारे निर्देश समझता है और गणनाएँ करता है।',
    },
    realLifeExample: {
      en: 'In a restaurant kitchen, the head chef reads orders and prepares dishes fast — that head chef is the CPU.',
      hi: 'रेस्टोरेंट की रसोई में मुख्य शेफ ऑर्डर पढ़कर खाना तैयार करता है — वही मुख्य शेफ CPU है।',
    },
    whyItMatters: {
      en: 'A faster CPU makes opening apps, compiling Python code, and working on big Excel sheets smooth.',
      hi: 'तेज़ CPU होने से ऐप्स जल्दी खुलते हैं और Python कोड व बड़ी Excel फाइलें बिना अटके चलती हैं।',
    },
    keySpecs: [
      { label: 'Desktop CPU', detail: { en: 'Higher power & cooling; can be removed and upgraded.', hi: 'ज़्यादा पावर और कूलिंग; इसे निकालकर बदला भी जा सकता है।' } },
      { label: 'Laptop CPU', detail: { en: 'Designed to save battery and stay cool (e.g., Intel Core i5-1235U).', hi: 'बैटरी बचाने और कम गर्म होने के लिए बना होता है।' } },
      { label: 'Built-in / SoC CPU', detail: { en: 'Soldered onto board in phones, tablets, or budget mini-laptops (cannot swap).', hi: 'फोन, टैबलेट या छोटे लैपटॉप में बोर्ड पर फिक्स होता है (बदला नहीं जा सकता)।' } },
    ],
    practicalTask: {
      en: 'Check your computer or phone processor name in Settings → System → About.',
      hi: 'अपने कंप्यूटर या फोन में Settings → System → About खोलकर प्रोसेसर का नाम देखें।',
    },
    videoScriptSummary: {
      en: '40s Animation: Inside a CPU showing cores working together like chefs in a kitchen.',
      hi: '40 सेकंड एनिमेशन: CPU के अंदर के कोर एक साथ कैसे काम करते हैं।',
    },
    quiz: [
      {
        id: 'q3-1',
        question: { en: 'What does CPU stand for?', hi: 'CPU का पूरा नाम क्या है?' },
        options: [
          { en: 'Central Processing Unit', hi: 'सेंट्रल प्रोसेसिंग यूनिट' },
          { en: 'Computer Power Unit', hi: 'कंप्यूटर पावर यूनिट' },
          { en: 'Central Program User', hi: 'सेंट्रल प्रोग्राम यूज़र' },
        ],
        correctIndex: 0,
        explanation: { en: 'CPU stands for Central Processing Unit.', hi: 'CPU का अर्थ सेंट्रल प्रोसेसिंग यूनिट है।' },
      },
      {
        id: 'q3-2',
        question: { en: 'Why are laptop CPUs different from desktop CPUs?', hi: 'लैपटॉप CPU डेस्कटॉप CPU से अलग क्यों होते हैं?' },
        options: [
          { en: 'They use less power so battery lasts longer', hi: 'वे कम बिजली खाते हैं ताकि बैटरी ज़्यादा चले' },
          { en: 'They cannot run Python', hi: 'वे Python नहीं चला सकते' },
          { en: 'They have no cores', hi: 'उनमें कोई कोर नहीं होता' },
        ],
        correctIndex: 0,
        explanation: { en: 'Laptop CPUs balance speed with battery efficiency and lower heat.', hi: 'लैपटॉप CPU कम गर्मी और ज़्यादा बैटरी बैकअप के लिए डिज़ाइन होते हैं।' },
      },
      {
        id: 'q3-3',
        question: { en: 'Can you easily upgrade a soldered built-in phone/tablet SoC processor?', hi: 'क्या फोन या टैबलेट के इनबिल्ट प्रोसेसर को आसानी से बदला जा सकता है?' },
        options: [
          { en: 'No, it is permanently attached to the main board', hi: 'नहीं, वह मदरबोर्ड पर स्थायी रूप से जुड़ा होता है' },
          { en: 'Yes, via a USB pendrive', hi: 'हाँ, USB पेनड्राइव लगाकर' },
          { en: 'Yes, by updating Chrome', hi: 'हाँ, क्रोम अपडेट करके' },
        ],
        correctIndex: 0,
        explanation: { en: 'Built-in/SoC chips are soldered directly onto the board.', hi: 'इनबिल्ट चिप्स बोर्ड पर सोल्डर किए होते हैं।' },
      },
    ],
  },
  {
    id: 'comp-motherboard',
    order: 4,
    title: { en: 'What is a Motherboard?', hi: 'मदरबोर्ड (Motherboard) क्या है?' },
    category: 'hardware',
    durationMin: 4,
    diagramType: 'motherboard',
    image: '/src/assets/images/diagram_motherboard_parts_1795003777031.jpg',
    simpleDefinition: {
      en: 'The motherboard is the main green/dark circuit board inside a computer that connects CPU, RAM, storage, and USB ports together.',
      hi: 'मदरबोर्ड कंप्यूटर के अंदर का मुख्य सर्किट बोर्ड है जो CPU, RAM, स्टोरेज और USB पोर्ट्स सबको आपस में जोड़ता है।',
    },
    realLifeExample: {
      en: 'Like railway tracks connecting different cities in India so trains (data) can travel between them.',
      hi: 'भारत की रेलवे पटरियों की तरह जो अलग-अलग शहरों को जोड़ती हैं ताकि ट्रेन (डेटा) आ-जा सके।',
    },
    whyItMatters: {
      en: 'Every part must match the motherboard slots (like DDR4 vs DDR5 RAM or M.2 SSD).',
      hi: 'हर नया पार्ट (जैसे RAM या SSD) मदरबोर्ड के स्लॉट से मेल खाना ज़रूरी है।',
    },
    practicalTask: {
      en: 'Inspect the labeled motherboard diagram above and locate the CPU socket, RAM slots, and M.2 SSD slot.',
      hi: 'ऊपर दिए गए मदरबोर्ड चित्र में CPU सॉकेट, RAM स्लॉट और M.2 SSD स्लॉट को पहचानें।',
    },
    videoScriptSummary: {
      en: '45s Visual Tour: Pointing to every major socket on a real motherboard.',
      hi: '45 सेकंड टूर: असली मदरबोर्ड के हर ज़रूरी हिस्से की पहचान।',
    },
    quiz: [
      {
        id: 'q4-1',
        question: { en: 'What is the main job of the motherboard?', hi: 'मदरबोर्ड का मुख्य काम क्या है?' },
        options: [
          { en: 'Connect CPU, RAM, storage, and ports so they talk to each other', hi: 'CPU, RAM, स्टोरेज और पोर्ट्स को आपस में जोड़ना' },
          { en: 'Cool down the monitor', hi: 'मॉनिटर को ठंडा रखना' },
          { en: 'Store family photos permanently', hi: 'परिवार की फ़ोटो स्थायी रूप से सेव करना' },
        ],
        correctIndex: 0,
        explanation: { en: 'The motherboard is the central highway connecting all hardware.', hi: 'मदरबोर्ड सभी हार्डवेयर को जोड़ने वाला मुख्य प्लेटफॉर्म है।' },
      },
      {
        id: 'q4-2',
        question: { en: 'Which slot holds the temporary working memory?', hi: 'टेम्परेरी वर्किंग मेमोरी किस स्लॉट में लगती है?' },
        options: [
          { en: 'RAM (DIMM) slots', hi: 'RAM स्लॉट्स' },
          { en: 'Audio jack', hi: 'ऑडियो जैक' },
          { en: 'HDMI port', hi: 'HDMI पोर्ट' },
        ],
        correctIndex: 0,
        explanation: { en: 'RAM sticks plug into the long memory slots next to the CPU.', hi: 'RAM स्टिक्स CPU के पास वाले लंबे स्लॉट में लगती हैं।' },
      },
      {
        id: 'q4-3',
        question: { en: 'Can you plug a desktop motherboard into a laptop?', hi: 'क्या डेस्कटॉप का मदरबोर्ड लैपटॉप में लग सकता है?' },
        options: [
          { en: 'No, laptops use custom compact motherboards', hi: 'नहीं, लैपटॉप में छोटे और खास मदरबोर्ड होते हैं' },
          { en: 'Yes, they are identical in size', hi: 'हाँ, दोनों का आकार बराबर होता है' },
          { en: 'Only if you use tape', hi: 'हाँ, टेप से चिपका कर' },
        ],
        correctIndex: 0,
        explanation: { en: 'Desktop boards follow standard sizes (ATX/mATX), while laptops have custom shapes.', hi: 'डेस्कटॉप और लैपटॉप मदरबोर्ड के आकार अलग होते हैं।' },
      },
    ],
  },
  {
    id: 'comp-ram',
    order: 5,
    title: { en: 'What is RAM? (Study Desk Analogy)', hi: 'RAM क्या है? (स्टडी डेस्क उदाहरण)' },
    category: 'hardware',
    durationMin: 4,
    diagramType: 'ram',
    image: '/src/assets/images/diagram_ram_desk_1795003775852.jpg',
    simpleDefinition: {
      en: 'RAM means Random Access Memory. In simple words: RAM is your computer’s temporary working memory.',
      hi: 'RAM का मतलब Random Access Memory है। आसान शब्दों में: RAM कंप्यूटर की अस्थायी (temporary) काम करने की मेमोरी है।',
    },
    realLifeExample: {
      en: 'RAM is like your study desk. The bigger your desk, the more books and notes you can keep open at the same time.',
      hi: 'RAM आपकी पढ़ाई की मेज़ (स्टडी डेस्क) जैसी है। मेज़ जितनी बड़ी होगी, आप उतनी ज़्यादा किताबें एक साथ खोलकर पढ़ सकते हैं।',
    },
    whyItMatters: {
      en: 'When RAM fills up, your computer becomes slow and apps freeze. Turning off the PC clears RAM completely.',
      hi: 'RAM भर जाने पर कंप्यूटर धीमा हो जाता है और हैंग होने लगता है। कंप्यूटर बंद करते ही RAM खाली हो जाती है।',
    },
    keySpecs: [
      { label: '4 GB RAM', detail: { en: 'Good for basic browsing, documents, and light work.', hi: 'सामान्य इंटरनेट, डॉक्यूमेंट और हल्के काम के लिए।' } },
      { label: '8 GB RAM', detail: { en: 'Good for normal multitasking, browsing, Excel, and coding.', hi: 'सामान्य मल्टीटास्किंग, Excel और कोडिंग सीखने के लिए बढ़िया।' } },
      { label: '16 GB RAM', detail: { en: 'Good for heavy multitasking, programming, designing, and gaming.', hi: 'भारी मल्टीटास्किंग, प्रोग्रामिंग, डिज़ाइनिंग और गेमिंग के लिए।' } },
    ],
    practicalTask: {
      en: 'Open Task Manager (Ctrl + Shift + Esc) on your Windows PC and check how much RAM is currently being used.',
      hi: 'Windows कंप्यूटर पर Task Manager (Ctrl + Shift + Esc) खोलें और देखें कि अभी कितनी RAM उपयोग हो रही है।',
    },
    videoScriptSummary: {
      en: '45s Explainer: Watching a student work on a tiny desk (4GB) vs a wide desk (16GB).',
      hi: '45 सेकंड एक्सप्लेनर: छोटी मेज़ (4GB) और बड़ी मेज़ (16GB) पर पढ़ाई के अंतर को समझें।',
    },
    quiz: [
      {
        id: 'q5-1',
        question: { en: 'What happens to data in RAM when you switch off your computer?', hi: 'कंप्यूटर बंद करने पर RAM के डेटा का क्या होता है?' },
        options: [
          { en: 'It gets cleared completely', hi: 'वह पूरी तरह मिट जाता है' },
          { en: 'It stays saved forever', hi: 'वह हमेशा के लिए सेव रहता है' },
          { en: 'It moves to the printer', hi: 'वह प्रिंटर में चला जाता है' },
        ],
        correctIndex: 0,
        explanation: { en: 'RAM is temporary memory — always save files (Ctrl+S) to permanent storage!', hi: 'RAM अस्थायी मेमोरी है — इसलिए फाइल हमेशा सेव (Ctrl+S) करें!' },
      },
      {
        id: 'q5-2',
        question: { en: 'Which RAM size is recommended for comfortable Excel and Python coding?', hi: 'Excel और Python कोडिंग के लिए कितनी RAM सबसे सही मानी जाती है?' },
        options: [
          { en: '8 GB or higher', hi: '8 GB या उससे अधिक' },
          { en: '512 MB', hi: '512 MB' },
          { en: '1 GB', hi: '1 GB' },
        ],
        correctIndex: 0,
        explanation: { en: '8 GB RAM handles browser tabs, VS Code, and Excel smoothly.', hi: '8 GB RAM में ब्राउज़र, VS Code और Excel आराम से चलते हैं।' },
      },
      {
        id: 'q5-3',
        question: { en: 'In the study desk analogy, what represents your permanent bookshelf?', hi: 'स्टडी डेस्क उदाहरण में स्थायी अलमारी (Bookshelf) किसके बराबर है?' },
        options: [
          { en: 'Storage (SSD / HDD)', hi: 'स्टोरेज (SSD / HDD)' },
          { en: 'Cooling Fan', hi: 'कूलिंग फैन' },
          { en: 'Mouse', hi: 'माउस' },
        ],
        correctIndex: 0,
        explanation: { en: 'Books stay on the shelf (Storage) until you open them onto the desk (RAM).', hi: 'किताबें अलमारी (स्टोरेज) में रहती हैं और काम करते समय मेज़ (RAM) पर आती हैं।' },
      },
    ],
  },
  {
    id: 'comp-rom-storage-ssd',
    order: 6,
    title: { en: 'ROM, Storage & HDD vs SSD', hi: 'ROM, स्टोरेज और HDD बनाम SSD' },
    category: 'hardware',
    durationMin: 6,
    diagramType: 'storage',
    simpleDefinition: {
      en: 'ROM holds permanent startup instructions; Storage (HDD/SSD) keeps your OS, apps, and files even when power is off.',
      hi: 'ROM कंप्यूटर शुरू करने के स्थायी निर्देश रखता है; स्टोरेज (HDD/SSD) में आपके ऐप्स, फोटो और फाइलें बिजली बंद होने पर भी सुरक्षित रहते हैं।',
    },
    realLifeExample: {
      en: 'HDD is like a spinning record player (moving parts, slower). SSD is like an electronic chip memory card (no moving parts, super fast).',
      hi: 'HDD घूमने वाली डिस्क जैसा है (धीमा)। SSD इलेक्ट्रॉनिक चिप मेमोरी जैसा है (बिना घूमने वाले हिस्से, बहुत तेज़)।',
    },
    whyItMatters: {
      en: 'Upgrading an old slow laptop from HDD to SSD makes it boot in 10 seconds instead of 2 minutes!',
      hi: 'पुराने धीमे लैपटॉप में HDD की जगह SSD लगाने से वह 2 मिनट की जगह 10 सेकंड में चालू हो जाता है!',
    },
    keySpecs: [
      { label: 'ROM', detail: { en: 'Read-Only Memory; starts the computer (BIOS/UEFI) when you press power.', hi: 'केवल पढ़ने योग्य मेमोरी; पावर बटन दबाते ही कंप्यूटर बूट करती है।' } },
      { label: 'HDD (Hard Disk Drive)', detail: { en: 'Cheaper per GB, spinning magnetic platter; slower and fragile if dropped.', hi: 'सस्ता होता है, अंदर घूमने वाली डिस्क; धीमा और गिरने पर खराब होने का डर।' } },
      { label: 'SSD (Solid State Drive)', detail: { en: '5x–10x faster, silent, durable; must-have for Windows 11 & coding.', hi: '5 से 10 गुना तेज़, शांत और टिकाऊ; आज के हर लैपटॉप के लिए ज़रूरी।' } },
    ],
    practicalTask: {
      en: 'Check whether your PC uses an SSD or HDD by opening Task Manager → Performance tab → Disk 0.',
      hi: 'Task Manager → Performance → Disk 0 में जाकर देखें कि आपके कंप्यूटर में SSD है या HDD।',
    },
    videoScriptSummary: {
      en: '50s Speed Test: Comparing boot time of Windows on an HDD vs an NVMe SSD.',
      hi: '50 सेकंड स्पीड टेस्ट: HDD बनाम SSD पर Windows खुलने की रफ्तार का अंतर।',
    },
    quiz: [
      {
        id: 'q6-1',
        question: { en: 'Which storage drive makes a laptop noticeably faster?', hi: 'कौन-सी स्टोरेज ड्राइव लैपटॉप को काफी तेज़ बनाती है?' },
        options: [
          { en: 'SSD (Solid State Drive)', hi: 'SSD (सॉलिड स्टेट ड्राइव)' },
          { en: 'HDD (Hard Disk Drive)', hi: 'HDD (हार्ड डिस्क ड्राइव)' },
          { en: 'DVD Drive', hi: 'DVD ड्राइव' },
        ],
        correctIndex: 0,
        explanation: { en: 'SSDs have no moving parts and read data many times faster than HDDs.', hi: 'SSD में कोई घूमने वाला हिस्सा नहीं होता और यह HDD से कई गुना तेज़ है।' },
      },
      {
        id: 'q6-2',
        question: { en: 'What does ROM stand for?', hi: 'ROM का पूरा नाम क्या है?' },
        options: [
          { en: 'Read-Only Memory', hi: 'रीड-ओनली मेमोरी' },
          { en: 'Random Output Memory', hi: 'रैंडम आउटपुट मेमोरी' },
          { en: 'Run On Monitor', hi: 'रन ऑन मॉनिटर' },
        ],
        correctIndex: 0,
        explanation: { en: 'ROM stands for Read-Only Memory.', hi: 'ROM का अर्थ रीड-ओनली मेमोरी है।' },
      },
      {
        id: 'q6-3',
        question: { en: 'If you have 500 GB storage and 8 GB RAM, which number stores your movies and code files?', hi: 'यदि आपके पास 500 GB स्टोरेज और 8 GB RAM है, तो फिल्में और कोड फाइलें कहाँ सेव होती हैं?' },
        options: [
          { en: '500 GB Storage (SSD/HDD)', hi: '500 GB स्टोरेज (SSD/HDD)' },
          { en: '8 GB RAM', hi: '8 GB RAM' },
          { en: 'CPU Cache', hi: 'CPU कैश' },
        ],
        correctIndex: 0,
        explanation: { en: 'Files and folders live in permanent storage (SSD/HDD).', hi: 'फाइलें और फोल्डर स्थायी स्टोरेज (SSD/HDD) में सेव होते हैं।' },
      },
    ],
  },
  {
    id: 'comp-gen-gpu-psu-fan',
    order: 7,
    title: { en: 'Processor Generation, Graphics Card, Power Supply & Cooling Fan', hi: 'प्रोसेसर जनरेशन, ग्राफिक्स कार्ड, पावर सप्लाई और कूलिंग फैन' },
    category: 'hardware',
    durationMin: 6,
    diagramType: 'motherboard',
    simpleDefinition: {
      en: 'Processor generation tells how new a CPU is; GPU draws visuals/AI math; PSU supplies safe electricity; Fan prevents overheating.',
      hi: 'प्रोसेसर जनरेशन बताती है CPU कितना नया है; ग्राफिक्स कार्ड (GPU) स्क्रीन/वीडियो चलाता है; पावर सप्लाई बिजली देती है; फैन गर्मी बाहर निकालता है।',
    },
    realLifeExample: {
      en: 'In a car: Generation is the model year, GPU is the turbo for tough roads, PSU is the fuel tank, and Fan is the radiator cooling the engine.',
      hi: 'कार की तरह: जनरेशन मॉडल का साल है, GPU मुश्किल रास्तों के लिए टर्बो है, PSU फ्यूल टैंक है, और फैन इंजन ठंडा रखने वाला रेडिएटर है।',
    },
    whyItMatters: {
      en: 'Never buy an "i7" laptop without checking generation! An i3 12th Gen is often faster than an i7 4th Gen.',
      hi: 'बिना जनरेशन देखे कभी पुराना i7 लैपटॉप न खरीदें! नया i3 (12वीं जनरेशन) पुराने i7 (चौथी जनरेशन) से तेज़ हो सकता है।',
    },
    keySpecs: [
      { label: 'Generation', detail: { en: 'In Intel Core i5-1235U, the "12" after the dash means 12th Generation.', hi: 'Intel Core i5-1235U में डैश के बाद "12" का मतलब 12वीं जनरेशन है।' } },
      { label: 'Graphics Card (GPU)', detail: { en: 'Integrated GPU handles normal coding/video; Dedicated GPU helps 3D, video editing, AI.', hi: 'इंटीग्रेटेड GPU कोडिंग के लिए काफी है; डेडिकेटेड GPU गेमिंग व वीडियो एडिटिंग के लिए।' } },
      { label: 'Power Supply & Cooling', detail: { en: 'Never block laptop air vents on a bed/pillow; dust & heat slow down your CPU.', hi: 'लैपटॉप को तकिये/बिस्तर पर रखकर हवा के छेद बंद न करें; गर्मी से स्पीड कम होती है।' } },
    ],
    practicalTask: {
      en: 'Look at a laptop ad online and decode the processor generation (e.g., i5-1335U → 13th Gen).',
      hi: 'किसी ऑनलाइन लैपटॉप विज्ञापन में प्रोसेसर का नाम पढ़ें और उसकी जनरेशन पहचानें।',
    },
    videoScriptSummary: {
      en: '55s Guide: How to read Intel/AMD processor numbers so you never get fooled by shopkeepers.',
      hi: '55 सेकंड गाइड: प्रोसेसर नंबर पढ़ना सीखें ताकि दुकान पर कोई आपको पुराना मॉडल न बेच सके।',
    },
    quiz: [
      {
        id: 'q7-1',
        question: { en: 'In "Intel Core i5-1240P", which generation is the processor?', hi: '"Intel Core i5-1240P" कौन-सी जनरेशन का प्रोसेसर है?' },
        options: [
          { en: '12th Generation', hi: '12वीं जनरेशन' },
          { en: '5th Generation', hi: '5वीं जनरेशन' },
          { en: '40th Generation', hi: '40वीं जनरेशन' },
        ],
        correctIndex: 0,
        explanation: { en: 'The digits right after "i5-" (12) tell you it is 12th Generation.', hi: 'डैश के बाद की पहली दो संख्याएँ (12) जनरेशन बताती हैं।' },
      },
      {
        id: 'q7-2',
        question: { en: 'Why shouldn’t you keep a running laptop directly on a soft bedsheet or pillow?', hi: 'चलते हुए लैपटॉप को सीधे बिस्तर या तकिये पर क्यों नहीं रखना चाहिए?' },
        options: [
          { en: 'It blocks the cooling fan vents and causes overheating', hi: 'इससे कूलिंग फैन की हवा रुक जाती है और लैपटॉप ज़्यादा गर्म होता है' },
          { en: 'It deletes Python files', hi: 'इससे Python फाइलें डिलीट हो जाती हैं' },
          { en: 'It changes the wallpaper', hi: 'इससे वॉलपेपर बदल जाता है' },
        ],
        correctIndex: 0,
        explanation: { en: 'Airflow is required to keep the CPU cool.', hi: 'CPU को ठंडा रखने के लिए हवा का रास्ता खुला रहना ज़रूरी है।' },
      },
      {
        id: 'q7-3',
        question: { en: 'What does a Power Supply Unit (PSU) do in a desktop PC?', hi: 'डेस्कटॉप पीसी में पावर सप्लाई (PSU) क्या करती है?' },
        options: [
          { en: 'Converts wall electricity into safe low-voltage power for PC parts', hi: 'दीवार की बिजली को कंप्यूटर के हिस्सों के लिए सुरक्षित वोल्टेज में बदलती है' },
          { en: 'Connects to Wi-Fi', hi: 'Wi-Fi से जोड़ती है' },
          { en: 'Draws graphics on screen', hi: 'स्क्रीन पर चित्र बनाती है' },
        ],
        correctIndex: 0,
        explanation: { en: 'PSU regulates and delivers clean electrical power to every component.', hi: 'PSU हर हिस्से को सही और सुरक्षित बिजली पहुँचाता है।' },
      },
    ],
  },
  {
    id: 'comp-os-win-mac-linux',
    order: 8,
    title: { en: 'Operating System: Windows vs macOS vs Linux', hi: 'ऑपरेटिंग सिस्टम: Windows, macOS और Linux' },
    category: 'software',
    durationMin: 5,
    diagramType: 'os',
    simpleDefinition: {
      en: 'An Operating System (OS) is the master software that manages hardware and lets humans use apps easily.',
      hi: 'ऑपरेटिंग सिस्टम (OS) मुख्य सॉफ्टवेयर है जो हार्डवेयर को संभालता है और इंसान व कंप्यूटर के बीच पुल का काम करता है।',
    },
    realLifeExample: {
      en: 'Hardware is a car engine and wheels; the Operating System is the steering wheel, pedals, and dashboard that let you drive it.',
      hi: 'हार्डवेयर कार का इंजन और पहिये हैं; ऑपरेटिंग सिस्टम स्टीयरिंग व्हील और डैशबोर्ड है जिससे आप कार चलाते हैं।',
    },
    whyItMatters: {
      en: 'Windows powers most Indian offices, Linux powers cloud servers & cybersecurity, and macOS runs on Apple laptops.',
      hi: 'भारत के ज़्यादातर ऑफिस में Windows चलता है, सर्वर व साइबर सिक्योरिटी में Linux, और Apple लैपटॉप में macOS।',
    },
    keySpecs: [
      { label: 'Windows', detail: { en: 'Most popular for beginners, Excel, offices, and college laptops.', hi: 'शुरुआती छात्रों, Excel और ऑफिस काम के लिए सबसे आम।' } },
      { label: 'Linux (Ubuntu/Mint)', detail: { en: 'Free, open-source, lightweight, loved by developers & servers.', hi: 'बिल्कुल मुफ्त, ओपन-सोर्स, हल्का और डेवलपर्स व सर्वर का पसंदीदा।' } },
      { label: 'macOS', detail: { en: 'Apple’s smooth OS found only on MacBooks and iMacs.', hi: 'केवल Apple के MacBook और iMac कंप्यूटर पर चलता है।' } },
    ],
    practicalTask: {
      en: 'Check which OS and version your computer or phone is running right now.',
      hi: 'देखें कि आपका कंप्यूटर या फोन अभी कौन-सा OS वर्ज़न चला रहा है।',
    },
    videoScriptSummary: {
      en: '45s Overview: Comparing Windows 11, Ubuntu Linux, and macOS desktops side by side.',
      hi: '45 सेकंड झलक: Windows 11, Ubuntu Linux और macOS की स्क्रीन एक साथ देखें।',
    },
    quiz: [
      {
        id: 'q8-1',
        question: { en: 'Which operating system is completely free and open-source?', hi: 'इनमें से कौन-सा ऑपरेटिंग सिस्टम पूरी तरह मुफ्त और ओपन-सोर्स है?' },
        options: [
          { en: 'Linux', hi: 'लिनक्स (Linux)' },
          { en: 'Windows 11 Pro', hi: 'विंडोज़ 11 प्रो' },
          { en: 'macOS', hi: 'मैकओएस (macOS)' },
        ],
        correctIndex: 0,
        explanation: { en: 'Linux is free, open-source, and runs most of the world’s web servers.', hi: 'Linux मुफ्त और ओपन-सोर्स है।' },
      },
      {
        id: 'q8-2',
        question: { en: 'Can an app run on a computer without an Operating System?', hi: 'क्या बिना ऑपरेटिंग सिस्टम के कोई सामान्य ऐप चल सकता है?' },
        options: [
          { en: 'No, apps need the OS to talk to hardware', hi: 'नहीं, ऐप्स को हार्डवेयर से बात करने के लिए OS चाहिए' },
          { en: 'Yes, Excel works without an OS', hi: 'हाँ, Excel बिना OS के चलता है' },
          { en: 'Only on Tuesdays', hi: 'केवल मंगलवार को' },
        ],
        correctIndex: 0,
        explanation: { en: 'The OS gives apps access to screen, memory, keyboard, and storage.', hi: 'OS ही ऐप्स को स्क्रीन, मेमोरी और कीबोर्ड की सुविधा देता है।' },
      },
      {
        id: 'q8-3',
        question: { en: 'Android on smartphones is built on top of which OS kernel?', hi: 'स्मार्टफोन का Android किस OS के आधार पर बना है?' },
        options: [
          { en: 'Linux', hi: 'Linux' },
          { en: 'MS-DOS', hi: 'MS-DOS' },
          { en: 'macOS', hi: 'macOS' },
        ],
        correctIndex: 0,
        explanation: { en: 'Android uses the Linux kernel underneath!', hi: 'Android भी अंदर से Linux कर्नेल पर ही काम करता है!' },
      },
    ],
  },
  {
    id: 'comp-peripherals-ports',
    order: 9,
    title: { en: 'Peripherals, Mice Types & Ports (USB, HDMI, Audio, Charging)', hi: 'मॉनिटर, कीबोर्ड, माउस, वेबकैम, प्रिंटर व USB/HDMI पोर्ट्स' },
    category: 'hardware',
    durationMin: 6,
    diagramType: 'ports',
    image: '/src/assets/images/diagram_desktop_ports_1795003776211.jpg',
    simpleDefinition: {
      en: 'Peripherals are outside devices plugged into your computer through ports like USB, HDMI, and audio jacks.',
      hi: 'पेरिफेरल्स वे बाहरी डिवाइस हैं (माउस, कीबोर्ड, मॉनिटर, प्रिंटर) जिन्हें USB, HDMI और ऑडियो पोर्ट के ज़रिए कंप्यूटर से जोड़ा जाता है।',
    },
    realLifeExample: {
      en: 'Ports are like wall electrical sockets — each socket has a specific shape so only the matching plug fits.',
      hi: 'पोर्ट्स घर की बिजली के सॉकेट जैसे होते हैं — हर सॉकेट का आकार अलग होता है ताकि सही केबल सही जगह लगे।',
    },
    whyItMatters: {
      en: 'Knowing wired vs wireless (2.4GHz USB dongle) vs Bluetooth mouse and USB-C vs HDMI saves confusion during interviews or office setup.',
      hi: 'वायर्ड, वायरलेस डोंगल और ब्लूटूथ माउस तथा USB-C व HDMI पोर्ट की जानकारी ऑफिस और इंटरव्यू में बहुत काम आती है।',
    },
    keySpecs: [
      { label: 'Wired vs Wireless vs Bluetooth Mouse', detail: { en: 'Wired uses USB cable (no battery needed); Wireless uses a tiny USB receiver; Bluetooth connects directly without taking a USB port.', hi: 'वायर्ड केबल से जुड़ता है; वायरलेस में छोटा USB डोंगल लगता है; ब्लूटूथ बिना डोंगल के जुड़ता है।' } },
      { label: 'USB-A & USB-C', detail: { en: 'USB-A is rectangular; USB-C is small, oval, reversible, used for fast data and charging.', hi: 'USB-A चौकोर होता है; USB-C छोटा और दोनों तरफ से लगने वाला नया पोर्ट है।' } },
      { label: 'HDMI & Audio Jack', detail: { en: 'HDMI sends video + sound to TVs/monitors; 3.5mm jack connects wired earphones.', hi: 'HDMI स्क्रीन और आवाज़ टीवी/मॉनिटर तक भेजता है; 3.5mm जैक में ईयरफोन लगते हैं।' } },
    ],
    practicalTask: {
      en: 'Inspect the sides of a laptop or phone and name every port you see.',
      hi: 'किसी लैपटॉप या फोन के किनारों को देखकर हर पोर्ट का नाम पहचानें।',
    },
    videoScriptSummary: {
      en: '50s Walkthrough: Plugging in HDMI, USB-A, USB-C, and pairing a Bluetooth mouse.',
      hi: '50 सेकंड गाइड: HDMI, USB-A, USB-C लगाना और ब्लूटूथ माउस कनेक्ट करना।',
    },
    quiz: [
      {
        id: 'q9-1',
        question: { en: 'Which cable sends BOTH HD video and audio to a TV or projector?', hi: 'टीवी या प्रोजेक्टर पर वीडियो और आवाज़ दोनों भेजने के लिए कौन-सी केबल लगती है?' },
        options: [
          { en: 'HDMI cable', hi: 'HDMI केबल' },
          { en: '3.5mm audio cable', hi: '3.5mm ऑडियो केबल' },
          { en: 'Power cord', hi: 'पावर कॉर्ड' },
        ],
        correctIndex: 0,
        explanation: { en: 'HDMI carries high-definition video and sound in a single cable.', hi: 'HDMI एक ही केबल से वीडियो और ऑडियो दोनों भेजती है।' },
      },
      {
        id: 'q9-2',
        question: { en: 'Which mouse needs NO cable and NO USB dongle?', hi: 'किस माउस को न केबल चाहिए और न ही USB डोंगल?' },
        options: [
          { en: 'Bluetooth mouse', hi: 'ब्लूटूथ माउस' },
          { en: 'Wired USB mouse', hi: 'वायर्ड USB माउस' },
          { en: '2.4GHz dongle mouse', hi: '2.4GHz डोंगल माउस' },
        ],
        correctIndex: 0,
        explanation: { en: 'Bluetooth mice connect directly to your laptop’s built-in Bluetooth radio.', hi: 'ब्लूटूथ माउस सीधे लैपटॉप के इनबिल्ट ब्लूटूथ से जुड़ता है।' },
      },
      {
        id: 'q9-3',
        question: { en: 'Which USB port can be plugged in either way up?', hi: 'कौन-सा USB पोर्ट दोनों तरफ से (सीधा या उल्टा) आसानी से लग जाता है?' },
        options: [
          { en: 'USB-C', hi: 'USB-C' },
          { en: 'USB-A', hi: 'USB-A' },
          { en: 'HDMI', hi: 'HDMI' },
        ],
        correctIndex: 0,
        explanation: { en: 'USB-C is symmetric and reversible.', hi: 'USB-C दोनों तरफ से एक जैसा होता है।' },
      },
    ],
  },
  {
    id: 'comp-connectivity-net',
    order: 10,
    title: { en: 'Bluetooth, Wi-Fi, The Internet & Web Browsers', hi: 'Bluetooth, Wi-Fi, इंटरनेट और वेब ब्राउज़र' },
    category: 'connectivity',
    durationMin: 5,
    diagramType: 'network',
    simpleDefinition: {
      en: 'Bluetooth connects nearby devices (10m); Wi-Fi connects to a router wirelessly; the Internet connects computers worldwide; a Browser opens websites.',
      hi: 'Bluetooth पास के डिवाइस जोड़ता है; Wi-Fi राउटर से वायरलेस इंटरनेट देता है; इंटरनेट दुनिया भर के कंप्यूटरों को जोड़ता है; ब्राउज़र वेबसाइट खोलता है।',
    },
    realLifeExample: {
      en: 'Bluetooth is whispering to a friend next to you; Wi-Fi is talking across your home; the Internet is the national highway network; a Browser is the car you drive on websites.',
      hi: 'Bluetooth पास बैठे दोस्त से बात करना है; Wi-Fi घर के अंदर नेटवर्क है; इंटरनेट देश भर की सड़कें हैं; और ब्राउज़र (Chrome/Edge) आपकी गाड़ी है।',
    },
    whyItMatters: {
      en: 'Knowing the difference between "No Wi-Fi" and "Website is down" lets you troubleshoot internet problems calmly.',
      hi: 'Wi-Fi न आने और वेबसाइट न खुलने का फर्क समझने से आप इंटरनेट की समस्या खुद ठीक कर सकते हैं।',
    },
    practicalTask: {
      en: 'Open your browser (Chrome or Edge), type https://docs.python.org, and bookmark it with Ctrl + D.',
      hi: 'अपना ब्राउज़र खोलें, https://docs.python.org पर जाएँ और Ctrl + D से बुकमार्क करें।',
    },
    videoScriptSummary: {
      en: '45s Animation: How a website request travels from your laptop → Wi-Fi router → Internet → Server and back.',
      hi: '45 सेकंड एनिमेशन: आपकी वेबसाइट रिक्वेस्ट लैपटॉप से राउटर और सर्वर तक कैसे जाती है।',
    },
    quiz: [
      {
        id: 'q10-1',
        question: { en: 'Which technology is best for connecting wireless earphones to your phone?', hi: 'फोन से वायरलेस ईयरफोन जोड़ने के लिए क्या उपयोग होता है?' },
        options: [
          { en: 'Bluetooth', hi: 'ब्लूटूथ (Bluetooth)' },
          { en: 'HDMI', hi: 'HDMI' },
          { en: 'Task Manager', hi: 'टास्क मैनेजर' },
        ],
        correctIndex: 0,
        explanation: { en: 'Bluetooth is built for short-range low-power audio and accessories.', hi: 'ब्लूटूथ कम दूरी के ऑडियो और डिवाइस जोड़ने के लिए बना है।' },
      },
      {
        id: 'q10-2',
        question: { en: 'What is Google Chrome or Microsoft Edge?', hi: 'Google Chrome या Microsoft Edge क्या हैं?' },
        options: [
          { en: 'Web Browsers', hi: 'वेब ब्राउज़र' },
          { en: 'Operating Systems', hi: 'ऑपरेटिंग सिस्टम' },
          { en: 'Antivirus hardware', hi: 'एंटीवायरस हार्डवेयर' },
        ],
        correctIndex: 0,
        explanation: { en: 'Browsers are apps that fetch and display web pages.', hi: 'ब्राउज़र वे ऐप हैं जो वेबसाइट दिखाते हैं।' },
      },
      {
        id: 'q10-3',
        question: { en: 'If Wi-Fi shows "Connected, No Internet", where is the issue usually?', hi: 'यदि Wi-Fi "Connected, No Internet" दिखाए, तो समस्या कहाँ होती है?' },
        options: [
          { en: 'Between the router and your internet provider (ISP)', hi: 'राउटर और इंटरनेट सेवा कंपनी के बीच' },
          { en: 'Your keyboard is broken', hi: 'आपका कीबोर्ड खराब है' },
          { en: 'Your monitor needs cleaning', hi: 'मॉनिटर साफ करने की ज़रूरत है' },
        ],
        correctIndex: 0,
        explanation: { en: 'Your laptop reaches the router fine, but the router has no outside internet connection.', hi: 'आपका लैपटॉप राउटर से जुड़ा है, पर राउटर को आगे इंटरनेट नहीं मिल रहा।' },
      },
    ],
  },
  {
    id: 'comp-apps-files-folders',
    order: 11,
    title: { en: 'Apps, Files, Folders & File Extensions', hi: 'ऐप (App), फाइल, फोल्डर और फाइल एक्सटेंशन' },
    category: 'daily-use',
    durationMin: 5,
    diagramType: 'os',
    simpleDefinition: {
      en: 'An App is a tool that performs a job; a File is a saved document/photo/code; a Folder is a box that organizes files.',
      hi: 'ऐप (App) काम करने का सॉफ्टवेयर है; फाइल आपका सेव किया डेटा है (फोटो, कोड); फोल्डर फाइलों को व्यवस्थित रखने का डिब्बा है।',
    },
    realLifeExample: {
      en: 'A Folder is a school bag, Files are individual notebooks inside it, and file extensions (.pdf, .xlsx, .py) are subject labels on the notebook cover.',
      hi: 'फोल्डर स्कूल बैग जैसा है, फाइलें अंदर रखी कॉपियाँ हैं, और एक्सटेंशन (.pdf, .xlsx, .py) कॉपी के ऊपर लगा विषय का नाम है।',
    },
    whyItMatters: {
      en: 'Every Python file ends with `.py`, Excel with `.xlsx`, PDF with `.pdf`. Messy files cause lost assignments!',
      hi: 'हर Python फाइल `.py` से और Excel फाइल `.xlsx` से खत्म होती है। सही फोल्डर रखने से प्रोजेक्ट कभी नहीं खोते!',
    },
    practicalTask: {
      en: 'Create a folder named "TechStart_Practice" on your Desktop and save a text file inside it.',
      hi: 'अपने डेस्कटॉप पर "TechStart_Practice" नाम का फोल्डर बनाएँ और उसमें एक टेक्स्ट फाइल सेव करें।',
    },
    videoScriptSummary: {
      en: '40s Demo: Organizing messy downloads into clean Folders and reading `.py` vs `.exe` extensions.',
      hi: '40 सेकंड डेमो: बिखरी फाइलों को फोल्डर में सजाना और `.py` व `.exe` का फर्क समझना।',
    },
    quiz: [
      {
        id: 'q11-1',
        question: { en: 'What extension does a Python file have?', hi: 'Python प्रोग्राम फाइल के अंत में कौन-सा एक्सटेंशन होता है?' },
        options: [
          { en: '.py', hi: '.py' },
          { en: '.xlsx', hi: '.xlsx' },
          { en: '.jpg', hi: '.jpg' },
        ],
        correctIndex: 0,
        explanation: { en: 'Python source files always end with .py.', hi: 'Python फाइलों के अंत में हमेशा .py लगता है।' },
      },
      {
        id: 'q11-2',
        question: { en: 'Can a folder contain other folders inside it?', hi: 'क्या एक फोल्डर के अंदर दूसरे फोल्डर बनाए जा सकते हैं?' },
        options: [
          { en: 'Yes, they are called subfolders', hi: 'हाँ, उन्हें सब-फोल्डर (subfolders) कहते हैं' },
          { en: 'No, only 1 level is allowed', hi: 'नहीं, केवल एक ही लेवल बनता है' },
          { en: 'Only for music files', hi: 'केवल गानों के लिए' },
        ],
        correctIndex: 0,
        explanation: { en: 'Subfolders help organize projects cleanly.', hi: 'सब-फोल्डर्स से बड़े प्रोजेक्ट भी साफ-सुथरे रहते हैं।' },
      },
      {
        id: 'q11-3',
        question: { en: 'Which file extension is used by Microsoft Excel?', hi: 'Microsoft Excel फाइल का एक्सटेंशन क्या होता है?' },
        options: [
          { en: '.xlsx', hi: '.xlsx' },
          { en: '.mp3', hi: '.mp3' },
          { en: '.png', hi: '.png' },
        ],
        correctIndex: 0,
        explanation: { en: 'Modern Excel workbooks end with .xlsx.', hi: 'आधुनिक Excel फाइलें .xlsx से खत्म होती हैं।' },
      },
    ],
  },
  {
    id: 'comp-taskmgr-antivirus-shot-keys',
    order: 12,
    title: { en: 'Task Manager, Antivirus, Screenshots & Shortcut Keys', hi: 'टास्क मैनेजर, एंटीवायरस, स्क्रीनशॉट और शॉर्टकट कीज़' },
    category: 'daily-use',
    durationMin: 5,
    diagramType: 'os',
    simpleDefinition: {
      en: 'Task Manager shows what is slowing down your PC; Antivirus protects against malware; Screenshots capture your screen; Shortcuts save hours.',
      hi: 'Task Manager दिखाता है कौन-सा ऐप कंप्यूटर धीमा कर रहा है; Antivirus वायरस से बचाता है; स्क्रीनशॉट स्क्रीन की फोटो लेता है; शॉर्टकट समय बचाते हैं।',
    },
    realLifeExample: {
      en: 'Task Manager is like a car mechanic checking which engine belt is stuck; Antivirus is your home security guard.',
      hi: 'Task Manager कार मैकेनिक की तरह है जो जाँचता है कहाँ रुकावट है; Antivirus घर के चौकीदार जैसा है।',
    },
    whyItMatters: {
      en: 'Instead of pulling the power plug when an app freezes, you can calmly close that single app with Task Manager!',
      hi: 'जब कोई ऐप अटक जाए, तो कंप्यूटर की बिजली बंद करने के बजाय Task Manager से सिर्फ उसी ऐप को बंद कर सकते हैं!',
    },
    practicalTask: {
      en: 'Press Windows + Shift + S to capture a screenshot of part of your screen, then paste it into Paint or Word.',
      hi: 'Windows + Shift + S दबाकर स्क्रीन के किसी हिस्से का स्क्रीनशॉट लें।',
    },
    videoScriptSummary: {
      en: '45s Demo: Closing a frozen app via Ctrl+Shift+Esc and taking a fast partial screenshot.',
      hi: '45 सेकंड डेमो: Ctrl+Shift+Esc से अटके ऐप को बंद करना और स्क्रीनशॉट लेना।',
    },
    quiz: [
      {
        id: 'q12-1',
        question: { en: 'Which shortcut opens Task Manager directly on Windows?', hi: 'Windows में सीधे Task Manager खोलने का शॉर्टकट क्या है?' },
        options: [
          { en: 'Ctrl + Shift + Esc', hi: 'Ctrl + Shift + Esc' },
          { en: 'Ctrl + B', hi: 'Ctrl + B' },
          { en: 'Alt + F1', hi: 'Alt + F1' },
        ],
        correctIndex: 0,
        explanation: { en: 'Ctrl + Shift + Esc launches Task Manager immediately.', hi: 'Ctrl + Shift + Esc से तुरंत Task Manager खुलता है।' },
      },
      {
        id: 'q12-2',
        question: { en: 'Which built-in antivirus comes free with Windows 10 and 11?', hi: 'Windows 10 और 11 में कौन-सा मुफ्त एंटीवायरस पहले से आता है?' },
        options: [
          { en: 'Windows Security (Microsoft Defender)', hi: 'Windows Security (Microsoft Defender)' },
          { en: 'Notepad', hi: 'Notepad' },
          { en: 'Calculator', hi: 'Calculator' },
        ],
        correctIndex: 0,
        explanation: { en: 'Microsoft Defender protects Windows automatically without buying extra software.', hi: 'Microsoft Defender बिना किसी अतिरिक्त खर्च के Windows को सुरक्षित रखता है।' },
      },
      {
        id: 'q12-3',
        question: { en: 'Which shortcut opens the Snipping Tool for taking a custom screenshot?', hi: 'स्क्रीन के चुने हुए हिस्से का स्क्रीनशॉट लेने का शॉर्टकट क्या है?' },
        options: [
          { en: 'Windows + Shift + S', hi: 'Windows + Shift + S' },
          { en: 'Ctrl + P', hi: 'Ctrl + P' },
          { en: 'Ctrl + Z', hi: 'Ctrl + Z' },
        ],
        correctIndex: 0,
        explanation: { en: 'Windows + Shift + S lets you drag and copy any region of your screen.', hi: 'Windows + Shift + S से आप स्क्रीन का कोई भी हिस्सा कैप्चर कर सकते हैं।' },
      },
    ],
  },
];
