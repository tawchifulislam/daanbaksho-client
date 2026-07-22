import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-md mx-auto space-y-6 relative z-10">
        <div className="relative inline-block">
          <h1 className="text-8xl font-black text-slate-900 tracking-tight">
            4<span className="text-[#0f766e]">0</span>
            <span className="text-[#f97316]">4</span>
          </h1>
          <span className="absolute -top-2 -right-6 bg-[#f97316] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
            Page Not Found
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0f766e] text-white font-medium hover:bg-[#0d645d] transition-colors shadow-md shadow-teal-900/10"
          >
            Back to Home
          </Link>
          <Link
            href="/campaigns"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-slate-700 font-medium border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Explore Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
}
