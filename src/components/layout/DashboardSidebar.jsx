"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { navByRole } from "@/lib/dashboardNav";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { role } = useUserRole();
  const links = navByRole[role] || [];

  return (
    <aside className="w-64 shrink-0 hidden lg:block sticky top-20 self-start">
      <nav className="rounded-2xl border bg-card shadow-sm p-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}