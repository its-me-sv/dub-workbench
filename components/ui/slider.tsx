"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ClassNameValue } from "tailwind-merge"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  hideThumb = false,
  trackClassName = "",
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  hideThumb?: boolean
  trackClassName?: ClassNameValue
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full cursor-pointer touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5",
          trackClassName
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {!hideThumb &&
        Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] select-none hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
