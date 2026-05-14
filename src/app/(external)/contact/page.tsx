"use client";

import Image from "next/image";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api/client";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type ContactInputFieldProps = ComponentPropsWithoutRef<typeof Input> & {
  label: string;
  error?: string;
};

type ContactTextareaFieldProps = ComponentPropsWithoutRef<"textarea"> & {
  label: string;
  error?: string;
};

const contactLabelClassName = "text-base font-medium text-[#2A2F3C] md:text-lg";
const contactInputClassName =
  "h-12.5 rounded-[8px] border border-[#D8DBE2] bg-[#FCFCFC] px-7 py-3.5 text-base font-light placeholder:text-[#9CA3AF] md:text-lg";

const ContactInputField = forwardRef<HTMLInputElement, ContactInputFieldProps>(
  ({ id, label, error, ...props }, ref) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={contactLabelClassName}>
        {label}
      </Label>
      <Input
        ref={ref}
        id={id}
        aria-invalid={error ? "true" : "false"}
        className={contactInputClassName}
        {...props}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  ),
);

ContactInputField.displayName = "ContactInputField";

const ContactTextareaField = forwardRef<
  HTMLTextAreaElement,
  ContactTextareaFieldProps
>(({ id, label, error, ...props }, ref) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id} className={contactLabelClassName}>
      {label}
    </Label>
    <textarea
      ref={ref}
      id={id}
      className="placeholder:text-muted-foreground focus-visible:border-border-active h-60.5 resize-none rounded-[8px] border border-[#D8DBE2] bg-[#FCFCFC] px-7 py-3.5 text-base font-light transition-colors outline-none focus-visible:ring-0 md:text-lg"
      {...props}
    />
    {error && <p className="text-destructive text-sm">{error}</p>}
  </div>
));

ContactTextareaField.displayName = "ContactTextareaField";

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      await apiFetch<void>(
        "/contact",
        {
          method: "POST",
          data,
        },
        true,
      );
      toast.success("Message sent!", {
        description: "We'll get back to you as soon as possible.",
      });
      reset();
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    }
  }

  return (
    <section className="flex flex-col bg-white">
      {/* Hero Section with Background Image */}
      <div className="relative flex h-87.5 w-full items-center justify-center overflow-hidden md:h-112.5">
        <Image
          src="/images/pages.jpg"
          alt="Contact hero background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/80" />

        <div className="relative z-10 flex max-w-3xl flex-col items-center px-4 text-center">
          <h1 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Contact us
          </h1>
          <p className="text-base leading-relaxed text-gray-300 md:text-lg">
            Have questions about your data or need help optimizing your
            dashboard?
            <br className="hidden md:block" />
            Our team is ready to provide the technical support and insights you
            need.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
          aria-label="Contact support form"
          noValidate
        >
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ContactInputField
              id="firstName"
              label="First name"
              placeholder="Enter your first name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <ContactInputField
              id="lastName"
              label="Last name"
              placeholder="Enter your last name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ContactInputField
              id="email"
              type="email"
              label="Email"
              placeholder="johndoe@gmail.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <ContactInputField
              id="phone"
              type="tel"
              label="Phone number"
              placeholder="Enter your phone number"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          {/* Message */}
          <ContactTextareaField
            id="message"
            label="Message"
            rows={6}
            placeholder="Leave us a message"
            error={errors.message?.message}
            {...register("message")}
          />

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 bg-[#f5a623] px-4 py-2 text-sm font-medium text-[#111928] hover:bg-[#e0961d] md:text-base"
            >
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
