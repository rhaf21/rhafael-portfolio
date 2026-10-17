"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { looksAutomated, NO_IP_KEY, overLimit } from "@/lib/contact-guard";
import { briefEmail } from "@/lib/email/brief-email";
import { contactFormSchema } from "@/lib/validation";

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
  /** Submitted values, echoed back so the form can repopulate on error. */
  values?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
}

/** Resend's shared test sender: it can only deliver to the account owner, which is TO_ADDRESS. */
const FALLBACK_FROM = "Rhafael Portfolio <onboarding@resend.dev>";
const FROM_ADDRESS = process.env.CONTACT_FROM || FALLBACK_FROM;
const TO_ADDRESS = process.env.CONTACT_EMAIL || "rhafaelcorpuz21@gmail.com";

/** The "reply by" time in the email is shown in this zone. */
const TIME_ZONE = process.env.CONTACT_TIMEZONE || "Asia/Manila";

/** True when Resend refused the From address or its domain, the one failure the fallback sender can fix. */
function senderRejected(error: { name: string; message: string }): boolean {
  return (
    error.name === "invalid_from_address" ||
    (error.name === "validation_error" && /\b(domain|from)\b/i.test(error.message))
  );
}

/** An optional brief answer: plain text, trimmed, and capped, or undefined when empty. */
function answer(formData: FormData, key: string, max: number): string | undefined {
  const value = String(formData.get(key) ?? "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, max);
  return value || undefined;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const validatedFields = contactFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
      values: rawData,
    };
  }

  const { name, email, message } = validatedFields.data;

  // A bot gets the same "received" screen a person does, so it has no reason to retry.
  if (looksAutomated(formData)) {
    console.warn("Contact form: dropped a submission that looks automated");
    return { success: true, message: "Thank you. Your message has been sent. I'll reply within 24 hours." };
  }

  // Vercel sets x-real-ip and overwrites any client-supplied x-forwarded-for, so neither can be spoofed there.
  // With no IP (local dev), sends share one bucket with a higher cap: still bounded, never one visitor locking out all.
  const requestHeaders = await headers();
  const visitor = requestHeaders.get("x-real-ip") || requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (overLimit(visitor || NO_IP_KEY)) {
    return {
      success: false,
      message: "You've sent a few briefs in the last few minutes. Please email me directly at " + TO_ADDRESS + ".",
      values: rawData,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return {
      success: false,
      message:
        "Email service is not configured yet. Please email me directly at " +
        TO_ADDRESS +
        ".",
      values: rawData,
    };
  }

  try {
    const resend = new Resend(apiKey);

    const notification = briefEmail(
      {
        name,
        email,
        message,
        need: answer(formData, "need", 60),
        platforms: answer(formData, "platforms", 200),
        budget: answer(formData, "budget", 60),
        timing: answer(formData, "timing", 60),
        notes: answer(formData, "notes", 800),
      },
      new Date(),
      TIME_ZONE
    );

    const send = (from: string, subjectPrefix = "") =>
      resend.emails.send({
        from,
        to: TO_ADDRESS,
        replyTo: email,
        subject: subjectPrefix + notification.subject,
        html: notification.html,
        text: notification.text,
      });

    let { error } = await send(FROM_ADDRESS);
    // Retry once with the fallback sender only when Resend rejected the sender itself
    // (say, the domain lost verification), never on rate limits, quotas, or key errors.
    // The subject is flagged so a downgraded send is noticed in the inbox, not just the logs.
    if (error && FROM_ADDRESS !== FALLBACK_FROM && senderRejected(error)) {
      console.error("Resend rejected CONTACT_FROM, retrying with the fallback sender:", error);
      ({ error } = await send(FALLBACK_FROM, "[Check CONTACT_FROM] "));
    }

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        message:
          "Couldn't send the message. Please try again or email me directly at " +
          TO_ADDRESS +
          ".",
        values: rawData,
      };
    }

    return {
      success: true,
      message:
        "Thank you. Your message has been sent. I'll reply within 24 hours.",
    };
  } catch (error) {
    console.error("Failed to send contact form:", error);
    return {
      success: false,
      message:
        "Couldn't send the message. Please try again or email me directly at " +
        TO_ADDRESS +
        ".",
      values: rawData,
    };
  }
}
