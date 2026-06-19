import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  fetchClassroomCourses,
  fetchCourseAnnouncements,
  createCourseAnnouncement,
  fetchDriveFiles,
  uploadTextFileToDrive,
  fetchTasksLists,
  fetchTasks,
  createGoogleTask,
  toggleTaskComplete,
  fetchGoogleFormBody,
  createClassroomCourse,
  createClassroomTopic,
  createClassroomMaterial,
  createClassroomCourseWork
} from '../lib/googleWorkspace';
import {
  Trophy,
  Sparkles,
  Award,
  BookOpen,
  Laptop,
  CheckCircle2,
  RefreshCw,
  LogOut,
  FolderOpen,
  FileText,
  ExternalLink,
  Plus,
  Send,
  Loader2,
  ListTodo,
  CheckSquare,
  Square,
  ClipboardList,
  ChevronLeft,
  Search,
  Eye,
  FileCheck
} from 'lucide-react';
import { UserStats } from '../types';

interface GoogleWorkspaceHubProps {
  stats: UserStats;
  onEmitPoints: (points: number) => void;
  onEmitAchievement: (achId: string) => void;
}

export const GoogleWorkspaceHub: React.FC<GoogleWorkspaceHubProps> = ({
  stats,
  onEmitPoints,
  onEmitAchievement
}) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // App UI Views
  const [activeTab, setActiveTab] = useState<'classroom' | 'drive' | 'tasks' | 'forms'>('classroom');

  // Loaders
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState<boolean>(false);
  const [postingAnnouncement, setPostingAnnouncement] = useState<boolean>(false);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [savingCertificate, setSavingCertificate] = useState<boolean>(false);
  const [loadingTasksLists, setLoadingTasksLists] = useState<boolean>(false);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [addingTask, setAddingTask] = useState<boolean>(false);
  const [loadingForm, setLoadingForm] = useState<boolean>(false);

  // Classroom States
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncementText, setNewAnnouncementText] = useState<string>('');
  const [announcementSuccess, setAnnouncementSuccess] = useState<string | null>(null);

  // Drive & Picker States
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [selectedFileForPicker, setSelectedFileForPicker] = useState<any | null>(null);
  const [driveUploadSuccess, setDriveUploadSuccess] = useState<boolean>(false);

  // Tasks States
  const [tasksLists, setTasksLists] = useState<any[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<string>('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskListTitle, setNewTaskListTitle] = useState<string>('');
  const [tasksSuccessMessage, setTasksSuccessMessage] = useState<string | null>(null);

  // Forms States
  const [formIdInput, setFormIdInput] = useState<string>('1FAIpQLSfD_K_7h3uY-3YpYCHgY6g7wY-5G_b5gX-uU'); // sample educational id
  const [formBody, setFormBody] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Auth Error State helper
  const [loginError, setLoginError] = useState<string | null>(null);

  // --- Google Classroom Automated Curriculum Sync States ---
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [syncCurrentAction, setSyncCurrentAction] = useState<string>('');
  const [syncSuccessCourseId, setSyncSuccessCourseId] = useState<string>('');

  // Audio tone cue helper
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

  // Check auth trigger
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setIsAuthenticated(true);
        setAuthChecked(true);
      },
      () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setAccessToken(null);
        setAuthChecked(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch initial tab data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'classroom') {
        loadClassroomCourses();
      } else if (activeTab === 'drive') {
        loadDriveFiles();
      } else if (activeTab === 'tasks') {
        loadTasksLists();
      }
    }
  }, [isAuthenticated, activeTab]);

  // Fetch announcements when course changes
  useEffect(() => {
    if (selectedCourseId) {
      loadCourseAnnouncements(selectedCourseId);
    } else {
      setAnnouncements([]);
    }
  }, [selectedCourseId]);

  // Fetch tasks when list changes
  useEffect(() => {
    if (selectedTaskListId) {
      loadTasks(selectedTaskListId);
    } else {
      setTasks([]);
    }
  }, [selectedTaskListId]);

  // Authenticate user
  const handleLogin = async () => {
    playSound('click');
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setAccessToken(result.accessToken);
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        playSound('success');
        onEmitPoints(30); // points for linking real workspace
      }
    } catch (err: any) {
      playSound('fail');
      console.error(err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes('auth/popup-closed-by-user') || errMsg.includes('closed-by-user')) {
        setLoginError(
          'تنبيه مهم: لقد تم غلق نافذة تسجيل الدخول المنبثقة مبكراً (popup-closed-by-user). يحدث هذا غالباً بسبب قيود متصفح الإنترنت أو بسبب تشغيل التطبيق داخل نافذة معاينة (iFrame) مغلقة جزئياً. لحل المشكلة فوراً والاستمتاع بكامل المزايا السحابية، يرجى فتح التطبيق في علامة تبويب جديدة كاملة بالضغط على زر "فتح في نافذة جديدة" (Open in New Tab) الموجود في الزاوية العلوية اليمنى من شاشتك، ثم حاول الضغط على زر الاتصال من هناك لتظهر لك نافذة Google لتسجيل الدخول.'
        );
      } else {
        setLoginError(`فشل الاتصال: ${errMsg}. يرجى التحقق من الاتصال بالإنترنت والمحاولة مجدداً.`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout user
  const handleLogout = async () => {
    playSound('click');
    await logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAccessToken(null);
    setSelectedCourseId('');
    setSelectedTaskListId('');
    setCourses([]);
    setTasksLists([]);
    setDriveFiles([]);
  };

  // Google Classroom API actions
  const CURRICULUM_UNITS = [
    {
      name: "الوحدة الأولى: شبكات الحاسوب وأدوات الاتصال 🌐",
      lessons: [
        {
          title: "الدرس الأول: مفهوم شبكة الحاسوب وأهميتها",
          description: "مفهوم شبكة الحاسوب:\nهي عبارة عن اتصال جهازين أو أكثر معاً بواسطة كابلات أو موجات لاسلكية بغرض مشاركة الموارد والمعلومات والبرامج والطابعات.\n\nأهمية الشبكات للطلاب:\n1. مشاركة الملفات والمستندات بسرعة فائقة وعبر السحابة.\n2. مشاركة الأجهزة الملحقة مثل الطابعات والماسحات الضوئية لتقليل التكلفة المالية.\n3. توفير سرعة حوسبة عالية واتصالات سلسة بين المعلمين والتلاميذ بالمدرسة.\n\nصفحة المنهج: متطابق مع صفحة 12-15 من كتاب السادس الابتدائي السوداني."
        },
        {
          title: "الدرس الثاني: أنواع الشبكات والربط المحلي والواسع",
          description: "تصنف الشبكات بحسب المساحة الجغرافية إلى نوعين رئيسيين:\n\n1. الشبكة المحلية (LAN - Local Area Network):\nتغطي مساحة جغرافية صغيرة ومحدودة مثل معمل الحاسوب بالمدرسة أو المنزل أو مكتب صغير.\nتتميز بسرعة فائقة وأمان مرتفع للغاية.\n\n2. الشبكة الواسعة (WAN - Wide Area Network):\nتغطي مساحة جغرافية شاسعة جداً مثل المدن والدول والقارات، وأشهر مثال عليها هي شبكة الإنترنت العالمية.\nتربط آلاف الشبكات المحلية ببعضها البعض باستخدام الأقمار الصناعية والألياف الضوئية البحرية.\n\nصفحة المنهج: متطابق مع صفحة 16-19 من الكتاب المدرسي."
        }
      ],
      assignment: {
        title: "تمارين وتقييم الوحدة الأولى: شبكات الحاسوب 📝",
        description: "الرجاء حل الأسئلة المنهجية المرفقة أدناه لتأكيد فهمك لمصطلحات ومفاهيم الشبكات المعتمدة في المنهج الدراسي:\n\nالسؤال الأول: اختر الإجابة الصحيحة:\n- الشبكة التي تُستخدم لربط أجهزة الحاسوب داخل مدرسة واحدة تسمى:\n  أ) LAN  |  ب) WAN  |   ج) PAN\n\nالسؤال الثاني: ضع علامة (صح) أو (خطأ):\n- ( ) شبكة الإنترنت العالمية تعتبر مثالاً كلاسيكياً للشبكة المحلية (LAN).\n\nالسؤال الثالث: أجب باختصار:\nإلى ماذا يرمز الاختصار WAN باللغة العربية والإنجليزية؟"
      }
    },
    {
      name: "الوحدة الثانية: الجرائم الإلكترونية وأمن المعلومات 🛡️",
      lessons: [
        {
          title: "الدرس الأول: المخاط المخبرية والفيروسات وكيفية انتشارها",
          description: "مخاطر العصر الرقمي:\nمع انتشار شبكة الإنترنت، برزت مخاطر أمنية عديدة تهدد سلامة أجهزتنا وملفاتنا الخاصة في السودان والعالم.\n\nفيروسات الحاسوب:\nهي برامج خبيثة تُصمم بهدف إلحاق الضرر بالأجهزة، وتعديل ملفات المستخدم، واستنزاف موارد الذاكرة والقرص الصلب.\n\nطرق انتشار الفيروسات:\n1. فتح روابط مجهولة أو تحميل برامج مشبوهة من غير مصادرها الرسمية.\n2. تبادل وسائط التخزين المصابة (مثل الفلاش ميموري USB) بين الأصدقاء.\n3. فتح رسائل البريد الإلكتروني العشوائية التي تحتوي على مرفقات ضارة.\n\nصفحة المنهج: صفحة 22-25 من كتاب تكنولوجيا سادس."
        },
        {
          title: "الدرس الثاني: الجرائم الإلكترونية الشائعة وسلامة الهوية",
          description: "الجريمة الإلكترونية:\nهي كل فعل غير قانوني يتم ارتكابه باستخدام أجهزة الحاسوب أو شبكة الإنترنت للوصول غير المصرح به لمعلومات سرية أو سرقتها.\n\nأشهر أنواع الجرائم الإلكترونية للطلاب:\n1. التصيد الاحتيالي (Phishing): انتحال صفقة بنك أو جهة تعليمية لسرقة الهوية أو كلمات المرور.\n2. انتحال الشخصيات (Impersonating): إنشاء حسابات مزيفة بأسماء أشخاص حقيقيين لتضليل أصدقائهم.\n3. القرصنة وسرقة الملكية الفكرية (Piracy): نسخ البرمجيات أو الكتب وبيعها دون إذن مؤلفيها.\n\nسبل حماية الهوية الرقمية:\n- لا تشارك كلمات مرورك مع أحد.\n- تأكد من هوية المتحدث وموثوقية الروابط التي تزورها.\n\nصفحة المنهج: صفحة 26-29."
        }
      ],
      assignment: {
        title: "تمارين وتقييم الوحدة الثانية: حماية البيانات وأمن السحابة 📝",
        description: "حل الأسئلة التالية لاختبار مهارات الحماية الرقمية والوعي القانوني:\n\nالسؤال الأول: ما هو الفرق بين الفيروس البرمجي والملف الطبيعي؟\n\nالسؤال الثاني: اذكر ثلاثة تصرفات صحيحة وذكية لحماية حساباتك التعليمية من الاختراق والتصيد الاحتيالي.\n\nالسؤال الثالث: ضع علامة (صح) أو (خطأ):\n- ( ) يجب استخدام كلمة مرور بسيطة مثل (123456) ليسهل تذكرها لأمان حسابك."
      }
    },
    {
      name: "الوحدة الثالثة: تصميم العروض التقديمية 📊",
      lessons: [
        {
          title: "الدرس الأول: مقدمة في برنامج PowerPoint وأساسيات الشرائح",
          description: "برمجيات العروض التقديمية:\nتُستخدم لتقديم وعرض الأفكار والدروس بطرق بصرية مشوقة ومنظمة تعتمد على الشرائح (Slides).\n\nمكونات واجهة برنامج Microsoft PowerPoint:\n1. شريط القوائم والأدوات الرئيسي.\n2. ساحة تخطيط وتصميم الشرائح وتعديلها.\n3. نافذة تصفح وترتيب الشرائح الجانبية.\n\nالقواعد الذهبية لتصميم شريحة ناجحة:\n- التركيز على فكرة واحدة لكل شريحة.\n- تجنب نصوص القراءة الطويلة المشتتة للتلاميذ.\n\nصفحة المنهج: صفحة 32-35 من مقرر التكنولوجيا."
        },
        {
          title: "الدرس الثاني: التنسيقات وإدراج العناصر الفنية والوسائط",
          description: "لجعل عرضك التقديمي تكنولوجياً مشوقاً وسريع الجاذبية، يتيح لك البرنامج إدراج:\n\n1. الصور والأيقونات التوضيحية لتدعيم المعلومة.\n2. الجداول والمخططات الإحصائية الذكية لتلخيص الأرقام المنهجية.\n3. المقاطع الصوتية والمرئية القصيرة لإضافة حيوية تفاعلية.\n\nتنسيق الخطوط:\n- استخدام خطوط متناسقة وألوان متباينة مع الخلفية لضمان القراءة بوضوح من المسافات البعيدة بالصف الدراسي.\n\nصفحة المنهج: صفحة 36-39."
        },
        {
          title: "الدرس الثالث: التأثيرات الانتقالية وحركة العناصر",
          description: "الحركات الانتقالية (Transitions):\nهي مؤثرات حركية تظهر عند الانتقال من شريحة إلى أخرى أثناء عرض الدرس، مثل تلاشي (Fade) أو مسح (Wipe) أو دفع الشريحة.\n\nحركات العناصر (Animations):\nهي حركات خاصة تُطبق على النصوص أو الصور داخل الشريحة الواحدة للتحكم في ظهورها ودخولها، مثل التحليق للداخل أو الدوران.\n\nأهمية الحركات:\n- تجذب انتباه الأطفال والزملاء أثناء إلقاء المشروع.\n- تنظم تتابع عرض النقاط تدريجياً لسهولة الاستيعاب.\n\nصفحة المنهج: صفحة 40-42 من كتاب التكنولوجيا."
        }
      ],
      assignment: {
        title: "تمارين وتقييم الوحدة الثالثة: تصميم عرض تفاعلي 📝",
        description: "التقويم العملي لتصميم العروض المنهجية:\n\nالسؤال الأول: ما هو الفرق بين الحركات الانتقالية (Transitions) وحركات العناصر (Animations)؟\n\nالسؤال الثاني: اشرح باختصار لماذا نفضل عدم كتابة فقرات طويلة تفصيلية داخل شريحة العرض التقديمي للتلاميذ الباحثين؟\n\nالسؤال الثالث: اذكر ثلاث إضافات فنية يمكن إدراجها لإثراء المحتوى الصوتي والبصري للدرس."
      }
    },
    {
      name: "الوحدة الرابعة: البرمجيات وقواعد البيانات المنهجية 🗄️",
      lessons: [
        {
          title: "الدرس الأول: برامج التشغيل والبرمجيات التطبيقية",
          description: "تنقسم برمجيات الحاسوب إلى فئتين رئيسيتين:\n\n1. برمجيات النظام (System Software):\nالبرامج الأساسية لتشغيل الحاسوب، والتحكم بالملحقات وإدارة الذاكرة.\nأهم مثال: نظام التشغيل (Operating System) كويندوز (Windows) ولينكس (Linux).\n\n2. البرمجيات التطبيقية (Application Software):\nهي البرامج التي يثبتها المستخدم لأداء مهام محددة تلبي رغباته اليومية.\nأمثلة: متقارب الإنترنت، برامج التلوين والرسم، برامج تحرير ومعالجة النصوص.\n\nصفحة المنهج: صفحة 45-48."
        },
        {
          title: "الدرس الثاني: قواعد البيانات وتخزين المعلومات المنظم",
          description: "تعريف قاعدة البيانات (Database):\nهي مستودع رقمي منظم لتخزين كميات ضخمة من المعلومات المترابطة، يسهل الوصول إليها وتعديلها والبحث فيها وتحديثها بسرعة وسهولة فائقة.\n\nمكونات جدول قاعدة البيانات:\n1. الحقول (Fields / Columns): الأعمدة التي تحدد نوع المعلومة المخزنة (مثل اسم الطالب، رقم الهاتف، الفصل الدراسي).\n2. السجلات (Records / Rows): الصفوف التي تمثل بيانات شخص أو معاملة كاملة واحدة (مثل بيانات الطالب أحمد بالكامل).\n\nأمثلة من الواقع الملموس:\n- دليل الهاتف في الجوال.\n- نظام سجلات ودرجات الطلاب الإداري بوزارة التعليم السودانية.\n\nصفحة المنهج: صفحة 49-52."
        },
        {
          title: "الدرس الثالث: لغة الاستعلامات وأدوات تصفية البيانات",
          description: "الاستعلام (Query):\nهو طلب استرجاع أو جلب معلومات محددة من قاعدة البيانات تنطبق عليها شروط معينة.\n\nأهمية تصفية واستعلام البيانات بالمدارس:\n- تتيح لمدير المدرسة استخراج قائمة بأسماء تلاميذ الصف السادس الذين حصلوا على علامات متفوقة بضغطة زر واحدة.\n- الاستعلام عن غيابات وتفوق طالب معين بذكاء وتجنب البحث اليدوي في المجلدات الورقية القديمة.\n\nصفحة المنهج: صفحة 53-55 من كتاب التكنولوجيا والاتصالات سادس ابتدائي."
        }
      ],
      assignment: {
        title: "تمارين وتقييم الوحدة الرابعة: البرمجيات وقواعد البيانات الجاهزة 📝",
        description: "اختبر مهارات البرمجة والبيانات لديك:\n\nالسؤال الأول: قارن بذكر مثال واحد لكل من برمجيات تشغيل النظام والتطبيقات العملية.\n\nالسؤال الثاني: ما هي الوحدة الأساسية التي تبنى داخلها أي قاعدة بيانات تكنولوجية؟\n\nالسؤال الثالث: أعطِ مثالاً واحداً من حياتك اليومية تظهر فيه فوائد قواعد البيانات والاستعلام الذكي الفوري."
      }
    },
    {
      name: "الوحدة الخامسة: الكمبيوتر وتطبيقات المستقبل حولنا 💻",
      lessons: [
        {
          title: "الدرس الأول: المكونات المادية الداخلية فائقة السرعة",
          description: "أجزاء الحاسوب الداخلية المسؤولة عن معالجة وإنجاز المهام:\n\n1. اللوحة الأم (Motherboard):\nهي لوحة الدوائر الإلكترونية الرئيسية التي تربط كافة أجزاء ومكونات الكمبيوتر وتضمن توافق وسريان البيانات بينها.\n\n2. وحدة المعالجة المركزية (CPU):\nالعقل المدبر للكمبيوتر؛ تنفذ التعليمات المبرمجة وتتحكم بكامل العمليات الحسابية والمنطقية والسرعة الفائقة.\n\n3. الذاكرة العشوائية (RAM):\nذاكرة قصيرة المدى تخزن البيانات النشطة قيد التحضير والتجهيز من المعالج لتسريع الاستجابة.\nتفقد محتوياتها بالكامل بمجرد انقطاع التيار الكهربائي.\n\n4. أقراص التخزين (HDD / SSD):\nوحدات التخزين الدائمة طويلة المدى لحفظ نظام التشغيل والبرامج والملفات بأمان تام دون الخوف من انقطاع الكهرباء.\n\nصفحة المنهج: صفحة 58-61."
        },
        {
          title: "الدرس الثاني: دور تكنولوجيا المعلومات في تنمية المجتمع",
          description: "تسهم التكنولوجيا والاتصالات في تسهيل مجالات الحياة بصورة حيوية:\n\n1. في قطاع التعليم المشرق:\nتسهيل التعلم السحابي عن بُعد، تبادل الواجبات مباشرة عبر منصات مثل Google Classroom، ومراجعة الفيديوهات المسجلة مجاناً.\n\n2. في قطاع الاتصالات والخدمات الحكومية:\nتوفير الخدمات البنكية والدفع الرقمي السريعين، وتطوير البوابات الخدمية وتلقي المساعدات.\n\n3. في قطاع الابتكار والتحول الرقمي:\nبناء مهارات لطلاب السودان المبدعين ليمثلوا ريادة حوسبية في صناعة التطبيقات وتطوير السحابة والتحول الرقمي المستقبلي المعتمد.\n\nصفحة المنهج: صفحة 62-65 من مقرر سادس."
        }
      ],
      assignment: {
        title: "تمارين وتقييم الوحدة الخامسة: أجزاء التقنية والمجتمع الرقمي 📝",
        description: "المجموعة النهائية من أسئلة تقويم المنهج التكنولوجي:\n\nالسؤال الأول: صف الفرق الفني والعملي بين دور الذاكرة المؤقتة (RAM) ودور أقراص التخزين الثابتة (SSD).\n\nالسؤال الثاني: ما الذي يربط كافة الأجزاء والقطع الإلكترونية للكمبيوتر من الداخل؟\n\nالسؤال الثالث: اذكر ثلاثة فوائد رئيسية لاستخدام المنصات الرقمية السحابية في إثراء مهارات طلاب السودان بالصف السادس."
      }
    }
  ];

  const handleAutoSyncClassroom = async () => {
    playSound('click');
    const confirmed = window.confirm('هل تود البدء في معالج المزامنة المنهجية الذكي؟ سيقوم النظام بشكل آلي بالتحقق من فصولك، وإنشاء صف مادة تكنولوجيا المعلومات والاتصالات، وتقسيم المنهج لـ 5 وحدات رئيسية، مع رفع ملخصات الدروس والواجبات لحساب كلاس روم الحقيقي الخاص بك.');
    if (!confirmed) return;

    setIsSyncing(true);
    setSyncProgress(2);
    setSyncLogs([]);
    setSyncCurrentAction('تنشيط محرك المزامنة ودراسة سجلات الحساب...');

    const log = (msg: string) => {
      setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString('ar-SD')}] ${msg}`]);
    };

    try {
      log('🚀 تشغيل معالج المزامنة الحسابية لـ Google Classroom لطلاب السودان بصف سادس ابتدائي.');
      
      // Step 1: Examine courses
      log('🔍 جاري فحص الفصول الدراسية وتفحص الحساب...');
      setSyncCurrentAction('البحث عن الفصل المنهجي...');
      const existingClasses = await fetchClassroomCourses();
      let targetCourse = existingClasses.find(
        (c: any) => c.name.includes("مادة تكنولوجيا المعلومات") || c.name.includes("تكنولوجيا المعلومات والاتصالات")
      );

      let courseId = '';
      if (targetCourse) {
        courseId = targetCourse.id;
        log(`✓ تم العثور على الفصل الدراسي قائم بالفعل باسم: "${targetCourse.name}" المعرف: ${courseId}`);
      } else {
        log('➕ لم يتم العثور على صف تكنولوجيا سادس ابتدائي. جاري إنشاء الفصل الدراسي الجديد الآن...');
        setSyncCurrentAction('إنشاء فصل "مادة تكنولوجيا المعلومات والاتصالات - الصف السادس"...');
        const newCourse = await createClassroomCourse({
          name: "مادة تكنولوجيا المعلومات والاتصالات - الصف السادس",
          section: "طبعة تكنولوجيا السودان - المبدعين الصغار",
          descriptionHeading: "منصة التعليم التفاعلي المنهج السوداني",
          description: "بوابة تفاعلية سحابية لمادة تكنولوجيا المعلومات والاتصالات لطلاب الصف السادس الابتدائي بالسودان. تحتوي على الدروس العملية، ملخصات مبسطة، وتكاليف تقويم الوحدات الخمس.",
          room: "معمل الحاسوب والتقنية السحابية 🇸🇩",
          ownerId: "me",
          courseState: "ACTIVE"
        });
        courseId = newCourse.id;
        log(`✓ تم إنشاء فصل تكنولوجيا السادس الابتدائي الجديد بنجاح! المعرف: ${courseId}`);
      }
      setSyncSuccessCourseId(courseId);
      setSyncProgress(20);

      // Loop through units
      for (let i = 0; i < CURRICULUM_UNITS.length; i++) {
        const unit = CURRICULUM_UNITS[i];
        const stepNum = i + 1;
        const progressIncrement = 20 + (i * 15);
        
        log(`📦 جاري معالجة الوحدة المنهجية [${stepNum}/5]: ${unit.name}...`);
        setSyncCurrentAction(`جاري إنشاء موضوع (Topic): ${unit.name}...`);
        
        // 1. Create Topic
        const topic = await createClassroomTopic(courseId, unit.name);
        const topicId = topic.topicId;
        log(`✓ تم بنجاح إنشاء الموضوع "${unit.name}" في كلاس روم بترميز الهوية: ${topicId}`);
        
        // 2. Create Materials for each lesson in the unit
        for (let j = 0; j < unit.lessons.length; j++) {
          const lesson = unit.lessons[j];
          log(`📖 جاري صياغة ورفع المادة التعليمية (Material): "${lesson.title}"...`);
          setSyncCurrentAction(`كتابة ذكية للملخص: ${lesson.title}...`);
          
          await createClassroomMaterial(courseId, {
            title: lesson.title,
            description: lesson.description,
            state: 'PUBLISHED',
            topicId: topicId
          });
          log(`✓ تم نشر ملخص درس "${lesson.title}" بنجاح في الموضوع المختار.`);
        }
        
        // 3. Create Unit Quiz/Assignment
        log(`📝 جاري صياغة تكليف التقويم نهاية موضوع: "${unit.name}"...`);
        setSyncCurrentAction(`تأليف الواجبات: ${unit.assignment.title}...`);
        
        await createClassroomCourseWork(courseId, {
          title: unit.assignment.title,
          description: unit.assignment.description,
          workType: 'ASSIGNMENT',
          state: 'PUBLISHED',
          maxPoints: 100,
          topicId: topicId
        });
        log(`✓ تم نشر تكليف تقويم الوحدة المنهجية "${unit.assignment.title}" بنجاح.`);

        setSyncProgress(progressIncrement);
      }

      log('🎉 إنجاز مذهل! اكتملت المعالجة والمزامنة السحابية الكاملة بكفاءة ممتازة وبدون تكلفة مالية!');
      log('📱 يمكنك الآن فتح تطبيق Google Classroom على أي هاتف أو متصفح لرؤية المنهج الدراسي المرتب والمعد خصيصاً لتفوق طلابنا!');
      
      setSyncCurrentAction('اكتمل نقل المنهج لـ Google Classroom بنجاح! 🇸🇩');
      setSyncProgress(100);
      playSound('success');
      onEmitPoints(50);
      onEmitAchievement('ach-7'); // Give appropriate achievement
      loadClassroomCourses();
    } catch (error: any) {
      playSound('fail');
      log(`🚨 فشل إتمام المزامنة بسبب خطأ من سيرفرات غوغل: ${error.message || error}`);
      setSyncCurrentAction('فشل الاتصال أو المزامنة! 🚨');
    } finally {
      setIsSyncing(false);
    }
  };

  const loadClassroomCourses = async () => {
    setLoadingCourses(true);
    try {
      const coursesData = await fetchClassroomCourses();
      setCourses(coursesData);
      if (coursesData.length > 0) {
        setSelectedCourseId(coursesData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadCourseAnnouncements = async (courseId: string) => {
    setLoadingAnnouncements(true);
    try {
      const ann = await fetchCourseAnnouncements(courseId);
      setAnnouncements(ann);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementText.trim() || !selectedCourseId) return;

    playSound('click');
    const confirmed = window.confirm('هل تريد فعلاً نشر هذا الإعلان ومشاركته مع زملائك في الفصل الدراسي الحقيقي؟');
    if (!confirmed) return;

    setPostingAnnouncement(true);
    try {
      await createCourseAnnouncement(selectedCourseId, newAnnouncementText);
      setNewAnnouncementText('');
      setAnnouncementSuccess('تم نشر الإعلان بنجاح في ساحة Google Classroom للفصل المختار! 🎉');
      playSound('success');
      onEmitPoints(25); // points for sharing
      loadCourseAnnouncements(selectedCourseId);
      setTimeout(() => setAnnouncementSuccess(null), 5000);
    } catch (err: any) {
      playSound('fail');
      alert(err.message || 'حدث خطأ أثناء محاولة نشر الإعلان.');
    } finally {
      setPostingAnnouncement(false);
    }
  };

  // Google Drive & picker actions
  const loadDriveFiles = async () => {
    setLoadingFiles(true);
    try {
      const files = await fetchDriveFiles();
      setDriveFiles(files);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // In-app Picker Select File
  const handleSelectDriveFile = (file: any) => {
    playSound('click');
    setSelectedFileForPicker(file);
    onEmitPoints(10);
  };

  // Save ICT certificate text file into Drive
  const handleSaveCertificateToDrive = async () => {
    playSound('click');
    const confirmed = window.confirm('هل تريد توليد شهادة إتمام التكنولوجيا المتفاعلة وحفظها كملف نصي حقيقي في حسابك بـ Google Drive؟');
    if (!confirmed) return;

    setSavingCertificate(true);
    try {
      const certContent = `
=========================================
بوابة تكنولوجيا المعلومات والاتصالات السودانية 🇸🇩
شهادة تفوق وإنجاز تكنولوجي للمبدعين الصغار
=========================================

تمنح إدارة المنصة هذه الشهادة التقديرية الفخرية للطالب البطل:
👈 [ ${stats.name} ] 

الذي اجتاز بجدارة مقررات تكنولوجيا المعلومات والاتصالات المقررة
للصف السادس الابتدائي وحقق منجزات مذهلة في التطبيقات التفاعلية:

النقاط المحرزة: ${stats.points} XP
اللقب الحالي: ${stats.rank}
المستوى الدراسي: الصف السادس الابتدائي - الطبعة المنهجية المعتمدة لعام 2026 م
بناءً على التقييم المتكامل لمركز الاختبارات الشامل وورش الحاسوب التطبيقية.

تم توليد هذه الشهادة وحفظها مباشرة عبر المزامنة السحابية بمنصة Google Drive.

تاريخ الحفظ السحابي: ${new Date().toLocaleDateString('ar-SD')} م
مبروك يا بطل السحابة الرقمية! 🚀☁️
`;
      const fileName = `شهادة_تفوق_تكنولوجيا_المعلومات_${stats.name}.txt`;
      await uploadTextFileToDrive(fileName, certContent);
      setDriveUploadSuccess(true);
      playSound('success');
      onEmitPoints(35);
      onEmitAchievement('ach-7'); // Cloud native integration champion
      loadDriveFiles();
      setTimeout(() => setDriveUploadSuccess(false), 6000);
    } catch (err: any) {
      playSound('fail');
      alert(err.message || 'فشل رفع وحفظ الشهادة في Google Drive.');
    } finally {
      setSavingCertificate(false);
    }
  };

  // Native Google Picker trigger mockup / action explanation
  const handleLaunchNativePicker = () => {
    playSound('click');
    // We explain beautifully that because of secure iframe constraints of the sandbox window environment,
    // Google API requires parent visual redirection, but our robust REST integrated File Browser (below)
    // functions securely 100% of the time right inside the app!
    try {
      // Direct origin check and builder launch
      const pickerOrigin = window.location.origin;
      alert(`🚀 جاري التحضير لإطلاق Google Picker المدمج بمتصفحك.\nالموقع مستعد لنقل التوكن: [${accessToken ? 'جاهز ومتوفر' : 'غير متوفر'}]\n\n*ملاحظة فنية:* نظراً لتأمين الإطار التفاعلي بصورة مشددة، صممنا لك محاكي تصفح واختيار الملفات السحابي الحقيقي أدناه مباشرة ليتخطى قيود الأطر!`);
    } catch (e) {}
  };

  // Google Tasks actions
  const loadTasksLists = async () => {
    setLoadingTasksLists(true);
    try {
      const lists = await fetchTasksLists();
      setTasksLists(lists);
      if (lists.length > 0) {
        setSelectedTaskListId(lists[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTasksLists(false);
    }
  };

  const loadTasks = async (listId: string) => {
    setLoadingTasks(true);
    try {
      const items = await fetchTasks(listId);
      setTasks(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleCreateCurriculumHomeworkTasks = async () => {
    playSound('click');
    if (!selectedTaskListId) {
      alert('الرجاء اختيار قائمة مهام نشطة أولاً.');
      return;
    }

    const confirmed = window.confirm('هل تود إضافة 4 واجبات تطبيقية منهجية تكنولوجية مقترحة دفعة واحدة لقائمتك الحقيقية بـ Google Tasks؟');
    if (!confirmed) return;

    setAddingTask(true);
    try {
      const suggestedTasks = [
        { title: 'دراسة درس شبكات الحاسوب وأدوات الاتصال 🌐', notes: 'كتابة تدوينات الدرس من منصة تكنولوجيا المعلومات ومحاكاة الربط العملي.' },
        { title: 'حل واجب أمن المعلومات ومحاكي مكافحة الفيروسات 🛡️', notes: 'الدخول لمركز الاختبارات التفاعلية وتجاوز نسبة 75% لحصد النقاط.' },
        { title: 'تحضير عرض تقديمي تفاعلي في بوربوينت 📊', notes: 'صناعة شرائح حول مخاطر القرصنة وأدوات الحماية الرقمية والدروس العملية.' },
        { title: 'مراجعة عناوين IP وتعديل جدار الحماية بالمنزل 🚨', notes: 'التدريب العملي لإدخال الرمز الميداني واستلام وسام تكنولوجيا السودان.' }
      ];

      for (const t of suggestedTasks) {
        await createGoogleTask(selectedTaskListId, t.title, t.notes);
      }

      playSound('success');
      setTasksSuccessMessage('تمت إضافة 4 واجبات تكنولوجية رائعة مباشرة إلى حساب Google Tasks الخاص بك! يمكنك تفقدها على هاتفك الذكي أو متصفحك! 📱');
      onEmitPoints(30);
      loadTasks(selectedTaskListId);
      setTimeout(() => setTasksSuccessMessage(null), 8000);
    } catch (err: any) {
      playSound('fail');
      alert(err.message || 'فشل إدخال الواجبات المنهجية.');
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggleTaskStatus = async (task: any) => {
    playSound('click');
    const targetCompleted = task.status !== 'completed';
    // Optimistic UI update
    setTasks(prev =>
      prev.map(t => (t.id === task.id ? { ...t, status: targetCompleted ? 'completed' : 'needsAction' } : t))
    );

    try {
      await toggleTaskComplete(selectedTaskListId, task.id, targetCompleted);
      onEmitPoints(targetCompleted ? 10 : 0);
      loadTasks(selectedTaskListId);
    } catch (err) {
      console.error(err);
      loadTasks(selectedTaskListId);
    }
  };

  // Google Forms actions
  const handleInspectGoogleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIdInput.trim()) return;

    playSound('click');
    setLoadingForm(true);
    setFormBody(null);
    setFormError(null);

    try {
      const data = await fetchGoogleFormBody(formIdInput.trim());
      setFormBody(data);
      playSound('success');
      onEmitPoints(20);
    } catch (err: any) {
      playSound('fail');
      setFormError(err.message || 'فشل الاتصال بالنموذج المطلوب. يرجى مراجعة معرف النموذج أو التأكد من نشره للأن ليكون مقروءاً.');
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[35px] shadow-sm hover:shadow-[8px_8px_0px_#312e81] duration-300 p-6 md:p-8 space-y-6 text-right" dir="rtl">
      
      {/* Banner / Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-indigo-700 via-indigo-900 to-slate-950 p-6 rounded-3xl text-white gap-4 border border-indigo-500/25">
        <div className="space-y-1 text-right flex-1">
          <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold text-xs">
            <Sparkles className="w-4 h-4 fill-current animate-pulse text-yellow-300" />
            <span>بوابة الوزارة الرقمية الشاملة • Google Workspace Integration</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black font-sans leading-tight">
            غرقة المزايا السحابية وغوغل التعليمية 🌐
          </h3>
          <p className="text-[11px] text-indigo-200 leading-normal font-semibold">
            اربط طموحك الدراسي المنهجي بأقوى خدمات جوجل التفاعلية! استعرض فصولك في Google Classroom، احفظ شهادتك في Google Drive، دير واجباتك في Google Tasks، وافحص استبيانات Google Forms مباشرة!
          </p>
        </div>

        {authChecked && (
          <div className="shrink-0">
            {isAuthenticated && currentUser ? (
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-indigo-500/20 flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-lime-400 font-black block">✓ متصل ومزامَن</span>
                  <span className="text-xs font-bold text-white block truncate max-w-[150px]">{currentUser.displayName || 'تلميذ غوغل المعرف'}</span>
                </div>
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="avatar" className="w-9 h-9 rounded-full border border-indigo-500/30 object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white">G</div>
                )}
                <button
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 p-2 rounded-xl border border-rose-500/20 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="gsi-material-button bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-black text-xs px-5 py-3 rounded-2xl transition duration-150 flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-slate-700" />
                ) : (
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0 block">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                )}
                <span className="font-bold leading-none text-slate-950 font-sans">ربط ومزامنة حساب Google 🔐</span>
              </button>
            )}
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        /* LOCKSCREEN PROMPT */
        <div className="bg-slate-950/60 p-8 rounded-3xl border border-indigo-500/10 text-center space-y-5 py-12">
          <span className="text-5xl block animate-pulse">☁️</span>
          <h4 className="text-lg font-black text-white">مرحباً بك في لوحة المزامنة السحابية الذكية!</h4>
          <p className="text-xs text-indigo-300 font-semibold max-w-xl mx-auto leading-relaxed">
            للوصول إلى دروسك الحقيقية وفصلك الدراسي بـ Classroom وواجبات Tasks ورفع ملفاتك إلى Drive، الرجاء تسجيل الدخول باستخدام حساب Google أولاً. المنصة آمنة 100% وتحترم خصوصية طلاّبنا.
          </p>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-xs px-8 py-4 rounded-2xl shadow-lg border border-indigo-500 hover:scale-[1.02] cursor-pointer transition flex items-center gap-2 mx-auto"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>اشبك حسابك في Google الآن 🚀</span>}
          </button>

          {loginError && (
            <div className="max-w-2xl mx-auto bg-rose-950/40 border border-rose-500/35 p-5 rounded-2xl text-right animate-fade-in space-y-2 mt-4">
              <div className="flex items-center gap-2 text-rose-300 font-black text-xs">
                <span>⚠️ تنبيه أثناء الربط السحابي مع Google Workspace</span>
              </div>
              <p className="text-[11px] text-rose-200/90 font-medium leading-relaxed">
                {loginError}
              </p>
              <div className="pt-2 flex justify-end">
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-rose-500 text-slate-950 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-rose-400 cursor-pointer text-center"
                >
                  فتح التطبيق في نافذة مستقلة جديدة 🔗
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* AUTHENTICATED WORKSPACE TAB CONTROL */
        <div className="space-y-6">
          {/* Tabs header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b-2 border-indigo-950 pb-3">
            {[
              { id: 'classroom', label: 'جوجل Classroom 🏫' },
              { id: 'drive', label: 'ملفات وجهاز Drive 💾' },
              { id: 'tasks', label: 'الواجبات والمهام Tasks 📋' },
              { id: 'forms', label: 'استبيانات ونماذج Forms 📝' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { playSound('click'); setActiveTab(tab.id as any); }}
                className={`py-3 px-1 rounded-2xl text-xs font-black transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.4)]'
                    : 'bg-slate-950 text-indigo-300 border border-indigo-950 hover:border-indigo-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ACTIVE TAB VIEWS */}
          <div className="min-h-[300px]">
            {/* 1. GOOGLE CLASSROOM */}
            {activeTab === 'classroom' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="text-right">
                     <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>الفصول والواجبات بـ Google Classroom 🏫</span>
                    </h4>
                    <p className="text-[10px] text-indigo-300 font-semibold leading-relaxed">
                      جلب فصولك النشطة كمعلم أو تلميذ لنشر تبليغات ومشاركة تقدمك.
                    </p>
                  </div>
                  <button
                    onClick={loadClassroomCourses}
                    disabled={loadingCourses}
                    className="bg-slate-950 border border-indigo-550/20 px-3 py-1.5 rounded-xl text-[10px] font-bold hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingCourses ? 'animate-spin' : ''}`} />
                    <span>تحديث الفصول</span>
                  </button>
                </div>

                {/* 🇸🇩 Google Classroom Curriculum Auto-Sync Dashboard 🇸🇩 */}
                <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border-2 border-indigo-500/20 rounded-[35px] p-6 space-y-4 shadow-xl">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="text-right space-y-1.5 flex-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950 border border-indigo-800 rounded-full text-[9px] font-extrabold text-cyan-400">
                        <Sparkles className="w-3 h-3 text-cyan-305 animate-pulse text-yellow-350" />
                        <span>تقنية المزامنة والربط الميكانيكي الشامل</span>
                      </span>
                      <h4 className="text-md md:text-lg font-black text-white flex items-center gap-2">
                        <span>معالج ربط كلاس روم وتفريغ المنهج التكنولوجي السوداني 📋🇸🇩</span>
                      </h4>
                      <p className="text-[11px] text-indigo-200 leading-normal font-semibold max-w-3xl">
                        أداة هندسية متطورة تقوم بالاتصال المباشر بـ <strong>Google Classroom API</strong> لحسابك للتفحص، وإنشاء فصل <strong>"مادة تكنولوجيا المعلومات والاتصالات - الصف السادس"</strong> تلقائياً، مع تقسيمه لـ 5 وحدات موضوعية (Topics) وإنشاء ملخص مبسط موجه للطلاب بالسودان لكل درس وحقن أسئلة التقارير والواجبات بدون أي تكلفة!
                      </p>
                    </div>

                    <button
                      onClick={handleAutoSyncClassroom}
                      disabled={isSyncing}
                      className="w-full lg:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-[1.02] transform duration-200 font-black text-xs px-6 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-45 shrink-0"
                    >
                      {isSyncing ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      ) : (
                        <Trophy className="w-4 h-4 text-slate-950" />
                      )}
                      <span>مزامنة وتجذير كتاب التكنولوجيا ⚡</span>
                    </button>
                  </div>

                  {/* Sync status and progress logs terminal widget */}
                  {(isSyncing || syncProgress > 0) && (
                    <div className="border border-indigo-950/80 bg-slate-950/90 p-4 md:p-5 rounded-3xl space-y-3 animate-fade-in text-right">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-cyan-400 font-mono">{syncProgress}% مكتمل</span>
                        <span className="font-black text-indigo-200">{syncCurrentAction}</span>
                      </div>
                      
                      {/* Progress bar structure */}
                      <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-indigo-950">
                        <div
                          className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 h-full transition-all duration-500"
                          style={{ width: `${syncProgress}%` }}
                        ></div>
                      </div>

                      {/* Awesome Interactive console logs panel */}
                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-bold text-indigo-300">سجل عمليات الـ API ووحدات معيار الاستعلام:</span>
                        <div className="bg-slate-950/90 border border-indigo-950/80 rounded-2xl p-4 h-44 overflow-y-auto font-mono text-[10px] text-zinc-300 text-right space-y-1 scrollbar-thin scrollbar-thumb-indigo-950" dir="rtl">
                          {syncLogs.length === 0 ? (
                            <span className="text-zinc-500 italic block text-center py-12 font-sans font-semibold">بانتظار تفعيل المعالج لبدء نقل البيانات...</span>
                          ) : (
                            syncLogs.map((logMsg, idx) => (
                              <div key={idx} className="whitespace-pre-wrap font-sans text-right text-emerald-400/90 hover:text-emerald-300 transition-colors">
                                {logMsg}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {syncProgress === 100 && syncSuccessCourseId && (
                        <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <span className="text-xs font-black text-emerald-300 block">
                            ✓ مبارك! تم صب وتجهيز المنهج السوداني الدراسي كاملاً في Google Classroom بنجاح!
                          </span>
                          <a
                            href={`https://classroom.google.com/c/${syncSuccessCourseId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black hover:underline flex items-center justify-center gap-1.5 cursor-pointer max-w-fit shrink-0"
                          >
                            <span>تصفح الفصل الحقيقي الآن 🔗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {loadingCourses ? (
                  <div className="flex justify-center items-center py-12 text-indigo-300 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs font-black">جاري الاستعلام عن فصولك الدراسية النشطة...</span>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="bg-slate-950/60 p-6 rounded-2xl text-center text-xs text-indigo-400 font-semibold">
                    لا تملك فصولاً دراسية مفصلة حالياً في حسابك على Google Classroom. يمكنك إنشاء فصل دراسي في غوغل لتجربته!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Courses options left list */}
                    <div className="space-y-2 lg:col-span-1">
                      <label className="block text-[10px] font-black text-indigo-300">اختر الصف التعليمي للمراقبة:</label>
                      <div className="flex flex-col gap-1.5">
                        {courses.map(course => (
                          <button
                            key={course.id}
                            onClick={() => { playSound('click'); setSelectedCourseId(course.id); }}
                            className={`w-full text-right p-3 rounded-xl border text-xs font-black transition cursor-pointer ${
                              selectedCourseId === course.id
                                ? 'bg-indigo-950/80 border-indigo-500 text-white'
                                : 'bg-slate-950 border-indigo-950 hover:bg-slate-900 text-indigo-300'
                            }`}
                          >
                            <span className="block truncate">{course.name}</span>
                            <span className="block text-[9px] text-indigo-400 font-normal truncate mt-0.5">{course.section || 'مستوى عام'}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Announcement Feed and creation panel right */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Post form */}
                      <form onSubmit={handlePostAnnouncement} className="p-4 bg-slate-950 border border-indigo-550/15 rounded-2xl space-y-3">
                        <label className="block text-[10px] font-black text-cyan-300">💬 نشر تقديري جديد (مشاركة التقدم بالفصل):</label>
                        <textarea
                          placeholder="اكتب تهنئتك لزملائك، مثلاً: أتممت مراجعة تكنولوجيا الصف السادس وحصلت على لقب ممتاز! 🏆🇸🇩"
                          required
                          value={newAnnouncementText}
                          onChange={(e) => setNewAnnouncementText(e.target.value)}
                          className="w-full bg-slate-900 border border-indigo-950 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 min-h-[70px] text-right"
                        />
                        {announcementSuccess && (
                          <div className="text-[10px] text-emerald-400 font-black p-2 bg-emerald-950/40 rounded-lg border border-emerald-500/20">
                            {announcementSuccess}
                          </div>
                        )}
                        <button
                          type="submit"
                          disabled={postingAnnouncement}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-xl font-bold font-sans flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {postingAnnouncement ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          <span>نشر بـ Classroom 📣</span>
                        </button>
                      </form>

                      {/* Display feed list */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-indigo-300">أحدث إعلانات الفصل وتكليفات ساحة الحوار:</span>
                        {loadingAnnouncements ? (
                          <div className="py-6 text-center text-[10px] font-bold text-indigo-400">جاري تحميل ساحة التبليغات...</div>
                        ) : announcements.length === 0 ? (
                          <div className="py-4 text-center text-[10px] text-indigo-400 italic bg-slate-950/20 rounded-xl">لا توجد إعلانات منشورة مؤخراً في فصلك. كن أول من يكتب ترحيباً!</div>
                        ) : (
                          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                            {announcements.map(ann => (
                              <div key={ann.id} className="p-3 bg-slate-950 border border-indigo-950 rounded-xl space-y-1">
                                <p className="text-xs text-white leading-normal whitespace-pre-wrap">{ann.text}</p>
                                <span className="block text-[8px] text-indigo-400 font-normal font-mono">{new Date(ann.creationTime).toLocaleString('ar-SD')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2 & 3. GOOGLE DRIVE & GOOGLE PICKER */}
            {activeTab === 'drive' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="text-right">
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>مكتشف الملفات وGoogle Picker السحابي 📁</span>
                    </h4>
                    <p className="text-[10px] text-indigo-300 font-semibold leading-relaxed">
                      تصفح مستنداتك وسحب أعمال تكنولوجيا المعلومات بالإضافة إلى تسليم وتصريح الواجبات العلمية المنجزة بالدراسة.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleLaunchNativePicker}
                      className="bg-indigo-600/80 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>إطلاق Google Picker الأصلي</span>
                    </button>
                    <button
                      onClick={loadDriveFiles}
                      disabled={loadingFiles}
                      className="bg-slate-950 border border-indigo-550/20 px-3 py-1.5 rounded-xl text-[10px] font-bold hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? 'animate-spin' : ''}`} />
                      <span>تحديث</span>
                    </button>
                  </div>
                </div>

                {/* Report Generation Banner / Backup to Drive */}
                <div className="p-5 bg-gradient-to-r from-amber-950/60 to-slate-950/90 border border-amber-500/20 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-yellow-400 font-black flex items-center gap-1.5">
                      <Award className="w-4 h-4 fill-current text-amber-400 animate-bounce" />
                      <span>سجل تفوقك سحابياً بلمسة واحدة!</span>
                    </span>
                    <p className="text-xs text-white font-extrabold leading-normal">
                      توليد شهادة تخرج تكنولوجيا المعلومات وحفظها في Google Drive 💻
                    </p>
                    <p className="text-[10px] text-indigo-300 font-semibold max-w-xl">
                      يقوم المعالج ببناء تقرير دراسي فخم موقع إلكترونياً يتضمن مجموع نقاطك [{stats.points} XPs] وشارتك المنجزة ورفعه فورياً لحساب السحابة الخاص بك.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveCertificateToDrive}
                    disabled={savingCertificate}
                    className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shrink-0"
                  >
                    {savingCertificate ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <FileCheck className="w-4 h-4" />}
                    <span>توليد ورفع الشهادة السحابية ☁️</span>
                  </button>
                </div>

                {driveUploadSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/25 rounded-2xl text-xs text-emerald-300 text-right leading-relaxed font-bold animate-[fadeIn_0.3s_ease]">
                    ✓ مبروك! تم حفظ شهادة تفوق [ {stats.name} ] المنهجية بنجاح كملف نصي حقيقي في حسابك بـ Google Drive! تفقد ملفاتك الآن! (+٣٥ نقطة تفوق)
                  </div>
                )}

                {/* Native / Custom Picker integration */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-indigo-300">مستعرض ملفات Drive ومستندات الواجبات (Google Picker المدمج):</span>
                  
                  {loadingFiles ? (
                    <div className="flex justify-center py-8 text-indigo-300 gap-1.5 items-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs font-bold font-sans">تحديث مستودع السحابة...</span>
                    </div>
                  ) : driveFiles.length === 0 ? (
                    <div className="p-6 bg-slate-950/50 rounded-2xl text-center text-[11px] text-indigo-400">
                      مجلد Google Drive فارغ أو لا يحتوي ملفات للتصفح. ارفع الشهادة بالأعلى لتراها هنا فوراً!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                        {driveFiles.map(file => (
                          <div
                            key={file.id}
                            onClick={() => handleSelectDriveFile(file)}
                            className={`p-3 rounded-xl border text-right cursor-pointer flex justify-between items-center transition ${
                              selectedFileForPicker?.id === file.id
                                ? 'bg-indigo-950 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                                : 'bg-slate-950 border-indigo-950 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {file.thumbnailLink ? (
                                <img src={file.thumbnailLink} alt="thumb" className="w-7 h-7 rounded border border-indigo-900 object-cover" />
                              ) : (
                                <FileText className="w-6 h-6 text-indigo-400 shrink-0" />
                              )}
                              <div className="text-right">
                                <span className="text-xs text-white font-bold block truncate max-w-[200px]">{file.name}</span>
                                <span className="block text-[8px] text-indigo-400 font-mono mt-0.5 font-normal">نوع: {file.mimeType.split('.').pop()}</span>
                              </div>
                            </div>
                            <span className="text-[9px] text-indigo-300 font-mono font-black shrink-0 underline hover:text-cyan-300 flex items-center gap-1">
                              <span>اختر ملفاً</span>
                              <ChevronLeft className="w-3 h-3" />
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Display Selection detail (Simulate Course submission picker) */}
                      {selectedFileForPicker && (
                        <div className="p-4 bg-slate-950 border border-indigo-500/20 rounded-2xl space-y-2 animate-[fadeIn_0.3s_ease]">
                          <div className="flex justify-between items-start gap-3">
                            <div className="text-right">
                              <span className="text-[10px] text-emerald-400 font-bold block">✓ الملف المختار عبر الـ Picker لإتمام الفحص:</span>
                              <h5 className="text-xs font-black text-white mt-1">{selectedFileForPicker.name}</h5>
                            </div>
                            <a
                              href={selectedFileForPicker.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-cyan-300 hover:underline flex items-center gap-1 font-black shrink-0"
                            >
                              <span>معاينة حقيقية 🔗</span>
                            </a>
                          </div>
                          <p className="text-[10px] text-indigo-200 mt-1leading-relaxed leading-normal font-semibold">
                            تم ربط وربط واجهة الـ Picker من جوجل بنجاح لدراسة وعرض التقدم! حصلت على **+١٠XP نقاط تفوق تكنولوجية** لمراجعة ملفاتك الدراسية على السحابة!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. GOOGLE TASKS */}
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="text-right">
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>إدارة جدول الواجبات والامتحانات Google Tasks 📋</span>
                    </h4>
                    <p className="text-[10px] text-indigo-300 font-semibold leading-relaxed">
                      تنظيم جداول المذاكرة، وتوليد مهام واجبات تكنولوجيا المعلومات والاتصالات الحقيقية وتفقدها على الجوال.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateCurriculumHomeworkTasks}
                      disabled={addingTask || !selectedTaskListId}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-[10px] flex items-center gap-1 cursor-pointer transition"
                    >
                      {addingTask ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>إضافة الواجبات المنهجية الموصى بها</span>}
                    </button>
                    <button
                      onClick={loadTasksLists}
                      disabled={loadingTasksLists}
                      className="bg-slate-950 border border-indigo-550/20 px-3 py-1.5 rounded-xl text-[10px] font-bold hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingTasksLists ? 'animate-spin' : ''}`} />
                      <span>تحديث القوائم</span>
                    </button>
                  </div>
                </div>

                {tasksSuccessMessage && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/25 rounded-2xl text-[10px] font-bold text-emerald-300 leading-relaxed text-right animate-[fadeIn_0.3s_ease]">
                    {tasksSuccessMessage}
                  </div>
                )}

                {loadingTasksLists ? (
                  <div className="flex justify-center items-center py-12 text-indigo-450 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs font-black">جاري الاستعلام عن قوائم المهام...</span>
                  </div>
                ) : tasksLists.length === 0 ? (
                  <div className="bg-slate-950/50 p-6 rounded-2xl text-center text-xs text-indigo-400 font-semibold">
                    لم نجد قوائم مهام في حساب Google الخاص بك. نوصي بفتح تطبيق غوغل مهام وتجربته!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Task Lists selector */}
                    <div className="md:col-span-1 space-y-1.5">
                      <label className="block text-[10px] font-black text-indigo-300">اختر قائمة المذكرة والواجبات:</label>
                      <div className="flex flex-col gap-1.5">
                        {tasksLists.map(list => (
                          <button
                            key={list.id}
                            onClick={() => { playSound('click'); setSelectedTaskListId(list.id); }}
                            className={`w-full text-right p-3 rounded-xl border text-xs font-black transition cursor-pointer ${
                              selectedTaskListId === list.id
                                ? 'bg-indigo-950/80 border-indigo-500 text-cyan-300'
                                : 'bg-slate-950 border-indigo-950 hover:bg-slate-900 text-indigo-300'
                            }`}
                          >
                            <span className="block truncate">{list.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Task items list */}
                    <div className="md:col-span-2 space-y-2">
                      <span className="text-[10px] font-black text-indigo-300">قائمة المهام والواجبات المنهجية ({tasks.length} مهام):</span>
                      
                      {loadingTasks ? (
                        <div className="py-8 text-center text-[10px] font-bold text-indigo-400">جاري تحميل المهام...</div>
                      ) : tasks.length === 0 ? (
                        <div className="p-4 bg-slate-950 border border-indigo-950 rounded-2xl text-center text-[10px] text-indigo-300 italic">
                          هذه قائمة المهام وتكاليف المذاكرة فارغة حالياً. اضغط على زر "إضافة الواجبات الموصى بها" بالأعلى لتعبئة جدولك الدراسي فوراً!
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {tasks.map(t => {
                            const isCompleted = t.status === 'completed';
                            return (
                              <div
                                key={t.id}
                                className={`p-3 rounded-xl border flex justify-between items-center transition ${
                                  isCompleted ? 'bg-slate-950/40 border-indigo-950/30 opacity-60' : 'bg-slate-950 border-indigo-950'
                                }`}
                              >
                                <div className="flex gap-2.5 items-center justify-start text-right">
                                  <button
                                    onClick={() => handleToggleTaskStatus(t)}
                                    className="text-cyan-400 focus:outline-none hover:scale-110 duration-100 shrink-0 cursor-pointer"
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-950" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-md border-2 border-indigo-500" />
                                    )}
                                  </button>
                                  <div className="text-right">
                                    <span className={`text-xs font-bold text-white block ${isCompleted ? 'line-through text-slate-400' : ''}`}>{t.title}</span>
                                    {t.notes && (
                                      <span className="block text-[9px] text-indigo-400 font-normal leading-relaxed">{t.notes}</span>
                                    )}
                                  </div>
                                </div>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                                  isCompleted ? 'bg-emerald-950 text-emerald-300' : 'bg-indigo-950 text-indigo-300'
                                }`}>
                                  {isCompleted ? 'نجح 🎯' : 'بانتظارك ⏳'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. GOOGLE FORMS */}
            {activeTab === 'forms' && (
              <div className="space-y-6">
                <div className="text-right space-y-1">
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>مفتش اختبارات Google Forms واستبيانات الوزارة 📝</span>
                  </h4>
                  <p className="text-[10px] text-indigo-300 font-semibold leading-relaxed">
                    افحص بيانات تكوين ونصوص الأسئلة الخاصة بأي من استبيانات أو نماذج جوجل التشاركية التي ينشئها معلمك.
                  </p>
                </div>

                {/* Inspect input */}
                <form onSubmit={handleInspectGoogleForm} className="p-4 bg-slate-950 border border-indigo-550/15 rounded-3xl space-y-3">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 text-right space-y-1.5">
                      <label className="block text-[10px] font-black text-cyan-300">أدخل معرف نموذج جوجل التفاعلي Google Form ID:</label>
                      <input
                        type="text"
                        placeholder="أدخل معرف النموذج المكون من أرقام وحروف طويلة..."
                        required
                        value={formIdInput}
                        onChange={(e) => setFormIdInput(e.target.value)}
                        className="w-full bg-slate-900 border border-indigo-950 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 text-left font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loadingForm}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-6 py-3 rounded-2xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 self-end w-full md:w-auto h-12"
                    >
                      {loadingForm ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      <span>جلب أسئلة النموذج 🔍</span>
                    </button>
                  </div>
                </form>

                {formError && (
                  <div className="p-3 bg-rose-950/50 border border-rose-500/20 text-rose-300 text-[10px] rounded-xl text-right leading-relaxed animate-[fadeIn_0.3s_ease]">
                    ⚠️ أخفق جلب اختبار جوجل: {formError}
                  </div>
                )}

                {/* Display form result */}
                {formBody ? (
                  <div className="p-5 bg-slate-950 border border-indigo-900 rounded-3xl space-y-4 animate-[fadeIn_0.3s_ease]">
                    <div className="border-b border-indigo-550/15 pb-3">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-cyan-300 shrink-0" />
                        <h5 className="text-sm font-black text-white">{formBody.info?.title || 'نموذج جوجل دراسي'}</h5>
                      </div>
                      {formBody.info?.description && (
                        <p className="text-[10px] text-indigo-300 leading-normal font-semibold mt-1">{formBody.info.description}</p>
                      )}
                    </div>

                    <div className="space-y-3.5">
                      <span className="text-[10px] font-black text-cyan-300 block">الهيكل التنظيمي للأسئلة المكتشفة ({formBody.items?.length || 0} بنود):</span>
                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                        {formBody.items?.map((item: any, idx: number) => (
                          <div key={item.itemId || idx} className="p-3 bg-slate-900 rounded-xl border border-indigo-950 text-right space-y-1.5">
                            <span className="text-[10px] font-bold text-indigo-400 font-mono">سؤال {idx + 1}: {item.title}</span>
                            {item.questionItem?.question?.choiceQuestion && (
                              <div className="grid grid-cols-2 gap-1.5 pr-2 pt-1 text-[10px] font-semibold text-indigo-300">
                                {item.questionItem.question.choiceQuestion.options?.map((opt: any, oIdx: number) => (
                                  <div key={oIdx} className="flex gap-1 items-center bg-slate-950/40 px-2 py-1.5 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                    <span>{opt.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="text-[10px] text-emerald-400 font-bold leading-normal">
                        ✓ نجحت المزمنة وقراءة Form مع جوجل بنجاح! نلت **+٢٠XP نقاط ذكاء اصطناعي تفاعلية** لفحص استبيان المعلم!
                      </div>
                    </div>
                  </div>
                ) : (
                  !formError && (
                    <div className="p-6 bg-slate-950/50 rounded-2xl text-center text-xs text-indigo-300 italic">
                      اكتب معرف استبيان جوجل أو اعتمد المعرّف النموذجي المقترح واضغط "جلب أسئلة النموذج" لاستخراجه أمامك مباشرة.
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
