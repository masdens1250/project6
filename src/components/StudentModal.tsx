import React from 'react';
import { X } from 'lucide-react';
import { Student } from '../types/student';
import { useStudentStore } from '../store/studentStore';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student;
  onSave: (student: Student) => void;
  viewMode?: boolean;
}

const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave,
  viewMode = false
}) => {
  const [formData, setFormData] = React.useState<Partial<Student>>(
    student || {
      id: '',
      lastName: '',
      firstName: '',
      birthDate: '',
      gender: 'ذكر',
      level: 'س1 متوسط',
      group: 'الفوج1',
      isRepeating: false,
    }
  );

  // Mettre à jour les données du formulaire lorsque l'élève change
  React.useEffect(() => {
    if (student) {
      // Formater la date si elle existe
      const formattedStudent = {
        ...student,
        birthDate: student.birthDate ? formatDateForInput(student.birthDate) : ''
      };
      setFormData(formattedStudent);
    }
  }, [student]);

  const [idError, setIdError] = React.useState('');

  const validateId = (value: string) => {
    const idRegex = /^[0-9X]{14}$/;
    if (!idRegex.test(value)) {
      setIdError('يجب أن يتكون رقم التعريف من 14 رقم');
      return false;
    }
    setIdError('');
    return true;
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^0-9X]/g, '').slice(0, 14);
    setFormData({ ...formData, id: value });
    validateId(value);
  };

  // Convertir DD/MM/YYYY vers YYYY-MM-DD pour l'input date
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    
    // Gérer les différents formats possibles
    const formats = [
      /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
      /^(\d{4})\/(\d{2})\/(\d{2})$/  // YYYY/MM/DD
    ];
    
    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        if (format === formats[0]) {
          // Convertir DD/MM/YYYY vers YYYY-MM-DD
          const [_, day, month, year] = match;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
          // Déjà au format YYYY/MM/DD, convertir les / en -
          const [_, year, month, day] = match;
          return `${year}-${month}-${day}`;
        }
      }
    }
    
    return dateStr;
  };

  // Convertir YYYY-MM-DD vers YYYY/MM/DD pour la sauvegarde
  const formatDateForSave = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${year}/${month}/${day}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateId(formData.id || '')) {
      return;
    }
    onSave({
      id: formData.id || '',
      ...formData as Student,
      birthDate: formatDateForSave(formData.birthDate || '')
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {viewMode ? 'عرض بيانات التلميذ' : student ? 'تعديل بيانات التلميذ' : 'إضافة تلميذ جديد'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="landscape:flex landscape:gap-6">
          <div className="landscape:flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">رقم التعريف</label>
              <input
                type="text"
                value={formData.id}
                onChange={handleIdChange}
                className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 ${
                  idError ? 'border-red-500' : ''
                }`}
                required
                placeholder="XXXXXXXXXXXXXX"
                maxLength={14}
                disabled={viewMode}
              />
              {idError && (
                <p className="text-red-500 text-sm mt-1">{idError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">اللقب</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
                placeholder="أدخل اللقب"
                disabled={viewMode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الاسم</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
                placeholder="أدخل الاسم"
                disabled={viewMode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">تاريخ الميلاد (AAAA/MM/JJ)</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
                disabled={viewMode}
              />
            </div>
          </div>

          <div className="landscape:flex-1 space-y-4 landscape:mt-0 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">الجنس</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'ذكر' | 'أنثى' })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                disabled={viewMode}
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">المستوى</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                disabled={viewMode}
              >
                <option value="س1 متوسط">س1 متوسط</option>
                <option value="س2 متوسط">س2 متوسط</option>
                <option value="س3 متوسط">س3 متوسط</option>
                <option value="س4 متوسط">س4 متوسط</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الفوج</label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                disabled={viewMode}
              >
                <option value="الفوج1">الفوج1</option>
                <option value="الفوج2">الفوج2</option>
                <option value="الفوج3">الفوج3</option>
                <option value="الفوج4">الفوج4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">معيد</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    name="isRepeating"
                    checked={formData.isRepeating === true}
                    onChange={() => setFormData({ ...formData, isRepeating: true })}
                    disabled={viewMode}
                  />
                  <span className="mr-2">نعم</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    name="isRepeating"
                    checked={formData.isRepeating === false}
                    onChange={() => setFormData({ ...formData, isRepeating: false })}
                    disabled={viewMode}
                  />
                  <span className="mr-2">لا</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              >
                {viewMode ? 'إغلاق' : 'إلغاء'}
              </button>
              {!viewMode && (
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {student ? 'حفظ التغييرات' : 'إضافة التلميذ'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;