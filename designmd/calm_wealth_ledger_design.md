# Calm Wealth Ledger (Kosh) — Design System & Architecture Specification

> **DESIGN.md**  
> System: Calm Wealth Ledger  
> Core Aesthetic: Scandinavian Editorial Finance × Intentional Ritual  
> Typography: Hanken Grotesk & JetBrains Mono / Space Grotesk (Tabular Figures)  
> Primary Palette: Deep Forest Evergreen (`#0d3b2e`), Crisp Mint (`#2bb673`), Cash Variance Ochre/Crimson (`#ba1a1a`), Warm Slate Dim (`#f7f9ff`)

---

## 1. Vision & Design Philosophy

The **Calm Wealth Ledger** is built on a fundamental psychological insight: *financial clarity does not come from high-frequency charts or dopamine gamification; it comes from quiet, frictionless habits and absolute mathematical honesty.*

### Core Tenets
1. **Calm Authority over Clutter**: Replace dense, stressful financial grids with generous whitespace, high-contrast typographic hierarchy, and warm, tactile card surfaces.
2. **The 30-Second Friction Threshold**: Daily transaction logging must take under 30 seconds. Interactions are optimized for muscle memory (directional flows, smart toggles, 1-click categorizations).
3. **Honest Accounting Rules**: Transfers (ATM cash withdrawals, Bank to bKash/Nagad) are strictly treated as neutral balance realignments—never as expenses—preventing false budget panic.
4. **Habit-First Architecture**: Features are anchored to behavioral rituals:
   - *Pay Yourself First* on Salary Day
   - *30-Second Daily Micro-Log*
   - *5-Minute Weekly Physical Wallet Audit* (Counting notes to expose unaccounted cash leakage)
   - *15-Minute Month-End Anomaly Review*

---

## 2. Design Tokens & Color Palette

### 2.1 Primary & Functional Palette
```css
:root {
  /* Brand Anchor & Primary */
  --color-primary: #0d3b2e;             /* Deep Nordic Forest - Primary buttons, headers, active accents */
  --color-primary-container: #1b5344;   /* Midnight Evergreen for deep elevated surfaces */
  --color-on-primary: #ffffff;          /* Pure crisp contrast */

  /* Neutral Surfaces & Elevation */
  --color-surface: #f7f9ff;             /* Gentle pale ice-tinted backdrop */
  --color-surface-dim: #d3dbe6;         /* Subtle structural borders and dividing strokes */
  --color-surface-bright: #ffffff;      /* Clean card surface */
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #edf4ff;
  --color-surface-container: #e6eef9;
  --color-surface-container-high: #dfe8f4;
  --color-surface-container-highest: #d6e2ee;

  /* Typography / Text Colors */
  --color-text-main: #141b24;           /* High-contrast ink for headers and key values */
  --color-text-secondary: #424e5e;      /* Readable slate for notes, timestamps, subtitles */
  --color-text-tertiary: #6b7a8d;       /* Muted tertiary for metadata and labels */
  --color-text-inverse: #ffffff;

  /* Financial Status Accents */
  --color-income: #107c41;              /* Forest Emerald - +৳ Deposits / Inflows */
  --color-income-container: #e8f5e9;
  --color-expense: #c93b2b;             /* Terracotta Red - -৳ Outflows / Category spend */
  --color-expense-container: #fde8e8;
  --color-transfer: #4f46e5;            /* Deep Indigo - ⇄ Neutral inter-vault moves */
  --color-transfer-container: #eef2ff;
  
  /* Audit & Variance Alerts */
  --color-warning: #b45309;             /* Amber Gold - Pending review / reconciliations */
  --color-warning-container: #fef3c7;
  --color-danger: #ba1a1a;              /* Signal Crimson - Unaccounted cash discrepancy */
  --color-danger-container: #ffebe9;
  --color-success: #0d704d;             /* Jade Matched status badge */
  --color-success-container: #e6f6ee;
}
```

---

## 3. Typography Hierarchy

**Font Family**: `Hanken Grotesk` (Body, UI, & Display) with `JetBrains Mono` / `Chivo Mono` for tabular numerals and currency amounts (`৳`).

| Role | Font Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `32px` (`2rem`) | 700 Bold | `1.2` | `-0.02em` | Net Worth, Month Total Balance |
| **Page Title** | `24px` (`1.5rem`) | 700 Bold | `1.25` | `-0.015em` | View Headers (e.g. Reconcile & Audit) |
| **Section Title** | `18px` (`1.125rem`) | 600 SemiBold | `1.3` | `-0.01em` | Card deck titles, Habits header |
| **Data Metric Large** | `22px` (`1.375rem`) | 700 Bold | `1.2` | `0` | Account card balances, Big 4 stats |
| **Body Primary** | `14px` (`0.875rem`) | 500 Medium | `1.45` | `0` | Ledger rows, transaction notes, copy |
| **Body Secondary** | `13px` (`0.8125rem`) | 400 Regular | `1.4` | `0` | Timestamps, counterparty names |
| **Micro Label / Tag** | `11px` (`0.6875rem`) | 600 SemiBold | `1.3` | `+0.04em` | All-caps badges, category pills, tags |
| **Numeric Value** | Tabular / Mono | 600/700 | `1.0` | `+0.01em` | `৳ 242,500` currency strings |

---

## 4. Spacing, Elevation & Corner Radii

### 4.1 Spacing Rhythm (4px Base Grid)
- **Compact Padding**: `8px` (`0.5rem`) — Pill tags, button icon containers
- **Standard Card Padding**: `16px` – `20px` — Metric tiles, logger inputs
- **Container Padding**: `24px` – `32px` — Section modules, tables, audit deck
- **Outer Shell Margins**: `32px` horizontal page boundaries on desktop layouts

### 4.2 Corner Radii
- `rounded-lg`: `8px` — Buttons, input fields, badges, note recount steps
- `rounded-xl`: `12px` — Account cards, alert banners
- `rounded-2xl`: `16px` — Major section containers, Ledger audit panel, Habit cards
- `rounded-full`: `9999px` — Status pills, toggle switches, category badges

### 4.3 Depth & Border Strategy
- Subdued hairline border (`1px solid rgba(211, 219, 230, 0.75)` or `#d3dbe6`) paired with low-diffuse ambient shadows:
  ```css
  box-shadow: 0 1px 3px 0 rgba(16, 24, 40, 0.04), 0 1px 2px -1px rgba(16, 24, 40, 0.03);
  ```
- Hover state elevation:
  ```css
  box-shadow: 0 6px 12px -2px rgba(16, 24, 40, 0.06), 0 3px 6px -3px rgba(16, 24, 40, 0.04);
  ```

---

## 5. Component Patterns & Guidelines

### 5.1 Account / Vault Cards
- Must show:
  1. **Account Name & Type** (e.g. City Bank `Savings`, Cash in Hand `Physical`, bKash `MFS`)
  2. **Live Balance** in prominent bold tabular currency
  3. **Reconciliation Status Badge**: Green `Matched` or Red/Amber `Audit Needed` / `Diff: -৳ 300`
  4. **Sub-metrics**: Statement sync timestamp, monthly In/Out summary, or quick-audit action button.

### 5.2 Transaction Flow Badges
- **Income (`+`)**: Emerald pill (`bg-emerald-50 text-emerald-800 border-emerald-200`)
- **Expense (`-`)**: Soft crimson pill (`bg-red-50 text-red-700 border-red-200`)
- **Transfer (`⇄`)**: Indigo pill (`bg-indigo-50 text-indigo-700 border-indigo-200`) accompanied by directional breadcrumb: `City Bank ➔ Cash in Hand`

### 5.3 The 8 Canonical Budget Categories
To eliminate logging paralysis, keep strictly to 8 core buckets:
1. `Rent`
2. `Food & Dining`
3. `Electricity / Utilities`
4. `Travel & Fuel`
5. `Shopping`
6. `Health`
7. `Family & Support`
8. `Other Discretionary`

### 5.4 Habit Protocol Modules
- **Interactive Denomination Counter**: Physical note stepper inputs (`৳ 1,000`, `৳ 500`, `৳ 100`, etc.) that live-calculate the cash discrepancy between wallet and app balance.
- **One-Click Discrepancy Reconciliation**: A dedicated `"Auto-Record as Unaccounted Cash Spend"` action ensuring forgotten micro-spends are absorbed without ledger stall.
- **Pay Yourself First Indicator**: Progress meter showing salary day target transfer settled before discretionary allocation.

---

## 6. Layout & Shell Architecture

- **Persistent Left Navigation (Desktop)**:
  - Width: `240px`
  - Fixed brand mark (`Kosh Ledger`), status indicator, primary navigation links with active state pill styling, and version pill.
- **Top Header Utility Bar**:
  - Month/Cycle picker dropdown
  - Next cash check reminder chip (`Weekly cash check in 2 days`)
  - Primary CTA: `+ Log Transaction` in deep evergreen (`#0d3b2e`)
  - Notification icon with pending discrepancy badge
  - User vault profile avatar
- **Main Viewport**: Single-column max-width (`1280px` – `1440px`), structured in clean thematic tiers (Alerts → Big 4 Metrics → Vault Deck → 30s Action Workspace → Ledger & Habit Audit).
