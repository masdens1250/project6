import { create } from 'zustand';
import { Group, Test, Report } from '../types/dashboard';

// Fonction pour charger les données depuis localStorage
const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Erreur lors du chargement des données ${key}:`, error);
  }
  return defaultValue;
};

// Fonction pour sauvegarder les données dans localStorage
const saveToLocalStorage = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des données ${key}:`, error);
  }
};

interface DashboardState {
  groups: Group[];
  tests: Test[];
  reports: Report[];
  setGroups: (groups: Group[]) => void;
  setTests: (tests: Test[]) => void;
  setReports: (reports: Report[]) => void;
  addGroup: (group: Group) => void;
  addTest: (test: Test) => void;
  addReport: (report: Report) => void;
  updateGroup: (group: Group) => void;
  updateTest: (test: Test) => void;
  updateReport: (report: Report) => void;
  deleteGroup: (id: string) => void;
  deleteTest: (id: string) => void;
  deleteReport: (id: string) => void;
  getCompletedTestsCount: () => number;
  getCompletedReportsCount: () => number;
}

const defaultGroups: Group[] = [
  {
    id: '1',
    name: 'الفوج1',
    level: 'س1 متوسط',
    studentCount: 25,
    schedule: [
      { day: 'الأحد', time: '08:00 - 10:00' },
      { day: 'الثلاثاء', time: '13:00 - 15:00' }
    ]
  },
  {
    id: '2',
    name: 'الفوج2',
    level: 'س2 متوسط',
    studentCount: 28,
    schedule: [
      { day: 'الاثنين', time: '10:00 - 12:00' },
      { day: 'الخميس', time: '14:00 - 16:00' }
    ]
  }
];

const defaultTests: Test[] = [
  {
    id: '1',
    title: 'اختبار الذكاء المتعدد',
    type: 'فردي',
    duration: 45,
    targetLevel: 'س1 متوسط',
    description: 'يقيس هذا الاختبار مختلف أنواع الذكاء لدى التلميذ',
    questionCount: 30,
    lastUsed: '2024-02-15',
    completed: true
  },
  {
    id: '2',
    title: 'اختبار الميول المهنية',
    type: 'جماعي',
    duration: 60,
    targetLevel: 'س4 متوسط',
    description: 'يساعد في تحديد الميول المهنية للتلاميذ',
    questionCount: 40,
    lastUsed: '2024-02-20',
    completed: true
  }
];

const defaultReports: Report[] = [
  {
    id: '1',
    title: 'تقرير الفصل الأول - س4 متوسط',
    type: 'فصلي',
    trimester: '1',
    targetGroup: 'س4 متوسط',
    studentCount: 120,
    coverage: 85,
    objectives: [
      'تقييم مستوى التحصيل الدراسي',
      'تحديد الصعوبات والعقبات',
      'وضع خطة للتحسين'
    ],
    notes: 'تحسن ملحوظ في مستوى التلاميذ مقارنة بالسنة الماضية',
    createdAt: '2024-02-01',
    status: 'مكتمل'
  }
];

export const useDashboardStore = create<DashboardState>((set, get) => ({
  groups: loadFromLocalStorage('groups', defaultGroups),
  tests: loadFromLocalStorage('tests', defaultTests),
  reports: loadFromLocalStorage('reports', defaultReports),

  setGroups: (groups) => {
    set({ groups });
    saveToLocalStorage('groups', groups);
  },
  setTests: (tests) => {
    set({ tests });
    saveToLocalStorage('tests', tests);
  },
  setReports: (reports) => {
    set({ reports });
    saveToLocalStorage('reports', reports);
  },

  addGroup: (group) => {
    const newGroups = [...get().groups, group];
    set({ groups: newGroups });
    saveToLocalStorage('groups', newGroups);
  },
  addTest: (test) => {
    const newTests = [...get().tests, test];
    set({ tests: newTests });
    saveToLocalStorage('tests', newTests);
  },
  addReport: (report) => {
    const newReports = [...get().reports, report];
    set({ reports: newReports });
    saveToLocalStorage('reports', newReports);
  },

  updateGroup: (group) => {
    const updatedGroups = get().groups.map((g) => g.id === group.id ? group : g);
    set({ groups: updatedGroups });
    saveToLocalStorage('groups', updatedGroups);
  },
  updateTest: (test) => {
    const updatedTests = get().tests.map((t) => t.id === test.id ? test : t);
    set({ tests: updatedTests });
    saveToLocalStorage('tests', updatedTests);
  },
  updateReport: (report) => {
    const updatedReports = get().reports.map((r) => r.id === report.id ? report : r);
    set({ reports: updatedReports });
    saveToLocalStorage('reports', updatedReports);
  },

  deleteGroup: (id) => {
    const filteredGroups = get().groups.filter((g) => g.id !== id);
    set({ groups: filteredGroups });
    saveToLocalStorage('groups', filteredGroups);
  },
  deleteTest: (id) => {
    const filteredTests = get().tests.filter((t) => t.id !== id);
    set({ tests: filteredTests });
    saveToLocalStorage('tests', filteredTests);
  },
  deleteReport: (id) => {
    const filteredReports = get().reports.filter((r) => r.id !== id);
    set({ reports: filteredReports });
    saveToLocalStorage('reports', filteredReports);
  },

  getCompletedTestsCount: () => get().tests.filter(test => test.completed).length,
  getCompletedReportsCount: () => get().reports.filter(report => report.status === 'مكتمل').length,
}));