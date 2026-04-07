/**
 * FeedSkeleton — animated placeholder grid shown while articles are loading.
 *
 * @param {number} count - Number of skeleton cards to render (default 3)
 */
function FeedSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
        >
          {/* image area */}
          <div className="aspect-video bg-muted animate-pulse shrink-0" />
          {/* content area */}
          <div className="p-4 flex flex-col flex-1 gap-2">
            {/* title lines */}
            <div className="h-4 bg-muted rounded-md animate-pulse" />
            <div className="h-4 bg-muted rounded-md animate-pulse w-4/5" />
            {/* description lines */}
            <div className="h-3 bg-muted rounded-md animate-pulse mt-1" />
            <div className="h-3 bg-muted rounded-md animate-pulse w-5/6" />
            {/* meta row (source · date) */}
            <div className="mt-auto pt-2 flex items-center gap-2">
              <div className="h-3 bg-muted rounded-md animate-pulse w-1/3" />
              <div className="h-3 bg-muted rounded-full animate-pulse w-1 shrink-0" />
              <div className="h-3 bg-muted rounded-md animate-pulse w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedSkeleton;
