import React from 'react';
import { Unit, UserStats } from '../types';
import * as LucideIcons from 'lucide-react';

interface UnitMapProps {
  units: Unit[];
  stats: UserStats;
  onSelectUnit: (unit: Unit) => void;
  onSelectExam: (unit: Unit) => void;
}

export const UnitMap: React.FC<UnitMapProps> = ({
  units,
  stats,
  onSelectUnit,
  onSelectExam
}) => {
  // Helper to dynamically resolve the Lucide icon from string name
  const renderIcon = (iconName: string, className = "w-6 h-6") => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <LucideIcons.BookOpen className={className} />;
  };

  const calculateUnitProgress = (unit: Unit) => {
    const unitLessonIds = unit.lessons.map((l) => l.id);
    const completedInUnit = unitLessonIds.filter((id) =>
      stats.completedLessons.includes(id)
    ).length;
    return {
      completed: completedInUnit,
      total: unit.lessons.length,
      percent: Math.round((completedInUnit / unit.lessons.length) * 100),
      isCompleted: completedInUnit === unit.lessons.length
    };
  };

  return (
    <div className="space-y-8 relative z-10" dir="rtl">
      {/* Title block */}
      <div className="text-center md:text-right space-y-2">
        <span className="bg-lime-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">خريطة المعرفة</span>
        <h2 className="text-3xl font-black text-white font-sans tracking-tight pt-2">
          خريطة رحلتك الرقمية 🗺️
        </h2>
        <p className="text-indigo-200/90 text-sm max-w-xl font-medium leading-relaxed">
          تنقل بين الوحدات الخمس للمنهج الدراسي لكتاب تكنولوجيا المعلومات والاتصالات. ادرس الدروس الممتعة، جرب الأدوات الافتراضية، واجتز الاختبار لتجمع الأوسمة!
        </p>
      </div>

      {/* Grid of Chapter Islands */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit, index) => {
          const progress = calculateUnitProgress(unit);
          const isExamFinished = stats.completedExams.includes(unit.id);

          return (
            <div
              key={unit.id}
              className="bg-slate-900 rounded-3xl border-2 border-indigo-500/20 shadow-sm hover:shadow-[8px_8px_0px_#312e81] hover:border-indigo-500 transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Header Colored Block */}
              <div
                className={`bg-gradient-to-tr ${unit.color} p-5 text-white space-y-2 relative border-b-2 border-indigo-900`}
              >
                {/* Decorative background shape */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-x-4 -translate-y-4"></div>
                
                <div className="flex justify-between items-center">
                  <span className="bg-slate-905/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wider border border-white/20">
                    الوحدة {unit.number}
                  </span>
                  <div className="bg-white/10 p-2 rounded-2xl group-hover:scale-110 duration-300">
                    {renderIcon(unit.iconName, "w-6 h-6 text-white")}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold font-sans tracking-tight leading-snug">
                    {unit.title}
                  </h3>
                  <p className="text-[11px] text-white/80 font-mono tracking-wide uppercase font-medium">
                    {unit.subtitle}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-right bg-slate-900">
                <p className="text-xs text-indigo-200/80 font-medium leading-relaxed line-clamp-2 h-8">
                  {unit.description}
                </p>

                {/* Lessons Quick list indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-indigo-300">
                    <span>التقدم الدراسي بالوحدة</span>
                    <span className="font-mono text-cyan-400">{progress.percent}%</span>
                  </div>
                  {/* Real progress bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-indigo-500/10">
                    <div
                      className={`h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-indigo-600 rounded-full transition-all duration-500`}
                      style={{ width: `${progress.percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold text-indigo-400">
                    <span>{progress.completed} من أصل {progress.total} دروس منتهية</span>
                    {isExamFinished && (
                      <span className="text-lime-400 bg-lime-950/40 border border-lime-500/20 px-2 py-0.5 rounded flex items-center gap-1 font-bold shadow-inner">
                        ★ الاختبار مجتاز
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-indigo-950">
                  <button
                    onClick={() => onSelectUnit(unit)}
                    className="bg-indigo-600 hover:bg-indigo-500 hover:scale-103 text-white rounded-xl py-2.5 px-3 font-black text-xs transition duration-150 active:scale-95 text-center flex items-center justify-center gap-1 leading-none select-none shadow-[2px_2px_0px_#1e1b4b]"
                  >
                    <span>تصفح الدروس 📖</span>
                  </button>
                  <button
                    onClick={() => onSelectExam(unit)}
                    className={`rounded-xl py-2.5 px-3 font-black text-xs transition text-center flex items-center justify-center gap-1 leading-none select-none ${
                      progress.percent >= 50
                        ? 'bg-rose-500 hover:bg-rose-450 hover:scale-103 text-white active:scale-95 shadow-[2px_2px_0px_#5c1d24]'
                        : 'bg-slate-950 text-indigo-400/50 cursor-not-allowed border border-indigo-950'
                    }`}
                    disabled={progress.percent < 50}
                    title={progress.percent < 50 ? 'ادرس نصف الدروس على الأقل لفتح الامتحان!' : 'ابدأ الامتحان التحريري والعملي المكثف!'}
                  >
                    <span>دخول الاختبار 📝</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Big Educational Pathway Poster */}
      <div className="bg-slate-900 border-2 border-indigo-500 rounded-[30px] p-6 shadow-[8px_8px_0px_#312e81] flex flex-col md:flex-row items-center gap-6" dir="rtl">
        <div className="text-4xl bg-indigo-950 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-indigo-500/20 shrink-0">🏆</div>
        <div className="flex-1 space-y-1 text-right">
          <h4 className="text-cyan-400 font-extrabold text-base">نصيحة أُستاذ تقنية المعلومات:</h4>
          <p className="text-xs text-indigo-200/90 leading-relaxed font-semibold">
            كي تصبح بطلاً للتقنية، ادرس دروس كل وحدة أولاً، ثم افتح "الوسائل التفاعلية" بداخل الدرس لتفهم المحتوى عملياً، ثم ادخل الاختبار المكثف للوحدة لتحصد وساماً فريداً ونقاطاً تسجل في ملفك الشخصي! عندما تصل إلى 400 نقطة ستقوم الخزنة التلقائية بطباعة شهادتك المعتمدة!
          </p>
        </div>
      </div>
    </div>
  );
};
