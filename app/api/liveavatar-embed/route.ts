import { NextResponse } from "next/server"

const API_BASE = "https://api.liveavatar.com"

// Simple in-memory cache so we don't recreate an embed on every open.
let cachedEmbed: { url: string; embedId: string } | null = null

async function pickAvatarId(apiKey: string): Promise<string | null> {
  // Prefer one of the user's own avatars (migrated from HeyGen); fall back to a public one.
  const headers = { "X-API-KEY": apiKey, "Content-Type": "application/json" }

  try {
    const userRes = await fetch(`${API_BASE}/v1/avatars`, { headers, cache: "no-store" })
    if (userRes.ok) {
      const json = await userRes.json()
      const list = json?.data?.avatars ?? json?.data ?? []
      if (Array.isArray(list) && list.length > 0 && list[0]?.id) {
        return list[0].id as string
      }
    }
  } catch {
    // fall through to public avatars
  }

  try {
    const pubRes = await fetch(`${API_BASE}/v1/avatars/public`, { headers, cache: "no-store" })
    if (pubRes.ok) {
      const json = await pubRes.json()
      const list = json?.data?.avatars ?? json?.data ?? []
      if (Array.isArray(list) && list.length > 0 && list[0]?.id) {
        return list[0].id as string
      }
    }
  } catch {
    // ignore
  }

  return null
}

export async function GET() {
  const apiKey = process.env.LIVEAVATAR_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "LiveAvatar is not configured. Add LIVEAVATAR_API_KEY from app.liveavatar.com/developers." },
      { status: 503 },
    )
  }

  if (cachedEmbed) {
    return NextResponse.json(cachedEmbed)
  }

  // Allow an explicit avatar override via env, otherwise auto-select.
  const avatarId = process.env.LIVEAVATAR_AVATAR_ID || (await pickAvatarId(apiKey))

  if (!avatarId) {
    return NextResponse.json(
      { error: "No avatar found on this LiveAvatar account. Create one at app.liveavatar.com." },
      { status: 502 },
    )
  }

  try {
    const res = await fetch(`${API_BASE}/v2/embeddings`, {
      method: "POST",
      headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        avatar_id: avatarId,
        type: "DEFAULT",
        orientation: "horizontal",
        is_sandbox: process.env.LIVEAVATAR_SANDBOX === "true",
      }),
      cache: "no-store",
    })

    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
      const message = json?.message || json?.detail || "Failed to create LiveAvatar embed."
      return NextResponse.json({ error: message }, { status: res.status })
    }

    const url: string | undefined = json?.data?.url
    const embedId: string | undefined = json?.data?.embed_id

    if (!url) {
      return NextResponse.json({ error: "LiveAvatar embed response missing a URL." }, { status: 502 })
    }

    cachedEmbed = { url, embedId: embedId ?? "" }
    return NextResponse.json(cachedEmbed)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error creating LiveAvatar embed." },
      { status: 500 },
    )
  }
}
