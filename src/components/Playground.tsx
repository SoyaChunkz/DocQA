'use client';

import React, { useState } from 'react';
import ChatWrapper from './chat/ChatWrapper'; // Adjust the import path as needed
import QNA from './QNA'; // Adjust the import path as needed

interface PlaygroundProps {
  fileId: string;
}

const Playground: React.FC<PlaygroundProps> = ({ fileId }) => {
  const [activeComponent, setActiveComponent] = useState<'chat' | 'qna'>('chat');

  const handleComponentChange = (component: 'chat' | 'qna') => {
    setActiveComponent(component);
  };

  return (
    <div className="min-h-full bg-zinc-50 flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Playground</h1>
      
      {/* Navigation Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleComponentChange('chat')}
          className={`p-2 rounded ${activeComponent === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Chat
        </button>
        <button
          onClick={() => handleComponentChange('qna')}
          className={`p-2 rounded ${activeComponent === 'qna' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Q&A Generator
        </button>
      </div>

      {/* Active Component Display */}
      <div className="flex-1">
        {activeComponent === 'chat' ? (
          <ChatWrapper fileId={fileId} />
        ) : (
          <QNA fileId={fileId} />
        )}
      </div>
    </div>
  );
};

export default Playground;
