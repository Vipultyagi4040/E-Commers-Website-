export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden animate-pulse border border-gray-100">
      <div className="aspect-[4/5] bg-gray-100" />
      <div className="p-3 md:p-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
