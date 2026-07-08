/**
 * IFC STEP parameter formatting utilities.
 *
 * All helpers return pre-formatted strings that can be passed directly
 * as parameters to IfcWriter.entity().  Keeping formatting here makes the
 * higher-level exporters readable and prevents encoding bugs.
 *
 * IFC STEP parameter types:
 *   String     → 'text'          (use str())
 *   Real       → 1.5             (use num() — always includes decimal point)
 *   Integer    → 3               (use plain toString())
 *   Reference  → #42             (use ref())
 *   Enum       → .METRE.         (use en())
 *   Null       → $               (NIL constant)
 *   Derived    → *               (DRV constant — for derived attributes)
 *   List       → (#1,#2)         (use refList())
 */

// ─── GUID ──────────────────────────────────────────────────────────────────────

/**
 * IFC base-64 alphabet.
 * Characters: 0–9, A–Z, a–z, _, $  (64 characters total)
 */
const GUID_CHARS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$";

/**
 * Generate a random 22-character IFC-compatible GlobalId.
 *
 * IFC requires each GlobalId to be a 22-character string drawn from the
 * IFC base-64 alphabet.  This implementation generates a statistically
 * unique identifier using Math.random() which is sufficient for file-level
 * uniqueness (collision probability ≈ 2^-132).
 */
export function guid(): string {
  let result = "";
  for (let i = 0; i < 22; i++) {
    result += GUID_CHARS[Math.floor(Math.random() * 64)];
  }
  return result;
}

// ─── Number / string formatting ────────────────────────────────────────────────

/**
 * Format a real number for IFC STEP.
 *
 * The STEP format requires a decimal point for all real literals.
 * e.g. 2 → '2.', 2.5 → '2.5', -1.234567 → '-1.234567'
 *
 * Rounds to 6 decimal places to avoid floating-point noise.
 */
export function num(n: number): string {
  const rounded = Math.round(n * 1_000_000) / 1_000_000;
  const s = rounded.toString();
  // Ensure decimal point is always present
  return s.includes(".") ? s : s + ".";
}

/**
 * Escape and quote a string for IFC STEP (single quotes, escaped with doubling).
 * e.g. "Wall 1"  → "'Wall 1'"
 *      "O'Brien" → "'O''Brien'"
 */
export function str(s: string): string {
  return `'${s.replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
}

/** Format a reference to another entity:  #ID */
export function ref(id: number): string {
  return `#${id}`;
}

/** Wrap an enumeration value:  .VALUE. */
export function en(v: string): string {
  return `.${v}.`;
}

/** Optional / null parameter ($). */
export const NIL = "$";

/** Derived attribute — must not be set explicitly (*). */
export const DRV = "*";

// ─── Coordinate helpers ────────────────────────────────────────────────────────

/**
 * Format a 2-coordinate tuple for IfcCartesianPoint (2D).
 * Example: pt2(1.0, 2.0) → '(1.,2.)'
 */
export function pt2(x: number, y: number): string {
  return `(${num(x)},${num(y)})`;
}

/**
 * Format a 3-coordinate tuple for IfcCartesianPoint (3D) or IfcDirection.
 * Example: pt3(1.0, 0.0, 0.0) → '(1.,0.,0.)'
 */
export function pt3(x: number, y: number, z: number): string {
  return `(${num(x)},${num(y)},${num(z)})`;
}

// ─── List helpers ──────────────────────────────────────────────────────────────

/** Format a list of entity references:  (#1,#2,#3) */
export function refList(ids: number[]): string {
  return `(${ids.map(ref).join(",")})`;
}
