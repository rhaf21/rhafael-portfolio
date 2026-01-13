import type { NavItem, SocialLink } from "@/types/common";

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "github",
    url: "https://github.com/rhafael",
    label: "GitHub",
  },
  {
    platform: "linkedin",
    url: "https://linkedin.com/in/rhafael",
    label: "LinkedIn",
  },
  {
    platform: "twitter",
    url: "https://twitter.com/rhafael",
    label: "Twitter",
  },
];
