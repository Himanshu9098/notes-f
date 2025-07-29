

/**
 * Reusable logo component for consistent branding
 */
export default function Logo() {
  return (
    <div className="mb-8 flex justify-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        <span className="text-xl font-semibold text-gray-900">HD</span>
      </div>
    </div>
  );
}