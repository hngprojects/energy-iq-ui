import { notFound, redirect } from "next/navigation";

const API_BASE_URL = process.env.API_BASE_URL;

async function fetchShareableFileUrl(token: string): Promise<string | null> {
  if (!API_BASE_URL) return null;

  const response = await fetch(
    `${API_BASE_URL.replace(/\/+$/, "")}/api/v1/reports/share/${encodeURIComponent(token)}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    },
  );

  if (!response.ok) return null;

  const payload = await response.json().catch(() => null);
  const data = payload?.data ?? payload;

  if (typeof data !== "string" || !data) return null;
  return data;
}

export default async function ShareTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const fileUrl = await fetchShareableFileUrl(token);

  if (!fileUrl) {
    notFound();
  }

  redirect(fileUrl);
}

