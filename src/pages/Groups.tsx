import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus,
  Calendar,
  Clock,
  BookOpen
} from 'lucide-react';

interface Group {
  id: string;
  name: string;
  level: string;
  studentCount: number;
  schedule: {
    day: string;
    time: string;
  }[];
}

const Groups: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');

  const levels = ['س1 متوسط', 'س2 متوسط', 'س3 متوسط', 'س4 متوسط'];

  // Example data
  const groups: Group[] = [
    {
      id: '1',
      name: 'الفوج1',
      level: 'س1 متوسط',
      studentCount: 25,
      schedule: [
        { day: 'الأحد', time: '08:00 - 10:00' },
        { day: 'الثلاثاء', time: '13:00 - 15:00' }
      ]
    },
    {
      id: '2',
      name: 'الفوج2',
      level: 'س2 متوسط',
      studentCount: 28,
      schedule: [
        { day: 'الاثنين', time: '10:00 - 12:00' },
        { day: 'الخميس', time: '14:00 - 16:00' }
      ]
    },
    // Add more sample data as needed
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">إدارة الأفواج</h1>
          <button className="btn-primary flex items-center">
            <Plus className="ml-2 w-5 h-5" />
            إضافة فوج جديد
          </button>
        </div>

        <div className="mb-6">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-light bg-opacity-20">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="mr-3">
                    <h3 className="text-xl font-semibold">{group.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{group.level}</p>
                  </div>
                </div>
                <span className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm">
                  {group.studentCount} تلميذ
                </span>
              </div>

              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Calendar className="w-5 h-5 ml-2" />
                  جدول الحصص
                </h4>
                {group.schedule.map((session, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{session.day}: </span>
                    <span className="mr-1">{session.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t dark:border-gray-700">
                <button className="text-primary hover:text-primary-light flex items-center">
                  <BookOpen className="w-4 h-4 ml-1" />
                  تفاصيل الفوج
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Groups;