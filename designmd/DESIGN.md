---
name: Calm Wealth Ledger
colors:
  surface: '#f7f9ff'
  surface-dim: '#d3dbe6'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4ff'
  surface-container: '#e7effa'
  surface-container-high: '#e1e9f4'
  surface-container-highest: '#dbe3ef'
  on-surface: '#141c24'
  on-surface-variant: '#414845'
  inverse-surface: '#29313a'
  inverse-on-surface: '#e9f1fd'
  outline: '#717974'
  outline-variant: '#c0c8c3'
  surface-tint: '#3c6658'
  primary: '#00241a'
  on-primary: '#ffffff'
  primary-container: '#0d3b2e'
  on-primary-container: '#79a694'
  inverse-primary: '#a3d0be'
  secondary: '#535f6f'
  on-secondary: '#ffffff'
  secondary-container: '#d4e1f4'
  on-secondary-container: '#576474'
  tertiary: '#110072'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f00af'
  on-tertiary-container: '#9290ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beedd9'
  primary-fixed-dim: '#a3d0be'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#234e40'
  secondary-fixed: '#d7e3f6'
  secondary-fixed-dim: '#bbc7da'
  on-secondary-fixed: '#101c2a'
  on-secondary-fixed-variant: '#3c4857'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#0f0069'
  on-tertiary-fixed-variant: '#3323cc'
  background: '#f7f9ff'
  on-background: '#141c24'
  surface-variant: '#dbe3ef'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  mono-currency-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  mono-currency-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  mono-label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system is engineered for personal wealth management, daily budgeting, and multi-source account orchestration (Cash, Traditional Banking, and Mobile Financial Services like bKash and Nagad). The core brand identity balances the stoic discipline of private banking with the modern agility of consumer fintech.

### Aesthetic Persona
- **Poised & Trustworthy:** Financial management often induces anxiety; the visual identity projects absolute stability, transparency, and calm order.
- **Architectural & Systematic:** Every card, balance metric, and transaction ledger entry aligns along structured data planes, eliminating cognitive overload.
- **Tactile Fineness:** Subtle borders, warm surfaces, and restrained ambient lighting elevate the experience beyond generic corporate fintech.

### Design Movement
The interface executes an elevated **Modern Minimalist & Tonal Layering** paradigm. It relies on generous breathing room, intentional structural contrast, soft tinted surface containers, and razor-sharp typographic hierarchy instead of heavy drop shadows or decorative gradients.

## Colors

The palette establishes an intentional equilibrium between natural prosperity (deep emerald forest) and institutional authority (slate navy), situated on warm, non-glare canvas tones.

### Functional Roles & Semantic Mapping
- **Primary (`#0D3B2E` - Forest Emerald):** Anchors main navigation indicators, brand emblems, primary CTA buttons, and net worth balance cards. Conveys organic security and capital preservation.
- **Secondary (`#1E2A38` - Slate Navy):** Drives secondary actions, ledger table headers, structural containers, and primary content groupings.
- **Tertiary (`#4F46E5` - Crisp Indigo):** Denotes movement, internal balance transfers, linked account transitions, and account reconciliation states.
- **Positive / Inflow Accent (`#10B981` / `#D1FAE5`):** Mint and vibrant emerald used exclusively for incoming transactions, positive variance, and reached savings milestones.
- **Negative / Outflow Accent (`#E11D48` / `#FFE4E6`):** Soft rose-coral designated for expense metrics, debit notifications, and negative deltas. Avoids alarming harsh red in favor of a composed alert tone.
- **Canvas & Surface System:** 
  - Canvas Base: `#F8F9FA` (Warm Off-White)
  - Surface Card: `#FFFFFF` (Pure Crisp White)
  - Surface Muted / Well: `#F1F3F5` (Subtle Warm Tint)
  - Border Subdued: `#E2E8F0`
- **Account Type Signatures:**
  - Cash: `#0D3B2E` (Forest Emerald)
  - Bank Accounts: `#1E2A38` (Slate Navy)
  - bKash: `#D12053` (Signature Crimson Magenta - calibrated for subtle badge and icon usage)
  - Nagad: `#D84226` (Signature Amber Orange - calibrated for subtle badge and icon usage)
- **Category Badge Tokens:**
  - Rent: Sage Indigo (`#4338CA` on `#EEF2FF`)
  - Food: Ochre Amber (`#B45309` on `#FEF3C7`)
  - Utilities: Steel Slate (`#334155` on `#F1F5F9`)
  - Travel: Sky Cyan (`#0369A1` on `#E0F2FE`)
  - Shopping: Deep Rose (`#BE123C` on `#FFE4E6`)
  - Health: Teal Pine (`#0F766E` on `#CCFBF1`)
  - Family: Purple Fig (`#7E22CE` on `#F3E8FF`)
  - Other: Neutral Muted (`#475569` on `#F1F5F9`)

## Typography

The type system brings modern executive balance through **Hanken Grotesk** for structured headlines, titles, and high-readability body copy, paired with **JetBrains Mono** for all numerical values, monetary units, account balances, and tabular metrics.

### Typographic Principles
- **Tabular Alignment:** JetBrains Mono guarantees fixed-width numerical rendering, preventing visual jitter across dynamically shifting balance displays and transaction tables.
- **Scale Restraint:** Display sizes are reserved strictly for total portfolio value and primary modal input figures. Dense screens prioritize scannability over inflated display sizes.
- **Optical Leading:** Tightened tracking (`letter-spacing`) on headlines gives financial metrics an authoritative, editorial finish.

## Layout & Spacing

The layout is built on an adaptable 12-column grid system for desktop and tablet, converting to an ergonomic 4-column flow on mobile viewports.

### Breakpoint Structure
- **Mobile (`< 640px`):** 4 columns. Gutter: `1rem`, Outer Margin: `1rem`. Account balances and monthly metrics reflow into horizontal snap-carousels. The navigation shifts to an anchored bottom tab-bar with a floating quick-entry trigger.
- **Tablet (`640px - 1024px`):** 8 columns. Gutter: `1.25rem`, Outer Margin: `1.5rem`. Secondary summary cards pair up into 4-column modules.
- **Desktop (`> 1024px`):** 12 columns. Gutter: `1.5rem`, Outer Margin: `2.5rem`. Fixed left rails (navigation) collapse or expand; central main view holds analytical widgets (8 cols) and account balance trays alongside quick-entry rails (4 cols).

### Spacing Philosophy
Consistent adherence to an 8-point base spacing rhythm (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 16px, `space-lg` = 24px, `space-xl` = 32px, `space-2xl` = 48px). Compact form controls use internal padding of `space-sm` + `space-md`, maintaining comfortable click/touch boundaries without wasting screen real estate.

## Elevation & Depth

Visual hierarchy uses a refined **Tonal Surface System** coupled with **Low-Opacity Ambient Shadows** and **Hairline Outlines**. Rather than dark, artificial drop shadows, depth is achieved through slight variations in surface lightness and subtle ambient occlusion.

### Surface Elevation Levels
- **Level 0 (Canvas Base):** `#F8F9FA`. The uninterrupted backdrop that sets the stage for crisp white cards.
- **Level 1 (Card & Section Surfaces):** `#FFFFFF`. Outlined by a crisp 1px border (`#E2E8F0`). Enhanced by an ambient shadow: `0 1px 3px rgba(13, 59, 46, 0.04), 0 1px 2px rgba(20, 28, 36, 0.02)`.
- **Level 2 (Popovers, Select Menus, Flyouts):** `#FFFFFF` paired with an elevated ambient shadow: `0 8px 24px -4px rgba(20, 28, 36, 0.08), 0 4px 8px -2px rgba(20, 28, 36, 0.03)`, bordered by `#CBD5E1`.
- **Level 3 (Quick-Entry Modals & Dialogs):** `#FFFFFF` resting on a backdrop scrim of `#0D3B2E` at 30% opacity with a `4px` blur filter. Box shadow: `0 20px 40px -12px rgba(13, 59, 46, 0.16)`.

### Border Integrity
Every container maintains a deliberate 1px low-contrast boundary to sustain structure even on low-gamut or high-brightness displays.

## Shapes

The design system employs **Roundedness Level 2 (Rounded)**:
- Baseline elements (inputs, buttons, select triggers, table cells) carry a `0.5rem` (8px) radius.
- Standard structural surfaces (summary cards, analytical charts, ledger containers) use `rounded-lg` at `1rem` (16px).
- Modals, prominent net worth hero surfaces, and bottom-sheets on mobile viewports apply `rounded-xl` at `1.5rem` (24px).
- Small metadata tags, transaction direction badges, and filter pills leverage fully rounded geometries (`9999px`) to visually differentiate metadata from actionable input fields.

## Components

### Buttons
- **Primary:** Background `#0D3B2E`, text `#FFFFFF`, font weight 600. Focus-visible rings are rendered with 2px offset in `#10B981`. On hover, transitions smoothly to `#08261E`.
- **Secondary:** Surface `#F1F3F5`, border 1px solid `#E2E8F0`, text `#1E2A38`. On hover: surface `#E2E8F0`.
- **Destructive / Expense:** Subtle tinted variant: `#FFE4E6` background, `#BE123C` text.
- **Transfer Action:** Crisp Indigo `#4F46E5`, text `#FFFFFF`.

### Account Cards (Cash, Bank, bKash, Nagad)
- Features a header with the institution/source logo and account identifier, middle tier showing current balance formatted in `mono-currency-lg`, and footer illustrating incoming vs. outgoing rolling 30-day mini-meters.
- Subtle left accent bar (3px width) colored according to account identity (Emerald for Cash, Navy for Bank, Crimson Magenta for bKash, Ember Orange for Nagad).

### Category Badges
- Pill-shaped (`9999px` radius) with 4px vertical and 10px horizontal padding.
- Consists of a distinct 12px category icon followed by the category label in `label-md`. Strict adherence to the 8 core combinations defined in the color specification.

### Data Tables (Transaction Ledger)
- Clean, compact, zero-elevation surfaces.
- Table headers in `#64748B`, uppercase `mono-label-sm` tracking with subtle bottom border `#E2E8F0`.
- Alternating row zebra strips are avoided; rows use subtle hover feedback (`#F8FAFC`).
- Transaction values displayed in `mono-currency-md`, prefixed with `+` in Mint (`#10B981`) for credits, `-` in Coral (`#E11D48`) for debits, and `⇄` in Indigo (`#4F46E5`) for internal transfers.

### Form Inputs & Quick-Entry Modal
- **Inputs:** Height 44px, border 1px solid `#CBD5E1`, background `#FFFFFF`, text `body-md`. Focus transitions border to `#0D3B2E` with a faint 3px outer glow ring of `rgba(13, 59, 46, 0.12)`.
- **Quick-Entry Modal:** Centered overlay with swift auto-focus on a dominant currency input field (`display-lg`), segmented controls for type (`Expense`, `Income`, `Transfer`), account selector pills (Cash, Bank, bKash, Nagad), and a clean 2x4 grid for the 8 core categories.

### Checkboxes & Segmented Controls
- **Segmented Control:** Contained in a `#F1F5F9` well; active state transitions with an elevated pure white pill (`#FFFFFF`) with a faint shadow and crisp `#0D3B2E` typography.
- **Checkboxes:** 18px square with 4px border radius, border `#94A3B8`. Checked state fills `#0D3B2E` with a clean white checkmark.