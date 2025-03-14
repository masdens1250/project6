import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  GraduationCap,
  Filter,
  Download,
  Upload,
  Pencil,
  Trash2,
  AlertCircle,
  Eye
} from 'lucide-react';
import StudentModal, { Student } from '../components/StudentModal';
import * as XLSX from 'xlsx-js-style';

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [students, setStudents] = useState<Student[]>([
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
  ]);

  const levels = ['س1 متوسط', 'س2 متوسط', 'س3 متوسط', 'س4 متوسط'];
  const groups = ['الفوج1', 'الفوج2', 'الفوج3', 'الفوج4'];

  const handleAddStudent = () => {
    setSelectedStudent(undefined);
    setViewMode(false);
    setIsModalOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setViewMode(true);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setViewMode(false);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleSaveStudent = (student: Student) => {
    if (selectedStudent) {
      setStudents(students.map(s => s.id === student.id ? student : s));
    } else {
      setStudents([...students, student]);
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
    // Define column widths
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

    // Create worksheet with RTL direction
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

    // Set column widths
    worksheet['!cols'] = colWidths;

    // Add RTL property to worksheet
    worksheet['!dir'] = 'rtl';

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'قائمة التلاميذ');
    
    // Save with a formatted name including date
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
              onClick={handleAddStudent}
            >
              <UserPlus className="ml-2 w-5 h-5" />
              إضافة تلميذ جديد
            </button>
          </div>
        </div>

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
                      <button 
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => handleViewStudent(student)}
                        title="عرض"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={() => handleEditStudent(student)}
                        title="تعديل"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
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

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudent}
        viewMode={viewMode}
      />
    </div>
  );
};

export default Students;