"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { ProfileService } from "@/services/profile-service";
import { useAuthStore } from "@/stores/auth-store";
import { ProfileUpdateRequest } from "@/types/profile";

export const useProfileQueries = () => {
  const { setUser, user } = useAuthStore();

  const useUpdateProfile = (onSuccess?: () => void) =>
    useMutation({
      mutationFn: (data: ProfileUpdateRequest) => ProfileService.updateProfile(data),
      onSuccess: (data) => {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          setUser({ ...currentUser, ...data });
        } else {
          setUser(data);
        }
        toast.success("Profile updated successfully", { duration: 4000 });
        onSuccess?.();
      },
      onError: () => {
        toast.error("Failed to update profile. Please try again.");
      },
    });

  const useUploadAvatar = (onSuccess?: () => void) =>
    useMutation({
      mutationFn: (file: File) => ProfileService.uploadAvatar(file),
      onSuccess: (data) => {
        if (user) {
          setUser({ ...user, profilePhoto: data.profilePhoto });
        }
        onSuccess?.();
      },
      onError: () => {
        toast.error("Failed to upload photo. Please try again.");
      },
    });

  return { useUpdateProfile, useUploadAvatar };
};
