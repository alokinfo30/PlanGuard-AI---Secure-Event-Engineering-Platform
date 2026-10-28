# PlanGuard AI — Secure Event Engineering & GenAI Planning Platform

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google GenAI SDK](https://img.shields.io/badge/Google_GenAI-Gemini_3.8_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple)](https://web.dev/progressive-web-apps/)

**PlanGuard AI** is a production-grade, zero-trust event engineering and planning platform. Designed for weddings, milestone birthdays, community festivals, and corporate galas, PlanGuard combines hardened server-side GenAI orchestration with automated mathematical financial modeling, vendor lifecycle tracking, venue layout planning, and an interactive security testing suite.

---

## 🌟 Key Features

### 1. 🤖 GenAI Planning Studio (`GenAIAssistantModule`)
- **Automated Event Concept Engineering**: Generates cohesive, bespoke event concepts tailored to guest count, budget, and vibe (Weddings, Birthdays, Community Events, Galas).
- **Harmonized Color Palette**: Proposes hex swatches with specific decor/attire assignments (Dominant, Secondary, Accent, Neutral).
- **Curated Culinary & Cocktail Program**: Generates custom multi-course food and signature drink pairings with dietary markers (Vegan, GF, Halal, Kosher).
- **4-Phase Signature Guest Journey**: Timed sequencing from Arrival & Welcome to Main Program, Peak Highlight, and Farewell Favors.
- **Bespoke Decor & Spatial Styling**: Actionable ideas for entryways, focal stages, and lounge corners with practical DIY vs. Rental cost-saving tips.
- **One-Click Event Adoption**: Instantly commits the AI-generated master plan, budget categories, and vendor tasks to the secure database.
- **Interactive AI Event Strategist**: Conversational copilot backed by Gemini 3.8 Flash with prompt hardening, XML context bounding, and instant inquiry chips.

### 2. 💰 Mathematical Financial & Budget Engine (`FinancialModule`)
- **Interactive Recharts Visualizations**: Responsive Pie Chart and Category Breakdown Bar Charts displaying real-time budget distribution.
- **Automated 110% Overrun Alert System**: Automatically flags any vendor quote or category spend exceeding 110% of its initial allocation with color-coded warning badges and toast notifications.
- **Dynamic Contingency Auto-Distribution**: Modifying any category allocation automatically recalculates and proportionally redistributes the remaining contingency budget across active categories.
- **Cost-Per-Guest Analysis & Variance Metrics**: Real-time KPI cards tracking total committed spend, projected surplus/deficit, and cost efficiency.
- **Bespoke Category Manager**: Granular controls for Venue, Catering, AV & Tech, Security, Decor, Photography, Entertainment, and Contingency.

### 3. ✅ Vendor Checklist & Lifecycle Tracker (`VendorChecklistModule`)
- **4-Stage Vendor Pipeline**: Interactive lifecycle progression: `Pending Approval` ➔ `Contacted` ➔ `Contract Signed` ➔ `Deposit Paid`.
- **Budget Variance Flags**: Real-time detection of quotes exceeding allocated funds with instant visual warning badges.
- **Granular Task Management**: Add, update, or remove custom vendor deliverables, contact points, and due dates.
- **Multi-Tenant Database Persistence**: Server-backed synchronization ensuring all status updates persist across sessions.

### 4. ⏱️ Automated Milestone & Timeline Engine (`TimelineVendorModule`)
- **Countdown Sequencing**: T-minus milestone scheduling (from T-6 months down to Day-of-Event hour-by-hour run of show).
- **Critical Path Highlighting**: Identifies high-risk dependencies across venue permits, catering tastings, and AV load-in.
- **Real-Time Task Checkoffs**: Dynamic completion progress meters and timeline filters.

### 5. 🗺️ Interactive Venue Spatial Planner (`VenueMapModule`)
- **2D Interactive Grid**: Visual floor planner for stages, banquet tables, bars, entrance foyers, and photo zones.
- **Capacity & Safety Compliance**: Calculates guest density limits and ensures emergency exit egress pathway clearance.
- **Zone Metrics**: Displays square footage allocation and seating calculations per zone.

### 6. 🛡️ Enterprise Security & Bot Defense (`ArchitectureBlueprintModule` & `TestMatrixModule`)
- **Mid-Tier Gateway Architecture (Phase 1.1)**: Zero client-side API keys. The browser communicates strictly with the Node.js/Express proxy (`/api/*`).
- **WAF & Payload Guard (Phase 1.2)**: 64kb request payload limits, regex inspection blocking known prompt injection vectors, and Unicode obfuscation detectors.
- **Token Bucket Rate Limiting**: Maximum 5 AI requests per minute per IP/User to prevent brute-force attacks and denial-of-wallet.
- **Zero-Trust Multi-Tenant Isolation (Phase 1.3)**: Row-Level Security (RLS) simulation ensuring queries isolate event data strictly by authenticated `userId`.
- **Structural Prompt Hardening (Phase 2.1 & 2.2)**: System prompts bounded by XML delimiters (`<SECURE_SYSTEM_CONTEXT>`, `<USER_DATA>`), preventing prompt jailbreaks (DAN, role reversal).
- **Strict Safety Thresholds**: Google GenAI filters configured to block dangerous content, harassment, hate speech, and sexually explicit payloads.
- **Interactive Test Matrix**: In-browser security suite allowing live testing of prompt injections, payload smuggling, and WAF defenses with instant audit logs.

### 7. 📱 Progressive Web App (PWA) & Mobile Add-to-Home
- **Installable Native Experience**: Complete Web App Manifest with icons (192px, 512px, maskable) and standalone display configuration.
- **In-App PWA Installation Prompt (`PWAInstallModal`)**: Detects `beforeinstallprompt` event and offers a 1-click install banner.
- **Offline Workbox Caching**: Assets and core styles pre-cached for resilient offline operation.
- **Mobile-Optimized Navigation**: Responsive bottom navigation bar with touch targets, haptic feedback styling, and mobile quick-actions.

### 8. 🌐 Multi-Platform Social Sharing (`ShareModal`)
- **Direct 1-Click Sharing**: Share event plans and invitations directly to:
  - **WhatsApp** (pre-filled invitation text with URL)
  - **Facebook** (social feed dialog)
  - **Instagram** (copy caption & story link asset flow)
  - **X (Twitter)** (formatted tweet with hashtags)
  - **LinkedIn** (professional networking share)
  - **Telegram** (group & channel messaging)
  - **Native Web Share API**: Utilizes device OS sharing sheets on iOS and Android.

### 9. ♿ Comprehensive Accessibility Suite (`AccessibilityModal`)
- **High-Contrast Theme**: Meets WCAG AAA color contrast guidelines.
- **Dyslexia-Friendly Typography**: Enables high-legibility OpenDyslexic-style font spacing.
- **Text Scaling**: On-the-fly UI zoom controls (100%, 115%, 130%, 150%).
- **Reduced Motion Support**: Respects system preferences and allows disabling CSS transitions/animations.
- **Keyboard Navigation**: Full keyboard navigation across all modules with numeric shortcuts (`1` to `7`).
- **Screen Reader Compliance**: Semantic HTML5 landmarks, ARIA labels, live announcement regions, and visible focus rings.

### 10. 🔄 Real-Time Remote Sync & Data Portability
- **Header Sync Indicator**: Displays live synchronization status (`Synced Just Now`, `Syncing...`, or `Offline (Cached)`) with exact timestamp.
- **Export Data Suite (`ExportDataModal`)**: Export complete event blueprints, budgets, and vendor checklists as formatted JSON or CSV files.
- **Google OAuth Integration (`GoogleAuthModal`)**: Seamless account switching with pre-configured verified test profiles (`alokinfo.proict@gmail.com`, `alokinfo30@gmail.com`) and role-based permissions.

---

## 🏗️ Architecture Overview

```
                                  +------------------------------------+
                                  |         Client Browser / PWA       |
                                  |  (React 19 + Vite 8 + TailwindCSS) |
                                  +-----------------+------------------+
                                                    |
                                    HTTPS / Bearer Auth Tokens
                                                    |
                                                    v
                                  +-----------------+------------------+
                                  |     Express Mid-Tier Gateway       |
                                  |    (server.ts running on :3000)    |
                                  +-----------------+------------------+
                                                    |
                   +--------------------------------+--------------------------------+
                   |                                |                                |
                   v                                v                                v
     +-------------+-------------+    +-------------+-------------+    +-------------+-------------+
     |   WAF & Security Layer    |    |  Multi-Tenant RLS Store   |    | Structural Prompt Isolator|
     | - Rate Limiter (5 req/m)  |    | - Row-Level Isolation     |    | - XML Context Bounding    |
     | - 64kb Payload Cap        |    | - User-scoped Queries     |    | - Extreme Safety Settings |
     | - Injection Regex Intercept|   | - Sync Timestamp Engine   |    | - Safe JSON Output Schema |
     +---------------------------+    +---------------------------+    +-------------+-------------+
                                                                                     |
                                                                                     v
                                                                       +-------------+-------------+
                                                                       | Google GenAI Gemini API   |
                                                                       |   (Gemini 3.8 Flash SDK)  |
                                                                       +---------------------------+
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20 or higher
- **npm** or **bun**
- **Google Gemini API Key**: Stored securely as an environment variable

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
GEMINI_API_KEY="your_actual_gemini_api_key"
APP_URL="http://localhost:3000"
```

### Installation & Development
```bash
# Install dependencies
npm install

# Start full-stack development server (Express Gateway + Vite Middleware)
npm run dev

# App runs locally at http://localhost:3000
```

### Building for Production
```bash
# Compile TypeScript & bundle frontend assets
npm run build

# Start production server
npm start
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Destination / Action |
|:---:|:---|
| `1` | Switch to **GenAI Planning Studio** |
| `2` | Switch to **Financial & Budget Engine** |
| `3` | Switch to **Vendor Checklist Tracker** |
| `4` | Switch to **Timeline & Milestones** |
| `5` | Switch to **Venue Layout Planner** |
| `6` | Switch to **Security Test Matrix** |
| `7` | Switch to **Architecture Blueprint** |
| `Ctrl / ⌘ + K` | Focus Global Command / Search |
| `Alt + A` | Open Accessibility Preferences |

---

## 🔒 Security Best Practices Implemented
1. **Zero Client Secrets**: Gemini API keys never reach browser bundles.
2. **Defensive Prompt Engineering**: Immutable boundaries enforce AI persona separation from untrusted user parameters.
3. **Automated Budget Guard**: Mathematical variance tracking eliminates financial blind spots.
4. **Resilient HMR Fallbacks**: Vite development environment properly handles sandboxed iframe execution with WebSocket mock interceptors.

---

## 📄 License
PlanGuard AI is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
