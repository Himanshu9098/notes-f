import React from 'react';
import InputField from './InputField';
import Button from './Button';
import ErrorMessage from './ErrorMessage';

interface NoteFormProps {
  newNote: { title: string; content: string };
  setNewNote: (note: { title: string; content: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  error: string | null;
  loading: boolean;
}

/**
 * Reusable form for creating or editing notes
 * @param props Form properties
 */
export default function NoteForm({
  newNote,
  setNewNote,
  onSubmit,
  onCancel,
  error,
  loading,
}: NoteFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4"
    >
      <InputField
        id="title"
        name="title"
        value={newNote.title}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        placeholder="Enter note title"
        label="Title"
      />
      <InputField
        id="content"
        name="content"
        type="textarea"
        value={newNote.content}
        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        placeholder="Enter note content"
        label="Content"
        rows={4}
      />
      <ErrorMessage message={error} />
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Note'}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}