
interface ErrorMessageProps {
  message: string | null;
}

/**
 * Displays an error message if provided
 * @param message The error message to display
 */
export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return <p className="text-red-500 text-center mb-4">{message}</p>;
}