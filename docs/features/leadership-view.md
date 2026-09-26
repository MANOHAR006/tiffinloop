# Leadership View

**Status:** building
**Last updated:** 2026-09-25

## What it is
One page showing cook dropout frequency over the last 30 days (2026-08-24 to 2026-09-22, today excluded), by city and by cook.

## Why we're doing it this way
- Dropout is defined narrowly (Cook No-Show variants + Cancelled - Cook Unavailable), all spellings merged. Subscriber cancels, refunds, and pending are not dropouts.
- City comes from the cook's city (normalized), not the subscriber's, because staffing is the question.
- Today is excluded because nothing dated today is delivered yet — including it would undercount.

## How it works (shape, not detail)
Same `data.json`; counts computed in `logic.js` `dropoutStats()`. Bars by city, table by cook.

## MVP vs later
MVP: static 30-day counts. Later: trend lines, festival-week overlay, repeat-offender alerts.

## Open questions
- Should inactive-cook orders count toward city totals after they leave?
- Do we weight Lunch vs Dinner dropouts differently?
