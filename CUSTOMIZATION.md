# Customizing Event Passport for Your Event

This guide covers everything you need to brand the app for your event — colors, fonts, metadata, and translations.

---

## 1. Quick Start — Change the Theme

Open `frontend/theme.config.js` and change the `active` field:

```js
const theme = {
  active: "red_team",  // Change this
  ...
}
```

### Available Presets

| Theme | Description | Best for |
|---|---|---|
| `red_team` | Aggressive red on deep black | CTFs, pentesting events, offensive security |
| `blue_team` | Calm blue on dark navy | SOC events, defensive security, compliance |
| `purple_team` | Rich purple on dark | Purple team exercises, security awareness |
| `custom` | Your own colors — Brasil palette as base | Any event |

Restart the dev server after changing: `npm run dev`

> **Note:** Theme changes require a server restart — Tailwind generates CSS at build time, not at runtime.

---

## 2. Custom Colors

Set `active: "custom"` and edit the `custom` preset in `theme.config.js`:

```js
custom: {
  colors: {
    black:   "#0a1a0a",   // Main background
    green:   "#009c3b",   // Primary accent — buttons, borders, highlights
    green2:  "#007a2f",   // Primary accent hover state
    red:     "#ffdf00",   // Danger, errors, alerts
    yellow:  "#ffdf00",   // Secondary accent, highlights
    gray:    "#0f2a1a",   // Card and panel backgrounds
    gray2:   "#1a3d2a",   // Input backgrounds, borders
    muted:   "#4a7a5a",   // Muted/secondary text
  },
  background: "#0a1a0a",  // Body background color
	text: "#ffffff",         // Body text color
  neonColor: "#009c3b",    // Neon glow color (matches green usually)
  neonShadow: "0 0 10px #009c3b, 0 0 20px #009c3b33",
  neonShadowSm: "0 0 6px #009c3b, 0 0 12px #009c3b33",
}
```

### Tips

- `green` is the most important color — it's used for CTAs, active states, and accents throughout the app
- `neonShadow` — replace `#00FF41` with your primary color hex to keep the glow consistent
- For light themes, set `background: "#ffffff"` and `text: "#1a1a2e"`

---

## 3. Fonts

Edit the `fonts` section of your preset:

```js
fonts: {
  mono: ['"Your Mono Font"', 'monospace'],
  sans: ['Your Sans Font', 'system-ui', 'sans-serif'],
},
```

### Using Google Fonts

1. Pick a font at [fonts.google.com](https://fonts.google.com)
2. Add the import to `frontend/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

3. Add it to `theme.config.js`:

```js
mono: ['"Your Font"', 'monospace'],
```

### Recommended Font Pairings

| Style | Mono | Sans |
|---|---|---|
| Red Team | Courier New, Share Tech Mono | Inter |
| Blue Team | JetBrains Mono, Roboto Mono | Inter, DM Sans |
| Purple Team | Share Tech Mono, Fira Code | Outfit, Plus Jakarta Sans |
| Minimal | IBM Plex Mono | IBM Plex Sans |

---

## 4. Event Metadata (HTML)

Edit `frontend/index.html`:

```html
<meta name="theme-color" content="#1A1A1A" />   <!-- Browser bar color (mobile) -->
<meta name="description" content="Your Event — Digital Sponsor Engagement" />
<title>Passport · Your Event 2026</title>
```

Also update the CSP `connect-src` to your production API URL:

```html
connect-src 'self' https://your-api.up.railway.app;
```

---

## 5. Translations

All UI text is in `frontend/src/locales/`:

```
locales/
├── pt/translation.json   ← Portuguese
├── en/translation.json   ← English
└── es/translation.json   ← Spanish
```

Key fields to update in each file:

```json
{
  "app_name": "Your Event Passport",
  "landing": {
    "title": "Your Event 2026",
    "subtitle": "Your City",
    "date": "Jun 26-27, 2026",
    "venue": "Your Venue",
    "rgpd": "I agree that my data may be used by Your Event for event purposes."
  }
}
```

---

## 6. Environment Variables

Update `backend/.env` with your event details:

```env
EVENT_NAME="Your Event"
EVENT_EDITION="2026"
EVENT_CITY="Your City"
EVENT_DATE="Jun 26-27, 2026"
EVENT_VENUE="Your Venue"
EVENT_URL="https://yourevent.com"
```

See `backend/.env.example` for the full reference.

---

## 7. Adding a New Theme Preset

You can contribute your theme back to the community by adding it to `theme.config.js`:

```js
presets: {
  red_team:    { ... },
  blue_team:   { ... },
  purple_team: { ... },
  custom:      { ... },

  // Add yours here
  yourtheme: {
    colors: {
      black:  "#...",
      green:  "#...",
      green2: "#...",
      red:    "#...",
      yellow: "#...",
      gray:   "#...",
      gray2:  "#...",
      muted:  "#...",
    },
    fonts: { ... },
    background: "#...",
    text: "#...",
    neonColor: "#...",
    neonShadow: "...",
    neonShadowSm: "...",
  },
}
```

Then open a PR — themes contributed by the community will be included in future releases.

---

## 8. Checklist Before Your Event

- [ ] Set `active` theme in `frontend/theme.config.js`
- [ ] Update colors and fonts if using `custom`
- [ ] Update `frontend/index.html` — title, description, theme-color, CSP
- [ ] Update translations in all 3 locale files (`pt`, `en`, `es`)
- [ ] Update `backend/.env` with event details
- [ ] Create staff account via `POST /api/auth/staff/create`
- [ ] Add sponsors via admin panel
- [ ] Test full attendee flow locally (register → scan → qualify)
- [ ] Test on mobile (PWA install prompt)
- [ ] Deploy and set production env vars