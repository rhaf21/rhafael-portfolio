"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// Hook to check if device supports fine pointer (mouse)
function subscribeToPointer(callback: () => void) {
  const mediaQuery = window.matchMedia("(pointer: fine)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getPointerSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}

function getPointerServerSnapshot() {
  return false;
}

export function CustomCursor() {
  const hasFinePointer = useSyncExternalStore(
    subscribeToPointer,
    getPointerSnapshot,
    getPointerServerSnapshot
  );
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring animation for the outer glow (trails behind)
  const springConfig = { damping: 25, stiffness: 200 };
  const glowX = useSpring(cursorX, springConfig);
  const glowY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (!hasFinePointer) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button"
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [hasFinePointer, cursorX, cursorY]);

  if (!hasFinePointer) return null;

  return (
    <>
      {/* SVG filter for free-flowing grainy noise effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="noise" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.4"
              numOctaves="3"
              seed="15"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Flashlight effect - subtle background illumination */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 1.3 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, oklch(0.65 0.35 140 / 0.05) 0%, oklch(0.65 0.35 140 / 0.025) 30%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      {/* Outer glow - trails behind with subtle grainy effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: isHovering ? 1.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Main glow layer */}
          <div
            className="absolute rounded-full opacity-25"
            style={{
              width: 140,
              height: 140,
              left: -70,
              top: -70,
              background:
                "radial-gradient(circle, oklch(0.65 0.35 140 / 0.5) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <div
            className="absolute rounded-full opacity-40"
            style={{
              width: 70,
              height: 70,
              left: -35,
              top: -35,
              background:
                "radial-gradient(circle, oklch(0.80 0.40 140 / 0.7) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
          {/* Free-flowing grainy overlay */}
          <div
            className="absolute opacity-10"
            style={{
              width: 160,
              height: 160,
              left: -80,
              top: -80,
              background:
                "radial-gradient(ellipse 60% 80% at 50% 50%, oklch(0.65 0.35 140 / 0.3) 0%, transparent 70%)",
              filter: "url(#noise) blur(2px)",
              borderRadius: "50% 40% 60% 50%",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Inner cursor - dot or hand pointer */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {isHovering ? (
          /* Pointing finger SVG for links/buttons */
          <motion.svg
            width="28"
            height="28"
            viewBox="0 0 512 512"
            fill="none"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            style={{
              filter:
                "drop-shadow(0 0 8px oklch(0.80 0.40 140)) drop-shadow(0 0 16px oklch(0.65 0.35 140 / 0.6))",
              marginLeft: -1,
              marginTop: 12,
            }}
          >
            <path
              d="M249.703 6.727C259.963 14.19 264.917 23.67 267 36c.577 6.933.49 13.908.512 20.86l.054 6.001c.047 5.228.077 10.456.104 15.684.03 5.35.076 10.699.121 16.049q.127 15.702.209 31.406l1.86-.636 2.445-.828 2.422-.823c10.666-3.346 21.497-1.676 31.46 2.912 8.19 4.37 14.883 10.853 18.813 19.375v3l2.23-1.059 2.957-1.379 2.918-1.37c9.048-3.725 20.355-3.453 29.524-.231C375.317 150.52 382.856 158.115 388 171c1.684 5.671 2.256 11.106 2 17l2.098-.875c10.47-3.973 21.781-5.066 32.504-1.219 11.034 5.032 19.153 12.114 23.836 23.469 1.868 5.145 2.688 9.465 2.702 14.97l.018 3.957.003 4.339.015 4.574q.019 6.219.024 12.437.005 3.897.012 7.793.02 12.225.027 24.45.007 14.048.05 28.094.034 10.892.034 21.785 0 6.486.025 12.973c.166 42.138.166 42.138-6.098 61.503l-.778 2.481c-12.081 37.428-38.422 68.69-73.19 87.14-18.41 9.355-39.224 16.201-60.024 16.332l-2.202.017q-2.303.014-4.604.02c-2.286.01-4.572.04-6.858.072-41.128.294-78.892-18.425-108.028-46.671-11.535-12.276-20.618-27.031-29.834-41.054-3.14-4.765-6.334-9.46-9.712-14.06-4.918-6.695-9.454-13.629-14.02-20.566a426 426 0 0 0-12.009-17.197c-3.431-4.763-6.638-9.674-9.866-14.577-5.001-7.549-10.077-15-15.387-22.335-6.045-8.431-11.782-17.084-17.585-25.682a984 984 0 0 0-6.22-9.03C65.67 287.734 59.183 276.89 61 260c2.194-11.386 6.997-20.16 16.125-27.375 9.684-6.535 20.292-8.97 31.875-7.625 15.991 3.146 25.675 12.333 34.526 25.442l1.536 2.308q1.7 2.519 3.403 5.035l1.757 2.602c2.924 4.298 5.914 8.549 8.903 12.8A2610 2610 0 0 1 177 299c2.473-.344 2.473-.344 5-1 1.17-2.34 1.127-3.703 1.13-6.31l.011-2.759-.003-3.05.009-3.227q.011-5.386.01-10.773l.016-7.696q.017-8.306.026-16.612c.01-8.757.031-17.514.053-26.271l.023-8.988.005-2.269a71513 71513 0 0 0 .063-27.948q.038-18.934.061-37.867.027-19.441.085-38.884.036-11.988.04-23.977c.002-6.132.02-12.265.044-18.397q.01-3.767.005-7.535c-.003-3.434.011-6.867.03-10.301l-.017-2.997c.11-11.502 3.61-21.797 11.448-30.37 15.321-14.427 36.964-16.348 54.664-5.042"
              fill="oklch(0.65 0.35 140)"
            />
          </motion.svg>
        ) : (
          /* Default dot cursor */
          <motion.div
            className="rounded-full"
            style={{
              width: 12,
              height: 12,
              background: "oklch(0.65 0.35 140)",
              boxShadow:
                "0 0 12px oklch(0.80 0.40 140), 0 0 25px oklch(0.65 0.35 140 / 0.5)",
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    </>
  );
}
