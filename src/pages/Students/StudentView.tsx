import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  GraduationCap, 
  Calendar, 
  User, 
  Users,
  BookOpen,
  RefreshCw,
  Pencil
} from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';

const StudentView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const getStudentById = useStudentStore(state => state.getStudentById);
  const student = id ? getStudentById(id) : null;

  if (!student) {
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
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/students')}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mr-4">بيانات التلميذ</h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-primary-light bg-opacity-20 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <div className="mr-4">
                  <h3 className="text-2xl font-bold">{`${student.firstName} ${student.lastName}`}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{student.id}</p>
                </div>
              </div>
              <Link
                to={`/students/${id}/edit`}
                className="btn-primary flex items-center"
              >
                <Pencil className="w-5 h-5 ml-2" />
                تعديل البيانات
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">تاريخ الميلاد</p>
                    <p className="font-medium">{student.birthDate}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">الجنس</p>
                    <p className="font-medium">{student.gender}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">المستوى</p>
                    <p className="font-medium">{student.level}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">الفوج</p>
                    <p className="font-medium">{student.group}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <RefreshCw className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">معيد</p>
                    <p className="font-medium">{student.isRepeating ? 'نعم' : 'لا'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentView;