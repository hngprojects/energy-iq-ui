import { NextRequest, NextResponse } from "next/server";

const LEGACY_TOKEN_COOKIE = "token";
const LEGACY_REFRESH_TOKEN_COOKIE = "refreshToken";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const API_BASE_URL = process.env.API_BASE_URL;

const cookieOptions = {
  path: "/api/session",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};

const expiredCookieOptions = {
  maxAge: 0,
  path: "/api/session",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};

function expireSessionCookies(response: NextResponse) {
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", expiredCookieOptions);
  response.cookies.set(LEGACY_TOKEN_COOKIE, "", {
    ...expiredCookieOptions,
    path: "/",
  });
  response.cookies.set(LEGACY_REFRESH_TOKEN_COOKIE, "", {
    ...expiredCookieOptions,
    path: "/",
  });
}

function setRefreshCookie(response: NextResponse, refreshToken: string) {
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);
}

function extractRefreshCookie(req: NextRequest): string | undefined {
  return (
    req.cookies.get(REFRESH_TOKEN_COOKIE)?.value ||
    req.cookies.get(LEGACY_REFRESH_TOKEN_COOKIE)?.value
  );
}

function getRefreshCookieHeader(refreshToken: string) {
  return `${REFRESH_TOKEN_COOKIE}=${refreshToken}`;
}

function getSetCookieHeaders(headers: Headers): string[] {
  const headersWithSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof headersWithSetCookie.getSetCookie === "function") {
    return headersWithSetCookie.getSetCookie();
  }

  const setCookieHeader = headers.get("set-cookie");
  return setCookieHeader ? [setCookieHeader] : [];
}

function extractSetCookieToken(setCookieHeaders: string[]): string | null {
  for (let index = setCookieHeaders.length - 1; index >= 0; index -= 1) {
    const match = setCookieHeaders[index].match(/refresh_token=([^;]+)/i);
    const value = match?.[1];
    if (value) {
      return value;
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (body?.clear === true) {
      const response = NextResponse.json({ ok: true });
      expireSessionCookies(response);
      return response;
    }

    const refreshToken = body?.refreshToken;
    if (!refreshToken || typeof refreshToken !== "string") {
      return NextResponse.json(
        { message: "Missing refresh token." },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ ok: true });
    setRefreshCookie(response, refreshToken);
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Invalid request." },
      { status: 400 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const sessionId = body?.sessionId;
    const refreshToken = extractRefreshCookie(req);

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { message: "Missing sessionId." },
        { status: 401 },
      );
    }

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Missing refresh token." },
        { status: 401 },
      );
    }

    if (!API_BASE_URL) {
      return NextResponse.json(
        { message: "API_BASE_URL is not defined." },
        { status: 500 },
      );
    }

    const backendResponse = await fetch(
      `${API_BASE_URL.replace(/\/+$/, "")}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: getRefreshCookieHeader(refreshToken),
        },
        body: JSON.stringify({ sessionId }),
        cache: "no-store",
      },
    );

    const payload = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      const response = NextResponse.json(
        payload ?? { message: "Refresh failed." },
        { status: backendResponse.status },
      );
      expireSessionCookies(response);
      return response;
    }

    const data = payload?.data ?? payload;
    if (!data?.accessToken) {
      return NextResponse.json(
        { message: "Refresh response is missing an access token." },
        { status: 502 },
      );
    }

    const response = NextResponse.json(data);
    const rotatedRefreshToken = extractSetCookieToken(
      getSetCookieHeaders(backendResponse.headers),
    );
    if (rotatedRefreshToken) {
      setRefreshCookie(response, rotatedRefreshToken);
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Refresh failed." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  expireSessionCookies(response);
  return response;
}
