import { NextResponse } from "next/server";
// import { env } from "@/env/server";

const API_BASE_URL = process.env.API_BASE_URL;

const buildBackendUrl = (path: string, search: string): string => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }
  const trimmedBase = API_BASE_URL.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  const normalizedSearch = search.startsWith("?") ? search : `?${search}`;
  return search
    ? `${trimmedBase}/${trimmedPath}${normalizedSearch}`
    : `${trimmedBase}/${trimmedPath}`;
};

const forwardRequest = async (
  backendUrl: string,
  req: Request,
  body: string | ArrayBuffer | undefined,
  headers: Headers,
): Promise<Response> => {
  return fetch(backendUrl, {
    method: req.method,
    headers,
    body,
    cache: "no-store",
    redirect: "manual",
  });
};

const extractBody = async (
  req: Request,
): Promise<string | ArrayBuffer | undefined> => {
  const contentType = req.headers.get("content-type") || "";
  const isMultipart = contentType.includes("multipart/form-data");
  if (isMultipart) {
    const buffer = await req.arrayBuffer();
    return buffer.byteLength ? buffer : undefined;
  }
  const textBody = await req.text();
  return textBody.length > 0 ? textBody : undefined;
};

const buildForwardHeaders = (req: Request): Headers => {
  const headers = new Headers();
  const forwardedHeaderNames = [
    "accept",
    "authorization",
    "cookie",
    "content-type",
  ];

  for (const name of forwardedHeaderNames) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }

  return headers;
};

export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function POST(
  req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

const extractPathSegments = (
  req: Request,
  paramSegments?: string[],
): string[] => {
  if (Array.isArray(paramSegments) && paramSegments.length > 0) {
    return paramSegments;
  }
  const { pathname } = new URL(req.url);
  const prefix = "/api/proxy/";
  if (!pathname.startsWith(prefix)) {
    return [];
  }
  const remainder = pathname.slice(prefix.length);
  return remainder.split("/").filter(Boolean);
};

async function proxyRequest(req: Request, paramSegments?: string[]) {
  try {
    const segments = extractPathSegments(req, paramSegments);
    if (!segments.length) {
      return NextResponse.json(
        { message: "Missing proxy path." },
        { status: 400 },
      );
    }
    const pathname = segments.join("/");
    const { search } = new URL(req.url);
    const backendUrl = buildBackendUrl(pathname, search);
    const rawBody = await extractBody(req);
    const headers = buildForwardHeaders(req);
    const backendRes = await forwardRequest(backendUrl, req, rawBody, headers);
    // If the backend returns a 4xx or 5xx error, we still want to forward the response body
    // so the client can display the specific error message (e.g., "Invalid email or password").
    // We treat 204 (No Content) as a special case where we return null body.
    const responseText =
      backendRes.status === 204 ? null : await backendRes.text();
    const nextRes = new NextResponse(responseText, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: {
        "content-type":
          backendRes.headers.get("content-type") ??
          "application/json; charset=utf-8",
      },
    });
    const setCookieHeader = backendRes.headers.get("set-cookie");
    if (setCookieHeader) {
      nextRes.headers.set("set-cookie", setCookieHeader);
    }
    return nextRes;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Proxy error. Please try again later.",
      },
      { status: 502 },
    );
  }
}
