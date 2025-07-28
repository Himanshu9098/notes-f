import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user and notes on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      console.log('Dashboard.tsx - Token from localStorage:', token);
      console.log('Dashboard.tsx - User Data from localStorage:', userData);

      if (!token || !userData) {
        console.log('No token or user data, redirecting to /signin');
        window.location.href = "/signin";
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        console.log('Dashboard.tsx - Parsed User:', parsedUser);
        setUser(parsedUser);

        const response = await axios.get<Note[]>("http://localhost:5000/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
      } catch (err: any) {
        console.error('Dashboard.tsx - Error fetching notes:', err);
        setError(err.response?.data?.message || "Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) {
      setError("Title and content are required");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/notes",
        newNote,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([...notes, response.data as Note]);
      setNewNote({ title: "", content: "" });
      setShowNoteForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <Header onSignOut={handleSignOut} />

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Welcome, {user?.name || "User"}!
          </h2>
          <p className="text-gray-600">Email: {user?.email || "N/A"}</p>
        </div>

        {/* Create Note Form */}
        {showNoteForm && (
          <form onSubmit={handleCreateNote} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                placeholder="Enter note title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                placeholder="Enter note content"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                rows={4}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Note"}
              </button>
              <button
                type="button"
                onClick={() => setShowNoteForm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Notes Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Notes</h3>
          {loading && <p className="text-gray-600">Loading notes...</p>}
          {error && !loading && <p className="text-red-500">{error}</p>}
          <div className="space-y-3">
            {notes.length === 0 && !loading && (
              <p className="text-gray-600">No notes available.</p>
            )}
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <span className="text-lg text-gray-900 font-medium">
                    {note.title}
                  </span>
                  <p className="text-gray-600 text-sm">{note.content}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  aria-label="Delete note"
                  disabled={loading}
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
            ))}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowNoteForm(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
        disabled={loading}
        aria-label="Create new note"
      >
        +
      </button>
    </div>
  );
}