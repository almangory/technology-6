import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Reuse or initialize the Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'consent'
});

// Add the scopes required for our Google Workspace features
const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
  'https://www.googleapis.com/auth/classroom.announcements',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly'
];

SCOPES.forEach(scope => provider.addScope(scope));

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  // Try retrieving cached token from memory during session or onAuthStateChanged
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // If we have a user but no token cached in memory (e.g. reload),
        // we'll trigger sign-in pops or let UI handle authenticating.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Initiate Google Sign-In pop-up
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google OAuth Access Token.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Workspace authentication error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// ==========================================
// 1. Google Classroom API Operations
// ==========================================

export async function fetchClassroomCourses() {
  const token = getAccessToken();
  if (!token) throw new Error('يرجى تسجيل الدخول أولاً للاتصال بحساب Google.');

  const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'فشل في جلب الفصول الدراسية.');
  }
  const data = await res.json();
  return data.courses || [];
}

export async function fetchCourseAnnouncements(courseId: string) {
  const token = getAccessToken();
  if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('فشل في جلب إعلانات الفصل.');
  const data = await res.json();
  return data.announcements || [];
}

export async function createCourseAnnouncement(courseId: string, text: string) {
  const token = getAccessToken();
  if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      state: 'PUBLISHED',
    }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'فشل نشر الإعلان في الفصل.');
  }
  return await res.json();
}

// ==========================================
// 2 & 3. Google Drive / Google Picker (REST based folder explorer)
// ==========================================

export async function fetchDriveFiles() {
  const token = getAccessToken();
  if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

  // Exclude folders for clean list and request metadata details
  const q = encodeURIComponent("trashed = false and mimeType != 'application/vnd.google-apps.folder'");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,size,webViewLink,iconLink,thumbnailLink)`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('فشل جلب ملفات Google Drive.');
  const data = await res.json();
  return data.files || [];
}

export async function uploadTextFileToDrive(fileName: string, content: string) {
  const token = getAccessToken();
  if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

  // Create multipart/related upload for file and metadata
  const metadata = {
    name: fileName,
    mimeType: 'text/plain',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    content +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'فشل حفظ الملف في Drive.');
  }
  return await res.json();
}

// ==========================================
// 4. Google Tasks API Operations
// ==========================================

export async function fetchTasksLists() {
  const token = getAccessToken();
  if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

  const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('فشل جلب قوائم المهام.');
  const data = await res.json();
  return data.items || [];
}

export async function fetchTasks(listId: string) {
  const token = getAccessToken();
  if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('فشل جلب المهام من القائمة.');
  const data = await res.json();
  return data.items || [];
}

export async function createGoogleTask(listId: string, title: string, notes?: string) {
  const token = getAccessToken();
  if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      notes,
      status: 'needsAction'
    }),
  });
  if (!res.ok) throw new Error('فشل إضافة مهمة جديدة.');
  return await res.json();
}

export async function toggleTaskComplete(listId: string, taskId: string, completed: boolean) {
  const token = getAccessToken();
  if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: completed ? 'completed' : 'needsAction',
      completed: completed ? new Date().toISOString() : null
    }),
  });
  if (!res.ok) throw new Error('فشل تعديل حالة المهمة.');
  return await res.json();
}

// ==========================================
// 5. Google Forms API Operations
// ==========================================

export async function fetchGoogleFormBody(formId: string) {
  const token = getAccessToken();
  if (!token) throw new Error('يرجى تسجيل الدخول أولاً.');

  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'لم يثبت العثور على النموذج الدراسي. تأكد من صحة معرف النموذج Google Form ID.');
  }
  return await res.json();
}
