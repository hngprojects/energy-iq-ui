import { apiFetch } from "@/lib/api/client";
import { ProfileUpdateRequest, ProfileUpdateResponse, AvatarUploadResponse } from "@/types/profile";

export const ProfileService = {
  updateProfile: async (data: ProfileUpdateRequest) => {
    return apiFetch<ProfileUpdateResponse>("/users/profile", { method: "PATCH", data }, true);
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiFetch<AvatarUploadResponse>(
      "/users/profile/avatar",
      { method: "POST", data: formData, headers: { "Content-Type": "multipart/form-data" } },
      true,
    );
  },
};
