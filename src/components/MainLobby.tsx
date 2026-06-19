import React, { useState } from 'react';
import { Unit, UserStats } from '../types';
import { GraduationCap, Award, Search, BookOpen, Star, Sliders, ChevronLeft } from 'lucide-react';

interface MainLobbyProps {
  units: Unit[];
  stats: UserStats;
  onSelectUnit: (unit: Unit) => void;
  onOpenProfile: () => void;
  onOpenAssemblyLab?: () => void;
}

export const MainLobby: React.FC<MainLobbyProps> = ({
  units,
  stats,
  onSelectUnit,
  onOpenProfile,
  onOpenAssemblyLab
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sift syllabus content based on search query
  const filteredLessons = units.flatMap(unit => 
    unit.lessons.map(lesson => ({ ...lesson, unit }))
  ).filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.objectives.some(o => o.toLowerCase().includes(searchQuery.toLowerCase())) ||
    lesson.content.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 text-right relative z-10" dir="rtl">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 border-2 border-indigo-500 rounded-[35px] p-8 text-white relative overflow-hidden shadow-[8px_8px_0px_#312e81] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -translate-x-12 -translate-y-12"></div>
        <div className="space-y-4 max-w-xl relative z-10">
          <div className="bg-indigo-950/80 backdrop-blur border border-indigo-500/30 rounded-2xl px-4 py-1.5 text-xs text-cyan-400 font-extrabold w-fit flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>منهج تكنولوجيا المعلومات والاتصالات - الصف السادس الابتدائي</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black font-sans leading-tight">
            أهلاً بك في فضاء المعرفة والتقنية <span className="text-cyan-400">{stats.avatar}</span> !
          </h1>
          <p className="text-sm text-indigo-200/90 leading-relaxed font-semibold">
            استكشف فصول كتاب مدرستك بطريقة تفاعلية مميزة! ابنِ شبكات السيرفر والواي فاي، صمم شرائح باوربوينت مع الستائر، أمن بياناتك من الهاكرز، واطبع هويتك الوطنية عملياً.
          </p>
        </div>

        {/* Quick Progress Circle */}
        <div className="bg-indigo-950/80 p-5 rounded-2xl border-2 border-indigo-500/40 text-center space-y-2.5 max-w-[200px] shrink-0 relative z-10 shadow-[4px_4px_0px_#1e1b4b]">
          <span className="text-yellow-400 font-black text-2xl flex justify-center gap-1.5 items-center">
            <Star className="w-5 h-5 fill-current text-yellow-400" />
            <span>{stats.points} XP</span>
          </span>
          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wide">المستوى: محترف رقمي</p>
          <button
            onClick={onOpenProfile}
            className="w-full bg-indigo-600 hover:bg-indigo-500 hover:scale-103 text-white text-[10px] py-2 rounded-xl transition duration-150 font-black shadow-sm"
          >
            عرض الأوسمة والشهادة 🥇
          </button>
        </div>
      </div>

      {/* High-Impact Virtual Lab Banner */}
      {onOpenAssemblyLab && (
        <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border-2 border-indigo-500 rounded-[30px] p-6 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 animate-fadeIn">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>
          <div className="space-y-1.5 text-right relative z-10">
            <span className="bg-indigo-905 text-cyan-400 border border-indigo-505/30 text-[9px] px-2.5 py-0.5 rounded-full font-black">جدید: معمل الحواسیب التفاعلي 🚀</span>
            <h3 className="font-extrabold text-white text-base md:text-lg">مختبر تجميع العتاد وأنظمة دوز، ويندوز ولينكس الوهمية 💻</h3>
            <p className="text-[11px] text-indigo-200 leading-relaxed font-bold">
              قم بتركيب المعالج والرام والقرص الصلب ومروحة التبريد ومزود الطاقة يدوياً على لوحة الأم، وشغّل نظامك الوهمي المفضل بدقة متناهية!
            </p>
          </div>
          <button
            onClick={onOpenAssemblyLab}
            className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs py-3.5 px-6 rounded-2xl shadow transition transform hover:scale-103 shrink-0 flex items-center justify-center gap-1 cursor-pointer relative z-10"
          >
            <span>ابدأ تركيب حاسوبك العملي الآن! 🛠️</span>
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Interactive Search Tool */}
      <div className="bg-slate-900 border-2 border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl p-4 shadow-md flex items-center gap-3 transition duration-150">
        <Search className="w-5 h-5 text-indigo-400 shrink-0" />
        <input
          type="text"
          placeholder="ابحث عن موضوع بالمنهج... (مثال: تشفير، باوربوينت، سيرفر، IP)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-white outline-none w-full text-xs md:text-sm font-semibold placeholder-indigo-300/40"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-rose-400 font-bold hover:text-rose-300 transition px-2"
          >
            مسح
          </button>
        )}
      </div>

      {/* Search outcome presentation */}
      {searchQuery && (
        <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-6 shadow-[8px_8px_0px_#312e81] space-y-3">
          <h3 className="font-extrabold text-cyan-400 text-sm border-b border-indigo-500/30 pb-2">نتائج البحث ({filteredLessons.length} دروس مطابقة):</h3>
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => onSelectUnit(lesson.unit)}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 hover:border-cyan-400 transition cursor-pointer text-right space-y-1 group"
                >
                  <span className="text-[10px] text-lime-400 font-bold">من الوحدة {lesson.unit.number}: {lesson.unit.title}</span>
                  <h4 className="font-extrabold text-white text-sm flex justify-between items-center">
                    <span>{lesson.title}</span>
                    <ChevronLeft className="w-4 h-4 text-indigo-400 group-hover:text-cyan-400 transition" />
                  </h4>
                  <p className="text-[11px] text-indigo-200/70 line-clamp-2 h-7 font-semibold leading-relaxed">
                    {lesson.content[0]}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-indigo-300">لا توجد دروس أو موضوعات مطابقة لعبارة البحث الحالية في المنهج.</p>
          )}
        </div>
      )}

      {/* Grid of study Chapters for Lobby */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-white text-base flex items-center gap-1.5 pb-2 border-b border-indigo-900/60">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>الوحدات الدراسية المقررة بكتابك المنهجي</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {units.map((unit) => {
            const finishedLessonsCount = unit.lessons.filter((l) =>
              stats.completedLessons.includes(l.id)
            ).length;

            return (
              <div
                key={unit.id}
                onClick={() => onSelectUnit(unit)}
                className="bg-slate-900 border-2 border-indigo-500/20 hover:border-indigo-500 rounded-3xl p-5 shadow-sm hover:shadow-[8px_8px_0px_#312e81] duration-300 transition cursor-pointer flex justify-between items-center gap-4 group text-white"
              >
                <div className="flex items-center gap-4 text-right">
                  <div className={`p-3 bg-gradient-to-tr ${unit.color} text-white rounded-2xl group-hover:scale-105 duration-200 shadow-md`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-cyan-400 font-extrabold">الوحدة {unit.number}</span>
                    <h4 className="font-extrabold text-white text-base leading-tight group-hover:text-cyan-400 duration-150">{unit.title}</h4>
                    <p className="text-[11px] text-indigo-200/70 font-semibold line-clamp-1 h-4">{unit.subtitle}</p>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="bg-indigo-950/60 text-cyan-400 border border-indigo-500/30 rounded-xl text-[10px] px-3 py-1.5 font-bold shadow-inner">
                    {finishedLessonsCount} / {unit.lessons.length} دروس
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
