"use client"

import AudioPlayer from "@/components/custom/audio-player"
import { useEffect, useState } from "react"

export default function Page() {
  const [file, setFile] = useState<File>()

  useEffect(() => {
    const loadFile = async () => {
      const response = await fetch("/audio/voice_clone_input.mp3")
      const blob = await response.blob()

      const contentType = response.headers.get("Content-Type") || blob.type

      const fetchedFile = new File([blob], "voice_clone_input.mp3", {
        type: contentType,
        lastModified: Date.now(),
      })

      setFile(fetchedFile)
    }

    loadFile()
  }, [])

  return (
    <div className="flex min-h-svh items-center justify-center">
      {file && <AudioPlayer file={file} setFile={setFile} />}
    </div>
  )
}
