/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unit, Lesson, UserStats, SimulatorType } from './types';
import { UNITS_DATA, QUIZ_QUESTIONS, ACHIEVEMENTS_DATA } from './data';
import { MainLobby } from './components/MainLobby';
import { AnimatedIcon } from './components/AnimatedIcon';
import { UnitMap } from './components/UnitMap';
import { LessonDetail } from './components/LessonDetail';
import { ExamCenter } from './components/ExamCenter';
import { UserProfileCard } from './components/UserProfileCard';
import { InteractiveTools } from './components/InteractiveTools';
import { GoogleWorkspaceHub } from './components/GoogleWorkspaceHub';
import { ComputerAssemblyLab } from './components/ComputerAssemblyLab';
import { WorksheetGenerator } from './components/WorksheetGenerator';
import { BookOpen, Trophy, Sparkles, Award, Star, ListCollapse, Home, ShieldAlert, Laptop, ChevronLeft, Cpu, FileText, Wifi, WifiOff } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ict_sixth_grade_stats_v3';

const DEFAULT_STATS: UserStats = {
  name: 'تلميذ مجتهد',
  avatar: '💻',
  points: 100, // Starts with some welcome points!
  rank: 'تلميذ متطلع 🌱',
  completedLessons: [],
  completedExams: [],
  theoreticalHighScore: 0,
  practicalHighTaskCount: 0,
  achievements: ACHIEVEMENTS_DATA
};

export default function App() {
  // Navigation & Active items state
  const [currentView, setCurrentView] = useState<'lobby' | 'map' | 'lesson' | 'exam' | 'profile' | 'google' | 'assembly_lab' | 'worksheets'>('lobby');
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeSimulator, setActiveSimulator] = useState<SimulatorType | null>(null);

  // Offline support tracking state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // User Stats loaded from storage with safe fallbacks
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Sync saved achievements with possibly updated lists
          const mergedAchievements = ACHIEVEMENTS_DATA.map(original => {
            const savedItem = parsed.achievements?.find((a: any) => a.id === original.id);
            return savedItem ? { ...original, ...savedItem } : original;
          });
          setStats({
            ...DEFAULT_STATS,
            ...parsed,
            achievements: mergedAchievements
          });
        }
      } catch (err) {
        setStats(DEFAULT_STATS);
      }
    }
  }, []);

  const saveStats = (updated: UserStats) => {
    setStats(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Tone sound generator helper
  const triggerSuccessSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  // Emit Points & Save
  const handleEmitPoints = (pts: number) => {
    const nextPoints = stats.points + pts;
    const updated = {
      ...stats,
      points: nextPoints
    };
    saveStats(updated);
  };

  // Trigger achievement unlock
  const handleEmitAchievement = (achId: string) => {
    const isAlreadyUnlocked = stats.achievements.find(a => a.id === achId)?.unlocked;
    if (isAlreadyUnlocked) return;

    triggerSuccessSound();
    const nextAch = stats.achievements.map((ach) => {
      if (ach.id === achId) {
        return {
          ...ach,
          unlocked: true,
          unlockedAt: new Date().toLocaleDateString('ar-SD')
        };
      }
      return ach;
    });

    const updated = {
      ...stats,
      achievements: nextAch,
      points: stats.points + 40 // +40 points prize for achievements
    };
    saveStats(updated);
  };

  const handleMarkLessonCompleted = (lessonId: string) => {
    if (stats.completedLessons.includes(lessonId)) return;

    triggerSuccessSound();
    const nextLessons = [...stats.completedLessons, lessonId];
    
    // Check if user completed all lessons in Unit 1 to trigger networks badge
    let nextAchievements = [...stats.achievements];
    
    const updated = {
      ...stats,
      completedLessons: nextLessons,
      points: stats.points + 20 // 20 points prize for lessons studied
    };
    saveStats(updated);
  };

  const handleMarkExamCompleted = (unitId: string) => {
    if (stats.completedExams.includes(unitId)) return;
    triggerSuccessSound();
    const nextExams = [...stats.completedExams, unitId];
    const updated = {
      ...stats,
      completedExams: nextExams,
      points: stats.points + 50 // 50 points prize for exam passed
    };
    saveStats(updated);
  };

  const handleUpdateName = (name: string) => {
    const updated = {
      ...stats,
      name
    };
    saveStats(updated);
  };

  const handleSelectAvatar = (avatar: string) => {
    const updated = {
      ...stats,
      avatar
    };
    saveStats(updated);
  };

  const handleResetProgress = () => {
    saveStats(DEFAULT_STATS);
    setCurrentView('lobby');
    setActiveUnit(null);
    setActiveLessonId(null);
    setActiveSimulator(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden" dir="rtl">
      
      {/* Decorative background grid pattern from design theme */}
      <div className="fixed inset-0 artistic-grid-bg opacity-10 pointer-events-none z-0"></div>

      {/* Dynamic Header */}
      {currentView !== 'assembly_lab' && (
        <header className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b-4 border-indigo-500 z-35 shadow-lg shrink-0 select-none relative">
          <div className="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center gap-4">
            
            {/* Logo Brand */}
            <div
              onClick={() => setCurrentView('lobby')}
              className="flex items-center gap-3 cursor-pointer active:scale-95 duration-100"
            >
              <div className="bg-cyan-400 text-slate-900 rounded-xl p-2.5 rotate-6 shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center justify-center shrink-0">
                <Laptop className="w-5 h-5 text-slate-900 font-black" />
              </div>
              <div className="text-right">
                <h1 className="font-sans font-black text-white text-sm md:text-base tracking-tight leading-snug">
                  تكنولوجيا المعلومات والاتصالات
                </h1>
                <p className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest leading-none mt-0.5">بوابة المبدعين الصغار • الصف السادس</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex gap-2">
              <button
                onClick={() => setCurrentView('lobby')}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 ${
                  currentView === 'lobby' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]' : 'text-indigo-200 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <AnimatedIcon active={currentView === 'lobby'} type="float">
                  <Home className="w-4 h-4" />
                </AnimatedIcon>
                <span>الرئيسية اللوبي</span>
              </button>
              <button
                onClick={() => setCurrentView('map')}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 ${
                  currentView === 'map' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]' : 'text-indigo-200 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <AnimatedIcon active={currentView === 'map'} type="bounce">
                  <BookOpen className="w-4 h-4" />
                </AnimatedIcon>
                <span>خريطة الوحدات 🗺️</span>
              </button>
              <button
                onClick={() => { setActiveUnit(null); setCurrentView('exam'); }}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 ${
                  currentView === 'exam' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]' : 'text-indigo-200 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <AnimatedIcon active={currentView === 'exam'} type="pulse">
                  <Trophy className="w-4 h-4" />
                </AnimatedIcon>
                <span>مركز الاختبارات 🥇</span>
              </button>
              <button
                onClick={() => setCurrentView('google')}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 ${
                  currentView === 'google' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]' : 'text-indigo-200 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <AnimatedIcon active={currentView === 'google'} type="float">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                </AnimatedIcon>
                <span>أدوات غوغل ☁️</span>
              </button>
              <button
                onClick={() => setCurrentView('assembly_lab')}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 ${
                  currentView === 'assembly_lab' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]' : 'text-indigo-200 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <AnimatedIcon active={currentView === 'assembly_lab'} type="shake">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </AnimatedIcon>
                <span>معمل الحاسوب 💻</span>
              </button>
              <button
                onClick={() => setCurrentView('worksheets')}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 ${
                  currentView === 'worksheets' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]' : 'text-indigo-200 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <AnimatedIcon active={currentView === 'worksheets'} type="pulse">
                  <FileText className="w-4 h-4 text-indigo-400" />
                </AnimatedIcon>
                <span>أوراق العمل 📝</span>
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 ${
                  currentView === 'profile' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]' : 'text-indigo-200 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <AnimatedIcon active={currentView === 'profile'} type="shake">
                  <Award className="w-4 h-4" />
                </AnimatedIcon>
                <span>الملف والشهادة 🎓</span>
              </button>
            </nav>

            {/* Navigation & Connection indicators */}
            <div className="flex items-center gap-3">
              {isOnline ? (
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <Wifi className="w-3.5 h-3.5" />
                  <span>جاهز للعمل دون اتصال 📶</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-[10px] font-black text-amber-400 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>أنت الآن تعمل بدون إنترنت 📴</span>
                </div>
              )}

              {/* User scoreboard shortcut */}
              <div
                onClick={() => setCurrentView('profile')}
                className="bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-full border border-indigo-500/30 flex items-center gap-3 cursor-pointer select-none transition shadow-sm"
              >
                <div className="w-7 h-7 rounded-sm bg-cyan-400 text-slate-900 border flex items-center justify-center text-base shadow-inner shrink-0 font-bold">
                  {stats.avatar}
                </div>
                <div className="text-right font-sans">
                  <span className="block text-[8px] text-indigo-300 font-bold leading-none">مجموع النقاط</span>
                  <span className="text-xs font-black text-yellow-400 font-mono tracking-tight leading-none block mt-1">{stats.points} XP</span>
                </div>
              </div>
            </div>

          </div>
        </header>
      )}

      {/* Main page content layout container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <MainLobby
                units={UNITS_DATA}
                stats={stats}
                onSelectUnit={(unit) => {
                  setActiveUnit(unit);
                  setCurrentView('lesson');
                }}
                onOpenProfile={() => setCurrentView('profile')}
                onOpenAssemblyLab={() => setCurrentView('assembly_lab')}
              />
            </motion.div>
          )}

          {currentView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <UnitMap
                units={UNITS_DATA}
                stats={stats}
                onSelectUnit={(unit) => {
                  setActiveUnit(unit);
                  setCurrentView('lesson');
                }}
                onSelectExam={(unit) => {
                  setActiveUnit(unit);
                  setCurrentView('exam');
                }}
              />
            </motion.div>
          )}

          {currentView === 'lesson' && activeUnit && (
            <motion.div
              key={`lesson-${activeUnit.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <LessonDetail
                unit={activeUnit}
                stats={stats}
                selectedLessonId={activeLessonId}
                onSelectLesson={(lessonId) => setActiveLessonId(lessonId)}
                onMarkLessonCompleted={handleMarkLessonCompleted}
                onLaunchSimulator={(sim, lesId) => {
                  setActiveLessonId(lesId);
                  setActiveSimulator(sim as any);
                }}
                onBackToMap={() => setCurrentView('map')}
              />
            </motion.div>
          )}

          {currentView === 'exam' && (
            <motion.div
              key={activeUnit ? `exam-${activeUnit.id}` : 'exam-custom'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ExamCenter
                unit={activeUnit}
                questions={QUIZ_QUESTIONS}
                stats={stats}
                onEmitPoints={handleEmitPoints}
                onEmitExamCompleted={handleMarkExamCompleted}
                onEmitAchievement={handleEmitAchievement}
                onLaunchSimulator={(sim) => {
                  setActiveSimulator(sim as any);
                }}
                onBackToMap={() => setCurrentView('map')}
              />
            </motion.div>
          )}

          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <UserProfileCard
                stats={stats}
                onUpdateName={handleUpdateName}
                onSelectAvatar={handleSelectAvatar}
                onResetProgress={handleResetProgress}
              />
            </motion.div>
          )}

          {currentView === 'google' && (
            <motion.div
              key="google"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <GoogleWorkspaceHub
                stats={stats}
                onEmitPoints={handleEmitPoints}
                onEmitAchievement={handleEmitAchievement}
              />
            </motion.div>
          )}

          {currentView === 'assembly_lab' && (
            <motion.div
              key="assembly_lab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ComputerAssemblyLab
                stats={stats}
                onEmitPoints={handleEmitPoints}
                onEmitAchievement={handleEmitAchievement}
                onClose={() => setCurrentView('lobby')}
              />
            </motion.div>
          )}

          {currentView === 'worksheets' && (
            <motion.div
              key="worksheets"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <WorksheetGenerator
                stats={stats}
                onEmitPoints={handleEmitPoints}
                onEmitAchievement={handleEmitAchievement}
                onClose={() => setCurrentView('lobby')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Sticky Tab bar */}
      {currentView !== 'assembly_lab' && (
        <div className="md:hidden fixed bottom-3 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-2 z-35 shadow-lg flex justify-around items-center select-none">
          <button
            onClick={() => setCurrentView('lobby')}
            className={`flex flex-col items-center p-1 font-bold text-[9px] gap-1 ${currentView === 'lobby' ? 'text-cyan-400' : 'text-indigo-300'}`}
          >
            <AnimatedIcon active={currentView === 'lobby'} type="float">
              <Home className="w-5 h-5" />
            </AnimatedIcon>
            <span>الرئيسية</span>
          </button>
          <button
            onClick={() => setCurrentView('map')}
            className={`flex flex-col items-center p-1 font-bold text-[9px] gap-1 ${currentView === 'map' ? 'text-cyan-400' : 'text-indigo-300'}`}
          >
            <AnimatedIcon active={currentView === 'map'} type="bounce">
              <BookOpen className="w-5 h-5" />
            </AnimatedIcon>
            <span>الوحدات</span>
          </button>
          <button
            onClick={() => { setActiveUnit(null); setCurrentView('exam'); }}
            className={`flex flex-col items-center p-1 font-bold text-[9px] gap-1 ${currentView === 'exam' ? 'text-cyan-400' : 'text-indigo-300'}`}
          >
            <AnimatedIcon active={currentView === 'exam'} type="pulse">
              <Trophy className="w-5 h-5" />
            </AnimatedIcon>
            <span>الاختبارات</span>
          </button>
          <button
            onClick={() => setCurrentView('google')}
            className={`flex flex-col items-center p-1 font-bold text-[9px] gap-1 ${currentView === 'google' ? 'text-cyan-400' : 'text-indigo-300'}`}
          >
            <AnimatedIcon active={currentView === 'google'} type="float">
              <Laptop className="w-5 h-5" />
            </AnimatedIcon>
            <span>جوجل ☁️</span>
          </button>
          <button
            onClick={() => setCurrentView('assembly_lab')}
            className={`flex flex-col items-center p-1 font-bold text-[9px] gap-1 ${currentView === 'assembly_lab' ? 'text-cyan-400' : 'text-indigo-300'}`}
          >
            <AnimatedIcon active={currentView === 'assembly_lab'} type="shake">
              <Cpu className="w-5 h-5" />
            </AnimatedIcon>
            <span>العتاد 🛠️</span>
          </button>
          <button
            onClick={() => setCurrentView('worksheets')}
            className={`flex flex-col items-center p-1 font-bold text-[9px] gap-1 ${currentView === 'worksheets' ? 'text-cyan-400' : 'text-indigo-300'}`}
          >
            <AnimatedIcon active={currentView === 'worksheets'} type="pulse">
              <FileText className="w-5 h-5" />
            </AnimatedIcon>
            <span>أوراق العمل 📝</span>
          </button>
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center p-1 font-bold text-[9px] gap-1 ${currentView === 'profile' ? 'text-cyan-400' : 'text-indigo-300'}`}
          >
            <AnimatedIcon active={currentView === 'profile'} type="shake">
              <Award className="w-5 h-5" />
            </AnimatedIcon>
            <span>شهادتي</span>
          </button>
        </div>
      )}

      {/* Interactive overlay labs popup for simulators */}
      {activeSimulator && activeLessonId && (
        <InteractiveTools
          type={activeSimulator}
          lessonId={activeLessonId}
          stats={stats}
          onEmitPoints={handleEmitPoints}
          onEmitAchievement={handleEmitAchievement}
          onClose={() => {
            setActiveSimulator(null);
            // After simulator, completed study of that lesson if initialized from detail
            if (activeLessonId !== 'generic_challenge') {
              handleMarkLessonCompleted(activeLessonId);
            }
          }}
        />
      )}

      {/* Sudan Educational Credentials footer */}
      {currentView !== 'assembly_lab' && (
        <footer className="bg-slate-950 border-t-2 border-indigo-900 py-6 text-center text-[10px] md:text-xs text-indigo-300 select-none mt-auto relative z-10" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 space-y-1.5 font-semibold">
            <p className="text-cyan-400 font-bold">بوابة تكنولوجيا المعلومات والاتصالات لمستقبل السودان الرقمي 🇸🇩 • طبعة المبدعين الصغار</p>
            <p>تم تصميم الموقع بواسطة عثمان المنقوري</p>
            <p className="text-[9px] opacity-75">الموقع متوافق بالكامل مع طبعة الكتاب المدرسي للصف السادس الابتدائي ٢٠٢٠ م</p>
          </div>
        </footer>
      )}

    </div>
  );
}
