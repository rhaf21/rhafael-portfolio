"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, isActive, TAGLINE } from "@/data/navigation";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <>
      <header className="wrap mast">
        <Link className="wm" href="/" aria-label="Rhafael Corpuz, home">
          Rhafael Corpuz<i aria-hidden />
        </Link>
        <span className="mast-mid mono">{TAGLINE}</span>
        <nav aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-ink mast-cta" href="/contact">
          Book a call
        </Link>
        <MobileMenu />
      </header>
      <div className="wrap" aria-hidden>
        <div className="rule2" />
      </div>
    </>
  );
}
