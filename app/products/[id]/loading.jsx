export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Navbar Skeleton */}
        <div className="h-12 bg-white rounded-xl border border-slate-200/80 w-48" />

        {/* Main Grid Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Skeleton */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 h-[500px] p-4 space-y-3 hidden lg:block">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-9 bg-slate-100 rounded-lg w-full" />
            ))}
          </div>

          {/* Center Details Skeleton */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200/80 h-[650px] p-6 space-y-6">
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="h-72 bg-slate-100 rounded-xl" />
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-10 bg-slate-200 rounded-xl w-full mt-6" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}