/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              EVENT PASSPORT — THEME CONFIGURATION           ║
 * ║                                                              ║
 * ║  This is the only file you need to edit to brand the app    ║
 * ║  for your event. Colors, fonts, shadows — all here.         ║
 * ║                                                              ║
 * ║  After editing, restart the dev server: npm run dev         ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const theme = {

  // ─────────────────────────────────────────────────────────────
  // ACTIVE THEME
  // Switch between presets below or define your own.
  // Options: "red_team" | "blue_team" | "purple_team" | "custom"
  // ─────────────────────────────────────────────────────────────
  active: "custom",

  presets: {

    /**
     * RED TEAM — Offensive Security
     * Aggressive, high-contrast red on black.
     * CTFs, pentesting events, offensive security conferences.
     */
    red_team: {
      colors: {
        black:   "#0a0000",
        green:   "#ff2020",
        green2:  "#cc0000",
        red:     "#ff6600",
        yellow:  "#ff9900",
        gray:    "#1a0000",
        gray2:   "#2a0a0a",
        muted:   "#885555",
      },
      fonts: {
        mono: ['"Courier New"', "Courier", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      background: "#0a0000",
      text: "#ffffff",
      neonColor: "#ff2020",
      neonShadow: "0 0 10px #ff2020, 0 0 20px #ff202033",
      neonShadowSm: "0 0 6px #ff2020, 0 0 12px #ff202033",
    },

    /**
     * BLUE TEAM — Defensive Security
     * Trustworthy, calm blue on dark navy.
     * SOC events, defensive security, compliance conferences.
     */
    blue_team: {
      colors: {
        black:   "#00050f",
        green:   "#0ea5e9",
        green2:  "#0284c7",
        red:     "#ef4444",
        yellow:  "#38bdf8",
        gray:    "#0a1628",
        gray2:   "#0f2240",
        muted:   "#4a7a9b",
      },
      fonts: {
        mono: ['"JetBrains Mono"', '"Courier New"', "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      background: "#00050f",
      text: "#e0f2fe",
      neonColor: "#0ea5e9",
      neonShadow: "0 0 10px #0ea5e9, 0 0 20px #0ea5e933",
      neonShadowSm: "0 0 6px #0ea5e9, 0 0 12px #0ea5e933",
    },

    /**
     * PURPLE TEAM — Collaborative Security
     * Balance of offensive and defensive. Rich purple on dark.
     * Purple team exercises, security awareness, mixed events.
     */
    purple_team: {
      colors: {
        black:   "#07000f",
        green:   "#a855f7",
        green2:  "#7c3aed",
        red:     "#ec4899",
        yellow:  "#c084fc",
        gray:    "#120a1e",
        gray2:   "#1e0f30",
        muted:   "#7c5fa0",
      },
      fonts: {
        mono: ['"Share Tech Mono"', '"Courier New"', "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      background: "#07000f",
      text: "#f5f0ff",
      neonColor: "#a855f7",
      neonShadow: "0 0 10px #a855f7, 0 0 20px #a855f733",
      neonShadowSm: "0 0 6px #a855f7, 0 0 12px #a855f733",
    },

    /**
     * CUSTOM — Define your own colors
     * Copy any preset above and adjust the values.
     * Then set active: "custom" above.
     */
    custom: {
      colors: {
        black:   "#0a1a0a",   // Verde escuro profundo
        green:   "#009c3b",   // Verde Brasil
        green2:  "#007a2f",   // Verde Brasil hover
        red:     "#ffdf00",   // Amarelo Brasil
        yellow:  "#ffdf00",   // Amarelo Brasil
        gray:    "#0f2a1a",   // Card background
        gray2:   "#1a3d2a",   // Input/border background
        muted:   "#4a7a5a",   // Muted text
      },
      fonts: {
        mono: ['"Courier New"', "Courier", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      background: "#0a1a0a",
      text: "#ffffff",
      neonColor: "#009c3b",
      neonShadow: "0 0 10px #009c3b, 0 0 20px #009c3b33",
      neonShadowSm: "0 0 6px #009c3b, 0 0 12px #009c3b33",
    },
  },

};

// Export the active preset
export const activeTheme = theme.presets[theme.active];
export default theme;