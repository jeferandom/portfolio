# Design Principles

Project-agnostic principles for building better software.

---

## 1. Layout Stability (CLS)

**Category:** UI/UX

Cumulative Layout Shift measures visual stability. Pages should feel solid — elements shouldn't jump around as content loads.

**Rules:**
- Always set explicit `width` and `height` on images and media
- Reserve space for dynamic content (ads, embeds, lazy-loaded sections)
- Avoid inserting content above existing content after page load
- Use CSS `aspect-ratio` or container dimensions to prevent reflow

**Why:** Users lose trust when UI moves unexpectedly. It causes misclicks and feels broken.

---

## 2. Single Responsibility

**Category:** Code Design

Each module, function, or component should have one reason to change.

**Rules:**
- A function does one thing. If you use "and" to describe it, split it
- Components render one concern (not a form + its API call + its validation)
- Services handle one domain, not cross-cutting everything

**Why:** Easier to test, debug, refactor, and reason about.

---

## 3. Separation of Concerns

**Category:** Architecture

Distinct layers handle distinct responsibilities. Don't mix them.

**Rules:**
- UI layer doesn't know about database queries
- Business logic doesn't depend on framework specifics
- Data fetching is separate from data transformation
- Configuration lives outside code

**Why:** Changes in one layer shouldn't cascade through the entire system.

---

## 4. Progressive Enhancement

**Category:** UX

Build from the baseline up. Core functionality works everywhere, enhancements layer on top.

**Rules:**
- Content is accessible without JavaScript
- Forms submit without JS enabled
- Navigation works with basic HTML
- Enhancements (animations, transitions) are additive, not required

**Why:** Resilience. Your app works on bad networks, old devices, and assistive tech.

---

## 5. Don't Repeat Yourself (DRY) — With Taste

**Category:** Code Design

Duplication is a risk, but not all repetition is bad.

**Rules:**
- Extract shared logic when it diverges (not before)
- Prefer composition over copying
- Magic numbers and strings get named constants
- If two things change for the same reason, unify them. If they change for different reasons, let them repeat

**Why:** Premature abstraction is worse than duplication. Abstract at the right time, not the first time.

---

## 6. Component-Based Architecture

**Category:** Architecture

UI is built from composable, self-contained units.

**Rules:**
- Components own their state and rendering
- Props flow down, events flow up
- Components are reusable by design, not by accident
- Keep component files small — if it's over 200 lines, it's doing too much

**Why:** Reusability, testability, and maintainability at scale.

---

## 7. Accessibility First

**Category:** UX

Accessibility isn't a feature — it's a baseline requirement.

**Rules:**
- Semantic HTML before divs (`button`, `nav`, `main`, `article`)
- All interactive elements are keyboard-navigable
- Images have meaningful `alt` text
- Color is never the only way to convey information
- Test with screen readers regularly, not just at the end

**Why:** 15% of the world has disabilities. Excluding them isn't an option.

---

## 8. Performance Budget

**Category:** UI/UX

Set limits and respect them. Performance degrades silently.

**Rules:**
- LCP under 2.5s, CLS under 0.1, FID under 100ms
- Bundle size has a budget — flag when exceeded
- Lazy-load what's below the fold
- Optimize images: modern formats (WebP/AVIF), proper sizing, lazy loading
- Third-party scripts earn their kilobytes

**Why:** Speed is a feature. Every 100ms of delay costs conversion and satisfaction.

---

## 9. Graceful Error Handling

**Category:** Code Design

Failures happen. How you handle them defines quality.

**Rules:**
- Never show raw errors to users
- Fallback UI is better than a blank screen
- Errors are logged with enough context to debug
- Retry logic exists for transient failures
- Degrade gracefully: if one feature fails, the rest still works

**Why:** Users forgive broken features. They don't forgive broken apps.

---

## 10. Consistent Naming

**Category:** Code Design

Names are the first documentation. Confusing names are the first bug.

**Rules:**
- Use the same term for the same concept everywhere (no `user` vs `account` vs `person`)
- Boolean variables/questions: `isActive`, `hasPermission`, `canEdit`
- Functions describe actions: `getUser`, `formatDate`, `sendNotification`
- Avoid abbreviations unless universally understood (`id`, `url`, `ok`)
- Follow framework conventions (React: `camelCase`, CSS: `kebab-case`)

**Why:** Good naming eliminates the need for comments and makes code self-documenting.

---
