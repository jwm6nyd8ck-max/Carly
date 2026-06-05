"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/scan", icon: "📷", label: "Scan" },
  { href: "/wardrobe", icon: "👗", label: "Wardrobe" },
  { href: "/explore", icon: "🔍", label: "Explore" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-[rgba(15,10,30,0.9)] backdrop-blur-md border-t border-[rgba(155,127,232,0.15)]">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active
                  ? "text-[#9B7FE8]"
                  : "text-[rgba(155,127,232,0.5)] hover:text-[rgba(155,127,232,0.8)]"
              }`}
            >
              <span
                className={`text-xl transition-transform ${active ? "scale-110" : ""}`}
                aria-hidden="true"
              >
                {icon}
              </span>
              <span
                className={`text-[10px] font-body font-medium uppercase tracking-wider ${
                  active ? "opacity-100" : "opacity-60"
                }`}
              >
                {label}
              </span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-[#9B7FE8]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
