import type { NavItem } from "@/types/common";

export const navItems: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const footerItems: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Side projects", href: "/side-projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const UPWORK_URL = "https://www.upwork.com/freelancers/rhafaeldev";
/** The 20-minute call on Cal.com. Its "What should we look at?" question takes `?notes=` to prefill. */
export const CAL_URL = "https://cal.com/rhafael.dev/20-minute-call";
export const TAGLINE = "Shopify & CRM automation · US, UK, AU";

export function isActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}
