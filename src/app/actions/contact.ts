"use server";

import { Resend } from "resend";
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

const FROM_ADDRESS =
  process.env.CONTACT_FROM || "Rhafael Portfolio <onboarding@resend.dev>";
const TO_ADDRESS = process.env.CONTACT_EMAIL || "rhafaelcorpuz21@gmail.com";

/** The "reply by" time in the email is shown in this zone. */
const TIME_ZONE = process.env.CONTACT_TIMEZONE || "Asia/Manila";

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

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

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
