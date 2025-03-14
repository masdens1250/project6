import React from 'react';
import Sidebar from './Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import StudentForm from '../pages/Students/StudentForm';
import StudentView from '../pages/Students/StudentView';
import Groups from '../pages/Groups';
import Tests from '../pages/Tests';
import Reports from '../pages/Reports';
import VideoConference from '../pages/VideoConference';
import Settings from '../pages/Settings';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="h-full w-full min-h-screen landscape:min-h-[100dvh]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/add" element={<StudentForm mode="add" />} />
            <Route path="/students/:id" element={<StudentView />} />
            <Route path="/students/:id/edit" element={<StudentForm mode="edit" />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/video" element={<VideoConference />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Layout;