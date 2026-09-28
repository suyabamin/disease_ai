"""
test_model.py — Standalone model validation script

Run this BEFORE starting the API to verify everything works:

    cd backend
    python test_model.py [path/to/test/image.jpg]

Expected output when passing:
    ✅ MODEL LOADED   : OK
    ✅ CLASSES        : 94
    ✅ INPUT SHAPE    : (None, 224, 224, 3)
    ✅ OUTPUT SHAPE   : (None, 94)
    ✅ PREPROCESSING  : OK  — tensor shape (1, 224, 224, 3)
    ✅ PREDICTION     : Tomato_Late_Blight
    ✅ CONFIDENCE     : 93.21%
    ✅ TOP 3          :
         1. Tomato_Late_Blight      93.21%
         2. Tomato_Leaf_Mold         4.12%
         3. Tomato_Target_Spot       1.87%
    ✅ STATUS         : PASS
"""
import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PASS = "[OK]"
FAIL = "[FAIL]"
errors: list[str] = []


def check(label: str, value: str, ok: bool) -> None:
    icon = PASS if ok else FAIL
    print(f"  {icon:<6} {label:<20} {value}")
    if not ok:
        errors.append(label)


# ── Paths ──────────────────────────────────────────────────────────────────
BASE = Path(__file__).resolve().parent
MODEL_PATH = BASE / "model" / "crop_disease_model.keras"
CLASS_NAMES_PATH = BASE / "model" / "class_names.json"
TEST_IMAGE_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else None

print()
print("=" * 60)
print("  AgroAI Bangladesh — Model Self-Test")
print("=" * 60)

# ── 1. Files exist ─────────────────────────────────────────────────────────
model_exists = MODEL_PATH.exists()
classes_exist = CLASS_NAMES_PATH.exists()
check("MODEL FILE", str(MODEL_PATH), model_exists)
check("CLASS NAMES FILE", str(CLASS_NAMES_PATH), classes_exist)

if not model_exists or not classes_exist:
    print()
    print(f"  {FAIL} FATAL — required files missing. Cannot continue.")
    sys.exit(1)

# ── 2. Load class names ────────────────────────────────────────────────────
with CLASS_NAMES_PATH.open("r", encoding="utf-8") as f:
    raw_classes = json.load(f)

if isinstance(raw_classes, dict):
    class_names: list[str] = [raw_classes[str(i)] for i in range(len(raw_classes))]
elif isinstance(raw_classes, list):
    class_names = raw_classes
else:
    raise ValueError(f"Unknown class_names format: {type(raw_classes)}")

check("CLASSES", str(len(class_names)), len(class_names) == 94)

# ── 3. Load model ──────────────────────────────────────────────────────────
try:
    import tensorflow as tf
    model = tf.keras.models.load_model(str(MODEL_PATH))
    check("MODEL LOADED", "OK", True)
except Exception as exc:
    check("MODEL LOADED", f"FAILED — {exc}", False)
    print(f"\n  {FAIL} Cannot load model. Aborting.")
    sys.exit(1)

# ── 4. Validate shapes ─────────────────────────────────────────────────────
in_shape = model.input_shape   # (None, 224, 224, 3)
out_shape = model.output_shape  # (None, 94)

check("INPUT SHAPE", str(in_shape), in_shape[1:] == (224, 224, 3))
check("OUTPUT SHAPE", str(out_shape), out_shape[-1] == 94)

# ── 5. Preprocessing & prediction ─────────────────────────────────────────
if TEST_IMAGE_PATH and TEST_IMAGE_PATH.exists():
    from utils.image import preprocess_image

    with TEST_IMAGE_PATH.open("rb") as fh:
        data = fh.read()

    try:
        tensor = preprocess_image(data)
        check("PREPROCESSING", f"tensor shape {tensor.shape}", tensor.shape == (1, 224, 224, 3))

        import numpy as np

        probs = model.predict(tensor, verbose=0)[0]  # (94,)
        top3 = np.argsort(probs)[::-1][:3]

        best_idx = int(top3[0])
        best_conf = float(probs[best_idx])
        best_name = class_names[best_idx]

        check("PREDICTION", best_name, True)
        check("CONFIDENCE", f"{best_conf * 100:.2f}%", 0.0 < best_conf <= 1.0)
        check("CLASS ID RANGE", f"idx={best_idx}", 0 <= best_idx < 94)

        print(f"\n  {PASS}  TOP 3:")
        for rank, idx in enumerate(top3, 1):
            name = class_names[int(idx)]
            conf = float(probs[idx])
            print(f"       {rank}. {name:<35} {conf * 100:.2f}%")

    except Exception as exc:
        check("PREDICTION", f"FAILED — {exc}", False)
else:
    msg = (
        f"Skipped (no image supplied)"
        if not TEST_IMAGE_PATH
        else f"Skipped — file not found: {TEST_IMAGE_PATH}"
    )
    print(f"\n  ⚠️   PREDICTION   {msg}")
    print("       Re-run with: python test_model.py path/to/leaf.jpg")

# ── 6. Summary ─────────────────────────────────────────────────────────────
print()
if errors:
    print(f"  {FAIL}  STATUS: FAIL — issues with: {', '.join(errors)}")
    sys.exit(1)
else:
    print(f"  {PASS}  STATUS: PASS")

print("=" * 60)
print()
