import React from 'react';

const RightSidebar = () => {
  return (
    <aside className="w-80 p-4 sticky top-0">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold mb-4 text-white">Who to follow</h3>
        <p className="text-sm text-gray-400">Suggestions will appear here.</p>
      </div>
    </aside>
  );
};

export default RightSidebar;
