TrustScore AI — Complete Agent Brief 
Table of Contents
Project Overview
What It Does
How It Was Built
Challenges
Accomplishments
What Was Learned
What's Next
Tech Stack
Setup & Installation (Added)
Database Schema (Supabase)
Color Palette (Strict Enforcement)
TrustScore Calculation (Critical)
UI/UX Requirements
File & Folder Map
Final Checklist
Additional Instructions for the AI Agent
Investor Access Request Flow — Two Versions in Source (Flag)
Investor Profile Data Model
Founder Input Fields
Data Sync Requirement: Founder Edits → Optimistic UI → Supabase → Realtime
Authentication
Component Library Clarification: Radix UI, Not Base UI (Added)

1. Project Overview
Inspiration
TrustScore AI was inspired by a persistent problem in entrepreneurial ecosystems: many early-stage startups are not rejected because they lack potential, but because they lack verifiable credibility. Founders often make claims about their product, market, traction, team, revenue, partnerships, or technology — but these claims remain scattered across pitch decks, forms, documents, conversations, and mentor feedback. Investors, incubators, banks, government agencies, and other ecosystem stakeholders then repeat the same due-diligence process independently.
This creates friction on both sides:
Startups spend valuable time repeatedly proving themselves.
Investors and institutions spend time validating basic information again and again.
The problem is sharper for non-incubated, first-generation, regional, student-led, and early-stage founders who may not yet have strong institutional backing or visible reputation.
Core question the project was built around:
Can AI convert fragmented startup evidence into structured, explainable, and investor-ready trust signals?

2. What It Does
TrustScore AI is an AI-powered startup validation and fundraising platform. It helps founders create a structured Startup Trust Profile by uploading their pitch deck, business description, traction details, financial information, founder profile, customer evidence, market assumptions, and other supporting documents.
The platform uses AI to:
Extract key startup information from uploaded documents.
Identify missing or weak evidence.
Assess startup readiness across dimensions: team, market, traction, product, financial clarity, compliance, and fundraising preparedness.
Generate an explainable TrustScore.
Create an investor-readiness report.
Recommend improvement actions for founders.
Help investors, mentors, incubators, and ecosystem stakeholders review startups more efficiently.
Important framing: the goal is not to replace investor judgment. TrustScore AI acts as a pre-due-diligence layer that organizes startup evidence, reduces information asymmetry, and helps founders become better prepared before approaching funders.

3. How It Was Built
TrustScore AI is designed as an AI-native workflow, not a traditional static startup database. It is built around four core layers:
Startup Intake Layer — collects structured and unstructured information from founders: business details, team information, documents, traction indicators, financial signals, market information, and fundraising needs.
AI Analysis Layer — uses Gemini to read, summarize, classify, and extract relevant signals from startup documents and founder inputs. Gemini converts unstructured material into structured venture intelligence by identifying what is present, what is missing, and what needs validation.
TrustScore Engine — organizes these signals into an explainable scoring framework. The score is not a black-box investment recommendation; it is a readiness and credibility indicator based on visible evidence, data completeness, claim consistency, traction signals, and stakeholder validation.
Reporting & Decision-Support Layer — generates founder-facing and investor-facing outputs. Founders receive an improvement roadmap; investors and mentors receive a concise startup validation summary with strengths, gaps, risks, and suggested follow-up questions.
Simplified workflow formula:
Startup Evidence + AI Analysis + Stakeholder Validation = TrustScore

4. Challenges
Structuring qualitative information. Startups are not uniform — a deeptech startup, a student-led startup, a social enterprise, and a digital platform business cannot be judged using the same narrow template.
Avoiding overclaiming. A TrustScore should never be presented as a final valuation, investment recommendation, or guarantee of success. It was designed as a validation/readiness signal, not a substitute for human due diligence.
Evidence quality. A founder may upload a pitch deck with strong claims but weak proof. The AI system needed to distinguish between claims, evidence, assumptions, and validated signals.
Multi-stakeholder complexity. Founders need guidance, investors need clarity, mentors need diagnostic information, incubators need portfolio-level visibility — all without the product becoming too complex for an MVP.

5. Accomplishments
Converted a research-backed idea into a usable AI product for startup ecosystems, rather than building "another pitch-deck generator" — the focus is trust, validation, and fundraising readiness.
Built an explainable approach to scoring: founders can see why their score is low or high, what evidence is missing, and what to do next. This makes the platform developmental rather than judgmental.
Potential for inclusivity: helps founders without access to elite networks, reputed incubators, or warm investor introductions build credibility through organized evidence.
Creates value on both sides of the ecosystem — founders get readiness support, investors/institutions get cleaner, faster, structured startup intelligence.

6. What Was Learned
Startup evaluation is not only a financial problem — it is also a trust, communication, documentation, and ecosystem-coordination problem.
AI is most useful when it doesn't simply generate text but helps structure decisions. Gemini's ability to read documents, extract signals, summarize evidence, identify gaps, and generate contextual recommendations enabled a more intelligent validation workflow.
Scoring must be transparent. Founders trust the system more when they can see the reasons behind the score; investors are more likely to use the output when they can inspect the evidence behind each signal.
AI can become a bridge between informal trust and formal due diligence — in strong business communities, trust travels through networks; TrustScore AI attempts to create a digital version of that trust layer.

7. What's Next
Pilot TrustScore AI with startups, incubators, mentors, and early-stage investors; refine the scoring framework using real startup profiles and stakeholder feedback.
Role-specific dashboards for founders, investors, incubators, and ecosystem administrators:
Founders → fundraising-readiness guidance.
Investors → ranked, explainable startup summaries.
Incubators → portfolio readiness assessment and improvement tracking over time.
Future versions will include: stronger document verification, stakeholder endorsements, sector-specific scoring models, investor-startup matching, and longitudinal tracking of startup progress.
Long-term vision: a trusted intelligence layer for entrepreneurial ecosystems — where startups build credibility, investors reduce due-diligence friction, and institutions support ventures with greater transparency, speed, and confidence.

8. Tech Stack
Layer
Technology
Framework
Next.js 16 (next:16:2:10)
Authentication
Supabase Auth (Google OAuth, email/password)
Database
Supabase PostgreSQL
Icons
React Icons (Font Awesome, Feather, Heroicons)
Animation
Framer Motion
State Management
React hooks with Supabase realtime subscriptions
Data Visualization
Custom charts using SVG and CSS

Platform Surface Area
The platform includes:
Public-facing pages: about, how it works, contact, demo, directory, individual startup pages.
Authentication: Google OAuth, email/password, reset password.
Dashboard for founders: manage startup profile, access requests.
Dashboard for investors: browse startups, request access, portfolio.
Admin panel: user management, review queue, NDA audit.
TrustScore calculation based on multiple data points across public, gated, and NDA-protected tiers.
Light-mode only UI with a specific brand color palette (navy-to-teal shield, forest-to-mint checkmark gradient).
Integration with Supabase for data storage and authentication.

8A. Setup & Installation (Added)
> This subsection did not exist in the original source brief. It is added here purely for onboarding convenience, based on what was actually run to stand up this project. It does not change any tech stack decision, weighting, or design rule above — see Section 8 for the authoritative stack list.

Minimum requirements:
- Node.js 20.9 or later (required by Next.js 16).

Scaffold (run inside the project root, after moving any pre-existing files like public/images/, .env.local, and claude.md out of the way temporarily if the directory isn't empty):
```
npx create-next-app@latest .
```
Recommended prompt answers: TypeScript — Yes, Tailwind CSS — Yes, ESLint — Yes, App Router — Yes, src/ directory — No (routes live in app/ at root per Section 13), import alias — @/*.

Install the remaining stack named in Section 8:
```
npm install @supabase/supabase-js @supabase/ssr
npm install react-icons
npm install framer-motion
```

Initialize shadcn/ui explicitly on Radix UI (see Section 21 — as of the current shadcn CLI, Base UI is the new default, and must be overridden):
```
npx shadcn init -b radix
```
When prompted for a visual preset (Vega, Nova, Maia, Lyra, Mira, Luma, Sera, Rhea, Custom), any is acceptable as a starting point since all components get restyled to the project's exact color tokens per Section 12 — Vega (the classic/least-opinionated shadcn look) is the easiest base to restyle from if no preference exists.

Environment variables — create .env.local (never commit this file):
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Verify the app boots:
```
npm run dev
```

9. Database Schema (Supabase)
Core Tables
Table
Purpose
companies
Public/self-reported startup profiles
profiles
User accounts and roles
investor_profiles
Investor accounts
startup_gated_data
Request-access tier data (founding team, angel/VC investors, gov funding, revenue, PAT, employee compensation, investor count)
startup_nda_data
NDA-only tier data (IP/trademark counts, patents, trade secrets, latest round, total investment, loans, assets, financing agencies, competitors)
vouches
Investor endorsements/backings of startups
access_requests
Investor requests for gated-tier data access
nda_documents
NDA signing/verification records

TrustScore Engine Tables
Table
Purpose
trust_score_confidence_levels
Lookup table for the five confidence tiers
trust_score_category_weights
Lookup table for the six scoring categories
trust_score_components
Per-startup, per-category raw scores, tagged with source tier
trust_score_calculated
View that computes the final weighted score per startup

Trigger: a trigger on trust_score_components keeps companies.trust_score in sync automatically.

10. Color Palette (Strict Enforcement)
Apply consistently across the entire UI. This palette lives canonically in docs/DESIGN.md.
Purpose
Color Codes
What Changed & Why
Primary Gradient
#0A2E4D → #155E85 → #2E93B8 (135°)
Deepened and slightly more saturated than the original — reads as ink/navy rather than generic "SaaS blue," more premium and less templated
Success Gradient
#0F6E52 → #1E9C74 → #4FC79A (135°)
Shifted from stock Tailwind emerald to a jade/viridian family — still clearly reads "verified/growth," but isn't the exact default green every AI tool ships with
Verification Gold (new)
#B8873D → #D9A44E (135°)
Signature accent — reserve exclusively for the highest trust tier (investor-backed badge, a fully-verified score ring, the trust seal icon). The one bold, memorable moment on the page; overusing it anywhere else dilutes the meaning
Chart Blues
#12395A, #1E6488, #3390B6
Same 3-step monochrome ramp concept, recalculated off the new deeper primary so charts stay visually tied to the brand gradient
Network Decorative
Line: #C7D6E0 (25–35% opacity), Dot: #9FB7C4
Slightly cooler/more muted than before, keeps ambient background elements quiet
Base Background
#FCFDFF
Unchanged — near-white is the right neutral choice, not a "generic" problem to fix
Primary Text
#0A0F16
Barely shifted from pure black, now carries a whisper of navy — ties text color subtly back to the brand hue instead of true neutral black
Secondary Text
#8B98A9
Slightly warmer/more muted than exact Tailwind slate-400, so it doesn't read as "copy-pasted from a Tailwind default palette"
Borders
#E1E7ED
Marginal adjustment, stays neutral and unobtrusive
Card Background
#F7F9FC
Marginal adjustment, keeps card/background contrast subtle
Success
#0F9D6C / #0B7A54
Recalculated to match the new jade success gradient instead of stock emerald
Error
#E5484D / #C93A3E
Slightly desaturated from stock Tailwind red — still unmistakably "error," less flatly default
Warning
#C88A17
Deepened from a plain amber, feels more intentional next to the gold accent rather than competing with it

Gold Usage Rule (Important)
Spend the Verification Gold deliberately, in exactly three places:
The "investor-backed" tier badge.
The outer ring of a TrustScore gauge-equivalent display when it crosses the highest confidence threshold.
Maybe a single accent line in the final CTA section.
Nowhere else. That restraint is what makes it feel like a signature rather than decoration.
Note: color palette is intentionally not duplicated inside the "Additional Instructions for the AI Agent" section of the source document — it's maintained separately in docs/DESIGN.md as the single source of truth. This section here is the full reference.

11. TrustScore Calculation (Critical)
TrustScore is the core feature of the platform. It is a composite score (0–100) computed from three data tiers, plus a companion Confidence Index that tells the reader how much to trust that score. The logic resides in lib/trustScore.ts (see also the file-map note in Section 13 about lib/trustscore/calculator.ts being the confirmed single source of truth). Both numbers are displayed prominently on startup cards, detail pages, and in the dashboard.
11.1 Data Sources & Confidence Multipliers
Each data source carries a confidence multiplier, since not all data is equally trustworthy just because it's present:
Source
Confidence (C)
Public / self-reported
0.40
Gated (AI-extracted / provided on request)
0.65
Gated + document-verified
0.85
NDA data
0.95
NDA data + third-party/investor-confirmed
1.00

Where the data physically lives:
Public data (companies): foundational metrics, self-reported or platform-visible. Lowest confidence.
Gated data (startup_gated_data): provided upon request, adds depth. Medium confidence.
NDA data (startup_nda_data): confidential, used only for scoring; never displayed to investors. Highest confidence — typically backed by documents.
11.2 Weighting Scheme
Category weights are unchanged from the original design — they reflect the importance of each category, defined in the WEIGHTS object inside lib/trustScore.ts, and remain configurable via environment variables or a settings table:
Category
Weight
Company Foundation (age, sector, city, etc.)
20%
Team & Leadership (founding_team, incubator)
15%
Funding & Investment (total_investment, latest_round, loans)
20%
Financial Performance (revenue, profit, assets)
20%
Intellectual Property (patents, trademarks)
10%
Investor Confidence (investor count, quality of investors)
15%

⚠️ Do not change the underlying formula or weighting scheme. These weights are locked.
11.3 Normalization
Each metric is normalized to a 0–1 scale using three methods (unchanged from the original):
Threshold-based scoring — e.g., revenue ≥ 100M → 1.0, revenue ≤ 0 → 0, linear interpolation in between.
Rank-based scoring — for metrics like number of investors, where relative ranking matters.
Boolean scoring — for presence of incubator/accelerator, government funding.
Two additions on top of the original:
Freshness decay — each metric's contribution decays with age, since this platform tracks diligence in real time rather than as a one-time snapshot:
 F = max(0.5, e^(-0.01 × days_since_verified))
A metric verified 90 days ago contributes ~60% as much as one verified today; nothing decays below a 50% floor, since old-but-still-valid facts (a patent, a founding date) shouldn't collapse to zero.
Per-metric contribution cap — no single metric may contribute more than 15% of its category's total score, preventing one inflated or gamed field from dominating.
Missing data handling: instead of simply redistributing raw weight, missing-data weight is redistributed proportional to confidence and freshness, so a category propped up only by low-confidence public data doesn't get scored as if it were fully verified (see Algorithm Outline below).
11.4 Algorithm Outline
typescript
function calculateTrustScore(
  company: Company,
  gated: GatedData,
  nda: NdaData
): { score: number; confidence: number } {

  let weightedScore = 0;
  let weightedConfidence = 0;
  let totalPossibleWeight = 0;

  function scoreMetric(
    rawValue: unknown,
    normalizeFn: (v: unknown) => number,
    weight: number,
    confidence: number,
    verifiedAt: Date | null
  ) {
    totalPossibleWeight += weight;
    if (rawValue === null || rawValue === undefined) return;

    const normalized = clamp(normalizeFn(rawValue), 0, 1);
    const freshness = verifiedAt
      ? Math.max(0.5, Math.exp(-0.01 * daysSince(verifiedAt)))
      : 0.75; // default freshness if no timestamp tracked yet

    const effectiveWeight = weight * confidence * freshness;
    weightedScore += normalized * effectiveWeight;
    weightedConfidence += effectiveWeight;
  }

  // 1. Company Foundation (20%)
  scoreMetric(company.age, normalizeAge, 0.05, 0.40, null);
  scoreMetric(company.city, normalizeCity, 0.05, 0.40, null);
  scoreMetric(company.sectors, normalizeSector, 0.05, 0.40, null);
  scoreMetric(company.description, normalizeDescriptionQuality, 0.05, 0.40, null);

  // 2. Team & Leadership (15%)
  scoreMetric(gated.founding_team, normalizeFoundingTeam, 0.07, 0.65, gated.updated_at);
  scoreMetric([company.incubator, company.accelerator], hasIncubatorAccelerator, 0.08, 0.65, null);

  // 3. Funding & Investment (20%)
  scoreMetric(nda.total_investment, normalizeTotalInvestment, 0.10, 0.95, nda.updated_at);
  scoreMetric(nda.latest_round_investment, normalizeLatestRound, 0.05, 0.95, nda.updated_at);
  scoreMetric(nda.total_secured_loan, normalizeLoans, 0.05, 0.95, nda.updated_at);

  // 4. Financial Performance (20%)
  scoreMetric(gated.revenue, normalizeRevenue, 0.10, 0.85, gated.updated_at);
  scoreMetric(gated.profit_after_tax, normalizeProfit, 0.05, 0.85, gated.updated_at);
  scoreMetric(nda.assets, normalizeAssets, 0.05, 0.95, nda.updated_at);

  // 5. Intellectual Property (10%)
  scoreMetric(nda.no_of_ips, normalizeIP, 0.06, 0.95, nda.updated_at);
  scoreMetric(nda.no_of_trademarks, normalizeTrademarks, 0.04, 0.95, nda.updated_at);

  // 6. Investor Confidence (15%)
  scoreMetric(gated.no_of_investors, normalizeInvestorCount, 0.10, 0.65, gated.updated_at);
  scoreMetric([gated.angel_investors, gated.angel_networks_vc], normalizeAngelVCQuality, 0.05, 0.65, gated.updated_at);

  const score = weightedConfidence > 0
    ? clamp((weightedScore / weightedConfidence) * 100, 0, 100)
    : 0;

  const confidence = totalPossibleWeight > 0
    ? clamp((weightedConfidence / totalPossibleWeight) * 100, 0, 100)
    : 0;

  return { score, confidence };
}
11.5 Edge Cases
If no gated or NDA data is available, the score is based solely on public data, reweighted to 100% — unchanged from original, but now also reflected honestly in a low Confidence Index, rather than presenting a public-data-only score with the same apparent authority as a fully verified one.
If any metric is missing, its weight is redistributed — now proportional to the confidence/freshness of the metrics that are present, not just raw weight.
The score should never be NaN or negative — enforced by clamp() at every stage, with weightedConfidence > 0 guarding the division.
New: if confidence < 15, the UI should not render a bare number — display "Insufficient verified data" instead, so a low-confidence 92 doesn't get read the same as a high-confidence 92.
New: cap any single metric's effective weight contribution at 15% of its category's total, preventing one gamed or inflated field (e.g. a single huge but unverified total_investment claim) from dominating the score.
11.6 Verification Rules for Implementation
Keep the core algorithm and category weights exactly as originally defined.
Confirm lib/trustscore/calculator.ts is the single source of truth. If a duplicate (lib/trustscore/trustScore.ts or similar) still exists anywhere in the codebase, delete it — two files computing the same score is a correctness risk, not just clutter.
Test the calculation against sample data to confirm it never returns NaN or a negative number, and correctly falls back to public-data-only scoring (reweighted to 100%) when gated/NDA data is unavailable.
Optional, additive-only enhancement (does not replace the existing logic): a companion Confidence Index may be added alongside the score to reflect how much of the calculation is based on verified vs. self-reported data — this is a new, separate output, not a change to the existing score formula.

12. UI/UX Requirements
Key requirement: Light mode only — no dark mode support.
Area
Requirement
Component foundation
Use shadcn/ui (built on Radix UI + Tailwind) for interactive primitives — dialogs, dropdowns, tooltips, form inputs, popovers. Since Radix packages are already present in the project, shadcn components should be added via its CLI (npx shadcn@latest add [component]) directly into components/ui/, then restyled to match the project's exact color tokens — never left in shadcn's default theme.
Icons
SVG-based only, via the React Icons library — no emojis anywhere in the UI.
Animation
Framer Motion for all motion — kept subtle and purposeful (hover states, page transitions, reveal-on-scroll), never decorative for its own sake. No animation should exist that doesn't clarify state or guide attention.
Navigation
Fully seamless — every link must resolve to a real, working route; no dead links, no placeholder href="#".
Responsiveness
Mobile-first, fully responsive across breakpoints.
Accessibility
Semantic HTML throughout, proper ARIA labels on all interactive elements — shadcn/Radix components handle much of this out of the box (focus trapping, keyboard nav, aria-* attributes), but this must still be verified per-component, not assumed.

Note: see Section 21 for a critical clarification — the shadcn CLI now defaults to Base UI instead of Radix UI as of a mid-2026 update. This row's instruction to use Radix UI is unchanged and still authoritative; Section 21 exists only to explain how to make the current CLI actually do that.

13. File & Folder Map
13.1 app/ — Pages & API Routes
Path
Task
app/page.tsx
Homepage
app/layout.tsx
Root layout — fonts, metadata, providers
app/globals.css
Global styles + Tailwind directives
app/about/page.tsx
About page
app/how-it-works/page.tsx
Explainer page
app/contact/page.tsx
Contact page
app/directory/page.tsx
Public directory — investors browse startups
app/demo/page.tsx
Demo/preview mode
app/preview/page.tsx
Preview-only view
app/register/page.tsx
Founder signup
app/investor/register/page.tsx
Investor signup
app/reset-password/page.tsx
Password reset flow
app/auth/page.tsx
Auth entry point
app/auth/callback/page.tsx
OAuth callback (Supabase → Google)
app/startup/[id]/page.tsx
Single startup's public profile
app/nda/[id]/page.tsx
NDA signing flow for a specific startup
app/dashboard/page.tsx
Main dashboard
app/dashboard/analytics/page.tsx + layout.tsx
Analytics sub-section
app/admin/page.tsx
Admin panel home
app/admin/[id]/page.tsx
Admin view of a specific record
app/favicon.ico
Browser tab icon

Removed from this list: app/supabase-test/page.tsx + client-test.tsx — this was a dev-only connection test page. Delete it before shipping; it has no reason to exist in production.
13.2 app/api/
Path
Task
app/api/calculate-trustscore/route.ts
Computes a startup's TrustScore
app/api/nda/route.ts
NDA creation/signing/verification
app/api/send-email/route.ts
Sends transactional emails

13.3 components/
File
Task
Navbar.tsx
Top navigation bar
Footer.tsx
Site footer
AuthProvider.tsx
Auth context — user, signOut, signInWithGoogle
PerformanceProvider.tsx
App-wide performance tracking wrapper
DashboardNav.tsx / DashboardSidebar.tsx
Dashboard-area navigation
AdminNav.tsx / AdminSidebar.tsx
Admin-area navigation
MobileNav.tsx
Mobile hamburger navigation
StartupCard.tsx
Startup summary card (directory/dashboard)
VerificationBadge.tsx
The five-tier badges (self-reported → investor-backed)
AnalyticsChart.tsx
Chart component for analytics dashboard
NDASigner.tsx
NDA signing UI
SearchFilters.tsx
Directory filter controls
ResponsiveGrid.tsx / ResponsiveTable.tsx
Generic responsive layout helpers
LazyImage.tsx
Lazy-loading image wrapper

13.4 lib/ — Business Logic & Integrations
Path
Task
lib/trustscore/calculator.ts
TrustScore algorithm (confirm this is the real one — see below)
lib/supabase/client.ts
Supabase client (browser)
lib/supabase/server.ts
Supabase client (server)
lib/email/send.ts
Sends emails
lib/email/templates.ts
Email templates
lib/nda/documents.ts
NDA document handling
lib/analytics/tracking.ts
Event tracking
lib/performance/metrics.ts
Performance monitoring

Removed: lib/trustscore/trustScore.ts — flagged last time as a likely duplicate of calculator.ts. Assuming you confirmed and deleted it; if you haven't yet, do that before anything else, since two files computing the same score is a real bug risk, not just clutter.
13.5 types/
File
Task
types/user.ts
User object shape
types/investor.ts
Investor-specific fields
types/startup.ts
Startup profile shape
types/nda.ts
NDA record shape
types/vouch.ts
Endorsement/vouching data shape
types/access-request.ts
Investor access requests
types/api.ts
Shared API request/response types
types/index.ts
Re-exports everything above

Removed: types-backup/ — confirmed duplicate from the earlier worktree merge. Delete the whole folder.
13.6 utils/
File
Task
constants.ts
Shared constant values
formatters.ts
Formatting helpers (currency, dates)
helpers.ts
Generic utilities
validators.ts
Input validation

13.7 hooks/
File
Task
useMediaQuery.ts
Screen size/breakpoint detection
useSearch.ts
Search/filter state logic

13.8 docs/
File
Task
admin_schema.sql
Database schema reference
AGENT_BRIEF.md
Instructions for AI coding agents
DESIGN.md
Design system documentation — update this with your new color palette and "no 3D / minimalist / light mode" direction
claude.md
Canonical Claude Code project instructions

13.9 public/images/ — Current + Recommended Additions
Currently in use on the site: logo.png, hero-mockup.png, feature-transparency.png, feature-diligence.png, problem-monitor.png, isometric-badges.png, security-node-network.png, demo-dashboard.png, demo-insights.png
Already present but still unused (available for future sections): about-globe.png, about-hero.png, dashboard-preview.png, demo-badge.png, demo-data-viz.png
Missing — referenced in app/layout.tsx metadata but not confirmed to exist. Worth checking these are actually in place, since a missing OG image silently breaks link previews on social/Slack/iMessage:
File Needed
Referenced For
public/og-image.png (1200×630)
Open Graph / Twitter card preview image
public/apple-touch-icon.png
iOS home-screen icon
public/site.webmanifest
PWA manifest
public/images/favicon.ico
Referenced in metadata icons.icon

New placeholders worth adding, given the minimalist/light/interactive direction (no 3D hero to fall back on for visual interest, so these carry more weight):
Suggested Filename
Purpose
public/images/score-breakdown-placeholder.png
Illustrates how a score is composed (category breakdown), to replace visual interest lost from removing the gauge
public/images/founder-flow-placeholder.png
Step-by-step founder onboarding visual
public/images/investor-flow-placeholder.png
Step-by-step investor matching visual
public/images/testimonial-avatar-1.png (etc.)
Real headshots to replace the current initials-only avatar in the testimonial section
public/images/empty-state-directory.png
Shown when a directory search returns no results — small detail, but matches "interactive, considered" direction rather than a bare "no results" text

13.10 Root-Level Config
File
Task
next.config.js
Next.js config
tailwind.config.js
Tailwind theme config — update with your new color palette here
postcss.config.js
PostCSS pipeline
tsconfig.json
TypeScript config
eslint.config.mjs
Linting rules
middleware.ts
Auth-gating for /dashboard, /admin
package.json / package-lock.json
Dependencies & scripts
.env.example
Env var template
.env.local
Real secrets — never commit
.gitignore
Git ignore rules
.npmrc
npm config
README.md
Project overview


14. Final Checklist
14.1 Core Functionality
All routes render without errors.
Navigation works across every route — no dead links, no href="#" placeholders.
Authentication flow works end-to-end (login, signup, OAuth callback, reset password).
Dashboard and admin routes are protected by middleware.ts; unauthenticated users are redirected correctly.
TrustScore displays correctly on startup pages — as a plain numeric score display, not a gauge component (TrustScoreGauge.tsx has been removed from the codebase entirely).
TrustScore calculation logic matches the original algorithm and weighting exactly; tested against sample data with no NaN or negative results.
Only one TrustScore calculation file exists (lib/trustscore/calculator.ts) — any duplicate has been deleted.
14.2 Investor Access Request Flow
"View More" button appears on startup profiles where gated/NDA data would be shown.
Clicking it logs a request to access_requests and sends a notification email to the founder from trustscore.llm@gmail.com.
On founder approval, a connection message is sent including the investor's name, firm, role, and LinkedIn (if provided).
On rejection, the investor sees an updated request status.
All approvals/rejections are recorded in the audit trail, visible in the admin panel.
Raw NDA data is never exposed to investors at any point in this flow.
Admin panel loads with relevant data, including the request/approval audit trail.
⚠️ See Section 16 — the source material also contains a second, contradictory version of this flow (auto-save, no approval step). Both are preserved below exactly as given; they need to be reconciled before implementation.
14.3 UI / Design
UI is light mode only — no dark backgrounds anywhere.
Color palette is applied consistently (per docs/DESIGN.md).
No 3D elements remain anywhere in the codebase — Three.js hero and related dependencies (three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, postprocessing) have been fully removed from app/page.tsx and package.json.
All icons are SVG-based via React Icons — no emojis anywhere in the UI.
Animations use Framer Motion, are subtle, and serve a clear UX purpose (no purely decorative motion).
Any shadcn/ui components in use are restyled to match the project's color tokens — none left in default shadcn theme.
Overall UI feels minimalist and interactive, not sparse or static.
14.4 About Page
Hero section with tagline + about-hero.png placeholder.
Mission & Vision narrative included.
"How TrustScore Works" section with icons and a diagram placeholder (trustscore-diagram.png).
Key Features grid — 6 cards, each with an SVG icon.
Stats section — startups, investors, TrustScores calculated, accuracy/rating.
Testimonials — 3 quotes, mix of founders and investors.
About page has been meaningfully expanded beyond the original placeholder content.
14.5 Images & Assets
logo.png is used as the site logo everywhere.
favicon.ico is used as the browser tab icon.
og-image.png, apple-touch-icon.png, site.webmanifest, and images/favicon.ico — all referenced in layout.tsx metadata — actually exist in public/.
All image references degrade gracefully to a styled placeholder box if the real file is missing (no broken image icons).
Descriptively-named placeholders added wherever a section previously lacked a real asset.
14.6 Responsiveness & Accessibility
Fully responsive on mobile, tablet, and desktop.
Semantic HTML used throughout.
Proper ARIA labels on all interactive elements (verified per-component, not assumed from Radix/shadcn defaults alone).
14.7 API & Data
All API routes tested — return valid, structured JSON with correct HTTP status codes on both success and error.
All async operations wrapped in try/catch.
Supabase errors are caught and surfaced via toast notifications, not silent failures.
Supabase RLS policies enforce row-level access correctly.
Rate limiting active on API routes (lib/rate-limit.ts).
14.8 Code Quality
No TypeScript errors; strict mode enabled, no implicit any.
All imports use the @/ absolute alias.
Functional components with explicit prop types throughout.
No inline styles — Tailwind classes only.
Components kept small and focused.
npm run lint passes with no errors.
npm run build succeeds.
14.9 Codebase Cleanup
types-backup/ folder deleted.
Duplicate lib/trustscore/trustScore.ts (if it still exists) deleted.
app/supabase-test/ (dev-only connection test page) deleted.
Root-level AGENTS.md / CLAUDE.md deleted (superseded by docs/claude.md).
Unused default Next.js starter SVGs (file.svg, globe.svg, next.svg, vercel.svg, window.svg) deleted.
temp-navbar-import.txt deleted.
14.10 Deployment Readiness
Environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) set correctly on Vercel.
.env.local is not committed to git.
Build and start commands confirmed working (npm run build, npm start).
Preview deployments generate correctly per PR.

15. Additional Instructions for the AI Agent
(Color palette intentionally omitted here in the original source — maintained separately in docs/DESIGN.md. Full palette reference is in Section 10 above.)
15.1 Starting Order
Start with the root files: layout.tsx, globals.css, middleware.ts, next.config.js, tailwind.config.js.
Then fix all public pages — ensure they render without errors.
Ensure all dashboard and admin routes are protected by middleware.ts.
Verify TrustScore calculation — test with sample data. Write unit tests or run manual checks against known inputs/outputs.
Fix remaining components, then wire up the investor NDA request flow (see Section 16), then polish content (About page, image placeholders).
15.2 UI Direction (Applies to Every Page/Component)
No 3D elements. Remove the existing Three.js hero (HeroBackground, HeroScene, NeuralNetworkParticles, ConnectingLines in app/page.tsx), plus the @react-three/fiber, @react-three/drei, @react-three/postprocessing, three, and postprocessing dependencies in package.json. Replace the hero with a lightweight, minimalist, interactive alternative — a subtle animated element (e.g. a live-feed ticker, an animated score counter) is preferable to any static decorative graphic.
Light mode only. No dark mode, no dark backgrounds. Backgrounds stay white/off-white per the palette maintained in docs/DESIGN.md.
Minimalist, not sparse. Favor clean spacing, restrained color use, and one clear focal point per section over dense decoration.
No TrustScoreGauge component. Remove components/TrustScoreGauge.tsx entirely. Replace every place it was used (app/startup/[id]/page.tsx, StartupCard.tsx, dashboard views) with a plain, minimalist numeric score display — large number + label, styled consistently with VerificationBadge, no dial/meter/gauge graphic of any kind.
Icons must be SVG-based, via the React Icons library — no emojis anywhere in the UI, including placeholder/empty states, toasts, and admin views.
Animations via Framer Motion only, kept subtle and purposeful — hover states, scroll reveals, page transitions. No animation should exist that doesn't clarify state or direct attention; avoid decorative motion for its own sake.
Component library: shadcn/ui is approved for use, built on Radix UI primitives (the project already has @radix-ui/react-slot and @radix-ui/react-tooltip installed, so this is a natural fit, not a new dependency direction). Pull components via the shadcn CLI into components/ui/, then restyle them to match the project's exact color tokens — never leave them in shadcn's default theme. If any existing custom component duplicates a Radix primitive shadcn would also cover, consolidate on the shadcn version rather than maintaining both patterns side by side.
See Section 21 for how to keep the current shadcn CLI on Radix, since its default changed after this brief was originally written.
15.3 Navigation & Routing
Navigation must be fully seamless — every link resolves to a real, working route. No dead links, no placeholder href="#".
All dashboard routes (/dashboard/*) and admin routes (/admin/*) must be protected by middleware.ts, redirecting unauthenticated users appropriately.
15.4 TrustScore Calculation (Agent-Facing Constraints)
Keep the core algorithm and category weights exactly as originally defined (Company Foundation 20%, Team & Leadership 15%, Funding & Investment 20%, Financial Performance 20%, Intellectual Property 10%, Investor Confidence 15%) — do not change the underlying formula or weighting scheme.
Confirm lib/trustscore/calculator.ts is the single source of truth. If a duplicate (lib/trustscore/trustScore.ts or similar) still exists anywhere in the codebase, delete it — two files computing the same score is a correctness risk, not just clutter.
Test the calculation against sample data to confirm it never returns NaN or a negative number, and correctly falls back to public-data-only scoring (reweighted to 100%) when gated/NDA data is unavailable.
Optional, additive-only enhancement (does not replace the existing logic): a companion Confidence Index may be added alongside the score to reflect how much of the calculation is based on verified vs. self-reported data — this is a new, separate output, not a change to the existing score formula.
15.5 Performance
Use Next.js Image component with priority for hero-equivalent images.
Static generation for public pages where possible (generateStaticParams for startup pages).
Cache database queries in Server Components where appropriate.
Debounce search/filter inputs to avoid excessive requests.
(The earlier note about lazy-loading the 3D canvas no longer applies, since the 3D hero is being removed entirely — not just deferred.)
15.6 Deployment
Platform: Vercel.
Required environment variables on the hosting platform: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
Never commit .env.local.
Build command: npm run build. Start command: npm start.
Preview deployments automatically generated per PR.
15.7 Security
Supabase RLS policies enforce row-level security; users only access data they're authorized to see.
All user inputs validated server-side.
Rate limiting on API routes (lib/rate-limit.ts).
CORS configured for any allowed external origins.
Supabase sessions validated in middleware.ts.
NDA data is never exposed to investors under any circumstance — used only internally for score calculation and, where explicitly approved by a founder, summarized into a connection message (not raw NDA fields).
15.8 Maintenance
Run npm outdated periodically; update minor/patch versions.
Monitor Supabase usage against free-tier limits.
Ensure database indexes exist on foreign keys (startup_id) and frequently queried columns (sectors, city).
Supabase daily backups are automatic — no action needed.
Use environment variables as feature flags for experimental features.
15.9 Code Quality & Linting (Agent-Facing)
ESLint configured with Next.js recommended rules + TypeScript.
TypeScript strict mode enabled — no implicit any.
All imports use the absolute @/ alias.
Functional components only, with explicit prop types.
No inline styles — Tailwind classes only.
Keep components small and focused; split out sub-components rather than letting any single file grow unwieldy.
15.10 Error Handling & Logging
Global error boundary at the root layout to catch rendering errors.
API routes return structured error responses with correct HTTP status codes.
Client-side errors logged to console in development; production logging service (e.g. Sentry) is a placeholder for later, not required now.
Supabase errors are caught and surfaced to users via toast notifications, not silent failures.
Every async operation has a try/catch.
15.11 About Page Enhancements (Detailed)
The About page should include, in this order:
Hero section — tagline + large image placeholder (about-hero.png).
Mission & Vision — brief narrative about TrustScore AI's purpose.
How TrustScore Works — step-by-step, icon-led explanation (SVG icons via React Icons, not emojis), with an accompanying diagram placeholder (trustscore-diagram.png).
Key Features — a grid of 6 cards, each with an SVG icon.
Stats section — number of startups, number of investors, TrustScores calculated, and one accuracy/rating-style stat.
Testimonials — 3 quotes, from a mix of founders and investors.
All image references must degrade gracefully: if the actual .png file is missing, render a styled placeholder box with descriptive alt-style text rather than a broken image icon. Real images can be dropped into /public/images/ later without further code changes, as long as the src path matches.
15.12 Image Placeholders
Add descriptively-named placeholders to /public/images/ wherever a section currently lacks a real asset — including the ones already flagged as referenced-but-missing in layout.tsx metadata (og-image.png, apple-touch-icon.png, site.webmanifest, images/favicon.ico) and the About-page-specific assets above (about-hero.png, trustscore-diagram.png).
Logo and favicon are fixed: use logo.png as the site logo everywhere, and favicon.ico as the browser tab icon — do not substitute alternate filenames for these two.

16. Investor Access Request Flow — Two Versions in Source (Flag) ✅ RESOLVED (Added): This contradiction has now been resolved for implementation. Version B (Auto-Save, No-Approval Flow) is the version to build. Decision made because no one will reliably be staffing the admin side to review and approve/reject requests, so a blocking approval step is not operationally realistic for this team. Version A is preserved below only for historical/reference purposes and should NOT be implemented. Any agent session should treat Version B as the authoritative flow going forward — do not re-ask which version to build. Note added for navigability, no content altered: the original source material contains two different descriptions of the investor access flow, likely reflecting the design evolving mid-document. Both are preserved in full below, in the order they appeared. These two versions contradict each other (approval-gated vs. no-approval/auto-save) — this contradiction is now resolved per the note above. 16.1 Version A — Approval-Gated Flow (appears first in source) This is a new flow to implement, replacing any placeholder "Request Access" behavior: On a startup's profile page, investors see a "View More" button/link where gated or NDA-tier data would otherwise be shown. Clicking it triggers an access request: the request is logged in the access_requests table (timestamped, per the existing audit trail design), and a notification email is sent to the founder. The email is sent from trustscore.llm@gmail.com via the existing lib/email/send.ts + app/api/send-email/route.ts pipeline. It should include the investor's name, firm/company, and role (per their profile data), and a link/action for the founder to approve or reject. On founder approval: a follow-up message is sent connecting the two parties — this message should include the investor's relevant profile details (name, firm, role, LinkedIn if provided) so the founder has full context going into the conversation. On rejection: the investor should see their request status update (e.g., "Declined") without being given a reason unless the founder chooses to provide one. All approvals/rejections must be recorded in the audit trail (visible in the admin panel via LedgerAudit.tsx or equivalent), consistent with the existing compliance requirements. NDA data itself is never shown directly to investors — it is used only to compute the TrustScore. Only the founder's explicit approval-and-connect action can share investor-facing information, and even then, only what the founder is shown is what gets sent (i.e., no raw NDA fields leak into the connection message). 16.2 Version B — Auto-Save, No-Approval Flow (appears later in source, under "Investor Side — Access Flow & Data Model") A modal/screen is shown (for appearances / product demo purposes). On the investor's action (e.g. clicking "Sign" / "Agree"), their data is auto-saved directly to Supabase — no approval step, no email required to complete the action, nothing waits on a founder's response. Their profile is then simply shown/unlocked — that's the entire flow. What this means practically (per source): No access_requests approval state machine (pending → approved/rejected) is needed. A row can just be inserted on submission. No blocking email-and-wait logic is required for the core function to work. A notification email to the founder (from trustscore.llm@gmail.com) can still be sent as a side-effect, fire-and-forget — informational only, not something the investor's flow waits on or depends on succeeding. No admin action is required anywhere in this flow.
17. Investor Profile Data Model
17.1 Profile Information (collected at sign-up & profile completion)
Field
Purpose
Full name
Display name & personalization
Email address
Authentication & notifications
Company / firm name
Affiliation for credibility
Job title / role
Context shown on their profile
LinkedIn URL
Professional verification
Headquarters location
Geographic context
Investment focus areas (sectors, stages, geographies)
Matching & directory filtering
Typical ticket size range
Filtering relevant startups
Years of experience (optional)
Trust/reputation signal

17.2 Activity Data
Data Point
Stored In
Purpose
Startup views
Analytics/logs (planned)
Aggregated insight, optional
"View More" / NDA actions
access_requests table (or renamed equivalent, e.g. profile_unlocks)
Simple log of which startups an investor has unlocked — auto-saved, no state machine needed
Portfolio startups (investments they mark)
portfolio table
Credibility showcase on their profile
Vouches / endorsements (optional)
vouches table
Peer validation, if implemented
Search & filter preferences
Client-side state / user settings
Personalized browsing

17.3 Data Explicitly NOT Collected
No financial data about the investor, unless self-disclosed.
No personal identity or tax documents.
No payment information — no premium tiers currently.
17.4 How Investor Data Is Used
Authentication & authorization — identifies the user and assigns the correct role.
Personalized directory — filters startups by the investor's stated focus sectors/stages.
Profile display — the collected fields above are what renders on the investor's own profile.
Portfolio showcase — investors can optionally display their portfolio to build credibility with founders.
17.5 Privacy
Investor data is private by default; investors may later opt to make their profile public if that capability is added.
No approval gate exists on the investor's side per the Version B flow above — this contradicts Version A's founder-approval flow; see the flag in Section 16.
Also relevant (from the approval-gated version's data model context):
Explicitly not collected: investor financial data (unless self-disclosed), personal identity/tax documents, payment information (no premium tiers currently).
Privacy defaults: all investor data is private by default. Founders see only the investor's name and firm when a request comes in — not the full profile — unless/until the founder approves the connection. Admins retain full visibility for moderation purposes.

18. Founder Input Fields
Based on the schema already built, here is every field the founder needs to provide, organized by tier (this maps directly to the registration flow + dashboard edit forms):
18.1 At Signup / Basic Profile (companies — public tier)
Field
Column
Required?
Startup name
name
Required
Founded date
founded_date
Optional
City
city
Optional
Country
country
Optional
Sector
sector
Optional
Sub-sector
subsector
Optional
Description
description
Optional
Focus area
focus_area
Optional
Incubator/Accelerator
incubator_accelerator
Optional
Products
products
Optional
Logo
logo_url
Optional
Website
website
Optional
Contact email
contact_email
Optional
Contact phone
contact_phone
Optional

age, status, verification_level, trust_score, show_score, owner_id, timestamps — these are system-computed/managed, never founder-entered directly.
18.2 Request-Access Tier (startup_gated_data) — shown only to investors who've requested access
Field
Column
Accelerator (if separate from public one)
accelerator
Founding team (names, ages)
founding_team (jsonb)
Angel investors
angel_investors (jsonb)
VC firms / rounds
vc_rounds (jsonb)
Government funding received
gov_funding (jsonb)
Revenue
revenue + revenue_currency
Profit after tax
profit_after_tax
Employee compensation
employee_compensation
Number of investors
number_of_investors
Monthly burn rate
monthly_burn_rate
Runway (months)
runway_months
Valuation
valuation

18.3 NDA-Only Tier (startup_nda_data) — shown only after NDA is signed
Field
Column
IP count
ip_count
Trademark count
trademark_count
Patents (details)
patents (jsonb)
Trade secrets
trade_secrets (jsonb)
Latest funding round details
latest_round (jsonb)
Total investment raised
total_investment + currency
Total loans secured
total_loans + currency
Assets
assets + currency
Financing agencies
financing_agencies (jsonb)
Competitors
competitors (jsonb)

18.4 Open Decision Flagged in Source
One thing worth deciding: at signup, collect only the public-tier basics (fast, low-friction onboarding) and let the founder fill in gated/NDA data later from the dashboard? Or ask for everything up front in one long form?
Given TrustScore rewards completeness, a staged approach (quick signup → prompt to fill gated data → prompt for NDA data with an incentive like "unlock a higher score") is usually better UX than one giant form. This decision was left open in the source material for further sketching if needed.

19. Data Sync Requirement: Founder Edits → Optimistic UI → Supabase → Realtime
Whenever a founder updates their startup's data (profile fields in companies, gated data in startup_gated_data, or NDA data in startup_nda_data), the flow must be:
UI updates immediately — the instant the founder submits the change, the local state/UI reflects it right away, before waiting on any network response.
Supabase write happens in the background — the update/upsert call fires right after the optimistic UI update, not before.
On success — nothing further needed; the UI is already correct, and Realtime propagation pushes the change to any other connected viewers (investors, admin, founder's other open tabs).
On failure — the UI must roll back to the previous value and show an error to the founder. Silently leaving a UI showing data that was never actually saved is not acceptable, since the founder would believe the update succeeded when it didn't.
TrustScore recompute still happens after the confirmed Supabase write (not before), since it depends on the data actually being persisted.
19.1 Implementation Pattern
ts
async function updateCompanyField(companyId: string, updatedFields: Partial<Company>) {
  const previousData = companyData; // snapshot for rollback

  // 1. Optimistic UI update — happens immediately
  setCompanyData((prev) => ({ ...prev, ...updatedFields }));

  // 2. Background write to Supabase
  const { error } = await supabase
    .from('companies')
    .update(updatedFields)
    .eq('id', companyId);

  if (error) {
    // 3. Rollback + surface error — the save did not actually happen
    setCompanyData(previousData);
    showErrorToast('Failed to save changes. Please try again.');
    return;
  }

  // 4. Success — Realtime subscription (if active elsewhere) will also
  // receive this UPDATE and keep other viewers in sync; no extra action needed here.
}
Apply this same pattern to startup_gated_data and startup_nda_data edit handlers wherever they live in the founder dashboard.
Important: because other viewers rely on the Realtime subscription (not on this optimistic state), there's a brief window where the founder's own screen shows the change but investors/admins haven't received it yet — that's expected and fine, since Realtime propagation only fires after Supabase actually commits the write.

20. Authentication
Google + Email Sign-In via Supabase.
AuthProvider.tsx already has both implemented in code: signInWithGoogle(), signUpWithEmail(), signInWithEmail(). Supabase Auth genuinely does support both simultaneously out of the box — a user signs up with either method and lands in the same auth.users table, and the profiles table (linked via user_id) doesn't care which method they used.

21. Component Library Clarification: Radix UI, Not Base UI (Added)
> This entire section did not exist in the original source brief. It is added here to prevent a real, confirmed problem: the shadcn/ui CLI changed its default underlying component library after this brief was written, and following the CLI's new default would silently violate Section 12's requirement.

Background: as of a mid-2026 shadcn/ui CLI update, running `npx shadcn init` now defaults to **Base UI** instead of **Radix UI**. Base UI is a separate, newer headless component library — not the same as Radix UI, even though shadcn presents both under one abstraction. Sections 12 and 15.2 of this brief explicitly require Radix UI (the project already depends on `@radix-ui/react-slot` and `@radix-ui/react-tooltip`), so the CLI's new default must be overridden.

Rule for the agent: whenever initializing shadcn/ui or adding shadcn components in this project, explicitly force Radix UI. Do not accept "Base UI (Recommended)" if the CLI offers it as a default.
- Init: `npx shadcn init -b radix` (or select Radix explicitly if prompted interactively).
- Verify: `components.json` should show a `style` value starting with `radix-` (e.g. `radix-vega`), never `base-*`.
- If a duplicate or misconfigured `components.json` is found showing `base-*`, stop and ask before reinitializing or reinstalling components — do not silently switch it yourself, since components already added under Base UI would need to be reinstalled, not just reconfigured.
- The visual preset/style name (Vega, Nova, Maia, Lyra, Mira, Luma, Sera, Rhea, Custom) is independent of the Radix-vs-Base-UI choice and does not need to match any specific value — components get restyled to this project's exact color tokens (Section 10) regardless of starting preset.

This section does not change the requirement itself — Section 12's "built on Radix UI + Tailwind" instruction was always the rule. This section exists only so the agent knows how to satisfy that rule given the CLI's current behavior, which differs from what existed when the original brief was written.

End of brief. This document consolidates the original TrustScore AI project description, architecture, hackathon write-up, database schema, color system, TrustScore algorithm, UI/UX rules, file map, final checklist, and agent-facing instructions into one navigable reference — with all original values, weights, and settings preserved unchanged. Sections 8A and 21 are additive-only clarifications reflecting real setup steps taken and a real CLI behavior change encountered while standing up this project; they do not alter any original decision, weight, palette value, or architectural rule.
