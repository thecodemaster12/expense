# Design System — "Calm Wealth Ledger"

Sources: `designmd/DESIGN.md` (**source of truth**), `designmd/calm_wealth_ledger_design.md` (background only), and the Stitch screens in `temp-layouts/` (layout reference only).

Where they disagree:
- The **prose** in `DESIGN.md` wins over its YAML frontmatter. For example, primary is `#0D3B2E`, not `#00241a`, which matches the Stitch screens.
- Category **names** come from `CLAUDE.md`. Only the colors come from the design.
- Stitch features outside v1 (reconcile, budgets, notifications, Nagad, batch entry, search) are deferred. See `plan.md` Phase 4.
- Money shows whole taka (`৳5,000`), never `.00`.

## Feel

Calm, ordered, trustworthy. Lots of whitespace, hairline borders, soft tinted surfaces. No heavy shadows or gradients.

## Colors (light)

| Token | Hex | Use |
|---|---|---|
| primary | `#0D3B2E` | Main buttons, active nav, brand |
| primary-hover | `#08261E` | |
| secondary | `#1E2A38` | Secondary text and headers |
| transfer | `#4F46E5` | Transfers (`⇄`) |
| income | `#10B981` on `#D1FAE5` | Inflows (`+`) |
| expense | `#E11D48` on `#FFE4E6` | Outflows (`−`) |
| canvas | `#F8F9FA` | Page background |
| surface | `#FFFFFF` | Cards |
| surface-muted | `#F1F3F5` | Wells, segmented control |
| border | `#E2E8F0` | Card borders |
| border-input | `#CBD5E1` | Inputs |
| text-muted | `#64748B` | Table headers, labels |

Account accents (3px left bar on account cards): Cash `#0D3B2E`, Bank `#1E2A38`, bKash `#D12053`. New accounts get the neutral `#475569`.

Category badges (text on background):

| Category | Colors |
|---|---|
| Rent | `#4338CA` on `#EEF2FF` |
| Food | `#B45309` on `#FEF3C7` |
| Electricity & Bills | `#334155` on `#F1F5F9` |
| Travel | `#0369A1` on `#E0F2FE` |
| Shopping | `#BE123C` on `#FFE4E6` |
| Health | `#0F766E` on `#CCFBF1` |
| Family | `#7E22CE` on `#F3E8FF` |
| Other / new | `#475569` on `#F1F5F9` |
| Income categories | income colors |

Dark mode (Phase 3) redefines the same tokens as CSS variables. Components never use raw hex values.

## Typography

- **Hanken Grotesk**: all UI text.
- **JetBrains Mono**: every number and money value, so the digits line up.
- Icons: Material Symbols Outlined (as in the Stitch screens).

| Token | Size / line | Weight | Use |
|---|---|---|---|
| display | 40/48 (mobile 30/38) | 700 | Add-screen amount, hero total |
| headline | 28/36 (mobile 22/30) | 600 | Page titles |
| title | 16/24 | 600 | Card titles |
| body | 14/20 | 400 | Default text |
| body-sm | 12/16 | 400 | Meta text |
| label | 13/18 | 500 | Chips, buttons |
| money-lg | 24/32 mono | 600 | Card balances |
| money-md | 14/20 mono | 500 | Ledger rows |
| mono-label | 11/14 mono, uppercase, +0.04em | 500 | Table headers, card labels |

## Spacing and shape

- 8px rhythm: 4, 8, 16, 24, 32, 48.
- Page gutter: 16px on mobile, 24px on tablet, 40px on desktop.
- Radius: 8px for inputs and buttons, 16px for cards, 24px for sheets and modals, full for chips and badges.
- Card: white, 1px `#E2E8F0` border, shadow `0 1px 3px rgba(13,59,46,.04), 0 1px 2px rgba(20,28,36,.02)`.
- Modal/sheet: scrim `#0D3B2E` at 30% with 4px blur.

## Layout

- **Mobile (< 640px):** bottom tab bar (Dashboard, Transactions, Accounts, Settings) and a floating "+" button. Cards stack, and account balances become a horizontal snap row.
- **Tablet (640–1024px):** summary cards sit in pairs.
- **Desktop (> 1024px):** 240px left sidebar, content max width about 1280px, and "+ Log Transaction" in the top bar.

## Key components (in `src/client/ui/`)

- **Button**: primary, secondary, danger (rose tint), transfer (indigo).
- **SegmentedControl**: a `#F1F5F9` well with the active option as a white pill. Used for Expense / Income / Transfer.
- **Chip**: for category and account pickers. When selected, it's filled primary.
- **Badge**: pill for category and transaction type.
- **Money**: renders `formatTaka()` in mono, with the sign and color by type (`+` income, `−` expense, `⇄` transfer).
- **Card**, **Sheet** (mobile bottom sheet / desktop modal), **Toast** (with Undo).
- **Input**: 44px tall, `#CBD5E1` border, primary border plus a 3px soft ring on focus.

## Screen references

- Dashboard → `temp-layouts/dashboard_monthly_view/` (drop the reconcile banner and budget bars for v1)
- Transactions → `temp-layouts/all_transactions_ledger/` (on mobile, rows grouped by day instead of a table)
