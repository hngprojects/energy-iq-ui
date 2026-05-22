export const onboardingStorage = {
  getCompletionKey: (userId?: string) => {
    return userId ? `energy_iq_onboarding_completed_${userId}` : "energy_iq_onboarding_completed";
  },

  isCompleted: (userId?: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const key = onboardingStorage.getCompletionKey(userId);
      const val = localStorage.getItem(key);
      if (val === "true") return true;

      if (userId) {
        return localStorage.getItem("energy_iq_onboarding_completed") === "true";
      }
      return false;
    } catch (e) {
      console.warn("Storage access failed (possibly incognito mode):", e);
      return false;
    }
  },

  setCompleted: (userId?: string): void => {
    if (typeof window === "undefined") return;
    try {
      const key = onboardingStorage.getCompletionKey(userId);
      localStorage.setItem(key, "true");
      localStorage.setItem("energy_iq_onboarding_completed", "true");
    } catch (e) {
      console.warn("Failed to save onboarding completion (possibly incognito mode):", e);
    }
  },

  clearCompletion: (userId?: string): void => {
    if (typeof window === "undefined") return;
    try {
      const key = onboardingStorage.getCompletionKey(userId);
      localStorage.removeItem(key);
      localStorage.removeItem("energy_iq_onboarding_completed");
    } catch (e) {
      console.warn("Failed to clear onboarding completion:", e);
    }
  }
};
