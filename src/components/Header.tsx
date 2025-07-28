import React from 'react';


type HeaderProps = {
  onSignOut: () => void;
};

export default function Header({ onSignOut }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105">
            <div className="w-5 h-5 bg-white rounded-full"></div>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">HD</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>
      </div>
      <button
        onClick={onSignOut}
        className="relative inline-flex items-center px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
      >
        Sign Out
      </button>
    </header>
  );
}

