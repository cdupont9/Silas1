import { NextResponse } from "next/server"

// Mints a short-lived HeyGen streaming token using the server-only API key.
// The raw HEYGEN_API_KEY is never sent to the browser.
export async function POST() {
  const apiKey = process.env.HEYGEN_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "HEYGEN_API_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  try {
    const res = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      const detail = await res.text()
      console.log("[v0] HeyGen token error:", res.status, detail)
      return NextResponse.json(
        { error: `HeyGen token request failed (${res.status}). Check that your plan includes Interactive Avatar / Streaming.` },
        { status: res.status },
      )
    }

    const json = await res.json()
    const token = json?.data?.token

    if (!token) {
      return NextResponse.json({ error: "No token returned by HeyGen." }, { status: 502 })
    }

    return NextResponse.json({ token })
  } catch (err) {
    console.log("[v0] HeyGen token exception:", err)
    return NextResponse.json({ error: "Failed to reach HeyGen." }, { status: 502 })
  }
}
