export interface Student {
  id: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  gender: 'ذكر' | 'أنثى';
  level: string;
  group: string;
  isRepeating: boolean;
}