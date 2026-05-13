interface MarqueeItem {
  text: string;
  italic?: boolean;
}

interface MarqueeProps {
  items: MarqueeItem[];
}

export function Marquee({ items }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((it, i) => (
          <span
            key={i}
            className={`marquee-item${it.italic ? " italic" : ""}`}
          >
            {it.text}
            <span className="star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
