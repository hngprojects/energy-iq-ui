import { apiFetch } from "@/lib/api/client";
import { ContactFormValues } from "@/lib/schemas/contact";

export const ContactService = {
  submitMessage: async (data: ContactFormValues) => {
    return apiFetch<void>(
      "/contact",
      {
        method: "POST",
        data,
      },
      true,
    );
  },
};
