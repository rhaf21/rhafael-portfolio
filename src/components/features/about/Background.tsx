"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/cn";

interface BackgroundProps {
  title?: string;
  stats?: Array<{ label: string; value: string }>;
  profileImage?: string | null;
}

export function Background({
  title = "About Me",
  stats = [
    { label: "Years Experience", value: "4+" },
    { label: "Projects Completed", value: "30+" },
    { label: "Happy Clients", value: "20+" },
  ],
  profileImage,
}: BackgroundProps) {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Profile Image */}
      <FadeIn direction="right">
        <div
          className={cn(
            "relative aspect-square max-w-md mx-auto",
            "rounded-2xl overflow-hidden",
            "bg-gradient-to-br from-primary-500/20 to-accent-500/20"
          )}
        >
          <motion.div
            className="absolute inset-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-6xl font-bold text-[var(--muted)]/20">R</span>
            )}
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-500/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </FadeIn>

      {/* Bio Content */}
      <FadeIn direction="left" delay={0.2}>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">{title}</h2>

          <div className="space-y-4 text-[var(--muted)]">
            <p>
              I&apos;m a <span className="text-primary-500 font-medium">Shopify</span> and{" "}
              <span className="text-primary-500 font-medium">WordPress</span> developer
              specializing in building high-converting e-commerce stores and custom
              web solutions. With a strong foundation in <span className="text-primary-500 font-medium">React</span>,
              I create seamless digital experiences that help businesses grow.
            </p>

            <p>
              From custom Shopify themes with Liquid to WordPress sites with WooCommerce
              integration, I&apos;ve helped businesses of all sizes establish and enhance
              their online presence. I focus on clean code, fast load times, and
              conversion-optimized designs.
            </p>

            <p>
              When I&apos;m not building stores or themes, you&apos;ll find me exploring
              the latest in e-commerce trends, optimizing site performance, or
              helping fellow developers in the community.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {stats.map((stat, index) => (
              <Stat key={index} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <motion.div
      className="text-center px-6 py-4 rounded-xl bg-[var(--card)] border border-[var(--border)]"
      whileHover={{ y: -2 }}
    >
      <div className="text-2xl font-bold text-primary-500">{value}</div>
      <div className="text-sm text-[var(--muted)]">{label}</div>
    </motion.div>
  );
}
