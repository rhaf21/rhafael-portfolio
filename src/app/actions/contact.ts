"use server";

import { Resend } from "resend";
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

  const { name, email, subject, message } = validatedFields.data;

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

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `Portfolio contact: ${subject}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0a0a0a;">
          <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;">New contact form submission</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:8px 0;color:#737373;width:120px;">Name</td>
              <td style="padding:8px 0;color:#0a0a0a;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#737373;">Email</td>
              <td style="padding:8px 0;color:#0a0a0a;"><a href="mailto:${safeEmail}" style="color:#0a0a0a;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#737373;">Subject</td>
              <td style="padding:8px 0;color:#0a0a0a;">${safeSubject}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
          <div style="font-size:15px;line-height:1.6;color:#1a1a1a;white-space:pre-wrap;">${safeMessage}</div>
        </div>
      `,
      text:
        `New contact form submission\n\n` +
        `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n` +
        `Message:\n${message}`,
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
