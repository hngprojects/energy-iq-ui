import { apiFetch } from "@/lib/api/client";

export const WaitlistService = {
  joinWaitlist: async (email: string) => {
    return apiFetch<void>(
      "/waitlist",
      {
        method: "POST",
        data: { email },
      },
      false, 
    );
  },
};
