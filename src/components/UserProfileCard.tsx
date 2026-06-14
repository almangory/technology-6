import React, { useState } from 'react';
import { UserStats } from '../types';
import { Award, Trophy, Sparkles, Check, Star, Calendar, Download, RefreshCw, GraduationCap } from 'lucide-react';

interface UserProfileCardProps {
  stats: UserStats;
  onUpdateName: (name: string) => void;
  onSelectAvatar: (avatar: string) => void;
  onResetProgress: () => void;
}

const AVATARS = [
  '💻', '🚀', '🤖', '🎓', '👾', '🧠', '🌟', '🦊', '🐼', '🦖'
];

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  stats,
  onUpdateName,
  onSelectAvatar,
  onResetProgress
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(stats.name);
  const [showCertificate, setShowCertificate] = useState(false);

  const completedUnitsCount = stats.completedExams.length;
  const totalLessonsCount = stats.completedLessons.length;
  
  const handleSaveName = () => {
    if (newName.trim()) {
      onUpdateName(newName.trim());
      setIsEditing(false);
    }
  };

  const getRankInfo = (points: number) => {
    if (points >= 1000) return { title: 'عالم تكنولوجيا خارق 🚀', color: 'text-amber-400 bg-amber-955/60 border-amber-500/30' };
    if (points >= 600) return { title: 'مبرمج متمكن 🧠', color: 'text-purple-400 bg-purple-955/60 border-purple-500/30' };
    if (points >= 300) return { title: 'مستكشف تقني 🔍', color: 'text-cyan-400 bg-cyan-955/60 border-cyan-500/30' };
    return { title: 'تلميذ متطلع 🌱', color: 'text-lime-400 bg-lime-955/60 border-lime-500/30' };
  };

  const rank = getRankInfo(stats.points);

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6 relative z-10" dir="rtl">
      {/* Upper Bio Card */}
      <div className="bg-slate-900 border-2 border-indigo-500/20 p-6 shadow-sm hover:shadow-[8px_8px_0px_#312e81] duration-300 rounded-[35px] flex flex-col md:flex-row gap-6 items-center text-white text-right">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-full bg-slate-950 border-4 border-indigo-500 flex items-center justify-center text-5xl select-none relative shadow-md">
            {stats.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-1.5 rounded-full shadow cursor-pointer hover:scale-115 duration-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={25}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-3 py-1.5 border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-right font-medium text-white bg-slate-950 text-xs"
                  dir="rtl"
                />
                <button
                  onClick={handleSaveName}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-black transition duration-150 flex items-center gap-1"
                >
                  حفظ
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <h2 className="text-2xl font-black text-white tracking-tight font-sans">
                  {stats.name}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-indigo-400 hover:text-cyan-400 underline font-semibold transition"
                >
                  تعديل الاسم
                </button>
              </div>
            )}

            <div className={`px-3 py-1 rounded-full text-xs font-black border ${rank.color} self-center w-fit shadow-[2px_2px_0px_rgba(0,0,0,0.3)]`}>
              {rank.title}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs font-bold">
            <span className="flex items-center gap-2 text-indigo-200">
              <span className="text-indigo-300 font-black bg-indigo-950 border border-indigo-500/25 px-3 py-1 rounded-xl text-sm">{stats.points} XP</span> نقطة كفاح
            </span>
            <span className="flex items-center gap-2 text-indigo-200">
              <span className="text-lime-400 font-black bg-lime-950 border border-lime-500/25 px-3 py-1 rounded-xl text-sm">{totalLessonsCount}</span> درس مدروس
            </span>
            <span className="flex items-center gap-2 text-indigo-200">
              <span className="text-rose-400 font-black bg-rose-950 border border-rose-500/25 px-3 py-1 rounded-xl text-sm">{completedUnitsCount}</span> اختبار مجتاز
            </span>
          </div>

          {/* Avatar Selector Panel */}
          <div className="pt-3 border-t border-indigo-550/10 flex flex-wrap gap-2 items-center justify-center md:justify-start">
            <span className="text-xs text-indigo-300 font-bold">اختر رمزك الكرتوني المفضل:</span>
            <div className="flex gap-2 overflow-x-auto py-1 max-w-[280px] scrollbar-thin">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSelectAvatar(emoji)}
                  className={`text-2xl p-1.5 rounded-xl bg-slate-950 border border-indigo-500/10 hover:bg-slate-900 hover:scale-110 hover:border-cyan-400 transition active:scale-95 duration-150 ${stats.avatar === emoji ? 'bg-indigo-950 scale-110 shadow-md border-cyan-400' : ''}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate Display Trigger */}
        <div className="w-full md:w-auto flex flex-col gap-2 shrink-0">
          {stats.points >= 400 ? (
            <button
              onClick={() => setShowCertificate(true)}
              className="bg-gradient-to-r from-yellow-405 to-amber-500 hover:from-yellow-350 hover:to-amber-450 text-slate-950 rounded-2xl px-6 py-3.5 font-black shadow-[4px_4px_0px_#78350f] hover:scale-103 duration-150 transition flex items-center justify-center gap-2 select-none"
            >
              <Trophy className="w-5 h-5 animate-bounce text-slate-900" />
              <span>عرض شهادة التفوق 🎓</span>
            </button>
          ) : (
            <div className="bg-slate-950 border border-indigo-500/25 rounded-2xl p-4 text-center max-w-[200px] mx-auto md:mx-0 shadow-inner">
              <div className="text-yellow-400 font-black text-lg flex justify-center gap-1.5 mb-1.5">
                <Star className="w-5 h-5 fill-current text-yellow-400" />
                <span>{stats.points} / 400</span>
              </div>
              <p className="text-[10px] text-indigo-300 font-semibold leading-normal">اجمع 400 نقطة لتستحق شهادة التفوق المعتمدة!</p>
            </div>
          )}

          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من مسح مسيرتك وتصفير تقدمك بالكامل؟')) {
                onResetProgress();
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 justify-center py-2 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>إعادة تصفير اللعبة</span>
          </button>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-slate-900 border-2 border-indigo-500/20 p-6 shadow-sm hover:shadow-[8px_8px_0px_#312e81] duration-300 rounded-[35px] space-y-4 text-white hover:border-indigo-500/40 text-right">
        <div className="flex items-center gap-2.5 justify-start border-b border-indigo-500/10 pb-3" dir="rtl">
          <Award className="w-6 h-6 text-indigo-400" />
          <h3 className="text-base font-black text-white">الأوسمة والميداليات الحائز عليها ({stats.achievements.filter(a => a.unlocked).length})</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" dir="rtl">
          {stats.achievements.map((ach) => {
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition duration-300 flex items-center gap-4 text-right ${
                  ach.unlocked
                    ? 'bg-slate-950 border-indigo-500/30 shadow-md shadow-indigo-950'
                    : 'bg-slate-950/40 border-indigo-500/5 opacity-55'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 ${
                    ach.unlocked
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-650 text-white shadow-lg border border-indigo-400/20'
                      : 'bg-slate-900 text-indigo-400/30'
                  }`}
                >
                  {ach.unlocked ? (
                    <Trophy className="w-6 h-6 text-yellow-355 fill-current" />
                  ) : (
                    <span>🔒</span>
                  )}
                </div>
                <div className="space-y-1 text-right flex-1">
                  <div className="flex items-center gap-1.5 justify-start">
                    <h4 className={`font-black text-xs ${ach.unlocked ? 'text-white' : 'text-indigo-300/60'}`}>
                      {ach.title}
                    </h4>
                    {ach.unlocked && <Check className="w-4 h-4 text-lime-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-indigo-250/70 leading-relaxed font-semibold">
                    {ach.description}
                  </p>
                  {ach.unlocked && ach.unlockedAt && (
                    <div className="text-[10px] text-indigo-400/60 flex items-center gap-1 justify-start">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>{ach.unlockedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal Overlay */}
      {showCertificate && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-stone-50 border-[12px] border-amber-600/30 rounded-3xl p-8 max-w-3xl w-full my-8 shadow-2xl relative" dir="rtl">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 left-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold p-2.5 rounded-full transition w-10 h-10 flex items-center justify-center shadow-md select-none z-10"
            >
              ✕
            </button>

            {/* Print Friendly Block */}
            <div id="certificate-print-area" className="border-4 border-double border-amber-500/80 p-8 text-center space-y-6 relative bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10 rounded-2xl">
              {/* Decorative Corner Borders */}
              <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-500"></div>
              <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-500"></div>
              <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-500"></div>
              <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-500"></div>

              {/* Top Banner */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <GraduationCap className="w-16 h-16 text-amber-600 animate-bounce" />
                <h1 className="text-xl md:text-2xl font-black text-amber-700 tracking-wide font-sans">
                  شهادة تميز وتفوق رقمي
                </h1>
                <p className="text-xs text-amber-900/70 tracking-widest font-mono">六 GRADE ICT EXCELLENCE CERTIFICATE 六</p>
              </div>

              {/* Body */}
              <div className="space-y-4 py-4">
                <p className="text-slate-700 text-xs md:text-sm font-extrabold leading-relaxed">
                  يَسر أسرة مادة تكنولوجيا المعلومات والاتصالات ومجلس التفوق التقني أن يشهد بأن التلميذ المبدع المجد:
                </p>
                <div className="border-b-2 border-dashed border-amber-500/50 pb-2 max-w-md mx-auto">
                  <p className="text-3xl font-black text-indigo-950 font-sans tracking-tight py-2">
                    {stats.name} {stats.avatar}
                  </p>
                </div>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed px-4 md:px-12 font-semibold">
                  قد اجتاز بنجاح منقطع النظير كافة المحاكيات المتطورة والتفاعليات التعليمية المنهجية، وراكم <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded text-base">{stats.points}</span> نقطة جدارة، وأثبت قدرة مذهلة في تصميم عروض PowerPoint، ومواجهة الهاكرز وتأمين البيانات، وبناء قواعد البيانات، ومعرفة خبايا الأجهزة والشبكات المقررة للصف السادس الابتدائي.
                </p>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-xs font-bold text-slate-600">
                <div className="space-y-1">
                  <p className="border-b border-stone-300 pb-2 font-black text-slate-800">مُعلم تقنية المعلومات الافتراضي</p>
                  <p className="text-[10px] text-slate-500 font-semibold">أُستاذ تفاعلي ذكي</p>
                </div>
                <div className="space-y-1">
                  <p className="border-b border-stone-300 pb-2 font-black text-slate-800">مجلس التفوق والابتكار</p>
                  <p className="text-[10px] text-slate-500 font-semibold">مدرسة المستقبل الرقمي المتكامل</p>
                </div>
              </div>

              {/* Decorative Stars Badge */}
              <div className="flex justify-center gap-1.5 pt-4 text-amber-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-6 h-6 fill-current scale-125" />
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center">
              <button
                onClick={handlePrintCertificate}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2.5 font-bold text-xs transition duration-150 flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                <span>طباعة أو حفظ الشهادة</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="bg-stone-200 hover:bg-stone-300 text-slate-700 rounded-xl px-6 py-2.5 font-bold text-xs transition"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
