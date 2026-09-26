# TiffinLoop Dropout Tool — PRD (production version)

## Problem
A cook drops out with 0–2h notice (sick, emergency, no-show). Ops learns late, usually from a subscriber complaint, scrambles on WhatsApp for a backup, and subscribers hear nothing until food never arrives. Festival weeks spike leave. Lunch (12:30 PM) is the hard deadline.

## Who it's for
Ops execs resolving today's dropout (primary); subscriber receiving the message (secondary); leadership spotting repeat offenders (tertiary, separate view).

## Success metrics
- % affected subscribers notified before meal window (target 100%, lunch and dinner split).
- Median minutes from dropout flag to all-notified (target <20 min at 10:30 AM test clock).
- % affected covered by backup vs refunded, with cuisine/diet mismatches tracked.
- 30-day dropout orders by city/cook trending down for repeat cooks.

## What the prototype proved
Against real messy seed (238 orders today; CK086 9 + CK087 9 out; CK090 hidden 6 active-in-sheet-but-out on WhatsApp; CK089 zero-impact; Tariq duplicate phone; 134 dropouts/30d: BLR 66/Pune 49/Mum 19): one-click affected list is fast; same-city + diet (Jain blocked from non-Jain) + capacity (max minus load minus promised) yields realistic backups; Lunch-first auto-assign routes Jain ORD07116 to CK020 not CK088; no-phone ORD07109 surfaces as needs-visit not sent; trace log audits all. Same-cuisine conflict is real (18 hurt vs CK088 8 free) — cross-cuisine/refund path required.

## Deliberately cut (and why)
Single-cook view (faster to build/test than merged two-cook; hint + shared capacity covers the overlap); simulated send (no SMS vendor in 4h); browser-local log (proves shape, server log later); static 30-day counts (no trends/alerts); no cook onboarding (sheet remains source of truth).

## Open questions for engineering
Jain hard-block vs warn-allow? Who approves cross-cuisine — ops or subscriber reply? Real WhatsApp sender identity + rate limits + Tariq dedupe rule? Server log schema + retention? Daily data refresh job from sheets? Delivery-partner handoff for late backups (Anil Joshi +30 min case)?
