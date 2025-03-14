import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Student } from '../../types/student';
import { useStudentStore } from '../../store/studentStore';

interface StudentFormProps {
  mode: 'add' | 'edit';
}

const StudentForm: React.FC<StudentFormProps> = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idError, setIdError] = React.useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { getStudentById, addStudent, updateStudent } = useStudentStore();
  const existingStudent = id ? getStudentById(id) : null;

  const [formData, setFormData] = useState<Partial<Student>>({
    id: '',
    lastName: '',
    firstName: '',
    birthDate: '',
    gender: 'ذكر',
    level: 'س1 متوسط',
    group: 'الفوج1',
    isRepeating: false,
  });

  useEffect(() => {
    if (mode === 'edit' && existingStudent) {
      setFormData(existingStudent);
    }
  }, [mode, existingStudent]);

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

  const formatDate = (date: string) => {
    if (!date) return '';
    return date.split('-').join('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateId(formData.id || '')) {
      return;
    }
    
    const studentData = {
      ...formData,
      birthDate: formatDate(formData.birthDate || '')
    } as Student;

    try {
      if (mode === 'edit') {
        updateStudent(studentData);
        setSuccessMessage('تم تحديث بيانات التلميذ بنجاح');
      } else {
        addStudent(studentData);
        setSuccessMessage('تمت إضافة التلميذ بنجاح');
      }
      
      // Afficher le message de succès pendant 2 secondes avant la redirection
      setTimeout(() => {
        navigate('/students');
      }, 2000);
    } catch (error) {
      console.error('Error saving student:', error);
      setSuccessMessage('حدث خطأ أثناء حفظ البيانات');
    }
  };

  if (mode === 'edit' && !existingStudent) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">لم يتم العثور على التلميذ</h2>
          <button
            onClick={() => navigate('/students')}
            className="btn-primary"
          >
            العودة إلى قائمة التلاميذ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {mode === 'edit' ? 'تعديل بيانات التلميذ' : 'إضافة تلميذ جديد'}
            </h2>
            <button 
              onClick={() => navigate('/students')} 
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ الميلاد (AAAA/MM/JJ)</label>
                  <input
                    type="date"
                    value={formData.birthDate?.split('/').join('-')}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الجنس</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'ذكر' | 'أنثى' })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
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
                      />
                      <span className="mr-2">لا</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/students')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {mode === 'edit' ? 'حفظ التغييرات' : 'إضافة التلميذ'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentForm;