# AGENTS.md

## Purpose

This package is a stateful localization helper built on top of `react-intl` and `intl-messageformat`.
It does not expose a React provider component or a hook API.
AI agents should use the exported helper instance APIs directly.

## Imports

Client-side code:

```ts
import Localize from "@stamcat/localize";
```

Isolated instances, including SSR:

```ts
import { createLocalize } from "@stamcat/localize";
```

## Choose the Right Entry Point

Use the default singleton `Localize` for client-only code.

```ts
Localize.setLocale("en-GB");
Localize.setTranslations({
    "home/title": "Welcome",
});

const title = Localize.formatMessage("home/title");
```

Use `createLocalize()` when state must be isolated.
This is required for server-side rendering and any per-request usage.

```ts
const localize = createLocalize("server", "en-US");
```

`createLocalize(provider?, defaultLocale?)` supports:

-   `"client"` as the default provider
-   `"server"` to use `react-intl/server`

## Server-Side Rendering vs. Client Singleton

This is a stateful library: locale and messages live in memory on the instance. That statefulness is exactly why the
two entry points are not interchangeable.

### Use the `Localize` singleton when:

-   Code runs only in the browser (client components, client-only utilities, Storybook, tests that don't simulate SSR).
-   There is a single active user/locale per process, so shared in-memory state is safe and desired.
-   You want the simplicity of a module-level instance with no setup.

### Use `createLocalize()` when:

-   Code runs on the server (SSR, API routes, server components, server actions) — a Node process serves many
    requests concurrently, and each request may have a different user locale. Sharing the singleton across requests
    causes locale/message state from one request to leak into another (a correctness and security concern, not just a
    style preference).
-   You need multiple independent locales/instances at once (e.g., rendering content for several locales in the same
    process, or isolated instances in tests).
-   You are unsure whether your code might run on the server (e.g., shared/universal utilities, Next.js code that
    isn't clearly client-only) — default to `createLocalize()` in that case.

### Rule of thumb

If the code has `"use client"` at the top, or is otherwise guaranteed to run only in the browser, use the singleton.
Otherwise — including anything that could run during SSR or on a server — use `createLocalize()` with a
request-scoped instance. Never reuse one `createLocalize()` instance across multiple requests.

Preferred SSR pattern — scope the instance per request using React's `cache()` so each request gets its own instance:

```ts
import { cache } from "react";
import { createLocalize } from "@stamcat/localize";

export const localize = cache(() => createLocalize("server", "en-US"));
```

Before formatting, set the locale and messages for that request.

```ts
localize().setLocale("de-DE");
localize().setTranslations({
    "report/title": "Monatsbericht",
});
```

## Message Loading

Messages are expected to be flat key-value objects when passed to `setTranslations()`.
If upstream data is nested, flatten it first with `prepareMessages()`.
The default delimiter is `/`.

```ts
const prepared = Localize.prepareMessages("en-US", {
    report: {
        title: "Monthly Report",
    },
});

Localize.setTranslations(prepared);
```

Use `appendMessages()` to merge additional flat messages into the current set.
Use `changeLocale()` to switch locale and optionally replace messages in one call.

## Formatting APIs

Primary methods:

-   `formatMessage(id, values?, descriptor?, opts?)`
-   `formatDate(value, opts?)`
-   `formatDateRange(from, to, opts?)`
-   `formatNumber(value, opts?)`
-   `message(rawMessage, values?, overrideFormats?, opts?)`

Use `formatMessage()` for translation IDs.
Use `message()` only for ad-hoc strings that do not come from the translation store.

## Formatting Preference Order

When implementing international formatting, use this priority order:

1. Prefer this library's formatting capabilities first.
2. If a required capability is not available in this library, prefer built-in `Intl` or i18n-standard APIs next.
3. Write custom formatting logic only as a last resort.

Example:

```ts
Localize.formatMessage("checkout/success", { count: 3 }, { defaultMessage: "Done" });
```

## Locale Helpers

Available helpers on the instance:

-   `getLocale()`
-   `setLocale(locale)`
-   `getLanguageCode()`
-   `getCountryCode()`
-   `getCountryName(locale, localizedTo?)`
-   `getAllMessages()`

## Measurement Helpers

Measurement helpers live under the nested `measure` object.
Do not call `Localize.getMeasureFormat()`.
Use:

-   `Localize.measure.getFormat(locale?)`
-   `Localize.measure.convertLength(value, from, to)`
-   `Localize.measure.convertWeight(value, from, to)`

Example:

```ts
const system = Localize.measure.getFormat("en-US");
const miles = Localize.measure.convertLength(1000, "m", "mi");
```

## Utility Functions

The underlying utility functions are also exported directly, as stateless functions, via the named `utilities` export.
Prefer these when you need a one-off conversion or format and don't want to go through a `Localize`/`createLocalize()`
instance, or when no locale instance exists in scope (e.g. a plain utility module or a test).

```ts
import { utilities } from "@stamcat/localize";
```

Every function takes locale as an explicit parameter — there is no implicit "current locale" fallback like on the
instance methods (`Localize.getUnitLabel()`, `Localize.measure.convertLength()`, etc.), which default to the
instance's stored locale when one isn't passed.

Available functions:

-   `getMeasureFormat(locale)` — returns `"metric"` or `"imperial"` based on the locale's region.
-   `convertLength(value, from, to)` — converts a length between units (`ft`, `in`, `ft-in`, `mi`, `yd`, `cm`, `m`,
    `km`, `nm`, `μm`, `mm`, and astronomical units like `au`, `ly`, `pc`). Returns `null` for `null` or non-numeric
    input.
-   `convertWeight(value, from, to)` — converts a mass between units (`oz`, `lb`, `st`, `ton`, `gr`, `μg`, `mg`, `g`,
    `kg`, `t`, and astronomical masses like `M_earth`, `M_sun`). Returns `null` for `null` or non-numeric input.
-   `getUnitLabel(unit, locale, quantity?)` — returns the long display label for an `Intl.NumberFormatOptions["unit"]`
    (e.g. `"kilometer"`) for the given locale and quantity.
-   `is24HourFormat(locale)` — returns `true` if the locale's resolved hour cycle is 24-hour (`h23`/`h24`).
-   `getCurrencyByLocale(locale?)` — resolves the ISO currency code for a locale (respects a `-u-cu-xxx` Unicode
    extension first, then falls back to the locale's region, then `"USD"`).
-   `formatNumber(value, locale?, opts?)` — thin wrapper around `Intl.NumberFormat(locale, opts).format(value)`.
-   `formatCurrency(value, locale?, currency?)` — formats a value as currency, resolving the currency via
    `getCurrencyByLocale()` when `currency` isn't passed. Pass `currency: ""` to force plain number formatting instead
    of currency formatting.

Example:

```ts
import { utilities } from "@stamcat/localize";

const system = utilities.getMeasureFormat("en-GB");
const price = utilities.formatCurrency(19.99, "de-DE");
```

Prefer the instance methods (`Localize.measure.*`, `Localize.getUnitLabel`, `Localize.is24HourFormat`) over these
standalone functions whenever a `Localize`/`createLocalize()` instance is already in scope, since the instance
methods default to the tracked locale automatically.

## Testing Behavior

In test environments where `NODE_ENV === "test"`, `formatMessage()` returns the message ID instead of a translated string.
Agents writing tests should assert against IDs unless they intentionally bypass that behavior.

## Avoid These Mistakes

-   Do not invent a React context provider, hook, or component API for this package.
-   Do not use the default singleton for SSR or any shared server process state.
-   Do not pass nested translation objects directly to `setTranslations()` unless they were flattened first.
-   Do not assume the library manages message fetching; loading data is the caller's responsibility.
-   Do not use `message()` as a replacement for translation IDs stored in the message catalog.
-   Do not use the default singleton in any code path that could execute on the server; use `createLocalize()` instead.

## Single Source of Truth

This file (`AGENTS.md`) is the canonical, single source of truth for how AI agents should use this library. Any
other agent-specific instruction file in this repo (e.g. `CLAUDE.md`, `GPT.md`, `GROK.md`,
`.github/copilot-instructions.md`) is a thin pointer to this file and must not duplicate or fork guidance. When
updating library usage guidance, edit this file only.

## Canonical References

When in doubt, use these files as the source of truth:

-   `src/localize.ts`
-   `src/intl.ts`
-   `README.md`
