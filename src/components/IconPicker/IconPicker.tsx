import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '#/lib/utils.ts'
import { Button } from '#/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import {
  DEFAULT_SQUAD_ICON,
  getSquadIcon,
  isSquadIconKey,
  SQUAD_ICON_KEYS,
  squadIconLabels,
  type SquadIconKey,
} from './squad-icon-registry'

export interface IconPickerProps {
  value: string
  onChange: (value: SquadIconKey) => void
  disabled?: boolean
  className?: string
}

function IconPicker({
  value,
  onChange,
  disabled = false,
  className,
}: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const selectedKey = isSquadIconKey(value) ? value : DEFAULT_SQUAD_ICON
  const SelectedIcon = getSquadIcon(selectedKey)

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
            <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/30">
              <SelectedIcon className="size-3.5 text-foreground" />
            </span>
            <span className="text-sm text-foreground">
              {squadIconLabels[selectedKey]}
            </span>
          </Button>
        }
      />

      <PopoverContent align="start" className="w-80 gap-3 p-3">
        <p className="text-xs font-medium text-foreground">Choose an icon</p>
        <div className="grid grid-cols-7 gap-2">
          {SQUAD_ICON_KEYS.map((iconKey) => {
            const Icon = getSquadIcon(iconKey)
            const isSelected = selectedKey === iconKey

            return (
              <button
                key={iconKey}
                type="button"
                title={squadIconLabels[iconKey]}
                aria-label={`Select ${squadIconLabels[iconKey]} icon`}
                className={cn(
                  'relative flex size-9 items-center justify-center rounded-md border border-border/60 bg-muted/20 transition-colors hover:bg-muted/50',
                  isSelected &&
                    'border-primary bg-primary/10 ring-2 ring-ring ring-offset-2 ring-offset-background',
                )}
                onClick={() => {
                  onChange(iconKey)
                  setOpen(false)
                }}
              >
                <Icon className="size-4 text-foreground" />
                {isSelected && (
                  <span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default IconPicker
