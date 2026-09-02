import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

const SpeedController: React.FC<SpeedControllerProps> = ({
  handleSpeedChange,
  currSpeed,
}) => {
  return (
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
            {speed}x
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

export default SpeedController

interface SpeedControllerProps {
  handleSpeedChange: (value: string) => void
  currSpeed: string
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2]
