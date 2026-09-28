---
name: AgroAI Bangladesh
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#41493e'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#717a6d'
  outline-variant: '#c0c9bb'
  surface-tint: '#2a6b2c'
  primary: '#00450d'
  on-primary: '#ffffff'
  primary-container: '#1b5e20'
  on-primary-container: '#90d689'
  inverse-primary: '#91d78a'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#fd8a42'
  on-secondary-container: '#682c00'
  tertiary: '#00451c'
  on-tertiary: '#ffffff'
  tertiary-container: '#005f29'
  on-tertiary-container: '#78da8b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf4a4'
  primary-fixed-dim: '#91d78a'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#0c5216'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#95f8a7'
  tertiary-fixed-dim: '#79db8d'
  on-tertiary-fixed: '#00210a'
  on-tertiary-fixed-variant: '#005323'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Noto Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Noto Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Noto Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Noto Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-bold:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  label-lg:
    fontFamily: Noto Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Noto Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for field-level utility, scientific accuracy, and absolute clarity. The user group spans rural farmers operating mobile devices under bright sunlight, agricultural extension workers, university agronomists, and home gardeners. 

The aesthetic marries **Tactile Clarity** with **Functional Modernism**:
- **Field-Ready Legibility**: Elements prioritize maximum visibility under high-glare direct sunlight. Low-contrast subtleties, hairline borders, and decorative blurs are eliminated in favor of clean surfaces, high-contrast typography, and explicit visual boundaries.
- **Empathetic Utility**: Visual feedback is reassuring, direct, and unpretentious. Diagnostic outcomes communicate severity through redundant cues—color, clear text labels, and recognizable icons—ensuring illiterate or non-technical users can evaluate risk immediately.
- **Bi-scriptural Native Rhythm**: The visual hierarchy accommodates both Bengali and Latin character scripts seamlessly, balancing script baselines and ascender/descender heights to preserve vertical harmony.

## Colors

The palette balances lush agricultural cues with rigorous accessibility constraints, adhering strictly to WCAG 2.2 Level AA and AAA standards. Light mode serves as the operational baseline for high ambient light readability outdoors.

### Core Palettes
- **Primary (`#1B5E20`)**: Deep agricultural leaf green. Used for key navigation surfaces, primary actions, and brand-level reassurance. Delivers >7:1 contrast ratio against light backgrounds.
- **Secondary (`#B45309`)**: Soil-tinted ochre amber. Reserved for cautious notifications, moderate disease risk warnings, and secondary callouts.
- **Tertiary / Success (`#15803D`)**: Healthy foliage emerald. Indicates healthy crop confirmation, verified cure steps, and safe plant parameters.
- **Danger / Severe Alert (`#B91C1C` / `#991B1B`)**: Vivid brick crimson. Designates critical infestations, rapid blight alerts, and irreversible crop threats. Never deployed alone without an associated warning symbol and descriptive label.
- **Neutral Surface Palette**:
  - Base Canvas: Warm off-white (`#F8FAF8`) reducing glare while preserving contrast.
  - Card & Container Fill: Pure white (`#FFFFFF`).
  - Dividers & Outlines: Crisp boundary stone (`#D1D5DB` to `#E5E7EB`).
  - Text Primary: Deep charcoal-slate (`#0F172A`) for effortless legibility.
  - Text Secondary: Muted stone (`#475569`).
  - Headings Accent: Deep green-black (`#064E3B`).

## Typography

The type system is powered by **Noto Sans** (pairing seamlessly with **Noto Sans Bengali** in bilingual deployments). It prioritizes consistent x-heights, distinct glyph shapes, and open counters.

- **Baseline Sizing**: To safeguard reading comfort during field deployment, body text strictly defaults to a minimum of 16px (`body-md`), scaling up to 18px (`body-lg`) in instructional workflows.
- **Font Weights**: Limited to 400 (Regular), 600 (Semi-Bold), and 700 (Bold). Ultra-light and hairline variants are strictly forbidden to prevent wash-out on low-tier mobile panels.
- **Bilingual Stacking**: When Bengali and English labels appear simultaneously, the primary language retains `headline-md` or `title-lg`, with the secondary subtitle styled in `label-md` or `body-md` muted stone (`#475569`).

## Layout & Spacing

A mobile-first fluid grid anchors all layouts, reflowing progressively into focused workstation layouts on tablet and desktop surfaces.

- **Grid Architecture**:
  - **Mobile (< 640px)**: 4 columns, 16px (`margin`) outer edge, 16px (`gutter`) column gaps.
  - **Tablet (640px – 1024px)**: 8 columns, 24px outer edge, 20px column gaps. Max container centered at 768px for single-task capture flows.
  - **Desktop (> 1024px)**: 12 columns, 32px (`margin-desktop`) outer padding, 24px (`gutter-desktop`) gutters, max-width constrained to 1200px to maintain scannable diagnostic reports.
- **Touch Target Discipline**: Interactive elements enforce an absolute bounding box minimum of 48×48px. Hit targets on icons and switches expand via transparent tap envelopes if visual sizes are smaller.

## Elevation & Depth

To maximize battery efficiency and visibility on budget smartphone LCD screens under sunlight, depth is constructed via **tactile layering and crisp boundary strokes** rather than heavy ambient blurs.

- **Level 0 (Canvas Base)**: `#F8FAF8` background. Flat, zero elevation.
- **Level 1 (Card & Content Blocks)**: Surface `#FFFFFF` bordered by a 1px solid line (`#E5E7EB`). A subtle non-blurred directional drop: `0px 1px 2px rgba(15, 23, 42, 0.06)`.
- **Level 2 (Diagnostic Summaries & Sticky Actions)**: `#FFFFFF` card surface wrapped in 1px solid `#D1D5DB` with elevation `0px 4px 6px -1px rgba(15, 23, 42, 0.08)`.
- **Level 3 (Modals, Action Sheets & Camera Overlays)**: Surface `#FFFFFF` lifted with `0px 10px 15px -3px rgba(15, 23, 42, 0.12)`, anchored by a 40% opacity neutral-slate scrim (`rgba(15, 23, 42, 0.40)`).

## Shapes

The design system incorporates a standardized **Rounded (`roundedness: 2`)** aesthetic. Radii remain soft and friendly to build human warmth and trust, without becoming playful or toy-like.

- Standard buttons, form fields, and inline alerts utilize `8px` (`0.5rem`) corner rounding.
- Diagnostic overview cards, image capture preview viewfinders, and bottom sheets employ `16px` (`1rem`).
- Badges, status pills, and toggle indicators apply fully pill-shaped caps (`9999px`).

## Components

### Buttons
- **Primary Button**: Deep agricultural green background (`#1B5E20`), crisp white text, min-height 52px, full width on mobile viewports. Active state shifts to `#144617`. Focus ring features a 2px offset border in emerald green (`#15803D`).
- **Secondary Button**: Solid white container with 2px stroke in `#1B5E20` and matching `#1B5E20` text. Never uses thin 1px borders to prevent vanishing under bright glare.
- **Warning / Destructive Button**: Background `#B91C1C` with white typography for irreversible actions; soft brick tint (`#FEF2F2`) with 1.5px stroke `#B91C1C` for secondary confirmations.

### Disease Diagnostic & Results Card
- Structured into three explicit vertical blocks:
  1. **Visual Reference Thumbnail**: 1:1 aspect ratio thumbnail with zoom toggle.
  2. **Diagnostic Title & Severity Pill**: Bilingual text heading (`ধানের ব্লাস্ট রোগ / Rice Blast`) paired with an icon-anchored badge (e.g., triangle alert icon + 'উচ্চ ঝুঁকি / High Risk').
  3. **Confidence Meter Bar**: High-contrast track (`#E5E7EB`) filled with corresponding outcome color (Danger crimson `#B91C1C`, Amber caution `#B45309`, or Success emerald `#15803D`), accompanied by large, explicit text (`94.5% নিশ্চিত`).

### Badges & Risk Chips
- Always combine an SVG symbol (Checkmark, Alert Triangle, Info Octagon) with descriptive localized copy. Never convey state by color alone.
- High Risk: Red fill (`#FEF2F2`), border (`#FCA5A5`), text/icon (`#991B1B`).
- Moderate Risk: Amber fill (`#FFFBEB`), border (`#FCD34D`), text/icon (`#B45309`).
- Safe / Healthy: Emerald fill (`#F0FDF4`), border (`#86EFAC`), text/icon (`#15803D`).

### Inputs & Field Controls
- Minimum height 48px, 1.5px border (`#D1D5DB`) resting, darkening to 2px `#1B5E20` on active focus.
- Labels sit permanently visible above the input (`body-bold`) rather than relying on floating placeholders that fade away.

### Photo Capture & Viewfinder Target
- Camera viewport features high-contrast white corner guidelines with a deep slate semi-opaque frame.
- Center instructional pill advises lighting conditions: "পর্যাপ্ত আলোতে পাতার ছবি তুলুন" (Take photo of leaf in bright light).
- Large shutter trigger button at bottom center (72×72px) with green accent ring.

### Mobile Bottom Navigation
- Fixed 64px height bar docked at bottom edge with pure white fill and top border (`#E5E7EB`).
- Comprises 4 primary destinations: Home/Dashboard (নীড়), Camera Scan (রোগ নির্ণয় - elevated center trigger), History Log (ইতিহাস), and Agronomist Advisory (পরামর্শ).
- Minimum touch area per item: 48×56px with active state highlighted in deep foliage green.