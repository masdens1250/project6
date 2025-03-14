import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <span className="mr-4 text-xl font-amiri">جاري التحميل...</span>
    </div>
  );
};

export default Loading;