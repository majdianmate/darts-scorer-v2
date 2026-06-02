import { type FC } from 'react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs'
import { Label } from '#/components/ui/label'
import { cn } from '#/lib/utils.ts'
import {
  CheckoutMode,
  GameMode,
  type MatchConfig,
  type Team,
} from '../../../../types/match-types'
import StartingTeamPicker from './StartingTeamPicker'

const LEG_OPTIONS = [3, 5, 7, 9] as const
const STARTING_SCORE_OPTIONS = [301, 501, 701] as const

interface MatchConfigBaseProps {
  matchConfig: MatchConfig
  teams: Team[]
  onMatchConfigChange: (matchConfig: MatchConfig) => void
  disabled?: boolean
  className?: string
}

interface ConfigTabFieldProps {
  label: string
  value: string
  options: readonly { value: string; label: string }[]
  onValueChange: (value: string) => void
  disabled?: boolean
  className?: string
}

const ConfigTabField: FC<ConfigTabFieldProps> = ({
  label,
  value,
  options,
  onValueChange,
  disabled = false,
  className,
}) => (
  <div className={cn('space-y-1', className)}>
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className={cn('gap-0', disabled && 'pointer-events-none opacity-50')}
    >
      <TabsList
        className="relative grid h-8 w-full p-0.5"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className="h-7 px-1.5 text-xs"
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  </div>
)

interface ConfigCheckboxProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

const ConfigCheckbox: FC<ConfigCheckboxProps> = ({
  label,
  checked,
  onCheckedChange,
  disabled = false,
}) => (
  <label
    className={cn(
      'inline-flex cursor-pointer items-center gap-2 text-sm text-foreground',
      disabled && 'pointer-events-none opacity-50',
    )}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onCheckedChange(event.target.checked)}
      disabled={disabled}
      className="size-3.5 shrink-0 rounded border border-input accent-primary"
    />
    {label}
  </label>
)

const MatchConfigBase: FC<MatchConfigBaseProps> = ({
  matchConfig,
  teams,
  onMatchConfigChange,
  disabled = false,
  className,
}) => {
  const update = (patch: Partial<MatchConfig>) => {
    onMatchConfigChange({ ...matchConfig, ...patch })
  }

  const gameModeOptions = Object.values(GameMode).map((mode) => ({
    value: mode,
    label: mode,
  }))

  const checkoutOptions = Object.values(CheckoutMode).map((mode) => ({
    value: mode,
    label: mode,
  }))

  const legOptions = LEG_OPTIONS.map((legs) => ({
    value: String(legs),
    label: String(legs),
  }))

  const scoreOptions = STARTING_SCORE_OPTIONS.map((score) => ({
    value: String(score),
    label: String(score),
  }))

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <ConfigTabField
        label="Game mode"
        value={matchConfig.gameMode}
        options={gameModeOptions}
        onValueChange={(value) => update({ gameMode: value as GameMode })}
        disabled={disabled}
      />

      <ConfigTabField
        label="Checkout"
        value={matchConfig.checkoutMode}
        options={checkoutOptions}
        onValueChange={(value) => update({ checkoutMode: value as CheckoutMode })}
        disabled={disabled}
      />

      <div className="grid grid-cols-2 gap-3">
        <ConfigTabField
          label="Legs"
          value={String(matchConfig.numberOfLegs)}
          options={legOptions}
          onValueChange={(value) => update({ numberOfLegs: Number(value) })}
          disabled={disabled}
        />

        <ConfigTabField
          label="Starting score"
          value={String(matchConfig.startingScore)}
          options={scoreOptions}
          onValueChange={(value) => update({ startingScore: Number(value) })}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/50 pt-3">
        <ConfigCheckbox
          label="Display score"
          checked={matchConfig.displayScore}
          onCheckedChange={(checked) => update({ displayScore: checked })}
          disabled={disabled}
        />
        <ConfigCheckbox
          label="AI voice"
          checked={matchConfig.aiVoice}
          onCheckedChange={(checked) => update({ aiVoice: checked })}
          disabled={disabled}
        />
      </div>

      <StartingTeamPicker
        teams={teams}
        startingTeamId={matchConfig.startingTeamId}
        onStartingTeamChange={(teamId) => update({ startingTeamId: teamId })}
        disabled={disabled}
      />
    </div>
  )
}

export default MatchConfigBase
