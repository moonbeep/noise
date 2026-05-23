/**
 * AudioWorklet processor — runs on the dedicated audio rendering thread.
 * Generates white noise (uniform random samples); spectral shaping is done
 * downstream by the BiquadFilter chain in the main engine.
 */
class NoiseProcessor extends AudioWorkletProcessor {
	process(_inputs, outputs) {
		const channel = outputs[0][0];
		for (let i = 0; i < channel.length; i++) {
			channel[i] = Math.random() * 2 - 1;
		}
		// Returning true keeps the processor alive indefinitely
		return true;
	}
}

registerProcessor('noise-processor', NoiseProcessor);
