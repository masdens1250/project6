import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Filter,
  Download,
  Eye,
  Calendar,
  Users,
  BookOpen,
  Target,
  BarChart,
  Plus,
  Search
} from 'lucide-react';

interface Report {
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

const Reports: React.FC = () => {
  const [activeType, setActiveType] = useState<'فصلي' | 'توجيهي' | 'متابعة'>('فصلي');
  const [searchTerm, setSearchTerm] = useState('');

  const reports: Report[] = [
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
    },
    {
      id: '2',
      title: 'تقرير التوجيه - الفوج الأول',
      type: 'توجيهي',
      targetGroup: 'الفوج1',
      studentCount: 30,
      coverage: 100,
      objectives: [
        'تحديد الميول والقدرات',
        'اقتراح المسارات المناسبة'
      ],
      createdAt: '2024-02-15',
      status: 'مسودة'
    },
    {
      id: '3',
      title: 'تقرير متابعة الحالات الخاصة',
      type: 'متابعة',
      studentCount: 15,
      coverage: 90,
      objectives: [
        'متابعة التلاميذ ذوي الصعوبات',
        'تقييم فعالية الإجراءات المتخذة'
      ],
      notes: 'تحسن ملحوظ في 60% من الحالات',
      createdAt: '2024-02-20',
      status: 'مكتمل'
    }
  ];

  const filteredReports = reports.filter(report => 
    report.type === activeType &&
    (report.title.includes(searchTerm) || report.notes?.includes(searchTerm))
  );

  const getStatusColor = (status: string) => {
    return status === 'مكتمل' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'فصلي':
        return Calendar;
      case 'توجيهي':
        return Target;
      case 'متابعة':
        return BarChart;
      default:
        return FileText;
    }
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">التقارير</h1>
          <button className="btn-primary flex items-center">
            <Plus className="ml-2 w-5 h-5" />
            إنشاء تقرير جديد
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['فصلي', 'توجيهي', 'متابعة'] as const).map((type) => (
              <button
                key={type}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  activeType === type
                    ? 'bg-white dark:bg-gray-700 shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => setActiveType(type)}
              >
                {React.createElement(getTypeIcon(type), { className: 'w-5 h-5 ml-2' })}
                {type === 'فصلي' ? 'تقرير فصلي' : type === 'توجيهي' ? 'تقرير توجيهي' : 'تقرير متابعة'}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في التقارير..."
              className="w-full pr-10 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-light bg-opacity-20">
                    {React.createElement(getTypeIcon(report.type), { className: 'w-6 h-6 text-primary' })}
                  </div>
                  <div className="mr-3">
                    <h3 className="text-xl font-semibold">{report.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {report.targetGroup && `${report.targetGroup} • `}
                      {report.createdAt}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>

              {report.objectives.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">الأهداف:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {report.objectives.map((objective, index) => (
                      <li key={index} className="flex items-center">
                        <Target className="w-4 h-4 ml-2 text-primary" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                {report.studentCount && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 ml-2" />
                    {report.studentCount} تلميذ
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen className="w-4 h-4 ml-2" />
                  نسبة التغطية: {report.coverage}%
                </div>
              </div>

              {report.notes && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <strong>ملاحظات:</strong> {report.notes}
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700">
                <button className="text-primary hover:text-primary-light flex items-center">
                  <Eye className="w-4 h-4 ml-1" />
                  عرض التقرير
                </button>
                <button className="text-primary hover:text-primary-light flex items-center">
                  <Download className="w-4 h-4 ml-1" />
                  تحميل PDF
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;