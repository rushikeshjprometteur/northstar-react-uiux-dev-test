# Northstar Dashboard — UI/UX Audit Changelog

> **Auditor:** Senior UI/UX & Frontend Developer  
> **Date:** 22 May 2026  
> **Scope:** Full audit and remediation of the React + Vite operations dashboard  
> **Build:** ✅ Clean — `npm run build` (0 errors) · `npm run lint` (0 errors, 0 warnings)

---

## Executive Summary

I audited the Northstar dashboard across all **7 pages**, **3 components**, and the full **CSS + config stack**. The codebase contained **8 critical bugs**, **12 high-priority UX issues**, and **24 medium-priority polish gaps** — all deliberately embedded as real-world anti-patterns.

Every issue has been fixed. The dashboard is now **responsive**, **keyboard-accessible**, **properly validated**, and **lint-clean**. The look remains simple and professional — no redesign, just solid engineering that makes the existing design actually work.

---

## ✅ Point 1 — Clearer Layouts and Behavior on Mobile and Desktop

### What was broken
- A hardcoded `min-width: 720px` on the Dashboard's "Project health" panel caused **horizontal scrolling on any screen under ~1100px** — which includes most laptops.
- The mobile sidebar had `z-index: 4` while the topbar had `z-index: 5`, so the **navigation menu rendered behind the header** on screens under 900px — making it impossible to navigate.
- No backdrop/overlay existed when the sidebar was open, so users could accidentally interact with content behind the menu.
- Invoice cards, team cards, and stat grids didn't collapse gracefully at intermediate widths.

### What I fixed

| Before | After |
|--------|-------|
| `.oversized-panel { min-width: 720px }` forces overflow | Removed — panel flows naturally at any width |
| Sidebar z-index: 4 (behind topbar at 5) | Sidebar z-index: **25** — always on top when open |
| No overlay on mobile sidebar | Added `.sidebar-overlay` — semi-transparent backdrop, click-to-dismiss |
| Grids collapse only at 900px | Added **640px breakpoint** — invoice cards go 2-col, team cards stack, buttons span full width |
| `translateZ(0)` on odd panels creating GPU compositing artifacts | Removed entirely |

**Files:** [broken-layout.css](file:///c:/Work/RnD/react-uiux-dev-test/src/styles/broken-layout.css), [global.scss](file:///c:/Work/RnD/react-uiux-dev-test/src/styles/global.scss#L573-L605), [main.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/main.jsx#L63-L70)

---

## ✅ Point 2 — Better Accessibility: Focus, Labels, Modals, Keyboard Use

### What was broken
- **Every focus outline was removed globally** via `outline: none` on all focusable elements — a WCAG 2.4.7 violation that made the app invisible to keyboard users.
- The modal had **3 critical a11y failures**: no Escape cleanup (listeners accumulated), clicking inside closed it (propagation bug), and no focus trap (Tab escaped into background content).
- No `aria-label` on the search input, theme toggle, checkboxes, chart bars, or capacity meters.
- Table headers had no `scope` attribute. Health bars used `<i>` (italic semantics) as a layout element.

### What I fixed

| Element | Before | After |
|---------|--------|-------|
| **All focusable elements** | `outline: none` | `:focus-visible` ring — `2px solid #5750ec`, only on keyboard navigation |
| **Modal** | No Escape cleanup, click-through, no focus trap | Proper `useEffect` cleanup, `stopPropagation()`, Tab/Shift+Tab cycling, focus save/restore |
| **Modal semantics** | Close button says "x", no `aria-labelledby` | Close says "×" with `aria-label="Close dialog"`, `aria-labelledby="modal-title"` |
| **Search input** | No label | `aria-label="Search across all pages"`, `type="search"` |
| **Theme toggle** | No accessible name | `aria-label="Switch to dark/light mode"` |
| **Table checkboxes** | No label | `aria-label="Select {project name}"` |
| **Health bars** | `<i>` element, no ARIA | `<div>` with `role="progressbar"`, `aria-valuenow/min/max` |
| **Capacity meters** | No ARIA | `role="progressbar"` with `aria-label="{name} capacity"` |
| **Chart bars** | No accessible description | `aria-label="January: £43,000 revenue"` |
| **Table headers** | No scope | `scope="col"` on all `<th>` |
| **Active nav item** | No indicator for screen readers | `aria-current="page"` |
| **Screen-reader-only text** | `.sr-only` class used but not defined | Added full `.sr-only` utility class |

**Files:** [BuggyModal.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/components/BuggyModal.jsx), [broken-layout.css](file:///c:/Work/RnD/react-uiux-dev-test/src/styles/broken-layout.css#L33-L41), [global.scss](file:///c:/Work/RnD/react-uiux-dev-test/src/styles/global.scss#L15-L26), [Dashboard.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Dashboard.jsx), [Projects.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Projects.jsx), [Team.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Team.jsx), [main.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/main.jsx)

---

## ✅ Point 3 — More Consistent Navigation, Search, and Feedback

### What was broken
- Hash routing **broke with query strings** — `#/team?tab=active` didn't match `/team`, silently falling back to Dashboard.
- The `hashchange` event listener **leaked** — cleanup used a different function reference, so listeners accumulated on each hot reload.
- **Global search only partially worked** — Dashboard had a case-sensitivity bug, Projects had a stale `useMemo` dependency, and Team/Billing/Reports/Support ignored the search prop entirely.
- **No feedback** when filters returned empty results — users saw blank panels with no explanation.
- Projects and Billing both used `ShoppingBag` icon — visually identical in the nav.

### What I fixed

| Before | After |
|--------|-------|
| `#/team?tab=active` → page not found | Query strings stripped via `.split('?')[0]` — route matches correctly |
| Listener cleanup creates new function | Cleanup removes exact `onHashChange` reference — no leaks |
| Search works on 2/7 pages | **Search works on all 7 pages** — filters by name, role, client, month, ticket title |
| Dashboard search case-sensitive | All searches use `.toLowerCase()` on both sides |
| Projects `useMemo` ignores `search` | Added `search` to dependency array — results update immediately |
| Empty filters show blank space | **Empty states** on Dashboard, Projects, Team, Billing, Support with clear messaging |
| Projects + Billing both use ShoppingBag | Projects → `FolderKanban`, Billing → `CreditCard` |
| Toast says "Settings saved, maybe." | Toast says "Settings saved successfully." with `role="status"` for screen readers |

**Files:** [main.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/main.jsx#L26-L30), [Dashboard.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Dashboard.jsx), [Projects.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Projects.jsx), [Team.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Team.jsx), [Billing.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Billing.jsx), [Support.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Support.jsx), [Reports.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Reports.jsx)

---

## ✅ Point 4 — Cleaner CSS Organization and Fewer Layout Surprises

### What was broken
- `global.scss` was 87 lines of flat CSS with **zero comments or organization**, one SCSS variable used, and the brand color `#5750ec` hardcoded 6+ times.
- `broken-layout.css` contained **5 intentional bugs** — all requiring removal or fix.
- Tailwind v4 was configured with a v3-style `tailwind.config.js` that **wasn't being loaded** (missing `@config` directive), and a **bogus plugin** `typography-stylecss` that doesn't exist.
- **5 CSS classes used in JSX had no definitions**: `.toggle-row`, `.header-action`, `.compact`, `.health-list`, `.sr-only`.
- Font-family referenced `Inter` but **never imported it** — users saw system fallbacks.
- All build tools (`vite`, `sass`, `postcss`) were in `dependencies` instead of `devDependencies`.
- No transitions on any interactive elements — the UI felt dead.

### What I fixed

| Area | Before | After |
|------|--------|-------|
| **CSS architecture** | 87 lines of flat CSS, no organization | **619 lines** with SCSS tokens, section comments, organized by component |
| **Design tokens** | `#5750ec` hardcoded 6x | `$brand`, `$brand-hover`, `$ink`, `$muted`, `$border`, `$bg`, `$surface`, `$radius`, `$shadow` |
| **Font** | `Inter` referenced but never loaded | `@import url('fonts.googleapis.com/...')` — properly loaded |
| **Buttons** | All buttons identical purple | **3 variants**: `.primary-btn` (brand), `.secondary-btn` (neutral), `.danger-btn` (red) |
| **Transitions** | None | 150ms on buttons (hover/active), inputs (focus glow), nav items, chart bars, modals (fadeIn + slideUp) |
| **Tailwind config** | v3 config not loaded by v4 | Added `@config` directive + fixed `@tailwindcss/typography` plugin |
| **Missing classes** | 5 classes with no CSS | All defined: `.toggle-row`, `.header-action`, `.compact`, `.health-list`, `.sr-only`, `.empty-state`, `.sidebar-overlay` |
| **Dark mode** | 4 selectors | **22 selectors** — complete coverage for panels, modal, chart labels, toast, avatars, table borders, danger rows |
| **Dependencies** | All in `dependencies` | Build tools moved to `devDependencies` |
| **broken-layout.css** | 5 intentional bugs | All removed — clean dark-mode overrides, focus rings, responsive rules |

**Files:** [global.scss](file:///c:/Work/RnD/react-uiux-dev-test/src/styles/global.scss), [broken-layout.css](file:///c:/Work/RnD/react-uiux-dev-test/src/styles/broken-layout.css), [tailwind.css](file:///c:/Work/RnD/react-uiux-dev-test/src/styles/tailwind.css), [package.json](file:///c:/Work/RnD/react-uiux-dev-test/package.json), [index.html](file:///c:/Work/RnD/react-uiux-dev-test/index.html)

---

## ✅ Point 5 — Basic Validation and Empty States Where Forms Matter

### What was broken
- **Settings form**: Mixed controlled (`value`) and uncontrolled (`defaultValue`) inputs. The Timezone `onChange` was missing. The checkbox had no `onChange`. The Density dropdown's `setSettings({ density })` **erased all other fields**.
- **Billing discount**: String subtraction (`total - "500"`) produced `NaN` or concatenated strings. Any non-numeric input broke the calculation.
- **Support tickets**: Empty tickets could be created repeatedly with no validation.
- **Team remove**: `splice()` mutated the state array directly, then set the same reference — React skipped re-render, so the button appeared broken. No confirmation dialog.
- **Project checkboxes**: `toggle()` used a stale closure — fast clicks produced duplicate IDs and checkboxes couldn't be unchecked.
- **Dashboard textarea**: Uncontrolled `defaultValue` — content lost on any re-render.

### What I fixed

| Form | Before | After |
|------|--------|-------|
| **Settings** | Mixed controlled/uncontrolled, state overwrite | Fully controlled inputs, `updateField(key, value)` helper preserves all state, company-required validation |
| **Billing discount** | String subtraction → NaN | `parseFloat()` with NaN guard, regex validation for numeric-only input, `Math.max(0, ...)` prevents negative totals |
| **Support tickets** | Empty titles accepted | Required validation with error message, clear on input change, Enter key submission, priority selector |
| **Team remove** | `splice()` mutation, no confirmation | `filter()` creates new array, `window.confirm()` before destructive action, capacity capped at 100% visually with ⚠️ overload warning |
| **Project checkboxes** | Stale closure, no uncheck | Functional `setSelected(prev => ...)` with proper `includes()`/`filter()` toggle |
| **Dashboard textarea** | `defaultValue` (uncontrolled) | `value` + `onChange` (controlled) — content persists across renders |
| **Empty states** | Blank space on no results | Clear messages: "No projects match the current filters", "No tickets found", etc. on 5 pages |

**Files:** [Settings.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Settings.jsx), [Billing.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Billing.jsx), [Support.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Support.jsx), [Team.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Team.jsx), [Projects.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Projects.jsx), [Dashboard.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Dashboard.jsx)

---

## ✅ Point 6 — Linting and Accessibility Testing (Optional)

### What existed
The project had a placeholder lint script:
```json
"lint": "echo \"No linter configured on purpose. Candidates should add/fix this.\" && exit 0"
```

### What I added

**ESLint 9** with flat config and three plugins:

| Plugin | Purpose | Why it matters |
|--------|---------|---------------|
| `eslint-plugin-react` | React-specific rules (jsx-key, hooks rules, no-unescaped-entities) | Catches React anti-patterns at write-time |
| `eslint-plugin-react-hooks` | `rules-of-hooks` + `exhaustive-deps` | Prevents the exact bugs this codebase had (stale closures, missing deps) |
| `eslint-plugin-jsx-a11y` | Accessibility rules (missing labels, roles, focus, interactive elements) | Catches WCAG violations automatically — the kind that caused half the issues in this codebase |

**Results after fixes:**
```
$ npm run lint
✅ 0 errors, 0 warnings across all 11 source files
```

**New scripts:**
```json
"lint": "eslint src/",
"lint:fix": "eslint src/ --fix"
```

**Files:** [eslint.config.js](file:///c:/Work/RnD/react-uiux-dev-test/eslint.config.js) (NEW), [package.json](file:///c:/Work/RnD/react-uiux-dev-test/package.json)

---

## Files Modified (17 total)

| File | Type | Key Changes |
|------|------|-------------|
| [index.html](file:///c:/Work/RnD/react-uiux-dev-test/index.html) | HTML | Meta description, favicon, title |
| [package.json](file:///c:/Work/RnD/react-uiux-dev-test/package.json) | Config | Fixed deps, devDeps split, lint scripts, typography plugin |
| [eslint.config.js](file:///c:/Work/RnD/react-uiux-dev-test/eslint.config.js) | Config | **NEW** — ESLint 9 flat config with React + a11y plugins |
| [tailwind.css](file:///c:/Work/RnD/react-uiux-dev-test/src/styles/tailwind.css) | CSS | Fixed v4 config, typography plugin |
| [global.scss](file:///c:/Work/RnD/react-uiux-dev-test/src/styles/global.scss) | SCSS | Complete rewrite — tokens, transitions, missing classes, dark mode, .sr-only |
| [broken-layout.css](file:///c:/Work/RnD/react-uiux-dev-test/src/styles/broken-layout.css) | CSS | Removed 5 intentional bugs, added focus rings, extended dark mode |
| [main.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/main.jsx) | React | Routing fix, listener cleanup, overlay, ARIA, distinct icons |
| [BuggyModal.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/components/BuggyModal.jsx) | React | Focus trap, Escape cleanup, click propagation, ARIA dialog |
| [PageHeader.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/components/PageHeader.jsx) | React | Semantic `<header>`, conditional rendering |
| [StatCard.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/components/StatCard.jsx) | React | Trend arrows, ARIA label |
| [Dashboard.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Dashboard.jsx) | React | Controlled textarea, search fix, empty state, semantic HTML |
| [Projects.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Projects.jsx) | React | useMemo deps, toggle fix, empty state, checkbox labels |
| [Team.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Team.jsx) | React | State mutation fix, search, capacity cap, confirm dialog |
| [Reports.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Reports.jsx) | React | Accessible chart bars, dynamic max, search filtering |
| [Billing.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Billing.jsx) | React | Discount math, input validation, search, empty state |
| [Settings.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Settings.jsx) | React | Fully controlled form, validation, state spread fix |
| [Support.jsx](file:///c:/Work/RnD/react-uiux-dev-test/src/pages/Support.jsx) | React | Validation, priority selector, key fix, search, empty state |

---

## What I'd Do Next (With More Time)

1. **Add React Router** — Replace the hand-rolled hash router with `react-router-dom` for nested routes, route params, lazy loading, and URL-based state.

2. **Component-level CSS modules** — Split `global.scss` into `Sidebar.module.scss`, `Modal.module.scss`, etc. to scope styles per component and eliminate specificity conflicts permanently.

3. **Toast/notification system** — Replace the inline `<p>` toast with a portal-based component that supports animation, auto-dismiss, stacking, and different severity levels.

4. **End-to-end tests with Playwright** — Automate the manual verification: modal interactions, form validation flows, responsive breakpoints, keyboard navigation paths.

5. **Pin dependency versions** — All dependencies still use `"latest"`. I'd lock them with `package-lock.json` for reproducible builds.

6. **`prefers-color-scheme` support** — Auto-detect OS dark mode preference and sync with the manual toggle.

7. **Loading & error states** — Add skeleton screens for data loading, and an `ErrorBoundary` component for graceful failure handling.

8. **Accessibility audit with axe-core** — Run automated WCAG 2.1 AA compliance testing in CI to catch regressions.

9. **Performance** — Add `React.lazy()` + `Suspense` for route-based code splitting, and review memoization strategy.

10. **Storybook** — Document components in isolation for design QA and developer reference.
