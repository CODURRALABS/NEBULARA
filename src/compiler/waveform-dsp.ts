// Waveform DSP - Pattern recognition for ~HEX~ literals
// Audio synthesis and frequency analysis

export interface Waveform {
  bytes: number[]
  frequency: number
  amplitude: number
  phase: number
}

export class WaveformDSP {
  // Parse ~HEX~ format to bytes
  parse(hex: string): Waveform {
    const clean = hex.replace(/~/g, '')
    const bytes = clean.match(/../g)?.map(h => parseInt(h, 16)) || []
    return {
      bytes,
      frequency: this.frequency(bytes),
      amplitude: this.amplitude(bytes),
      phase: this.phase(bytes)
    }
  }

  // Amplitude envelope
  amplitude(bytes: number[]): number {
    if (bytes.length === 0) return 0
    const sum = bytes.reduce((a, b) => a + b, 0)
    return sum / bytes.length / 255
  }

  // Zero-crossing frequency
  frequency(bytes: number[]): number {
    let crossings = 0
    for (let i = 1; i < bytes.length; i++) {
      if ((bytes[i-1] < 128 && bytes[i] >= 128) || 
          (bytes[i-1] >= 128 && bytes[i] < 128)) {
        crossings++
      }
    }
    return crossings / (bytes.length || 1)
  }

  // Phase detection
  phase(bytes: number[]): number {
    if (bytes.length < 2) return 0
    const first = bytes[0]
    const last = bytes[bytes.length - 1]
    return (last - first) / (bytes.length || 1) / 255
  }

  // Pattern matching
  match(pattern: Waveform, target: Waveform, threshold = 0.8): boolean {
    const ampDiff = Math.abs(pattern.amplitude - target.amplitude)
    const freqDiff = Math.abs(pattern.frequency - target.frequency)
    const phaseDiff = Math.abs(pattern.phase - target.phase)
    
    const similarity = 1 - (ampDiff + freqDiff + phaseDiff) / 3
    return similarity >= threshold
  }

  // Generate waveform from parameters
  generate(frequency: number, amplitude: number, phase: number, length: number = 32): Waveform {
    const bytes: number[] = []
    for (let i = 0; i < length; i++) {
      const t = i / length
      const v = Math.sin(2 * Math.PI * frequency * t + phase) * amplitude
      bytes.push(Math.floor((v + 1) * 127.5))
    }
    return {
      bytes,
      frequency,
      amplitude,
      phase
    }
  }

  // Synthesize to WAV format
  toWAV(waveform: Waveform): Buffer {
    const header = Buffer.alloc(44)
    
    // RIFF header
    header.write('RIFF', 0)
    header.writeUInt32LE(32 + waveform.bytes.length, 4)
    header.write('WAVE', 8)
    
    // fmt chunk
    header.write('fmt ', 12)
    header.writeUInt32LE(16, 16)
    header.writeUInt16LE(1, 20) // PCM
    header.writeUInt16LE(1, 22) // mono
    header.writeUInt32LE(44100, 24) // sample rate
    header.writeUInt32LE(44100, 28) // byte rate
    header.writeUInt16LE(8, 32) // bits per sample
    
    // data chunk
    header.write('data', 36)
    header.writeUInt32LE(waveform.bytes.length, 40)
    
    return Buffer.concat([header, Buffer.from(waveform.bytes)])
  }

  // Convolution with kernel
  convolve(signal: number[], kernel: number[]): number[] {
    const result: number[] = []
    for (let i = 0; i < signal.length; i++) {
      let sum = 0
      for (let j = 0; j < kernel.length; j++) {
        if (i - j >= 0) {
          sum += signal[i - j] * kernel[j]
        }
      }
      result.push(sum)
    }
    return result
  }

  // FFT (simplified)
  fft(real: number[], imag: number[] = []): { real: number[], imag: number[] } {
    const n = real.length
    const result = { real: [...real], imag: [...imag] }
    
    // Simple DFT (O(n²) for small N)
    for (let k = 0; k < n; k++) {
      let re = 0, im = 0
      for (let j = 0; j < n; j++) {
        const theta = -2 * Math.PI * k * j / n
        re += real[j] * Math.cos(theta) - (imag[j] || 0) * Math.sin(theta)
        im += real[j] * Math.sin(theta) + (imag[j] || 0) * Math.cos(theta)
      }
      result.real[k] = re
      result.imag[k] = im
    }
    
    return result
  }
}