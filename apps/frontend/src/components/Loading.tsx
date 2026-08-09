export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
}
