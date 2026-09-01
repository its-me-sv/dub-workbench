export {}

declare global {
  namespace Utils {
    type Waveforms = {
      mins: Float32Array<ArrayBuffer>
      maxs: Float32Array<ArrayBuffer>
    }
  }
}
