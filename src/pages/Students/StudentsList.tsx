import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  GraduationCap,
  Download,
  Upload,
  Pencil,
  Trash2,
  AlertCircle,
  Eye,
  Save,
  Check
} from 'lucide-react';
import * as XLSX from 'xlsx-js-style';
import { Student } from '../../types/student';
import { useStudentStore } from '../../store/studentStore';

const StudentsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  
  const { students, setStudents } = useStudentStore();

  // Charger les données depuis localStorage au montage du composant
  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, [setStudents]);

  const handleDeleteStudent = (id: string) => {
    const updatedStudents = students.filter(s => s.id !== id);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setShowDeleteConfirm(null);
  };

  const handleSaveStudents = () => {
    try {
      localStorage.setItem('students', JSON.stringify(students));
      setLastSaveTime(new Date());
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving students:', error);
      alert('حدث خطأ أثناء حفظ البيانات');
    }
  };

  const handleImportStudents = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xls,.xlsx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            const importedStudents: Student[] = jsonData.map((row: any) => ({
              id: row['رقم التعريف'] || '',
              lastName: row['اللقب'] || '',
              firstName: row['الاسم'] || '',
              birthDate: row['تاريخ الميلاد'] || '',
              gender: row['الجنس'] || 'ذكر',
              level: row['المستوى'] || 'س1 متوسط',
              group: row['الفوج'] || 'الفوج1',
              isRepeating: row['معيد'] === 'نعم'
            }));

            if (importedStudents.length > 0) {
              setStudents(importedStudents);
              handleSaveStudents(); // Sauvegarder automatiquement après l'import
              setShowSaveSuccess(true);
              setTimeout(() => setShowSaveSuccess(false), 3000);
            } else {
              alert('لم يتم العثور على بيانات في ملف Excel. يرجى التأكد من تنسيق الملف.');
            }
          } catch (error) {
            console.error('Error importing students:', error);
            alert('حدث خطأ أثناء استيراد ملف Excel. يرجى التأكد من تنسيق الملف.');
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };

  const handleExportStudents = () => {
    const colWidths = [
      { wch: 15 }, // رقم التعريف
      { wch: 15 }, // اللقب
      { wch: 15 }, // الاسم
      { wch: 12 }, // تاريخ الميلاد
      { wch: 8 },  // الجنس
      { wch: 10 }, // المستوى
      { wch: 8 },  // الفوج
      { wch: 6 }   // معيد
    ];

    const worksheet = XLSX.utils.json_to_sheet(students.map(student => ({
      'رقم التعريف': student.id,
      'اللقب': student.lastName,
      'الاسم': student.firstName,
      'تاريخ الميلاد': student.birthDate,
      'الجنس': student.gender,
      'المستوى': student.level,
      'الفوج': student.group,
      'معيد': student.isRepeating ? 'نعم' : 'لا'
    })));

    worksheet['!cols'] = colWidths;
    worksheet['!dir'] = 'rtl';

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'قائمة التلاميذ');
    
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `قائمة_التلاميذ_${date}.xlsx`);
  };

  const filteredStudents = students.filter(student => {
    const searchString = `${student.firstName} ${student.lastName}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || student.level === selectedLevel;
    const matchesGroup = selectedGroup === 'all' || student.group === selectedGroup;
    return matchesSearch && matchesLevel && matchesGroup;
  });

  const levels = ['س1 متوسط', 'س2 متوسط', 'س3 متوسط', 'س4 متوسط'];
  const groups = ['الفوج1', 'الفوج2', 'الفوج3', 'الفوج4'];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">إدارة التلاميذ</h1>
          <div className="flex gap-2">
            <button 
              className="btn-primary flex items-center"
              onClick={handleImportStudents}
              title="استيراد من ملف Excel"
            >
              <Upload className="ml-2 w-5 h-5" />
              جلب قائمة التلاميذ
            </button>
            <button 
              className="btn-primary flex items-center"
              onClick={handleExportStudents}
              title="تصدير إلى ملف Excel"
            >
              <Download className="ml-2 w-5 h-5" />
              حفظ القائمة
            </button>
            <button 
              className="btn-primary flex items-center"
              onClick={handleSaveStudents}
              title="حفظ التغييرات"
            >
              <Save className="ml-2 w-5 h-5" />
              حفظ
            </button>
            <Link 
              to="/students/add"
              className="btn-primary flex items-center"
            >
              <UserPlus className="ml-2 w-5 h-5" />
              إضافة تلميذ جديد
            </Link>
          </div>
        </div>

        {showSaveSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center">
            <Check className="w-5 h-5 ml-2" />
            <span className="block sm:inline">
              تم حفظ التغييرات بنجاح
              {lastSaveTime && ` (${lastSaveTime.toLocaleTimeString()})`}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن تلميذ..."
              className="w-full pr-10 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border rounded-lg p-2"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">جميع المستويات</option>
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            className="border rounded-lg p-2"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="all">جميع الأفواج</option>
            {groups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  رقم التعريف
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  اللقب
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  الاسم
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  تاريخ الميلاد
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  الجنس
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  المستوى
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  الفوج
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  معيد
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-light bg-opacity-20 flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {student.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {student.firstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {student.birthDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {student.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {student.level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {student.group}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {student.isRepeating ? 'نعم' : 'لا'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/students/${student.id}`}
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        title="عرض"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/students/${student.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="تعديل"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => setShowDeleteConfirm(student.id)}
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {showDeleteConfirm === student.id && (
                        <div className="absolute bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border dark:border-gray-700">
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-3">
                            <AlertCircle className="w-5 h-5" />
                            <span>هل أنت متأكد من حذف هذا التلميذ؟</span>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                              onClick={() => setShowDeleteConfirm(null)}
                            >
                              إلغاء
                            </button>
                            <button
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentsList;