import { cn } from "@/lib/cn";

interface SplitWordsProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 60,
}: SplitWordsProps) {
  const words = text.split(/\s+/);
  return (
    <span
      className={cn(className)}
      data-reveal
      style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.25em" }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="split-line"
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <span
            className="split-word"
            style={{ display: "inline-block", transitionDelay: `${delay + i * stagger}ms` }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
