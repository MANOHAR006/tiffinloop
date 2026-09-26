/* TiffinLoop logic: all messiness handled here, never in the data file. */
const NOW_ISO = "2026-09-23T10:30:00";
const TODAY = "2026-09-23";

function parseDate(s) {
  s = String(s || "").trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) {
    const dd = m[1].padStart(2, "0"), mm = m[2].padStart(2, "0"), yyyy = m[3];
    // seed uses DD/MM/YYYY (e.g. 23/09/2026, 11/09/2026)
    return `${yyyy}-${mm}-${dd}`;
  }
  m = s.match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})/);
  if (m) {
    const mon = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
    return `${m[3]}-${mon[m[2].toLowerCase()]}-${m[1].padStart(2, "0")}`;
  }
  return s;
}

function normCity(c) {
  const t = String(c || "").trim().toLowerCase();
  if (["bengaluru", "bangalore", "blr"].includes(t)) return "Bengaluru";
  if (["mumbai", "mum", "bombay"].includes(t)) return "Mumbai";
  if (t === "pune") return "Pune";
  return String(c || "").trim();
}

function normStatus(s) {
  return String(s || "").trim().toLowerCase().replace(/_/g, " ").replace(/\s+/g, " ");
}

function normMeal(s) {
  const t = String(s || "").trim().toLowerCase();
  return t.startsWith("lunch") ? "Lunch" : t.startsWith("dinner") ? "Dinner" : s;
}

// Dropout = cook failed, not subscriber cancel / refund / pending.
// Covers: "Cook No-Show", "cook no show", "cook_dropout", "No Show", "Cancelled - Cook Unavailable"
const DROPOUT_STATUS = new Set(["cook no-show", "cook no show", "cook dropout", "no show", "cancelled - cook unavailable"]);
function isDropoutStatus(raw) { return DROPOUT_STATUS.has(normStatus(raw)); }

function servesList(cook) {
  return String(cook.serves || "").split(",").map(x => x.trim().toLowerCase());
}
// Diet rule: Jain subscriber needs a cook whose serves includes "jain".
// Veg subscriber can use any cook (veg items exist). Non-Veg needs "non-veg".
function dietCompatible(cook, diet) {
  const serves = servesList(cook);
  const d = String(diet || "").trim().toLowerCase();
  if (d === "jain") return serves.includes("jain");
  if (d === "non-veg" || d === "non veg") return serves.includes("non-veg");
  return true;
}

let DB = { cooks: [], subscribers: [], orders: [], whatsapp: "" };
let subById = {}, cookById = {};

async function loadData() {
  const res = await fetch("data.json");
  DB = await res.json();
  subById = Object.fromEntries(DB.subscribers.map(s => [s.subscriber_id, s]));
  cookById = Object.fromEntries(DB.cooks.map(c => [c.cook_id, c]));
  // precompute normalized date
  DB.orders.forEach(o => { o._day = parseDate(o.order_date); o._status = normStatus(o.status); });
}

function todayOrders() { return DB.orders.filter(o => o._day === TODAY); }
function ordersForCookToday(cookId) { return todayOrders().filter(o => o.cook_id === cookId); }
function loadForCookToday(cookId) { return ordersForCookToday(cookId).length; }
// Already-promised slots from earlier resolutions today (trace log), so two
// simultaneous dropouts (CK086 + CK087) cannot double-book the same backup.
function committedAdds(cookId) {
  try {
    const log = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
    let n = 0;
    for (const e of log) {
      if (!e || !e.assignments) continue;
      if (e.now && !String(e.now).startsWith(TODAY)) continue;
      for (const b of Object.values(e.assignments)) if (b === cookId) n += 1;
    }
    return n;
  } catch { return 0; }
}
function effectiveLoad(cookId) { return loadForCookToday(cookId) + committedAdds(cookId); }

// Backup candidates: active only, same city (mandatory). When dietForCheck is
// given, diet-incompatible cooks are excluded entirely (not just flagged), so a
// Jain order can never be manually assigned to a non-Jain kitchen.
function backupCandidates(dropoutCook, dietForCheck) {
  const dc = cookById[dropoutCook];
  if (!dc) return [];
  const city = normCity(dc.city);
  return DB.cooks
    .filter(c => c.cook_id !== dropoutCook && String(c.status || "").trim().toLowerCase() === "active" && normCity(c.city) === city)
    .map(c => {
      const max = parseInt(c.max_daily_orders, 10) || 0;
      const load = effectiveLoad(c.cook_id);
      const cuisineMatch = String(c.cuisine_specialty || "").trim().toLowerCase() === String(dc.cuisine_specialty || "").trim().toLowerCase();
      const dietOk = dietForCheck ? dietCompatible(c, dietForCheck) : true;
      return { cook: c, max, load, free: max - load, cuisineMatch, dietOk };
    })
    .filter(x => x.free > 0 && (!dietForCheck || x.dietOk))
    .sort((a, b) => (b.cuisineMatch - a.cuisineMatch) || (b.free - a.free));
}

// Greedy assign: lunch first (urgent), then dinner. Prefer cuisine match + diet ok.
function autoAssign(affected, dropoutCookId) {
  const dc = cookById[dropoutCookId];
  const city = normCity(dc.city);
  const pool = DB.cooks.filter(c => c.cook_id !== dropoutCookId && String(c.status || "").trim().toLowerCase() === "active" && normCity(c.city) === city)
    .map(c => ({ cook: c, free: (parseInt(c.max_daily_orders, 10) || 0) - effectiveLoad(c.cook_id) }))
    .filter(x => x.free > 0);
  const sorted = affected.slice().sort((a, b) => (a.meal_type === "Lunch" ? 0 : 1) - (b.meal_type === "Lunch" ? 0 : 1));
  const plan = [];
  for (const o of sorted) {
    const sub = subById[o.subscriber_id] || {};
    const cands = pool.filter(x => x.free > 0 && dietCompatible(x.cook, sub.diet))
      .sort((a, b) => {
        const am = String(a.cook.cuisine_specialty).toLowerCase() === String(dc.cuisine_specialty).toLowerCase() ? 1 : 0;
        const bm = String(b.cook.cuisine_specialty).toLowerCase() === String(dc.cuisine_specialty).toLowerCase() ? 1 : 0;
        return bm - am || b.free - a.free;
      });
    if (cands.length) { cands[0].free -= 1; plan.push({ order_id: o.order_id, backup: cands[0].cook.cook_id, cuisineMismatch: String(cands[0].cook.cuisine_specialty).toLowerCase() !== String(dc.cuisine_specialty).toLowerCase() }); }
    else plan.push({ order_id: o.order_id, backup: null });
  }
  return plan;
}

function buildMessage(order, dropoutCook, backupId) {
  const sub = subById[order.subscriber_id] || {};
  const dc = dropoutCook;
  const meal = normMeal(order.meal_type);
  const window = meal === "Lunch" ? "12:30 PM - 2:00 PM" : "7:30 PM - 9:00 PM";
  const backup = backupId ? cookById[backupId] : null;
  let body;
  if (backup) body = `Hi ${sub.subscriber_name || "there"}, your ${meal} today from ${dc.cook_name} is unavailable. Backup: ${backup.cook_name} (${backup.phone || "phone on request"}) will cook it. Same ${window} window. Reply YES to confirm.`;
  else body = `Hi ${sub.subscriber_name || "there"}, your ${meal} today from ${dc.cook_name} is unavailable and no backup cook has free capacity. We will refund Rs.${order.amount_inr} and call you. Sorry!`;
  return { to: sub.phone || "(no phone on file)", text: body };
}

// ---- duplicate-phone detection (Tariq case) ----
function phoneKey(p) { return String(p || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""); }
function duplicatePhonesToday(orders) {
  const seen = {}, dups = new Set();
  for (const o of orders) {
    const sub = subById[o.subscriber_id];
    if (!sub || !sub.phone) continue;
    const k = phoneKey(sub.phone);
    if (!k) continue;
    if (seen[k]) dups.add(k);
    seen[k] = true;
  }
  return dups;
}

// ---- leadership stats: last 30 days excluding today ----
function dropoutStats() {
  const start = "2026-08-24", end = "2026-09-22";
  const drops = DB.orders.filter(o => o._day >= start && o._day <= end && isDropoutStatus(o.status));
  const byCook = {};
  const byCity = { Bengaluru: 0, Mumbai: 0, Pune: 0 };
  for (const o of drops) {
    byCook[o.cook_id] = (byCook[o.cook_id] || 0) + 1;
    const ck = cookById[o.cook_id];
    const city = ck ? normCity(ck.city) : "Unknown";
    byCity[city] = (byCity[city] || 0) + 1;
  }
  const rows = Object.entries(byCook).map(([id, n]) => ({ id, n, cook: cookById[id] })).sort((a, b) => b.n - a.n);
  return { total: drops.length, byCook: rows, byCity, start, end };
}

// ---- trace log ----
const LOG_KEY = "tiffinloop_events_v1";
function readLog() { try { return JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch { return []; } }
function writeLog(ev) { const l = readLog(); l.unshift(ev); localStorage.setItem(LOG_KEY, JSON.stringify(l.slice(0, 50))); }
