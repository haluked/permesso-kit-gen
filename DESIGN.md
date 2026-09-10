# Design System (Gov-Tech Refactoring)

## 1. Core Philosophy
The Italian Permesso di Soggiorno application needs to project authority, simplicity, and clarity. The design should mimic modern European government portals (e.g., GOV.UK, AgID - Agenzia per l'Italia Digitale).

- **Simplicity:** No unnecessary shadows, gradients, or heavy borders.
- **Clarity:** Clear visual hierarchy, accessible contrast, straightforward typography.
- **Consistency:** Uniform spacing, sizing, and alignment.

## 2. Typography
- **Primary Font:** `Inter`, fallback to system fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`).
- **Monospace Font:** `JetBrains Mono` or `ui-monospace` for ID, passport numbers, and codes.
- **Font Sizes:**
  - `h1` / `h2`: 24px - 20px, `font-weight: 600`
  - `h3` (Section Titles): 16px, `font-weight: 600`
  - `label`: 13px, `font-weight: 500`
  - `input` / `select`: 14px, `font-weight: 400`
  - `hint` / `small`: 12px, `color: #64748b`

## 3. Color Palette (Slate/Zinc Neutral)
- **Backgrounds:**
  - Body: `#f8fafc` (Slate 50)
  - Cards (Sections): `#ffffff` (White)
  - Inputs (default): `#ffffff`
  - Inputs (disabled/readonly): `#f1f5f9` (Slate 100)
- **Borders:**
  - Standard border: `#cbd5e1` (Slate 300)
  - Input focus border: `#3b82f6` (Blue 500)
  - Section border: `#e2e8f0` (Slate 200)
- **Text:**
  - Primary text: `#0f172a` (Slate 900)
  - Secondary text / Labels: `#334155` (Slate 700)
  - Placeholders: `#94a3b8` (Slate 400)
- **Accents:**
  - Focus Ring: `rgba(59, 130, 246, 0.5)` (Blue 500, 50% opacity)
  - Primary Button: `#1d4ed8` (Blue 700)
  - Primary Button Hover: `#1e40af` (Blue 800)

## 4. Spacing Scale
- 4px, 8px, 12px, 16px, 24px, 32px
- Card padding: `24px`
- Form row gap: `16px`
- Form group internal gap (label to input): `6px`

## 5. Form Elements & Layout
- **Inputs:** Fixed height of `38px`. Padding `8px 12px`.
- **Labels:** Block-level, consistent height or flex-grow handling to ensure inputs align at the bottom.
- **Grid System:** CSS Grid instead of float-based or complex flex row wrapping.
  - Using `display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px;`
  - `.col-1` to `.col-12` spanning.
  - When labels have different lengths (wrapping to 2 lines), the grid should align items at the end (bottom) so the input fields are perfectly horizontal.
  - Implementation:
    ```css
    .form-row {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 16px;
      margin-bottom: 16px;
      align-items: end; /* Ensures inputs align at the bottom */
    }
    .col-6 { grid-column: span 6; }
    .col-4 { grid-column: span 4; }
    .col-8 { grid-column: span 8; }
    .col-3 { grid-column: span 3; }
    ```
- **Form Group:**
  ```css
  .form-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
  }
  ```

## 6. Removal of "AI Slop"
- Remove excessive card backgrounds (like `.subcard` with heavy styles).
- Remove unnecessary multi-colored gradients or borders.
- Keep the `info-tag` minimal, e.g., an inline gray circle or a simple underline.

## 7. Critical Preservation
- Do not alter `id="..."` attributes on any inputs or buttons.
- Do not alter `data-i18n` or `data-i18n-placeholder` attributes.
- Ensure the right panel (preview) and PDF generation are untouched.
