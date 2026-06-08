"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",         label: "Home"     },
  { href: "/scan",     label: "Scan"     },
  { href: "/wardrobe", label: "Wardrobe" },
  { href: "/explore",  label: "Explore"  },
  { href: "/profile",  label: "Profile"  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{ background: "rgba(24,23,15,0.96)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(180,160,110,0.12)" }}>
      <div className="max-w-md mx-auto flex items-center justify-around py-3">
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-1 px-4 py-1 transition-all"
              style={{ color: active ? "var(--text-cream)" : "var(--text-muted)" }}>
              <span className="label" style={{
                color: active ? "#B8A060" : "rgba(168,155,126,0.4)",
                letterSpacing: "0.15em"
              }}>
                {label}
              </span>
              {active && <span className="w-3 h-px" style={{ background: "#B8A060" }} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
