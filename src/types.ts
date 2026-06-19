export type SimulatorType = 'network' | 'cyber' | 'presentation' | 'database' | 'bank_police';

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  pageNumber: number;
  objectives: string[];
  content: string[];
  interactiveTitle: string;
  interactiveDesc: string;
  simulator: SimulatorType;
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  iconName: string;
  lessons: Lesson[];
}

export interface Question {
  id: string;
  unitId: string;
  lessonId?: string;
  type: 'theoretical' | 'practical';
  text: string;
  options?: string[]; // for theoretical multiple choice
  correctOption?: number; // index of the correct option
  explanation: string;
  
  // For practical tasks
  taskType?: SimulatorType;
  taskGoal?: string;
  taskValidationCode?: string; // custom string to check step-by-step
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  name: string;
  avatar: string;
  points: number;
  rank: string;
  completedLessons: string[]; // lessonIds
  completedExams: string[]; // unitIds
  theoreticalHighScore: number;
  practicalHighTaskCount: number;
  achievements: Achievement[];
}
