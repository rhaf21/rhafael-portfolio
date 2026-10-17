"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { footerItems, isActive } from "@/data/navigation";

const emptySubscribe = () => () => {};

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const pathname = usePathname() ?? "/";

  // Lock body scroll while open and close on Escape.
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

  const close = () => setOpen(false);

  const overlay = (
    <div
      className={`menu${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="menu-top">
        <Link className="wm" href="/" onClick={close}>
          Rhafael Corpuz<i aria-hidden />
        </Link>
        <button type="button" className="menu-btn" style={{ display: "inline-flex" }} onClick={close} aria-label="Close menu">
          <X size={18} strokeWidth={1.75} />
        </button>
      </div>
      <nav aria-label="Mobile">
        {footerItems.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={close}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            style={{ transitionDelay: open ? `${60 + i * 45}ms` : "0ms" }}
          >
            {item.label}
            <span>{String(i + 1).padStart(2, "0")}</span>
          </Link>
        ))}
      </nav>
      <div className="menu-foot">
        <Link className="btn btn-ink" href="/contact" onClick={close} style={{ justifyContent: "center" }}>
          Book a 20-min call
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="menu-btn"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu size={18} strokeWidth={1.75} />
      </button>
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
