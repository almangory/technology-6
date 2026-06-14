import React, { useState } from 'react';
import { Unit, Question, UserStats } from '../types';
import { Award, Trophy, CheckCircle, XCircle, Heart, Star, Sparkles, Sliders, ChevronLeft, ArrowRight, Eye } from 'lucide-react';

interface ExamCenterProps {
  unit: Unit;
  questions: Question[];
  stats: UserStats;
  onEmitPoints: (points: number) => void;
  onEmitExamCompleted: (unitId: string) => void;
  onEmitAchievement: (achId: string) => void;
  onLaunchSimulator: (simulator: string, lessonId: string) => void;
  onBackToMap: () => void;
}

export const ExamCenter: React.FC<ExamCenterProps> = ({
  unit,
  questions,
  stats,
  onEmitPoints,
  onEmitExamCompleted,
  onEmitAchievement,
  onLaunchSimulator,
  onBackToMap
}) => {
  // Separate theoretical and practical for the selected unit
  const unitQuestions = questions.filter((q) => q.unitId === unit.id && q.type === 'theoretical');
  const unitPractical = questions.filter((q) => q.unitId === unit.id && q.type === 'practical');

  const [examMode, setExamMode] = useState<'selection' | 'theoretical' | 'practical'>('selection');

  // Theoretical Quiz State
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Practical Task Validator Slogans
  const [practicalFinished, setPracticalFinished] = useState(false);
  const [activePracIdx, setActivePracIdx] = useState(0);
  const [taskVerificationInput, setTaskVerificationInput] = useState('');
  const [taskValidatedSuccessfully, setTaskValidatedSuccessfully] = useState<boolean | null>(null);

  // Audio tone cue
  const playSound = (soundType: 'success' | 'fail' | 'click') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (soundType === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
      } else if (soundType === 'fail') {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(140, ctx.currentTime + 0.2); // F3
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
      } else {
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
      }
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  // Theoretical MCQs Handling
  const handleAnswerClick = (optIdx: number) => {
    if (selectedOpt !== null) return; // Answer locked
    setSelectedOpt(optIdx);
    const correct = optIdx === unitQuestions[currentQIdx].correctOption;
    if (correct) {
      playSound('success');
      setQuizScore((s) => s + 1);
    } else {
      playSound('fail');
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setShowExplanation(false);
    if (currentQIdx < unitQuestions.length - 1) {
      setCurrentQIdx((i) => i + 1);
    } else {
      // Calculate overall and trigger reward
      setQuizFinished(true);
      const correctRate = quizScore / unitQuestions.length;
      if (correctRate >= 0.75) {
        playSound('success');
        onEmitPoints(50);
        onEmitExamCompleted(unit.id);
        if (correctRate === 1) {
          onEmitAchievement('ach-6'); // Perfect score
          onEmitPoints(20);
        }
      } else {
        playSound('fail');
      }
    }
  };

  // Practical Tasks Sandbox Handling
  const handleVerifyPracticalChallenge = () => {
    const currentTask = unitPractical[activePracIdx];
    if (!currentTask) return;

    playSound('click');
    const inputVal = taskVerificationInput.trim();

    // Verification check algorithms per Task Target Type
    let validated = false;
    if (currentTask.taskGoal === '192.158.5.105') {
      // Checked if correct internal IP address is stated
      if (inputVal === '192.158.5.105') validated = true;
    } else if (currentTask.taskGoal === '3_kills') {
      // Checked of Firewall blockages confirmation
      if (inputVal.includes('٣') || inputVal.includes('3') || inputVal.toLowerCase().includes('فيروس')) validated = true;
    } else if (currentTask.taskGoal === 'red_slide_with_curtains') {
      // PPT designer curtains matching
      if (inputVal.includes('أحمر') || inputVal.includes('ستارة') || inputVal.toLowerCase().includes('curtains')) validated = true;
    } else {
      // Safe generic validations
      if (inputVal.length >= 4) validated = true;
    }

    setTaskValidatedSuccessfully(validated);
    if (validated) {
      playSound('success');
      onEmitPoints(40);
      setPracticalFinished(true);
    } else {
      playSound('fail');
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Unit Indicator Title */}
      <div className={`p-5 rounded-3xl bg-gradient-to-r ${unit.color} text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm`}>
        <div className="text-right space-y-1">
          <button
            onClick={onBackToMap}
            className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-1 font-bold text-xs transition flex items-center gap-1 focus:outline-none mb-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لخريطة الطريق 🗺️</span>
          </button>
          <h2 className="text-xl md:text-2xl font-black font-sans leading-tight">
            مركز الاختبارات المكثف لـ {unit.title}
          </h2>
          <p className="text-xs text-white/90">
            أثبت تميزك المنهجي عبر قاعات الاختبار النظري والمحاكاة التقنية العملية!
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
          <Trophy className="w-6 h-6 text-yellow-300 animate-bounce fill-current" />
          <span className="text-xs font-black">امتحانات الصف السادس</span>
        </div>
      </div>

      {examMode === 'selection' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
          {/* THEORETICAL ENTRANCE */}
          <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[30px] p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-[8px_8px_0px_#312e81] duration-300 text-center md:text-right">
            <div className="space-y-2">
              <span className="text-3xl block text-center md:text-right">📝</span>
              <h3 className="text-xl font-black text-white">١. الاختبار التحريري النظري المكثف</h3>
              <p className="text-xs text-indigo-200/85 font-semibold leading-relaxed">
                أسئلة اختيار من متعدد أعدها المركز القومي للمناهج. تغطي بدقة السيرفر، الفيروسات، البصمات، لغات الهاي-ليفل، إشارات المرور والمصارف.
              </p>
              <div className="text-[11px] font-bold text-cyan-400 bg-indigo-950 border border-indigo-500/20 p-2.5 rounded-xl w-fit">
                ★ مكافأة النجاح: +٥٠ نقطة مهارة للدرجات الكفاحية
              </div>
            </div>
            
            <button
              onClick={() => { playSound('click'); setExamMode('theoretical'); }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3 rounded-2xl transition shadow-[4px_4px_0px_rgba(0,0,0,0.4)]"
            >
              دخول قاعة الاختبار النظري 🎯
            </button>
          </div>

          {/* PRACTICAL CHANNELS ENTRANCE */}
          <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[30px] p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-[8px_8px_0px_#312e81] duration-300 text-center md:text-right">
            <div className="space-y-2">
              <span className="text-3xl block text-center md:text-right">🛠️</span>
              <h3 className="text-xl font-black text-white">٢. الامتحان والواجب العملي الميداني</h3>
              <p className="text-xs text-indigo-200/85 font-semibold leading-relaxed">
                تحديات حقيقية لمهندس التكنولوجيا! هل تستطيع توجيه الأجهزة بالشبكة، وتفادي هجوم حجب الخدمة، وصياغة الشرائح الملونة؟
              </p>
              <div className="text-[11px] font-bold text-amber-450 bg-amber-950 border border-amber-500/25 p-2.5 rounded-xl w-fit">
                ★ مكافأة التثبيت: +٤٠ نقطة مهارة لأوسمة الصيانة
              </div>
            </div>

            {unitPractical.length > 0 ? (
              <button
                onClick={() => { playSound('click'); setExamMode('practical'); }}
                className="bg-amber-500 hover:bg-amber-450 text-white font-extrabold text-xs py-3 rounded-2xl transition shadow-[4px_4px_0px_rgba(0,0,0,0.4)]"
              >
                دخول قاعة الفحص والواجب العملي ⚙️
              </button>
            ) : (
              <div className="text-center p-3 text-xs text-indigo-300 font-extrabold bg-slate-950 rounded-2xl border border-indigo-500/20">
                الواجب العملي لهذه الوحدة يتم تدريسه داخل محطات المعمل الافتراضي!
              </div>
            )}
          </div>
        </div>
      ) : examMode === 'theoretical' ? (
        <div className="bg-slate-900 border-2 border-indigo-500/25 p-6 shadow-sm rounded-[30px] hover:shadow-[8px_8px_0px_#312e81] duration-300 space-y-6 text-right text-white">
          {quizFinished ? (
            <div className="text-center space-y-4 py-8">
              <span className="text-6xl block">🎉</span>
              <h3 className="text-3xl font-black text-white">أهنئك يا بطل التكنولوجيا!</h3>
              <p className="text-xs text-indigo-300 font-semibold">لقد أتممت الاختبار التحريري المكثف للوحدة {unit.number} بنجاح.</p>
              
              <div className="bg-slate-950 border border-indigo-500/20 rounded-3xl p-6 max-w-sm mx-auto text-center space-y-2">
                <span className="text-sm font-bold text-indigo-200">علامتك المحرزة بالتفوق:</span>
                <p className="text-4xl font-black text-cyan-400 font-sans tracking-tight">
                  {quizScore} / {unitQuestions.length}
                </p>
                <p className="text-[11px] text-indigo-300 font-semibold font-sans">
                  {quizScore >= 3 ? 'لقد تجاوزت عتبة النجاح بجدارة رائعة! (+٥٠ نقطة)' : 'جيد جداً! جرب المحاولة ثانية لتصل للعلامة الكاملة!'}
                </p>
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={() => {
                    playSound('click');
                    setQuizFinished(false);
                    setCurrentQIdx(0);
                    setSelectedOpt(null);
                    setShowExplanation(false);
                    setQuizScore(0);
                  }}
                  className="bg-slate-950 border border-indigo-500/30 text-indigo-300 hover:text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
                >
                  إعادة المحاولة النظيرية
                </button>
                <button
                  onClick={() => { playSound('click'); setExamMode('selection'); }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
                >
                  المغادرة لساحة الامتحانات
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 select-none">
              {/* Quiz Header Trackers */}
              <div className="flex justify-between items-center border-b pb-3 border-indigo-500/10 text-xs font-black text-indigo-300">
                <span>السؤال {currentQIdx + 1} من {unitQuestions.length}</span>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <Star className="w-4 h-4 fill-current text-amber-400 animate-spin" />
                  <span>الوحدة {unit.number} النظري</span>
                </div>
              </div>

              {/* Progress Bar of steps */}
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${((currentQIdx + 1) / unitQuestions.length) * 100}%` }}
                ></div>
              </div>

              {/* Quiz content display */}
              <div className="space-y-4">
                <p className="text-lg md:text-xl font-bold text-white bg-slate-950 p-4 rounded-2xl border border-indigo-500/20 leading-relaxed font-sans">
                  {unitQuestions[currentQIdx].text}
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {unitQuestions[currentQIdx].options?.map((option, idx) => {
                    const isCorrect = idx === unitQuestions[currentQIdx].correctOption;
                    const isSelected = selectedOpt === idx;

                    return (
                      <button
                        key={idx}
                        disabled={selectedOpt !== null}
                        onClick={() => handleAnswerClick(idx)}
                        className={`w-full text-right p-4 rounded-2xl text-xs sm:text-sm font-bold border transition duration-150 leading-relaxed select-none ${
                          selectedOpt !== null
                            ? isCorrect
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                              : isSelected
                                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                                : 'bg-slate-950/40 border-indigo-500/5 opacity-45 text-slate-400'
                            : 'bg-slate-950 border-indigo-500/15 hover:border-cyan-400 hover:bg-slate-900 text-indigo-200 active:scale-99'
                        }`}
                      >
                        <div className="flex gap-2.5 items-center justify-start text-right">
                          <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                            selectedOpt !== null
                              ? isCorrect
                                ? 'bg-emerald-500 text-white animate-pulse'
                                : isSelected
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-slate-800 text-slate-500'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-500/20 group-hover:bg-indigo-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="flex-1">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review explanation panel */}
              {showExplanation && (
                <div className="space-y-3.5 pt-3 animate-[fadeIn_0.3s_ease]">
                  <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/25 text-xs font-semibold leading-relaxed text-amber-300 text-right">
                    💡 توضيح المركز التربوي للمفهوم:<br />
                    {unitQuestions[currentQIdx].explanation}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-3 rounded-2xl font-bold transition flex items-center gap-1.5 float-left shadow-[2px_2px_0px_rgba(0,0,0,0.4)] border border-indigo-400"
                  >
                    <span>{currentQIdx === unitQuestions.length - 1 ? 'إنهاء الامتحان وحصد النقاط 🏁' : 'السؤال التالي'}</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="clear-both"></div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border-2 border-indigo-500/25 p-6 shadow-sm rounded-[30px] hover:shadow-[8px_8px_0px_#312e81] duration-300 space-y-6 text-right select-none text-white">
          {practicalFinished ? (
            <div className="text-center space-y-4 py-8">
              <span className="text-6xl block animate-bounce">🏅</span>
              <h3 className="text-3xl font-black text-white">تم إقرار الفحص والتأكيد بنجاح!</h3>
              <p className="text-xs text-indigo-300 font-semibold">لقد تغلبت على المعضلات الميدانية واجتزت الواجب التفاعلي بجدارة ممتازة.</p>
              
              <div className="bg-slate-950 border border-indigo-500/25 rounded-3xl p-5 max-w-sm mx-auto text-center space-y-1">
                <span className="text-xs text-yellow-400 font-bold animate-pulse">✓ تم تحويل مكافأة الواجب المدرسي</span>
                <p className="text-2xl font-black text-white">+٤٠ نقطة مهارية</p>
                <p className="text-[10px] text-indigo-300 font-bold leading-normal">تسجل بنطاق جدارتك التقنية بالملف الشخصي وتسرع استحقاق الشهادة المطبوعة.</p>
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={() => { playSound('click'); setPracticalFinished(false); setExamMode('selection'); setTaskVerificationInput(''); setTaskValidatedSuccessfully(null); }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow border border-indigo-400"
                >
                  العودة للخيارات العليا
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-indigo-500/15">
                <h4 className="font-extrabold text-white text-sm">المهام الفنية الميدانية (التدريب العملي)</h4>
                <span className="text-xs text-amber-500 font-mono font-black animate-pulse">Challenge Task 1/1</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/15 space-y-4">
                <div className="bg-amber-950/80 px-3 py-1.5 rounded-xl text-amber-300 text-[11px] font-bold border border-amber-500/20">
                  📌 نص المهمة التكنولوجية الموكلة به:<br />
                  {unitPractical[activePracIdx]?.text}
                </div>

                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <div className="flex-1 w-full space-y-1.5">
                    <span className="text-[10px] font-black text-indigo-300 text-right block font-sans">حقل كتابة الإجابة أو رمز الفحص الرقمي:</span>
                    <input
                      type="text"
                      placeholder="اكتب النتيجة (مثال: 192.158.5.105 أو 3_kills)"
                      value={taskVerificationInput}
                      onChange={(e) => setTaskVerificationInput(e.target.value)}
                      className="w-full bg-slate-900 border border-indigo-500/25 p-2.5 rounded-xl text-xs font-semibold text-white text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    onClick={handleVerifyPracticalChallenge}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-6 py-2.5 h-10 rounded-xl transition shadow-[2px_2px_0px_rgba(0,0,0,0.4)] border border-indigo-400 self-end"
                  >
                    تأكيد وفحص الإرسال العلمي
                  </button>
                </div>

                {taskValidatedSuccessfully === false && (
                  <div className="p-2 bg-rose-950/60 border border-rose-500/20 text-[10px] text-rose-300 rounded-lg text-right">
                    الرمز أو الإجابة المكتوبة خاطئة! تأكد من تشغيل "المحاكي والعمل المخبري" أولاً وقراءة المنهج بعناية للحصول على الكود السليم. (تلميح لخطأ الشبكة: 192.158.5.105)
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/10 text-center space-y-3">
                <p className="text-xs text-cyan-400 font-bold">هل تواجه مللاً في تذكر الكود؟</p>
                <p className="text-[10px] text-indigo-200 font-sans">افتح المحاكي الحركي المرتبط فوراً، واختبر العمل وسيعطيك الحاسوب إشعار التحصيل!</p>
                <button
                  onClick={() => {
                    playSound('click');
                    onLaunchSimulator(unitPractical[activePracIdx]?.taskType || 'network', 'generic_challenge');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] px-4 py-2.5 rounded-xl transition font-black border border-indigo-400 shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
                >
                  فتح المحاكي الافتراضي للواجب العملي 🎮
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
