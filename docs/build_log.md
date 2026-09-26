# Build Log — TiffinLoop prototype (this chat session)

Session date: 2026-09-25. Local wall-clock work in one chat session (across ~1h). Assignment 4-hour clock: applicant to report official start/end in submission email — suggested: start when first message sent, end when live link verified.

## Prompt history (user) + responses (AI) — faithful summary

1. User: "can you read what is in it?" → AI listed 7 seed files, counts (92 cooks, 532 subs, 7138 orders), messy patterns, WhatsApp events, assignment + JD summary.
2. User: "so according to the assignment what should we do no?" → AI broke down 2 builds + 4 submissions + rules, recommended new folder next to seed.
3. User: "can you build it for me. I am not at all clear with the assignment. helop me understand." → AI set up tiffinloop/ skeleton, analyzed data (238 today; CK086/087 9+9; CK090 hidden 6; CK089 0; CK088 8 free vs 18; Tariq dup; Pune leaders), built app/index.html + logic.js + data.json, served on 4711, verified in browser.
4. User: "did you build everything? or dowe have to chnaeg anything in this?" → AI: app done locally; submission pack (live link, public repo, 1-page PRD, log) still owed.
5. User: "i wan tyou to chcek fro bugs or any gaps we come with this." → AI ran Python ground truth vs browser JS: found BUG1 Jain→CK088 allowed manually; BUG2 no-phone marked sent. Fixed: diet exclusion filter; sent vs needs-call + trace needsCall. Re-verified after reload.
6. User: "sort those bug" → AI confirmed both fixes live (Jain pool starts CK020; SUB0503 blank → needs-visit).
7. User: "did we create what they asked us to create? or did we made more chnages" → AI mapped 4 success criteria + 2nd build to code; listed extra skeleton files as non-submission hygiene.
8. User: "so what we have to do to bring it live" → AI recommended Vercel, listed 5 steps, asked for GitHub username + permission (no deploy without yes).
9. User: "is it secure. what the jd asked is it genuine?" → AI scanned code (no secrets), warned seed phones go public by design, verified company real (2017, Mumbai, 500k visas, Unicorn funding, Teleport) with precautions.
10. User: "then is genuine mail jd i got ri8 an deven assignment?" → AI verified Mehvish Quadri (Business & Marketing Lead) uses mehvish@stampmyvisa.com in prior hiring posts; JD fits AI direction; assignment fits JD.
11. User pasted Success Criteria → AI mapped each to file/function + deep vs shallow + prioritization.
12. User: "what does trace log means?" → AI explained notebook analogy + Trace tab fields.
13. User: "ok then you add some in trace log for reference." → AI seeded 2 ref entries from 22 Sept real orders (CK032 full cover; CK080 conflict), badged, capacity-neutral, verified CK088 free 8.
14. User: cook onboarding doubt → AI: no cook-add screen; sheet is source; tool manages dropouts only.
15. "okok" / "then our page is done ri8?" / "can we auto assign?" / timing doubts / "show time in dashboard" → AI confirmed scope, pointed to Auto-assign button, explained per-day human trigger, added 2h/9h countdown to header + affected box.
16. User: "ok done I have to submit by today. so help me with next steps." → AI committed locally (30ad286), wrote PRD + this log; next: public repo + Vercel deploy + verify + email.

## Key decisions accepted / pushed back
- Accepted: plain static app (no framework) for Vercel fit; same-city mandatory + diet hard-block + cuisine preferred; Lunch-first greedy; simulated send; localStorage trace.
- Pushed back: marking no-phone as sent (fixed to needs-call); listing diet-clashing backups as selectable (fixed to excluded); auto-on-load assignment (kept human click as approval).

## Full-text export
This file is the structured log. The complete verbatim chat export must come from the chat UI (export/share link) and be attached alongside this file — assignment rejects prompts-only logs.
