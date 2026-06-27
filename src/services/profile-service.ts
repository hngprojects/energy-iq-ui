import { apiFetch } from "@/lib/api/client";
import {
  AvatarUploadResponse,
  PersonalSettings,
  ProfileImageUploadResponse,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
} from "@/types/profile";

export const ProfileService = {
  getPersonalSettings: async () => {
    const data = await apiFetch<
      PersonalSettings & { AiLanguage?: string | null }
    >("/users/settings/personal", { method: "GET" }, true);

    return {
      ...data,
      aiLanguage: data.aiLanguage ?? data.AiLanguage ?? undefined,
    };
  },

  updateProfile: async (data: ProfileUpdateRequest) => {
    return apiFetch<ProfileUpdateResponse>(
      "/users/settings/personal",
      { method: "PATCH", data },
      true,
    );
  },

  uploadAvatar: async (file: File): Promise<AvatarUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiFetch<ProfileImageUploadResponse>(
      "/users/settings/personal/img",
      { method: "POST", data: formData },
      true,
    );

    return { profilePhoto: response.uploadUrl };
  },

  deleteAccount: async (id: string) => {
    return apiFetch<void>(
      `/users/${id}`,
      { method: "DELETE" },
      true,
    );
  },
};
