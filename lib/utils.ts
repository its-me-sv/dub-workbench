import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatSeconds = (seconds: number): string => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0")
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
  const leftOutSeconds = String(Math.floor(seconds % 60)).padStart(2, "0")

  return `${hours[1] !== "0" ? hours : ""}${minutes}:${leftOutSeconds}`
}

export const extractWaveformFromChannelData = (
  channelData: Float32Array<ArrayBuffer>,
  numBars: number
): Utils.Waveforms => {
  const mins = new Float32Array(numBars)
  const maxs = new Float32Array(numBars)

  for (let i = 0; i < numBars; i += 1) {
    const start = Math.floor((i * channelData.length) / numBars)
    const end = Math.floor(((i + 1) * channelData.length) / numBars)

    let min = Infinity
    let max = -Infinity

    for (let j = start; j < end; j += 1) {
      const sample = channelData[j]

      if (sample < min) min = sample
      if (sample > max) max = sample
    }

    mins[i] = min
    maxs[i] = max
  }

  return { mins, maxs }
}

export const getMonoChannelData = (
  buffer: AudioBuffer
): Float32Array<ArrayBuffer> => {
  if (buffer.numberOfChannels === 1) return buffer.getChannelData(0)

  const monoChannel = new Float32Array(buffer.length)

  for (let c = 0; c < buffer.numberOfChannels; c += 1) {
    const channelData = buffer.getChannelData(c)
    for (let i = 0; i < buffer.length; i += 1)
      monoChannel[i] += channelData[i] / buffer.numberOfChannels
  }

  return monoChannel
}

export const generateWaveform = (
  canvas: HTMLCanvasElement,
  waveforms: Utils.Waveforms
) => {
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.scale(dpr, dpr)

  const width = rect.width
  const height = rect.height
  const centerVertical = height / 2

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = "#434a"

  const { maxs, mins } = waveforms
  const barWidth = width / maxs.length

  for (let i = 0; i < maxs.length; i += 1) {
    const x = i * barWidth

    const minY = centerVertical - maxs[i] * centerVertical
    const maxY = centerVertical - mins[i] * centerVertical

    const barHeight = Math.max(1, maxY - minY)

    ctx.fillRect(x, minY, Math.max(1, barWidth), barHeight)
  }
}
