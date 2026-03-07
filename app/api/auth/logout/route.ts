import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001";

export async function POST() {
  try {
    const backendResponse = await fetch(`${BACKEND_URL}/logout`, {
      method: "POST",
      cache: "no-store",
    });

    const contentType = backendResponse.headers.get("content-type") || "application/json";
    const setCookie = backendResponse.headers.get("set-cookie");
    const body = await backendResponse.text();

    const response = new Response(body, {
      status: backendResponse.status,
      headers: { "Content-Type": contentType },
    });

    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json(
      { error: `Auth backend недоступен (${BACKEND_URL}): ${message}` },
      { status: 503 },
    );
  }
}
