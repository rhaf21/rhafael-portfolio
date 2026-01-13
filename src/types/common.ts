export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "tools" | "other";
  proficiency: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description?: string;
  startDate: string;
  endDate?: string;
  highlights?: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface NavItem {
  label: string;
  href: string;
}
