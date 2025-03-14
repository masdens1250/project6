import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  Users,
  User,
  ClipboardList,
  Timer,
  BarChart3,
  FileText,
  Plus,
  Search
} from 'lucide-react';

interface Test {
  id: string;
  title: string;
  type: 'فردي' | 'جماعي';
  duration: number;
  targetLevel: string;
  description: string;
  questionCount: number;
  lastUsed?: string;
}

const Tests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'فردي' | 'جماعي'>('فردي');
  const [searchTerm, setSearchTerm] = useState('');

  const tests: Test[] = [
    {
      id: '1',
      title: 'اختبار الذكاء المتعدد',
      type: 'فردي',
      duration: 45,
      targetLevel: 'س1 متوسط',
      description: 'يقيس هذا الاختبار مختلف أنواع الذكاء لدى التلميذ',
      questionCount: 30,
      lastUsed: '2024-02-15'
    },
    {
      id: '2',
      title: 'اختبار الميول المهنية',
      type: 'جماعي',
      duration: 60,
      targetLevel: 'س4 متوسط',
      description: 'يساعد في تحديد الميول المهنية للتلاميذ',
      questionCount: 40,
      lastUsed: '2024-02-20'
    },
    {
      id: '3',
      title: 'اختبار القدرات المعرفية',
      type: 'فردي',
      duration: 30,
      targetLevel: 'س2 متوسط',
      description: 'تقييم القدرات المعرفية والإدراكية',
      questionCount: 25
    },
    {
      id: '4',
      title: 'اختبار التوجيه الدراسي',
      type: 'جماعي',
      duration: 90,
      targetLevel: 'س4 متوسط',
      description: 'يساعد في تحديد المسار الدراسي المناسب',
      questionCount: 50,
      lastUsed: '2024-02-18'
    }
  ];

  const filteredTests = tests.filter(test => 
    test.type === activeTab && 
    (test.title.includes(searchTerm) || test.description.includes(searchTerm))
  );

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">الاختبارات النفسية</h1>
          <button className="btn-primary flex items-center">
            <Plus className="ml-2 w-5 h-5" />
            إضافة اختبار جديد
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'فردي'
                  ? 'bg-white dark:bg-gray-700 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('فردي')}
            >
              <User className="w-5 h-5 ml-2" />
              اختبار فردي
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'جماعي'
                  ? 'bg-white dark:bg-gray-700 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('جماعي')}
            >
              <Users className="w-5 h-5 ml-2" />
              اختبار جماعي
            </button>
          </div>

          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الاختبارات..."
              className="w-full pr-10 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-light bg-opacity-20">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div className="mr-3">
                    <h3 className="text-xl font-semibold">{test.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{test.targetLevel}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {test.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Timer className="w-4 h-4 ml-2" />
                  {test.duration} دقيقة
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <ClipboardList className="w-4 h-4 ml-2" />
                  {test.questionCount} سؤال
                </div>
              </div>

              {test.lastUsed && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  آخر استخدام: {test.lastUsed}
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700">
                <button className="text-primary hover:text-primary-light flex items-center">
                  <FileText className="w-4 h-4 ml-1" />
                  تفاصيل الاختبار
                </button>
                <button className="text-primary hover:text-primary-light flex items-center">
                  <BarChart3 className="w-4 h-4 ml-1" />
                  الإحصائيات
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Tests;