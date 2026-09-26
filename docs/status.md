# Status

## 2026-09-25 — Bug sweep fixed 2 issues, re-verified
- BUG 1 fixed: Jain orders could be manually assigned to CK088 (Veg, Non-Veg, no Jain). `backupCandidates()` now excludes diet-incompatible cooks when a diet is given. Verified: Jain pool for CK087 starts with CK020, and ORD07116 auto-routes to CK020 with cuisine-mismatch flag.
- BUG 2 fixed: no-phone order ORD07109 (Farah Gupta, CK086) was marked "sent". Send now marks phone-present as sent and blank-phone as needs-call, with trace log recording `needsCall`.
- Ground truth re-checked (Python vs browser JS match): today 238; CK086 9 (5 Lunch/4 Dinner), CK087 9 (5/4), CK090 6 (4/2), CK088 4, CK089 0; Leadership 134 total = Bengaluru 66 / Pune 49 / Mumbai 19; top CK080 20 / CK062 20 / CK032 7; Tariq dup phone 9812345678 confirmed; second dup pair 9721773286 exists across other cooks (out of single-cook scope, noted).
- Remaining gaps (accepted, not bugs): single-cook-at-a-time view (combined CK086+CK087 handled via committed-slots + hint text, not a merged screen); cross-cook duplicate phones not flagged; trace log is browser-local (localStorage), so a second laptop would not see it — fine for prototype, must move server-side for production.

## 2026-09-25 — Prototype runs locally, verified in browser
- Built `app/index.html + logic.js + data.json` (generated from seed, seed untouched). Served on port 4711: `python3 -m http.server 4711 --directory app`.
- Verified: CK087 shows 9 affected; auto-assign covers with diet/capacity checks; Leadership shows Bengaluru 66 / Pune 49 / Mumbai 19, total 134, top CK080 20 / CK062 20 / CK032 7; Trace log writes on Send All.
- Fix: backup capacity now subtracts already-promised slots from the trace log so CK086+CK087 cannot double-book CK088. Added combined-outage hint for CK086/CK087.
- Still to test with user: CK090 hidden dropout, CK089 zero-impact, Tariq duplicate-phone warning, Send All → Trace Log.
- Next for submission: deploy to Vercel/Railway, push public repo, write 1-page PRD + build log, email mehvish@stampmyvisa.com.

## 2026-09-25 — Project skeleton + data analysis
- Created `tiffinloop/` skeleton next to `tiffinloop_seed/` (seed untouched).
- Key findings: today (2026-09-23) has 238 orders, all pending/in-progress. CK086 (9 orders) + CK087 (9 orders) on leave = confirmed dropouts. CK090 (6 orders) still active in sheet but out per WhatsApp = hidden dropout. CK089 on leave but 0 orders today = zero-impact case. Only 1 active South Indian cook in Bengaluru (CK088, 8 free) vs 18 affected = backup conflict. Tariq SUB0511/SUB0512 share one phone = double-message bug. Pune CK080/CK062 lead 30-day dropouts (20 each).

## 2026-09-25 — Trace log reference entries added
- Seeded 2 reference entries from 2026-09-22 (real seed dropout orders): CK032 fully covered (ORD06752+ORD06816 → CK045), CK080 partial conflict (ORD06703 → CK074, ORD06786 refund). Badged "reference 22 Sept", dated yesterday so today's backup capacity untouched (CK088 still free 8 verified).

## 2026-09-26 — Live + repo done, verified
- Repo public: https://github.com/MANOHAR006/tiffinloop (5 commits, matches laptop).
- Live: https://tiffinloop-one.vercel.app (root app/, preset Other). Fetched live HTML: header countdowns, 3 tabs, seed reference entries, cook flags, diet/capacity/notify/trace logic all present.
- Left: chat export link + email with start/end times.
