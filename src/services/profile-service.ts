import { apiFetch } from "@/lib/api/client";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  PersonalSettings,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
} from "@/types/profile";

export const ProfileService = {
  getPersonalSettings: async () => {
    return apiFetch<PersonalSettings>(
      "/users/settings/personal",
      { method: "GET" },
      true,
    );
  },

  updateProfile: async (data: ProfileUpdateRequest) => {
    return apiFetch<ProfileUpdateResponse>(
      "/users/settings/personal",
      { method: "PATCH", data },
      true,
    );
  },

  uploadAvatar: async (file: File) => {
    const profileUrl = await uploadToCloudinary(file);

    const response = await apiFetch<ProfileUpdateResponse>(
      "/users/settings/personal",
      { method: "PATCH", data: { profileUrl } },
      true,
    );

    return { profilePhoto: response.profilePhoto ?? profileUrl };
  },
};
