export default function SkeletonCard() {
  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <div className="w-full bg-white overflow-hidden rounded-lg shadow-md flex flex-col justify-between">
        {/* Card Content */}
        <div className="px-6 py-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
        </div>
        <div className="aspect-video bg-gray-300 animate-pulse"></div>
        <div className="px-6 py-3 flex items-center justify-center">
          <div className="flex items-center justify-center gap-1">
            <span className="inline-block w-4 h-4 bg-gray-200 rounded-full"></span>
            <span className="inline-block w-3 h-3 bg-gray-300 rounded-full"></span>
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
          </div>
          <div className="mx-2 h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="flex items-center justify-center gap-1">
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
            <span className="inline-block w-3 h-3 bg-gray-300 rounded-full"></span>
            <span className="inline-block w-4 h-4 bg-gray-200 rounded-full"></span>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 w-full">
        <div className="w-full h-10 bg-gray-300 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}
