
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Header from '../components/Header';
import NoteItem from '../components/NoteItem';
import NoteForm from '../components/NoteForm';
import { useNotes } from '../hooks/useNotes';

interface Note {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

/**
 * Dashboard page displaying user info, note creation form, and note list
 */
export default function Dashboard() {
    const {
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
    } = useNotes();

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <Header onSignOut={handleSignOut} />
            <div className="px-6 py-6 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Welcome, {user?.name || 'User'}!
                    </h2>
                    <p className="text-gray-600">Email: {user?.email || 'N/A'}</p>
                </div>
                <Button
                    onClick={() => setShowNoteForm(true)}
                    disabled={loading}
                    variant="primary"
                    className="rounded-full flex items-center justify-center shadow-lg text-[2.5vh]"
                >
                    Add Note
                </Button>
                {showNoteForm && (
                    <NoteForm
                        newNote={newNote}
                        setNewNote={setNewNote}
                        onSubmit={handleCreateNote}
                        onCancel={() => setShowNoteForm(false)}
                        error={error}
                        loading={loading}
                    />
                )}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">Notes</h3>
                    {loading && <p className="text-gray-600">Loading notes...</p>}
                    <ErrorMessage message={error && !loading ? error : null} />
                    <div className="space-y-3">
                        {notes.length === 0 && !loading && (
                            <p className="text-gray-600">No notes available.</p>
                        )}
                        {notes.map((note) => (
                            <NoteItem key={note._id} note={note} onDelete={handleDeleteNote} loading={loading} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}