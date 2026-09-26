# TiffinLoop — Cook Dropout Ops Tool

Prototype for StampMyVisa AI PM assignment. Web app that helps ops resolve a cook dropout before mealtime, plus a leadership view of dropout patterns. Built with plain HTML + JS, no build step, data from `../tiffinloop_seed/` copied at build time.

## Rules (always hold)

- Never hand-edit seed data. All messiness (city spellings, status spellings, date formats, duplicates) is handled in code in `app/logic.js`.
- `NOW` is fixed at 2026-09-23 10:30 AM. Lunch 12:30 PM, Dinner 7:30 PM. Today’s orders are never marked delivered.
- Backup logic: same city is mandatory, diet must be compatible (Jain needs Jain-serving cook), active status only, respect `max_daily_orders`. Cuisine match is preferred, not mandatory — flag mismatches.
- Every dropout resolution is logged to localStorage and viewable in the Trace tab.

## Links

| Topic | File |
|---|---|
| What we’re doing now/next | `TODO.md` |
| How it fits together | `docs/architecture.md` |
| Session log | `docs/status.md` |
| Ports | `ports.md` |
| Ops-tool design | `docs/features/ops-tool.md` |
| Leadership-view design | `docs/features/leadership-view.md` |
