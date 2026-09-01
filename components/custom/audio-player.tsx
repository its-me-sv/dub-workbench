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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const AudioPlayer: React.FC<AudioPlayerProps> = ({ setFile, file }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [totalDuration, setDuration] = useState(0)
  const [currDuration, setCurrDuration] = useState(0)
  const [currSpeed, setCurrSpeed] = useState("1")
  const [dragging, setDragging] = useState(false)
  const wasPlayingBeforeDrag = useRef(false)

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

  useEffect(() => {
    if (!file) return

    const url = URL.createObjectURL(file)
    const audioElement = new Audio(url)

    audioRef.current = audioElement

    const handleOnLoadMetadata = () => {
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
    }
  }, [file])

  return (
    <Card className="w-[42svw]">
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
      <div className="mx-(--card-spacing) flex h-[14svh] items-center justify-center rounded-xl border-2 border-dotted border-border">
        <p className="text-sm text-muted-foreground">
          Waveform will be displayed here.
        </p>
      </div>
      <CardFooter className="flex-col gap-(--card-spacing)">
        <div className="flex w-full flex-col gap-1">
          <Slider
            value={[currDuration]}
            max={totalDuration}
            onValueChange={handleSliderChange}
            onPointerDown={handleDragStart}
            onPointerUp={handleDragEnd}
          />
          <div className="flex w-full items-center justify-between text-sm tracking-wide text-muted-foreground">
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Speed</span>
            <ToggleGroup
              type="single"
              size="sm"
              variant="outline"
              spacing={0}
              value={currSpeed}
              onValueChange={handleSpeedChange}
            >
              {SPEEDS.map(String).map((speed) => (
                <ToggleGroupItem
                  key={speed}
                  value={speed}
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {speed}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
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

const SPEEDS = [0.5, 1, 1.25, 1.5, 2]

const formatSeconds = (seconds: number): string => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0")
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
  const leftOutSeconds = String(Math.floor(seconds % 60)).padStart(2, "0")

  return `${hours[1] !== "0" ? hours : ""}${minutes}:${leftOutSeconds}`
}
