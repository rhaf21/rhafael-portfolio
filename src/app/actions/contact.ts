"use server";

import { contactFormSchema, type ContactFormData } from "@/lib/validation";

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  // Validate the form data
  const validatedFields = contactFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  try {
    // Option 1: Send email using a service like Resend, SendGrid, or Nodemailer
    // For now, we'll log and simulate success
    // In production, uncomment and configure one of these:

    // Using Resend (recommended - easy setup)
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Portfolio Contact <onboarding@resend.dev>',
    //   to: process.env.CONTACT_EMAIL || 'your@email.com',
    //   replyTo: email,
    //   subject: `Portfolio Contact: ${subject}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //   `,
    // });

    // Log the submission for development
    console.log("Contact form submission:", { name, email, subject, message });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully. I'll get back to you soon.",
    };
  } catch (error) {
    console.error("Failed to send contact form:", error);
    return {
      success: false,
      message: "Failed to send message. Please try again or email me directly.",
    };
  }
}
