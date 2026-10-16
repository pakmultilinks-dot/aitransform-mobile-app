# aiTransform Mobile App

Official iOS/Android mobile app for **aiTransform.com**, TechAbout LLC's one-stop AI SaaS platform ("One-Stop conversion to Artificial Intelligence"): AI text generation, AI image generation, AI code generation, AI chatbot, voiceover, speech-to-text, video, custom prompt templates, dashboard analytics, and subscription payments.

Built with Expo SDK 58, TypeScript, expo-router, and expo-secure-store. Light theme by default.

## Features

**Auth (secured)**
- Welcome, Login, Sign Up, Verify Email (6-digit code screen with 60s resend cooldown), Forgot Password / Reset
- Password rules: min 8 characters, strength meter on signup, show/hide toggle
- Session tokens stored only in expo-secure-store (never plain text, never logged)
- All auth documented as HTTPS-only

**Main tabs**
- Home/Dashboard: greeting, usage stat cards (words, images, chat sessions), word-limit progress, quick-action grid, recent activity
- AI Writer: prompt input, tone selector, result card with copy button
- AI Image: prompt input, style selector, aspect ratio, generated image display
- AI Chat: message bubbles, typing indicator, auto-scroll
- More: hub for AI Code, Voice Tools, Profile & Settings, Help, Logout

**Stack screens**
- AI Code: prompt input, language selector, monospace code output with copy
- Voice Tools: speech-to-text and AI voiceover cards (UI complete, engine stubbed)
- Profile: account info, subscription plan card, settings, logout, delete-account stub

## Mock mode

`src/api/client.ts` ships with `MOCK_MODE = true` (default). Every AI tool and dashboard call returns realistic simulated output after a short delay, so the entire app is demoable with zero API keys and no backend.

To go live: set `MOCK_MODE = false`, set `BASE_URL` to the real aiTransform backend, and implement each endpoint marked with a `TODO` comment in `src/api/client.ts`.

## Security notes

- Passwords: min 8 chars, strength meter (length, letter+number, symbol), show/hide toggle. Passwords are never logged and never stored in plain text; only opaque session tokens are persisted, inside expo-secure-store.
- Emails: signup triggers a 6-digit verification code flow with a 60-second resend cooldown; password reset is delivered via email with a code step.
- Transport: all API calls are HTTPS-only (`https://api.aitransform.com` placeholder).
- No real API keys, secrets, or credentials are included anywhere in this repo.

## Setup

```bash
npm install
npx expo start
```

Then open in Expo Go (scan the QR code), or press `i` / `a` for simulator/emulator. Typecheck with `npx tsc --noEmit`.

## Route map

| Route | Screen |
|---|---|
| `/` | Auth gate (redirects to Welcome or Home) |
| `/welcome` | Welcome / onboarding |
| `/login` | Login |
| `/signup` | Sign Up |
| `/verify-email` | 6-digit email verification |
| `/forgot-password` | Password reset via email |
| `/(tabs)` | Home Dashboard |
| `/(tabs)/writer` | AI Writer |
| `/(tabs)/image` | AI Image |
| `/(tabs)/chat` | AI Chat |
| `/(tabs)/more` | More hub |
| `/code` | AI Code generator |
| `/voice` | Voice tools (speech-to-text, voiceover) |
| `/profile` | Profile & settings |

## What is real vs stubbed

- Real: full navigation, auth UI flows, validation, secure token storage, dashboard UI, writer/image/chat/code UI flows, clipboard copy, tab bar.
- Mocked (MOCK_MODE): all API responses, including generated text, images (picsum placeholders), chat replies, code output, usage stats, activity feed.
- Stubbed: microphone capture for speech-to-text, audio playback for voiceover, subscription purchase/management, delete-account backend call, help-desk integration. Each is marked in code and surfaces an honest in-app note.

## Builds and store submission

EAS builds (`eas build`), EAS Submit, and App Store / Play Store submission require the owner's explicit approval and are intentionally not run in this delivery. The repo contains code only, verified by `npx tsc --noEmit` and `npx expo export`.
