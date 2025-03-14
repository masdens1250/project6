import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban,
  BrainCircuit,
  FileText,
  Video,
  Settings,
  LogOut 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/' },
    { icon: Users, label: 'إدارة التلاميذ', path: '/students' },
    { icon: FolderKanban, label: 'إدارة الأفواج', path: '/groups' },
    { icon: BrainCircuit, label: 'الاختبارات النفسية', path: '/tests' },
    { icon: FileText, label: 'التقارير', path: '/reports' },
    { icon: Video, label: 'محادثة فيديو', path: '/video' },
    { icon: Settings, label: 'الإعدادات', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">DZ-Orientations</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <item.icon className="w-5 h-5 ml-3" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-full p-6">
        <button className="flex items-center text-red-500 hover:text-red-600">
          <LogOut className="w-5 h-5 ml-3" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;