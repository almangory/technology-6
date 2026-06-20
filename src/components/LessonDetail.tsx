import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unit, Lesson, UserStats } from '../types';
import { BookOpen, CheckCircle, Award, ArrowRight, ArrowLeft, Lightbulb, PlayCircle, Eye, Check, Image, Lock, ShieldCheck, RefreshCw } from 'lucide-react';

const DEFAULT_LESSON_IMAGES: Record<string, string> = {
  "u1-l1": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
  "u1-l2": "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80",
  "u1-l3": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  "u1-l4": "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80",
  "u1-l5": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  "u2-l1": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
  "u2-l2": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
  "u2-l3": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
  "u2-l4": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  "u3-l1": "https://images.unsplash.com/photo-1496181130204-7552cc145cdb?auto=format&fit=crop&w=800&q=80",
  "u3-l2": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
  "u3-l3": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
  "u4-l1": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
  "u4-l2": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
  "u4-l3": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
  "u4-l4": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
  "u4-l5": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
  "u4-l6": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  "u5-l1": "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80",
  "u5-l2": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80"
};

function convertGoogleDriveUrl(url: string): string {
  const cleanUrl = url.trim();
  const match = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//) || 
                cleanUrl.match(/id=([a-zA-Z0-9_-]+)/) ||
                cleanUrl.match(/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return cleanUrl;
}

interface LessonDetailProps {
  unit: Unit;
  stats: UserStats;
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
  onMarkLessonCompleted: (lessonId: string) => void;
  onLaunchSimulator: (simulator: string, lessonId: string) => void;
  onBackToMap: () => void;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({
  unit,
  stats,
  selectedLessonId,
  onSelectLesson,
  onMarkLessonCompleted,
  onLaunchSimulator,
  onBackToMap
}) => {
  // Select first lesson by default if none selected or if selected is outside current unit
  const lessonsInUnit = unit.lessons;
  const currentLessonId = selectedLessonId && lessonsInUnit.some(l => l.id === selectedLessonId)
    ? selectedLessonId
    : lessonsInUnit[0]?.id;

  const currentLesson = lessonsInUnit.find(l => l.id === currentLessonId) || lessonsInUnit[0];

  const isCompleted = currentLesson ? stats.completedLessons.includes(currentLesson.id) : false;

  // Local storage customization for images
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('school_lesson_images');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Educator administrative secret modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [validationSuccess, setValidationSuccess] = useState('');

  const handleVerifyPassword = () => {
    if (password.trim() === '20302060') {
      setIsAuthorized(true);
      setPasswordError('');
      setValidationSuccess('تم تفعيل الصلاحيات الإدارية بنجاح! يمكن تعديل روابط الصور أو استعادتها.');
    } else {
      setPasswordError('الصفة الإدارية غير صحيحة، يرجى إدخال الباسورد الموحد الصحيح للمعلّم المعين.');
      setValidationSuccess('');
    }
  };

  const handleSaveCustomImage = () => {
    if (!currentLesson) return;
    const finalUrl = convertGoogleDriveUrl(newUrlInput);
    const updated = { ...customImages, [currentLesson.id]: finalUrl };
    setCustomImages(updated);
    try {
      localStorage.setItem('school_lesson_images', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsEditModalOpen(false);
    setIsAuthorized(false);
    setPassword('');
  };

  const handleResetImage = () => {
    if (!currentLesson) return;
    const updated = { ...customImages };
    delete updated[currentLesson.id];
    setCustomImages(updated);
    try {
      localStorage.setItem('school_lesson_images', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsEditModalOpen(false);
    setIsAuthorized(false);
    setPassword('');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Unit Header Accent */}
      <div className={`p-5 rounded-3xl bg-gradient-to-r ${unit.color} text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-6 -translate-y-6"></div>
        <div className="text-right space-y-1">
          <button
            onClick={onBackToMap}
            className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-1 font-bold text-xs transition flex items-center gap-1.5 focus:outline-none mb-2"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لخريطة الوحدات</span>
          </button>
          <h2 className="text-xl md:text-2xl font-black font-sans leading-tight">
            الوحدة {unit.number}: {unit.title}
          </h2>
          <p className="text-xs text-white/85 tracking-widest font-mono uppercase">
            {unit.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3.5 py-2 rounded-2xl text-center backdrop-blur-md">
            <span className="block text-2xl font-black tracking-tight leading-none">{lessonsInUnit.length}</span>
            <span className="text-[10px] text-white/90 font-medium">دروس مقرررة</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* RIGHT COLUMN: Directory/Lessons index list */}
        <div className="lg:col-span-1 bg-slate-900 border-2 border-indigo-500/20 p-4 space-y-3 shadow-md text-right text-white rounded-3xl">
          <h3 className="font-extrabold text-white text-sm border-b border-indigo-500/10 pb-2 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>فهرس الدروس المتاحة</span>
          </h3>
          <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
            {lessonsInUnit.map((lesson) => {
              const active = lesson.id === currentLessonId;
              const completed = stats.completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`w-full text-right p-3 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2.5 transition active:scale-98 border select-none ${
                    active
                      ? 'bg-indigo-950/80 border-cyan-400 text-cyan-400 shadow-sm'
                      : 'bg-slate-950/40 border-indigo-500/10 hover:bg-slate-950 text-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-right">
                    <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                      active ? 'bg-cyan-400 text-slate-900' : 'bg-slate-905 text-indigo-300'
                    }`}>
                      {lesson.pageNumber}
                    </span>
                    <span className="line-clamp-1">{lesson.title}</span>
                  </div>

                  {completed && (
                    <span className="bg-lime-950 border border-lime-500/30 text-lime-400 p-0.5 rounded-full block">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* LEFT COLUMN: Selected lesson detailed content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {currentLesson ? (
              <motion.div
                key={currentLesson.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div className="bg-slate-900 border-2 border-indigo-500/20 p-6 shadow-sm hover:shadow-[8px_8px_0px_#312e81] duration-300 rounded-[35px] space-y-6 text-right text-white">
                  {/* Header Title & Page Tag */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-indigo-500/10 pb-4">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-900 font-extrabold bg-lime-400 px-2.5 py-0.5 rounded-full">
                        الدرس الحالي
                      </span>
                      <h3 className="text-2xl font-black text-white font-sans tracking-tight leading-snug pt-2">
                        {currentLesson.title}
                      </h3>
                    </div>
                    <div className="bg-amber-950/60 text-yellow-500 px-3.5 py-1.5 rounded-2xl border border-amber-500/30 text-xs font-extrabold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"></span>
                      <span>صفحة رقم {currentLesson.pageNumber} بالكتاب المدرسي</span>
                    </div>
                  </div>

                  {/* Lesson Objectives (أهداف الدرس) */}
                  <div className="bg-indigo-950/80 rounded-2xl p-4 border border-indigo-500/20 space-y-2.5">
                    <h4 className="font-extrabold text-cyan-400 text-sm flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      <span>أهداف ومهارات سنتعلمها في هذا الدرس:</span>
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-semibold text-indigo-200 leading-relaxed pr-2">
                      {currentLesson.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 text-xs mt-0.5">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Lesson Cover Banner Image with Teacher Customization Trigger */}
                  {currentLesson && (
                    <div className="relative w-full h-56 sm:h-64 rounded-[24px] overflow-hidden border-2 border-indigo-500/15 group shadow-lg">
                      <img 
                        src={customImages[currentLesson.id] || DEFAULT_LESSON_IMAGES[currentLesson.id] || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"} 
                        alt={currentLesson.title}
                        className="w-full h-full object-cover group-hover:scale-103 duration-500 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20"></div>
                      
                      {/* Left Header Tag */}
                      <div className="absolute top-3 right-3 bg-indigo-950/90 border border-indigo-500/20 text-indigo-200 rounded-xl px-3 py-1 text-[10px] font-black select-none shadow-md">
                        مرفق شرح بصري 📊
                      </div>

                      {/* Right Footer Label */}
                      <div className="absolute bottom-4 right-4 text-right">
                        <span className="text-[9px] bg-cyan-400 text-slate-950 px-2 py-0.5 rounded-full font-black shadow-sm">تطبيق صوري توضيحي 📸</span>
                        <h4 className="text-white text-xs md:text-sm font-black mt-1.5 drop-shadow-md">{currentLesson.title}</h4>
                      </div>

                      {/* Top-Left administrative edit button */}
                      <button
                        onClick={() => {
                          setNewUrlInput(customImages[currentLesson.id] || '');
                          setPassword('');
                          setPasswordError('');
                          setValidationSuccess('');
                          setIsAuthorized(false);
                          setIsEditModalOpen(true);
                        }}
                        className="absolute top-3 left-3 bg-slate-950/90 border border-indigo-500/30 hover:border-cyan-400 text-indigo-300 hover:text-cyan-300 rounded-xl px-2.5 py-1.5 text-[10px] font-black transition flex items-center gap-1 cursor-pointer shadow-xl select-none"
                      >
                        <Image className="w-3.5 h-3.5 text-cyan-300 bg-transparent" />
                        <span>تعديل الصورة (للمعلم) ⚙️</span>
                      </button>
                    </div>
                  )}

                  {/* Explanatory Content (شرح الدرس) */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5 pb-2 border-b border-indigo-500/10">
                      <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
                      <span>الشرح المدرسي الممتع والمبسط</span>
                    </h4>
                    <div className="space-y-3.5 text-indigo-100 text-xs md:text-sm font-semibold leading-relaxed">
                      {currentLesson.content.map((paragraph, i) => (
                        <p key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/10 hover:border-indigo-500/30 hover:bg-slate-950/80 duration-155 transition">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* ACTION ROW: Click to build or toggle complete */}
                  <div className="pt-4 border-t border-indigo-500/10 flex flex-col xl:flex-row gap-4 justify-between items-center">
                    {/* Simulator Lunch Button */}
                    <button
                      onClick={() => onLaunchSimulator(currentLesson.simulator, currentLesson.id)}
                      className="w-full xl:w-auto bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl px-6 py-3.5 font-black text-xs transition duration-150 shadow-[4px_4px_0px_#1e1b4b] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 select-none"
                    >
                      <PlayCircle className="w-5 h-5 text-indigo-250 animate-pulse" />
                      <span>تشغيل المحاكاة والأدوات لـ {currentLesson.interactiveTitle} 🎮</span>
                    </button>

                    {/* Mark Completed Switch Button */}
                    <button
                      onClick={() => onMarkLessonCompleted(currentLesson.id)}
                      disabled={isCompleted}
                      className={`w-full xl:w-auto rounded-2xl px-5 py-3.5 font-bold text-xs transition text-center flex items-center justify-center gap-2 select-none ${
                        isCompleted
                          ? 'bg-lime-950/45 border border-lime-500/40 text-lime-400 cursor-default'
                          : 'bg-slate-950 hover:bg-slate-900 text-indigo-300 hover:text-white border border-indigo-500/20 active:scale-95'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-lime-400 fill-current" />
                          <span>مبروك! لقد أكملت دراسة هذا الدرس (+١٠ نقاط)</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5 text-indigo-400" />
                          <span>اضغط هنا لتأكيد دراسة وفهم الدرس لمكافأة النقاط!</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Helper Banner */}
                <div className="bg-slate-900 border-2 border-dashed border-indigo-500/30 rounded-3xl p-5 flex items-start gap-4 text-white">
                  <span className="text-xl">💡</span>
                  <div className="space-y-1 text-right text-xs">
                    <h5 className="font-bold text-cyan-400">ملاحظة ذكية:</h5>
                    <p className="text-indigo-200/90 font-medium leading-relaxed">
                      أنظمة المحتويات والأدوات الذكية بداخل الدروس هي محاكيات تفاعلية أعدها الخبراء لمحاكاة الأجهزة لكي تجد مادتنا غاية في الجاذبية. اضغط على أزرار تشغيل المحاكاة الآن لتنتقل إلى معمل الكمبيوتر الافتراضي!
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900 border-2 border-indigo-500/20 rounded-3xl p-12 text-center text-indigo-300 text-sm"
              >
                الرجاء اختيار أحد الدروس من جدول الفهرس لبدء الرحلة المنهجية!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Teacher Secret Administrative Auth & Lesson Cover Resetter Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border-2 border-indigo-500 rounded-[30px] p-6 w-full max-w-lg shadow-[0_0_50px_rgba(99,102,241,0.25)] text-right text-white space-y-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-indigo-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600/20 text-indigo-400 p-2 rounded-xl border border-indigo-500/20">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base text-white">بوابة معلم تكنولوجيا الاتصالات ⚙️</h3>
                    <p className="text-[10px] text-indigo-300">تعديل الوسائط والصور المنهجية للصف السادس</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-zinc-400 hover:text-white bg-slate-850 hover:bg-slate-700 p-1 px-2.5 rounded-lg text-xs cursor-pointer"
                >
                  إغلاق ✕
                </button>
              </div>

              {!isAuthorized ? (
                /* PASSWORD SIGN IN FORM */
                <div className="space-y-4">
                  <p className="text-[11px] leading-relaxed text-indigo-200">
                    الدخول إلى هذه المساحة يتطلب التحقق من الحماية والصلاحية للمعلّم المشرف. أدخل رمز المرور الموحد للإدارة المعتمدة لحفظ التعديلات:
                  </p>
                  
                  <div className="space-y-2">
                    <label className="block text-[10.5px] font-black text-cyan-400">باسورد التحقق الإداري الموحد:</label>
                    <input
                      type="password"
                      placeholder="أدخل الرمز الإداري الموحد لقفل التعديل..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleVerifyPassword();
                        }
                      }}
                      className="w-full bg-slate-950 border border-indigo-505/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-center tracking-widest"
                      autoFocus
                    />
                  </div>

                  {passwordError && (
                    <div className="bg-rose-950/45 border border-rose-500/30 text-rose-400 rounded-xl p-3 text-[10px] font-bold">
                      ⚠️ {passwordError}
                    </div>
                  )}

                  <button
                    onClick={handleVerifyPassword}
                    className="w-full bg-gradient-to-r from-indigo-750 to-indigo-600 hover:from-indigo-650 hover:to-indigo-500 text-white text-xs font-black py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-4 h-4" />
                    <span>التحقق من الصلاحيات وتفويض المنصة 🔑</span>
                  </button>
                </div>
              ) : (
                /* EDIT URL & AUTO CONVERT FORM */
                <div className="space-y-4">
                  <div className="bg-lime-950/40 border border-lime-500/25 text-lime-400 p-3 rounded-xl text-[10px] font-bold">
                    ✓ {validationSuccess}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10.5px] font-black text-cyan-400">رابط صورة الدرس الجديد:</label>
                    <input
                      type="text"
                      placeholder="أدخل رابط مباشر للصورة، أو رابط مشاركة قوقل درايف..."
                      value={newUrlInput}
                      onChange={(e) => setNewUrlInput(e.target.value)}
                      className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl p-3 text-xs text-white text-left focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    />
                  </div>

                  {newUrlInput && (
                    <div className="bg-slate-950 border border-indigo-500/20 rounded-xl p-3 space-y-1">
                      <span className="block text-[9px] text-cyan-400 font-black">تحويل وترشيح تلقائي للمبرك الذكي بالخلفية:</span>
                      <code className="block text-[9.5px] text-indigo-300 break-all select-all font-mono leading-normal text-left">
                        {convertGoogleDriveUrl(newUrlInput)}
                      </code>
                    </div>
                  )}

                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-[10px] text-indigo-200/90 leading-relaxed font-semibold">
                    💡 <span className="text-cyan-400 font-extrabold">ميزة حصرية:</span> لا تقلق بشأن روابط Google Drive العامة! يقوم محاكي المبرك المعين باستشعار الملفات العامة ونقلها تلقائياً لروابط بث وعرض مدمجة ومباشرة لضمان بقائها نشطة بداخل <code className="text-indigo-400 font-mono">&lt;img&gt;</code> على الفور.
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={handleSaveCustomImage}
                      className="flex-1 bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-350 hover:to-indigo-500 text-slate-950 hover:text-white font-black text-xs py-3 rounded-xl transition cursor-pointer text-center"
                    >
                      حفظ دائم للمنصة 💾
                    </button>
                    
                    <button
                      onClick={handleResetImage}
                      className="flex-1 bg-rose-950/50 hover:bg-rose-900 border-2 border-rose-500/30 text-rose-450 hover:text-white font-extrabold text-[10.5px] py-3 rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>إعادة التعيين 🔄</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
