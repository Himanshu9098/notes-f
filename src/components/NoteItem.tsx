
interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  loading: boolean;
}

/**
 * Renders a single note with title, content, creation date, and delete button
 * @param note The note object to display
 * @param onDelete Callback to delete the note
 * @param loading Whether the delete action is in progress
 */
export default function NoteItem({ note, onDelete, loading }: NoteItemProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <span className="text-lg text-gray-900 font-medium">{note.title}</span>
        <p className="text-gray-600 text-sm">{note.content}</p>
        <p className="text-gray-400 text-xs">{new Date(note.createdAt).toLocaleString()}</p>
      </div>
      <button
        onClick={() => onDelete(note._id)}
        className="text-gray-400 hover:text-red-500 transition-colors p-2"
        aria-label="Delete note"
        disabled={loading}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}