export default function ReportSkeleton() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6"
      aria-label="Loading audit results"
      aria-busy="true"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-line bg-surface p-4 h-[92px]"
        >
          <div className="skeleton h-3 w-16 rounded mb-3" />
          <div className="skeleton h-6 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}
