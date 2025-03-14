export interface Group {
  id: string;
  name: string;
  level: string;
  studentCount: number;
  schedule: {
    day: string;
    time: string;
  }[];
}

export interface Test {
  id: string;
  title: string;
  type: 'فردي' | 'جماعي';
  duration: number;
  targetLevel: string;
  description: string;
  questionCount: number;
  lastUsed?: string;
  completed: boolean;
}

export interface Report {
  id: string;
  title: string;
  type: 'فصلي' | 'توجيهي' | 'متابعة';
  trimester?: '1' | '2' | '3';
  targetGroup?: string;
  studentCount?: number;
  coverage: number;
  objectives: string[];
  notes?: string;
  createdAt: string;
  status: 'مكتمل' | 'مسودة';
}