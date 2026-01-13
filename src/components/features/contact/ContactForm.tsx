"use client";

import { useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button, Input, Textarea } from "@/components/ui";
import { cn } from "@/lib/cn";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = {
  success: false,
  message: "",
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  // Reset form on success
  useEffect(() => {
    if (state.success) {
      const form = document.getElementById("contact-form") as HTMLFormElement;
      form?.reset();
    }
  }, [state.success]);

  return (
    <motion.form
      id="contact-form"
      action={formAction}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          name="name"
          label="Name"
          placeholder="Your name"
          error={state.errors?.name?.[0]}
          required
        />
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          error={state.errors?.email?.[0]}
          required
        />
      </div>

      <Input
        name="subject"
        label="Subject"
        placeholder="What's this about?"
        error={state.errors?.subject?.[0]}
        required
      />

      <Textarea
        name="message"
        label="Message"
        placeholder="Tell me about your project..."
        rows={6}
        error={state.errors?.message?.[0]}
        required
      />

      <div className="flex items-center justify-between">
        <AnimatePresence mode="wait">
          {state.message && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={cn(
                "text-sm",
                state.success
                  ? "text-green-500"
                  : "text-red-500"
              )}
            >
              {state.message}
            </motion.p>
          )}
        </AnimatePresence>

        <Button type="submit" isLoading={isPending} className="ml-auto">
          {isPending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </motion.form>
  );
}
