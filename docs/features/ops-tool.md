# Ops Tool

**Status:** building
**Last updated:** 2026-09-25

## What it is
When a cook drops out, ops picks the cook and sees every affected order today, with subscriber contact and Lunch/Dinner urgency. The tool suggests backup cooks, auto-assigns with Lunch first, simulates a message to each subscriber before mealtime, and logs the event.

## Why we're doing it this way
- Same city is mandatory; diet must match (Jain needs Jain-serving cook). Cuisine match is preferred but flaggable, because Bengaluru has only one same-cuisine backup (CK088, 8 free) for 18 affected across CK086+CK087 — strict cuisine matching would force 10 refunds.
- Capacity uses `max_daily_orders` minus today's load minus already-promised slots from the trace log, so resolving CK086 then CK087 cannot double-book CK088.
- Duplicate phones (Tariq SUB0511/SUB0512 share 9812345678) are flagged and messaged once logic is surfaced, explaining the WhatsApp complaint.
- Sheet status is not trusted alone: CK090 shows active but WhatsApp says out. The tool allows acting on any cook.

## How it works (shape, not detail)
Cook picker → affected list → backup pool → auto/manual assign → simulated notify → trace log in browser storage.

## MVP vs later
MVP: single-cook resolution, greedy assign, simulated send, local log. Later: multi-cook combined view, real WhatsApp send, server-side log, delivery-partner handoff.

## Open questions
- Should Jain orders ever go to non-Jain kitchens with a warning, or hard-block?
- Who approves cross-cuisine swaps — ops or subscriber reply?
