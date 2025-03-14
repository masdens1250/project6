import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Database, Check, AlertCircle, Save } from 'lucide-react';
import { useStudentStore } from '../store/studentStore';
import { useDashboardStore } from '../store/dashboardStore';

const Settings: React.FC = () => {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [autoSaveInterval, setAutoSaveInterval] = useState(5);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);

  const { students, setStudents } = useStudentStore();
  const { 
    groups, setGroups,
    tests, setTests,
    reports, setReports
  } = useDashboardStore();

  // Auto-save feature
  useEffect(() => {
    const saveData = () => {
      try {
        const databaseExport = {
          students,
          groups,
          tests,
          reports,
          exportDate: new Date().toISOString(),
          version: '1.0'
        };
        localStorage.setItem('dz-orientations-auto-save', JSON.stringify(databaseExport));
        setLastAutoSave(new Date());
      } catch (error) {
        console.error('Error auto-saving data:', error);
      }
    };

    // Initial load of auto-saved data
    const loadAutoSavedData = () => {
      try {
        const savedData = localStorage.getItem('dz-orientations-auto-save');
        if (savedData) {
          const data = JSON.parse(savedData);
          if (data.students) setStudents(data.students);
          if (data.groups) setGroups(data.groups);
          if (data.tests) setTests(data.tests);
          if (data.reports) setReports(data.reports);
        }
      } catch (error) {
        console.error('Error loading auto-saved data:', error);
      }
    };

    loadAutoSavedData();

    // Set up auto-save interval
    const intervalId = setInterval(saveData, autoSaveInterval * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [autoSaveInterval, students, groups, tests, reports, setStudents, setGroups, setTests, setReports]);

  const handleExportDatabase = () => {
    try {
      const databaseExport = {
        students,
        groups,
        tests,
        reports,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(databaseExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dz-orientations-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportStatus('success');
      setStatusMessage('تم تصدير قاعدة البيانات بنجاح');
      setTimeout(() => {
        setExportStatus('idle');
        setStatusMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error exporting database:', error);
      setExportStatus('error');
      setStatusMessage('حدث خطأ أثناء تصدير قاعدة البيانات');
    }
  };

  const handleImportDatabase = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate the imported data structure
        if (!data.version || !data.exportDate) {
          throw new Error('Invalid database format');
        }

        // Import the data
        if (data.students) setStudents(data.students);
        if (data.groups) setGroups(data.groups);
        if (data.tests) setTests(data.tests);
        if (data.reports) setReports(data.reports);

        setImportStatus('success');
        setStatusMessage('تم استيراد قاعدة البيانات بنجاح');
        setTimeout(() => {
          setImportStatus('idle');
          setStatusMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error importing database:', error);
        setImportStatus('error');
        setStatusMessage('حدث خطأ أثناء استيراد قاعدة البيانات');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-8">الإعدادات</h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Database className="ml-2" />
              إدارة قاعدة البيانات
            </h2>

            {statusMessage && (
              <div className={`mb-4 p-4 rounded-lg flex items-center ${
                (importStatus === 'success' || exportStatus === 'success')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {(importStatus === 'success' || exportStatus === 'success') 
                  ? <Check className="ml-2" />
                  : <AlertCircle className="ml-2" />
                }
                {statusMessage}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">الحفظ التلقائي</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Save className="ml-2 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {lastAutoSave 
                      ? `آخر حفظ تلقائي: ${lastAutoSave.toLocaleTimeString()}`
                      : 'لم يتم الحفظ التلقائي بعد'}
                  </span>
                </div>
                <select
                  value={autoSaveInterval}
                  onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                  className="border rounded-lg p-1 text-sm"
                >
                  <option value="1">كل دقيقة</option>
                  <option value="5">كل 5 دقائق</option>
                  <option value="15">كل 15 دقيقة</option>
                  <option value="30">كل 30 دقيقة</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">تصدير قاعدة البيانات</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  قم بتصدير نسخة احتياطية من جميع البيانات الخاصة بك
                </p>
                <button
                  onClick={handleExportDatabase}
                  className="btn-primary flex items-center justify-center w-full"
                  disabled={exportStatus === 'success'}
                >
                  <Download className="ml-2" />
                  تصدير قاعدة البيانات
                </button>
              </div>

              <div className="border dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">استيراد قاعدة البيانات</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  قم باستيراد نسخة احتياطية سابقة من قاعدة البيانات
                </p>
                <label className="btn-primary flex items-center justify-center w-full cursor-pointer">
                  <Upload className="ml-2" />
                  استيراد قاعدة البيانات
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportDatabase}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              ملاحظات هامة
            </h3>
            <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>يتم حفظ البيانات تلقائياً بشكل دوري</li>
              <li>تأكد من الاحتفاظ بنسخة احتياطية من بياناتك بشكل منتظم</li>
              <li>عند استيراد قاعدة بيانات، سيتم استبدال جميع البيانات الحالية</li>
              <li>تأكد من استيراد ملف صالح تم تصديره من النظام</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;