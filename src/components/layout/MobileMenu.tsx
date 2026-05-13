"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/navigation";

interface MobileMenuProps {
  availableForWork?: boolean;
}

const emptySubscribe = () => () => {};

export function MobileMenu({ availableForWork = true }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const pathname = usePathname() ?? "/";

  // Lock body scroll while open + close on Escape
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const overlay = (
    <div
      className={`mobile-menu${open ? " mobile-menu--open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div className="mobile-menu__panel">
        <div className="mobile-menu__top">
          <Link
            href="/"
            className="brand"
            onClick={() => setOpen(false)}
            data-cursor="hover"
          >
            Rhafael
          </Link>
          <button
            type="button"
            className="mobile-menu__close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            data-cursor="hover"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <nav className="mobile-menu__nav">
          {navItems.map((item, i) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-menu__link${
                  isActive ? " mobile-menu__link--active" : ""
                }`}
                onClick={() => setOpen(false)}
                style={{
                  transitionDelay: open ? `${0.05 + i * 0.04}s` : "0s",
                }}
                data-cursor="hover"
              >
                <span className="mobile-menu__index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mobile-menu__label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mobile-menu__footer">
          <Link
            href="/contact"
            className="nav-cta"
            onClick={() => setOpen(false)}
            data-cursor="hover"
          >
            <span className="nav-status-dot" aria-hidden />
            <span>
              {availableForWork ? "Available for work" : "Booked through Q3"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="mobile-menu__trigger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        data-cursor="hover"
      >
        <Menu size={18} strokeWidth={1.75} />
      </button>
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
