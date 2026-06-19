import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Sun,
  Cable,
  Snowflake
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
    case 'cooler':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Base plate block (copper color) */}
          <rect x="25" y="25" width="50" height="50" rx="4" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
          {/* Silver metallic fins grid overlay */}
          <g stroke="#94a3b8" strokeWidth="1.5">
            {[30, 35, 40, 45, 50, 55, 60, 65, 70].map((x) => (
              <line key={x} x1={x} y1="20" x2={x} y2="80" />
            ))}
          </g>
          {/* Heat pipes (copper loops extending out) */}
          <path d="M 25 35 C 10 35, 10 65, 25 65" fill="none" stroke="#ea580c" strokeWidth="3" />
          <path d="M 75 35 C 90 35, 90 65, 75 65" fill="none" stroke="#ea580c" strokeWidth="3" />
          {/* Mounting brackets (silver) */}
          <rect x="20" y="47" width="10" height="6" rx="1" fill="#cbd5e1" stroke="#475569" />
          <rect x="70" y="47" width="10" height="6" rx="1" fill="#cbd5e1" stroke="#475569" />
          <circle cx="25" cy="50" r="1.5" fill="#475569" />
          <circle cx="75" cy="50" r="1.5" fill="#475569" />
          {/* Small cooler brand center badge */}
          <circle cx="50" cy="50" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
          <text x="50" y="52" fill="#38bdf8" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">COOL</text>
        </svg>
      );
    case 'sata':
      return (
        <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-sm">
          {/* Red SATA flexible flat cable path */}
          <path d="M 10 30 C 35 10, 65 50, 90 30" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
          {/* Black connector heads on ends */}
          <g fill="#18181b" stroke="#374151" strokeWidth="0.5">
            {/* Left head */}
            <rect x="4" y="22" width="12" height="16" rx="1" transform="rotate(-15 10 30)" />
            {/* Right head with L-shape notch indication */}
            <rect x="84" y="22" width="12" height="16" rx="1" transform="rotate(15 90 30)" />
          </g>
          {/* Silver lock latch clips */}
          <rect x="8" y="27" width="4" height="6" rx="0.5" fill="#e2e8f0" transform="rotate(-15 10 30)" />
          <rect x="88" y="27" width="4" height="6" rx="0.5" fill="#e2e8f0" transform="rotate(15 90 30)" />
          {/* Small text flag */}
          <text x="50" y="15" fill="#f43f5e" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">SATA L-Type</text>
        </svg>
      );
    default:
      return null;
  }
};

const INSTALL_ORDER = ['cpu', 'cooler', 'fan', 'ram', 'storage', 'gpu', 'sata', 'psu'];

export const ComputerAssemblyLab: React.FC<ComputerAssemblyLabProps> = ({
  stats,
  onEmitPoints,
  onEmitAchievement,
  onClose
}) => {
  // Sound generator using Web Audio API
  const playSound = (soundType: 'success' | 'click' | 'laser' | 'fail' | 'boot' | 'fan' | 'ram_click' | 'boot_success') => {
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
      } else if (soundType === 'ram_click') {
        // Realistic plastic & metal latch lock double-click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);

        // Second slightly lower latch click 40ms later
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(950, ctx.currentTime + 0.045);
        osc2.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.085);
        gain2.gain.setValueAtTime(0.10, ctx.currentTime + 0.045);
        gain2.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.085);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime + 0.045);
        osc2.stop(ctx.currentTime + 0.085);
      } else if (soundType === 'boot_success') {
        // Melodic and energetic electronic 16-bit upbeat major chord boot success sound
        const notes = [
          { freq: 440.00, time: 0 },      // A4
          { freq: 554.37, time: 0.08 },   // C#5
          { freq: 659.25, time: 0.16 },   // E5
          { freq: 880.00, time: 0.24 },   // A5
          { freq: 1109.73, time: 0.32 },  // C#6
          { freq: 1318.51, time: 0.40 }   // E6
        ];
        
        notes.forEach((note) => {
          const nOsc = ctx.createOscillator();
          const nGain = ctx.createGain();
          nOsc.type = 'sine';
          nOsc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
          
          nGain.gain.setValueAtTime(0.06, ctx.currentTime + note.time);
          nGain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + note.time + 0.3);
          
          nOsc.connect(nGain);
          nGain.connect(ctx.destination);
          
          nOsc.start(ctx.currentTime + note.time);
          nOsc.stop(ctx.currentTime + note.time + 0.3);
        });
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

  // Speaks helper instructions out loud using Web Speech synthesis or logs appropriately
  const speakPhrase = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(v => v.lang.toLowerCase().includes('ar'));
      if (arVoice) {
        utterance.voice = arVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("TTS Speech Synthesis warning: ", err);
    }
  };

  // Lab Tab states: 'assembly' | 'booting' | 'os_menu' | 'dos' | 'windows' | 'linux'
  const [labState, setLabState] = useState<'assembly' | 'booting' | 'os_menu' | 'dos' | 'windows' | 'linux'>('assembly');

  // Hardcoded initial motherboard parts matching the curriculum requirements exactly
  const [parts, setParts] = useState<ComponentPart[]>([
    {
      id: 'cpu',
      name: 'المعالج (CPU)',
      englishName: 'CPU (Processor)',
      desc: 'وحدة المعالجة المركزية هي عقل المعالجة المفكر ومحلل جميع البيانات والأوامر البرمجية.',
      role: 'تقوم بمسك ونقل الأوامر البرمجية ومعالجة البيانات الحسابية الأساسية للجهاز لتشغيل البرامج.',
      placed: false,
      icon: 'Cpu',
      color: 'from-amber-400/20 to-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
    },
    {
      id: 'cooler',
      name: 'مشتت الحرارة (CPU Cooler)',
      englishName: 'CPU Heatsink / Cooler',
      desc: 'مشتت الحرارة (Heatsink) هو المبدد المعدني الأساسي الذي يمتص الحرارة الشديدة مباشرة من سطح المعالج.',
      role: 'يقوم بنقل وتوزيع الطاقة الحرارية الضخمة المنبعثة من المعالج نحو الزعانف المعدنية ليتم طردها عبر مروحة التبريد.',
      placed: false,
      icon: 'Snowflake',
      color: 'from-violet-400/20 to-violet-500/10 border-violet-500/30 text-violet-400 font-bold'
    },
    {
      id: 'fan',
      name: 'مروحة التبريد',
      englishName: 'Cooler Fan',
      desc: 'مروحة التبريد هي الدرع الواقي والمنظم الحراري الحصين لحماية المكونات من ارتفاع درجات الحرارة.',
      role: 'تأخذ الهواء الساخن الناجم عن الطاقة الكهربائية وتطرده بعيداً لضمان تشغيل صحي ومستقر للمعالج.',
      placed: false,
      icon: 'Activity',
      color: 'from-cyan-400/20 to-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold'
    },
    {
      id: 'ram',
      name: 'ذاكرة الوصول العشوائي (RAM)',
      englishName: 'RAM (Memory)',
      desc: 'ذاكرة الوصول العشوائي هي ذاكرة العمل المؤقتة فائقة السرعة التي تفقد بياناتها فور إطفاء الجهاز.',
      role: 'تحتفظ ببيانات التطبيقات والبرامج والملفات المفتوحة حالياً لتسهيل وسرعة معالجة المهام.',
      placed: false,
      icon: 'Sliders',
      color: 'from-emerald-400/20 to-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
    },
    {
      id: 'gpu',
      name: 'كرت الشاشة (GPU)',
      englishName: 'GPU (Graphics Card)',
      desc: 'كرت الشاشة هو المعالج المسؤول الأول عن إنتاج الرسوميات ومعالجة الفيديوهات وتلوين بكسلات العرض.',
      role: 'يقوم بتحويل الأكواد البرمجية إلى صور ملونة وتفاصيل وتأثيرات بصرية ورسومية مذهلة على الشاشة.',
      placed: false,
      icon: 'Monitor',
      color: 'from-fuchsia-400/20 to-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400 font-bold'
    },
    {
      id: 'storage',
      name: 'وحدة تخزين M.2 SSD',
      englishName: 'M.2 SSD (Storage)',
      desc: 'وحدة تخزين القرص السريع M.2 SSD هي مقر الحفظ الدائم والمستقر لكامل ملفاتك ونظام التشغيل البرمجي.',
      role: 'تقوم بتخزين واستدعاء نظام التشغيل والملفات والبرامج بشكل دائم حتى بعد فصل التيار الكهربائي.',
      placed: false,
      icon: 'Folder',
      color: 'from-blue-400/20 to-blue-500/10 border-blue-500/30 text-blue-400 font-bold'
    },
    {
      id: 'sata',
      name: 'كابلات البيانات (SATA Cables)',
      englishName: 'SATA Data Cables',
      desc: 'كابل بيانات SATA هو حلقة الوصل والممر المخصص لنقل سطور البيانات بسرعة وأمان بين مخازن الأقراص الصلبة ولوحة الأم.',
      role: 'نقل حزم الملفات والصور ونظام التشغيل بسرعة فائقة وبشكل تدفقي مذهل وآمن بين منافذ التخزين والمعالج.',
      placed: false,
      icon: 'Cable',
      color: 'from-rose-400/20 to-rose-500/10 border-rose-500/30 text-rose-400 font-bold'
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
  
  const nextRequiredPartId = INSTALL_ORDER.find(id => !parts.find(p => p.id === id)?.placed) || null;
  const isTargetedSlot = (slotName: string) => {
    if (!beginnerMode) return false;
    if (!nextRequiredPartId) return false;
    if (slotName === 'cpu' && ['cpu', 'cooler', 'fan'].includes(nextRequiredPartId)) return true;
    return slotName === nextRequiredPartId;
  };

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
  const [winWallpaper, setWinWallpaper] = useState<'aurora' | 'cyber' | 'nile' | 'sudan'>('sudan');
  const [winTime, setWinTime] = useState<string>('١٢:٠٠ م');
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

  // --- BEGINNER MODE & VOICE NAVIGATION STATES ---
  const [beginnerMode, setBeginnerMode] = useState<boolean>(false);
  const [speechActive, setSpeechActive] = useState<boolean>(true);
  const [speechSubtitle, setSpeechSubtitle] = useState<string>('مرحباً بك في المعمل! يمكنك تفعيل "وضع المبتدئ" للحصول على مرافقة صوتية وإرشادية خطوة بخطوة.');

  // --- OS SECURITY LOGIN STATES (WINDOWS & LINUX) ---
  const [winLoggedIn, setWinLoggedIn] = useState<boolean>(false);
  const [winPassword, setWinPassword] = useState<string>('');
  const [winLoginError, setWinLoginError] = useState<string>('');
  const [winShowHint, setWinShowHint] = useState<boolean>(false);

  const [linuxLoggedIn, setLinuxLoggedIn] = useState<boolean>(false);
  const [linuxPassword, setLinuxPassword] = useState<string>('');
  const [linuxLoginError, setLinuxLoginError] = useState<string>('');
  const [linuxShowHint, setLinuxShowHint] = useState<boolean>(false);

  // --- EXPANDED WINDOWS GUI STATE ENGINE ---
  const [winOpenApp, setWinOpenApp] = useState<'none' | 'notepad' | 'calculator' | 'paint' | 'word' | 'powerpoint' | 'browser' | 'files'>('none');
  const [winMinimized, setWinMinimized] = useState<boolean>(false);
  const [winMaximized, setWinMaximized] = useState<boolean>(false);

  // Word Editor States
  const [wordDocumentName, setWordDocumentName] = useState('شرح_اللوحة_الأم');
  const [wordContentText, setWordContentText] = useState('كتيب الصف السادس الأساسي: اللوحة الأم هي العمود الفقري للحاسوب، وعليها يركب المعالج والرام.');
  
  // Powerpoint Presentation States
  const [pptCurrentSlide, setPptCurrentSlide] = useState(0);

  // Simulation Web Browser States
  const [browserUrl, setBrowserUrl] = useState('sudan-edu.net');

  // Virtual Saved File Database
  const [savedFiles, setSavedFiles] = useState<Array<{ name: string; content: string; type: 'note' | 'word' | 'drawing' }>>([
    { name: 'مذكرة_وطن.txt', content: 'جمهورية السودان بلد التقدم والتكنولوجيا المشرقة.', type: 'note' },
    { name: 'درس_العتاد_الأول.doc', content: 'اللوحة الأم تربط المعالج ووحدات الإدخال والإخراج مع الذاكرة العشوائية.', type: 'word' }
  ]);

  // Guidance speech player per steps
  const playStepVoiceGuidance = (partId: string | null) => {
    let text = '';
    switch (partId) {
      case 'cpu':
        text = 'الآن، قم بتركيب المعالج (CPU) في مقبسه المخصص على لوحة الأم. المعالج هو عقل الكمبيوتر المفكر.';
        break;
      case 'cooler':
        text = 'المعالج غاية في السرعة وينتج طاقة حرارية شديدة. ضع المبدّد المعدني لحرارة المعالج (CPU Heatsink) مباشرة فوق المعالج.';
        break;
      case 'fan':
        text = 'رائع، والآن قم بتركيب مروحة التبريد لطرد الهواء الساخن من المشتت لضمان استقرار المعالج.';
        break;
      case 'ram':
        text = 'الخطوة التالية هي تركيب ذاكرة الوصول العشوائي (RAM) في منافذها الطولية لتخزين البيانات المفتوحة.';
        break;
      case 'storage':
        text = 'ممتاز، والآن نركب وحدة التخزين فائقة السرعة M.2 SSD لحفظ نظام التشغيل والملفات بشكل دائم.';
        break;
      case 'gpu':
        text = 'رائع جداً، قم بتركيب ملوّن الرسوميات، كرت الشاشة (GPU)، في منفذ PCIe لنرى اللوحات الملونة.';
        break;
      case 'sata':
        text = 'الآن صِل كابلات البيانات ساتا (SATA Cables) لربط منافذ البيانات والمحركات الإضافية بلوحة الأم.';
        break;
      case 'psu':
        text = 'الخطوة الأخيرة، ركّب مزود الطاقة البور سبلاي (PSU) لتزويد لوحة الأم وكافة القطع بالطاقة الكهربية الكافية.';
        break;
      default:
        text = 'تهانينا الحارة! لقد أكملت تركيب جميع قطع الحاسوب بنجاح تام! اضغط الآن على زر تشغيل الحاسوب باللون الأخضر لبدء الإقلاع.';
    }
    setSpeechSubtitle(text);
    if (speechActive) {
      speakPhrase(text);
    }
  };

  // Handle installing a part
  const handleInstallPart = (partId: string) => {
    const part = parts.find(p => p.id === partId);
    if (!part || part.placed) return;

    if (beginnerMode) {
      const nextRequired = INSTALL_ORDER.find(id => !parts.find(p => p.id === id)?.placed) || null;
      if (nextRequired && partId !== nextRequired) {
        playSound('laser');
        const correctPartName = parts.find(p => p.id === nextRequired)?.name || '';
        const warnText = `عزيزي الطالب، يرجى تركيب المكون الصحيح أولاً: ${correctPartName}!`;
        setSpeechSubtitle(warnText);
        speakPhrase(warnText);
        return;
      }
    }

    if (partId === 'ram') {
      playSound('ram_click');
    } else {
      playSound('success');
    }
    
    const updatedParts = parts.map(p => p.id === partId ? { ...p, placed: true } : p);
    setParts(updatedParts);
    setSelectedPartId(null);
    onEmitPoints(15);

    // If completely assembled
    const nextCompleted = updatedParts.every(p => p.placed);
    if (nextCompleted) {
      onEmitAchievement('ach-2'); // Award Cyber/Hardware points!
      onEmitPoints(30);
      const congratText = "يا لك من بطل ذكي! لقد أتممت تركيب جميع أجزاء الحاسب بنجاح مذهل وفق المنهاج المدرسي. اضغط الآن على زر تشغيل الحاسوب باللون الأخضر لبدء الإقلاع!";
      setSpeechSubtitle(congratText);
      speakPhrase(congratText);
    } else if (beginnerMode) {
      const nextRequiredId = INSTALL_ORDER.find(id => !updatedParts.find(p => p.id === id)?.placed) || null;
      // Play voice guide for the next part
      setTimeout(() => {
        playStepVoiceGuidance(nextRequiredId);
      }, 900);
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
      'التحقق من مشتت الحرارة (CPU Cooler Heatsink): مثبت بإحكام وامتصاص حراري ممتاز',
      'تدوير مروحة المعالج CPU Fan: تعمل بسرعة مذهلة 3200 دورة/دقيقة',
      'التحقق من سلامة المعالج: تم رصد معالج سداسي الأنوية (Sudanese ICT CPU)',
      'التعرف على الذاكرة: تم اكتشاف ذاكرة RAM بسعة 16 جيجابايت',
      'فحص كابلات البيانات SATA: قراءة الحزم سليمة، والتوصيلات مشدودة، ومنافذ التخزين جاهزة',
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
            playSound('boot_success');
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
      case 'sudan':
        return 'bg-gradient-to-br from-rose-750 via-slate-900 to-emerald-700 border-b-[24px] border-black';
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
            <div className="space-y-4">
              
              {/* Beginner Mode Assistance Panel */}
              <div id="beginner_mode_panel" className="bg-slate-905 border-2 border-indigo-500/30 p-3.5 rounded-[24px] shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 text-right bg-gradient-to-r from-slate-900 via-indigo-950/25 to-slate-900">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl p-2 px-2.5 shadow-md shrink-0">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div className="text-right">
                    <h4 className="font-extrabold text-white text-[12px] sm:text-xs flex items-center gap-2">
                       <span>مرشد المعمل التفاعلي (مساعد الصف السادس)</span>
                       <span className="bg-indigo-755 text-cyan-300 text-[8px] px-1.5 py-0.5 rounded font-black">حديث 🔊</span>
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed font-bold">
                      {beginnerMode 
                        ? '🟢 وضع المبتدئ نشط: يقوم بتسليط الضوء على القطع وتوجيهك بالصوت والترتيب الدراسي.' 
                        : '⚪ وضع الاستكشاف الحر نشط: يمكنك تركيب أي قطعة بأي ترتيب تراه مناسباً.'}
                    </p>
                  </div>
                </div>

                {/* Subtitle / spoken guidance */}
                {beginnerMode && (
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-indigo-500/20 flex-1 w-full text-right animate-fadeIn">
                    <span className="text-[9px] font-black text-cyan-400 block mb-0.5">🗣️ الدرس الصوتي المساعد للمعلّم عثمان:</span>
                    <p className="text-[10.5px] text-zinc-100 leading-relaxed font-semibold">{speechSubtitle}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                  {/* Speech Toggle sound toggle */}
                  {beginnerMode && (
                    <button
                      onClick={() => {
                        const nextSpeech = !speechActive;
                        setSpeechActive(nextSpeech);
                        if (nextSpeech) {
                          speakPhrase(speechSubtitle);
                        } else {
                          window.speechSynthesis.cancel();
                        }
                      }}
                      className={`text-[9.5px] font-black px-2.5 py-1.5 rounded-lg border transition cursor-pointer active:scale-95 ${
                        speechActive 
                          ? 'bg-cyan-950/50 text-cyan-400 border-cyan-500' 
                          : 'bg-zinc-850/50 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {speechActive ? 'كتم الصوت 🔇' : 'تشغيل الصوت 🔊'}
                    </button>
                  )}

                  {/* Re-speak manual button */}
                  {beginnerMode && (
                    <button
                      onClick={() => { playSound('click'); speakPhrase(speechSubtitle); }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9.5px] font-black px-3 py-1.5 rounded-lg border border-indigo-500 transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>تكرار الإرشاد 📢</span>
                    </button>
                  )}

                  {/* Toggle Mode */}
                  <button
                    onClick={() => {
                      playSound('success');
                      const nextMode = !beginnerMode;
                      setBeginnerMode(nextMode);
                      if (nextMode) {
                        const nextRequired = INSTALL_ORDER.find(id => !parts.find(p => p.id === id)?.placed) || null;
                        setTimeout(() => {
                          playStepVoiceGuidance(nextRequired);
                        }, 100);
                      } else {
                        setSpeechSubtitle('تصفح حر مستمر...');
                        speakPhrase('تم تعطيل وضع المبتدئ، يمكنك الآن تجميع العتاد بأي ترتيب تفضله.');
                      }
                    }}
                    className={`text-[9.5px] font-black px-3 py-1.5 rounded-lg transition cursor-pointer active:scale-95 border ${
                      beginnerMode 
                        ? 'bg-rose-950/40 text-rose-400 border-rose-900/60 hover:bg-rose-900/40' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                    }`}
                  >
                    {beginnerMode ? 'التحول للاستكشاف الحر 🧩' : 'تفعيل وضع المبتدئ تتبعي 🎓'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
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

                {/* 2. MAIN MOTHERBOARD CONTAINER WITH MOBILE HORIZONTAL PANNING */}
                <div className="w-full overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
                  <div className="relative min-w-[500px] lg:min-w-0 bg-slate-950/90 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between z-10 shadow-inner border-indigo-950/40">
                  
                    {/* Interactive Slots overlay */}
                    <div className="relative w-full h-full min-h-[320px]">
                      
                      {/* F. PSU Socket / Slot (Top-Left) */}
                      <div 
                        id="slot-psu"
                        onClick={() => { 
                          playSound('click'); 
                          setSelectedPartId('psu'); 
                          if (!parts.find(p => p.id === 'psu')?.placed) {
                            handleInstallPart('psu');
                          }
                        }}
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
                            ? 'bg-indigo-650/40 border-cyan-400 animate-pulse ring-2 ring-yellow-400'
                            : hoveredMotherboardSlot === 'psu'
                            ? 'bg-indigo-500/30 border-cyan-300'
                            : 'bg-slate-950 border-dashed border-indigo-500/15 text-indigo-300/30 hover:border-indigo-400'
                        } ${isTargetedSlot('psu') ? 'ring-[3.5px] ring-yellow-400 animate-pulse border-yellow-400 bg-yellow-500/25 shadow-[0_0_15px_rgba(234,179,8,0.5)] z-20 hover:scale-105' : ''}`}
                      >
                        {parts.find(p => p.id === 'psu')?.placed ? (
                          <div className="w-full h-full p-2.5 animate-fadeIn">
                            {renderRealisticPartSVG('psu', true, isAssemblyComplete)}
                          </div>
                        ) : (
                          <div className="text-center p-1.5 flex flex-col items-center justify-center">
                            <Power className="w-7 h-7 text-indigo-500/45 mb-1 animate-pulse" />
                            <span className="text-[8px] font-bold block text-indigo-200">مشغل الطاقة</span>
                            <span className="text-[7px] text-cyan-400/60 font-bold block font-mono">ATX_POWER_PSU</span>
                            <span className="bg-yellow-400/20 text-yellow-300 text-[6.5px] px-1 py-0.5 rounded font-black mt-1">اضغط للتثبيت 🔌</span>
                          </div>
                        )}
                      </div>

                      {/* A. CPU Socket & Fan bracket combo (Top-Center) */}
                    <div 
                      id="slot-cpu"
                      className="absolute top-[8%] left-[50%] -translate-x-1/2 w-32 h-32 flex flex-col items-center justify-center transition-all"
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'cpu' || draggingPartId === 'cooler' || draggingPartId === 'fan') {
                          setHoveredMotherboardSlot(draggingPartId);
                        }
                      }}
                      onDragLeave={() => setHoveredMotherboardSlot(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        const dragged = draggingPartId;
                        if (dragged === 'cpu' || dragged === 'cooler' || dragged === 'fan') {
                          handleInstallPart(dragged);
                        }
                        setHoveredMotherboardSlot(null);
                      }}
                    >
                      {/* Substrate socket frame */}
                      <div 
                        onClick={() => {
                          playSound('click');
                          const isCpuPlaced = parts.find(p => p.id === 'cpu')?.placed;
                          if (!isCpuPlaced) {
                            handleInstallPart('cpu');
                            setSelectedPartId('cpu');
                          } else {
                            const isCoolerPlaced = parts.find(p => p.id === 'cooler')?.placed;
                            if (!isCoolerPlaced) {
                              handleInstallPart('cooler');
                              setSelectedPartId('cooler');
                            } else {
                              const isFanPlaced = parts.find(p => p.id === 'fan')?.placed;
                              if (!isFanPlaced) {
                                handleInstallPart('fan');
                                setSelectedPartId('fan');
                              } else {
                                setSelectedPartId('cpu');
                              }
                            }
                          }
                        }}
                        className={`w-28 h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-1.5 cursor-pointer transition ${
                          parts.find(p => p.id === 'cpu')?.placed 
                            ? 'bg-slate-900 border-indigo-500/40' 
                            : selectedPartId === 'cpu'
                            ? 'bg-indigo-650/30 border-cyan-400 animate-pulse ring-2 ring-yellow-400'
                            : hoveredMotherboardSlot === 'cpu'
                            ? 'bg-indigo-500/40 border-cyan-300'
                            : 'bg-slate-950 border-dashed border-indigo-500/15 text-indigo-300/30 hover:border-indigo-400'
                        } ${isTargetedSlot('cpu') ? 'ring-[3.5px] ring-yellow-400 animate-pulse border-yellow-400 bg-yellow-500/25 shadow-[0_0_15px_rgba(234,179,8,0.5)] z-20 hover:scale-105' : ''}`}
                      >
                        {/* CPU Placement rendering */}
                        {parts.find(p => p.id === 'cpu')?.placed ? (
                          // CPU sits here inside socket
                          <div className="relative w-full h-full">
                            {renderRealisticPartSVG('cpu', true)}
                            
                            {/* Heatsink / Cooler (cooler) sits on top of CPU */}
                            {parts.find(p => p.id === 'cooler')?.placed && (
                              <div className="absolute inset-2 bg-slate-900/45 rounded-xl p-0.5 animate-fadeIn">
                                {renderRealisticPartSVG('cooler', true)}
                              </div>
                            )}
                            
                            {/* B. Fan on top of CPU Heatsink */}
                            {parts.find(p => p.id === 'fan')?.placed && (
                              <div className="absolute inset-0 bg-slate-950/80 rounded-2xl p-0.5 animate-fadeIn">
                                {renderRealisticPartSVG('fan', true, isAssemblyComplete)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center p-1 flex flex-col items-center justify-center">
                            <Cpu className="w-6 h-6 mx-auto text-indigo-500/30 mb-0.5" />
                            <span className="text-[8px] font-bold block">مقبس المعالج</span>
                            <span className="text-[7px] text-cyan-400 font-bold block font-mono">CPU_SOCKET</span>
                            <span className="bg-yellow-400/20 text-yellow-300 text-[6.5px] px-1 py-0.5 rounded font-black mt-1">اضغط للتركيب 🧠</span>
                          </div>
                        )}
                      </div>

                      {/* Heatsink highlight tag if CPU is placed but Heatsink is not */}
                      {parts.find(p => p.id === 'cpu')?.placed && !parts.find(p => p.id === 'cooler')?.placed && (
                        <div 
                          onClick={() => { 
                            playSound('click'); 
                            setSelectedPartId('cooler'); 
                            handleInstallPart('cooler');
                          }}
                          className="absolute -bottom-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full cursor-pointer animate-bounce ring-2 ring-indigo-500 z-20 whitespace-nowrap"
                        >
                          ركّب المشتت هنا ❄️
                        </div>
                      )}

                      {/* Fan highlight tag if Heatsink is placed but Fan is not */}
                      {parts.find(p => p.id === 'cpu')?.placed && parts.find(p => p.id === 'cooler')?.placed && !parts.find(p => p.id === 'fan')?.placed && (
                        <div 
                          onClick={() => { 
                            playSound('click'); 
                            setSelectedPartId('fan'); 
                            handleInstallPart('fan');
                          }}
                          className="absolute -bottom-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full cursor-pointer animate-bounce ring-2 ring-indigo-500 z-20 whitespace-nowrap"
                        >
                          ركّب المروحة هنا 🌀
                        </div>
                      )}
                    </div>

                    {/* C. Vertical RAM Slots Array (Right-Center) */}
                    <div 
                      id="slot-ram"
                      onClick={() => { 
                        playSound('click'); 
                        setSelectedPartId('ram'); 
                        if (!parts.find(p => p.id === 'ram')?.placed) {
                          handleInstallPart('ram');
                        }
                      }}
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
                      className={`absolute top-[8%] left-[78%] w-12 h-32 flex justify-between items-center gap-1 cursor-pointer group rounded-xl p-1 transition ${isTargetedSlot('ram') ? 'ring-[3px] ring-yellow-400 animate-pulse bg-yellow-500/10 shadow-[0_0_12px_rgba(234,179,8,0.4)] z-20 scale-105' : ''}`}
                    >
                      {/* Slots Visual lines */}
                      {[1, 2].map((slotNum) => {
                        const isPlaced = parts.find(p => p.id === 'ram')?.placed;
                        const isChosen = selectedPartId === 'ram';
                        return (
                          <div 
                            key={slotNum}
                            className={`w-3.5 h-full rounded border flex flex-col justify-between py-1 transition ${
                              isPlaced
                                ? 'bg-indigo-950 border-emerald-500'
                                : isChosen
                                ? 'border-cyan-400 animate-pulse bg-cyan-400/5 ring-1 ring-yellow-400'
                                : hoveredMotherboardSlot === 'ram'
                                ? 'border-cyan-300 bg-indigo-500/20'
                                : 'bg-slate-950 border-zinc-800'
                            }`}
                          >
                            {/* Latches */}
                            <div className={`w-full h-1 bg-slate-700 ${isPlaced ? 'bg-emerald-500' : ''}`}></div>
                            
                            {isPlaced ? (
                              <div className="flex-1 w-full bg-emerald-950 flex flex-col justify-center items-center overflow-hidden">
                                <span className="text-[6px] font-mono font-bold text-emerald-400 rotate-90 whitespace-nowrap">RAM DDR5</span>
                              </div>
                            ) : (
                              <div className="flex-1 w-full flex flex-col justify-center items-center">
                                <div className="w-0.5 h-3/5 bg-zinc-900 border-dashed border-zinc-800"></div>
                                <span className="text-[6px] text-yellow-400 font-black block leading-none select-none my-1 animate-pulse">اضغط</span>
                              </div>
                            )}

                            <div className={`w-full h-1 bg-slate-700 ${isPlaced ? 'bg-emerald-500' : ''}`}></div>
                          </div>
                        );
                      })}
                      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] font-semibold text-slate-400 block whitespace-nowrap">RAM_SLOT</span>
                    </div>

                    {/* D. M.2 SSD Horizontal Socket (Middle) */}
                    <div 
                      id="slot-storage"
                      onClick={() => { 
                        playSound('click'); 
                        setSelectedPartId('storage'); 
                        if (!parts.find(p => p.id === 'storage')?.placed) {
                          handleInstallPart('storage');
                        }
                      }}
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
                          ? 'bg-indigo-650/35 border-cyan-400 animate-pulse ring-2 ring-yellow-400'
                          : hoveredMotherboardSlot === 'storage'
                          ? 'bg-indigo-500/30 border-cyan-300'
                          : 'bg-slate-950 border-dashed border-indigo-500/10 hover:border-indigo-400'
                      } ${isTargetedSlot('storage') ? 'ring-[3px] ring-yellow-400 animate-pulse border-yellow-400 bg-yellow-500/25 shadow-[0_0_15px_rgba(234,179,8,0.5)] z-20 scale-[1.03] text-white' : ''}`}
                    >
                      {parts.find(p => p.id === 'storage')?.placed ? (
                        <div className="w-full h-full py-0.5">
                          {renderRealisticPartSVG('storage', true)}
                        </div>
                      ) : (
                        <div className="w-full h-full flex justify-between items-center text-[8px] px-2 text-indigo-400/40 font-bold">
                          <span>M.2 SSD شق</span>
                          <span className="bg-yellow-400/20 text-yellow-300 text-[6.5px] px-1 py-0.5 rounded font-black">اضغط للتركيب 💾</span>
                          <span>M2_CONNECTOR</span>
                        </div>
                      )}
                    </div>

                    {/* E. PCIe x16 GPU Horizontal Channel (Lower half) */}
                    <div 
                      id="slot-gpu"
                      onClick={() => { 
                        playSound('click'); 
                        setSelectedPartId('gpu'); 
                        if (!parts.find(p => p.id === 'gpu')?.placed) {
                          handleInstallPart('gpu');
                        }
                      }}
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
                          ? 'bg-indigo-650/40 border-cyan-400 animate-pulse ring-2 ring-yellow-400 shadow-md shadow-cyan-400/20'
                          : hoveredMotherboardSlot === 'gpu'
                          ? 'bg-indigo-500/30 border-cyan-300'
                          : 'bg-slate-950 border-dashed border-indigo-500/10 hover:border-indigo-400'
                      } ${isTargetedSlot('gpu') ? 'ring-[3.5px] ring-yellow-400 animate-pulse border-yellow-400 bg-yellow-500/25 shadow-[0_0_15px_rgba(234,179,8,0.5)] z-20 scale-[1.02]' : ''}`}
                    >
                      {parts.find(p => p.id === 'gpu')?.placed ? (
                        <div className="w-full h-full py-1">
                          {renderRealisticPartSVG('gpu', true, isAssemblyComplete)}
                        </div>
                      ) : (
                        <div className="w-full text-center p-1.5 text-indigo-400/30 font-bold flex flex-col items-center justify-center">
                          <span className="text-[8px] block">شق بطاقة الرسوميات السريع GPU PCIe 4.0</span>
                          <span className="bg-yellow-400/20 text-yellow-300 text-[6.5px] px-1.5 py-0.5 rounded font-black mt-1">اضغط للتثبيت المباشر 🎮</span>
                        </div>
                      )}
                    </div>

                    {/* G. SATA Data Cable Connection Slot (Middle-Right) */}
                    <div 
                      id="slot-sata"
                      onClick={() => { 
                        playSound('click'); 
                        setSelectedPartId('sata'); 
                        if (!parts.find(p => p.id === 'sata')?.placed) {
                          handleInstallPart('sata');
                        }
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'sata') setHoveredMotherboardSlot('sata');
                      }}
                      onDragLeave={() => setHoveredMotherboardSlot(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggingPartId === 'sata') handleInstallPart('sata');
                        setHoveredMotherboardSlot(null);
                      }}
                      className={`absolute top-[52%] left-[82%] -translate-x-1/2 w-14 h-12 rounded-xl cursor-pointer border flex flex-col justify-center transition-all ${
                        parts.find(p => p.id === 'sata')?.placed
                          ? 'border-rose-500 bg-slate-900/60'
                          : selectedPartId === 'sata'
                          ? 'bg-indigo-650/40 border-cyan-400 animate-pulse ring-2 ring-yellow-400 shadow-md shadow-cyan-400/20'
                          : hoveredMotherboardSlot === 'sata'
                          ? 'bg-indigo-500/30 border-cyan-300'
                          : 'bg-slate-950 border-dashed border-indigo-500/10 hover:border-indigo-400'
                      } ${isTargetedSlot('sata') ? 'ring-[3.5px] ring-yellow-400 animate-pulse border-yellow-400 bg-yellow-500/25 shadow-[0_0_15px_rgba(234,179,8,0.5)] z-20 scale-[1.05]' : ''}`}
                    >
                      {parts.find(p => p.id === 'sata')?.placed ? (
                        <div className="w-full h-full py-1">
                          {renderRealisticPartSVG('sata', true, isAssemblyComplete)}
                        </div>
                      ) : (
                        <div className="w-full text-center p-1 text-indigo-400/30 font-bold flex flex-col items-center justify-center">
                          <span className="text-[7.5px] block">منفذ SATA</span>
                          <span className="bg-yellow-400/20 text-yellow-300 text-[6px] px-1 py-0.5 rounded font-black mt-1">تثبيت 🔌</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Floating Draggable Touch Pocket for mobile & tablet screens */}
                    {selectedPartId && !parts.find(p => p.id === selectedPartId)?.placed && (
                      <motion.div
                        drag
                        dragSnapToOrigin={true}
                        dragElastic={0.1}
                        dragMomentum={false}
                        initial={{ opacity: 0, scale: 0.8, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 15 }}
                        onDragStart={() => {
                          setDraggingPartId(selectedPartId);
                          playSound('click');
                        }}
                        onDrag={(event, info) => {
                          const sId = selectedPartId;
                          const targetSlotId = (sId === 'fan' || sId === 'cooler') ? 'slot-cpu' : `slot-${sId}`;
                          const elem = document.getElementById(targetSlotId);
                          if (elem) {
                            const rect = elem.getBoundingClientRect();
                            const padding = 45;
                            if (
                              info.point.x >= rect.left - padding &&
                              info.point.x <= rect.right + padding &&
                              info.point.y >= rect.top - padding &&
                              info.point.y <= rect.bottom + padding
                            ) {
                              setHoveredMotherboardSlot(sId);
                            } else {
                              setHoveredMotherboardSlot(null);
                            }
                          }
                        }}
                        onDragEnd={(event, info) => {
                          setDraggingPartId(null);
                          setHoveredMotherboardSlot(null);
                          const sId = selectedPartId;
                          const targetSlotId = (sId === 'fan' || sId === 'cooler') ? 'slot-cpu' : `slot-${sId}`;
                          const elem = document.getElementById(targetSlotId);
                          if (elem) {
                            const rect = elem.getBoundingClientRect();
                            const padding = 55;
                            if (
                              info.point.x >= rect.left - padding &&
                              info.point.x <= rect.right + padding &&
                              info.point.y >= rect.top - padding &&
                              info.point.y <= rect.bottom + padding
                            ) {
                              handleInstallPart(sId);
                            }
                          }
                        }}
                        whileDrag={{ 
                          scale: 1.25, 
                          zIndex: 50,
                          rotate: 4,
                          boxShadow: "0px 12px 30px rgba(34,211,238,0.55)",
                        }}
                        className="absolute bottom-3 right-3 z-30 bg-slate-900/95 border-2 border-cyan-400 text-white rounded-2xl p-2.5 shadow-xl shadow-cyan-400/30 flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none touch-none w-32 text-center"
                        style={{ touchAction: 'none' }}
                      >
                        <div className="text-[7.5px] font-black bg-cyan-400 text-slate-950 px-1.5 py-0.5 rounded animate-pulse w-full">
                          اسحب للتركيب 🎯
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center">
                          {renderRealisticPartSVG(selectedPartId)}
                        </div>
                        <span className="text-[8px] font-extrabold text-white block truncate max-w-full">
                          {parts.find(p => p.id === selectedPartId)?.name}
                        </span>
                      </motion.div>
                    )}

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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {parts.map((p) => (
                      <motion.div
                        key={p.id}
                        drag={!p.placed}
                        dragSnapToOrigin={true}
                        dragElastic={0.08}
                        dragMomentum={false}
                        onDragStart={() => {
                          setDraggingPartId(p.id);
                          setSelectedPartId(p.id);
                          playSound('click');
                        }}
                        onDrag={(event, info) => {
                          const slots = ['psu', 'cpu', 'ram', 'storage', 'gpu', 'sata', 'cooler', 'fan'];
                          let hovered: string | null = null;
                          for (const sId of slots) {
                            const targetSlotId = (sId === 'fan' || sId === 'cooler') ? 'slot-cpu' : `slot-${sId}`;
                            const elem = document.getElementById(targetSlotId);
                            if (elem) {
                              const rect = elem.getBoundingClientRect();
                              const padding = 45;
                              if (
                                info.point.x >= rect.left - padding &&
                                info.point.x <= rect.right + padding &&
                                info.point.y >= rect.top - padding &&
                                info.point.y <= rect.bottom + padding
                              ) {
                                hovered = sId;
                                break;
                              }
                            }
                          }
                          setHoveredMotherboardSlot(hovered);
                        }}
                        onDragEnd={(event, info) => {
                          setDraggingPartId(null);
                          setHoveredMotherboardSlot(null);
                          const targetSlotId = (p.id === 'fan' || p.id === 'cooler') ? 'slot-cpu' : `slot-${p.id}`;
                          const elem = document.getElementById(targetSlotId);
                          if (elem) {
                            const rect = elem.getBoundingClientRect();
                            const padding = 55;
                            if (
                              info.point.x >= rect.left - padding &&
                              info.point.x <= rect.right + padding &&
                              info.point.y >= rect.top - padding &&
                              info.point.y <= rect.bottom + padding
                            ) {
                              handleInstallPart(p.id);
                            }
                          }
                        }}
                        onClick={() => {
                          playSound('click');
                          setSelectedPartId(p.id);
                        }}
                        whileDrag={{ 
                          scale: 1.15, 
                          zIndex: 50,
                          cursor: 'grabbing',
                          borderColor: '#22d3ee',
                          boxShadow: "0px 10px 25px rgba(34, 211, 238, 0.4)" 
                        }}
                        className={`p-3 rounded-2xl border transition duration-150 transform active:scale-98 flex items-center justify-between gap-2.5 cursor-pointer touch-none select-none ${
                          p.placed 
                            ? 'bg-slate-950 border-indigo-900/30 text-indigo-400/60 opacity-55' 
                            : beginnerMode && p.id === nextRequiredPartId
                            ? 'bg-yellow-950/45 border-yellow-400 text-yellow-350 shadow-[0_0_15px_rgba(234,179,8,0.2)] font-black ring-2 ring-yellow-400 animate-pulse'
                            : selectedPartId === p.id 
                            ? 'bg-indigo-650/30 text-white border-cyan-400 ring-1 ring-cyan-400'
                            : 'bg-slate-900/70 hover:bg-slate-800 border-indigo-500/10 text-slate-200'
                        }`}
                        style={{ touchAction: 'none' }}
                      >
                        {/* Real-life vector thumbnail preview */}
                        <div className="w-10 h-10 bg-slate-950 p-1.5 rounded-xl border border-indigo-500/10 shrink-0">
                          {renderRealisticPartSVG(p.id)}
                        </div>

                        {/* Title details */}
                        <div className="flex-1 text-right min-w-0">
                          <h5 className="font-extrabold text-[11px] truncate text-slate-100 flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.placed ? (
                              <span className="text-emerald-400 font-extrabold shrink-0 text-[10px]">✓</span>
                            ) : beginnerMode && p.id === nextRequiredPartId ? (
                              <span className="bg-yellow-400 text-slate-950 font-black text-[7.5px] px-1 py-0.5 rounded animate-bounce shrink-0">القطعة المطلوبة ⭐</span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                            )}
                          </h5>
                          <span className="text-[9px] block text-indigo-300/80 font-bold tracking-tight">
                            {p.placed ? 'تم التركيب بنجاح' : beginnerMode && p.id === nextRequiredPartId ? '👉 اسحبني أو اضغط لتثبيتي الآن' : 'متاح للسحب والتركيب'}
                          </span>
                        </div>

                        {/* Mobile and instant Touch-to-install button */}
                        {!p.placed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playSound('click');
                              handleInstallPart(p.id);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] px-2 py-1.5 rounded-lg border border-emerald-500 transition hover:scale-105 shadow-md shadow-emerald-500/15 cursor-pointer shrink-0"
                          >
                            تركيب مباشر ⚡
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-950/40 p-3 rounded-2xl text-[9px] text-cyan-300 border border-indigo-500/10 leading-relaxed font-bold flex gap-1.5 items-center">
                  <span className="text-base">💡</span>
                  <span>سهولة للجوال: يمكنك تثبيت أي قطعة مباشرة بضغط زر "تركيب مباشر ⚡" أو بالنقر على مكانها في اللوحة الأم دون حاجة لسحب وإفلات!</span>
                </div>
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

                {/* OS 2: Windows */}
                <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-6 hover:border-blue-500 transition-all duration-300 flex flex-col justify-between space-y-4 group">
                  <div className="space-y-3">
                    <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex items-center justify-center text-3xl group-hover:scale-105 duration-200 select-none">
                      🪟 🇸🇩
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-cyan-400 font-extrabold block">واجهة المستخدم الرسومية (GUI)</span>
                      <h4 className="font-extrabold text-white text-base">نظام التشغيل ويندوز Windows 🇸🇩</h4>
                      <p className="text-[11px] text-indigo-300 leading-relaxed font-bold">
                        النظام الأكثر انتشاراً. تجربة سودانية كاملة وخلفية علم السودان وتطبيقات وورد وبوربوينت ومتفصح آي بي وحفظ الملفات.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { playSound('boot'); setLabState('windows'); }}
                    className="w-full bg-slate-950 border border-indigo-500/40 text-indigo-400 font-black text-xs py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-transparent transition"
                  >
                    الإقلاع لنظام Windows ←
                  </button>
                </div>

                {/* OS 3: Linux */}
                <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-6 hover:border-pink-500 transition-all duration-300 flex flex-col justify-between space-y-4 group">
                  <div className="space-y-3">
                    <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex items-center justify-center text-3xl group-hover:scale-105 duration-200 select-none">
                      🐧 🇸🇩
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-pink-400 font-extrabold block">قوة المصادر المفتوحة وباش</span>
                      <h4 className="font-extrabold text-white text-base">خادم الطرفية لينكس GNU/Linux 🐧</h4>
                      <p className="text-[11px] text-indigo-300 leading-relaxed font-bold">
                        النظام المفتوح المصدر الذي تعتمد عليها السيرفرات والشبكات العالمية الكبرى. يمنحك طرفية تحكم مذهلة!
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { playSound('boot'); setLabState('linux'); }}
                    className="w-full bg-slate-950 border border-pink-500/40 text-pink-400 font-black text-xs py-2.5 rounded-xl hover:bg-pink-600 hover:text-white hover:border-transparent transition"
                  >
                    الإقلاع لنظام Linux ←
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* 4. ACTIVE OS ENVIRONMENT SYSTEM: DOS */}
          {labState === 'dos' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-2xl border border-indigo-500/10">
                <button
                  onClick={() => { playSound('click'); setLabState('os_menu'); }}
                  className="bg-slate-950 border border-indigo-505/30 text-indigo-300 text-xs py-1.5 px-4 rounded-xl font-bold flex items-center gap-1.5 hover:text-white transition"
                >
                  <ArrowLeft className="w-4 h-4 ml-1" />
                  <span>العودة لقائمة الأنظمة (OS Menu)</span>
                </button>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-extrabold">موجّه سطر الأوامر الأثري DOS Prompt</span>
                  <h4 className="font-extrabold text-white text-xs">Virtual MS-DOS Command Simulation</h4>
                </div>
              </div>

              <div className="bg-black text-emerald-400 p-5 rounded-[25px] font-mono text-xs sm:text-sm text-left h-[330px] overflow-y-auto select-text shadow-xl flex flex-col justify-between border-2 border-emerald-550">
                <div className="space-y-1 text-left" dir="ltr">
                  {dosConsole.map((line, i) => (
                    <div key={i} className="leading-relaxed whitespace-pre-wrap">{line}</div>
                  ))}
                </div>
                
                <form onSubmit={handleDosSubmit} className="mt-4 flex border-t border-slate-900 pt-2 items-center text-left" dir="ltr">
                  <span className="text-emerald-400 font-bold shrink-0 select-none">C:\&gt;</span>
                  <input
                    type="text"
                    value={dosInput}
                    onChange={(e) => setDosInput(e.target.value)}
                    className="bg-transparent text-emerald-400 border-none outline-none focus:outline-none flex-1 font-mono px-1 border-transparent focus:ring-0 text-left shrink-0 ml-1"
                    placeholder="Type HELP..."
                    autoFocus
                  />
                </form>
              </div>

              <div className="bg-slate-900 border border-indigo-500/10 p-3.5 rounded-2xl text-[11px] text-indigo-300 text-right leading-relaxed font-bold">
                💾 <span className="text-emerald-400">تلميح الدرس:</span> جرب كتابة الأمر <span className="font-mono text-white text-[12px] bg-slate-950 px-1.5 py-0.5 rounded">HELP</span> لعرض كافة التعليمات المدعومة بالنظام، أو جرب <span className="font-mono text-white text-[12px] bg-slate-950 px-1.5 py-0.5 rounded">VER</span> لمعرفة إصدار نظام التشغيل!
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
                    onClick={() => { playSound('click'); setWinWallpaper('sudan'); }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-white to-green-600 border ${winWallpaper === 'sudan' ? 'border-white scale-125' : 'border-slate-800'}`}
                    title="الخلفية السودانية القومية"
                  />
                  <button 
                    onClick={() => { playSound('click'); setWinWallpaper('aurora'); }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-pink-500 border ${winWallpaper === 'aurora' ? 'border-white scale-125' : 'border-slate-800'}`}
                    title="الشفق القطبي"
                  />
                  <button 
                    onClick={() => { playSound('click'); setWinWallpaper('cyber'); }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-r from-purple-800 to-slate-900 border ${winWallpaper === 'cyber' ? 'border-white scale-125' : 'border-slate-800'}`}
                    title="السايبر الشرير"
                  />
                  <button 
                    onClick={() => { playSound('click'); setWinWallpaper('nile'); }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-800 border ${winWallpaper === 'nile' ? 'border-white scale-125' : 'border-slate-800'}`}
                    title="مقرن النيلين بالخرطوم"
                  />
                </div>
              </div>

              {/* Windows desktop screen */}
              <div className={`rounded-[30px] border-4 border-slate-800 min-h-[460px] relative flex flex-col justify-between overflow-hidden p-4 select-none transition-all ${getWallpaperClasses()}`}>
                
                {!winLoggedIn ? (
                  /* 1. Windows Login Screen (Sudanese Theme) */
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col justify-center items-center p-4 z-30 font-bold" dir="rtl">
                    <div className="w-full max-w-sm bg-slate-900/90 border-2 border-indigo-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
                      
                      {/* Sudan Flag Motif indicator at the top */}
                      <div className="absolute top-0 inset-x-0 h-1.5 flex" dir="ltr">
                        <div className="w-1/3 bg-red-650" />
                        <div className="w-1/3 bg-white" />
                        <div className="w-1/3 bg-black" />
                      </div>
                      
                      <div className="text-center space-y-1">
                        <div className="flex justify-center items-center gap-1.5">
                          <span className="text-2xl">🇸🇩</span>
                          <span className="text-base text-white font-extrabold">بوابة لوحة التجربة الأمنية</span>
                        </div>
                        <p className="text-[9px] text-zinc-400">وزارة التربية والتعليم - المنهج الرقمي القومي السوداني</p>
                      </div>

                      {/* Pyramids of Meroe emblem background */}
                      <div className="bg-slate-950/70 p-3 rounded-2xl border border-indigo-500/10 flex items-center gap-2.5 text-right">
                        <div className="text-lg">🏕️</div>
                        <div className="leading-tight">
                          <span className="text-[10px] text-cyan-300 block">مرشد الصف السادس الحاسوبية:</span>
                          <span className="text-[9px] text-zinc-300">أمام هرم البجراوية ومع مياه النيل الخالدة، نلج لعالم البرمجيات!</span>
                        </div>
                      </div>

                      {/* Login Form Inputs */}
                      <div className="space-y-3 text-right">
                        <div>
                          <label className="text-[10px] text-zinc-300 block mb-1">اسم مستخدم الطالب المقيد:</label>
                          <input 
                            type="text" 
                            disabled 
                            value="student" 
                            className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 text-xs rounded-xl p-2 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-300 block mb-1">كلمة مرور النظام المدرسي:</label>
                          <div className="relative">
                            <input 
                              type="password" 
                              value={winPassword}
                              onChange={(e) => setWinPassword(e.target.value)}
                              placeholder="أدخل كلمة المرور لدخول الديسكتوب..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  if (winPassword.toLowerCase() === 'sudan') {
                                    playSound('success');
                                    setWinLoggedIn(true);
                                    setWinLoginError('');
                                    speakPhrase('تمت المصادقة الأمنية، أهلاً بك في نظام ويندوز السوداني التعليمي المتكامل.');
                                  } else {
                                    playSound('fail');
                                    setWinLoginError('❌ كلمة المرور خاطئة، يرجى قراءة التلميح بالأسفل!');
                                  }
                                }
                              }}
                              className="w-full bg-[#070b13] border border-slate-700 text-cyan-400 text-xs rounded-xl p-2 font-bold placeholder:text-zinc-650 placeholder:font-normal focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                            />
                          </div>
                        </div>

                        {winLoginError && (
                          <div className="text-[9px] text-rose-400 bg-rose-950/30 p-2 rounded-lg leading-snug text-center border border-rose-900/40">
                            {winLoginError}
                          </div>
                        )}
                      </div>

                      {/* Login and Hint buttons */}
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => {
                            if (winPassword.toLowerCase() === 'sudan') {
                              playSound('success');
                              setWinLoggedIn(true);
                              setWinLoginError('');
                              speakPhrase('تمت المصادقة الأمنية، أهلاً بك في نظام ويندوز السوداني التعليمي المتكامل.');
                            } else {
                              playSound('fail');
                              setWinLoginError('❌ كلمة المرور خاطئة، يرجى قراءة التلميح بالأسفل!');
                            }
                          }}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-black py-2 rounded-xl transition shadow active:scale-95 cursor-pointer text-center"
                        >
                          دخول آمن بالنظام 🔓
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => { playSound('click'); setWinShowHint(!winShowHint); }}
                          className="bg-slate-950 text-indigo-300 border border-indigo-500/20 px-2.5 rounded-xl text-[10px] whitespace-nowrap active:scale-95 cursor-pointer"
                        >
                          {winShowHint ? 'إخفاء التلميح 💡' : 'إظهار التلميح 💡'}
                        </button>
                      </div>

                      {/* Active hint box */}
                      {winShowHint && (
                        <div className="p-2.5 bg-yellow-950/40 border border-yellow-700/30 text-[9px] text-yellow-300 rounded-xl leading-relaxed text-right animate-fadeIn">
                          💡 <span className="font-extrabold">تلميح المعلم عثمان:</span> كلمة المرور هي اسم بلدنا الغالي بحروف صغيرة باللغة الإنجليزية: <span className="font-mono bg-black text-white px-1 py-0.5 rounded text-[10px] ml-0.5 select-text">sudan</span>
                        </div>
                      )}

                    </div>
                  </div>
                ) : (
                  /* 2. Logged-in Desktop Environment and Apps */
                  <div className="absolute inset-0 flex flex-col justify-between" dir="rtl">
                    
                    {/* Desktop Workspace body */}
                    <div className="relative flex-1 flex items-start justify-between p-2">
                      
                      {/* Icons Column Checklist */}
                      <div className="flex flex-col flex-wrap h-[340px] gap-2 text-center items-start justify-start z-10 p-1 text-white font-extrabold text-[8.5px]" dir="ltr">
                        
                        {/* App 1: Notepad */}
                        <button 
                          onClick={() => { playSound('click'); setWinOpenApp('notepad'); setWinMinimized(false); }}
                          className={`flex flex-col items-center bg-white/5 hover:bg-indigo-950/40 p-1 rounded-xl w-14 transition ${winOpenApp === 'notepad' ? 'ring-1 ring-cyan-400 bg-indigo-950/50' : ''}`}
                        >
                          <FileText className="w-6 h-6 text-blue-200" />
                          <span className="mt-1 font-bold whitespace-nowrap overflow-ellipsis overflow-hidden drop-shadow-md">المفكرة</span>
                        </button>

                        {/* App 2: Calculator */}
                        <button 
                          onClick={() => { playSound('click'); setWinOpenApp('calculator'); setWinMinimized(false); }}
                          className={`flex flex-col items-center bg-white/5 hover:bg-indigo-950/40 p-1 rounded-xl w-14 transition ${winOpenApp === 'calculator' ? 'ring-1 ring-cyan-400 bg-indigo-950/50' : ''}`}
                        >
                          <Calculator className="w-6 h-6 text-amber-200" />
                          <span className="mt-1 font-bold whitespace-nowrap overflow-ellipsis overflow-hidden drop-shadow-md">الحاسبة</span>
                        </button>

                        {/* App 3: Paint Grid */}
                        <button 
                          onClick={() => { playSound('click'); setWinOpenApp('paint'); setWinMinimized(false); }}
                          className={`flex flex-col items-center bg-white/5 hover:bg-indigo-950/40 p-1 rounded-xl w-14 transition ${winOpenApp === 'paint' ? 'ring-1 ring-cyan-400 bg-indigo-950/50' : ''}`}
                        >
                          <Palette className="w-6 h-6 text-rose-300" />
                          <span className="mt-1 font-bold whitespace-nowrap overflow-ellipsis overflow-hidden drop-shadow-md">الرسام</span>
                        </button>

                        {/* App 4: Word (New) */}
                        <button 
                          onClick={() => { playSound('click'); setWinOpenApp('word'); setWinMinimized(false); }}
                          className={`flex flex-col items-center bg-white/5 hover:bg-indigo-950/40 p-1 rounded-xl w-14 transition ${winOpenApp === 'word' ? 'ring-1 ring-cyan-400 bg-indigo-950/50' : ''}`}
                        >
                          <FileText className="w-6 h-6 text-emerald-300" />
                          <span className="mt-1 font-bold whitespace-nowrap overflow-ellipsis overflow-hidden drop-shadow-md">المستندات</span>
                        </button>

                        {/* App 5: Powerpoint (New) */}
                        <button 
                          onClick={() => { playSound('click'); setWinOpenApp('powerpoint'); setWinMinimized(false); }}
                          className={`flex flex-col items-center bg-white/5 hover:bg-slate-900/45 p-1 rounded-xl w-14 transition ${winOpenApp === 'powerpoint' ? 'ring-1 ring-cyan-400 bg-indigo-950/50' : ''}`}
                        >
                          <Grid className="w-6 h-6 text-orange-400" />
                          <span className="mt-1 font-bold whitespace-nowrap overflow-ellipsis overflow-hidden drop-shadow-md">بوربوينت</span>
                        </button>

                        {/* App 6: Browser (New) */}
                        <button 
                          onClick={() => { playSound('click'); setWinOpenApp('browser'); setWinMinimized(false); }}
                          className={`flex flex-col items-center bg-white/5 hover:bg-slate-900/45 p-1 rounded-xl w-14 transition ${winOpenApp === 'browser' ? 'ring-1 ring-cyan-400 bg-indigo-950/50' : ''}`}
                        >
                          <Monitor className="w-6 h-6 text-cyan-300" />
                          <span className="mt-1 font-bold whitespace-nowrap overflow-ellipsis overflow-hidden drop-shadow-md">المتصفح</span>
                        </button>

                        {/* App 7: File Explorer (New) */}
                        <button 
                          onClick={() => { playSound('click'); setWinOpenApp('files'); setWinMinimized(false); }}
                          className={`flex flex-col items-center bg-white/5 hover:bg-slate-900/45 p-1 rounded-xl w-14 transition ${winOpenApp === 'files' ? 'ring-1 ring-cyan-400 bg-indigo-950/50' : ''}`}
                        >
                          <Folder className="w-6 h-6 text-yellow-300" />
                          <span className="mt-1 font-bold whitespace-nowrap overflow-ellipsis overflow-hidden drop-shadow-md">الملفات</span>
                        </button>

                      </div>

                      {/* Simulated Window Frame - responds to minimized/maximized state */}
                      {winOpenApp !== 'none' && !winMinimized && (
                        <div className={`absolute bg-white rounded-2xl shadow-2xl border border-slate-300 z-20 overflow-hidden text-right animate-fadeIn flex flex-col transition-all duration-200 ${
                          winMaximized 
                            ? 'inset-x-1 top-1 bottom-10 max-w-none rounded-none border-t-0 p-0' 
                            : 'top-[3%] left-1/2 -translate-x-1/2 w-full max-w-xs sm:max-w-md'
                        }`} dir="rtl">
                          
                          {/* Titlebar header with operating system dot controls */}
                          <div className="bg-slate-100 p-2 border-b flex justify-between items-center text-slate-800 font-extrabold">
                            <div className="flex items-center gap-1.5 text-xs">
                              {winOpenApp === 'notepad' && <FileText className="w-3.5 h-3.5 text-blue-600" />}
                              {winOpenApp === 'calculator' && <Calculator className="w-3.5 h-3.5 text-amber-550" />}
                              {winOpenApp === 'paint' && <Palette className="w-3.5 h-3.5 text-pink-600" />}
                              {winOpenApp === 'word' && <FileText className="w-3.5 h-3.5 text-emerald-600" />}
                              {winOpenApp === 'powerpoint' && <Grid className="w-3.5 h-3.5 text-orange-500" />}
                              {winOpenApp === 'browser' && <Monitor className="w-3.5 h-3.5 text-cyan-600" />}
                              {winOpenApp === 'files' && <Folder className="w-3.5 h-3.5 text-yellow-500" />}
                              <span className="text-[10px] sm:text-xs">
                                {winOpenApp === 'notepad' && 'المفكرة النصية (Notepad)'}
                                {winOpenApp === 'calculator' && 'الآلة الحاسبة التعليمية (Calculator)'}
                                {winOpenApp === 'paint' && 'برنامج الرسام المدرسي (Paint 3D)'}
                                {winOpenApp === 'word' && 'معالج النصوص المتطور (Word .doc)'}
                                {winOpenApp === 'powerpoint' && 'مستعرض العلوم والعروض التقديمية (PowerPoint)'}
                                {winOpenApp === 'browser' && 'متصفح الإنترنت المدرسي (Web Browser)'}
                                {winOpenApp === 'files' && 'مستعرض الملفات والمستندات (File Explorer)'}
                              </span>
                            </div>
                            
                            {/* Window controls: ➖ ◻ ✕ */}
                            <div className="flex items-center gap-1.5">
                              {/* 1. Minimise */}
                              <button 
                                onClick={() => { playSound('click'); setWinMinimized(true); }}
                                className="w-4 h-4 bg-amber-100 text-amber-700 font-black hover:bg-amber-400 hover:text-white rounded-full flex items-center justify-center text-[8px]"
                                title="تصغير النافذة"
                              >
                                ➖
                              </button>

                              {/* 2. Maximise */}
                              <button 
                                onClick={() => { playSound('click'); setWinMaximized(!winMaximized); }}
                                className="w-4 h-4 bg-emerald-100 text-emerald-700 font-black hover:bg-emerald-400 hover:text-white rounded-full flex items-center justify-center text-[7px]"
                                title="تكبير النافذة"
                              >
                                ◻
                              </button>

                              {/* 3. Close */}
                              <button 
                                onClick={() => { playSound('laser'); setWinOpenApp('none'); setWinMaximized(false); setWinMinimized(false); }}
                                className="w-4 h-4 bg-rose-100 text-rose-700 font-black hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center text-[8px]"
                                title="إغلاق النافذة"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* App Window main layout contents */}
                          <div className="p-3 sm:p-4 text-slate-800 flex-1 overflow-y-auto">
                            
                            {/* notepad view */}
                            {winOpenApp === 'notepad' && (
                              <div className="space-y-3 font-semibold text-right">
                                <textarea
                                  className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs h-32 focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold"
                                  value={notepadText}
                                  onChange={(e) => setNotepadText(e.target.value)}
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={handleSaveNotepad}
                                    className="bg-blue-600 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl hover:bg-blue-500 transition shadow flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>حفظ بالنواة الافتراضية 💾</span>
                                  </button>
                                </div>
                                {savedNotepads && (
                                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 rounded-xl">
                                    📂 <span className="font-extrabold">المستند النشط المحفوظ:</span> "{savedNotepads}"
                                  </div>
                                )}
                              </div>
                            )}

                            {/* calculator view */}
                            {winOpenApp === 'calculator' && (
                              <div className="max-w-[240px] mx-auto bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3 font-semibold">
                                <div className="bg-slate-900 text-white p-3 rounded-xl font-mono text-right text-sm font-extrabold">
                                  <div className="text-[10px] text-slate-400 h-4 leading-none mb-1">{calcFormula}</div>
                                  <div>{calcDisplay}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-1.5 text-xs font-black">
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

                            {/* paint view */}
                            {winOpenApp === 'paint' && (
                              <div className="space-y-3 text-center font-semibold text-xs text-slate-700">
                                <p className="text-[9px] leading-snug">🎨 اختر لوحة ألوان وبكسل لتزيين عتاد الصف السادس المجمع!</p>
                                <div className="flex gap-2 justify-center items-center">
                                  {['#3b82f6', '#10b981', '#f43f5e', '#eab308', '#a855f7', '#0f172a'].map((col) => (
                                    <button
                                      key={col}
                                      onClick={() => { playSound('click'); setPaintSelectedColor(col); }}
                                      className={`w-5 h-5 rounded-full transition-all border-2 ${paintSelectedColor === col ? 'border-slate-800 scale-125' : 'border-transparent'}`}
                                      style={{ backgroundColor: col }}
                                    />
                                  ))}
                                  <button
                                    onClick={() => setPaintGrid(Array(12).fill(null).map(() => Array(12).fill('#ffffff')))}
                                    className="bg-slate-150 text-[9px] border px-2 py-0.5 rounded-md text-rose-600 shrink-0 font-extrabold cursor-pointer"
                                  >
                                    مسح اللوحة
                                  </button>
                                </div>
                                <div className="border inline-block p-1 bg-slate-50 rounded-xl">
                                  <div className="grid grid-cols-12 gap-0.5" style={{ width: '144px', height: '144px' }}>
                                    {paintGrid.map((row, rIdx) => 
                                      row.map((cellColor, cIdx) => (
                                        <div
                                          key={`${rIdx}-${cIdx}`}
                                          onClick={() => {
                                            playSound('success');
                                            const newGrid = [...paintGrid];
                                            newGrid[rIdx][cIdx] = paintSelectedColor;
                                            setPaintGrid(newGrid);
                                          }}
                                          className="w-3 h-3 hover:opacity-80 transition cursor-pointer"
                                          style={{ backgroundColor: cellColor }}
                                        />
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* App 4: Word Editor (New) */}
                            {winOpenApp === 'word' && (
                              <div className="space-y-3 text-right">
                                <div>
                                  <label className="text-[10px] text-zinc-500 font-extrabold block mb-0.5">اسم المستند التعليمي (.doc):</label>
                                  <input 
                                    type="text" 
                                    value={wordDocumentName}
                                    onChange={(e) => setWordDocumentName(e.target.value)}
                                    className="w-full bg-slate-50 border p-2 rounded-xl text-xs font-bold"
                                    placeholder="اكتب اسم المستند..."
                                  />
                                </div>
                                
                                <div>
                                  <label className="text-[10px] text-zinc-500 font-extrabold block mb-0.5">محتويات معالج النصوص الأساسي:</label>
                                  <textarea
                                    value={wordContentText}
                                    onChange={(e) => setWordContentText(e.target.value)}
                                    className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs h-28 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                                    placeholder="اكتب نصوص الدرس ومذكرات المنهج هنا..."
                                  />
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] text-slate-400 font-extrabold italic">✓ معالج نصوص كتاب الحاسوب والاتصالات</span>
                                  <button
                                    onClick={() => {
                                      playSound('success');
                                      const cleanName = wordDocumentName.endsWith('.doc') ? wordDocumentName : `${wordDocumentName}.doc`;
                                      
                                      // Append to savedFiles state
                                      setSavedFiles(prev => {
                                        const filtered = prev.filter(f => f.name !== cleanName);
                                        return [...filtered, { name: cleanName, content: wordContentText, type: 'word' }];
                                      });
                                      
                                      onEmitPoints(5);
                                      speakPhrase(`تم حفظ مستند وورد التعليمي ${cleanName} بنجاح في نظام تخزين النواقل بالقرص الصلب!`);
                                      alert(`🎉 تم حفظ الملف "${cleanName}" بنجاح فلاشة العتاد!\nتم منحه ميزة تخزين الفئات بنجاح في مجلد المستندات.`);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer active:scale-95 shadow"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>حفظ وتخزين الملف 💾</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* App 5: PowerPoint Slideshow (New) */}
                            {winOpenApp === 'powerpoint' && (
                              <div className="space-y-3 text-right">
                                
                                {/* Slide container frame */}
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner min-h-[160px] flex flex-col justify-between relative">
                                  
                                  {/* Slide background Sudanese graphic seal watermark */}
                                  <div className="absolute right-3.5 bottom-3 text-2xl opacity-15">🇸🇩</div>
                                  
                                  {/* Render active slide content */}
                                  {pptCurrentSlide === 0 && (
                                    <div className="space-y-2 animate-fadeIn">
                                      <h4 className="text-xs sm:text-sm font-extrabold text-orange-600 flex items-center gap-1 border-b pb-1">
                                        <span>الشريحة الأولى: أساسيات الحاسوب (الصف السادس)</span>
                                      </h4>
                                      <ul className="text-[10px] sm:text-xs text-slate-800 space-y-1.5 leading-relaxed font-bold">
                                        <li>• <span className="text-indigo-600">تعريف الحاسوب:</span> جهاز إلكتروني يستقبل مدخلات البيانات ويعالجها ليعطيك مخرجات ومعلومات دقيقة وسريعة.</li>
                                        <li>• <span className="text-zinc-500">شقين أساسيين:</span> كيان مادي فيزيائي يسمى العتاد (Hardware) وكيان برمجي خفي يسمى برامج التشغيل (Software).</li>
                                      </ul>
                                    </div>
                                  )}

                                  {pptCurrentSlide === 1 && (
                                    <div className="space-y-2 animate-fadeIn">
                                      <h4 className="text-xs sm:text-sm font-extrabold text-orange-600 flex items-center gap-1 border-b pb-1">
                                        <span>الشريحة الثانية: اللوحة الأم كعمود فقري للقطع</span>
                                      </h4>
                                      <ul className="text-[10px] sm:text-xs text-slate-800 space-y-1.5 leading-relaxed font-bold">
                                        <li>• <span className="text-rose-500">اللوحة الأم (Motherboard):</span> اللوحة الإلكترونية الحاضنة لجميع مفاصل الحاسوب.</li>
                                        <li>• <span className="text-blue-500">خطوط التوصيل:</span> هي قنوات دقيقة على المذربورد لتنظيم تدفق الطاقة ونبضات البيانات بين المعالج والأقراص والذاكرة العشوائية.</li>
                                      </ul>
                                    </div>
                                  )}

                                  {pptCurrentSlide === 2 && (
                                    <div className="space-y-2 animate-fadeIn">
                                      <h4 className="text-xs sm:text-sm font-extrabold text-orange-600 flex items-center gap-1 border-b pb-1">
                                        <span>الشريحة الثالثة: أنظمة التشغيل (OS) والولوج الرسومي</span>
                                      </h4>
                                      <ul className="text-[10px] sm:text-xs text-slate-800 space-y-1.5 leading-relaxed font-bold">
                                        <li>• <span className="text-teal-600">وظيفة الـ OS:</span> الوسيط العبقري المنظم الذي يشغل التطبيقات الخدمية ويوفر الواجهات الرسومية ذات الألوان والأزرار المريحة.</li>
                                        <li>• <span className="text-purple-600">أمثلة مقررة:</span> أنظمة الأوامر النصية البسيطة (DOS) مقابل أنظمة التوجيه الرسومية البديهية الشاملة (Windows).</li>
                                      </ul>
                                    </div>
                                  )}

                                  {pptCurrentSlide === 3 && (
                                    <div className="space-y-2 animate-fadeIn">
                                      <h4 className="text-xs sm:text-sm font-extrabold text-orange-600 flex items-center gap-1 border-b pb-1">
                                        <span>الشريحة الرابعة: شبكة المعلومات وعناوين IP</span>
                                      </h4>
                                      <ul className="text-[10px] sm:text-xs text-slate-800 space-y-1.5 leading-relaxed font-bold">
                                        <li>• <span className="text-indigo-600">عنوان بروتوكول الإنترنت IP:</span> المعرّف الرقمي الخاص بأي حاسوب أو طابعة على شبكات المعمل المشتركة.</li>
                                        <li>• <span className="text-emerald-600">أمن الحفظ:</span> الضغط المستمر على أزرار الحفظ (Notepad Notepad / Word Saving) يقيك شر انقطاع الطاقة المفاجئ وضياع جهودك.</li>
                                      </ul>
                                    </div>
                                  )}

                                  <div className="text-left text-[9px] text-zinc-400 font-extrabold pt-2 border-t mt-3 flex justify-between">
                                    <span>المجموع التراكمي للمشاهدة: +10 XP</span>
                                    <span>برنامج PowerPoint المدرسي</span>
                                  </div>
                                </div>

                                {/* Slides toggler buttons */}
                                <div className="flex justify-between items-center">
                                  <button
                                    disabled={pptCurrentSlide === 0}
                                    onClick={() => { playSound('click'); setPptCurrentSlide(prev => Math.max(0, prev - 1)); }}
                                    className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black border transition ${pptCurrentSlide === 0 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-800 active:scale-95'}`}
                                  >
                                    ◀ الشريحة السابقة
                                  </button>
                                  
                                  <span className="text-[10px] text-slate-500 font-extrabold">الشريحة {pptCurrentSlide + 1} من أصل 4</span>
                                  
                                  <button
                                    disabled={pptCurrentSlide === 3}
                                    onClick={() => { playSound('click'); setPptCurrentSlide(prev => Math.min(3, prev + 1)); }}
                                    className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black border transition ${pptCurrentSlide === 3 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-800 active:scale-95'}`}
                                  >
                                    الشريحة التالية ▶
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* App 6: Web Browser with address / IP enter (New) */}
                            {winOpenApp === 'browser' && (
                              <div className="space-y-3 text-right">
                                
                                {/* Address / IP entering Bar */}
                                <div className="flex gap-2 items-center" dir="ltr">
                                  <div className="bg-slate-150 p-1 px-2 rounded-lg text-xs font-black select-none border">🌐 Browser</div>
                                  <input 
                                    type="text"
                                    value={browserUrl}
                                    onChange={(e) => setBrowserUrl(e.target.value)}
                                    placeholder="Enter IP (e.g. 192.168.1.1) or web address..."
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        playSound('click');
                                      }
                                    }}
                                    className="flex-1 bg-slate-50 border p-1 rounded-xl text-xs font-mono font-black border-slate-350 outline-none focus:ring-1 focus:ring-cyan-500 text-left"
                                  />
                                  <button
                                    onClick={() => playSound('click')}
                                    className="bg-cyan-650 text-white text-[10px] font-black px-3.5 py-1.5 rounded-xl cursor-pointer active:scale-95 transition"
                                  >
                                    Go 🌐
                                  </button>
                                </div>

                                {/* Simulated Browser Canvas Frame */}
                                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 shadow-inner min-h-[190px] text-zinc-900 overflow-y-auto">
                                  
                                  {/* Case 1: IP Router Config Gateway Page 192.168.1.1 */}
                                  {browserUrl === '192.168.1.1' ? (
                                    <div className="space-y-2 animate-fadeIn text-right">
                                      <div className="bg-indigo-600 text-white p-2 rounded-xl text-center font-extrabold text-[11px] flex justify-between items-center mb-2">
                                        <span>بوابة التحكم بالراوتر اللاسلكي</span>
                                        <span className="text-[9px] bg-indigo-805 px-1.5 py-0.5 rounded">V6.0-SUNDAN-ICT</span>
                                      </div>
                                      <p className="text-[10px] text-zinc-500 font-bold block mb-1">تمت الاستجابة للعنوان المحدد: <span className="font-mono text-zinc-800 bg-zinc-200 px-1 py-0.2 rounded text-[11.5px]">192.168.1.1 (Gateway IP)</span></p>
                                      
                                      <div className="grid grid-cols-2 gap-2 text-[9.5px] font-bold text-slate-800">
                                        <div className="border p-2 bg-white rounded-lg">
                                          <span className="text-indigo-600 block text-[9.5px]">حالة الاتصال بالإنترنت (WAN):</span>
                                          <span className="text-emerald-600">● متّصل (NileFiber Active)</span>
                                        </div>
                                        <div className="border p-2 bg-white rounded-lg">
                                          <span className="text-indigo-600 block text-[9.5px]">بروتوكول DHCP للشبكة:</span>
                                          <span className="text-zinc-600">مفعّل (يوزع الآي بي تلقائياً)</span>
                                        </div>
                                      </div>

                                      <div className="p-2.5 bg-yellow-50 border border-yellow-250 text-[10px] rounded-xl text-yellow-800 leading-snug">
                                        📚 <span className="font-extrabold">من كتيب الحاسوب للصف السادس:</span> نلاحظ عبر إعدادات الموجه المنزلي أن الأجهزة الموصلة تأخذ عنواناً رقمياً فريداً لتبادل حزم البيانات دون تعارض بالشبكة المحلية.
                                      </div>
                                    </div>
                                  ) : 
                                  
                                  /* Case 2: School Digital server library 192.168.1.10 */
                                  browserUrl === '192.168.1.10' ? (
                                    <div className="space-y-2.5 animate-fadeIn text-right">
                                      <div className="bg-cyan-600 text-white p-2 rounded-xl text-center font-extrabold text-[11.5px] flex justify-between items-center mb-1">
                                        <span>🏛️ المخزن الرقمي لشبكة مدرسة الخرطوم الابتدائية</span>
                                        <span className="text-[9px] bg-cyan-755 px-1.5 py-0.5 rounded">شابك</span>
                                      </div>
                                      <p className="text-[10px] text-zinc-500 font-semibold leading-tight">العنوان المطلوب متاح داخلياً: <span className="font-mono text-slate-800 bg-slate-200 px-1 py-0.2 rounded text-[11.5px]">192.168.1.10 (School Intranet Host)</span></p>
                                      
                                      <div className="space-y-1.5 text-[10.5px] font-bold">
                                        <div className="border p-2 bg-white rounded-xl flex justify-between items-center hover:bg-slate-50 transition">
                                          <span>📖 تحميل كتيب الصف السادس حاسوب كاملاً (PDF)</span>
                                          <span className="text-indigo-650 hover:underline cursor-pointer">تحميل مستند 📥</span>
                                        </div>
                                        <div className="border p-2 bg-white rounded-xl flex justify-between items-center hover:bg-slate-50 transition">
                                          <span>📊 تجميعة المعلم عثمان: ملخص الأسئلة والامتحانات المقررة</span>
                                          <span className="text-indigo-650 hover:underline cursor-pointer">تحميل 📄</span>
                                        </div>
                                      </div>

                                      <p className="text-[9px] text-zinc-400 italic">سيرفر المدرسة الداخلي يعمل بمصادقة ألياف النيل التعليمية بنسبة 100%.</p>
                                    </div>
                                  ) :

                                  /* Case 3: Shared Printer server 192.168.10.5 */
                                  browserUrl === '192.168.10.5' ? (
                                    <div className="space-y-2 animate-fadeIn text-right text-[10.5px] font-bold text-slate-800">
                                      <div className="bg-amber-600 text-white p-2 rounded-xl text-center font-black mb-1">🖨️ بوابة إدارة خادم الطابعة المشتركة للمعمل</div>
                                      <p className="text-[10px] text-zinc-500">عنوان الطابعة الفرعي: <span className="font-mono bg-zinc-200 text-zinc-800 px-1 py-0.2 rounded">192.168.10.5</span></p>
                                      <div className="border p-3 bg-white rounded-xl space-y-1 text-right leading-relaxed shadow-sm">
                                        <p>🔌 <span className="text-indigo-600">موديل الطابعة:</span> Sudan-Shield Network Pro v50</p>
                                        <p>🟢 <span className="text-emerald-600">الحالة العامة:</span> خمول - بانتظار إرسال الأوراق</p>
                                        <p>📑 <span className="text-slate-500">قائمة المهام:</span> لا توجد مستندات بانتظار الطبع حالياً</p>
                                      </div>
                                    </div>
                                  ) :

                                  /* Case 4: portal sudan-edu.net */
                                  browserUrl.includes('sudan-edu.net') ? (
                                    <div className="space-y-3.5 animate-fadeIn text-right text-zinc-800">
                                      <div className="bg-gradient-to-r from-red-600 to-green-600 text-white p-3 rounded-2xl text-center shadow-md">
                                        <span className="block text-xs font-black">🇸🇩 البوابة والمنصة التعليمية القومية لجمهورية السودان</span>
                                        <span className="text-[9px] text-white/80 block mt-0.5">ترشيد تكنولوجي من أجل أجيال السودان المشرقة</span>
                                      </div>
                                      
                                      <p className="text-[10.5px] leading-relaxed font-semibold">
                                        تعد هذه المنصة هي الموجه الوطني لتنزيل الكتب المدرسية والتعاميم الوزارية لجميع الصفوف، خاصة منهج تكنولوجيا المعلومات والاتصالات الحديث الموجه لمدارس السودان.
                                      </p>

                                      <div className="p-2 bg-zinc-150 rounded-xl text-[9px] text-zinc-500 flex justify-between items-center">
                                        <span>نطاق الوصول معتمد وحاصل على وثيقة الأمان الرقمية.</span>
                                        <span className="font-mono text-zinc-700">HTTP/2 Secure SSL</span>
                                      </div>
                                    </div>
                                  ) :

                                  /* Generic Default Case */
                                  (
                                    <div className="space-y-2 text-right">
                                      <h5 className="font-extrabold text-xs text-indigo-700 flex items-center gap-1">
                                        <span>🔍 محرك البحث التربوي للمعمل: الاتصالات والشبكة</span>
                                      </h5>
                                      <p className="text-[10.5px] leading-relaxed font-semibold text-slate-700">
                                        يرجو معالج المتصفح التوضيح بأن العناوين المعملية تتصل ببروتوكولات الإنترنت المسماة بـ IP Addresses. 
                                      </p>
                                      
                                      <div className="bg-slate-100 p-2 text-[9.5px] text-zinc-500 rounded-xl leading-relaxed font-bold border-l-4 border-cyan-400">
                                        📌 <span className="text-cyan-600 font-extrabold">جرب إدخال العناوين التالية للوصول لمواقع المعمل:</span>
                                        <ul className="list-disc pr-3.5 mt-1 space-y-0.5 select-text">
                                          <li>إدخال <span className="font-mono text-cyan-605">192.168.1.1</span> للولوج لبوابة جهاز الراوتر المنزلي.</li>
                                          <li>إدخال <span className="font-mono text-cyan-605">192.168.1.10</span> للولوج للمخزن والكتب بسيرفر كتاب الحاسوب.</li>
                                          <li>إدخال <span className="font-mono text-cyan-605">192.168.10.5</span> لرؤية خادم طابعة الشبكة المشتركة.</li>
                                          <li>كتابة العنوان <span className="font-mono text-emerald-605">sudan-edu.net</span> لفتح منصة وزارة التربية والتعليم الوطنية.</li>
                                        </ul>
                                      </div>
                                    </div>
                                  )}

                                </div>
                              </div>
                            )}

                            {/* App 7: Files Explorer database (New) */}
                            {winOpenApp === 'files' && (
                              <div className="space-y-3 text-right">
                                <h5 className="text-[10px] text-zinc-500 font-extrabold pb-1 border-b flex justify-between">
                                  <span>📁 المستندات والملفات المخزنة بذاكرة القرص الصلب:</span>
                                  <span>{savedFiles.length} ملفات مدرجة</span>
                                </h5>

                                <div className="grid grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                                  {savedFiles.map((file, i) => (
                                    <div
                                      key={i}
                                      onDoubleClick={() => {
                                        playSound('click');
                                        if (file.type === 'word') {
                                          setWordDocumentName(file.name.replace('.doc', ''));
                                          setWordContentText(file.content);
                                          setWinOpenApp('word');
                                          setWinMinimized(false);
                                        } else {
                                          setNotepadText(file.content);
                                          setSavedNotepads(file.name);
                                          setWinOpenApp('notepad');
                                          setWinMinimized(false);
                                        }
                                      }}
                                      onClick={() => {
                                        playSound('click');
                                      }}
                                      className="border border-slate-200/80 p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 transition cursor-pointer flex items-center gap-2 select-none group text-right"
                                      title="انقر نقراً مزدوجاً لفتح واسترجاع المخرجات!"
                                    >
                                      <div className="bg-amber-100 p-1.5 rounded-lg group-hover:scale-105 duration-100 shrink-0">
                                        {file.type === 'word' ? (
                                          <FileText className="w-5 h-5 text-emerald-600" />
                                        ) : (
                                          <FileText className="w-5 h-5 text-blue-600" />
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <span className="text-[10px] text-slate-800 font-black block truncate leading-tight">{file.name}</span>
                                        <span className="text-[8px] text-slate-400 block font-bold leading-none mt-0.5">{file.type === 'word' ? 'مستند Word' : 'مفكرة نصية'}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="p-2 bg-amber-50 border border-amber-200 text-[9px] text-amber-850 rounded-xl leading-relaxed flex gap-1 items-start">
                                  <span className="text-xs">💡</span>
                                  <span><span className="font-black">مهارة تكنولوجية:</span> انقر مرتين (Double Click) على أي ملف بالعلبة أعلاه لاستيراده فوراً وإعادة تحريره لتعديل الدرس بنظام التشغيل الرسومي الرائع!</span>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      )}

                    </div>

                    {/* Taskbar bottom panel with active minimized apps restore indicators */}
                    <div className="w-full bg-slate-900/85 backdrop-blur border-t border-white/20 p-2 rounded-2xl flex justify-between items-center text-white text-[11px] font-black shrink-0 relative mt-auto z-10">
                      <div className="flex items-center gap-2" dir="ltr">
                        <span className="text-slate-405 font-mono text-[9.5px]"> Sudan SHIELD (١١:٣٠ م) </span>
                        <span className="text-cyan-400 flex items-center gap-1 text-[9px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                          <span>متصل 🟢</span>
                        </span>
                      </div>
                      
                      {/* Active open window taskbar indicator tabs to restore minimized apps */}
                      {winOpenApp !== 'none' && (
                        <div className="flex gap-2 justify-center max-w-[150px] overflow-hidden truncate px-1">
                          <button
                            onClick={() => { playSound('click'); setWinMinimized(!winMinimized); }}
                            className={`px-2 py-0.5 rounded text-[8.5px] font-bold border transition ${
                              winMinimized 
                                ? 'bg-indigo-900/30 border-rose-500/50 text-indigo-300 animate-pulse' 
                                : 'bg-[#1e1b4b]/80 border-indigo-400 text-cyan-300'
                            }`}
                            title="اضغط لاستعادة النافذة الكامنة"
                          >
                            <span>🔋 {winOpenApp === 'notepad' ? 'المفكرة' : winOpenApp === 'calculator' ? 'الحاسب' : winOpenApp === 'paint' ? 'الرسام' : winOpenApp === 'word' ? 'وورد' : winOpenApp === 'powerpoint' ? 'العرض' : winOpenApp === 'browser' ? 'المتصفح' : 'الملفات'}</span>
                          </button>
                        </div>
                      )}

                      {/* Apps quick launch shortcuts on taskbar */}
                      <div className="flex gap-2.5 justify-center text-xs px-1">
                        <span 
                          onClick={() => { playSound('click'); setWinOpenApp('notepad'); setWinMinimized(false); }}
                          className="cursor-pointer hover:bg-white/10 p-1 rounded" title="المفكرة السريعة"
                        >
                          📝
                        </span>
                        <span 
                          onClick={() => { playSound('click'); setWinOpenApp('calculator'); setWinMinimized(false); }}
                          className="cursor-pointer hover:bg-white/10 p-1 rounded" title="الحاسبة الرسومية"
                        >
                          🔢
                        </span>
                        <span 
                          onClick={() => { playSound('click'); setWinOpenApp('paint'); setWinMinimized(false); }}
                          className="cursor-pointer hover:bg-white/10 p-1 rounded" title="الرسام المتقن"
                        >
                          🎨
                        </span>
                        <span 
                          onClick={() => { playSound('click'); setWinOpenApp('word'); setWinMinimized(false); }}
                          className="cursor-pointer hover:bg-white/10 p-1 rounded" title="وورد المدرسي"
                        >
                          📄
                        </span>
                        <span 
                          onClick={() => { playSound('click'); setWinOpenApp('files'); setWinMinimized(false); }}
                          className="cursor-pointer hover:bg-white/10 p-1 rounded" title="مجلد المستندات والملفات"
                        >
                          📁
                        </span>
                      </div>

                      {/* Windows start button */}
                      <button 
                        onClick={() => { 
                          playSound('success'); 
                          alert('🇸🇩 مرحباً بك في واجهة ميكروسوفت ويندوز الرسومية للمنهج السوداني!\nلقد تم تصميم هذه البيئة الافتراضية كاملة لدعم ممارسات الصف السادس الأكاديمية:\n\n1. المفكرة وكتابة الأوراق.\n2. وورد وتخزين الملفات الدائمة.\n3. بوربوينت واستعراض الشرائح التفاعلية للأوراق الدراسية.\n4. متصفح الشبكات لطلب عناوين الـ IP الخاصة بالراوتر والسيرفرات.\n5. لوحة الرسام البكسلية لتنمية الحس الإبداعي للفنانين!');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-2.5 py-1 text-white font-extrabold text-[9px] flex items-center gap-1 shadow cursor-pointer active:scale-95 shrink-0"
                      >
                        <span>قائمة البدء 🚀</span>
                        <span>🇸🇩</span>
                      </button>
                    </div>

                  </div>
                )}

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
