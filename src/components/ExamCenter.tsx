import React, { useState, useEffect } from 'react';
import { Unit, Question, UserStats } from '../types';
import { UNITS_DATA } from '../data';
import { Award, Trophy, CheckCircle, XCircle, Star, Sparkles, Sliders, ChevronLeft, ArrowRight, Settings, HelpCircle, Play, RefreshCw } from 'lucide-react';

interface ExamCenterProps {
  unit?: Unit | null;
  questions: Question[];
  stats: UserStats;
  onEmitPoints: (points: number) => void;
  onEmitExamCompleted: (unitId: string) => void;
  onEmitAchievement: (achId: string) => void;
  onLaunchSimulator: (simulator: string, lessonId: string) => void;
  onBackToMap: () => void;
}

export const ExamCenter: React.FC<ExamCenterProps> = ({
  unit: initialUnit,
  questions,
  stats,
  onEmitPoints,
  onEmitExamCompleted,
  onEmitAchievement,
  onLaunchSimulator,
  onBackToMap
}) => {
  // Config States for custom exam builder
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnit?.id || 'all');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(true);

  // Active session questions
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [examMode, setExamMode] = useState<'selection' | 'theoretical' | 'practical'>('selection');

  // Theoretical Quiz State
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Practical Task State
  const [practicalFinished, setPracticalFinished] = useState(false);
  const [activePracIdx, setActivePracIdx] = useState(0);
  const [taskVerificationInput, setTaskVerificationInput] = useState('');
  const [taskValidatedSuccessfully, setTaskValidatedSuccessfully] = useState<boolean | null>(null);

  // Filter lessons based on selected Unit
  const currentUnit = UNITS_DATA.find(u => u.id === selectedUnitId);
  const lessonsForSelect = currentUnit ? currentUnit.lessons : [];

  // Reset lesson filter if it doesn't belong to the newly selected unit
  useEffect(() => {
    if (selectedUnitId === 'all') {
      setSelectedLessonId('all');
    } else {
      const match = lessonsForSelect.find(l => l.id === selectedLessonId);
      if (!match && selectedLessonId !== 'all') {
        setSelectedLessonId('all');
      }
    }
  }, [selectedUnitId, lessonsForSelect, selectedLessonId]);

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

  // Build the curated questions pool
  const handleStartExam = () => {
    playSound('click');
    
    // Filter theoretical questions based on selected Unit & Lesson
    let filtered = questions.filter(q => q.type === 'theoretical');
    
    if (selectedUnitId !== 'all') {
      filtered = filtered.filter(q => q.unitId === selectedUnitId);
    }
    
    if (selectedLessonId !== 'all') {
      filtered = filtered.filter(q => q.lessonId === selectedLessonId);
    }

    // Shuffle questions pool using Fischer-Yates
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Take slice
    const selectedBatch = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    
    if (selectedBatch.length === 0) {
      alert('لم يتم العثور على أسئلة تطابق الفلاتر المحددة! الرجاء اختيار نطاق أوسع.');
      return;
    }

    // Randomize/shuffle options inside each question so that the correct answer is never in a fixed index (like the second option)
    const randomizedQuestions = selectedBatch.map((q) => {
      // Guard for practical tasks or questions without valid options list
      if (q.type !== 'theoretical' || !q.options || q.correctOption === undefined) {
        return q;
      }

      // Track correct answer text
      const correctAnswerText = q.options[q.correctOption];

      // Shuffle the list of options
      const optionsWithIndices = q.options.map((opt, i) => ({ text: opt, originalIndex: i }));
      for (let i = optionsWithIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
      }

      // Re-map the new correct index
      const newCorrectIndex = optionsWithIndices.findIndex(o => o.text === correctAnswerText);

      return {
        ...q,
        options: optionsWithIndices.map(o => o.text),
        correctOption: newCorrectIndex !== -1 ? newCorrectIndex : q.correctOption,
      };
    });

    setActiveQuestions(randomizedQuestions);
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizFinished(false);
    
    setIsConfiguring(false);
    setExamMode('theoretical');
  };

  // Default unit-oriented items for practical challenges
  const activeUnitIdForPractical = selectedUnitId === 'all' ? 'unit1' : selectedUnitId;
  const unitPractical = questions.filter((q) => q.unitId === activeUnitIdForPractical && q.type === 'practical');

  // Theoretical MCQs Handling
  const handleAnswerClick = (optIdx: number) => {
    if (selectedOpt !== null) return; // Answer locked
    setSelectedOpt(optIdx);
    const correct = optIdx === activeQuestions[currentQIdx].correctOption;
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
    if (currentQIdx < activeQuestions.length - 1) {
      setCurrentQIdx((i) => i + 1);
    } else {
      // Calculate overall and trigger reward
      setQuizFinished(true);
      const correctRate = quizScore / activeQuestions.length;
      if (correctRate >= 0.75) {
        playSound('success');
        onEmitPoints(50);
        // Mark exam completed for custom units iff they passed
        if (selectedUnitId !== 'all') {
          onEmitExamCompleted(selectedUnitId);
        }
        if (correctRate === 1) {
          onEmitAchievement('ach-6'); // Perfect score IT champion
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
      if (inputVal === '192.158.5.105') validated = true;
    } else if (currentTask.taskGoal === '3_kills') {
      if (inputVal.includes('٣') || inputVal.includes('3') || inputVal.toLowerCase().includes('فيروس')) validated = true;
    } else if (currentTask.taskGoal === 'red_slide_with_curtains') {
      if (inputVal.includes('أحمر') || inputVal.includes('ستارة') || inputVal.toLowerCase().includes('curtains')) validated = true;
    } else {
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
      <div className={`p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-md`}>
        <div className="text-right space-y-1">
          <button
            onClick={onBackToMap}
            className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-1 font-bold text-xs transition flex items-center gap-1 focus:outline-none mb-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لخريطة الطريق 🗺️</span>
          </button>
          <h2 className="text-2xl md:text-3xl font-black font-sans leading-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-300 animate-pulse" />
            <span>مركز الاختبارات الإلكتروني الشامل</span>
          </h2>
          <p className="text-xs text-indigo-200/90 leading-relaxed font-semibold">
            أثبت تميزك المنهجي عبر قاعات الاختبار التفاعلية! اصنع اختبارك المخصص بفرز الوحدات والدروس وتحديد عدد الأسئلة بدقة واحترافية.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-white/10 shrink-0">
          <span className="text-xs font-black text-cyan-300">بنك الأسئلة: {questions.filter(q => q.type === 'theoretical').length} سؤال منهجياً</span>
        </div>
      </div>

      {isConfiguring ? (
        /* TEST CONFIGURATION PANEL */
        <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[35px] p-6 md:p-8 shadow-sm hover:shadow-[8px_8px_0px_#312e81] duration-300">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-indigo-500/15">
              <Settings className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-black text-white">إعداد وضبط جولة الاختبار المخصص</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Unit Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-indigo-300">حدد الوحدة الدراسية المقررة:</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-indigo-900/60 p-3 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">كل الوحدات المنهجية الخمسة (شامل)</option>
                  {UNITS_DATA.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      الوحدة {unit.number}: {unit.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lesson Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-indigo-300">حدد درساً معيناً:</label>
                <select
                  value={selectedLessonId}
                  disabled={selectedUnitId === 'all'}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-indigo-900/60 p-3 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="all">كل دروس هذه الوحدة</option>
                  {lessonsForSelect.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title} (صفحة {lesson.pageNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Questions Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-indigo-300">عدد أسئلة الاختبار التحريري:</label>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 10, 15, 20, 30].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => { playSound('click'); setQuestionCount(cnt); }}
                      className={`py-2 rounded-xl text-xs font-mono font-black border transition ${
                        questionCount === cnt
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                          : 'bg-slate-950 text-indigo-300 border-indigo-950 hover:border-indigo-800'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-950/40 border border-indigo-550/20 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-right space-y-1">
                <span className="text-xs text-cyan-400 font-black flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>مكافآت مجزية بانتظارك!</span>
                </span>
                <p className="text-[11px] text-indigo-200/80 leading-relaxed font-semibold">
                  تحرز +٥٠ نقطة مهارة عند الإجابة على ٧٥٪ على الأقل من الأسئلة بطريقة صحيحة! وإذا قمت بإنهاء الاختبار بالعلامة الكاملة ستحرز وسام بطل تكنولوجيا المعلومات والاتصالات!
                </p>
              </div>
              <button
                onClick={handleStartExam}
                className="w-full md:w-fit shrink-0 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:scale-102 hover:contrast-125 text-slate-950 font-black text-sm px-8 py-3.5 rounded-2xl transition duration-150 flex items-center justify-center gap-2 shadow-lg"
              >
                <Play className="w-5 h-5 text-slate-950 fill-current" />
                <span>ابدأ وجّه الأسئلة الفورية 🚀</span>
              </button>
            </div>

            {/* Quick entry for Unit Exams or Practice tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/10 space-y-2">
                <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                  <span>🛠️ الواجبات العملية الميدانية المتاحة</span>
                </h4>
                <p className="text-[10px] text-indigo-300 font-semibold leading-relaxed">
                  تحديات تفاعلية للعمل على تسيير الشبكات وتعديل عناوين الأجهزة وجدار الحماية وصناعة الشرائح.
                </p>
                <button
                  onClick={() => { playSound('click'); setExamMode('practical'); setIsConfiguring(false); }}
                  className="bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-500/20 text-cyan-300 text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition"
                >
                  الدخول للواجب العملي الميداني ⚙️
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/10 space-y-2">
                <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                  <span>📚 محاكيات التدريب الصفي المفتوح</span>
                </h4>
                <p className="text-[10px] text-indigo-300 font-semibold leading-relaxed">
                  افتح المحاكي التعليمي مباشرة للعمل بيدك على أنظمة الأمان والشبكات وقواعد البيانات مجاناً.
                </p>
                <button
                  onClick={() => { playSound('click'); onLaunchSimulator('network', 'quick_sandbox'); }}
                  className="bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-500/20 text-indigo-300 hover:text-white text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition"
                >
                  تشغيل معمل الحاسوب السحابي 🖥️
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : examMode === 'theoretical' ? (
        <div className="bg-slate-900 border-2 border-indigo-500/25 p-6 shadow-sm rounded-[30px] hover:shadow-[8px_8px_0px_#312e81] duration-300 space-y-6 text-right text-white">
          {quizFinished ? (
            <div className="text-center space-y-4 py-8">
              <span className="text-6xl block">🎉</span>
              <h3 className="text-3xl font-black text-white">أهنئك يا بطل التكنولوجيا!</h3>
              <p className="text-xs text-indigo-300 font-semibold">لقد أتممت جولة الاختبار التحريري المكثف بنجاح.</p>
              
              <div className="bg-slate-950 border border-indigo-500/20 rounded-3xl p-6 max-w-sm mx-auto text-center space-y-2">
                <span className="text-sm font-bold text-indigo-200">علامتك المحرزة بالتفوق:</span>
                <p className="text-4xl font-black text-cyan-400 font-sans tracking-tight">
                  {quizScore} / {activeQuestions.length}
                </p>
                <p className="text-[11px] text-indigo-300 font-semibold font-sans">
                  {quizScore / activeQuestions.length >= 0.75 ? 'لقد تجاوزت عتبة النجاح بجدارة رائعة! (+٥٠ نقطة مهارة)' : 'جيد جداً! جرب المحاولة ثانية لتصل للعلامة الكاملة!'}
                </p>
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={() => {
                    playSound('click');
                    setIsConfiguring(true);
                  }}
                  className="bg-slate-950 border border-indigo-500/30 text-indigo-300 hover:text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>توليد اختبار آخر مخصص</span>
                </button>
                <button
                  onClick={() => { playSound('click'); setExamMode('selection'); setIsConfiguring(true); }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
                >
                  المغادرة لساحة الاختبارات الرئيسية
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 select-none">
              {/* Quiz Header Trackers */}
              <div className="flex justify-between items-center border-b pb-3 border-indigo-500/10 text-xs font-black text-indigo-300">
                <span>السؤال {currentQIdx + 1} من {activeQuestions.length}</span>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <Star className="w-4 h-4 fill-current text-amber-400 animate-spin" />
                  <span>
                    {selectedUnitId === 'all' ? 'اختبار شامل لكل المنهج' : `الوحدة ${currentUnit?.number}`}
                  </span>
                </div>
              </div>

              {/* Progress Bar of steps */}
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${((currentQIdx + 1) / activeQuestions.length) * 100}%` }}
                ></div>
              </div>

              {/* Quiz content display */}
              <div className="space-y-4">
                <span className="text-[10px] text-lime-400 font-extrabold bg-slate-950 px-3 py-1 rounded-full border border-indigo-500/10">
                  المجال: {UNITS_DATA.find(u => u.id === activeQuestions[currentQIdx].unitId)?.title}
                </span>
                <p className="text-lg md:text-xl font-bold text-white bg-slate-950 p-4 rounded-2xl border border-indigo-500/20 leading-relaxed font-sans">
                  {activeQuestions[currentQIdx].text}
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {activeQuestions[currentQIdx].options?.map((option, idx) => {
                    const isCorrect = idx === activeQuestions[currentQIdx].correctOption;
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
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-500/20'
                          }`}>
                            {idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د'}
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
                    {activeQuestions[currentQIdx].explanation}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-3 rounded-2xl font-bold transition flex items-center gap-1.5 float-left shadow-[2px_2px_0px_rgba(0,0,0,0.4)] border border-indigo-400"
                  >
                    <span>{currentQIdx === activeQuestions.length - 1 ? 'إنهاء الامتحان وحصد النقاط 🏁' : 'السؤال التالي'}</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="clear-both"></div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* PRACTICAL SANDBOX CHALLENGE VIEW */
        <div className="bg-slate-900 border-2 border-indigo-500/25 p-6 shadow-sm rounded-[30px] hover:shadow-[8px_8px_0px_#312e81] duration-300 space-y-6 text-right select-none text-white">
          {practicalFinished ? (
            <div className="text-center space-y-4 py-8">
              <span className="text-6xl block animate-bounce">🏅</span>
              <h3 className="text-3xl font-black text-white">تم إقرار الفحص والتأكيد بنجاح!</h3>
              <p className="text-xs text-indigo-300 font-semibold">لقد تغلبت على المعضلات الميدانية واجتزت الواجب العملي بنجاح.</p>
              
              <div className="bg-slate-950 border border-indigo-500/25 rounded-3xl p-5 max-w-sm mx-auto text-center space-y-1">
                <span className="text-xs text-yellow-400 font-bold animate-pulse">✓ تم تحويل مكافأة الواجب المدرسي</span>
                <p className="text-2xl font-black text-white">+٤٠ نقطة مهارية</p>
                <p className="text-[10px] text-indigo-300 font-bold leading-normal">تسجل بنطاق جدارتك التقنية بالملف الشخصي وتسرع استحقاق الشهادة المطبوعة.</p>
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={() => { playSound('click'); setPracticalFinished(false); setExamMode('selection'); setIsConfiguring(true); setTaskVerificationInput(''); setTaskValidatedSuccessfully(null); }}
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
                <div className="flex gap-2">
                  {unitPractical.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { playSound('click'); setActivePracIdx(idx); setTaskVerificationInput(''); setTaskValidatedSuccessfully(null); }}
                      className={`px-3 py-1 text-xs rounded-lg font-bold border transition ${
                        activePracIdx === idx
                          ? 'bg-amber-500 text-slate-950 border-amber-450'
                          : 'bg-slate-950 text-indigo-300 border-indigo-905'
                      }`}
                    >
                      مهمة {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/15 space-y-4">
                <div className="bg-amber-950/80 p-4 rounded-xl text-amber-300 text-xs font-semibold leading-relaxed text-right border border-amber-550/20">
                  <span className="font-black text-white text-xs block mb-1">📌 نص المهمة التكنولوجية الموكلة به:</span>
                  {unitPractical[activePracIdx]?.text}
                </div>

                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <div className="flex-1 w-full space-y-1.5">
                    <span className="text-[10px] font-black text-indigo-300 text-right block font-sans">حقل كتابة الإجابة أو رمز الفحص الرقمي:</span>
                    <input
                      type="text"
                      placeholder="اكتب التقييم (مثال للشبكة: 192.158.5.105، للأمن: 3 ، لباوربوينت: ستارة)"
                      value={taskVerificationInput}
                      onChange={(e) => setTaskVerificationInput(e.target.value)}
                      className="w-full bg-slate-900 border border-indigo-500/25 p-2.5 rounded-xl text-xs font-semibold text-white text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    onClick={handleVerifyPracticalChallenge}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-6 py-2.5 h-10 rounded-xl transition shadow-[2px_2px_0px_rgba(0,0,0,0.4)] border border-indigo-400 self-end w-full md:w-auto"
                  >
                    تأكيد وفحص الإرسال العلمي
                  </button>
                </div>

                {taskValidatedSuccessfully === false && (
                  <div className="p-2 bg-rose-950/60 border border-rose-500/20 text-[10px] text-rose-300 rounded-lg text-right">
                    الرمز أو الإجابة المكتوبة خاطئة! تأكد من تشغيل "المحاكي والعمل المخبري" أولاً وقراءة المنهج بعناية للحصول على الكود السليم. (تلميح لشبكات: 192.158.5.105 ، لأمن: 3)
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/10 text-center space-y-3">
                <p className="text-xs text-cyan-400 font-bold">هل تواجه صعوبة في حل اللغز؟</p>
                <p className="text-[10px] text-indigo-200 font-sans">اقترن بالمحاكي الفني الميداني الآن لتكتشف وتنزع الإجابة من حراسة التجربة المادية!</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      playSound('click');
                      onLaunchSimulator(unitPractical[activePracIdx]?.taskType || 'network', 'generic_challenge');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] px-4 py-2.5 rounded-xl transition font-black border border-indigo-400 shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
                  >
                    فتح المحاكي الافتراضي للواجب العملي 🎮
                  </button>
                  <button
                    onClick={() => { playSound('click'); setIsConfiguring(true); setExamMode('selection'); }}
                    className="bg-slate-950 border border-indigo-500/20 text-indigo-300 hover:text-white text-[10px] px-4 py-2.5 rounded-xl transition font-black"
                  >
                    إلغاء والعودة للإعداد مخصص
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
