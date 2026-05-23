import { base } from '$app/paths';
import {
	GRID_COLS,
	VOLUME_MULTIPLIER,
	DB_PER_STEP,
	F_MIN,
	F_MAX,
	PRESET_WHITE,
	PRESET_PINK,
	PRESET_BROWN
} from '$lib/constants';

export const N = GRID_COLS;
export type Weights = number[]; // length N, values 1–10

// Log-spaced center frequencies: F_MIN → F_MAX
// F_MIN = 62.5 Hz places 1 kHz exactly at the midpoint column (col 12).
export const FREQS: number[] = Array.from({ length: N }, (_, i) =>
	Math.round(F_MIN * (F_MAX / F_MIN) ** (i / (N - 1)))
);

export const defaultWeights: Weights = [...PRESET_WHITE];

export const presets: Record<string, Weights> = {
	white: [...PRESET_WHITE],
	pink: [...PRESET_PINK],
	brown: [...PRESET_BROWN]
};

// ── Audio engine ──────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
const mkCtx = (): AudioContext =>
	new ((window as any).AudioContext ?? (window as any).webkitAudioContext)();
/* eslint-enable @typescript-eslint/no-explicit-any */

let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let worklet: AudioWorkletNode | null = null;
const filters: BiquadFilterNode[] = [];

function teardown() {
	try {
		worklet?.disconnect();
	} catch {
		/**/
	}
	filters.forEach((f) => {
		try {
			f.disconnect();
		} catch {
			/**/
		}
	});
	try {
		gain?.disconnect();
	} catch {
		/**/
	}
	try {
		ctx?.close();
	} catch {
		/**/
	}
	worklet = null;
	gain = null;
	ctx = null;
	filters.length = 0;
}

export async function play(w: Weights, volume: number): Promise<void> {
	teardown();

	ctx = mkCtx();
	gain = ctx.createGain();
	gain.gain.value = (volume / 10) * VOLUME_MULTIPLIER;

	// Build the BiquadFilter chain
	FREQS.forEach((freq, i) => {
		const f = ctx!.createBiquadFilter();
		f.type = i === 0 ? 'lowshelf' : i === N - 1 ? 'highshelf' : 'peaking';
		f.frequency.value = freq;
		f.Q.value = 1.41;
		f.gain.value = (w[i] - 5) * DB_PER_STEP; // weight 1→−9.6 dB, 5→0 dB, 10→+12 dB
		filters.push(f);
	});

	// Load the worklet module (no-op if already registered in this context)
	await ctx.audioWorklet.addModule(`${base}/noise-processor.js`);
	worklet = new AudioWorkletNode(ctx, 'noise-processor');

	// Chain: worklet → filter[0] → … → filter[N-1] → gain → destination
	let node: AudioNode = worklet;
	for (const f of filters) {
		node.connect(f);
		node = f;
	}
	node.connect(gain);
	gain.connect(ctx.destination);
}

export function stop() {
	teardown();
}

export function setVolume(v: number) {
	if (gain) gain.gain.value = (v / 10) * VOLUME_MULTIPLIER;
}

export function applyWeights(w: Weights) {
	filters.forEach((f, i) => {
		f.gain.value = (w[i] - 5) * DB_PER_STEP;
	});
}
