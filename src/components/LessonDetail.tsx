import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unit, Lesson, UserStats } from '../types';
import { BookOpen, CheckCircle, Award, ArrowRight, ArrowLeft, Lightbulb, PlayCircle, Eye, Check } from 'lucide-react';

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
            <span className="text-[10px] text-white/90 font-medium">دروس مقررة</span>
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
    </div>
  );
};
