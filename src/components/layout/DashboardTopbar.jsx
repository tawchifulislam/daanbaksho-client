'use client';

import MobileSidebar from './MobileSidebar';

export default function DashboardTopbar() {
  return (
    <div className="lg:hidden h-14 border-b bg-background flex items-center gap-3 px-4 sticky top-16 z-30">
      <MobileSidebar />
      <span className="font-semibold text-sm">Dashboard Menu</span>
    </div>
  );
}
