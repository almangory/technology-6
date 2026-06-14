import React, { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { SimulatorType, UserStats } from '../types';

interface InteractiveToolsProps {
  type: SimulatorType;
  lessonId: string;
  stats: UserStats;
  onEmitPoints: (points: number) => void;
  onEmitAchievement: (achId: string) => void;
  onClose: () => void;
}

export const InteractiveTools: React.FC<InteractiveToolsProps> = ({
  type,
  lessonId,
  stats,
  onEmitPoints,
  onEmitAchievement,
  onClose
}) => {
  // Global helpers
  const renderIcon = (iconName: string, className = "w-4 h-4") => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <LucideIcons.HelpCircle className={className} />;
  };

  // Sound generator using Web Audio API (perfect for game/correct alerts!)
  const playSound = (soundType: 'success' | 'click' | 'laser' | 'fail') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (soundType === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (soundType === 'fail') {
        osc.type = 'square';
        osc.frequency.slice ? null : osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (soundType === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        // click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {
      // AudioContext fails gracefully if browser blocks before interactions
    }
  };

  // ==========================================
  // SIMULATOR 1: NETWORK LAB (Unit 1)
  // ==========================================
  const [networkType, setNetworkType] = useState<'build' | 'cloud'>('build');
  const [pcsConnected, setPcsConnected] = useState<{ [key: string]: boolean }>({
    server: false,
    clientA: false,
    clientB: false,
    printer: false
  });
  const [pingIpInput, setPingIpInput] = useState('');
  const [pingTerminal, setPingTerminal] = useState<string[]>([
    'مرحبا بك في موجه أوامر مختبر المنهج...',
    'صل الأجهزة بالراوتر أولاً عبر الضغط عليها، ثم جرب فحص اتصال IP.'
  ]);
  const [cloudFiles, setCloudFiles] = useState<Array<{ name: string; size: number; icon: string; isUploaded: boolean }>>([
    { name: 'كتاب تقنية المعلومات.pdf', size: 14, icon: 'FileText', isUploaded: false },
    { name: 'برنامج باوربوينت_عرض.pptx', size: 35, icon: 'Tv2', isUploaded: false },
    { name: 'صورة_تلميذ_الصف_السادس.png', size: 8, icon: 'Image', isUploaded: false },
    { name: 'درجات_الامتحانات_إكسس.accdb', size: 19, icon: 'Database', isUploaded: false }
  ]);
  const [cloudCapacity, setCloudCapacity] = useState(0); // overall percentage
  const [activeTab1, setActiveTab1] = useState(1);

  const toggleNetworkConnection = (device: string) => {
    playSound('click');
    setPcsConnected(prev => ({
      ...prev,
      [device]: !prev[device]
    }));
  };

  const connectAllNetwork = () => {
    playSound('success');
    setPcsConnected({
      server: true,
      clientA: true,
      clientB: true,
      printer: true
    });
    setPingTerminal(prev => [
      ...prev,
      '>> تم توصيل جميع المكونات! الشبكة المحلية (LAN) جاهزة للعمل بنجاح.',
      '>> تمت مواءمة الطابعة المشتركة لجميع الأجهزة سلكياً ولاسلكياً.'
    ]);
  };

  const handlePing = () => {
    if (!pcsConnected.clientA && !pcsConnected.server) {
      playSound('fail');
      setPingTerminal(prev => [...prev, 'خطأ: لم يتم ربط الأجهزة بالراوتر بعد!']);
      return;
    }
    const cleanIp = pingIpInput.trim();
    if (!cleanIp) return;
    playSound('click');
    setPingTerminal(prev => [...prev, `PING ${cleanIp} block transmission with 32 bytes of data:`]);

    setTimeout(() => {
      if (cleanIp === '192.158.5.105') {
        playSound('success');
        setPingTerminal(prev => [
          ...prev,
          `  الرد من ${cleanIp}: البايتات=32 الوقت=1.5ms البصمة MAC=9C-35-5B-5F-4C-D7`,
          `  تم الرد بنجاح! الاتصال بخادم الصف السادس ممتاز!`,
          `  [مكافأة] أحسنت! هذا هو عنوان IP المتغير المكتوب بصفحة المنهج!`
        ]);
        onEmitPoints(20);
        onEmitAchievement('ach-1');
      } else if (cleanIp.startsWith('192.168.')) {
        playSound('success');
        setPingTerminal(prev => [
          ...prev,
          `  الرد من ${cleanIp}: البايتات=32 الوقت=4ms تلقائي`,
          `  اتصال محلي ناجح! جرب كتابة عنوان الكتاب المدرسي المكتوب بالدرس ٢ لمعرفة عنوان السيرفر الرئيسي ومكافأة الأوسمة!`
        ]);
      } else {
        playSound('fail');
        setPingTerminal(prev => [
          ...prev,
          `  فشل الاتصال بـ ${cleanIp}: انتهت مهلة طلب الحزمة الطلبية (Request Timed Out).`,
          `  نصيحة: عناوين IP الخاصة بالمدرسة والمنهج تبدأ غالباً بـ 192.158.5.x`
        ]);
      }
    }, 450);
  };

  const uploadCloudFile = (index: number) => {
    if (cloudFiles[index].isUploaded) return;
    playSound('success');
    const updated = [...cloudFiles];
    updated[index].isUploaded = true;
    setCloudFiles(updated);

    const increment = Math.round(cloudFiles[index].size * 1.5);
    setCloudCapacity(prev => Math.min(prev + increment, 100));

    // Emit points for studying/testing cloud upload
    onEmitPoints(10);
    if (updated.every(f => f.isUploaded)) {
      onEmitAchievement('ach-1'); // Unlock Networks award
    }
  };

  // ==========================================
  // SIMULATOR 2: CYBER GATE (Unit 2)
  // ==========================================
  const [cyberTab, setCyberTab] = useState<'firewall' | 'password' | 'encryption' | 'cases'>('firewall');
  const [firewallOn, setFirewallOn] = useState(false);
  const [computerHealth, setComputerHealth] = useState(100);
  const [scannedKills, setScannedKills] = useState(0);
  const [activePackets, setActivePackets] = useState<Array<{ id: number; text: string; isVirus: boolean; x: number; y: number }>>([]);
  const [passInput, setPassInput] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [cipherShift, setCipherShift] = useState(3);
  const [encryptedValue, setEncryptedValue] = useState('');

  // Floating packets game loop for Firewall simulation
  useEffect(() => {
    if (cyberTab !== 'firewall') return;

    const interval = setInterval(() => {
      // Spawn new packet
      const packetTypes = [
        { text: 'فيروس مدمر Virus 😈', isVirus: true },
        { text: 'هجوم حجب الخدمة DoS ⚠️', isVirus: true },
        { text: 'موقع تعليمي مميز 📚', isVirus: false },
        { text: 'بريد صديق عزيز ✉️', isVirus: false },
        { text: 'هاكر ومخترق Hacker 🛑', isVirus: true },
        { text: 'منهج ipSchools 🏫', isVirus: false }
      ];

      const r = Math.floor(Math.random() * packetTypes.length);
      const chosen = packetTypes[r];

      setActivePackets(prev => [
        ...prev,
        {
          id: Date.now(),
          text: chosen.text,
          isVirus: chosen.isVirus,
          x: 100, // right percentage
          y: Math.random() * 80 + 10 // top percentage
        }
      ]);
    }, 1800);

    return () => clearInterval(interval);
  }, [cyberTab]);

  // Handle packet animations and firewall checks
  useEffect(() => {
    if (cyberTab !== 'firewall') return;

    const gameTick = setInterval(() => {
      setActivePackets(prev => {
        const next: typeof prev = [];
        prev.forEach(p => {
          const nextX = p.x - 4; // Move left-ward
          if (nextX <= 25) {
            // Reaches local computer!
            if (p.isVirus) {
              if (firewallOn) {
                // Intercepted by Firewall
                playSound('success');
                setScannedKills(k => k + 1);
              } else {
                // Crashed Computer
                playSound('fail');
                setComputerHealth(h => Math.max(h - 25, 0));
              }
            } else {
              // Safe packet enters safely
              playSound('click');
            }
          } else {
            next.push({ ...p, x: nextX });
          }
        });
        return next;
      });
    }, 150);

    return () => clearInterval(gameTick);
  }, [cyberTab, firewallOn]);

  const handleShotPacket = (id: number, isVirus: boolean) => {
    playSound('laser');
    setActivePackets(prev => prev.filter(p => p.id !== id));
    if (isVirus) {
      setScannedKills(k => {
        const nextK = k + 1;
        if (nextK >= 3) {
          onEmitAchievement('ach-2'); // unlocked Cyber Defender
          onEmitPoints(30);
        }
        return nextK;
      });
    } else {
      // Shot a good packet! Penalty
      setComputerHealth(h => Math.max(h - 10, 0));
    }
  };

  const getPassProgress = (pass: string) => {
    let score = 0;
    if (pass.length === 0) return { title: 'أدخل كلمة مرور باللغة الإنجليزية', color: 'bg-slate-200 text-slate-500 w-0' };
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 25;

    if (score <= 25) return { title: 'ضعيفة جدا وسهلة التخمين 🛑', color: 'bg-red-500 text-red-100', width: 'w-1/4' };
    if (score <= 50) return { title: 'ضعيفة - أضف أرقام روتينية ⚠️', color: 'bg-orange-500 text-orange-100', width: 'w-2/4' };
    if (score <= 75) return { title: 'متوسطة الأمان - أضف علامات خاصة ⚡', color: 'bg-blue-500 text-blue-100', width: 'w-3/4' };
    return { title: 'قوية ومحمية بنجاح ممتاز! 🌟', color: 'bg-emerald-500 text-emerald-100', width: 'w-full' };
  };

  const passwordStrength = getPassProgress(passInput);

  const handleEncryptText = () => {
    if (!cipherText.trim()) return;
    playSound('success');
    let output = '';
    const alphabetAr = 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي';
    for (const char of cipherText) {
      const idx = alphabetAr.indexOf(char);
      if (idx !== -1) {
        const nextIdx = (idx + cipherShift) % alphabetAr.length;
        output += alphabetAr[nextIdx];
      } else {
        // Simple English/Fallback Shift
        const code = char.charCodeAt(0);
        output += String.fromCharCode(code + cipherShift);
      }
    }
    setEncryptedValue(output);
    onEmitPoints(10);
  };

  // Safe internet cases
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedCaseAnswer, setSelectedCaseAnswer] = useState<number | null>(null);
  const [showCaseFeedback, setShowCaseFeedback] = useState(false);

  const CAROUSEL_CASES = [
    {
      student: 'التلميذة ياسمين 👧',
      scenario: 'أرادت ياسمين إرسال رسالة بريد إلكتروني تفاعلية لصديقتها في المدرسة ولكن لا تملك بريداً خاصاً. عرض عليها تلميذ مجهول بالملتقى الاجتماعي أن يعطيها بريداً مقابل أن تعطيه كلمة السر الخاصة بحسابها الاجتماعي بالكامل.',
      options: [
        'توافق وتتبادل معه بحسن نية لترسل الرسالة بسرعة.',
        'ترفض رفضاً باتاً! فالكتاب المدرسي يحظر قطعياً مشاركة كلمة السر مع الغرباء للحفاظ على سرية البيانات.',
        'تعيد نشر عروضها وتستعين بالهاكرز لتهديده.'
      ],
      correct: 1,
      explain: 'البريد الإلكتروني والسرية هي خط الأمان ولا نشارك كلمات المرور بأي حال!'
    },
    {
      student: 'التلميذ عمر 👦',
      scenario: 'قام عمر بإنشاء حساب تفاعلي، ولاختصار الوقت وتفادي نسيان كلمة المرور، وضع اسم حبه الحقيقي وتاريخ ميلاده البسيط (عمر2014) كرمز دخول ثابت.',
      options: [
        'تصرف سليم يسهل عليه تذكر كلمة المرور والسرعة.',
        'خطأ فادح! كلمة المرور سهلة التخمين وعرضة للاختراق بسهولة. عليه دمج حروف وأرقام وعلامات غامضة كما بالمنهج.',
        'المفترض ألا يضع أي رقم سري كي لا يتذكره أحد.'
      ],
      correct: 1,
      explain: 'صعوبة التخمين تحميك من محاولات القرصنة المتكررة.'
    },
    {
      student: 'التلميذة سلمى 👧',
      scenario: 'تشاجرت سلمى مع زميلتها بالصف، وشعرت بغضب شديد فقررت إرسال رسائل اتهام بذيئة وسيئة لها فوراً عبر تطبيق واتساب ومقاطعتها.',
      options: [
        'تتصرف بتسرع وترسل الرسائل البذيئة لتشفي غيظها.',
        'تتجنب التسرع والرد بغضب بالوسائط الإلكترونية وتتواصل مع أفراد أسرتها أو المعلمين لحل الإشكال بوقار وهدوء.',
        'تذهب للقرصان الافتراضي وتسحب الحساب البنكي لقرينتها.'
      ],
      correct: 1,
      explain: 'قواعد السلوك القويم بالإنترنت تملي عدم بث رسائل تفيض بالعداوة والغضب للغير.'
    }
  ];

  const handleCaseAnswer = (index: number) => {
    setSelectedCaseAnswer(index);
    setShowCaseFeedback(true);
    if (index === CAROUSEL_CASES[currentCaseIndex].correct) {
      playSound('success');
      onEmitPoints(15);
    } else {
      playSound('fail');
    }
  };

  const nextCase = () => {
    setSelectedCaseAnswer(null);
    setShowCaseFeedback(false);
    setCurrentCaseIndex((p) => (p + 1) % CAROUSEL_CASES.length);
  };


  // ==========================================
  // SIMULATOR 3: POWERPOINT (Unit 3)
  // ==========================================
  const [pptSlides, setPptSlides] = useState<Array<{ title: string; subtitle: string; color: string; sticker: string }>>([
    { title: 'كتاب تكنولوجيا المعلومات', subtitle: 'مرحباً بكم في حاسوب معهدنا', color: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900', sticker: '💻' },
    { title: 'مفهوم شبكة الحاسب', subtitle: 'نظام رائع لربط الأجهزة ومشاركة الطابعة', color: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900', sticker: '🔌' }
  ]);
  const [pptIdx, setPptIdx] = useState(0);
  const [pptTransition, setPptTransition] = useState<'none' | 'curtains' | 'glitter'>('curtains');
  const [slideShowActive, setSlideShowActive] = useState(false);
  const [curtainsSplit, setCurtainsSplit] = useState(false);

  const addNewSlide = () => {
    playSound('success');
    setPptSlides(prev => [
      ...prev,
      {
        title: 'شريحة موضوع جديدة',
        subtitle: 'المحتوى والفقرات التعليمية الممتعة...',
        color: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-900',
        sticker: '🌟'
      }
    ]);
    setPptIdx(pptSlides.length);
  };

  const deleteCurrentSlide = (idx: number) => {
    if (pptSlides.length <= 1) return;
    playSound('click');
    setPptSlides(prev => prev.filter((_, i) => i !== idx));
    setPptIdx(0);
  };

  const updateSlideField = (field: 'title' | 'subtitle', val: string) => {
    const updated = [...pptSlides];
    updated[pptIdx] = {
      ...updated[pptIdx],
      [field]: val
    };
    setPptSlides(updated);
  };

  const changeSlideColor = (themeString: string) => {
    playSound('click');
    const updated = [...pptSlides];
    updated[pptIdx] = {
      ...updated[pptIdx],
      color: themeString
    };
    setPptSlides(updated);
  };

  const changeSlideSticker = (stickerStr: string) => {
    playSound('click');
    const updated = [...pptSlides];
    updated[pptIdx] = {
      ...updated[pptIdx],
      sticker: stickerStr
    };
    setPptSlides(updated);
  };

  const triggerSlideShow = () => {
    playSound('success');
    setSlideShowActive(true);
    setCurtainsSplit(false);

    if (pptTransition === 'curtains') {
      setTimeout(() => {
        setCurtainsSplit(true);
      }, 700);
    }
  };

  // ==========================================
  // SIMULATOR 4: SOFTWARE & DATABASE (Unit 4)
  // ==========================================
  const [dbTab, setDbTab] = useState<'os' | 'builder' | 'school'>('os');
  const [selectedOs, setSelectedOs] = useState<'dos' | 'windows' | 'mac'>('dos');
  const [dosInput, setDosInput] = useState('');
  const [dosConsole, setDosConsole] = useState<string[]>([
    'Microsoft DOS [Version 6.22]',
    '(C) Copyright Microsoft Corp 1981-1994.',
    ' ',
    'Type "HELP" or "DIR" or "IP_SCHOOLS" to execute system diagnostics.',
    'C:\\>'
  ]);

  // Database Records
  const [dbRows, setDbRows] = useState<Array<{ name: string; birthdate: string; hobby: string; family: number }>>([
    { name: 'محمد أحمد علي', birthdate: '2014-05-12', hobby: 'الرسم والسباحة 🎨', family: 5 },
    { name: 'فاطمة عثمان البشير', birthdate: '2013-11-04', hobby: 'قراءة الكتب 📚', family: 6 }
  ]);
  const [inputDbName, setInputDbName] = useState('');
  const [inputDbDate, setInputDbDate] = useState('2014-01-01');
  const [inputDbHobby, setInputDbHobby] = useState('كرة القدم ⚽');
  const [inputDbFamily, setInputDbFamily] = useState(5);

  // ipSchools simulation
  const [schoolAttendance, setSchoolAttendance] = useState(94);
  const [schoolBehaviors, setSchoolBehaviors] = useState(20); // visual slider

  const handleDosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = dosInput.trim().toUpperCase();
    if (!cmd) return;
    playSound('laser');
    setDosConsole(prev => [...prev, `C:\\>${dosInput}`]);

    let response: string[] = [];
    if (cmd === 'HELP') {
      response = [
        'Available commands list:',
        '  DIR          - View directory system file registries',
        '  VER          - View current operating system version',
        '  IP_SCHOOLS   - Boot the smart schools intranet database',
        '  CLS          - Clear terminal screen'
      ];
    } else if (cmd === 'DIR') {
      response = [
        ' Volume in drive C is DOS_SYS',
        ' Directory of C:\\',
        ' ',
        'IPSCHOOLS    <EXE>      32,492  06-14-2026   10:30a',
        'DATABASE     <DB>        5,124  06-14-2026   09:12a',
        'POWERPOINT   <APP>       18,924  06-14-2026   08:44a',
        '        3 File(s)         56,540 bytes',
        '        2 Dir(s)      14,924,800 bytes free'
      ];
    } else if (cmd === 'VER') {
      response = ['MS-DOS system environment version 6.22 - NCCER Sudanese Edition.'];
    } else if (cmd === 'CLS') {
      setDosConsole(['C:\\>']);
      setDosInput('');
      return;
    } else if (cmd === 'IP_SCHOOLS' || cmd === 'IPSCHOOLS') {
      playSound('success');
      response = [
        'Booting ipSchools client framework...',
        '  ✓ Database initialized successfully.',
        '  ✓ Chart model generated - Students count: 10',
        '  ✓ Grade server operational on PORT 3000.',
        ' ',
        '== ipSchools System Online ==',
        'Excellent job! You executed a native network utility script!'
      ];
      onEmitPoints(20);
      onEmitAchievement('ach-4');
    } else {
      playSound('fail');
      response = [`Bad command or file name: "${cmd}". Type HELP for assistance.`];
    }

    setDosConsole(prev => [...prev, ...response, 'C:\\>']);
    setDosInput('');
  };

  const handleInsertDbRow = () => {
    if (!inputDbName.trim()) return;
    playSound('success');
    setDbRows(prev => [
      ...prev,
      {
        name: inputDbName,
        birthdate: inputDbDate,
        hobby: inputDbHobby,
        family: Number(inputDbFamily)
      }
    ]);
    setInputDbName('');
    onEmitPoints(15);
    onEmitAchievement('ach-4'); // db badge
  };


  // ==========================================
  // SIMULATOR 5: BANK & POLICE (Unit 5)
  // ==========================================
  const [cityTab, setCityTab] = useState<'bank' | 'passport' | 'traffic'>('bank');
  const [atmPin, setAtmPin] = useState('');
  const [atmScreen, setAtmScreen] = useState<'pin' | 'lobby' | 'withdraw' | 'deposit' | 'logs'>('pin');
  const [bankBalance, setBankBalance] = useState(4800);
  const [bankLogs, setBankLogs] = useState<string[]>([
    'الحساب نشط برقم: 3263-4939-SD',
    'الرصيد المبدئي المودع: 4800 ج.س'
  ]);
  const [tempAmount, setTempAmount] = useState('');

  // Passport Maker
  const [passName, setPassName] = useState(stats.name || '');
  const [passBirthPlace, setPassBirthPlace] = useState('الخرطوم');
  const [passNationalId, setPassNationalId] = useState('114-632-155');
  const [passGender, setPassGender] = useState('ذكر');
  const [printedPassport, setPrintedPassport] = useState<any | null>(null);

  // Traffic and Radar
  const [trafficColor, setTrafficColor] = useState<'red' | 'yellow' | 'green'>('green');
  const [carsReached, setCarsReached] = useState<Array<{ id: number; speed: number; license: string; x: number; hasFlashed: boolean }>>([
    { id: 1, speed: 45, license: 'خ - 11463', x: 10, hasFlashed: false },
    { id: 2, speed: 95, license: 'أ - 34928', x: 45, hasFlashed: false }
  ]);
  const [radarLogs, setRadarLogs] = useState<string[]>(['أهلاً بك بكاميرا ضبط السرعة على الطريق السريع (الحد الأقصى للسرعة: 60 كم/س)']);

  // Traffic and Radar Loop
  useEffect(() => {
    if (cityTab !== 'traffic') return;
    const interval = setInterval(() => {
      setCarsReached(prev => {
        return prev.map(car => {
          let speedFactor = 4;
          if (trafficColor === 'red' && car.x < 50) {
            speedFactor = 0; // stop before intersection
          }
          let nextX = car.x + speedFactor;
          if (nextX > 100) {
            nextX = 0; // wrap
            return {
              ...car,
              x: nextX,
              speed: Math.floor(Math.random() * 60 + 35),
              hasFlashed: false
            };
          }
          return { ...car, x: nextX };
        });
      });
    }, 180);

    return () => clearInterval(interval);
  }, [cityTab, trafficColor]);

  const handleAtmPinSubmit = () => {
    if (atmPin === '1234') {
      playSound('success');
      setAtmScreen('lobby');
    } else {
      playSound('fail');
      alert('الرقم السري خاطئ! (تلميح: الرقم السري الافتراضي الفدرالي المقترح هو 1234)');
    }
  };

  const handleAtmWithdraw = () => {
    const amount = Number(tempAmount);
    if (!amount || amount <= 0) return;
    if (amount > bankBalance) {
      playSound('fail');
      alert('الرصيد غير كافٍ!');
      return;
    }
    playSound('success');
    setBankBalance(p => p - amount);
    setBankLogs(prev => [...prev, `سحب نقدية صراف: -${amount} ج.س`]);
    setTempAmount('');
    setAtmScreen('lobby');
    onEmitPoints(10);
  };

  const handleAtmDeposit = () => {
    const amount = Number(tempAmount);
    if (!amount || amount <= 0) return;
    playSound('success');
    setBankBalance(p => p + amount);
    setBankLogs(prev => [...prev, `إيداع نقدية صراف: +${amount} ج.س`]);
    setTempAmount('');
    setAtmScreen('lobby');
    onEmitPoints(10);
    onEmitAchievement('ach-5'); // finance
  };

  const generateSudanPassport = () => {
    if (!passName.trim()) return;
    playSound('success');
    setPrintedPassport({
      name: passName,
      birthplace: passBirthPlace,
      nationalId: passNationalId,
      gender: passGender,
      issueDate: '2026-06-14',
      expiryDate: '2036-06-14',
      code: 'SD-PASS-0943'
    });
    onEmitPoints(20);
    onEmitAchievement('ach-5');
  };

  const triggerRadarFlash = (carId: number, speed: number, license: string) => {
    playSound('success');
    setCarsReached(prev =>
      prev.map(c => (c.id === carId ? { ...c, hasFlashed: true } : c))
    );
    setRadarLogs(prev => [
      ...prev,
      `[الرادار 📸] فلاش! رصد مركبة مخالفة بسرعة ${speed} كم/س (الرخصة: ${license}). تم تحرير الغرامة وإضافتها لقاعدة بيانات شرطة المرور.`
    ]);
    onEmitPoints(15);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 z-40 overflow-y-auto" dir="rtl">
      <div className="bg-slate-950 rounded-[35px] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border-2 border-indigo-500 shadow-[8px_8px_0px_#312e81]">
        
        {/* Top bar */}
        <div className="bg-slate-900 border-b border-indigo-500/25 p-4 shrink-0 flex justify-between items-center px-6 text-white text-right">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">💻</span>
            <div className="text-right">
              <h3 className="font-black text-cyan-400 text-sm md:text-base tracking-wide">المعمل التفاعلي المدرسي</h3>
              <p className="text-[10px] text-indigo-300 font-bold">باقة تكنولوجيا المعلومات لطلاب الصف السادس</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-950 border border-indigo-500/30 text-indigo-400 hover:text-rose-400 hover:border-rose-550 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs shadow transition select-none"
          >
            ✕
          </button>
        </div>

        {/* Content Panel Scroll */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* ==================================== */}
          {/* RENDER 1: NETWORK BUILDER AND CLOUD */}
          {/* ==================================== */}
          {type === 'network' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2 border-b border-slate-200 pb-3" dir="rtl">
                <button
                  onClick={() => setNetworkType('build')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${networkType === 'build' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.Tv className="w-4 h-4" />
                  <span>توصيل الشبكة وفحص IP</span>
                </button>
                <button
                  onClick={() => setNetworkType('cloud')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${networkType === 'cloud' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.UploadCloud className="w-4 h-4" />
                  <span>مفهوم الحوسبة السحابية</span>
                </button>
              </div>

              {networkType === 'build' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Controls: Router Connection state and Command prompt */}
                  <div className="md:col-span-1 space-y-4 text-right">
                    <div className="bg-white p-4 rounded-2xl border border-slate-150 space-y-3">
                      <h4 className="font-black text-slate-800 text-xs">أدوات تحكم التوصيل المادي:</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">اضغط على أحد الأجهزة في الخارطة لتوصيله بالراوتر المركزي سلكياً، أو صلهم جميعاً بضغطة واحدة لتواجه الطلب الدراسي!</p>
                      <button
                        onClick={connectAllNetwork}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded-xl font-bold transition"
                      >
                        قابس التوصيل الشامل للشبكة
                      </button>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs scale-98 shadow">
                      <div className="border-b border-slate-700 pb-1 mb-2 font-semibold text-slate-400 flex justify-between items-center">
                        <span>موجه أوامر الشبكة المحلية</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <div className="space-y-1 max-h-[140px] overflow-y-auto select-text font-medium text-[11px] text-right" dir="ltr">
                        {pingTerminal.map((line, i) => (
                          <div key={i} className="leading-relaxed">{line}</div>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-700 flex gap-1.5" dir="ltr">
                        <button
                          onClick={handlePing}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-2.5 py-1 text-[11px] font-bold"
                        >
                          Ping
                        </button>
                        <input
                          type="text"
                          placeholder="مثال: 192.158.5.105"
                          value={pingIpInput}
                          onChange={(e) => setPingIpInput(e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-slate-50 text-[11px] px-2 py-1 rounded flex-1 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Graphics area showing devices */}
                  <div className="md:col-span-2 bg-gradient-to-tr from-slate-900 to-indigo-950 p-6 rounded-3xl relative h-[360px] overflow-hidden shadow">
                    
                    {/* Cloud or lines display */}
                    <div className="absolute inset-0 z-0">
                      <svg className="w-full h-full opacity-60">
                        {/* Lines showing glowing routes from router (center) to elements */}
                        {pcsConnected.server && <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#6366f1" strokeWidth="3" strokeDasharray="6" className="animate-[dash_2s_linear_infinite]" />}
                        {pcsConnected.clientA && <line x1="50%" y1="50%" x2="15%" y2="35%" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6" />}
                        {pcsConnected.clientB && <line x1="50%" y1="50%" x2="85%" y2="35%" stroke="#ec4899" strokeWidth="3" strokeDasharray="6" />}
                        {pcsConnected.printer && <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#10b981" strokeWidth="3" strokeDasharray="6" />}
                      </svg>
                    </div>

                    {/* Central elements */}
                    {/* Router */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600/90 text-white rounded-full p-4 shadow-lg z-10 flex flex-col items-center">
                      <LucideIcons.Wifi className="w-8 h-8 animate-pulse text-indigo-200" />
                      <span className="text-[10px] font-bold mt-1">الراوتر المركزي (Wi-Fi)</span>
                    </div>

                    {/* Server (Top) */}
                    <button
                      onClick={() => toggleNetworkConnection('server')}
                      className={`absolute top-[8%] left-1/2 -translate-x-1/2 p-3 rounded-2xl flex flex-col items-center border transition duration-200 ${
                        pcsConnected.server ? 'bg-indigo-900 text-white border-indigo-400 shadow-md' : 'bg-slate-800/50 text-slate-400 border-slate-700'
                      }`}
                    >
                      <LucideIcons.HardDrive className={`w-8 h-8 ${pcsConnected.server ? 'text-indigo-400' : ''}`} />
                      <span className="text-[10px] font-bold mt-1">الخادم الرئيسي (Server)</span>
                      <span className="text-[8px] opacity-80 mt-0.5 font-mono">MAC: 9C-35-5B-5F-4C-D7</span>
                    </button>

                    {/* Client A (Left) */}
                    <button
                      onClick={() => toggleNetworkConnection('clientA')}
                      className={`absolute top-[30%] left-[6%] p-3 rounded-2xl flex flex-col items-center border transition duration-200 ${
                        pcsConnected.clientA ? 'bg-blue-900 text-slate-100 border-blue-400 shadow-md' : 'bg-slate-800/50 text-slate-400 border-slate-700'
                      }`}
                    >
                      <LucideIcons.Monitor className={`w-8 h-8 ${pcsConnected.clientA ? 'text-blue-400' : ''}`} />
                      <span className="text-[10px] font-bold mt-1">جهاز تلميذ أ (Client)</span>
                      <span className="text-[8px] opacity-80 mt-0.5 font-mono">IP: 192.158.5.105</span>
                    </button>

                    {/* Client B (Right) */}
                    <button
                      onClick={() => toggleNetworkConnection('clientB')}
                      className={`absolute top-[30%] right-[6%] p-3 rounded-2xl flex flex-col items-center border transition duration-200 ${
                        pcsConnected.clientB ? 'bg-pink-900 text-slate-100 border-pink-400 shadow-md' : 'bg-slate-800/50 text-slate-400 border-slate-700'
                      }`}
                    >
                      <LucideIcons.Monitor className={`w-8 h-8 ${pcsConnected.clientB ? 'text-pink-400' : ''}`} />
                      <span className="text-[10px] font-bold mt-1">جهاز تلميذ ب (Client)</span>
                      <span className="text-[8px] opacity-80 mt-0.5 font-mono">IP: 192.158.5.210</span>
                    </button>

                    {/* Shared Printer (Bottom) */}
                    <button
                      onClick={() => toggleNetworkConnection('printer')}
                      className={`absolute bottom-[6%] left-1/2 -translate-x-1/2 p-3 rounded-2xl flex flex-col items-center border transition duration-200 ${
                        pcsConnected.printer ? 'bg-emerald-900 text-slate-100 border-emerald-400 shadow-md' : 'bg-slate-800/50 text-slate-400 border-slate-700'
                      }`}
                    >
                      <LucideIcons.Printer className={`w-8 h-8 ${pcsConnected.printer ? 'text-emerald-400 animate-bounce' : ''}`} />
                      <span className="text-[10px] font-bold mt-1">طابعة المعمل المشتركة</span>
                      <span className="text-[8px] opacity-80 mt-0.5 font-mono">توفير تكلفة مادية 💰</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: cloud details */}
                  <div className="md:col-span-1 bg-white p-5 rounded-3xl border border-slate-150 text-right space-y-4">
                    <h4 className="font-black text-slate-800 text-sm">مفهوم السحابة (Cloud Infrastructure):</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      أنت لا تحتاج لتثبيت برامج ثقيلة بالمكتبة أو المعمل، كل شيء يتم معالجته وحفظه بسحابة المنصات العملاقة كجوجل وميكروسوفت. ارفع الملفات باليمين لتشاهد ارتفاع حجم الخزن والسيرفر سحابياً!
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>سعة السيرفر السحابي المستغلة</span>
                        <span className="font-mono text-indigo-600">{cloudCapacity}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
                          style={{ width: `${cloudCapacity}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-400">قدرة معالجة ومخدمات عملاقة هائلة السرعة.</p>
                    </div>
                  </div>

                  {/* Right: upload files sandbox */}
                  <div className="md:col-span-2 bg-white p-5 rounded-3xl border border-slate-150 text-right space-y-4">
                    <h4 className="font-black text-slate-800 text-sm flex items-center gap-1">
                      <LucideIcons.Cloud className="w-5 h-5 text-indigo-500 animate-[bounce_3s_infinite]" />
                      <span>قبو الملفات والبرامج السحابية</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3">
                      {cloudFiles.map((file, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                              {renderIcon(file.icon, "w-5 h-5")}
                            </div>
                            <div className="text-right">
                              <h5 className="font-bold text-slate-800 text-xs">{file.name}</h5>
                              <p className="text-[10px] text-slate-400 font-mono font-bold">{file.size} ميجابايت</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => uploadCloudFile(i)}
                            disabled={file.isUploaded}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold select-none ${
                              file.isUploaded 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition'
                            }`}
                          >
                            {file.isUploaded ? 'تم الرفع سحابياً ✓' : 'رفع للسحابة ↑'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* RENDER 2: CYBER DEFENDER & FIREWALL */}
          {/* ==================================== */}
          {type === 'cyber' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-center gap-1.5 border-b border-slate-100 pb-3" dir="rtl">
                <button
                  onClick={() => setCyberTab('firewall')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${cyberTab === 'firewall' ? 'bg-rose-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.ShieldAlert className="w-4 h-4" />
                  <span>مدافع جدار الحماية (لعبة تفاعلية)</span>
                </button>
                <button
                  onClick={() => setCyberTab('password')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${cyberTab === 'password' ? 'bg-rose-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.KeyRound className="w-4 h-4" />
                  <span>مقياس الأمان وبصمة السر</span>
                </button>
                <button
                  onClick={() => setCyberTab('encryption')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${cyberTab === 'encryption' ? 'bg-rose-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.Lock className="w-4 h-4" />
                  <span>آلة تشفير المراسلات السرية</span>
                </button>
                <button
                  onClick={() => setCyberTab('cases')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${cyberTab === 'cases' ? 'bg-rose-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.UserCheck className="w-4 h-4" />
                  <span>حل مواقف الزملاء الحية</span>
                </button>
              </div>

              {cyberTab === 'firewall' ? (
                <div className="space-y-4 text-right">
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-sm">مختبر جدار الحماية التفاعلي (Firewall Gate)</h4>
                      <p className="text-xs text-slate-400">توجيه: شغل جدار الحماية في الأسفل، أو اضغط بالماوس على الفيروسات والهاكرز باليمين لتدميرهم قبل تلف حاسوبك!</p>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-center font-bold px-3 py-1 bg-red-50 text-red-700 rounded-xl border border-red-100">
                        <span className="block text-lg">{computerHealth}%</span>
                        <span className="text-[9px]">صحة جهازك المضيف</span>
                      </div>
                      <div className="text-center font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                        <span className="block text-lg">{scannedKills} / 3</span>
                        <span className="text-[9px]">أخطار مدمرة</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-6 relative h-[300px] overflow-hidden shadow">
                    {/* Left Local Computer zone */}
                    <div className="absolute top-1/2 left-[10%] -translate-y-1/2 bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col items-center">
                      <LucideIcons.Monitor className={`w-12 h-12 ${computerHealth > 50 ? 'text-blue-400' : 'text-red-500 animate-pulse'}`} />
                      <span className="text-[9px] text-white font-bold mt-1 font-sans">حاسوب التلميذ المحلي</span>
                    </div>

                    {/* Middle: Firewall Barrier */}
                    <div className="absolute top-0 bottom-0 left-[38%] w-1.5 bg-gradient-to-b from-rose-500 via-rose-400 to-rose-600 flex items-center justify-center">
                      <button
                        onClick={() => { playSound('success'); setFirewallOn(!firewallOn); }}
                        className={`p-2.5 rounded-full shadow-lg z-10 font-bold transition duration-200 ${
                          firewallOn ? 'bg-emerald-500 text-white animate-bounce' : 'bg-red-500 text-white'
                        }`}
                      >
                        {firewallOn ? <LucideIcons.ShieldCheck className="w-5 h-5" /> : <LucideIcons.ShieldAlert className="w-5 h-5" />}
                      </button>
                    </div>
                    <span className="absolute top-3 left-[42%] text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-rose-300 font-bold">
                      {firewallOn ? 'جدار الحماية: نَشِط فلترة الفيروسات والتسلل' : 'جدار الحماية: متوقف (تسلل مباشر)'}
                    </span>

                    {/* Good and Bad floating packets */}
                    <div className="absolute inset-0 pointer-events-none">
                      {activePackets.map((pkt) => (
                        <button
                          key={pkt.id}
                          onClick={() => handleShotPacket(pkt.id, pkt.isVirus)}
                          style={{ left: `${pkt.x}%`, top: `${pkt.y}%` }}
                          className={`absolute p-2.5 rounded-xl border text-[10px] font-bold pointer-events-auto shadow transition hover:scale-115 active:scale-90 ${
                            pkt.isVirus 
                              ? 'bg-rose-950/90 text-rose-300 border-rose-500' 
                              : 'bg-emerald-950/90 text-emerald-300 border-emerald-500'
                          }`}
                        >
                          {pkt.text}
                          {pkt.isVirus && <span className="block text-[8px] text-rose-400 font-bold mt-0.5">(تدمير بالضغط 🎯)</span>}
                        </button>
                      ))}
                    </div>

                    {computerHealth <= 0 && (
                      <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center text-white z-20 space-y-3">
                        <LucideIcons.XCircle className="w-12 h-12 text-rose-500 animate-pulse" />
                        <h5 className="font-extrabold text-base">تلف حاسوب المعمل نتيجة كثرة الفيروسات!</h5>
                        <p className="text-xs text-slate-400">إيقاف شبكة السيرفر وتخريب الملفات. تذكر تشغيل جدار الحماية (Firewall) الحامي دائمًا!</p>
                        <button
                          onClick={() => { playSound('success'); setComputerHealth(100); setActivePackets([]); }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-xl font-bold"
                        >
                          إعادة تنظيف وتطهير الحاسوب
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : cyberTab === 'password' ? (
                <div className="bg-white p-5 rounded-3xl border border-slate-150 space-y-5 text-right">
                  <h4 className="font-black text-slate-800 text-sm">مكعب قياس قوة كلمات المرور (Password Rating Tool)</h4>
                  <p className="text-xs text-slate-500">
                    ضع رمز الكلمة السرية المقترحة لبريدك أو حسابك ipSchools الافتراضي بالإنجليزية لتفحص مدى تماسكها أمام المخترقين وابتزازهم!
                  </p>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="أدخل كلمة مرور (مثال: SD6_school#%!14)"
                      value={passInput}
                      onChange={(e) => setPassInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-left text-slate-900"
                    />

                    {passInput && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>نسبة تماسك الرادار والحماية</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}></div>
                        </div>
                        <p className="text-xs font-bold text-rose-600">{passwordStrength.title}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-xs text-amber-800 leading-relaxed font-semibold">
                    🔑 القواعد الذهبية لسريرية الأرقام من الكتاب المدرسي:<br />
                    ١. عدم إدراج أسماء حقيقية أو سبل تواصل واضحة أو تواريخ ميلاد بديهية.<br />
                    ٢. الحجم الأمثل لا يقل عن 8 أحرف تضم حروفاً كبيرة وصغيرة وأرقاماً وتأثيرات غامضة (!@#).<br />
                    ٣. التغيير الدوري في الأجهزة تجنباً للهجمات وحجب الخدمة.
                  </div>
                </div>
              ) : cyberTab === 'encryption' ? (
                <div className="bg-white p-5 rounded-3xl border border-slate-150 text-right space-y-4">
                  <h4 className="font-black text-slate-800 text-sm">مختبر تشفير وفك تشفير الرسائل سرياً</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    التشفير (Cryptography) هو إخفاء الرسالة الحقيقية بإضافة بيانات أو تغيير حروفها بمسافات إضافية (مفتاح التشفير) ليغدو الكلام طلسماً لا يفهمه إلا من لديه الكود!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-600">اكتب عبارة التصفية (بالحروف العربية):</label>
                      <input
                        type="text"
                        placeholder="مثال: سري للغاية"
                        value={cipherText}
                        onChange={(e) => setCipherText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-right font-medium text-slate-900"
                      />

                      <div className="flex gap-2 items-center">
                        <label className="text-xs font-bold text-slate-600">مفتاح الإزاحة (الشفرة):</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={cipherShift}
                          onChange={(e) => setCipherShift(Number(e.target.value))}
                          className="w-16 bg-slate-50 border border-slate-200 p-2 rounded-xl text-center font-bold text-slate-900"
                        />
                      </div>

                      <button
                        onClick={handleEncryptText}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                      >
                        صياغة التشفير الرقمي
                      </button>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center text-white">
                      <span className="text-xs text-rose-400 font-mono font-bold mb-1">الرسالة المعالجة المشفرة:</span>
                      {encryptedValue ? (
                        <div className="space-y-2">
                          <p className="text-2xl font-black text-indigo-300 font-mono tracking-widest">{encryptedValue}</p>
                          <p className="text-[10px] text-slate-400">[مفتاح الحماية النشط: {cipherShift}]</p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">الرمز مشفر هنا...</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-5 rounded-3xl border border-slate-150 text-right space-y-4">
                  <h4 className="font-black text-slate-800 text-sm">مستشار الحل الذكي لمواقف الزملاء الحقيقية</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    يمر رفاقنا بمواقف تقنية وعمرية حاسمة على وسائل التواصل وفيسبوك والبريد. قم بحل هذه المواقف بوضع البديل التربوي المنهجي لهم!
                  </p>

                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-50 space-y-3">
                    <div className="flex justify-between items-center bg-indigo-100/60 p-2 rounded-xl">
                      <span className="font-black text-sm text-indigo-950">{CAROUSEL_CASES[currentCaseIndex].student}</span>
                      <span className="text-xs text-slate-400">موقف {currentCaseIndex + 1} من أصل {CAROUSEL_CASES.length}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold font-sans">{CAROUSEL_CASES[currentCaseIndex].scenario}</p>
                  </div>

                  <div className="space-y-2">
                    {CAROUSEL_CASES[currentCaseIndex].options.map((opt, oIdx) => {
                      const isCorrect = oIdx === CAROUSEL_CASES[currentCaseIndex].correct;
                      const isSelected = selectedCaseAnswer === oIdx;

                      return (
                        <button
                          key={oIdx}
                          disabled={selectedCaseAnswer !== null}
                          onClick={() => handleCaseAnswer(oIdx)}
                          className={`w-full text-right p-3 rounded-xl text-xs font-semibold border transition text-slate-600 ${
                            selectedCaseAnswer !== null
                              ? isCorrect
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                : isSelected
                                  ? 'bg-rose-100 border-rose-300 text-rose-800'
                                  : 'bg-slate-50 border-transparent opacity-60'
                              : 'bg-slate-50 border-transparent hover:bg-slate-100 active:scale-99'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showCaseFeedback && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold leading-relaxed text-slate-600 flex justify-between items-center">
                      <p>{CAROUSEL_CASES[currentCaseIndex].explain}</p>
                      <button
                        onClick={nextCase}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-[10px]"
                      >
                        الذهاب للموقف التالي
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* RENDER 3: POWERPOINT PRESENTER */}
          {/* ==================================== */}
          {type === 'presentation' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">محرر عروض PowerPoint التفاعلي المصغر</h4>
                  <p className="text-xs text-slate-400">تحكم بالخطوط والألوان والرسوم الكرتونية، واختر نوع تأثير الانتقالات وعاين عرضك بملء الشاشة ممتعاً للغاية!</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={addNewSlide}
                    className="flex-1 md:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
                  >
                    إضافة شريحة جديدة +
                  </button>
                  <button
                    onClick={triggerSlideShow}
                    className="flex-1 md:flex-initial bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5"
                  >
                    <LucideIcons.Tv2 className="w-4.5 h-4.5" />
                    <span>تشغيل العرض (Slide Show)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Visual slides directory menu (Left) */}
                <div className="md:col-span-1 bg-white p-4 rounded-3xl border border-slate-100 space-y-3 h-[280px] overflow-y-auto">
                  <span className="text-[11px] font-black text-slate-400 block border-b pb-1">قائمة الشرائح المتتالية</span>
                  {pptSlides.map((slide, i) => (
                    <div
                      key={i}
                      onClick={() => { playSound('click'); setPptIdx(i); }}
                      className={`p-3 rounded-2xl border text-right cursor-pointer relative group transition ${
                        i === pptIdx ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold' : 'bg-slate-50 border-transparent text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">{i + 1}.</span>
                        <span className="text-[11px] line-clamp-1">{slide.title}</span>
                      </div>
                      {pptSlides.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteCurrentSlide(i); }}
                          className="absolute left-2 top-2 text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 duration-150 p-1 bg-white rounded-md shadow-sm border text-[9px] font-bold"
                          title="حذف الشريحة"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Editor canvas and styling controls (Right) */}
                <div className="md:col-span-3 space-y-4">
                  {/* Visual design active sandbox */}
                  <div className={`rounded-3xl p-8 border bg-gradient-to-tr h-[180px] flex flex-col justify-center items-center text-center shadow-inner relative transition-all duration-300 ${pptSlides[pptIdx].color}`}>
                    <span className="absolute top-2 right-2 text-3xl select-none">{pptSlides[pptIdx].sticker}</span>
                    <h5 className="font-extrabold text-xl py-1 font-sans">{pptSlides[pptIdx].title || 'قم بكتابة العنوان...'}</h5>
                    <p className="text-xs opacity-90 leading-relaxed font-semibold">{pptSlides[pptIdx].subtitle || 'أضف العنوان الفرعي للموضوع...'}</p>
                    <span className="absolute bottom-2 left-3 text-[9px] font-mono opacity-80 uppercase tracking-widest font-bold">Slide {pptIdx + 1} / {pptSlides.length}</span>
                  </div>

                  {/* Input styling elements */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-500">تعديل العنوان الرئيسي للشريحة:</label>
                        <input
                          type="text"
                          value={pptSlides[pptIdx].title}
                          onChange={(e) => updateSlideField('title', e.target.value)}
                          className="w-full bg-slate-50 border px-3 py-2 rounded-xl text-xs font-extrabold text-right focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-500">تعديل العنوان الفرعي والفقرة:</label>
                        <textarea
                          rows={2}
                          value={pptSlides[pptIdx].subtitle}
                          onChange={(e) => updateSlideField('subtitle', e.target.value)}
                          className="w-full bg-slate-50 border px-3 py-2 rounded-xl text-xs font-semibold text-right focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 self-center">
                      {/* Font color themes */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-black text-slate-500 block">اختر طابع وتلوين الأرضية للدرس:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { code: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900', label: 'رقة زرقاء' },
                            { code: 'from-rose-50 to-rose-100 border-rose-200 text-rose-900', label: 'حيوية حمراء' },
                            { code: 'from-amber-50 to-amber-100 border-amber-200 text-amber-900', label: 'شمس برتقالية' },
                            { code: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-900', label: 'روض أخضر' },
                            { code: 'from-indigo-50 to-slate-100 border-slate-250 text-slate-900', label: 'برود رمادي' }
                          ].map((theme, i) => (
                            <button
                              key={i}
                              onClick={() => changeSlideColor(theme.code)}
                              className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition ${
                                pptSlides[pptIdx].color === theme.code ? 'bg-indigo-100 border-indigo-400 font-black' : 'bg-slate-50'
                              }`}
                            >
                              {theme.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Stickers / Clipart choosing represented */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-black text-slate-500 block">اختر ملصقاً توضيحياً (Insert Clipart):</span>
                        <div className="flex gap-2">
                          {['💻', '🏫', '🔌', '📚', '🚀', '🌟', '🛡️'].map((stk) => (
                            <button
                              key={stk}
                              onClick={() => changeSlideSticker(stk)}
                              className={`text-xl p-1 rounded-lg hover:bg-slate-100 transition active:scale-95 ${
                                pptSlides[pptIdx].sticker === stk ? 'bg-indigo-50 border border-indigo-200' : ''
                              }`}
                            >
                              {stk}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sliding configuration */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-black text-slate-500 block">تأثير الانتقالات بين الصفحات (Transitions):</span>
                        <div className="flex gap-2">
                          {[
                            { code: 'curtains', label: 'ستائر Curtains 🎭' },
                            { code: 'glitter', label: 'بريق نجومي Glitter ✨' },
                            { code: 'none', label: 'تلاشي تقليدي' }
                          ].map(t => (
                            <button
                              key={t.code}
                              onClick={() => { playSound('click'); setPptTransition(t.code as any); }}
                              className={`text-[9px] font-bold px-2.5 py-1.5 rounded-xl border transition ${
                                pptTransition === t.code ? 'bg-indigo-600 text-white shadow' : 'bg-slate-50'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show full immersive popup simulation for presentation view */}
              {slideShowActive && (
                <div className="fixed inset-0 bg-slate-950 flex items-center justify-center pointer-events-auto z-50 overflow-hidden">
                  
                  {/* Curtains Animation Layers */}
                  {pptTransition === 'curtains' && (
                    <div className="absolute inset-0 pointer-events-none z-10 flex">
                      <div className={`w-1/2 h-full bg-red-700 border-l-2 border-yellow-500 relative transition-transform duration-[1500ms] ease-in-out ${
                        curtainsSplit ? '-translate-x-full' : 'translate-x-0'
                      }`}>
                        {/* Golden tassel */}
                        <div className="absolute bottom-12 left-2 text-white text-3xl">🔑</div>
                      </div>
                      <div className={`w-1/2 h-full bg-red-700 border-r-2 border-yellow-500 relative transition-transform duration-[1500ms] ease-in-out ${
                        curtainsSplit ? 'translate-x-full' : 'translate-x-0'
                      }`}>
                        {/* Golden tassel */}
                        <div className="absolute bottom-12 right-2 text-white text-3xl">🔑</div>
                      </div>
                    </div>
                  )}

                  {/* Glitter Stars Background Canvas element simulated */}
                  {pptTransition === 'glitter' && (
                    <div className="absolute inset-0 bg-indigo-950/20 z-10 pointer-events-none flex items-center justify-center">
                      <div className="w-full h-full animate-[ping_1.5s_infinite] opacity-40 flex flex-wrap gap-12 p-12 text-yellow-300 text-3xl">
                        <span>✨</span><span>★</span><span>✨</span><span>★</span><span>✨</span><span>★</span><span>✨</span>
                      </div>
                    </div>
                  )}

                  {/* Main Show Slide Frame */}
                  <div className={`max-w-4xl w-full mx-4 rounded-3xl p-16 text-center space-y-6 relative border-4 border-white shadow-2xl bg-gradient-to-tr ${pptSlides[pptIdx].color}`}>
                    <span className="text-6xl block select-none mb-4">{pptSlides[pptIdx].sticker}</span>
                    <h2 className="text-4xl font-extrabold font-sans text-indigo-950">{pptSlides[pptIdx].title}</h2>
                    <p className="text-lg opacity-90 leading-relaxed font-bold">{pptSlides[pptIdx].subtitle}</p>
                    
                    <div className="pt-8 border-t border-slate-200/40 flex justify-between items-center text-xs text-slate-500 font-bold">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (pptIdx > 0) { playSound('click'); setPptIdx(p => p - 1); }
                          }}
                          disabled={pptIdx === 0}
                          className="bg-indigo-600 animate-pulse text-white rounded-xl px-4 py-2 disabled:opacity-30"
                        >
                          السابق الشريحة
                        </button>
                        <button
                          onClick={() => {
                            if (pptIdx < pptSlides.length - 1) {
                              playSound('click');
                              setPptIdx(p => p + 1);
                              // Trigger transition animations per slide change
                              if (pptTransition === 'curtains') {
                                setCurtainsSplit(false);
                                setTimeout(() => setCurtainsSplit(true), 150);
                              }
                            } else {
                              // End Show
                              playSound('success');
                              setSlideShowActive(false);
                              onEmitPoints(30);
                              onEmitAchievement('ach-3'); // slide design complete
                            }
                          }}
                          className="bg-indigo-600 text-white rounded-xl px-4 py-2"
                        >
                          {pptIdx === pptSlides.length - 1 ? 'نهاية العرض المدرسي 🎉' : 'الشريحة التالية'}
                        </button>
                      </div>
                      <span>شريحة {pptIdx + 1} من {pptSlides.length}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSlideShowActive(false)}
                    className="absolute top-4 left-4 bg-white/20 text-white font-extrabold px-4 py-2 rounded-xl text-xs z-20 hover:bg-white/30"
                  >
                    إنهاء ملء الشاشة ×
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* RENDER 4: SOFTWARE & DATABASE (Unit 4) */}
          {/* ==================================== */}
          {type === 'database' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2 border-b border-slate-200 pb-3" dir="rtl">
                <button
                  onClick={() => setDbTab('os')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${dbTab === 'os' ? 'bg-teal-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.Tv className="w-4 h-4" />
                  <span>برمجيات التشغيل (DOS Terminal & OS)</span>
                </button>
                <button
                  onClick={() => setDbTab('builder')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${dbTab === 'builder' ? 'bg-teal-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.Database className="w-4 h-4" />
                  <span>جدول وهيكل قاعدة البيانات</span>
                </button>
                <button
                  onClick={() => setDbTab('school')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${dbTab === 'school' ? 'bg-teal-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.Sliders className="w-4 h-4" />
                  <span>محاكي إحصاءات ipSchools</span>
                </button>
              </div>

              {dbTab === 'os' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: select OS types */}
                  <div className="md:col-span-1 bg-white p-5 rounded-3xl border border-slate-150 text-right space-y-3.5">
                    <h4 className="font-extrabold text-slate-800 text-sm">نظام تشغيل السيرفر (O.S)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">بصفتك المسير، جرب الانتقال عبر أشكال أنظمة التشغيل لتشهد مظهرها البصري ووظائفها المادية!</p>
                    
                    <div className="space-y-2">
                      {[
                        { code: 'dos', label: 'بيئة موجه دوس الافتراضي DOS 💻' },
                        { code: 'windows', label: 'واجهة ميكروسوفت ويندوز Windows 🗔' },
                        { code: 'mac', label: 'أبل ماكنتوش Macintosh 🍏' }
                      ].map(os => (
                        <button
                          key={os.code}
                          onClick={() => { playSound('click'); setSelectedOs(os.code as any); }}
                          className={`w-full text-right p-3 rounded-2xl text-xs font-semibold border transition active:scale-98 ${
                            selectedOs === os.code ? 'bg-teal-50 border-teal-300 text-teal-900 font-extrabold' : 'bg-slate-50 border-transparent text-slate-600'
                          }`}
                        >
                          {os.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right: Selected OS display */}
                  <div className="md:col-span-2">
                    {selectedOs === 'dos' ? (
                      <div className="bg-black text-emerald-400 p-6 rounded-3xl font-mono text-xs text-left h-[280px] overflow-y-auto w-full select-text shadow-inner flex flex-col justify-between">
                        <div className="space-y-1">
                          {dosConsole.map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </div>
                        <form onSubmit={handleDosSubmit} className="mt-4 flex border-t border-slate-800 pt-2 items-center">
                          <span className="text-slate-200 shrink-0 select-none">C:\&gt;</span>
                          <input
                            type="text"
                            value={dosInput}
                            onChange={(e) => setDosInput(e.target.value)}
                            className="bg-transparent text-emerald-400 border-none outline-none focus:outline-none flex-1 font-mono px-1 border-transparent focus:ring-0 text-left shrink-0"
                            placeholder="اكتب HELP أو IP_SCHOOLS واضغط Enter"
                            autoFocus
                          />
                        </form>
                      </div>
                    ) : selectedOs === 'windows' ? (
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-3xl h-[280px] shadow-lg relative p-6 text-white flex flex-col justify-between overflow-hidden">
                        <div className="flex justify-between items-center bg-white/10 backdrop-blur px-4 py-2 rounded-2xl">
                          <span className="font-extrabold text-xs">Microsoft Windows 11</span>
                          <span className="text-[10px]">١١:٣٠ ص</span>
                        </div>
                        <div className="flex gap-6 justify-center">
                          <div className="flex flex-col items-center bg-white/5 hover:bg-white/15 p-2 rounded-xl w-16">
                            <LucideIcons.Tv className="w-8 h-8 text-blue-200" />
                            <span className="text-[10px] mt-1">حاسوبي</span>
                          </div>
                          <div className="flex flex-col items-center bg-white/5 hover:bg-white/15 p-2 rounded-xl w-16">
                            <LucideIcons.Database className="w-8 h-8 text-amber-200" />
                            <span className="text-[10px] mt-1">قواعد ipSchools</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-white/50 text-center">نظام التشغيل الأكثر شهرة لتنظيم الأجهزة والتحكم بالإدخال والإخراج.</p>
                      </div>
                    ) : (
                      <div className="bg-slate-100 rounded-3xl h-[280px] shadow border border-slate-200 relative p-6 text-slate-800 flex flex-col justify-between overflow-hidden">
                        <div className="flex justify-between items-center bg-slate-250 border-b pb-2 px-1">
                          <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-400"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                            <span className="w-3 h-3 rounded-full bg-green-400"></span>
                          </div>
                          <span className="font-extrabold text-xs">MacOS Sequoia</span>
                        </div>
                        <div className="flex gap-6 justify-center">
                          <div className="flex flex-col items-center bg-indigo-50 p-3 rounded-2xl shadow-sm border">
                            <span className="text-3xl">🍏</span>
                            <span className="text-[10px] font-bold text-slate-500 mt-1">أبل ماكنتوش</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center font-bold">بساطة التصميم وأناقة الألوان مع نظام ماك الحصين.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : dbTab === 'builder' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Insert records (Left) */}
                  <div className="md:col-span-1 bg-white p-5 rounded-3xl border border-slate-150 text-right space-y-3.5">
                    <h4 className="font-black text-slate-800 text-xs">تعبئة استمارة التلميذ (Record Form)</h4>
                    <p className="text-[10px] text-slate-400">سجل بيانات رفاقك بجدول الإكسس لتشاهد فرز الحقول وأنواع البيانات تلقائياً كما بدرس قواعد البيانات!</p>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">حقل الاسم (النوع: Text - ٣٠ حرف):</label>
                        <input
                          type="text"
                          placeholder="الاسم الثلاثي"
                          value={inputDbName}
                          onChange={(e) => setInputDbName(e.target.value)}
                          className="w-full bg-slate-50 border p-2 rounded-xl text-xs text-right font-medium focus:ring-1 focus:ring-teal-500 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">تاريخ الميلاد (النوع: Date):</label>
                        <input
                          type="date"
                          value={inputDbDate}
                          onChange={(e) => setInputDbDate(e.target.value)}
                          className="w-full bg-slate-50 border p-2 rounded-xl text-xs text-right font-medium focus:ring-1 focus:ring-teal-500 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">الهواية المفضلة (النوع: Text):</label>
                        <select
                          value={inputDbHobby}
                          onChange={(e) => setInputDbHobby(e.target.value)}
                          className="w-full bg-slate-50 border p-2 rounded-xl text-xs text-right font-bold focus:ring-1 focus:ring-teal-500 text-slate-900"
                        >
                          <option>كرة القدم ⚽</option>
                          <option>الرسم والتلوين 🎨</option>
                          <option>قراءة الفيديوهات التعليمية 📚</option>
                          <option>برمجة الألعاب الافتراضية 💻</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">عدد أفراد الأسرة (النوع: Numeric):</label>
                        <input
                          type="number"
                          value={inputDbFamily}
                          onChange={(e) => setInputDbFamily(Number(e.target.value))}
                          className="w-full bg-slate-50 border p-2 rounded-xl text-xs text-center font-bold focus:ring-1 focus:ring-teal-500 text-slate-900"
                        />
                      </div>

                      <button
                        onClick={handleInsertDbRow}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl transition mt-2"
                      >
                        إدراج إلى السجل الموحد DB
                      </button>
                    </div>
                  </div>

                  {/* Grid layout (Right) */}
                  <div className="md:col-span-2 bg-white p-5 rounded-3xl border border-slate-150 text-right space-y-3">
                    <h4 className="font-black text-slate-800 text-xs">جدول قاعدة بيانات التلاميذ المقررة (Database Table)</h4>
                    
                    <div className="overflow-x-auto border rounded-2xl">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-50 border-b font-extrabold text-slate-600 text-[10px]">
                          <tr>
                            <th className="p-3">حقل: الاسم (Text)</th>
                            <th className="p-3">حقل: الميلاد (Date)</th>
                            <th className="p-3">حقل: الهواية (Text)</th>
                            <th className="p-3 text-center">أفراد الأسرة (Numeric)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y font-semibold text-slate-600">
                          {dbRows.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-all">
                              <td className="p-3 font-bold text-slate-850">{row.name}</td>
                              <td className="p-3 font-mono text-[10px]">{row.birthdate}</td>
                              <td className="p-3">{row.hobby}</td>
                              <td className="p-3 text-center font-mono font-bold text-teal-600">{row.family}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-5 rounded-3xl border border-slate-100 text-right space-y-4">
                  <h4 className="font-extrabold text-slate-800 text-sm">محاكي إحصاءات مدرسة ipSchools الذكية الافتراضي</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    يحلل تطبيق ipSchools سلوك وتغذية وتحصيل تلاميذ المعامل ويرسمها في أعمدة بيانية دقيقة (مثل المخطط البياني في الصفحة ٣٩ من الكتاب!). اضبط مستويات تلامذتك وشاهد تغيير الأعمدة البيانية التوضيحية:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      {/* Control sliders */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-600">درجة الحضور والالتزام بالحصص: {schoolAttendance}%</span>
                        <input
                          type="range"
                          min={50}
                          max={100}
                          value={schoolAttendance}
                          onChange={(e) => { playSound('click'); setSchoolAttendance(Number(e.target.value)); }}
                          className="w-full accent-teal-600 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-600">مجموع الوجبات السليمة المستهلكة: {schoolBehaviors} وجبة</span>
                        <input
                          type="range"
                          min={5}
                          max={45}
                          value={schoolBehaviors}
                          onChange={(e) => { playSound('click'); setSchoolBehaviors(Number(e.target.value)); }}
                          className="w-full accent-teal-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Chart simulator visualizer */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-end justify-center gap-12 h-[200px] select-none">
                      {/* Bar 1 */}
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-14 bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all duration-300 transform origin-bottom hover:scale-105"
                          style={{ height: `${schoolAttendance * 1.5}px` }}
                        ></div>
                        <span className="text-[10px] font-black text-slate-500">الحضور والمواظبة</span>
                      </div>
                      {/* Bar 2 */}
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-14 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg transition-all duration-300 transform origin-bottom hover:scale-105"
                          style={{ height: `${schoolBehaviors * 4.2}px` }}
                        ></div>
                        <span className="text-[10px] font-black text-slate-500">التغذية المدرسية</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* RENDER 5: BANK & POLICE RADAR */}
          {/* ==================================== */}
          {type === 'bank_police' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2 border-b border-slate-200 pb-3" dir="rtl">
                <button
                  onClick={() => setCityTab('bank')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${cityTab === 'bank' ? 'bg-purple-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.CreditCard className="w-4 h-4" />
                  <span>الصراف البنكي وآلة ATM 💸</span>
                </button>
                <button
                  onClick={() => setCityTab('passport')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${cityTab === 'passport' ? 'bg-purple-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.Fingerprint className="w-4 h-4" />
                  <span>طابع الهويات والجواز السوداني 🇸🇩</span>
                </button>
                <button
                  onClick={() => setCityTab('traffic')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${cityTab === 'traffic' ? 'bg-purple-600 text-white shadow' : 'bg-white text-slate-600 border'}`}
                >
                  <LucideIcons.Activity className="w-4 h-4" />
                  <span>محاكي إشارات المرور والرادار 🚨</span>
                </button>
              </div>

              {cityTab === 'bank' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Left: ATM visual machine */}
                  <div className="bg-slate-800 p-6 rounded-3xl border-4 border-slate-700 shadow-xl max-w-sm mx-auto w-full text-slate-100 font-sans relative">
                    <div className="absolute top-2 left-4 text-emerald-400 font-mono text-[9px] select-none tracking-widest uppercase">NCCER BANKING CLIENT</div>
                    
                    {/* Screen layout */}
                    <div className="bg-slate-900 border-2 border-slate-600 p-4 rounded-xl h-[160px] mb-4 flex flex-col justify-between overflow-y-auto">
                      {atmScreen === 'pin' ? (
                        <div className="text-center space-y-2.5 my-auto">
                          <p className="text-[11px] text-blue-300 font-bold">أهلاً بك بالصراف الآلي - يرجى وضع رقمك السري الافتراضي</p>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="الرقم السري (مثال: 1234)"
                            value={atmPin}
                            onChange={(e) => setAtmPin(e.target.value)}
                            className="bg-slate-800 border text-white font-mono text-center p-1 rounded w-32 focus:outline-none"
                          />
                          <button
                            onClick={handleAtmPinSubmit}
                            className="block bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-md font-bold mx-auto mt-1"
                          >
                            دخول
                          </button>
                        </div>
                      ) : atmScreen === 'lobby' ? (
                        <div className="text-right space-y-1.5 min-h-[140px] flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400">الرصيد المتوفر بالحساب:</span>
                            <p className="text-2xl font-black text-emerald-400 font-mono tracking-tight">{bankBalance} ج.س</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            <button onClick={() => setAtmScreen('withdraw')} className="bg-slate-700 hover:bg-slate-600 p-1 rounded font-bold">سحب نقدية</button>
                            <button onClick={() => setAtmScreen('deposit')} className="bg-slate-700 hover:bg-slate-600 p-1 rounded font-bold">إيداع نقدي</button>
                            <button onClick={() => setAtmScreen('logs')} className="col-span-2 bg-slate-700 hover:bg-slate-600 p-1 rounded font-bold">عرض كشف حساب</button>
                          </div>
                        </div>
                      ) : atmScreen === 'withdraw' ? (
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 block text-right">أدخل قيمة السحب من المحفظة البنكية:</span>
                          <input
                            type="number"
                            placeholder="القيمة ج.س"
                            value={tempAmount}
                            onChange={(e) => setTempAmount(e.target.value)}
                            className="bg-slate-800 text-slate-100 font-mono text-center p-1 rounded w-full"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleAtmWithdraw} className="bg-emerald-600 text-white text-[10px] p-1 rounded flex-1 font-bold">تأكيد السحب</button>
                            <button onClick={() => setAtmScreen('lobby')} className="bg-slate-700 text-slate-300 text-[10px] p-1 rounded flex-1">إلغاء</button>
                          </div>
                        </div>
                      ) : atmScreen === 'deposit' ? (
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 block text-right">أدخل قيمة الإيداع النقدي بالصندوق:</span>
                          <input
                            type="number"
                            placeholder="القيمة ج.س"
                            value={tempAmount}
                            onChange={(e) => setTempAmount(e.target.value)}
                            className="bg-slate-800 text-slate-100 font-mono text-center p-1 rounded w-full"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleAtmDeposit} className="bg-emerald-600 text-white text-[10px] p-1 rounded flex-1 font-bold">تأكيد الإيداع</button>
                            <button onClick={() => setAtmScreen('lobby')} className="bg-slate-700 text-slate-300 text-[10px] p-1 rounded flex-1">إلغاء</button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-right space-y-1.5">
                          <div className="flex justify-between items-center pb-1 border-b border-slate-700">
                            <span className="text-[10px] font-black text-slate-400">سجل عمليات الصراف</span>
                            <button onClick={() => setAtmScreen('lobby')} className="text-[9px] text-indigo-400">رجوع</button>
                          </div>
                          <div className="text-[9px] font-mono font-medium max-h-[105px] overflow-y-auto space-y-1 opacity-90 leading-normal">
                            {bankLogs.map((log, lIdx) => (
                              <div key={lIdx}>{log}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Numeric Keyboard */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-800 font-extrabold select-none">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((btn) => (
                        <button
                          key={btn}
                          onClick={() => {
                            playSound('click');
                            if (atmScreen === 'pin' && atmPin.length < 4 && typeof btn === 'number') {
                              setAtmPin(p => p + btn);
                            }
                          }}
                          className="bg-slate-300 hover:bg-slate-200 p-2 rounded-lg active:scale-95"
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right description */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-150 text-right space-y-3">
                    <h4 className="font-extrabold text-slate-800 text-sm">التشفير والكمبيوتر البنكي من المنهج:</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      تتصل جميع الصرافات والبنوك بخادم مركزي قوي (Server) ذي طاقة وسرعة هائلتين. كل المعاملات البنكية والسحوبات المالية مشفرة لحفظ الأرصدة وتمنع الخداع والابتزاز!
                    </p>
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-emerald-800 text-xs font-bold leading-normal">
                      ✓ نظام الإيداع والسحب آمن بالرمز ١٢٣٤.<br />
                      ✓ تتدفق البيانات للبنك المركزي بالقطر للمراقبة.<br />
                      ✓ يتم استرجاع الحسابات في ثوان لإلغاء ضياع الأموال المادية.
                    </div>
                  </div>
                </div>
              ) : cityTab === 'passport' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Left: Input parameters */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-150 text-right space-y-3.5">
                    <h4 className="font-black text-slate-800 text-sm">استخراج الأوراق الثبوتية (الشرطة الإلكترونية)</h4>
                    <p className="text-[10px] text-slate-400 font-bold">أدخل بيانات الهوية واطبع جواز سفرك الإلكتروني السوداني الفريد بجميع تفاصيله الوطنية الحقيقية!</p>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">الاسم ثلاثي أو رباعي:</label>
                        <input
                          type="text"
                          value={passName}
                          onChange={(e) => setPassName(e.target.value)}
                          className="w-full bg-slate-50 border p-2 rounded-xl text-xs font-bold focus:ring-1 focus:ring-purple-500 text-right text-slate-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500">الجنس:</label>
                          <select
                            value={passGender}
                            onChange={(e) => setPassGender(e.target.value)}
                            className="w-full bg-slate-50 border p-2 rounded-xl text-xs font-extrabold text-right focus:ring-1 focus:ring-purple-500 text-slate-900"
                          >
                            <option>ذكر</option>
                            <option>أنثى</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500">مكان الميلاد:</label>
                          <select
                            value={passBirthPlace}
                            onChange={(e) => setPassBirthPlace(e.target.value)}
                            className="w-full bg-slate-50 border p-2 rounded-xl text-xs font-extrabold text-right focus:ring-1 focus:ring-purple-500 text-slate-900"
                          >
                            <option>الخرطوم</option>
                            <option>بورتسودان</option>
                            <option>كسلا</option>
                            <option>الأبيض</option>
                            <option>دنقلا</option>
                            <option>الفاشر</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">الرقم الوطني الموحد:</label>
                        <input
                          type="text"
                          value={passNationalId}
                          onChange={(e) => setPassNationalId(e.target.value)}
                          className="w-full bg-slate-50 border p-2 rounded-xl text-xs focus:ring-1 focus:ring-purple-500 font-mono text-center font-bold text-slate-900"
                        />
                      </div>

                      <button
                        onClick={generateSudanPassport}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-xl transition"
                      >
                        إصدار وطباعة الجواز الإلكتروني 🇸🇩
                      </button>
                    </div>
                  </div>

                  {/* Right: Sudanese Green Passport layout */}
                  <div className="flex justify-center flex-1">
                    {printedPassport ? (
                      <div className="bg-emerald-900 border-4 border-amber-400 p-6 rounded-3xl max-w-sm w-full text-white shadow-xl relative overflow-hidden font-sans">
                        {/* watermark */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl text-emerald-800/20 select-none">🇸🇩</div>
                        
                        <div className="flex justify-between items-center border-b border-amber-400/40 pb-3 mb-4">
                          <div className="text-right">
                            <span className="block text-[8px] tracking-wide text-amber-200">جمهورية السودان</span>
                            <span className="block text-xs font-bold text-amber-300">جواز سفر إلكتروني</span>
                            <span className="block text-[7px] text-slate-300 font-mono">REPUBLIC OF THE SUDAN</span>
                          </div>
                          <span className="text-3xl">🇸🇩</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 items-center">
                          {/* Passport visual Photo */}
                          <div className="col-span-1 bg-emerald-950/80 border border-emerald-800 p-1 w-full aspect-[3/4] rounded-xl flex items-center justify-center relative">
                            <span className="text-4xl">{stats.avatar}</span>
                            <div className="absolute bottom-1 left-1.5 bg-yellow-500 text-[6px] text-slate-900 px-1 rounded-sm">ORIGINAL</div>
                          </div>

                          {/* Data entries */}
                          <div className="col-span-2 text-right text-[10px] space-y-1">
                            <div>
                              <span className="text-[8px] text-amber-200/80">الاسم / Name:</span>
                              <p className="font-extrabold">{printedPassport.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-1 select-text">
                              <div>
                                <span className="text-[8px] text-amber-200/80">الميلاد / Place:</span>
                                <p className="font-bold">{printedPassport.birthplace}</p>
                              </div>
                              <div>
                                <span className="text-[8px] text-amber-200/80">الجنس / Sex:</span>
                                <p className="font-bold">{printedPassport.gender}</p>
                              </div>
                            </div>
                            <div>
                              <span className="text-[8px] text-amber-200/80">الرقم الوطني / National ID:</span>
                              <p className="font-mono font-bold text-amber-300">{printedPassport.nationalId}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-amber-400/20 grid grid-cols-2 text-[8px] text-slate-300">
                          <div>
                            <span>تاريخ الإصدار: 2026-06-14</span>
                          </div>
                          <div className="text-left font-mono">
                            <span>Code: {printedPassport.code}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-100 p-8 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400 text-xs w-full max-w-sm flex items-center justify-center aspect-[5/3] font-bold">
                        الرجاء ملء البيانات باليمين والضغط على طباعة الجواز الإلكتروني!
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Controls & Radar logs */}
                  <div className="md:col-span-1 bg-white p-5 rounded-3xl border border-slate-150 text-right space-y-4">
                    <h4 className="font-black text-slate-800 text-xs">مفاتيح تشغيل مفترق الطرق:</h4>
                    
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => { playSound('click'); setTrafficColor('red'); }}
                        className={`w-10 h-10 rounded-full bg-red-600 border-4 transition ${trafficColor === 'red' ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40'}`}
                        title="أحمر - وقوف"
                      ></button>
                      <button
                        onClick={() => { playSound('click'); setTrafficColor('yellow'); }}
                        className={`w-10 h-10 rounded-full bg-yellow-500 border-4 transition ${trafficColor === 'yellow' ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40'}`}
                        title="أصفر - تمهل"
                      ></button>
                      <button
                        onClick={() => { playSound('click'); setTrafficColor('green'); }}
                        className={`w-10 h-10 rounded-full bg-green-600 border-4 transition ${trafficColor === 'green' ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40'}`}
                        title="أخضر - انطلاق"
                      ></button>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-3 rounded-2xl font-mono text-[9px] max-h-[140px] overflow-y-auto leading-relaxed">
                      {radarLogs.map((log, lIdx) => (
                        <div key={lIdx} className="border-b border-slate-800 pb-1 mb-1">{log}</div>
                      ))}
                    </div>
                  </div>

                  {/* Right intersection roadway */}
                  <div className="md:col-span-2 bg-gradient-to-b from-stone-800 via-stone-700 to-stone-800 rounded-3xl relative h-[280px] overflow-hidden shadow flex items-center">
                    {/* Road line marking */}
                    <div className="absolute left-0 right-0 h-1 bg-transparent border-t-2 border-dashed border-amber-300 pointer-events-none"></div>
                    
                    {/* Traffic Light signal visual */}
                    <div className="absolute right-[25%] top-[12%] bg-stone-900 px-2.5 py-1 rounded-2xl border-2 border-slate-600 flex gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full block ${trafficColor === 'red' ? 'bg-red-500 shadow animate-pulse' : 'bg-red-950'}`}></span>
                      <span className={`w-3.5 h-3.5 rounded-full block ${trafficColor === 'yellow' ? 'bg-yellow-500 shadow animate-pulse' : 'bg-yellow-950'}`}></span>
                      <span className={`w-3.5 h-3.5 rounded-full block ${trafficColor === 'green' ? 'bg-green-500 shadow animate-pulse' : 'bg-green-950'}`}></span>
                    </div>

                    {/* Animated moving cars */}
                    {carsReached.map((car) => {
                      const speedDanger = car.speed > 60;
                      return (
                        <div
                          key={car.id}
                          style={{ left: `${car.x}%` }}
                          className={`absolute p-2.5 rounded-2xl border shadow transition-all duration-150 flex flex-col items-center select-none ${
                            car.hasFlashed 
                              ? 'bg-yellow-101 text-slate-900 border-yellow-501 animate-[flash_0.3s_3] scale-110' 
                              : speedDanger 
                                ? 'bg-red-500 text-white border-red-300' 
                                : 'bg-blue-600 text-white border-blue-400'
                          }`}
                        >
                          <LucideIcons.Car className="w-8 h-8 pointer-events-none" />
                          <span className="text-[8px] font-mono font-bold mt-1 tracking-tighter">السرعة: {car.speed} كم/س</span>
                          <span className="text-[7px] bg-slate-900 border text-slate-100 px-1 rounded mt-0.5">{car.license}</span>

                          {speedDanger && !car.hasFlashed && (
                            <button
                              onClick={() => triggerRadarFlash(car.id, car.speed, car.license)}
                              className="bg-yellow-500 text-slate-950 px-1.5 py-0.5 rounded-md text-[7px] font-extrabold mt-1 font-sans active:scale-90"
                              title="تفعيل رادار السرعة الذكي"
                            >
                              تشغيل الرادار 📸
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className="bg-slate-900 border-t border-indigo-500/25 p-4 shrink-0 flex justify-between items-center font-bold px-6 text-white text-right">
          <p className="text-[10px] text-indigo-300 flex items-center gap-2">
            <LucideIcons.Tv2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>معمل تكنولوجيا المعلومات والحاسوب - السودان</span>
          </p>
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-2 rounded-xl transition duration-150 shadow-[4px_4px_0px_#312e81] font-black border border-indigo-400"
          >
            إغلاق نافذة المعمل
          </button>
        </div>

      </div>
    </div>
  );
};
