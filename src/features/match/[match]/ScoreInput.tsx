import {
  type FC,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { Input } from '#/components/ui/input'
import { Kbd } from '#/components/ui/kbd'
import { cn } from '#/lib/utils'
import {
  parseScoreStructure,
  resolveCheckoutFlowSteps,
  type CheckoutFlowStep,
} from '#/utils/score-parser'
import { toast } from 'sonner'
import {
  addScore,
  getRemainingScore,
  matchStore,
} from '../../../../store/match-store'
import CheckoutFlow from './CheckoutFlow'

const PREFIX_KEYS = new Set(['f', 'r', 'a'])
const OPEN_COMMAND_KEYS = new Set(['f', 'r', 'a', 's', 'd', 't'])
const PREFIX_ORDER = ['f', 'r', 'a'] as const

type PrefixChar = (typeof PREFIX_ORDER)[number]

type CommandHint = {
  label: string
  prefix?: string
  value: string
}

const COMMAND_HINTS: CommandHint[] = [
  { label: 'Visit score', value: '156' },
  { label: 'Remaining', prefix: 'r', value: '32' },
  { label: 'Force score', prefix: 'f', value: '156' },
  { label: 'Force remaining', prefix: 'fr', value: '32' },
  { label: 'Advanced', prefix: 'a', value: '156-3-1' },
  { label: 'Remaining advanced', prefix: 'ra', value: '32-2-1' },
  { label: 'Force advanced', prefix: 'fa', value: '156-3-0' },
  { label: 'Force remaining advanced', prefix: 'fra', value: '32-2-1' },
  { label: 'Detailed darts', value: 'S20 D16 T12' },
  { label: 'Submit', value: 'Enter' },
  { label: 'Close', value: 'Esc' },
]

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

function sortPrefix(prefix: string) {
  const chars = new Set(prefix.split(''))
  return PREFIX_ORDER.filter((key) => chars.has(key)).join('')
}

function togglePrefixChar(prefix: string, char: PrefixChar) {
  const chars = new Set(prefix.split(''))
  if (chars.has(char)) chars.delete(char)
  else chars.add(char)
  return PREFIX_ORDER.filter((key) => chars.has(key)).join('')
}

function getOpenTrigger(key: string): { prefix: string; value: string } | null {
  if (key === 'Enter') return { prefix: '', value: '' }
  if (/^[0-9]$/.test(key)) return { prefix: '', value: key }
  const lower = key.toLowerCase()
  if (OPEN_COMMAND_KEYS.has(lower)) {
    if (PREFIX_KEYS.has(lower)) return { prefix: lower, value: '' }
    return { prefix: '', value: lower }
  }
  return null
}

function buildCommand(prefix: string, value: string) {
  return `${prefix}${value.trim()}`
}

const HintRow: FC<CommandHint> = ({ label, prefix, value }) => (
  <div className="flex items-center justify-between gap-4 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <div className="flex items-center gap-1 font-mono">
      {prefix ? (
        <>
          <Kbd className="h-auto min-h-6 px-2 py-1 text-xs">{prefix}</Kbd>
          <span className="text-muted-foreground">:</span>
        </>
      ) : null}
      <Kbd className="h-auto min-h-6 px-2 py-1 text-xs">{value}</Kbd>
    </div>
  </div>
)

const ScoreInput: FC<{ disabled?: boolean }> = ({ disabled = false }) => {
  const [open, setOpen] = useState(false)
  const [prefix, setPrefix] = useState('')
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutSteps, setCheckoutSteps] = useState<CheckoutFlowStep[]>([])
  const [pendingCommand, setPendingCommand] = useState<string | null>(null)
  const [pendingScorer, setPendingScorer] = useState<{
    teamId: string
    playerId: string
  } | null>(null)

  const cancelCheckout = useCallback(() => {
    setCheckoutOpen(false)
    setCheckoutSteps([])
    setPendingCommand(null)
    setPendingScorer(null)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setPrefix('')
    setValue('')
    setCheckoutOpen(false)
    setCheckoutSteps([])
    setPendingCommand(null)
    setPendingScorer(null)
  }, [])

  const openWith = useCallback((initial: { prefix: string; value: string }) => {
    setPrefix(sortPrefix(initial.prefix))
    setValue(initial.value)
    setOpen(true)
  }, [])

  const submitScore = useCallback(
    async (
      command: string,
      scorer: { teamId: string; playerId: string },
      checkoutDetails?: { dartsThrown: number; checkoutAttempts: number },
    ) => {
      setIsSubmitting(true)
      try {
        const ok = await addScore(
          command,
          checkoutDetails ? { checkoutDetails } : undefined,
          scorer,
        )
        if (ok) close()
      } finally {
        setIsSubmitting(false)
      }
    },
    [close],
  )

  const trySubmit = useCallback(
    (command: string) => {
      const state = matchStore.get()
      const teamId = state.match?.currentTeamId
      if (!teamId) return

      const team = state.teams.find((entry) => entry.id === teamId)
      const playerId = team?.currentPlayerId
      if (!playerId) return

      const scorer = { teamId, playerId }
      const normalizedCommand = command.trim() || '0'

      const parsed = parseScoreStructure(normalizedCommand)
      if (!parsed.isValid) {
        toast.error(parsed.error ?? 'Invalid score input.')
        return
      }

      const remainingBefore = getRemainingScore(teamId)
      const steps = resolveCheckoutFlowSteps(parsed, remainingBefore)
      if (steps.length > 0) {
        setPendingScorer(scorer)
        setPendingCommand(normalizedCommand)
        setCheckoutSteps(steps)
        setCheckoutOpen(true)
        return
      }

      void submitScore(normalizedCommand, scorer)
    },
    [submitScore],
  )

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (disabled || open) return
      if (isEditableTarget(e.target)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const initial = getOpenTrigger(e.key)
      if (initial === null) return

      e.preventDefault()
      openWith(initial)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [disabled, open, openWith])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      if (checkoutOpen) {
        cancelCheckout()
        return
      }
      close()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, checkoutOpen, close, cancelCheckout])

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const key = e.key.toLowerCase()

    if (e.key === 'Escape') {
      e.preventDefault()
      if (checkoutOpen) {
        cancelCheckout()
        return
      }
      close()
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      if (isSubmitting) return

      const command = buildCommand(prefix, value)
      trySubmit(command)
      return
    }

    if (e.key === 'Backspace' && value === '' && prefix) {
      e.preventDefault()
      setPrefix((current) => current.slice(0, -1))
      return
    }

    if (
      e.key.length === 1 &&
      PREFIX_KEYS.has(key) &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey
    ) {
      e.preventDefault()
      setPrefix((current) => togglePrefixChar(current, key as PrefixChar))
    }
  }

  if (disabled || !open) return null

  return (
    <>
      <CheckoutFlow
        open={checkoutOpen}
        steps={checkoutSteps}
        onCancel={cancelCheckout}
        onConfirm={(dartsThrown, checkoutAttempts) => {
          if (!pendingCommand || !pendingScorer) return
          setCheckoutOpen(false)
          setCheckoutSteps([])
          const command = pendingCommand
          const scorer = pendingScorer
          setPendingCommand(null)
          setPendingScorer(null)
          void submitScore(command, scorer, { dartsThrown, checkoutAttempts })
        }}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <button
          type="button"
          aria-label="Close score input"
          className="absolute inset-0 bg-background/75 backdrop-blur-md"
          onClick={() => (checkoutOpen ? cancelCheckout() : close())}
        />

        <div className="relative z-10 w-full max-w-3xl space-y-6">
          <div
            className={cn(
              'space-y-2.5 rounded-xl border border-border/60 bg-card/90 p-4 shadow-2xl backdrop-blur-sm',
            )}
          >
            {COMMAND_HINTS.map((hint) => (
              <HintRow key={hint.label} {...hint} />
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/90 px-5 py-4 shadow-2xl backdrop-blur-sm">
            {prefix ? (
              <span className="shrink-0 font-mono text-xl font-semibold tracking-wide text-muted-foreground">
                {prefix}:
              </span>
            ) : null}

            <Input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
              placeholder="score…"
              className="h-auto min-h-[4.5rem] flex-1 border-0 bg-transparent px-0 text-center text-5xl font-bold tracking-wide shadow-none focus-visible:ring-0 md:text-6xl"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ScoreInput
