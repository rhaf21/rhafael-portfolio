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
export const TAGLINE = "Shopify & CRM automation · US, UK, AU";

export function isActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}
