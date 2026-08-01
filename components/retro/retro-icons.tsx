import type React from "react"

// Small, crisp early-2000s style icons drawn as inline SVG so they stay sharp and need no assets.
type IconProps = { size?: number; className?: string; style?: React.CSSProperties }

export function MyComputerIcon({ size = 32, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <rect x="4" y="5" width="21" height="15" rx="1" fill="#c9d6e5" stroke="#4a5a6a" />
      <rect x="6" y="7" width="17" height="11" fill="#2a6fb0" stroke="#16324f" />
      <rect x="7" y="8" width="15" height="9" fill="#5aa9e6" />
      <rect x="9" y="20" width="11" height="4" fill="#9fb0c0" stroke="#4a5a6a" />
      <rect x="10" y="19" width="18" height="9" rx="1" fill="#dfe6ee" stroke="#4a5a6a" />
      <rect x="12" y="21" width="14" height="5" fill="#b7c3d0" />
      <circle cx="24.5" cy="26" r="0.9" fill="#3a8a3a" />
    </svg>
  )
}

export function RecycleBinIcon({ size = 32, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <path d="M9 11h14l-1.5 16a2 2 0 0 1-2 1.8H12.5a2 2 0 0 1-2-1.8L9 11Z" fill="#8fd0f0" stroke="#2a5a7a" />
      <path d="M11 13l1 14M16 13v14M21 13l-1 14" stroke="#2a5a7a" strokeWidth="1" />
      <ellipse cx="16" cy="11" rx="7" ry="2.2" fill="#bfe6fa" stroke="#2a5a7a" />
      <path d="M12 8l1.5-2.5h5L20 8" fill="none" stroke="#2a5a7a" strokeWidth="1.4" />
    </svg>
  )
}

export function FolderIcon({ size = 32, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <path d="M3 8h9l2.5 3H29v16H3V8Z" fill="#f5c451" stroke="#b3860f" />
      <path d="M3 12h26v15H3z" fill="#ffd972" stroke="#b3860f" />
    </svg>
  )
}

export function DocIcon({ size = 32, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <path d="M8 3h12l6 6v20H8V3Z" fill="#fff" stroke="#7a7a7a" />
      <path d="M20 3v6h6" fill="#e6e6e6" stroke="#7a7a7a" />
      <path d="M11 14h12M11 18h12M11 22h9" stroke="#3a6ea5" strokeWidth="1.4" />
    </svg>
  )
}

export function NotepadIcon({ size = 32, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <rect x="6" y="3" width="20" height="26" fill="#fff" stroke="#6a6a6a" />
      <rect x="6" y="3" width="20" height="4" fill="#2a6fb0" />
      <path d="M10 12h12M10 16h12M10 20h12M10 24h8" stroke="#8a8a8a" strokeWidth="1.2" />
    </svg>
  )
}

export function PaintIcon({ size = 32, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <path d="M20 4c5 0 9 3.6 9 8 0 3-2.5 4.5-5 4.5h-2c-1.4 0-2.2 1.6-1.3 2.7.7.9.3 2.3-.9 2.6-1 .2-2 .3-2.9.3-5.5 0-10-3.6-10-9S12.5 4 20 4Z" fill="#f2f2f2" stroke="#6a6a6a" />
      <circle cx="12" cy="12" r="1.8" fill="#e63946" />
      <circle cx="18" cy="9" r="1.8" fill="#f4a300" />
      <circle cx="24" cy="12" r="1.8" fill="#2a9d8f" />
      <circle cx="13" cy="17" r="1.8" fill="#3a6ea5" />
      <rect x="4" y="22" width="4" height="8" rx="1" fill="#b3860f" />
      <path d="M4 22h4l-2-4-2 4Z" fill="#f5c451" />
    </svg>
  )
}

export function MineIcon({ size = 32, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <rect x="3" y="3" width="26" height="26" fill="#c0c0c0" stroke="#808080" />
      <circle cx="16" cy="16" r="7" fill="#111" />
      <path d="M16 6v20M6 16h20M9 9l14 14M23 9L9 23" stroke="#111" strokeWidth="1.6" />
      <circle cx="14" cy="14" r="2" fill="#fff" />
    </svg>
  )
}

export function PinballIcon({ size = 32, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <rect x="7" y="3" width="18" height="26" rx="3" fill="#1b2b57" stroke="#0a1636" />
      <circle cx="16" cy="10" r="3" fill="#f4a300" />
      <circle cx="11" cy="17" r="2" fill="#e63946" />
      <circle cx="21" cy="17" r="2" fill="#2a9d8f" />
      <circle cx="16" cy="24" r="2.4" fill="#d9d9d9" stroke="#fff" />
      <path d="M10 27l3-3M22 27l-3-3" stroke="#8fb3ff" strokeWidth="2" />
    </svg>
  )
}

export function AimIcon({ size = 32, className, style }: IconProps) {
  // Classic AIM "running man" homage in yellow.
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <circle cx="16" cy="16" r="14" fill="#f4c20d" stroke="#b38600" />
      <circle cx="17" cy="9" r="2.4" fill="#1a1a1a" />
      <path d="M9 20c3-1 4-4 6-4s2 2 4 2 3-1 4-2" fill="none" stroke="#1a1a1a" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M12 24l3-6 4 2 3 5" fill="none" stroke="#1a1a1a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DisplayIcon({ size = 32, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <rect x="3" y="5" width="26" height="18" rx="1" fill="#d9d9d9" stroke="#6a6a6a" />
      <rect x="5" y="7" width="22" height="13" fill="#3a8ed6" />
      <path d="M5 20l7-7 4 4 5-5 6 6v2H5v0Z" fill="#2a9d5a" />
      <circle cx="21" cy="11" r="2" fill="#ffe27a" />
      <rect x="11" y="23" width="10" height="3" fill="#b7b7b7" stroke="#6a6a6a" />
      <rect x="9" y="26" width="14" height="3" rx="1" fill="#cfcfcf" stroke="#6a6a6a" />
    </svg>
  )
}

export function StartFlagIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M3 5l8-1.4v7.4H3V5Z" fill="#f65314" />
      <path d="M12 3.4L21 2v9.4h-9V3.4Z" fill="#7cbb00" />
      <path d="M3 12.6h8V20L3 18.6v-6Z" fill="#00a1f1" />
      <path d="M12 12.6h9V22l-9-1.4v-8Z" fill="#ffbb00" />
    </svg>
  )
}
