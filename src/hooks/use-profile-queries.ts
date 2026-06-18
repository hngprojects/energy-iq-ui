"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ProfileService } from "@/services/profile-service";
import { useAuthStore } from "@/stores/auth-store";
import { PersonalSettings, ProfileUpdateRequest } from "@/types/profile";

export const useProfileQueries = () => {
  const { setUser, user } = useAuthStore();
  const queryClient = useQueryClient();

  const usePersonalSettings = () =>
    useQuery({
      queryKey: ["personal-settings", user?.id],
      queryFn: ProfileService.getPersonalSettings,
      enabled: !!user?.id,
      staleTime: 5 * 60 * 1000,
    });

  const useUpdateProfile = (onSuccess?: () => void) =>
    useMutation({
      mutationFn: (data: ProfileUpdateRequest) => ProfileService.updateProfile(data),
      onSuccess: (data) => {
        const currentUser = useAuthStore.getState().user;
        const userId = currentUser?.id ?? data.id;
        if (currentUser) {
          setUser({ ...currentUser, ...data });
        } else {
          setUser(data);
        }
        toast.success("Profile updated successfully", { duration: 4000 });
        if (userId) {
          queryClient.setQueryData<PersonalSettings>(
            ["personal-settings", userId],
            (current) =>
              current
                ? {
                    ...current,
                    ...data,
                    profileUrl: data.profilePhoto ?? current.profileUrl,
                  }
                : current,
          );
          queryClient.invalidateQueries({
            queryKey: ["personal-settings", userId],
          });
        }
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
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          setUser({ ...currentUser, profilePhoto: data.profilePhoto });
        }
        const userId = currentUser?.id;
        if (userId) {
          queryClient.setQueryData<PersonalSettings>(
            ["personal-settings", userId],
            (current) =>
              current
                ? { ...current, profileUrl: data.profilePhoto }
                : current,
          );
          queryClient.invalidateQueries({
            queryKey: ["personal-settings", userId],
          });
        }
        onSuccess?.();
      },
      onError: () => {
        toast.error("Failed to upload photo. Please try again.");
      },
    });

  const useDeleteAccount = (onSuccess?: () => void) =>
    useMutation({
      mutationFn: (id: string) => ProfileService.deleteAccount(id),
      onSuccess: () => {
        toast.success("Account deleted successfully", { duration: 4000 });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete account. Please try again.";
        toast.error(message);
      },
    });

  return {
    usePersonalSettings,
    useUpdateProfile,
    useUploadAvatar,
    useDeleteAccount,
  };
};
