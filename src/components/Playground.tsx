'use client';

import React, { useState } from 'react';
import ChatWrapper from './chat/ChatWrapper'; // Adjust the import path as needed
import QNA from './QNA'; // Adjust the import path as needed

interface PlaygroundProps {
  fileId: string;
}

const Playground: React.FC<PlaygroundProps> = ({ fileId }) => {
  // const [activeComponent, setActiveComponent] = useState<'chat' | 'qna'>('chat');

  // const handleComponentChange = (component: 'chat' | 'qna') => {
  //   setActiveComponent(component);
  // };

  // return (
  //   <div className="min-h-full bg-zinc-50 flex flex-col gap-4 p-4">

  //     {/* Navigation Buttons */}
  //     <div className="flex space-x-4 mb-4">
  //       <button
  //         onClick={() => handleComponentChange('chat')}
  //         className={`px-4 py-1 rounded text-sm ${activeComponent === 'chat' ? 'bg-green-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
  //       >
  //         Chat
  //       </button>
  //       <button
  //         onClick={() => handleComponentChange('qna')}
  //         className={`px-4 py-1 rounded text-sm ${activeComponent === 'qna' ? 'bg-green-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
  //       >
  //         Q&A Generator
  //       </button>
  //     </div>

  //     {/* Render only the active component */}
  //     <div className="flex-1">
  //       {activeComponent === 'chat' && <ChatWrapper fileId={fileId} />}
  //       {activeComponent === 'qna' && <QNA fileId={fileId} />}
  //     </div>
  //   </div>
  // );


  const [activeComponent, setActiveComponent] = useState<'chat' | 'qna' | null>(null);

  return (
    <div className="h-[90vh] flex items-center justify-center bg-zinc-50 relative">
      {/* Floating buttons (Always on Top) */}
      <div className="fixed top-14 right-8 flex flex-row space-x-4 z-50">
        <button
          onClick={() => setActiveComponent(activeComponent === 'chat' ? null : 'chat')}
          className={`w-16 h-16 flex items-center justify-center rounded-full text-lg shadow-lg transition 
            ${activeComponent === 'chat' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
        >
          💬
        </button>
        <button
          onClick={() => setActiveComponent(activeComponent === 'qna' ? null : 'qna')}
          className={`w-16 h-16 flex items-center justify-center rounded-full text-lg shadow-lg transition 
            ${activeComponent === 'qna' ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          ❓
        </button>
      </div>

      {/* Render the selected component */}
      {activeComponent && (
        <div className="h-full w-full absolute top-0 left-0 bg-white z-40">
          {activeComponent === 'chat' && <ChatWrapper fileId={fileId} />}
          {activeComponent === 'qna' && <QNA fileId={fileId} />}
        </div>
      )}
    </div>
  );

};

export default Playground;