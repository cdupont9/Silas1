// Shared theming for the early-2000s Windows takeover.
// Two eras are supported: Windows XP (silver-blue Luna) and Windows 2000 (gray 3D).

export type RetroEra = "xp" | "win2000"

export interface RetroTheme {
  era: RetroEra
  desktopFallback: string // solid color behind the wallpaper image
  // Title bar
  titleBarActive: string
  titleBarInactive: string
  titleText: string
  // Window body / chrome
  windowBg: string
  windowBorder: string
  faceLight: string // raised bevel light edge
  faceDark: string // raised bevel dark edge
  // Taskbar
  taskbar: string
  taskbarBorder: string
  startButton: string
  startButtonText: string
  // Accents
  accent: string
  fontFamily: string
}

export const RETRO_THEMES: Record<RetroEra, RetroTheme> = {
  xp: {
    era: "xp",
    desktopFallback: "#5a8ed6",
    titleBarActive: "linear-gradient(180deg,#0058ee 0%,#3d8bff 8%,#0054e6 40%,#0054e6 88%,#004ad9 100%)",
    titleBarInactive: "linear-gradient(180deg,#7ba3e8 0%,#94b5ee 8%,#7ba0e6 40%,#7ba0e6 100%)",
    titleText: "#ffffff",
    windowBg: "#ece9d8",
    windowBorder: "#0054e6",
    faceLight: "#ffffff",
    faceDark: "#808080",
    taskbar: "linear-gradient(180deg,#3f8cf3 0%,#2a6fdb 4%,#2560d3 94%,#1941a5 100%)",
    taskbarBorder: "#1941a5",
    startButton: "linear-gradient(180deg,#59b64a 0%,#3f9c33 50%,#358a2b 100%)",
    startButtonText: "#ffffff",
    accent: "#316ac5",
    fontFamily: "Tahoma, 'Segoe UI', Geneva, sans-serif",
  },
  win2000: {
    era: "win2000",
    desktopFallback: "#3a7a7a",
    titleBarActive: "linear-gradient(90deg,#0a246a 0%,#3a6ea5 60%,#a6caf0 100%)",
    titleBarInactive: "linear-gradient(90deg,#808080 0%,#b5b5b5 60%,#d4d0c8 100%)",
    titleText: "#ffffff",
    windowBg: "#d4d0c8",
    windowBorder: "#404040",
    faceLight: "#ffffff",
    faceDark: "#808080",
    taskbar: "#d4d0c8",
    taskbarBorder: "#ffffff",
    startButton: "#d4d0c8",
    startButtonText: "#000000",
    accent: "#0a246a",
    fontFamily: "Tahoma, 'MS Sans Serif', Geneva, sans-serif",
  },
}

// A raised 3D bevel used all over classic Windows (buttons, panels).
export function raisedBevel(t: RetroTheme): React.CSSProperties {
  return {
    borderTop: `2px solid ${t.faceLight}`,
    borderLeft: `2px solid ${t.faceLight}`,
    borderRight: `2px solid ${t.faceDark}`,
    borderBottom: `2px solid ${t.faceDark}`,
    background: t.windowBg,
  }
}

// A sunken 3D bevel used for input fields and content wells.
export function sunkenBevel(t: RetroTheme): React.CSSProperties {
  return {
    borderTop: `2px solid ${t.faceDark}`,
    borderLeft: `2px solid ${t.faceDark}`,
    borderRight: `2px solid ${t.faceLight}`,
    borderBottom: `2px solid ${t.faceLight}`,
    background: "#ffffff",
  }
}
