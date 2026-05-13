"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/navigation";

interface HeaderProps {
  availableForWork?: boolean;
}

export function Header({ availableForWork = true }: HeaderProps) {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="nav">
      <div className="container-x nav-inner">
        <Link href="/" className="brand" data-cursor="hover">
          <span className="brand-mark">R</span>
          <span>Rhafael</span>
        </Link>

        <div className="nav-links">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${isActive ? " active" : ""}`}
                data-cursor="hover"
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link href="/contact" className="nav-cta" data-cursor="hover">
          <span className="nav-status-dot" aria-hidden />
          <span>{availableForWork ? "Available for work" : "Booked through Q3"}</span>
        </Link>
      </div>
    </nav>
  );
}
