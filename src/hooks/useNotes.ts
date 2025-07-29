import { useState, useEffect } from 'react';
import axios from 'axios';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

/**
 * Manages note-related logic and user data for the dashboard
 */
export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        window.location.href = '/signin';
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const response = await axios.get<Note[]>(`${BASE_URL}/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) {
      setError('Title and content are required');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/notes`, newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes([...notes, response.data as Note]);
      setNewNote({ title: '', content: '' });
      setShowNoteForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  };

  return {
    notes,
    user,
    showNoteForm,
    newNote,
    error,
    loading,
    setShowNoteForm,
    setNewNote,
    handleCreateNote,
    handleDeleteNote,
    handleSignOut,
  };
};