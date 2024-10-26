export function LoadingSkeleton() {
    return (
      <div className="space-y-4">
        <div className="h-8 w-[250px] bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }