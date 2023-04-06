function Skeleton() {
  return (
    <div role="status" className="flex flex-col animate-pulse px-2 border rounded-lg p-2">
      <div className="mb-4 h-2.5 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Skeleton;
