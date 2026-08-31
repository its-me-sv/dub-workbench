import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import Upload01Icon from "@hugeicons/core-free-icons/Upload01Icon"
import FileMusicIcon from "@hugeicons/core-free-icons/FileMusicIcon"
import { HugeiconsIcon } from "@hugeicons/react"
import { Slider } from "@/components/ui/slider"
import GoBackward10SecIcon from "@hugeicons/core-free-icons/GoBackward10SecIcon"
import GoForward10SecIcon from "@hugeicons/core-free-icons/GoForward10SecIcon"
import PlayIcon from "@hugeicons/core-free-icons/PlayIcon"
import PauseIcon from "@hugeicons/core-free-icons/PauseIcon"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Card className="w-[42svw]">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FileMusicIcon} color="var(--primary)" />
            <div>
              <h4 className="text-md font-semibold">voice_clone_output.mp3</h4>
              <p className="text-xs text-muted-foreground">
                Local file · 44.1 kHz
              </p>
            </div>
          </div>
          <Button size="sm">
            <HugeiconsIcon icon={Upload01Icon} />
            Choose File
          </Button>
        </CardHeader>
        <div className="mx-(--card-spacing) flex h-[14svh] items-center justify-center rounded-xl border-2 border-dotted border-border">
          <p className="text-sm text-muted-foreground">
            Waveform will be displayed here.
          </p>
        </div>
        <CardFooter className="flex-col gap-(--card-spacing)">
          <div className="flex w-full flex-col gap-1">
            <Slider />
            <div className="flex w-full items-center justify-between text-sm tracking-wide text-muted-foreground">
              <span>00:00</span>
              <span>--:--</span>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <HugeiconsIcon
                  icon={GoBackward10SecIcon}
                  color="var(--primary)"
                />
              </Button>
              {1 % 1 === 0 ? (
                <Button
                  size="icon-lg"
                  className="size-12 rounded-full [&_svg:not([class*='size-'])]:size-7"
                >
                  <HugeiconsIcon
                    icon={PlayIcon}
                    fill="var(--primary-foreground)"
                  />
                </Button>
              ) : (
                <Button
                  size="icon-lg"
                  variant="outline"
                  className="size-12 rounded-full border-2 border-primary [&_svg:not([class*='size-'])]:size-7"
                >
                  <HugeiconsIcon
                    icon={PauseIcon}
                    fill="var(--primary)"
                    color="var(--primary)"
                  />
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <HugeiconsIcon
                  icon={GoForward10SecIcon}
                  color="var(--primary)"
                />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Speed</span>
              <ToggleGroup
                type="single"
                size="sm"
                variant="outline"
                spacing={0}
              >
                {SPEEDS.map(String).map((speed) => (
                  <ToggleGroupItem key={speed} value={speed}>
                    {speed}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2]
