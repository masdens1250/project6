import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Brain, FileCheck } from 'lucide-react';
import { useStudentStore } from '../store/studentStore';
import { useDashboardStore } from '../store/dashboardStore';

const Dashboard: React.FC = () => {
  const students = useStudentStore(state => state.students);
  const { groups, getCompletedTestsCount, getCompletedReportsCount } = useDashboardStore();

  const stats = [
    { 
      icon: Users, 
      label: 'مجموع التلاميذ', 
      value: students.length.toString(),
      description: 'إجمالي عدد التلاميذ المسجلين في النظام'
    },
    { 
      icon: BookOpen, 
      label: 'الأفواج', 
      value: groups.length.toString(),
      description: 'عدد الأفواج الدراسية النشطة'
    },
    { 
      icon: Brain, 
      label: 'الاختبارات المنجزة', 
      value: getCompletedTestsCount().toString(),
      description: 'عدد الاختبارات النفسية المكتملة'
    },
    { 
      icon: FileCheck, 
      label: 'التقارير', 
      value: getCompletedReportsCount().toString(),
      description: 'عدد التقارير المنجزة والمكتملة'
    }
  ];

  return (
    <div className="p-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        لوحة التحكم
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-primary-light bg-opacity-20">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="mr-4">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;