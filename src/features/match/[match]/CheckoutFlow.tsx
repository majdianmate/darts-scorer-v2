import { type FC, useCallback, useEffect, useState } from 'react'

import type { CheckoutFlowStep } from '#/utils/score-parser'

import CountPickerDialog from './CountPickerDialog'

type CheckoutFlowProps = {
  open: boolean
  steps: CheckoutFlowStep[]
  onCancel: () => void
  onConfirm: (dartsThrown: number, checkoutAttempts: number) => void
}

const CheckoutFlow: FC<CheckoutFlowProps> = ({
  open,
  steps,
  onCancel,
  onConfirm,
}) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [dartsThrown, setDartsThrown] = useState(3)

  const currentStep = steps[stepIndex]

  useEffect(() => {
    if (!open) return
    setStepIndex(0)
    setDartsThrown(3)
  }, [open, steps])

  const handleCancel = useCallback(() => {
    onCancel()
  }, [onCancel])

  const handleDartsConfirm = useCallback(
    (value: number) => {
      if (value < 1 || value > 3) return
      setDartsThrown(value)

      const nextIndex = stepIndex + 1
      if (nextIndex < steps.length) {
        setStepIndex(nextIndex)
        return
      }

      onConfirm(value, 0)
    },
    [onConfirm, stepIndex, steps.length],
  )

  const handleCheckoutConfirm = useCallback(
    (checkoutAttempts: number) => {
      if (checkoutAttempts < 0 || checkoutAttempts > dartsThrown) return
      onConfirm(dartsThrown, checkoutAttempts)
    },
    [dartsThrown, onConfirm],
  )

  if (!open || !currentStep) return null

  if (currentStep === 'darts') {
    return (
      <CountPickerDialog
        key="darts"
        open
        title="Dobott nyilak"
        description="Hány nyilat dobott a játékos ebben a látogatásban?"
        minConfirm={1}
        onConfirm={handleDartsConfirm}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <CountPickerDialog
      key="checkout"
      open
      title="Kiszállóra dobott nyilak"
      description={`Ebből a ${dartsThrown} dobott nyílból hányat kiszállóra dobott?`}
      maxValue={dartsThrown}
      minConfirm={0}
      onConfirm={handleCheckoutConfirm}
      onCancel={handleCancel}
    />
  )
}

export default CheckoutFlow
