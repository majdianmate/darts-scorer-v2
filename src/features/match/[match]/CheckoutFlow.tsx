import { type FC, useCallback, useEffect, useState } from 'react'

import CountPickerDialog from './CountPickerDialog'

type CheckoutFlowProps = {
  open: boolean
  onCancel: () => void
  onConfirm: (dartsThrown: number, checkoutAttempts: number) => void
}

type Step = 'darts' | 'checkout'

const CheckoutFlow: FC<CheckoutFlowProps> = ({ open, onCancel, onConfirm }) => {
  const [step, setStep] = useState<Step>('darts')
  const [dartsThrown, setDartsThrown] = useState(3)

  useEffect(() => {
    if (!open) return
    setStep('darts')
    setDartsThrown(3)
  }, [open])

  const handleCancel = useCallback(() => {
    onCancel()
  }, [onCancel])

  const handleDartsConfirm = useCallback((value: number) => {
    if (value < 1 || value > 3) return
    setDartsThrown(value)
    setStep('checkout')
  }, [])

  const handleCheckoutConfirm = useCallback(
    (checkoutAttempts: number) => {
      if (checkoutAttempts < 0 || checkoutAttempts > dartsThrown) return
      onConfirm(dartsThrown, checkoutAttempts)
    },
    [dartsThrown, onConfirm],
  )

  if (!open) return null

  if (step === 'darts') {
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
