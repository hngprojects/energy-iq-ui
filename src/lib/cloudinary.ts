interface CloudinaryUploadResponse {
  secure_url: string;
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary is not configured");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = (await response.json()) as CloudinaryUploadResponse;
  if (!data.secure_url) {
    throw new Error(`Cloudinary response missing secure_url. Response: ${JSON.stringify(data)}`);
  }
  return data.secure_url;
}
