"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  MapPin,
  Search,
  LocateFixed,
  X,
  Loader2,
  Pencil,
  type LucideIcon,
} from "lucide-react"

type WeatherLocation = { name: string; lat: number; lon: number }

const DEFAULT_LOCATION: WeatherLocation = { name: "Plainfield", lat: 40.6337, lon: -74.4074 }

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Request failed")
    return res.json()
  })

function weatherInfo(code: number): { Icon: LucideIcon; label: string } {
  if (code === 0) return { Icon: Sun, label: "Clear" }
  if (code === 1 || code === 2) return { Icon: CloudSun, label: "Partly Cloudy" }
  if (code === 3) return { Icon: Cloud, label: "Cloudy" }
  if (code === 45 || code === 48) return { Icon: CloudFog, label: "Foggy" }
  if (code >= 51 && code <= 57) return { Icon: CloudDrizzle, label: "Drizzle" }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { Icon: CloudRain, label: "Rain" }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { Icon: CloudSnow, label: "Snow" }
  if (code >= 95) return { Icon: CloudLightning, label: "Thunderstorm" }
  return { Icon: Cloud, label: "Cloudy" }
}

function dayLabel(iso: string, index: number) {
  if (index === 0) return "Today"
  return new Date(`${iso}T00:00`).toLocaleDateString("en-US", { weekday: "short" })
}

type GeoResult = { id: number; name: string; latitude: number; longitude: number; admin1?: string; country_code?: string }

export function WeatherWidget() {
  const [location, setLocation] = useState<WeatherLocation>(DEFAULT_LOCATION)
  const [editing, setEditing] = useState(false)
  const [query, setQuery] = useState("")
  const [submittedQuery, setSubmittedQuery] = useState("")
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&forecast_days=6`
  const { data, error, isLoading } = useSWR(weatherUrl, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 15 * 60 * 1000,
  })

  const { data: geoData, isLoading: geoLoading } = useSWR(
    submittedQuery
      ? `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(submittedQuery)}&count=5&language=en&format=json`
      : null,
    fetcher,
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLocateError(null)
    setSubmittedQuery(query.trim())
  }

  function selectResult(result: GeoResult) {
    const parts = [result.name, result.admin1, result.country_code].filter(Boolean)
    setLocation({
      name: result.admin1 && result.admin1 !== result.name ? `${result.name}, ${result.admin1}` : parts.join(", "),
      lat: result.latitude,
      lon: result.longitude,
    })
    setEditing(false)
    setQuery("")
    setSubmittedQuery("")
  }

  function useMyLocation() {
    setLocateError(null)
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocateError("Location isn't available in this browser.")
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        let name = "My Location"
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )
          const j = await res.json()
          name = j.city || j.locality || j.principalSubdivision || "My Location"
        } catch {
          // keep fallback name
        }
        setLocation({ name, lat: latitude, lon: longitude })
        setLocating(false)
        setEditing(false)
      },
      () => {
        setLocating(false)
        setLocateError("Couldn't get your location. Please allow access or search instead.")
      },
      { timeout: 10000, enableHighAccuracy: false },
    )
  }

  const current = data?.current
  const daily = data?.daily
  const currentInfo = current ? weatherInfo(current.weather_code) : null
  const CurrentIcon = currentInfo?.Icon
  const todayHigh = daily ? Math.round(daily.temperature_2m_max?.[0]) : null
  const todayLow = daily ? Math.round(daily.temperature_2m_min?.[0]) : null

  return (
    <div className="relative bg-gradient-to-br from-[#4a90d9] to-[#2c5aa0] rounded-2xl p-5 shadow-lg w-72 text-white">
      {editing ? (
        <div className="animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Change location</p>
            <button
              onClick={() => setEditing(false)}
              className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Close location settings"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white/15 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-white/70 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city"
              className="flex-1 bg-transparent text-sm outline-none placeholder-white/60 text-white min-w-0"
            />
          </form>

          <button
            onClick={useMyLocation}
            disabled={locating}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
            {locating ? "Locating…" : "Use my location"}
          </button>

          {locateError && <p className="mt-2 text-xs text-white/80 leading-snug">{locateError}</p>}

          {submittedQuery && (
            <div className="mt-3 max-h-40 overflow-y-auto">
              {geoLoading && <p className="text-xs text-white/70 px-1">Searching…</p>}
              {!geoLoading && (!geoData?.results || geoData.results.length === 0) && (
                <p className="text-xs text-white/70 px-1">No matches for &ldquo;{submittedQuery}&rdquo;.</p>
              )}
              <ul className="space-y-1">
                {geoData?.results?.map((r: GeoResult) => (
                  <li key={r.id}>
                    <button
                      onClick={() => selectResult(r)}
                      className="w-full text-left text-sm px-2 py-1.5 rounded-md hover:bg-white/15 transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-white/70 shrink-0" />
                      <span className="truncate">
                        {r.name}
                        {r.admin1 ? `, ${r.admin1}` : ""}
                        {r.country_code ? ` · ${r.country_code}` : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-white/80 text-sm font-medium truncate">{location.name}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0"
                  aria-label="Change location"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>

              {isLoading && <p className="text-white text-3xl font-light mt-2">--°</p>}
              {error && <p className="text-white/80 text-sm mt-3 leading-snug">Weather unavailable right now.</p>}
              {current && (
                <>
                  <p className="text-white text-5xl font-light mt-1">{Math.round(current.temperature_2m)}°</p>
                  <p className="text-white/70 text-xs mt-2">{currentInfo?.label}</p>
                  {todayHigh != null && todayLow != null && (
                    <p className="text-white/60 text-xs">
                      H:{todayHigh}° L:{todayLow}°
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="mt-2 shrink-0">
              {isLoading ? (
                <Loader2 className="w-10 h-10 text-white/70 animate-spin" />
              ) : (
                CurrentIcon && <CurrentIcon className="w-12 h-12 text-white" strokeWidth={1.5} />
              )}
            </div>
          </div>

          {daily?.time && (
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="flex justify-between text-xs text-white/80">
                {daily.time.slice(1, 6).map((iso: string, i: number) => {
                  const info = weatherInfo(daily.weather_code[i + 1])
                  const DayIcon = info.Icon
                  return (
                    <div key={iso} className="text-center">
                      <p>{dayLabel(iso, i + 1)}</p>
                      <DayIcon className="w-4 h-4 my-1 mx-auto" strokeWidth={1.5} />
                      <p>{Math.round(daily.temperature_2m_max[i + 1])}°</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
