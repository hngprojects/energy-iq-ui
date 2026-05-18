import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phoneNumber: z
    .string()
    .max(20, "Phone number must be at most 20 characters")
    .optional()
    .refine((val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val), {
      message: "Enter a valid phone number",
    }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
