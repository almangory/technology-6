import React, { useState } from 'react';
import { 
  Cpu, 
  RotateCcw, 
  Play, 
  CheckCircle, 
  ArrowLeft, 
  Monitor, 
  Terminal, 
  Settings, 
  FileText, 
  Calculator, 
  Palette, 
  Sliders, 
  Power, 
  HelpCircle, 
  Trash2, 
  Save, 
  Grid,
  Wifi,
  Activity,
  User,
  Folder,
  Moon,
  Sun
} from 'lucide-react';
import { UserStats } from '../types';

interface ComputerAssemblyLabProps {
  stats: UserStats;
  onEmitPoints: (points: number) => void;
  onEmitAchievement: (achId: string) => void;
  onClose: () => void;
}

interface ComponentPart {
  id: string;
  name: string;
  englishName: string;
  desc: string;
  role: string;
  placed: boolean;
  icon: string;
  color: string;
}

const renderRealisticPartSVG = (id: string, isPlacedInMotherboard = false, isPoweredOn = false) => {
  switch (id) {
    case 'cpu':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Substrate */}
          <rect x="5" y="5" width="90" height="90" rx="8" fill="#134e5e" stroke="#0f172a" strokeWidth="2.5" />
          {/* Outer gold pad lines */}
          <rect x="11" y="11" width="78" height="78" rx="6" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3,1.5" />
          {/* Integrated Heat Spreader (IHS) */}
          <rect x="22" y="22" width="56" height="56" rx="5" fill="none" stroke="#64748b" strokeWidth="1" />
          <rect x="24" y="24" width="52" height="52" rx="4" fill="url(#metalSilverGrad)" stroke="#334155" strokeWidth="1" />
          {/* Silicon marking */}
          <text x="50" y="44" fill="#1e293b" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            CORE™ i9
          </text>
          <text x="50" y="52" fill="#3b82f6" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            SUDAN ict
          </text>
          <text x="50" y="60" fill="#475569" fontSize="4.5" textAnchor="middle" fontFamily="monospace">
            ICT-CLASS-6
          </text>
          {/* Golden triangle indicator */}
          <polygon points="11,11 19,11 11,19" fill="#eab308" />
          {/* Surface capacitors */}
          <circle cx="16" cy="50" r="2" fill="#ca8a04" />
          <circle cx="84" cy="50" r="2" fill="#ca8a04" />
          <circle cx="50" cy="16" r="2" fill="#ca8a04" />
          <circle cx="50" cy="84" r="2" fill="#ca8a04" />

          <defs>
            <linearGradient id="metalSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="45%" stopColor="#cbd5e1" />
              <stop offset="55%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'ram':
      return (
        <svg viewBox="0 0 140 32" className="w-full h-full drop-shadow-md">
          {/* Green PCB substrate */}
          <rect x="2" y="2" width="136" height="28" rx="3" fill="#065f46" stroke="#047857" strokeWidth="1" />
          {/* Gold trace paths */}
          <line x1="8" y1="6" x2="132" y2="6" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="8" y1="20" x2="132" y2="20" stroke="#eab308" strokeWidth="0.5" strokeDasharray="1,2" />
          {/* Memory Modules (Chips) */}
          {[12, 26, 40, 54, 76, 90, 104, 118].map((x, i) => (
            <g key={i}>
              <rect x={x} y="8" width="11" height="13" rx="1.5" fill="#18181b" stroke="#4b5563" strokeWidth="0.5" />
              <line x1={x+2} y1="10" x2={x+9} y2="10" stroke="#374151" strokeWidth="1" />
            </g>
          ))}
          {/* Golden interface gold fingers */}
          <line x1="6" y1="28" x2="134" y2="28" stroke="#eab308" strokeWidth="1.8" strokeDasharray="1.5,0.5" />
          {/* Center notch */}
          <rect x="68" y="25" width="4" height="4" fill="#020617" />
          {/* Specs tag sticker */}
          <rect x="71" y="9" width="31" height="7" rx="0.5" fill="#f8fafc" />
          <text x="86" y="14" fill="#0f172a" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">8GB DDR5</text>
        </svg>
      );
    case 'gpu':
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full drop-shadow-lg">
          {/* PCIe Connector block */}
          <rect x="24" y="70" width="100" height="8" rx="1" fill="#090d16" />
          <line x1="28" y1="74" x2="120" y2="74" stroke="#eab308" strokeWidth="1.5" strokeDasharray="2,0.5" />
          
          {/* Card body / shroud */}
          <rect x="4" y="4" width="152" height="66" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
          {/* Carbon fiber grid styling */}
          <rect x="8" y="8" width="144" height="58" rx="5" fill="#020617" />
          
          {/* Cooling heatsink fins showing behind fans */}
          <g stroke="#1e293b" strokeWidth="1">
            {Array.from({ length: 36 }).map((_, i) => (
              <line key={i} x1={15 + i * 3.6} y1="14" x2={15 + i * 3.6} y2="60" />
            ))}
          </g>
          
          {/* Dual Fans */}
          <g>
            {/* Fan 1 */}
            <circle cx="45" cy="37" r="23" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="8,4" />
            <circle cx="45" cy="37" r="19" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
            <circle cx="45" cy="37" r="6" fill="#3b82f6" />
            {Array.from({ length: 8 }).map((_, idx) => {
              const angle = (idx * 45 * Math.PI) / 180 + (isPoweredOn ? 2.5 : 0);
              const x2 = 45 + Math.cos(angle) * 17;
              const y2 = 37 + Math.sin(angle) * 17;
              return <line key={idx} x1="45" y1="37" x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" opacity="0.9" />;
            })}
            
            {/* Fan 2 */}
            <circle cx="115" cy="37" r="23" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="8,4" />
            <circle cx="115" cy="37" r="19" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
            <circle cx="115" cy="37" r="6" fill="#3b82f6" />
            {Array.from({ length: 8 }).map((_, idx) => {
              const angle = (idx * 45 * Math.PI) / 180 + (isPoweredOn ? 2.5 : 0);
              const x2 = 115 + Math.cos(angle) * 17;
              const y2 = 37 + Math.sin(angle) * 17;
              return <line key={idx} x1="115" y1="37" x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" opacity="0.9" />;
            })}
          </g>
          {/* Aesthetic gaming accents */}
          <path d="M12 12 L30 12 L35 18 L12 18 Z" fill="#ef4444" opacity="0.8" />
          <path d="M148 12 L130 12 L125 18 L148 18 Z" fill="#ef4444" opacity="0.8" />
          <text x="80" y="22" fill="#22d3ee" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">GEFORCE RTX</text>
        </svg>
      );
    case 'storage':
      return (
        <svg viewBox="0 0 100 32" className="w-full h-full drop-shadow-md">
          {/* Black PCB substrate */}
          <rect x="2" y="2" width="96" height="28" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          {/* Gold connector pins left hand */}
          <rect x="2" y="8" width="4" height="16" fill="#eab308" />
          {/* Controller Chip squared */}
          <rect x="12" y="6" width="16" height="20" rx="1.5" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          <rect x="15" y="9" width="10" height="14" fill="#3b82f6" opacity="0.8" />
          {/* Memory chips NAND flash */}
          <rect x="34" y="6" width="18" height="20" rx="1" fill="#020617" stroke="#1e293b" strokeWidth="1" />
          <rect x="56" y="6" width="18" height="20" rx="1" fill="#020617" stroke="#1e293b" strokeWidth="1" />
          {/* Hologram sticker/metallic label */}
          <rect x="76" y="6" width="16" height="20" rx="1.5" fill="#f8fafc" />
          <text x="84" y="16" fill="#1e293b" fontSize="5" fontWeight="black" textAnchor="middle" fontFamily="monospace">1TB</text>
          <text x="84" y="22" fill="#3b82f6" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">SSD</text>
          {/* Screw mounting ring on the right edge */}
          <circle cx="94" cy="16" r="3" fill="none" stroke="#64748b" strokeWidth="1" />
          <circle cx="94" cy="16" r="1.5" fill="#1e293b" />
        </svg>
      );
    case 'fan':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Outer square frame */}
          <rect x="4" y="4" width="92" height="92" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="2.5" />
          {/* Corner mount holes */}
          {[
            { cx: 12, cy: 12 },
            { cx: 88, cy: 12 },
            { cx: 12, cy: 88 },
            { cx: 88, cy: 88 }
          ].map((circleProps, idx) => (
            <circle key={idx} {...circleProps} r="4.5" fill="#475569" stroke="#0f172a" />
          ))}
          {/* Guard rings */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="2" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#334155" strokeWidth="1.5" />
          
          {/* Fan blades */}
          <g className={isPlacedInMotherboard && isPoweredOn ? "origin-center animate-spin-fast" : "origin-center animate-spin-slow"}>
            <circle cx="50" cy="50" r="15" fill="#020617" stroke="#3b82f6" strokeWidth="1" />
            {Array.from({ length: 7 }).map((_, idx) => {
              const angle = (idx * 360) / 7;
              return (
                <path
                  key={idx}
                  d="M 50 50 Q 32 15 22 36 Q 37 57 50 50"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="0.5"
                  transform={`rotate(${angle} 50 50)`}
                  opacity="0.95"
                />
              );
            })}
          </g>
          {/* Center brand sticker */}
          <circle cx="50" cy="50" r="11" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
          <text x="50" y="52" fill="#eab308" fontSize="5" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif">
            CHILL
          </text>
        </svg>
      );
    case 'psu':
      return (
        <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
          {/* Main black casing */}
          <rect x="4" y="4" width="92" height="72" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          {/* Heavy mesh grid background */}
          <rect x="12" y="12" width="56" height="56" rx="4" fill="#020617" />
          {/* Honeycomb grill patterns */}
          <g stroke="#334155" strokeWidth="0.5">
            {Array.from({ length: 9 }).map((_, r) => (
              <g key={r}>
                {Array.from({ length: 7 }).map((_, c) => (
                  <circle key={`${r}-${c}`} cx={16 + c * 6 + (r % 2 === 0 ? 3 : 0)} cy={17 + r * 5.5} r="1.8" fill="none" />
                ))}
              </g>
            ))}
          </g>
          {/* Main cooling fan inside */}
          <circle cx="40" cy="40" r="22" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="4,2" />
          <circle cx="40" cy="40" r="5" fill="#3b82f6" />
          {/* AC Power socket on the right */}
          <rect x="76" y="20" width="16" height="18" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <polygon points="79,24 81,24 80,26" fill="#e2e8f0" />
          <polygon points="85,24 87,24 86,26" fill="#e2e8f0" />
          <polygon points="82,32 84,32 83,30" fill="#e2e8f0" />
          {/* I/O switch */}
          <rect x="78" y="44" width="12" height="18" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          {isPlacedInMotherboard && isPoweredOn ? (
            <text x="84" y="56" fill="#34d399" fontSize="9" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">I</text>
          ) : (
            <text x="84" y="56" fill="#ef4444" fontSize="9" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">O</text>
          )}
          {/* Dynamic glowing power LED */}
          <circle cx="71" cy="40" r="2.5" fill={isPlacedInMotherboard && isPoweredOn ? "#10b981" : "#3b82f6"} className={isPlacedInMotherboard && isPoweredOn ? "animate-pulse" : ""} />
        </svg>
      );
    default:
      return null;
  }
};

export const ComputerAssemblyLab: React.FC<ComputerAssemblyLabProps> = ({
  stats,
  onEmitPoints,
  onEmitAchievement,
  onClose
}) => {
  // Sound generator using Web Audio API
  const playSound = (soundType: 'success' | 'click' | 'laser' | 'fail' | 'boot' | 'fan') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (soundType === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (soundType === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (soundType === 'laser') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (soundType === 'boot') {
        // High-low-high electronic boot tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
        osc.frequency.setValueAtTime(440.00, ctx.currentTime + 0.15); // A4
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.30); // C#5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.45); // A5
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.85);
        osc.start();
        osc.stop(ctx.currentTime + 0.85);
      } else if (soundType === 'fan') {
        // Wind-like effect using frequency sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.5);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 1.2);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } else {
        // Simple click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      // Graceful fallback if blocked by browser autoplay rules
    }
  };

  // Lab Tab states: 'assembly' | 'booting' | 'os_menu' | 'dos' | 'windows' | 'linux'
  const [labState, setLabState] = useState<'assembly' | 'booting' | 'os_menu' | 'dos' | 'windows' | 'linux'>('assembly');

  // Hardcoded initial 6 motherboard parts matching the curriculum requirements exactly
  const [parts, setParts] = useState<ComponentPart[]>([
    {
      id: 'cpu',
      name: 'وحدة',
      englishName: 'CPU (Processor)',
      desc: 'وحدة المعالجة المركزية هي عقل المعالجة المفكر ومحلل جميع البيانات والأوامر البرمجية.',
      role: 'تقوم بمسك ونقل الأوامر البرمجية ومعالجة البيانات الحسابية الأساسية للجهاز لتشغيل البرامج.',
      placed: false,
      icon: 'Cpu',
      color: 'from-amber-400/20 to-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
    },
    {
      id: 'ram',
      name: 'ذاكرة',
      englishName: 'RAM (Memory)',
      desc: 'ذاكرة الوصول العشوائي هي ذاكرة العمل المؤقتة فائقة السرعة التي تفقد بياناتها فور إطفاء الجهاز.',
      role: 'تحتفظ ببيانات التطبيقات والبرامج والملفات المفتوحة حالياً لتسهيل وسرعة معالجة المهام.',
      placed: false,
      icon: 'Sliders',
      color: 'from-emerald-400/20 to-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
    },
    {
      id: 'gpu',
      name: 'كرت',
      englishName: 'GPU (Graphics Card)',
      desc: 'كرت الشاشة هو المعالج المسؤول الأول عن إنتاج الرسوميات ومعالجة الفيديوهات وتلوين بكسلات العرض.',
      role: 'يقوم بتحويل الأكواد البرمجية إلى صور ملونة وتفاصيل وتأثيرات بصرية ورسومية مذهلة على الشاشة.',
      placed: false,
      icon: 'Monitor',
      color: 'from-fuchsia-400/20 to-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400 font-bold'
    },
    {
      id: 'storage',
      name: 'وحدة تخزين M.2',
      englishName: 'M.2 SSD (Storage)',
      desc: 'وحدة تخزين القرص السريع M.2 SSD هي مقر الحفظ الدائم والمستقر لكامل ملفاتك ونظام التشغيل البرمجي.',
      role: 'تقوم بتخزين واستدعاء نظام التشغيل والملفات والبرامج بشكل دائم حتى بعد فصل التيار الكهربائي.',
      placed: false,
      icon: 'Folder',
      color: 'from-blue-400/20 to-blue-500/10 border-blue-500/30 text-blue-400 font-bold'
    },
    {
      id: 'fan',
      name: 'مروحة',
      englishName: 'Cooler Fan',
      desc: 'مروحة التبريد هي الدرع الواقي والمنظم الحراري الحصين لحماية المكونات من ارتفاع درجات الحرارة.',
      role: 'تأخذ الهواء الساخن الناجم عن الطاقة الكهربائية وتطرده بعيداً لضمان تشغيل صحي ومستقر للمعالج.',
      placed: false,
      icon: 'Activity',
      color: 'from-cyan-400/20 to-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold'
    },
    {
      id: 'psu',
      name: 'مشغل الطاقة البور سبلاي',
      englishName: 'Power Supply Unit (PSU)',
      desc: 'وحدة مزود الطاقة هي المحول الكهربائي المغذي للحاسوب الذي يوحد طاقة لوحة الأم والمعالج وبطاقات العرض.',
      role: 'استقبال الكهرباء من جدار غرفتك وتحويلها لجهود مستمرة وآمنة وموزعة بدقة لكافة عتاد الحاسب.',
      placed: false,
      icon: 'Power',
      color: 'from-amber-500/20 to-amber-600/10 border-amber-550/30 text-amber-500 font-bold'
    }
  ]);

  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [draggingPartId, setDraggingPartId] = useState<string | null>(null);
  const [hoveredMotherboardSlot, setHoveredMotherboardSlot] = useState<string | null>(null);
  const isAssemblyComplete = parts.every(p => p.placed);

  // Booting diagnostic logs in animation
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [bootProgress, setBootProgress] = useState(0);

  // DOS terminal state
  const [dosInput, setDosInput] = useState('');
  const [dosConsole, setDosConsole] = useState<string[]>([
    'Virtual MS-DOS v6.22 [Sudanese Modern ICT Lab Mock]',
    '(C) Copyright Microsoft Corp 1981-1994.',
    ' ',
    'Type "HELP" for available instructions, "DIR" list files, or "BOOT" for OS selector.',
    'C:\\>'
  ]);

  // Windows Desktop simulation states
  const [winWallpaper, setWinWallpaper] = useState<'aurora' | 'cyber' | 'nile'>('aurora');
  const [winTime, setWinTime] = useState<string>('١٢:٠٠ م');
  const [winOpenApp, setWinOpenApp] = useState<'none' | 'notepad' | 'calculator' | 'paint'>('none');
  const [notepadText, setNotepadText] = useState('كتابة خواطر طالب الصف السادس عن تجميع الحاسوب الممتع...');
  const [savedNotepads, setSavedNotepads] = useState<string>('');

  // Windows Calculator state
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcFormula, setCalcFormula] = useState('');

  // Windows Paint system (12x12 grid)
  const [paintSelectedColor, setPaintSelectedColor] = useState<string>('#3b82f6');
  const [paintGrid, setPaintGrid] = useState<string[][]>(Array(12).fill(null).map(() => Array(12).fill('#ffffff')));

  // Linux terminal state
  const [linuxInput, setLinuxInput] = useState('');
  const [linuxConsole, setLinuxConsole] = useState<string[]>([
    'Welcome to Sudan GNU/Linux v5.15-SUD-ICT (tty1)',
    'root@sudan-ict-student:~$ ',
  ]);

  // Handle installing a part
  const handleInstallPart = (partId: string) => {
    const part = parts.find(p => p.id === partId);
    if (!part || part.placed) return;

    playSound('success');
    setParts(prev => prev.map(p => p.id === partId ? { ...p, placed: true } : p));
    setSelectedPartId(null);
    onEmitPoints(15);

    // If completely assembled
    const nextCompleted = parts.map(p => p.id === partId ? { ...p, placed: true } : p).every(p => p.placed);
    if (nextCompleted) {
      onEmitAchievement('ach-2'); // Award Cyber/Hardware points!
      onEmitPoints(30);
    }
  };

  // Run the computer boot diagnostics animation
  const runBootProcess = () => {
    playSound('boot');
    setLabState('booting');
    setBootLogs(['جاري بدء تشغيل التيار الكهربائي...']);
    setBootProgress(0);

    const diagnostics = [
      'فحص مصدر الطاقة PSU: ناجح [جهود فولتية مستمرة ومستقرة]',
      'تدوير مروحة المعالج CPU Fan: تعمل بسرعة مذهلة 3200 دورة/دقيقة',
      'التحقق من سلامة المعالج: تم رصد معالج سداسي الأنوية (Sudanese ICT CPU)',
      'التعرف على الذاكرة: تم اكتشاف ذاكرة RAM بسعة 16 جيجابايت',
      'قراءة وحدة التخزين SSD: تم العثور على قرص تخزين سريع بسعة 512 جيجابايت',
      'تهيئة كرت الشاشة GPU: دقة العرض ممتازة ونطاق التردد آمن',
      'فحص اللوحة الأم (BIOS): جميع الأقسام الإلكترونية سليمة وخاضعة للفحص الدراسي',
      'جاري تحميل ملفات أنظمة التشغيل المحمية...',
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setBootProgress(prev => {
        const next = prev + 12.5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            playSound('success');
            setLabState('os_menu');
          }, 450);
          return 100;
        }
        return next;
      });

      if (currentLogIndex < diagnostics.length) {
        setBootLogs(prev => [...prev, diagnostics[currentLogIndex]]);
        currentLogIndex++;
      }
    }, 380);
  };

  // Reset experimental motherboard back to zero
  const resetAssembly = () => {
    playSound('laser');
    setParts(prev => prev.map(p => ({ ...p, placed: false })));
    setSelectedPartId(null);
    setLabState('assembly');
  };

  // DOS prompt handling
  const handleDosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = dosInput.trim().toUpperCase();
    if (!cmd) return;

    playSound('laser');
    setDosConsole(prev => [...prev, `C:\\>${dosInput}`]);

    let response: string[] = [];

    if (cmd === 'HELP') {
      response = [
        'Available commands standard registry:',
        '  DIR          - View simulated system database folders and files.',
        '  VER          - View current DOS environment system edition.',
        '  DATE         - Print Sudanese local student session times.',
        '  NEOFETCH     - Print a magnificent retro ASCII graphical computer art.',
        '  CLS          - Clear command prompt log history.',
        '  BOOT         - Safely return to the main virtual operating systems selector.',
        '  TYPE FILE    - Read contents of files (e.g., TYPE LESSON.TXT)'
      ];
    } else if (cmd === 'DIR') {
      response = [
        ' Volume in drive C is SUDAN_HARDWARE',
        ' Directory of C:\\',
        ' ',
        'COMMAND  COM         54,645  05-12-1994   06:22a',
        'AUTOEXEC BAT             45  06-19-2026   11:00a',
        'LESSON   TXT          1,280  06-19-2026   11:05a',
        'SUDAN    TXT            512  06-19-2026   11:15a',
        '        4 File(s)         56,482 bytes',
        '        0 Dir(s)      453,924,110 bytes free'
      ];
    } else if (cmd === 'VER') {
      response = [
        'Virtual MS-DOS Educational Environment Sudan-Core version 6.22',
        'Optimized for primary school information technology curricula.'
      ];
    } else if (cmd === 'DATE') {
      response = [`Current Session Local Time is: ${new Date().toLocaleTimeString('ar-SD')} - June 2026`];
    } else if (cmd === 'CLS') {
      setDosConsole(['C:\\>']);
      setDosInput('');
      return;
    } else if (cmd === 'BOOT') {
      setLabState('os_menu');
      setDosInput('');
      return;
    } else if (cmd === 'NEOFETCH') {
      onEmitPoints(5);
      response = [
        '      ,---.       Operating System: Virtual MS-DOS v6.22',
        '     /     \\      Processor: Sudanese ICT Virtual CPU-8',
        '    | () () |     RAM Allocated: 16 GB Physical Chip',
        '     \\  ^  /      Disk Storage: MS-DOS Partition on SSD (FAT16)',
        '      |||||       Host Board: Sudan ICT-6 Motherboard v2',
        '      |||||       Status: 100% Assembled & Functional!',
        '   [  معمل الحاسوب كادح لرفعة السودان الحبيب 🇸🇩 ]'
      ];
    } else if (cmd.startsWith('TYPE ')) {
      const fileName = cmd.substring(5).trim();
      if (fileName === 'LESSON.TXT') {
        response = [
          '=== درس تجميع الحاسوب والعتاد ===',
          'يتكون الحاسوب من لوحة أم ترتبط بها عدة قطع أساسية:',
          '1- المعالج (CPU): عقل النظام يقوم بالتفكير والمعالجة.',
          '2- الرام (RAM): ذاكرة العمل المؤقتة للبرامج النشطة.',
          '3- كرت الشاشة (GPU): مسؤول عن الصورة والغرافيكس.',
          '4- وحدة التخزين: لحفظ الملفات ونصف نظام التشغيل.',
          'عاشت المعرفة لكل تلميذ وتلميذة بالسودان!'
        ];
      } else if (fileName === 'SUDAN.TXT') {
        response = [
          '🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩',
          'مرحبا بكم يا مبرمجي المستقبل في جمهورية السودان!',
          'من الخرطوم إلى الجزيرة وسنار ودارفور والشرق والشمال وكردفان،',
          'أنتم غراس الغد الرقمي الزاهر. ابنوا شبكات المعرفة،',
          'وطوعوا تكنولوجيا الحوسبة لرفعة أمتنا وجودة المدارس والمستقبل!',
          '🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩 🇸🇩'
        ];
      } else {
        response = [`File not found: "${fileName}". Hint: write TYPE LESSON.TXT`];
      }
    } else {
      playSound('fail');
      response = [`Bad command or file name: "${cmd}". Type "HELP" for instructions.`];
    }

    setDosConsole(prev => [...prev, ...response, 'C:\\>']);
    setDosInput('');
  };

  // Windows simple desktop click notepad / paint / calc
  const runCalcAction = (char: string) => {
    playSound('click');
    if (char === 'C') {
      setCalcDisplay('0');
      setCalcFormula('');
    } else if (char === '←' || char === 'Backspace') {
      if (calcDisplay.length > 1) {
        setCalcDisplay(calcDisplay.slice(0, -1));
      } else {
        setCalcDisplay('0');
      }
    } else if (char === '=') {
      try {
        // Safe evaluation of simple arithmetic formula
        const sanitized = calcFormula.replace(/×/g, '*').replace(/÷/g, '/');
        const result = eval(sanitized + calcDisplay);
        setCalcDisplay(String(result));
        setCalcFormula('');
        onEmitPoints(5);
      } catch (e) {
        setCalcDisplay('خطأ');
        setCalcFormula('');
      }
    } else if (['+', '-', '×', '÷'].includes(char)) {
      setCalcFormula(calcDisplay + ' ' + char + ' ');
      setCalcDisplay('0');
    } else {
      if (calcDisplay === '0' || calcDisplay === 'خطأ') {
        setCalcDisplay(char);
      } else {
        setCalcDisplay(calcDisplay + char);
      }
    }
  };

  // Change background helper for Windows
  const handleSaveNotepad = () => {
    if (!notepadText.trim()) return;
    playSound('success');
    setSavedNotepads(notepadText);
    onEmitPoints(10);
    alert('تم حفظ مستند المفكرة بنجاح على قرص SSD الافتراضي! 💾');
  };

  // Linux shell input handling
  const handleLinuxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = linuxInput.trim().toLowerCase();
    if (!cmd) return;

    playSound('laser');
    setLinuxConsole(prev => [...prev, `root@sudan-ict-student:~$ ${linuxInput}`]);

    let response: string[] = [];

    if (cmd === 'help') {
      response = [
        'Sudan GNU/Linux Interactive Terminal Commands:',
        '  ls          - List file systems inside the home folder.',
        '  neofetch    - Display full software, kernel, and hardware layout.',
        '  whoami      - Print active user ID credentials (root).',
        '  ping -c 3   - Run internet simulated packets telemetry tests.',
        '  cat file    - Concatenate and display files (e.g. cat welcome.md).',
        '  clear       - Clear screen logs.',
        '  exit        - Safe reboot back to OS menu selector.'
      ];
    } else if (cmd === 'ls') {
      response = [
        'Welcome.md   bin/         etc/         home/        var/         sys_logs/'
      ];
    } else if (cmd === 'neofetch') {
      onEmitPoints(5);
      response = [
        '             .o-  root@sudan-ict-student',
        '           `/`..  ----------------------',
        '          `++``   OS: Sudan ICT Linux v5.15-Standard',
        '         .+++     Kernel: 5.15.0-x86_64-GNU',
        '        .++++:.   Uptime: 2 minutes [Realtime System Mock]',
        '      `+++++++    Packages: 452 (dpkg)',
        '     `+++++++.    Shell: bash 5.1.16',
        '    .++++++++`    Resolution: 1024x768',
        '   .+++++++++     CPU: Sudanese Core ICT-Intel @ 4.2GHz',
        '  `++++++++++`    GPU: Sudan-OpenGL Graphics HD 5000',
        '  +++++++++++.    Memory: 1032MiB / 16384MiB (6%)',
        '  `++++++++++`    ',
        '   `+++++++++'
      ];
    } else if (cmd === 'whoami') {
      response = ['root [Sudanese Junior ICT Specialist Administrator]'];
    } else if (cmd === 'clear') {
      setLinuxConsole(['root@sudan-ict-student:~$ ']);
      setLinuxInput('');
      return;
    } else if (cmd.startsWith('cat ')) {
      const fileName = cmd.substring(4).trim();
      if (fileName === 'welcome.md' || fileName === 'welcome') {
        response = [
          '# نظام تشغيل لينكس الرائع (Linux OS)',
          'تعد بيئة لينكس أحد أفضل الأنظمة للبرمجة وإدارة السيرفرات وشبكات الاتصالات.',
          'يتميز بالاستقرار التام وميزة المصادر المفتوحة (Open-source) التي تمكن المبرمجين',
          'من قراءة الكود المصدر وتعديله مجاناً لضمان عدم الاحتكار.',
          'تعلم لغة لينكس يمنح التلميذ آفاق ريادة التكنولوجيا والبرمجيات مستقبلاً!'
        ];
      } else {
        response = [`cat: ${fileName}: No such file or directory. Try cat welcome.md`];
      }
    } else if (cmd.startsWith('ping ')) {
      response = [
        'PING google.com (172.217.16.142) 56(84) bytes of data.',
        '64 bytes from lhr35s07-in-f14.1e100.net (172.217.16.142): icmp_seq=1 ttl=56 time=14.2 ms',
        '64 bytes from lhr35s07-in-f14.1e100.net (172.217.16.142): icmp_seq=2 ttl=56 time=12.5 ms',
        '64 bytes from lhr35s07-in-f14.1e100.net (172.217.16.142): icmp_seq=3 ttl=56 time=15.1 ms',
        '--- google.com ping statistics ---',
        '3 packets transmitted, 3 received, 0% packet loss, time 2003ms',
        'rtt min/avg/max/mdev = 12.508/13.945/15.121/1.082 ms'
      ];
    } else if (cmd === 'exit') {
      setLabState('os_menu');
      setLinuxInput('');
      return;
    } else {
      playSound('fail');
      response = [`bash: command not found: "${cmd}". Type "help" for interactive manual.`];
    }

    setLinuxConsole(prev => [...prev, ...response, 'root@sudan-ict-student:~$ ']);
    setLinuxInput('');
  };

  const getWallpaperClasses = () => {
    switch (winWallpaper) {
      case 'cyber':
        return 'bg-gradient-to-tr from-slate-950 via-purple-950 to-indigo-950';
      case 'nile':
        return 'bg-gradient-to-br from-teal-900 via-[#1e4e5e] to-sky-950';
      case 'aurora':
      default:
        return 'bg-gradient-to-br from-indigo-700 via-blue-600 to-pink-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-40 overflow-y-auto selection:bg-indigo-500 selection:text-white" dir="rtl">
      {/* Dynamic Keyframes Styling block */}
      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 5s linear infinite;
        }
        @keyframes spinFast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-fast {
          animation: spinFast 0.8s linear infinite;
        }
        @keyframes cpuGuideMove {
          0% {
            transform: translate(160px, 120px) scale(0.9);
            opacity: 0;
          }
          15% {
            transform: translate(160px, 120px) scale(1);
            opacity: 1;
          }
          75% {
            transform: translate(0px, 0px) scale(1.05);
            opacity: 1;
          }
          90% {
            transform: translate(0px, 0px) scale(0.95);
            opacity: 0.3;
          }
          100% {
            transform: translate(0px, 0px) scale(0.9);
            opacity: 0;
          }
        }
        .animate-cpu-guide {
          animation: cpuGuideMove 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes rgbGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-rgb-glow {
          background: linear-gradient(135deg, #ef4444, #3b82f6, #a855f7, #ec4899);
          background-size: 300% 300%;
          animation: rgbGlow 6s ease infinite;
        }
      `}</style>
      
      <div 
        id="computer_assembly_lab_container"
        className="bg-slate-900 rounded-[35px] w-full max-w-6xl h-full md:max-h-[88vh] flex flex-col overflow-hidden border-2 border-indigo-500 shadow-[0_0_35px_rgba(79,70,229,0.3)]"
      >
        
        {/* Header Bar */}
        <div className="bg-slate-950/80 border-b border-indigo-500/20 p-4 shrink-0 flex justify-between items-center px-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/30 border border-indigo-500 p-2 rounded-xl animate-pulse">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-right">
              <h3 className="font-extrabold text-cyan-400 text-sm md:text-base">المعمل التقني المتكامل لتجميع الحاسب وأنظمة التشغيل 💻</h3>
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">لوحة الأم المتقدمة والأنظمة الافتراضية لطلاب الصف السادس</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="bg-slate-905 border border-indigo-500/25 text-yellow-400 text-[10px] px-3 py-1 rounded-full font-black hidden sm:inline-block">
              نقاطك حالياً: {stats.points} XP ⭐
            </span>
            <button
              onClick={onClose}
              className="bg-indigo-950 border border-indigo-500/30 text-indigo-300 hover:text-rose-400 hover:border-rose-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs shadow transition select-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 1. TOP STATUS BAR (As requested by User) */}
        <div className="bg-slate-950/60 px-6 py-2.5 border-b border-indigo-500/20 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Right Tab Status Indicator / Link */}
            <button
              onClick={() => { playSound('click'); setLabState('assembly'); }}
              className={`px-4 py-1.5 rounded-xl text-[11px] font-black transition flex items-center gap-2 border ${
                labState === 'assembly' 
                  ? 'bg-violet-600/35 border-violet-500 text-violet-300 shadow-md shadow-violet-500/5' 
                  : 'bg-slate-800 border-indigo-500/10 text-indigo-300 hover:bg-slate-700'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-violet-400" />
              <span>عتاد لوحة الأم (Hardware)</span>
            </button>

            {/* Middle Tab Status Indicator / Link */}
            <button
              onClick={() => {
                if (!isAssemblyComplete) {
                  playSound('fail');
                  alert('يرجى تجميع وتركيب كافة القطع الإلكترونية على اللوحة الأم أولاً لتنشيط الأنظمة الوهمية!');
                  return;
                }
                playSound('click');
                setLabState('os_menu');
              }}
              className={`px-4 py-1.5 rounded-xl text-[11px] font-black transition flex items-center gap-2 border ${
                !isAssemblyComplete ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-950 text-slate-500' :
                ['os_menu', 'dos', 'windows', 'linux'].includes(labState) ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/5' : 'bg-slate-800 border-indigo-500/10 text-emerald-400 hover:bg-slate-700'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>أنظمة التشغيل الوهمية (Virtual OS)</span>
              {isAssemblyComplete && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>}
            </button>
          </div>

          {/* Left Device Status */}
          <div className="text-[11px] font-bold">
            {isAssemblyComplete ? (
              <span className="text-emerald-400 flex items-center gap-1.5 bg-emerald-950/45 px-3 py-1 rounded-full border border-emerald-500/35 shadow-sm">
                <CheckCircle className="w-4 h-4 fill-emerald-400 text-slate-950 shrink-0" />
                <span className="animate-pulse">حاسوبك مجمع وسليم بنسبة 100%! جاهز للتشغيل</span>
              </span>
            ) : (
              <span className="text-yellow-400 flex items-center gap-1.5 bg-yellow-950/45 px-3 py-1 rounded-full border border-yellow-500/35">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                <span>العتاد قيد الإنشاء: تم تجميع {parts.filter(p => p.placed).length} من أصل {parts.length} قطع عتاد</span>
              </span>
            )}
          </div>
        </div>

        {/* Core Workspace - Responsive Content flex */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-950/20">

          {/* 1. HARDWARE ASSEMBLY AREA */}
          {labState === 'assembly' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch h-full">
              
              {/* Right Column: "لوحة كتيب المنهج لتجميع العتاد" (Curriculum Manual) - Col: 4 (RTL starts here) */}
              <div className="lg:col-span-4 bg-slate-900/95 border border-indigo-500/20 p-5 rounded-3xl flex flex-col justify-between space-y-4 lg:order-1">
                <div className="space-y-4">
                  <h4 className="font-extrabold text-white text-sm flex items-center gap-2 border-b border-indigo-500/20 pb-2.5">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>لوحة "كتيب المنهج لتجميع العتاد"</span>
                  </h4>
                  
                  <p className="text-[11px] sm:text-xs text-indigo-200/90 leading-relaxed font-semibold">
                    اللوحة الأم (Motherboard) هي الصحن الإلكتروني المشترك والعمود الفقري للحاسوب الذي يوحد الطاقة والبيانات بين جميع الوحدات والقطع، مثل المعالج كرت الشاشة والذاكرة المؤقتة.
                  </p>
                  
                  {/* Progress panel */}
                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-indigo-500/10 space-y-2">
                    <div className="flex justify-between text-[11px] text-indigo-300 font-extrabold">
                      <span>مؤشر تقدم تجميع العتاد المادي:</span>
                      <span className="text-cyan-400 font-mono text-xs">{Math.round((parts.filter(p => p.placed).length / parts.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-indigo-950">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-500 transition-all duration-700"
                        style={{ width: `${(parts.filter(p => p.placed).length / parts.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Dynamic detail of currently chosen component */}
                  {selectedPartId ? (() => {
                    const selectedPart = parts.find(p => p.id === selectedPartId);
                    if (!selectedPart) return null;
                    return (
                      <div className="bg-indigo-950/45 border border-indigo-500/30 p-4 rounded-2xl space-y-3.5 animate-fadeIn">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 bg-slate-950 rounded-xl p-1 border border-indigo-500/25 shrink-0">
                            {renderRealisticPartSVG(selectedPart.id)}
                          </div>
                          <div className="text-right">
                            <h5 className="font-extrabold text-cyan-400 text-xs">شرح قطعة: {selectedPart.name}</h5>
                            <span className="text-[9px] text-indigo-300 font-bold block font-mono">{selectedPart.englishName}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-indigo-100 font-semibold leading-relaxed">{selectedPart.desc}</p>
                        <div className="bg-slate-900/60 p-2.5 rounded-xl text-[10px] text-emerald-400 border border-indigo-500/10">
                          <span className="font-bold underline block mb-1">دوره العملي بالمنهم:</span>
                          <span className="font-medium text-slate-200 leading-relaxed block">{selectedPart.role}</span>
                        </div>
                        
                        {!selectedPart.placed && (
                          <button
                            onClick={() => handleInstallPart(selectedPart.id)}
                            className="w-full bg-indigo-600 hover:bg-slate-800 hover:text-indigo-400 border border-indigo-500 hover:border-indigo-400 text-white font-extrabold text-xs py-2 rounded-xl transition duration-150 transform active:scale-95 shadow-lg shadow-indigo-600/15 shrink-0 cursor-pointer"
                          >
                            تثبيت القطعة اللحظي على اللوحة الأم 🔌
                          </button>
                        )}
                      </div>
                    );
                  })() : (
                    <div className="bg-slate-950/60 border border-indigo-500/5 p-4 py-8 rounded-2xl text-center text-indigo-300/80">
                      <p className="text-[11px] font-bold leading-relaxed">
                        💡 تلميح دراسي: انقر على أي قطعة من علبة القطع باليسار لقراءة دورها في الكتاب المدرسي، ثم اسحبها برفق نحو مكانها الحقيقي في اللوحة الأم!
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-950 p-3 rounded-2xl text-[9px] text-zinc-300 border border-slate-800 leading-relaxed font-semibold">
                    🔴 <span className="font-black text-rose-400">تنبيه المنهج الدراسي:</span> احرص على مسك المعالج والرام برفق دون لمس دبابيس النحاس السفلية لتفادي الكهرباء الساكنة!
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={resetAssembly}
                      className="flex-1 bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 font-extrabold text-[11px] py-2.5 rounded-xl border border-rose-900/40 cursor-pointer transition text-center"
                    >
                      إعادة التجميع من الصفر 🔄
                    </button>
                    {isAssemblyComplete ? (
                      <button
                        onClick={runBootProcess}
                        className="flex-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-[11.5px] py-2.5 rounded-xl shadow-lg shadow-emerald-600/25 transition transform hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Power className="w-3.5 h-3.5 text-white animate-pulse" />
                        <span>تشغيل وتوليد الطاقة ⏻</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-2 bg-slate-800 text-slate-500 font-bold text-[11px] py-2.5 rounded-xl cursor-not-allowed border border-slate-950 text-center"
                      >
                        بانتظار {parts.filter(p => !p.placed).length} قطع للتشغيل...
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Center Column: Interactive Motherboard graphic display - Col: 5 */}
              <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-indigo-950/60 border-2 border-indigo-500 p-5 rounded-[35px] relative min-h-[440px] shadow-2xl flex flex-col justify-between overflow-hidden lg:order-2">
                <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl"></div>
                
                {/* Board detail metadata bar */}
                <div className="flex justify-between items-center z-10 shrink-0 mb-3">
                  <span className="text-[8px] font-extrabold text-indigo-300 tracking-wide font-mono bg-slate-950/95 px-2 py-1 rounded border border-indigo-500/25">
                    BOARD MODEL: SUDAN-6-CORE-2026
                  </span>
                  
                  {/* Glowing RGB Lights Heatsink at the corner */}
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-0.5 rounded border border-indigo-500/15">
                    <div className="w-1.5 h-1.5 rounded-full animate-rgb-glow shrink-0"></div>
                    <span className="text-[8px] font-bold text-indigo-200">أضواء RGB خفية تعمل</span>
                  </div>
                </div>

                {/* Circuit paths lines artwork */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0">
                  <div className="w-full h-full bg-[radial-gradient(#818cf8_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
                </div>

                {/* 2. MAIN MOTHERBOARD CONTAINER */}
                <div className="relative flex-1 bg-slate-950/90 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between z-10 shadow-inner">
                  
                  {/* Interactive Slots overlay */}
                  <div className="relative w-full h-full min-h-[320px]">
                    
                    {/* F. PSU Socket / Slot (Top-Left) */}
                    <div 
                      onClick={() => { playSound('click'); setSelectedPartId('psu'); }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'psu') setHoveredMotherboardSlot('psu');
                      }}
                      onDragLeave={() => setHoveredMotherboardSlot(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'psu') handleInstallPart('psu');
                        setHoveredMotherboardSlot(null);
                      }}
                      className={`absolute top-[8%] left-[6%] w-[110px] h-28 rounded-2xl cursor-pointer border flex flex-col justify-center transition-all z-10 ${
                        parts.find(p => p.id === 'psu')?.placed
                          ? 'bg-slate-900/90 border-emerald-500'
                          : selectedPartId === 'psu'
                          ? 'bg-indigo-650/40 border-cyan-400 animate-pulse'
                          : hoveredMotherboardSlot === 'psu'
                          ? 'bg-indigo-500/30 border-cyan-300'
                          : 'bg-slate-950 border-dashed border-indigo-500/15 text-indigo-300/30 hover:border-indigo-400'
                      }`}
                    >
                      {parts.find(p => p.id === 'psu')?.placed ? (
                        <div className="w-full h-full p-2.5 animate-fadeIn">
                          {renderRealisticPartSVG('psu', true, isAssemblyComplete)}
                        </div>
                      ) : (
                        <div className="text-center p-1.5 flex flex-col items-center justify-center">
                          <Power className="w-7 h-7 text-indigo-500/45 mb-1.5 animate-pulse" />
                          <span className="text-[8px] font-bold block text-indigo-200">مشغل الطاقة</span>
                          <span className="text-[7px] text-cyan-400/60 font-bold block font-mono">ATX_POWER_PSU</span>
                        </div>
                      )}
                    </div>
                    
                    {/* A. CPU Socket & Fan bracket combo (Top-Center) */}
                    <div 
                      className="absolute top-[8%] left-[50%] -translate-x-1/2 w-32 h-32 flex flex-col items-center justify-center transition-all"
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'cpu' || draggingPartId === 'fan') {
                          setHoveredMotherboardSlot(draggingPartId);
                        }
                      }}
                      onDragLeave={() => setHoveredMotherboardSlot(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        const dragged = draggingPartId;
                        if (dragged === 'cpu' || dragged === 'fan') {
                          handleInstallPart(dragged);
                        }
                        setHoveredMotherboardSlot(null);
                      }}
                    >
                      {/* Substrate socket frame */}
                      <div 
                        onClick={() => {
                          playSound('click');
                          setSelectedPartId(parts.find(p => p.id === 'cpu')?.placed ? 'fan' : 'cpu');
                        }}
                        className={`w-28 h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-1.5 cursor-pointer transition ${
                          parts.find(p => p.id === 'cpu')?.placed 
                            ? 'bg-slate-900 border-indigo-505/40' 
                            : selectedPartId === 'cpu'
                            ? 'bg-indigo-650/30 border-cyan-400 animate-pulse animate-cyber-pulse'
                            : hoveredMotherboardSlot === 'cpu'
                            ? 'bg-indigo-500/40 border-cyan-300'
                            : 'bg-slate-950 border-dashed border-indigo-500/15 text-indigo-300/30 hover:border-indigo-400'
                        }`}
                      >
                        {/* CPU Placement rendering */}
                        {parts.find(p => p.id === 'cpu')?.placed ? (
                          // CPU sits here inside socket
                          <div className="relative w-full h-full">
                            {renderRealisticPartSVG('cpu', true)}
                            
                            {/* B. Fan on top of CPU */}
                            {parts.find(p => p.id === 'fan')?.placed && (
                              <div className="absolute inset-0 bg-slate-950/80 rounded-2xl p-0.5 animate-fadeIn">
                                {renderRealisticPartSVG('fan', true, isAssemblyComplete)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center p-1">
                            <Cpu className="w-7 h-7 mx-auto text-indigo-500/30 mb-1" />
                            <span className="text-[8px] font-bold block">مقبس المعالج</span>
                            <span className="text-[7px] text-cyan-400 font-bold block">CPU_SOCKET</span>
                          </div>
                        )}
                      </div>

                      {/* Fan highlight tag if CPU logic is complete but Fan is not */}
                      {parts.find(p => p.id === 'cpu')?.placed && !parts.find(p => p.id === 'fan')?.placed && (
                        <div 
                          onClick={() => { playSound('click'); setSelectedPartId('fan'); }}
                          className={`absolute -bottom-1.5 bg-yellow-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full cursor-pointer animate-bounce ${
                            selectedPartId === 'fan' ? 'bg-cyan-400 ring-2 ring-indigo-500' : ''
                          }`}
                        >
                          ركّب المروحة هنا 🌀
                        </div>
                      )}
                    </div>

                    {/* C. Vertical RAM Slots Array (Right-Center) */}
                    <div 
                      onClick={() => { playSound('click'); setSelectedPartId('ram'); }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'ram') setHoveredMotherboardSlot('ram');
                      }}
                      onDragLeave={() => setHoveredMotherboardSlot(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'ram') handleInstallPart('ram');
                        setHoveredMotherboardSlot(null);
                      }}
                      className="absolute top-[8%] left-[78%] w-12 h-32 flex justify-between items-center gap-1 cursor-pointer group"
                    >
                      {/* Slots Visual lines */}
                      {[1, 2].map((slotNum) => {
                        const isPlaced = parts.find(p => p.id === 'ram')?.placed;
                        const isChosen = selectedPartId === 'ram';
                        return (
                          <div 
                            key={slotNum}
                            className={`w-3.5 h-full rounded border flex flex-col justify-between py-1 transition ${
                              isPlaced && slotNum === 2
                                ? 'bg-indigo-950 border-emerald-500'
                                : isChosen
                                ? 'border-cyan-400 animate-pulse bg-cyan-400/5'
                                : hoveredMotherboardSlot === 'ram'
                                ? 'border-cyan-300 bg-indigo-500/20'
                                : 'bg-slate-950 border-zinc-800'
                            }`}
                          >
                            {/* Latches */}
                            <div className={`w-full h-1 bg-slate-700 ${isPlaced && slotNum === 2 ? 'bg-emerald-500' : ''}`}></div>
                            
                            {isPlaced && slotNum === 2 ? (
                              <div className="flex-1 w-full bg-emerald-950 flex flex-col justify-center items-center overflow-hidden">
                                <span className="text-[6px] font-mono font-bold text-emerald-400 rotate-90 whitespace-nowrap">RAM DDR5</span>
                              </div>
                            ) : (
                              <div className="flex-1 w-full flex justify-center items-center">
                                <div className="w-0.5 h-4/5 bg-zinc-900 border-dashed border-zinc-800"></div>
                              </div>
                            )}

                            <div className={`w-full h-1 bg-slate-700 ${isPlaced && slotNum === 2 ? 'bg-emerald-500' : ''}`}></div>
                          </div>
                        );
                      })}
                      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] font-semibold text-slate-400 block whitespace-nowrap">RAM_SLOT</span>
                    </div>

                    {/* D. M.2 SSD Horizontal Socket (Middle) */}
                    <div 
                      onClick={() => { playSound('click'); setSelectedPartId('storage'); }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'storage') setHoveredMotherboardSlot('storage');
                      }}
                      onDragLeave={() => setHoveredMotherboardSlot(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'storage') handleInstallPart('storage');
                        setHoveredMotherboardSlot(null);
                      }}
                      className={`absolute top-[52%] left-[45%] -translate-x-1/2 w-44 h-8 rounded-lg cursor-pointer border flex items-center px-1.5 transition ${
                        parts.find(p => p.id === 'storage')?.placed
                          ? 'bg-slate-900/80 border-emerald-500'
                          : selectedPartId === 'storage'
                          ? 'bg-indigo-650/35 border-cyan-400 animate-pulse'
                          : hoveredMotherboardSlot === 'storage'
                          ? 'bg-indigo-500/30 border-cyan-300'
                          : 'bg-slate-950 border-dashed border-indigo-500/10 hover:border-indigo-400'
                      }`}
                    >
                      {parts.find(p => p.id === 'storage')?.placed ? (
                        <div className="w-full h-full py-0.5">
                          {renderRealisticPartSVG('storage', true)}
                        </div>
                      ) : (
                        <div className="w-full h-full flex justify-between items-center text-[8px] px-2 text-indigo-400/40 font-bold">
                          <span>M.2 SSD شق</span>
                          <span>M2_CONNECTOR</span>
                        </div>
                      )}
                    </div>

                    {/* E. PCIe x16 GPU Horizontal Channel (Lower half) */}
                    <div 
                      onClick={() => { playSound('click'); setSelectedPartId('gpu'); }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'gpu') setHoveredMotherboardSlot('gpu');
                      }}
                      onDragLeave={() => setHoveredMotherboardSlot(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'gpu') handleInstallPart('gpu');
                        setHoveredMotherboardSlot(null);
                      }}
                      className={`absolute top-[70%] left-[50%] -translate-x-1/2 w-56 h-14 rounded-xl cursor-pointer border flex flex-col justify-center transition-all ${
                        parts.find(p => p.id === 'gpu')?.placed
                          ? 'border-emerald-500 bg-slate-950/20'
                          : selectedPartId === 'gpu'
                          ? 'bg-indigo-650/40 border-cyan-400 animate-pulse shadow-md shadow-cyan-400/20'
                          : hoveredMotherboardSlot === 'gpu'
                          ? 'bg-indigo-500/30 border-cyan-300'
                          : 'bg-slate-950 border-dashed border-indigo-500/10 hover:border-indigo-400'
                      }`}
                    >
                      {parts.find(p => p.id === 'gpu')?.placed ? (
                        <div className="w-full h-full py-1">
                          {renderRealisticPartSVG('gpu', true, isAssemblyComplete)}
                        </div>
                      ) : (
                        <div className="w-full text-center p-1.5 text-indigo-400/30 font-bold">
                          <span className="text-[8px] block">شق بطاقة الرسوميات السريع GPU PCIe 4.0</span>
                          <span className="text-[7px] font-mono block text-indigo-400/20">PCIEX16_GPU_SLOT</span>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Sliding Tutorial Hand Guide */}
                  {!parts.find(p => p.id === 'cpu')?.placed && !draggingPartId && (
                    <div className="absolute inset-0 pointer-events-none z-30 select-none hidden lg:block overflow-hidden">
                      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-full h-full flex items-center justify-center">
                        <div className="relative animate-cpu-guide flex flex-col items-center">
                          {/* Held CPU Preview */}
                          <div className="w-14 h-14 bg-slate-900 border-2 border-cyan-400 rounded-xl p-1 shadow-lg shadow-cyan-400/30">
                            {renderRealisticPartSVG('cpu')}
                          </div>
                          {/* Hand Icon pointer */}
                          <div className="flex flex-col items-center -mt-2">
                            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] fill-current" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2a1 1 0 0 1 .993.883L13 3v4.3h1.3a1 1 0 0 1 .117 1.993l-.117.007H13v1.3a1 1 0 0 1 1.993.117l.007-.117v-1.3h1.4a1 1 0 0 1 .117 1.993l-.117.007H15v1.3a1 1 0 0 1 1.993.117l.007-.117v-1.3H18a1 1 0 0 1 .117 1.993L18 15h-.8l-.133.007a3.5 3.5 0 0 1-3.232 2.622l-.135.004H9.3l-.17-.005a3.5 3.5 0 0 1-3.117-2.317l-.046-.145L4.1 11.2a1.5 1.5 0 0 1 .455-1.74l.115-.084a1.5 1.5 0 0 1 1.765.1l1.565 1.224V3a1 1 0 0 1 .117-1.993L10 3v4.3h1V3a1 1 0 0 1 .883-.993L12 2z"/>
                            </svg>
                            <span className="bg-slate-950/95 text-cyan-400 font-bold text-[9px] px-2.5 py-0.5 rounded border border-cyan-400 -mt-1 shadow-md whitespace-nowrap">
                              اسحب المعالج برفق وضعه هنا
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Micro capacitors details block at the bottom */}
                <div className="bg-slate-950/50 p-2 text-[9px] font-mono text-zinc-400 flex justify-between rounded-xl border border-indigo-950">
                  <span>CAPS_HEALTH: OK</span>
                  <span>ICT_CURRICULUM_GRADE_6_SUDAN</span>
                  <span>TEMP: 32°C</span>
                </div>
              </div>

              {/* Left Column: "علبة العتاد والقطع" (Components Palette) - Col: 3 */}
              <div className="lg:col-span-3 bg-slate-900/40 border border-indigo-500/10 p-4 rounded-3xl flex flex-col justify-between space-y-4 lg:order-3">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-indigo-300 text-xs flex items-center gap-1.5 pb-2 border-b border-indigo-500/10">
                    <span>📦 علبة العتاد والقطع:</span>
                  </h4>
                  <p className="text-[10px] text-indigo-300/80 leading-relaxed font-bold">
                    انقر على المكون بالأسفل أو اسحبه برفق لتثبيته في اللوحة الأم:
                  </p>
                  
                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {parts.map((p) => (
                      <div
                        key={p.id}
                        draggable={!p.placed}
                        onDragStart={() => {
                          setDraggingPartId(p.id);
                          setSelectedPartId(p.id);
                          playSound('click');
                        }}
                        onDragEnd={() => setDraggingPartId(null)}
                        onClick={() => {
                          playSound('click');
                          setSelectedPartId(p.id);
                        }}
                        className={`p-3.5 rounded-2xl border transition duration-150 transform active:scale-98 flex items-center justify-between gap-3 cursor-pointer ${
                          p.placed 
                            ? 'bg-slate-955 border-indigo-900/30 text-indigo-400/60 opacity-55' 
                            : selectedPartId === p.id 
                            ? 'bg-indigo-650/30 text-white border-cyan-400 ring-1 ring-cyan-400'
                            : 'bg-slate-900/70 hover:bg-slate-800 border-indigo-500/10 text-slate-200'
                        }`}
                      >
                        {/* Real-life vector thumbnail preview */}
                        <div className="w-11 h-11 bg-slate-950 p-1.5 rounded-xl border border-indigo-500/10 shrink-0">
                          {renderRealisticPartSVG(p.id)}
                        </div>

                        {/* Title details */}
                        <div className="flex-1 text-right min-w-0">
                          <h5 className="font-extrabold text-[11px] truncate text-slate-100 flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.placed ? (
                              <span className="text-emerald-400 font-bold shrink-0 text-[10px]">✓</span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                            )}
                          </h5>
                          <span className="text-[9px] block text-indigo-300/80 font-bold tracking-tight">
                            {p.placed ? 'تم التركيب بنجاح' : 'متاح للسحب والتركيب'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-950/40 p-3 rounded-2xl text-[9px] text-zinc-300 border border-indigo-500/10 leading-relaxed font-bold flex gap-1.5 items-center font-bold">
                  <span className="text-base">🖐️</span>
                  <span>تستطيع سحب القطع مباشرة وإسقاطها داخل الدوائر ومسارات اللوحة الأم!</span>
                </div>
              </div>

            </div>
          )}

          {/* 2. BOOTING SCREEN DIAGNOSTICS LOG */}
          {labState === 'booting' && (
            <div className="bg-black border-2 border-slate-700 p-6 sm:p-10 rounded-[35px] text-left font-mono text-xs sm:text-sm text-lime-400 min-h-[400px] flex flex-col justify-between shadow-2xl relative">
              <div className="absolute top-4 right-6 text-[10px] text-red-500 animate-pulse font-extrabold">
                ● LIVE BOOT DIAGNOSTIC
              </div>
              
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto select-text font-medium">
                <div className="text-slate-300 border-b border-slate-800 pb-2 mb-4 font-bold flex justify-between">
                  <span>SUDAN SHIELD BIOS V6.22-RELEASE</span>
                  <span>TIME: {new Date().toLocaleTimeString()}</span>
                </div>
                
                {bootLogs.map((log, index) => (
                  <div key={index} className="animate-fadeIn leading-relaxed text-right" dir="rtl">
                    <span className="text-indigo-400 shrink-0 font-bold ml-1">✓</span> {log}
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>جاري معالجة التحميل المادي للذاكرة BIOS SECURE BOOT (مكافأة +30 XP)</span>
                  <span>{Math.round(bootProgress)}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-lime-500 progress-bar-glow duration-300"
                    style={{ width: `${bootProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* 3. VIRTUAL OPERATING SYSTEMS SELECTOR MENU */}
          {labState === 'os_menu' && (
            <div className="space-y-6 text-right animate-fadeIn">
              <div className="bg-slate-900 border border-indigo-500/20 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow">
                <div className="space-y-2 max-w-xl">
                  <h4 className="font-extrabold text-cyan-400 text-base">حاسوبك الآن جاهز للعمل بالكامل! 🌟</h4>
                  <p className="text-xs text-indigo-200 leading-relaxed font-semibold">
                    لقد قمت بتثبيت العتاد الفيزيائي بنجاح (المعالج، المروحة، الرام، مزود الطاقة، وكرت الشاشة). الآن جرب الإقلاع (Boot) واختبار البرمجيات الوهمية الثلاثة المقررة بالمنهج لتفهم الفرق بين أنظمة التشغيل الرسومية والنصية!
                  </p>
                </div>
                <div className="bg-indigo-950 p-4 rounded-2xl border border-indigo-500/30 text-center text-xs shrink-0 font-extrabold text-white">
                  <span>نقاط السجل العتادي:</span>
                  <span className="block text-2xl font-black text-yellow-400 mt-1">+45 XP ⭐</span>
                </div>
              </div>

              <h4 className="font-black text-white text-sm border-b border-indigo-900 pb-2">اختر نظام التشغيل الوهمي للإقلاع إليه:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* OS 1: MS-DOS */}
                <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-6 hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between space-y-4 group">
                  <div className="space-y-3">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-center text-3xl group-hover:scale-105 duration-200 select-none font-mono font-bold text-emerald-400">
                      C:\&gt;_
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-lime-400 font-extrabold block">بيئة نصية كلاسيكية (Command-Line)</span>
                      <h4 className="font-extrabold text-white text-base">نظام القرص دوس MS-DOS 💻</h4>
                      <p className="text-[11px] text-indigo-300 leading-relaxed font-bold">
                        النظام النصي الشهير الذي استخدمته الحواسيب قبل اختراع الفأرة والواجهات الرسومية. يعتمد على كتابة الأوامر مباشرة لتهيئة السيرفر.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { playSound('boot'); setLabState('dos'); }}
                    className="w-full bg-slate-950 border border-emerald-500/40 text-emerald-400 font-black text-xs py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-transparent transition"
                  >
                    الإقلاع لنظام MS-DOS ←
                  </button>
                </div>

                {/* OS 2: Microsoft Windows */}
                <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-6 hover:border-blue-500 transition-all duration-300 flex flex-col justify-between space-y-4 group">
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-indigo-700 via-blue-600 to-pink-500 rounded-2xl p-4 flex items-center justify-center text-3xl group-hover:scale-105 duration-200 select-none text-white">
                      🗔
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-cyan-400 font-extrabold block">بيئة رسومية بديهية (GUI-Windows)</span>
                      <h4 className="font-extrabold text-white text-base">ميكروسوفت ويندوز Windows 🗔</h4>
                      <p className="text-[11px] text-indigo-300 leading-relaxed font-bold">
                        أشهر نظام تشغيل رسومي بالعالم. يعتمد على النوافذ، الألوان، والفأرة. يتضمن برامج المفكرة، الآلة الحاسبة، والرسام التفاعلي.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { playSound('boot'); setLabState('windows'); }}
                    className="w-full bg-indigo-650 text-white font-black text-xs py-2.5 rounded-xl hover:bg-indigo-500 hover:scale-103 transition"
                  >
                    الإقلاع لنظام Windows ←
                  </button>
                </div>

                {/* OS 3: GNU/Linux */}
                <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-6 hover:border-pink-500 transition-all duration-300 flex flex-col justify-between space-y-4 group">
                  <div className="space-y-3">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-center text-3xl group-hover:scale-105 duration-200 select-none">
                      🍏🐧
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-pink-400 font-extrabold block">بيئة مصادر مفتوحة (Open Source-Shell)</span>
                      <h4 className="font-extrabold text-white text-base">نظام تشغيل لينكس Linux 🐧</h4>
                      <p className="text-[11px] text-indigo-300 leading-relaxed font-bold">
                        نظام تشغيل رائد وقوي لإدارة سيرفرات الويب والعملاقة الموفرة للأمن والمصادر المفتوحة. تعرف على أوامر الطرفية Bash Shell.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { playSound('boot'); setLabState('linux'); }}
                    className="w-full bg-slate-950 border border-pink-500/40 text-pink-400 font-black text-xs py-2.5 rounded-xl hover:bg-pink-600 hover:text-white hover:border-transparent transition"
                  >
                    الإقلاع لنظام Linux Bash Shell ←
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* 4. ACTIVE OS ENVIRONMENT SYSTEM: MS-DOS */}
          {labState === 'dos' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-2xl border border-indigo-500/10">
                <button
                  onClick={() => { playSound('click'); setLabState('os_menu'); }}
                  className="bg-slate-950 border border-indigo-500/30 text-indigo-300 text-xs py-1.5 px-4 rounded-xl font-bold flex items-center gap-1.5 hover:text-white transition"
                >
                  <ArrowLeft className="w-4 h-4 ml-1" />
                  <span>العودة لقائمة الأنظمة (OS List)</span>
                </button>
                <div className="text-right">
                  <span className="text-[10px] text-cyan-400 font-extrabold">بيئة سطر الأوامر DOS</span>
                  <h4 className="font-extrabold text-white text-xs">Microsoft DOS Terminal Pro</h4>
                </div>
              </div>

              <div className="bg-black text-emerald-400 p-5 rounded-[25px] font-mono text-xs sm:text-sm text-left h-[330px] overflow-y-auto select-text shadow-inner flex flex-col justify-between border-2 border-slate-700">
                <div className="space-y-1.5">
                  {dosConsole.map((line, i) => (
                    <div key={i} className="leading-relaxed whitespace-pre-wrap">{line}</div>
                  ))}
                </div>
                
                <form onSubmit={handleDosSubmit} className="mt-4 flex border-t border-slate-800 pt-2 items-center text-left" dir="ltr">
                  <span className="text-slate-200 shrink-0 select-none mr-1">C:\&gt;</span>
                  <input
                    type="text"
                    value={dosInput}
                    onChange={(e) => setDosInput(e.target.value)}
                    className="bg-transparent text-emerald-400 border-none outline-none focus:outline-none flex-1 font-mono px-1 border-transparent focus:ring-0 text-left shrink-0"
                    placeholder="Type HELP and press Enter..."
                    autoFocus
                  />
                </form>
              </div>

              <div className="bg-slate-900 border border-indigo-500/10 p-3.5 rounded-2xl text-[11px] text-indigo-300 text-right leading-relaxed font-bold">
                💡 <span className="text-cyan-400">تلميح مهارات العتاد:</span> اكتب <span className="font-mono text-white text-[12px] bg-black px-1.5 py-0.5 rounded">NEOFETCH</span> لإظهار معلومات الحاسوب الذي قمت بتجميعه بنفسك، أو اكتب <span className="font-mono text-white text-[12px] bg-black px-1.5 py-0.5 rounded">TYPE LESSON.TXT</span> لمراجعة شرح لوحة الأم!
              </div>
            </div>
          )}

          {/* 5. ACTIVE OS ENVIRONMENT SYSTEM: WINDOWS */}
          {labState === 'windows' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Backbar option */}
              <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-2xl border border-indigo-500/10">
                <button
                  onClick={() => { playSound('click'); setLabState('os_menu'); }}
                  className="bg-slate-950 border border-indigo-500/30 text-indigo-300 text-xs py-1.5 px-4 rounded-xl font-bold flex items-center gap-1.5 hover:text-white transition"
                >
                  <ArrowLeft className="w-4 h-4 ml-1" />
                  <span>العودة لقائمة الأنظمة (OS Menu)</span>
                </button>
                
                {/* Wallpaper controls */}
                <div className="flex items-center gap-2 text-xs text-white">
                  <span className="text-[10px] text-indigo-300 font-bold">تغيير الخلفية:</span>
                  <button 
                    onClick={() => { playSound('click'); setWinWallpaper('aurora'); }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-pink-500 border ${winWallpaper === 'aurora' ? 'border-white scale-125' : 'border-slate-800'}`}
                  />
                  <button 
                    onClick={() => { playSound('click'); setWinWallpaper('cyber'); }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-r from-purple-800 to-slate-900 border ${winWallpaper === 'cyber' ? 'border-white scale-125' : 'border-slate-800'}`}
                  />
                  <button 
                    onClick={() => { playSound('click'); setWinWallpaper('nile'); }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-800 border ${winWallpaper === 'nile' ? 'border-white scale-125' : 'border-slate-800'}`}
                  />
                </div>
              </div>

              {/* Windows desktop screen */}
              <div className={`rounded-[30px] border-4 border-slate-800 min-h-[420px] relative flex flex-col justify-between overflow-hidden p-4 select-none ${getWallpaperClasses()}`}>
                
                {/* Icons Grid on desktop */}
                <div className="flex flex-col gap-5 text-center items-start justify-start z-10 p-2 text-white font-extrabold text-[10px]" dir="ltr">
                  
                  {/* File icon: Notepad */}
                  <button 
                    onClick={() => { playSound('click'); setWinOpenApp('notepad'); }}
                    className="flex flex-col items-center bg-white/5 hover:bg-white/15 active:scale-95 transition-all p-2 rounded-2xl w-16"
                  >
                    <FileText className="w-8 h-8 text-blue-200" />
                    <span className="mt-1 font-bold line-clamp-1 drop-shadow-md">المفكرة</span>
                  </button>

                  {/* Calculator icon */}
                  <button 
                    onClick={() => { playSound('click'); setWinOpenApp('calculator'); }}
                    className="flex flex-col items-center bg-white/5 hover:bg-white/15 active:scale-95 transition-all p-2 rounded-2xl w-16 mt-1"
                  >
                    <Calculator className="w-8 h-8 text-amber-200" />
                    <span className="mt-1 font-bold line-clamp-1 drop-shadow-md">الحاسبة</span>
                  </button>

                  {/* Paint icon */}
                  <button 
                    onClick={() => { playSound('click'); setWinOpenApp('paint'); }}
                    className="flex flex-col items-center bg-white/5 hover:bg-white/15 active:scale-95 transition-all p-2 rounded-2xl w-16 mt-1"
                  >
                    <Palette className="w-8 h-8 text-pink-300 animate-pulse" />
                    <span className="mt-1 font-bold line-clamp-1 drop-shadow-md">الرسام</span>
                  </button>
                </div>

                {/* Simulated Floating Windows App */}
                {winOpenApp !== 'none' && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-slate-300 z-20 overflow-hidden text-right animate-fadeIn" dir="rtl">
                    
                    {/* App Bar title */}
                    <div className="bg-slate-100 px-4 py-2 flex justify-between items-center text-slate-800 font-extrabold border-b">
                      <div className="flex items-center gap-1.5 text-xs">
                        {winOpenApp === 'notepad' && <FileText className="w-4 h-4 text-blue-605" />}
                        {winOpenApp === 'calculator' && <Calculator className="w-4 h-4 text-amber-605" />}
                        {winOpenApp === 'paint' && <Palette className="w-4 h-4 text-pink-505" />}
                        <span>
                          {winOpenApp === 'notepad' && 'برنامج المفكرة (Notepad)'}
                          {winOpenApp === 'calculator' && 'الآلة الحاسبة التعليمية (Calculator)'}
                          {winOpenApp === 'paint' && 'برنامج الرسام المدرسي (Paint 3D Grid)'}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => { playSound('laser'); setWinOpenApp('none'); }}
                        className="w-5 h-5 bg-rose-100 text-rose-700 font-bold hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>

                    {/* App Window Content body */}
                    <div className="p-4 text-slate-800">
                      
                      {/* Sub-app 1: Notepad */}
                      {winOpenApp === 'notepad' && (
                        <div className="space-y-3 font-semibold">
                          <textarea
                            className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs h-32 focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold placeholder:text-slate-450"
                            value={notepadText}
                            onChange={(e) => setNotepadText(e.target.value)}
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={handleSaveNotepad}
                              className="bg-blue-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl hover:bg-blue-500 transition shadow flex items-center gap-1.5 cursor-pointer"
                            >
                              <Save className="w-4 h-4" />
                              <span>حفظ بالنواة الافتراضية 💾</span>
                            </button>
                          </div>
                          
                          {savedNotepads && (
                            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 rounded-xl leading-relaxed">
                              📂 <span className="font-extrabold">المستند النشط المحفوظ:</span> "{savedNotepads}"
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sub-app 2: Calculator */}
                      {winOpenApp === 'calculator' && (
                        <div className="max-w-[240px] mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 font-semibold">
                          
                          {/* Formula and Screen */}
                          <div className="bg-slate-900 text-white p-3.5 rounded-xl font-mono text-right text-base font-extrabold">
                            <div className="text-[10px] text-slate-400 h-4 leading-none mb-1">{calcFormula}</div>
                            <div>{calcDisplay}</div>
                          </div>

                          {/* Grid numbers */}
                          <div className="grid grid-cols-4 gap-1.5 text-xs font-black font-sans">
                            {['C', '←', '÷', '×', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0'].map((btn) => (
                              <button
                                key={btn}
                                onClick={() => runCalcAction(btn)}
                                className={`py-2 rounded-lg transition text-center text-xs active:scale-95 ${
                                  btn === '=' ? 'bg-indigo-600 text-white hover:bg-indigo-500 col-span-2' :
                                  ['C', '←', '÷', '×', '-', '+'].includes(btn) ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' :
                                  'bg-white text-slate-800 border hover:bg-slate-100 shadow-sm'
                                }`}
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-app 3: Paint Grid (Pixel Paint) */}
                      {winOpenApp === 'paint' && (
                        <div className="space-y-4 text-center font-semibold text-xs text-slate-700">
                          <p className="text-[10px] leading-relaxed block mb-1">
                            🎨 اختر لوناً من المربعات التالية، ثم اضغط على خلايا الشبكة أدناه لتصميم أعمال بكسل فنية مذهلة!
                          </p>
                          
                          {/* Color Palette selectors */}
                          <div className="flex gap-2 justify-center items-center">
                            {['#3b82f6', '#10b981', '#f43f5e', '#eab308', '#a855f7', '#0f172a'].map((col) => (
                              <button
                                key={col}
                                onClick={() => { playSound('click'); setPaintSelectedColor(col); }}
                                className={`w-6 h-6 rounded-full transition-all border-2 ${
                                  paintSelectedColor === col ? 'border-slate-800 scale-125 shadow-md' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: col }}
                              />
                            ))}
                            
                            <button
                              onClick={() => {
                                playSound('click');
                                setPaintGrid(Array(12).fill(null).map(() => Array(12).fill('#ffffff')));
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-[10px] font-black border px-2.5 py-1 rounded-lg mr-2 text-rose-600 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>مسح اللوحة</span>
                            </button>
                          </div>

                          {/* Grid drawing area */}
                          <div className="border border-slate-300 p-2.5 rounded-2xl bg-slate-50 inline-block mx-auto max-w-[250px]">
                            <div className="grid grid-cols-12 gap-0.5" style={{ width: '192px', height: '192px' }}>
                              {paintGrid.map((row, rIdx) => 
                                row.map((cellColor, cIdx) => (
                                  <div
                                    key={`${rIdx}-${cIdx}`}
                                    onClick={() => {
                                      playSound('success');
                                      const newGrid = [...paintGrid];
                                      newGrid[rIdx][cIdx] = paintSelectedColor;
                                      setPaintGrid(newGrid);
                                      onEmitPoints(1); // Give micro point for painting!
                                    }}
                                    className="w-4 h-4 border border-slate-100 hover:opacity-80 transition-all cursor-pointer"
                                    style={{ backgroundColor: cellColor }}
                                  />
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* Taskbar with Start icon and Clock */}
                <div className="w-full bg-slate-900/80 backdrop-blur border-t border-white/20 p-2 rounded-2xl flex justify-between items-center text-white text-[11px] font-black shrink-0 relative mt-auto z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">١١:٣٠ م</span>
                    <span className="text-emerald-400">● مجمع بالكامل</span>
                  </div>
                  
                  {/* Apps launching shortcuts on taskbar */}
                  <div className="flex gap-3 justify-center text-base">
                    <span 
                      onClick={() => { playSound('click'); setWinOpenApp('notepad'); }}
                      className="cursor-pointer hover:bg-white/10 p-1.5 rounded"
                    >
                      📝
                    </span>
                    <span 
                      onClick={() => { playSound('click'); setWinOpenApp('calculator'); }}
                      className="cursor-pointer hover:bg-white/10 p-1.5 rounded"
                    >
                      🔢
                    </span>
                    <span 
                      onClick={() => { playSound('click'); setWinOpenApp('paint'); }}
                      className="cursor-pointer hover:bg-white/10 p-1.5 rounded"
                    >
                      🎨
                    </span>
                  </div>

                  {/* Windows start button */}
                  <button 
                    onClick={() => { 
                      playSound('success'); 
                      alert('مرحبا بك في ويندوز! لقد صمم عثمان المنقوري هذا المعمل لتجربة عتاد الحاسب وتطبيقات الرسام والمفكرة والآلة الحاسبة بشكل وهمي كامل.');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-3 py-1 text-white font-extrabold text-[10px] flex items-center gap-1 shadow cursor-pointer active:scale-95"
                  >
                    <span>البدء (Start)</span>
                    <span>🇸🇩</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* 6. ACTIVE OS ENVIRONMENT SYSTEM: LINUX */}
          {labState === 'linux' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-2xl border border-indigo-500/10">
                <button
                  onClick={() => { playSound('click'); setLabState('os_menu'); }}
                  className="bg-slate-950 border border-indigo-500/30 text-indigo-300 text-xs py-1.5 px-4 rounded-xl font-bold flex items-center gap-1.5 hover:text-white transition"
                >
                  <ArrowLeft className="w-4 h-4 ml-1" />
                  <span>العودة لقائمة الأنظمة (OS Menu)</span>
                </button>
                <div className="text-right">
                  <span className="text-[10px] text-pink-400 font-extrabold">الطرفية المفتوحة المصدر Linux Terminal</span>
                  <h4 className="font-extrabold text-white text-xs">GNU/Linux Bash Shell Simulation</h4>
                </div>
              </div>

              {/* Terminal Screen box */}
              <div className="bg-[#0b0f19] text-pink-400 p-5 rounded-[25px] font-mono text-xs sm:text-sm text-left h-[330px] overflow-y-auto select-text shadow-xl flex flex-col justify-between border-2 border-pink-500/30">
                <div className="space-y-1.5 text-left" dir="ltr">
                  {linuxConsole.map((line, i) => {
                    const isPrompt = line.startsWith('root@sudan-ict-student:~$ ');
                    const cleanText = isPrompt ? line.substring(26) : line;
                    return (
                      <div key={i} className="leading-relaxed whitespace-pre-wrap">
                        {isPrompt ? (
                          <span>
                            <span className="text-emerald-400 font-bold">root@sudan-ict-student</span>
                            <span className="text-white font-bold">:</span>
                            <span className="text-indigo-400 font-bold">~</span>
                            <span className="text-white font-bold">$</span> {cleanText}
                          </span>
                        ) : (
                          <span className="text-slate-200">{line}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <form onSubmit={handleLinuxSubmit} className="mt-4 flex border-t border-slate-800 pt-2 items-center text-left" dir="ltr">
                  <span className="text-emerald-400 font-bold shrink-0 select-none">root@sudan-ict-student</span>
                  <span className="text-white font-bold shrink-0 select-none">:</span>
                  <span className="text-indigo-400 font-bold shrink-0 select-none">~</span>
                  <span className="text-white font-bold shrink-0 select-none">$</span>
                  <input
                    type="text"
                    value={linuxInput}
                    onChange={(e) => setLinuxInput(e.target.value)}
                    className="bg-transparent text-slate-100 border-none outline-none focus:outline-none flex-1 font-mono px-1 border-transparent focus:ring-0 text-left shrink-0 ml-1"
                    placeholder="Type help and press Enter..."
                    autoFocus
                  />
                </form>
              </div>

              {/* Tips caption */}
              <div className="bg-slate-900 border border-indigo-500/10 p-3.5 rounded-2xl text-[11px] text-indigo-300 text-right leading-relaxed font-bold">
                🐧 <span className="text-pink-400">تلميح تجربة سودانية:</span> جرب كتابة الأمر <span className="font-mono text-white text-[12px] bg-slate-950 px-1.5 py-0.5 rounded">neofetch</span> لمشاهدة شعار أنظمة مفتوحة المصدر والعتاد والتحليلات بالكامل، أو اكتب <span className="font-mono text-white text-[12px] bg-slate-950 px-1.5 py-0.5 rounded">cat welcome.md</span> لقراءة أهم ميزات لينكس!
              </div>

            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="bg-slate-950 border-t border-indigo-500/10 p-3 px-6 shrink-0 text-center text-[10px] md:text-xs text-indigo-300 font-semibold select-none flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <p className="text-cyan-400 font-bold text-[10px]">اللوحة الأم الفيزيائية والمعالج عصب الحساب لمستقبل تكنولوجيا السودان 🇸🇩</p>
          <p>جميع حقوق المحاكاة للقطع والبرمجيات محفوظة بالمنصة</p>
        </div>

      </div>
    </div>
  );
};
