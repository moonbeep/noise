export const BANNER = `
  ███╗   ███╗███████╗██████╗  █████╗     ███╗   ██╗ ██████╗ ██╗███████╗███████╗
  ████╗ ████║██╔════╝██╔══██╗██╔══██╗    ████╗  ██║██╔═══██╗██║██╔════╝██╔════╝
  ██╔████╔██║█████╗  ██████╔╝███████║    ██╔██╗ ██║██║   ██║██║███████╗█████╗
  ██║╚██╔╝██║██╔══╝  ██╔══██╗██╔══██║    ██║╚██╗██║██║   ██║██║╚════██║██╔══╝
  ██║ ╚═╝ ██║███████╗██║  ██║██║  ██║    ██║ ╚████║╚██████╔╝██║███████║███████╗
  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚══════╝╚══════╝
`; // Font: ANSI Shadow

// ── Grid pixel dimensions ─────────────────────────────────────────────────────
export const CELL = 24; // px — size of each square cell
export const GAP = 2; // px — gap between cells

export const GRID_COLS = 25;
export const GRID_ROWS = 10;

export const VOL_COLS = 15;
export const VOL_ROWS = 1;

// ── Audio ─────────────────────────────────────────────────────────────────────
/** Multiply the computed gain by this factor. Decrease to lower the baseline volume. */
export const VOLUME_MULTIPLIER = 0.15;

/**
 * dB of boost/cut per weight step away from neutral (weight 5 = 0 dB).
 * Weight 10 → +(5 * DB_PER_STEP) dB, weight 1 → -(4 * DB_PER_STEP) dB.
 * Kept at 2.4 so weight 10 = +12 dB max — prevents clipping when many
 * adjacent bands are boosted simultaneously through the series filter chain.
 */
export const DB_PER_STEP = 2.4;

/**
 * Frequency range for the 25 bands.
 * F_MIN is chosen so the geometric mean sqrt(F_MIN * F_MAX) = 1000 Hz,
 * placing 1 kHz exactly at the midpoint column (col 12).
 * This gives clean ISO 1/3-octave aligned center frequencies.
 *   F_MIN = 1000² / 16000 = 62.5 Hz  →  rounded first band: 63 Hz
 */
export const F_MIN = 62.5;
export const F_MAX = 16000;

/**
 * Preset weight arrays (length 25, values 1–10).
 * Physically accurate:
 *   - White: flat (all 5)
 *   - Pink:  –3 dB/octave (1/f power); 9 at 63 Hz → 2 at 16 kHz
 *   - Brown: –6 dB/octave (1/f² power); 10 at 63 Hz → 1 at 16 kHz
 */
export const PRESET_WHITE: number[] = Array(GRID_COLS).fill(5);

export const PRESET_PINK: number[] = [
	8, 8, 7, 7, 7, 7, 6, 6, 6, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2
];

export const PRESET_BROWN: number[] = [
	9, 9, 8, 8, 8, 7, 7, 6, 6, 6, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2
];
