"use client";

import { useState } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Note 1",
      content: "Sample note content",
      createdAt: new Date()
    },
    {
      id: 2,
      title: "Note 2",
      content: "Another note content",
      createdAt: new Date()
    }
  ]);

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: `Note ${notes.length + 1}`,
      content: "",
      createdAt: new Date()
    };
    setNotes([...notes, newNote]);
  };

  const handleSignOut = () => {
    console.log("Signing out...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center relative">
            <div className="w-6 h-6 border-2 border-white rounded-full relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-white rounded-full"></div>
              <div className="absolute top-1 right-0 transform rotate-45 w-1 h-1.5 bg-white rounded-full"></div>
              <div className="absolute top-1 left-0 transform -rotate-45 w-1 h-1.5 bg-white rounded-full"></div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 rotate-180 w-1 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
        <button
          onClick={handleSignOut}
          className="text-blue-500 font-medium text-lg hover:text-blue-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Welcome, Jonas Kahnwald !
          </h2>
          <p className="text-gray-600">
            Email: xxxxxx@xxxx.com
          </p>
        </div>

        {/* Create Note Button */}
        <button
          onClick={handleCreateNote}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 text-lg"
        >
          Create Note
        </button>

        {/* Notes Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Notes
          </h3>

          <div className="space-y-3">
            {notes.map((note) =>
              <div
                key={note.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <span className="text-lg text-gray-900 font-medium">
                  {note.title}
                </span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  aria-label="Delete note"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}