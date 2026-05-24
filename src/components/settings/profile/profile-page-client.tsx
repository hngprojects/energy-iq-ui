"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Check, Loader2, Upload } from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { useProfileQueries } from "@/hooks/use-profile-queries";
import { SelectField } from "@/components/settings/select-field";
import { PhotoUploadDialog } from "./photo-upload-dialog";
import { PhotoSuccessDialog } from "./photo-success-dialog";
import { ProfileUpdateRequest } from "@/types/profile";
import {
  BUSINESS_TYPES,
  NIGERIAN_STATES,
  CITIES_BY_STATE,
} from "@/constants/profile";

const profileSchema = z.object({
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  businessName: z.string().trim().optional(),
  businessType: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfilePageClient() {
  const { user } = useAuthStore();
  const { useUpdateProfile } = useProfileQueries();

  const [isEditing, setIsEditing] = React.useState(false);
  const [profileSaved, setProfileSaved] = React.useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = React.useState(false);
  const [photoSuccessOpen, setPhotoSuccessOpen] = React.useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      businessName: user?.businessName ?? "",
      businessType: user?.businessType ?? "",
      state: user?.state ?? "",
      city: user?.city ?? "",
    },
  });

  const selectedState = watch("state");
  const cityOptions = selectedState
    ? (CITIES_BY_STATE[selectedState] ?? [])
    : [];

  React.useEffect(() => {
    if (!isEditing) {
      reset({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        businessName: user?.businessName ?? "",
        businessType: user?.businessType ?? "",
        state: user?.state ?? "",
        city: user?.city ?? "",
      });
    }
  }, [user, isEditing, reset]);

  const updateProfile = useUpdateProfile(() => {
    setIsEditing(false);
    setProfileSaved(true);
  });

  const onSubmit = (values: ProfileFormValues) => {
    // We send all values (including empty strings) to the backend
    // so that users can explicitly clear optional fields like business name.
    updateProfile.mutate(values as ProfileUpdateRequest);
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      businessName: user?.businessName ?? "",
      businessType: user?.businessType ?? "",
      state: user?.state ?? "",
      city: user?.city ?? "",
    });
  };

  const sectionTitle = profileSaved
    ? "User Profile"
    : "Personal Business and Information.";
  const hasPhoto = !!user?.profilePhoto;

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text">Profile Settings</h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Manage your personal and business information.
        </p>
      </div>

      {/* Profile Photo Section */}
      <div className="mb-4 rounded-xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-dark-text">
          Profile Photo
        </h2>
        <p className="mt-0.5 text-sm text-[#5D5C5D]">PNG or JPG, up to 2MB.</p>

        <div className="mt-4 flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D1D5DB]">
            {hasPhoto ? (
              <Image
                src={user!.profilePhoto!}
                alt="Profile photo"
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-[#374151]">
                {user
                  ? `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase() ||
                    "AA"
                  : "AA"}
              </span>
            )}
          </div>

          {/* Upload button */}
          <button
            type="button"
            onClick={() => setPhotoDialogOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-dark-text hover:bg-muted transition-colors"
          >
            <Upload className="h-4 w-4" />
            {hasPhoto ? "Upload new photo" : "Upload photo"}
          </button>
        </div>
      </div>

      {/* Personal Business and Information */}
      <div className="rounded-xl border border-border bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-dark-text">
                {sectionTitle}
              </h2>
              <p className="mt-0.5 text-sm text-[#5D5C5D]">
                This information is used across your EnergyIQ account.
              </p>
            </div>
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/90 sm:w-auto"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            ) : updateProfile.isPending ? (
              <button
                type="button"
                disabled
                className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-white opacity-80 cursor-not-allowed"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </button>
            ) : (
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-dark-text hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-white hover:bg-secondary/90 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                First name
              </label>
              <input
                {...register("firstName")}
                disabled={!isEditing}
                placeholder="First name"
                className="h-14 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:cursor-default"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                Last name
              </label>
              <input
                {...register("lastName")}
                disabled={!isEditing}
                placeholder="Last name"
                className="h-14 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:cursor-default"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                Email
              </label>
              <input
                value={user?.email ?? ""}
                disabled
                readOnly
                placeholder="Email"
                className="h-14 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none disabled:opacity-60 disabled:cursor-default"
              />
            </div>

            {/* Business name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                Business name
              </label>
              <input
                {...register("businessName")}
                disabled={!isEditing}
                placeholder="Business name"
                className="h-14 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:cursor-default"
              />
              {errors.businessName && (
                <p className="text-xs text-red-500">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            {/* Business type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                Business type
              </label>
              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <SelectField
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={BUSINESS_TYPES}
                    placeholder="Select business type"
                    disabled={!isEditing}
                  />
                )}
              />
              {errors.businessType && (
                <p className="text-xs text-red-500">
                  {errors.businessType.message}
                </p>
              )}
            </div>

            {/* State */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                State
              </label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <SelectField
                    value={field.value ?? ""}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("city", "", { shouldValidate: true });
                    }}
                    options={NIGERIAN_STATES}
                    placeholder="Select state"
                    disabled={!isEditing}
                  />
                )}
              />
              {errors.state && (
                <p className="text-xs text-red-500">{errors.state.message}</p>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">City</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <SelectField
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={cityOptions}
                    placeholder={
                      selectedState ? "Select city" : "Select state first"
                    }
                    disabled={!isEditing || !selectedState}
                  />
                )}
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>

      <PhotoUploadDialog
        open={photoDialogOpen}
        onOpenChange={setPhotoDialogOpen}
        onUploadSuccess={() => setPhotoSuccessOpen(true)}
      />

      <PhotoSuccessDialog
        open={photoSuccessOpen}
        onOpenChange={setPhotoSuccessOpen}
      />
    </div>
  );
}

