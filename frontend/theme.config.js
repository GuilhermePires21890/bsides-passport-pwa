/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              EVENT PASSPORT — THEME CONFIGURATION           ║
 * ║                                                              ║
 * ║  This is the only file you need to edit to brand the app    ║
 * ║  for your event. Colors, fonts, shadows — all here.         ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * After editing, restart the dev server: npm run dev
 */

const theme = {

  // ─────────────────────────────────────────────────────────────
  // ACTIVE THEME
  // Switch between presets below or define your own.
  // Options: "hacker" | "corporate" | "cyberpunk" | "custom"
  // ─────────────────────────────────────────────────────────────
  active: "custom",

  // ─────────────────────────────────────────────────────────────
  // PRESETS
  // ─────────────────────────────────────────────────────────────
  presets: {

    /**
     * HACKER — Default dark terminal aesthetic
     * Green on black. Matrix vibes. Great for security events.
     */
    hacker: {
      colors: {
        black:   "#000000",
        green:   "#00FF41",
        green2:  "#00CC33",
        red:     "#FF4500",
        yellow:  "#FFD700",
        gray:    "#1A1A1A",
        gray2:   "#2A2A2A",
        muted:   "#888888",
      },
      fonts: {
        mono: ['"Courier New"', "Courier", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      background: "#000000",
      text: "#ffffff",
      neonColor: "#00FF41",
      neonShadow: "0 0 10px #00FF41, 0 0 20px #00FF4133",
      neonShadowSm: "0 0 6px #00FF41, 0 0 12px #00FF4133",
    },

    /**
     * CORPORATE — Clean light theme
     * Blue on white. Professional look for enterprise events.
     */
    corporate: {
      colors: {
        black:   "#1a1a2e",
        green:   "#2563eb",
        green2:  "#1d4ed8",
        red:     "#dc2626",
        yellow:  "#f59e0b",
        gray:    "#f1f5f9",
        gray2:   "#e2e8f0",
        muted:   "#64748b",
      },
      fonts: {
        mono: ['"Roboto Mono"', "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      background: "#ffffff",
      text: "#1a1a2e",
      neonColor: "#2563eb",
      neonShadow: "0 0 10px #2563eb33, 0 0 20px #2563eb22",
      neonShadowSm: "0 0 6px #2563eb33, 0 0 12px #2563eb22",
    },

    /**
     * CYBERPUNK — High contrast purple/pink neon
     * Bold and vibrant. Great for tech festivals and gaming events.
     */
    cyberpunk: {
      colors: {
        black:   "#0d0d0d",
        green:   "#d946ef",
        green2:  "#a21caf",
        red:     "#f43f5e",
        yellow:  "#fa9b15",
        gray:    "#18181b",
        gray2:   "#27272a",
        muted:   "#71717a",
      },
      fonts: {
        mono: ['"Share Tech Mono"', "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      background: "#0d0d0d",
      text: "#ffffff",
      neonColor: "#d946ef",
      neonShadow: "0 0 10px #d946ef, 0 0 20px #d946ef33",
      neonShadowSm: "0 0 6px #d946ef, 0 0 12px #d946ef33",
    },

    /**
     * CUSTOM — Define your own colors
     * Copy any preset above and change the values.
     * Then set active: "custom" above.
     */
    custom: {
      colors: {
        black:   "#000000",   // Main background
        green:   "#00FF41",   // Primary accent / CTA buttons
        green2:  "#00CC33",   // Primary accent hover
        red:     "#FF4500",   // Danger / alerts
        yellow:  "#FFD700",   // Secondary accent / highlights
        gray:    "#1A1A1A",   // Card backgrounds
        gray2:   "#2A2A2A",   // Input backgrounds / borders
        muted:   "#888888",   // Muted text
      },
      fonts: {
        mono: ['"Courier New"', "Courier", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      background: "#000000",  // Body background
      text: "#ffffff",         // Body text
      neonColor: "#00FF41",    // Neon glow color
      neonShadow: "0 0 10px #00FF41, 0 0 20px #00FF4133",
      neonShadowSm: "0 0 6px #00FF41, 0 0 12px #00FF4133",
    },
  },

};

// Export the active preset
export const activeTheme = theme.presets[theme.active];
export default theme;
