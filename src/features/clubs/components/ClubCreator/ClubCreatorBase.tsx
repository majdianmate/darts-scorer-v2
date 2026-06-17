import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { cn } from '#/lib/utils.ts'

export interface ClubCreatorBaseProps {
  name: string
  description: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  disabled?: boolean
  className?: string
}

const ClubCreatorBase = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  disabled = false,
  className,
}: ClubCreatorBaseProps) => {
  return (
    <div className={cn('flex h-full flex-col gap-5', className)}>
      <div>
        <h3 className="text-sm font-semibold text-foreground">Club details</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Give your club a name and a short description.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="club-name">Name</Label>
          <Input
            id="club-name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="e.g. Bullseye Brigade"
            disabled={disabled}
            maxLength={50}
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">{name.length}/50</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="club-description">Description</Label>
          <textarea
            id="club-description"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="What is this club about?"
            disabled={disabled}
            maxLength={300}
            rows={5}
            className={cn(
              'min-h-28 w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80',
            )}
          />
          <p className="text-xs text-muted-foreground">
            {description.length}/300
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClubCreatorBase
