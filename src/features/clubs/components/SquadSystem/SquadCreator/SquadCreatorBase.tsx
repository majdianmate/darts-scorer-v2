import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { IconPicker } from '#/components/IconPicker'
import type { SquadIconKey } from '#/components/IconPicker'
import { cn } from '#/lib/utils.ts'
import { ColorPicker } from '#/components/ui/color-picker'

export interface SquadCreatorBaseProps {
  name: string
  color: string
  icon: string
  onNameChange: (value: string) => void
  onColorChange: (value: string) => void
  onIconChange: (value: SquadIconKey) => void
  disabled?: boolean
  className?: string
}

const SquadCreatorBase = ({
  name,
  color,
  icon,
  onNameChange,
  onColorChange,
  onIconChange,
  disabled = false,
  className,
}: SquadCreatorBaseProps) => {
  return (
    <div className={cn('flex h-full flex-col gap-5', className)}>
      <div>
        <h3 className="text-sm font-semibold text-foreground">Squad details</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Name your squad and pick a color and icon to identify it.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="squad-name">Name</Label>
          <Input
            id="squad-name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="e.g. Team Alpha"
            disabled={disabled}
            maxLength={50}
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">{name.length}/50</p>
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <ColorPicker
            value={color}
            onChange={onColorChange}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Icon</Label>
          <IconPicker
            value={icon}
            onChange={onIconChange}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}

export default SquadCreatorBase
