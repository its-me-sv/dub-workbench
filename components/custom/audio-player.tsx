"use client"

import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import ReloadIcon from "@hugeicons/core-free-icons/ReloadIcon"
import FileMusicIcon from "@hugeicons/core-free-icons/FileMusicIcon"
import { HugeiconsIcon } from "@hugeicons/react"
import { Slider } from "@/components/ui/slider"
import GoBackward10SecIcon from "@hugeicons/core-free-icons/GoBackward10SecIcon"
import GoForward10SecIcon from "@hugeicons/core-free-icons/GoForward10SecIcon"
import PlayIcon from "@hugeicons/core-free-icons/PlayIcon"
import PauseIcon from "@hugeicons/core-free-icons/PauseIcon"
import { useEffect, useRef, useState } from "react"
import {
  cn,
  extractWaveformFromChannelData,
  formatSeconds,
  generateWaveform,
  getMonoChannelData,
} from "@/lib/utils"
import { Skeleton } from "../ui/skeleton"
import SpeedController from "./speed-controller"

const AudioPlayer: React.FC<AudioPlayerProps> = ({ setFile, file }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [totalDuration, setDuration] = useState(0)
  const [currDuration, setCurrDuration] = useState(0)
  const [currSpeed, setCurrSpeed] = useState("1")
  const [dragging, setDragging] = useState(false)
  const wasPlayingBeforeDrag = useRef(false)
  const waveformContainerRef = useRef<HTMLDivElement>(null)
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null)
  const [waveformBarsCount, setWaveformBarsCount] = useState(0)
  const channelDataRef = useRef<Float32Array<ArrayBuffer> | null>(null)
  const [isChannelDataReady, setIsChannelDataReady] = useState(false)

  const handleChangeFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return
    const uploadedFile = e.target.files[0]
    setFile(uploadedFile)
  }

  const handlePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      await audio.play()
    } else {
      audio.pause()
    }
  }

  const handleRewind = async () => {
    const audio = audioRef.current
    if (!audio) return

    const nextStep = audio.currentTime - 10 < 0 ? 0 : audio.currentTime - 10
    audio.currentTime = nextStep
  }

  const handleForward = async () => {
    const audio = audioRef.current
    if (!audio) return

    const nextStep =
      audio.currentTime + 10 > totalDuration
        ? totalDuration
        : audio.currentTime + 10
    audio.currentTime = nextStep
  }

  const handleSliderChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    if (!dragging) {
      audio.currentTime = value[0]
    } else {
      setCurrDuration(value[0])
    }
  }

  const handleSpeedChange = (value: string) => {
    const audio = audioRef.current
    if (!audio) return

    audio.playbackRate = Number(value)
    setCurrSpeed(value)
  }

  const handleDragStart = () => {
    const audio = audioRef.current
    if (!audio) return

    wasPlayingBeforeDrag.current = !audio.paused
    audio.pause()

    setDragging(true)
  }

  const handleDragEnd = () => {
    const audio = audioRef.current
    if (!audio) return

    if (wasPlayingBeforeDrag.current) audio.play()
    setDragging(false)

    audio.currentTime = currDuration
  }

  const handleWaveFormClick = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const audio = audioRef.current
    const waveformDiv = waveformContainerRef.current
    if (!audio || !waveformDiv) return

    const rect = waveformDiv.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width

    audio.currentTime = ratio * totalDuration
  }

  // extracting and saving file into audio
  useEffect(() => {
    if (!file) return

    const getChannelData = async () => {
      const buffer = await file.arrayBuffer()
      const audioBuffer = await new AudioContext().decodeAudioData(buffer)
      channelDataRef.current = getMonoChannelData(audioBuffer)
      setIsChannelDataReady(true)
    }
    getChannelData()

    const url = URL.createObjectURL(file)
    const audioElement = new Audio(url)

    audioRef.current = audioElement

    const handleOnLoadMetadata = () => {
      console.log("loaded metadata", audioElement.duration)
      setDuration(audioElement.duration)
      setCurrDuration(0)
      wasPlayingBeforeDrag.current = false
      setDragging(false)
    }
    const handleOnTimeUpdate = () => setCurrDuration(audioElement.currentTime)

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audioElement.addEventListener("loadedmetadata", handleOnLoadMetadata)
    audioElement.addEventListener("timeupdate", handleOnTimeUpdate)

    audioElement.addEventListener("play", handlePlay)
    audioElement.addEventListener("pause", handlePause)
    audioElement.addEventListener("ended", handleEnded)

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleOnLoadMetadata)
      audioElement.removeEventListener("timeupdate", handleOnTimeUpdate)

      audioElement.removeEventListener("play", handlePlay)
      audioElement.removeEventListener("pause", handlePause)
      audioElement.removeEventListener("ended", handleEnded)

      audioElement.pause()
      audioElement.src = ""
      URL.revokeObjectURL(url)
      audioRef.current = null
      setIsChannelDataReady(false)
      channelDataRef.current = null
    }
  }, [file])

  // throttling and getting the waveform bars count
  useEffect(() => {
    const waveformDiv = waveformContainerRef.current
    if (!waveformDiv) return

    let frame: number | null = null
    let latestWidth = waveformDiv.getBoundingClientRect().width

    const observer = new ResizeObserver(([entry]) => {
      latestWidth = entry.contentRect.width
      if (frame !== null) return

      frame = requestAnimationFrame(() => {
        frame = null
        setWaveformBarsCount(Math.floor(latestWidth))
      })
    })

    observer.observe(waveformDiv)

    return () => {
      observer.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  // painting the canvas with the waveform
  useEffect(() => {
    if (
      channelDataRef.current === null ||
      !waveformBarsCount ||
      !waveformCanvasRef.current ||
      !isChannelDataReady
    )
      return
    const waveforms = extractWaveformFromChannelData(
      channelDataRef.current,
      Math.max(waveformBarsCount, 360)
    )
    generateWaveform(waveformCanvasRef.current, waveforms)
  }, [isChannelDataReady, waveformBarsCount])

  return (
    <Card className="w-[36svw]">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={FileMusicIcon} color="var(--primary)" />
          <div>
            <h4 className="text-md font-semibold">{file.name}</h4>
          </div>
        </div>
        <>
          <Button size="sm" onClick={handleChangeFileClick}>
            <HugeiconsIcon icon={ReloadIcon} />
            Change File
          </Button>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
          />
        </>
      </CardHeader>
      <CardFooter className="flex-col gap-[calc(var(--card-spacing)-1rem)]">
        <div className="flex w-full flex-col">
          <div
            ref={waveformContainerRef}
            className="flex h-[14svh] items-center"
          >
            {isChannelDataReady ? (
              <div className="relative flex h-full w-full">
                <canvas
                  ref={waveformCanvasRef}
                  className="z-10 h-full w-full cursor-pointer bg-muted"
                  onClick={handleWaveFormClick}
                />
                <div
                  className="absolute z-10 h-full bg-primary/10"
                  style={{
                    width: `${(currDuration / totalDuration) * 100}%`,
                  }}
                />
              </div>
            ) : (
              <Skeleton className="h-full w-full rounded-none" />
            )}
          </div>
          <Slider
            hideThumb
            value={[currDuration]}
            max={totalDuration}
            onValueChange={handleSliderChange}
            onPointerDown={handleDragStart}
            onPointerUp={handleDragEnd}
            trackClassName="rounded-none"
          />
          <div className="mt-1 flex w-full items-center justify-between text-sm tracking-wide text-muted-foreground">
            <span>{formatSeconds(currDuration)}</span>
            <span>{formatSeconds(totalDuration - currDuration + 1)}</span>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleRewind}
            >
              <HugeiconsIcon
                icon={GoBackward10SecIcon}
                color="var(--primary)"
              />
            </Button>
            <Button
              size="icon-lg"
              variant={!isPlaying ? "default" : "outline"}
              className={cn(
                "size-12 rounded-full [&_svg:not([class*='size-'])]:size-7",
                isPlaying && "border-2 border-primary"
              )}
              onClick={handlePlayPause}
            >
              {!isPlaying ? (
                <HugeiconsIcon
                  icon={PlayIcon}
                  fill="var(--primary-foreground)"
                />
              ) : (
                <HugeiconsIcon
                  icon={PauseIcon}
                  fill="var(--primary)"
                  color="var(--primary)"
                />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleForward}
            >
              <HugeiconsIcon icon={GoForward10SecIcon} color="var(--primary)" />
            </Button>
          </div>
          <SpeedController
            handleSpeedChange={handleSpeedChange}
            currSpeed={currSpeed}
          />
        </div>
      </CardFooter>
    </Card>
  )
}

export default AudioPlayer

interface AudioPlayerProps {
  file: File
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
}
