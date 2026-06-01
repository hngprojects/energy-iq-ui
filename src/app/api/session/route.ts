import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "token";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const API_BASE_URL = process.env.API_BASE_URL;

const cookieOptions = {
  // Leave out maxAge: backend manages expiration
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};

function setTokenCookies(
  response: NextResponse,
  token: string,
  refreshToken?: string,
) {
  response.cookies.set(TOKEN_COOKIE, token, cookieOptions);
  if (refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body?.token;
    const refreshToken = body?.refreshToken;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ message: "Missing token." }, { status: 400 });
    }
    if (refreshToken && typeof refreshToken !== "string") {
      return NextResponse.json(
        { message: "Invalid refresh token." },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ ok: true });
    setTokenCookies(response, token, refreshToken);

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
    if (!API_BASE_URL) {
      return NextResponse.json(
        { message: "API_BASE_URL is not defined." },
        { status: 500 },
      );
    }

    const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { message: "Missing refresh token." },
        { status: 401 },
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    let backendResponse: Response;
    try {
      backendResponse = await fetch(
        `${API_BASE_URL.replace(/\/+$/, "")}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          cache: "no-store",
          signal: controller.signal,
        },
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return NextResponse.json(
          { message: "Refresh request timed out." },
          { status: 504 },
        );
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    const payload = await backendResponse.json().catch(() => null);
    if (!backendResponse.ok) {
      return NextResponse.json(payload ?? { message: "Refresh failed." }, {
        status: backendResponse.status,
      });
    }

    const data = payload?.data ?? payload;
    const newToken = data?.accessToken;
    const newRefreshToken = data?.refreshToken;

    if (!newToken || !newRefreshToken) {
      return NextResponse.json(
        { message: "Refresh response is missing tokens." },
        { status: 502 },
      );
    }

    const response = NextResponse.json(data);
    setTokenCookies(response, newToken, newRefreshToken);
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
  const expiredCookieOptions = {
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  } as const;
  response.cookies.set(TOKEN_COOKIE, "", expiredCookieOptions);
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", expiredCookieOptions);
  return response;
}

