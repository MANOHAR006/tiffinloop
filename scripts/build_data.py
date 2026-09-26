"""Build app/data.json from ../tiffinloop_seed CSVs. Keeps raw values; normalization lives in app/logic.js."""
import csv, json, pathlib

SEED = pathlib.Path(__file__).resolve().parents[1] / ".." / "tiffinloop_seed"
# handle both layouts: tiffinloop/scripts/build_data.py -> ../../tiffinloop_seed
if not (SEED / "cooks.csv").exists():
    SEED = pathlib.Path("/Users/apple/Desktop/tiffinloop_seed")
OUT = pathlib.Path(__file__).resolve().parents[1] / "app" / "data.json"

def read(name):
    with open(SEED / name, newline='', encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))

cooks = read("cooks.csv")
subs = read("subscribers.csv")
orders = read("orders.csv")
try:
    whatsapp = open(SEED / "ops_whatsapp_export.txt", encoding="utf-8").read()
except FileNotFoundError:
    whatsapp = ""

OUT.write_text(json.dumps({
    "now": "2026-09-23T10:30:00",
    "lunch_window": "12:30 PM - 2:00 PM",
    "dinner_window": "7:30 PM - 9:00 PM",
    "cooks": cooks,
    "subscribers": subs,
    "orders": orders,
    "whatsapp": whatsapp,
}, ensure_ascii=False), encoding="utf-8")
print(f"wrote {OUT} cooks={len(cooks)} subs={len(subs)} orders={len(orders)}")
