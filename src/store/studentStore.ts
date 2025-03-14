import { create } from 'zustand';
import { Student } from '../types/student';

// Fonction pour charger les données initiales depuis localStorage
const loadInitialState = (): Student[] => {
  try {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      return JSON.parse(savedStudents);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
  
  // Données par défaut si rien n'est trouvé dans localStorage
  return [
    {
      id: '12345678901234',
      lastName: 'بن محمد',
      firstName: 'أحمد',
      birthDate: '2010/05/15',
      gender: 'ذكر',
      level: 'س1 متوسط',
      group: 'الفوج1',
      isRepeating: false
    },
    {
      id: '98765432109876',
      lastName: 'الزهراء',
      firstName: 'فاطمة',
      birthDate: '2009/08/20',
      gender: 'أنثى',
      level: 'س2 متوسط',
      group: 'الفوج2',
      isRepeating: true
    }
  ];
};

// Fonction pour sauvegarder les données dans localStorage
const saveToLocalStorage = (students: Student[]) => {
  try {
    localStorage.setItem('students', JSON.stringify(students));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données:', error);
  }
};

interface StudentState {
  students: Student[];
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: loadInitialState(),
  setStudents: (students) => {
    set({ students });
    saveToLocalStorage(students);
  },
  addStudent: (student) => {
    const newStudents = [...get().students, student];
    set({ students: newStudents });
    saveToLocalStorage(newStudents);
  },
  updateStudent: (student) => {
    const updatedStudents = get().students.map((s) => 
      s.id === student.id ? student : s
    );
    set({ students: updatedStudents });
    saveToLocalStorage(updatedStudents);
  },
  deleteStudent: (id) => {
    const filteredStudents = get().students.filter((s) => s.id !== id);
    set({ students: filteredStudents });
    saveToLocalStorage(filteredStudents);
  },
  getStudentById: (id) => get().students.find((s) => s.id === id)
}));