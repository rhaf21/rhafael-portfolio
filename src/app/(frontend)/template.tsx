import type { ReactNode } from "react";

interface TemplateProps {
  children: ReactNode;
}

// Re-mounts on every navigation, so each page fades up as it arrives.
export default function Template({ children }: TemplateProps) {
  return <div className="page-in">{children}</div>;
}
