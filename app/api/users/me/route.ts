import { NextResponse } from "next/server";
import { resolveBackendUrl } from "@/lib/backendUrl";

async function resolveUserId(backendUrl: string, cookie: string | null) {
  const profileResponse = await fetch(`${backendUrl}/users/me`, {
    method: "GET",
    headers: {
      cookie: cookie ?? "",
    },
    cache: "no-store",
  });

  if (!profileResponse.ok) {
    const contentType = profileResponse.headers.get("content-type") || "application/json";
    const body = await profileResponse.text();
    return { response: new Response(body, { status: profileResponse.status, headers: { "Content-Type": contentType } }) };
  }

  const profile = (await profileResponse.json()) as { id: number | string };
  return { userId: profile.id };
}

export async function GET(request: Request) {
  const backendUrl = resolveBackendUrl();

  try {
    const backendResponse = await fetch(`${backendUrl}/users/me`, {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    const contentType = backendResponse.headers.get("content-type") || "application/json";
    const body = await backendResponse.text();

    return new Response(body, {
      status: backendResponse.status,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json(
      { error: `Auth backend недоступен (${backendUrl}): ${message}` },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request) {
  const backendUrl = resolveBackendUrl();
  const cookie = request.headers.get("cookie");

  try {
    const resolved = await resolveUserId(backendUrl, cookie);
    if ("response" in resolved) {
      return resolved.response;
    }

    const body = await request.text();
    const backendResponse = await fetch(`${backendUrl}/users/${resolved.userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: cookie ?? "",
      },
      body,
    });

    const contentType = backendResponse.headers.get("content-type") || "application/json";
    const responseBody = await backendResponse.text();
    return new Response(responseBody, {
      status: backendResponse.status,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json(
      { error: `Auth backend недоступен (${backendUrl}): ${message}` },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request) {
  const backendUrl = resolveBackendUrl();
  const cookie = request.headers.get("cookie");

  try {
    const resolved = await resolveUserId(backendUrl, cookie);
    if ("response" in resolved) {
      return resolved.response;
    }

    const backendResponse = await fetch(`${backendUrl}/users/${resolved.userId}`, {
      method: "DELETE",
      headers: {
        cookie: cookie ?? "",
      },
    });

    const contentType = backendResponse.headers.get("content-type") || "application/json";
    const responseBody = await backendResponse.text();
    return new Response(responseBody, {
      status: backendResponse.status,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json(
      { error: `Auth backend недоступен (${backendUrl}): ${message}` },
      { status: 503 },
    );
  }
}
