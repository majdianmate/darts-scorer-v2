import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '#/lib/utils.ts'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'

const PRESET_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#ec4899',
  '#ed1c24',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#0ea5e9',
  '#64748b',
  '#78716c',
] as const

const DEFAULT_COLOR: string = PRESET_COLORS[0]

function normalizeHex(value: string): string | null {
  const trimmed = value.trim()

  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase()
  }

  if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return `#${trimmed.toLowerCase()}`
  }

  return null
}

export interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

function ColorPicker({
  value,
  onChange,
  disabled = false,
  className,
}: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setHexInput(value)
  }, [value])

  const applyHex = (raw: string) => {
    const normalized = normalizeHex(raw)
    if (normalized) {
      onChange(normalized)
      setHexInput(normalized)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'h-9 w-full justify-start gap-2.5 px-2.5 font-normal',
              className,
            )}
          >
            <span
              className="size-5 shrink-0 rounded-md border border-border/60 shadow-sm"
              style={{ backgroundColor: value }}
            />
            <span className="font-mono text-sm text-foreground">{value}</span>
          </Button>
        }
      />

      <PopoverContent align="start" className="w-64 gap-3 p-3">
        <p className="text-xs font-medium text-foreground">Preset colors</p>
        <div className="grid grid-cols-6 gap-2">
          {PRESET_COLORS.map((preset) => {
            const isSelected = value.toLowerCase() === preset

            return (
              <button
                key={preset}
                type="button"
                aria-label={`Select color ${preset}`}
                className={cn(
                  'relative flex size-8 items-center justify-center rounded-md border border-border/60 transition-transform hover:scale-105',
                  isSelected && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
                )}
                style={{ backgroundColor: preset }}
                onClick={() => {
                  onChange(preset)
                  setHexInput(preset)
                }}
              >
                {isSelected && (
                  <Check
                    className="size-3.5 text-white drop-shadow-sm"
                    strokeWidth={3}
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">Custom color</p>
          <div className="flex items-center gap-2">
            <label className="relative shrink-0 cursor-pointer">
              <span className="sr-only">Pick a custom color</span>
              <input
                type="color"
                value={value}
                disabled={disabled}
                onChange={(event) => {
                  const next = event.target.value.toLowerCase()
                  onChange(next)
                  setHexInput(next)
                }}
                className="size-9 cursor-pointer rounded-lg border border-input bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>
            <Input
              value={hexInput}
              disabled={disabled}
              onChange={(event) => setHexInput(event.target.value)}
              onBlur={() => applyHex(hexInput)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  applyHex(hexInput)
                }
              }}
              placeholder="#6366f1"
              className="h-9 flex-1 font-mono text-sm"
              spellCheck={false}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { ColorPicker, DEFAULT_COLOR, PRESET_COLORS }
