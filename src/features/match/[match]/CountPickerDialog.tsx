import {
  type FC,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Kbd } from '#/components/ui/kbd'
import { cn } from '#/lib/utils'

const SQUARE_VALUES = [0, 1, 2, 3] as const

function valueFromKey(key: string): number | null {
  if (/^[0-3]$/.test(key)) return parseInt(key, 10)
  if (key === '-') return 2
  return null
}

type CountPickerDialogProps = {
  open: boolean
  title: string
  description: string
  maxValue?: number
  minConfirm?: number
  onConfirm: (value: number) => void
  onCancel: () => void
}

const CountPickerDialog: FC<CountPickerDialogProps> = ({
  open,
  title,
  description,
  maxValue = 3,
  minConfirm = 0,
  onConfirm,
  onCancel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => containerRef.current?.focus())
  }, [open])

  const trySelect = useCallback(
    (next: number) => {
      if (next < minConfirm || next > maxValue) return
      onConfirm(next)
    },
    [maxValue, minConfirm, onConfirm],
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const digit = valueFromKey(e.key)
    if (digit !== null) {
      e.preventDefault()
      trySelect(digit)
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel()
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div
          ref={containerRef}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="grid gap-4 py-2 outline-none"
        >
          <div className="flex gap-2">
            {SQUARE_VALUES.map((n) => {
              const disabled = n > maxValue || n < minConfirm

              return (
                <button
                  key={n}
                  type="button"
                  disabled={disabled}
                  onClick={() => trySelect(n)}
                  className={cn(
                    'flex size-14 flex-1 items-center justify-center rounded-lg border-2 text-xl font-bold tabular-nums transition-all',
                    'border-border hover:border-primary/50 hover:bg-primary/10',
                    disabled && 'cursor-not-allowed opacity-25',
                  )}
                >
                  {n}
                </button>
              )
            })}
          </div>

          <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Kbd>0</Kbd>
            <Kbd>1</Kbd>
            <Kbd>2</Kbd>
            <Kbd>3</Kbd>
            <span>vagy</span>
            <Kbd>-</Kbd>
            <span>→ 2</span>
            <span className="mx-1">·</span>
            <Kbd>Esc</Kbd>
            <span>mégse</span>
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Mégse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CountPickerDialog
