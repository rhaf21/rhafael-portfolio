import Image from "next/image";
import type { TestimonialData } from "@/lib/payload";

interface TestimonialsProps {
  testimonials: TestimonialData[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;
  const t = testimonials[0];

  return (
    <section className="section container-x">
      <div className="testimonial" data-reveal>
        <blockquote>
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <div className="author">
          <div className="avatar">
            {t.avatar ? (
              <Image
                src={t.avatar}
                alt={t.name}
                width={48}
                height={48}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span>{t.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="who">
            <div className="name">{t.name}</div>
            {(t.role || t.company) && (
              <div className="role">
                {t.role}
                {t.role && t.company && ", "}
                {t.company}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
