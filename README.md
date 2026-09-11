# The MVO Planner — Hagen Growth

A planning tool for temporarily adjusting existing commitments to the capacity
you actually have. "MVO" is *minimum viable output*: the smallest version of a
commitment that meaningfully supports a priority during a demanding period.

The planner walks through five short steps — choose what matters, define the
smaller version, check the fit, decide when to use it, plan the review — and
produces a plan you can read, print, copy or back up. Pausing a priority is a
first-class option; nothing here pushes you to keep everything going.

Everything stays in the browser. There is no account, no backend, no analytics,
no external fonts, and nothing you type is sent anywhere.

## Running it

```bash
npm install
npm run dev        # development server, prints a local URL
```

Other scripts:

```bash
npm run build      # typecheck, then build the static site into dist/
npm run preview    # serve the built site
npm run typecheck  # TypeScript only
npm run test       # Vitest suite (30 tests)
```

## Publishing (GitHub Pages)

Pages is set to **GitHub Actions** as its source. `.github/workflows/deploy.yml`
runs on every push to this branch (and on `main`, if the work lands there): it
installs dependencies, typechecks, runs the test suite, builds, and publishes
`dist/` to Pages. A failing test or typecheck stops the deploy.

Nothing built is committed — push your source changes and the site follows. You
can also re-run it by hand from the repository's **Actions** tab
("Build and deploy to GitHub Pages" → *Run workflow*).

Locally, `npm run build` produces the same static bundle in `dist/`, and
`npm run preview` serves it. The build uses relative asset paths, so it works
both at a domain root and under a project path such as `/MVO_planner_test/`.

## Where to edit things

| What | File |
| --- | --- |
| **All user-facing copy** — headings, questions, labels, examples, error messages, the finished-plan labels | `src/content/copy.ts` |
| **Colours, type scale, spacing, radii, motion** | `src/styles/tokens.css` |
| Element defaults, buttons, fields, option cards, chips | `src/styles/base.css` |
| Page layout, planner grid, preview, finished plan | `src/styles/app.css` |
| Print / save-as-PDF rules | `src/styles/print.css` |
| Which answers are required, and the messages they use | `src/lib/validation.ts` |
| The plain-text version used by "Copy plan" | `src/lib/planText.ts` |

No component hard-codes a sentence: changing wording means editing
`src/content/copy.ts` only. Likewise, no component hard-codes a colour or a
font — every rule reads a token from `src/styles/tokens.css`.

### Colours

The tokens in `:root` are the brand palette:

| Token | Value | Use |
| --- | --- | --- |
| `--color-page` | `#F7F5F0` | page background |
| `--color-surface` | `#FFFFFF` | cards and inputs |
| `--color-text` | `#252A27` | main text |
| `--color-text-secondary` | `#59625C` | secondary text |
| `--color-primary` | `#315746` | primary actions, selected states, focus rings |
| `--color-primary-hover` | `#244335` | primary hover |
| `--color-surface-pale` | `#E9EFE8` | pale green surface |
| `--color-border` | `#D8DDD5` | dividers and card edges |
| `--color-accent` | `#B58B4B` | decorative ochre rules only, never small text |
| `--color-error` | `#A3342B` | error text |

Two derived tokens sit alongside them: `--color-border-strong` outlines
interactive controls (the brand border is too light to meet the 3:1 ratio WCAG
asks of UI components), and `--color-placeholder` darkens placeholder text to
4.9:1. Every text pairing in the app is at or above 5.4:1.

### Typography

System fonts only, so nothing is fetched at load:

- `--font-sans` for interface, labels, navigation and buttons.
- `--font-serif` (Georgia) for the main title and major headings, used
  sparingly.

Body text is 16px with a 1.6 line height. The 13px `--text-xs` is reserved for
uppercase micro-labels; form labels, hints and error messages are all 16px.

## How it behaves

- **Autosave.** Every change is written to `localStorage` under a versioned
  schema (`SCHEMA_VERSION` in `src/types.ts`). Reloading offers "Continue my
  plan".
- **Storage that fails.** If the browser blocks storage or the quota is full,
  the planner still works and says plainly that answers may be lost, pointing
  at the backup download. It never claims to have saved something it didn't.
- **Backups.** "Download backup" exports a versioned JSON file. "Restore
  backup" validates the file, shows what it contains, and asks for confirmation
  before replacing anything. An invalid file, or one from a newer schema
  version, changes nothing.
- **Dates** are handled as local calendar dates (`YYYY-MM-DD`), never parsed as
  UTC, so a review date cannot shift a day across time zones.
- **User input** is rendered as text by React; nothing is injected as markup.
- **Print.** `Print / save as PDF` opens the browser print dialog. The print
  stylesheet drops navigation, buttons and page chrome, prints on white, and
  keeps each priority card on one page.

## Accessibility

Semantic HTML throughout, persistent visible labels, native radio and checkbox
controls (so arrow keys and Space behave as expected), a visible focus ring on
every control, a skip link, an `aria-live` step announcement, a progress bar
with `aria-valuetext`, and validation messages both beside each field and in a
focusable summary at the top of the step. Focus moves to the new step on
navigation and to the error summary when validation fails. Motion respects
`prefers-reduced-motion`.

## Tests

`npm run test` covers the flows that matter: creating a plan with one priority
and with three (including a paused one), navigating backwards without losing
answers, restoring a draft after a refresh, confirming before clearing work,
storage being unavailable, input escaping, copy and print, backup export and
restore, invalid and newer-version backups leaving current work untouched, and
the local-date and validation rules.

The mobile viewport and keyboard-only paths were verified in Chromium against
the built site.
