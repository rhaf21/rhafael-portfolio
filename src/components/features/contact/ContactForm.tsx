"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { Magnetic, Arrow } from "@/components/ui";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/actions/contact";

const initialState: ContactFormState = { success: false, message: "" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (state.success) {
      const form = document.getElementById(
        "contact-form"
      ) as HTMLFormElement | null;
      form?.reset();
      // Scroll the new success view into view so it's never below the fold.
      successRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [state.success]);

  if (state.success) {
    return (
      <div
        ref={successRef}
        className="success"
        role="status"
        aria-live="polite"
      >
        <h3 style={{ marginTop: 0, fontSize: 22, fontWeight: 500 }}>
          Message sent
        </h3>
        <p style={{ marginBottom: 0 }}>
          Thanks. I&apos;ve got your note and will reply within 24 hours. In
          the meantime, feel free to{" "}
          <Link
            href="/projects"
            style={{ textDecoration: "underline", color: "var(--accent)" }}
          >
            browse my work
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      id="contact-form"
      action={formAction}
      className="contact-form"
      data-reveal
    >
      <div className="field">
        <label htmlFor="contact-name">Your name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Jane Doe"
          required
        />
        {state.errors?.name?.[0] && (
          <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>
            {state.errors.name[0]}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="jane@company.com"
          required
        />
        {state.errors?.email?.[0] && (
          <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>
            {state.errors.email[0]}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="contact-subject">Project type</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="Shopify rebuild, Next.js app, WordPress…"
          required
        />
        {state.errors?.subject?.[0] && (
          <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>
            {state.errors.subject[0]}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="contact-message">Tell me more</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="Goals, timeline, budget range, links to references…"
          required
        />
        {state.errors?.message?.[0] && (
          <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>
            {state.errors.message[0]}
          </p>
        )}
      </div>
      {state.message && !state.success && (
        <p
          role="alert"
          aria-live="polite"
          style={{ color: "#ef4444", fontSize: 14, margin: 0 }}
        >
          {state.message}
        </p>
      )}
      <Magnetic>
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary"
          data-cursor="hover"
        >
          {isPending ? "Sending…" : "Send message"}{" "}
          <span className="arrow">
            <Arrow direction="up-right" />
          </span>
        </button>
      </Magnetic>
    </form>
  );
}
