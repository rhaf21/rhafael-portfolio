interface ArrowProps {
  direction?: "up-right" | "right" | "down" | "left";
  size?: number;
}

export function Arrow({ direction = "up-right", size = 14 }: ArrowProps) {
  const rotation = {
    "up-right": -45,
    right: 0,
    down: 90,
    left: 180,
  }[direction];

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: `rotate(${rotation}deg)`, transition: "transform .25s" }}
    >
      <path d="M3 8h10" />
      <path d="M9 4l4 4-4 4" />
    </svg>
  );
}
