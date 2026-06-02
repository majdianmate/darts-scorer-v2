import { type FC } from 'react'

import { Trophy } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { countLegsWon, getLegsToWin } from '#/utils/match-leg-utils'

import type { Match, Team } from '../../../../../types/match-types'

interface MatchWinDialogProps {
  open: boolean
  match: Match
  winnerTeam: Team | undefined
  onClose: () => void
}

const MatchWinDialog: FC<MatchWinDialogProps> = ({
  open,
  match,
  winnerTeam,
  onClose,
}) => {
  if (!winnerTeam) return null

  const TeamIcon = getSquadIcon(winnerTeam.icon)
  const legsToWin = getLegsToWin(match.matchConfig)
  const legsWon = countLegsWon(match.legs, winnerTeam.id)

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div
            className="mb-2 flex size-16 items-center justify-center rounded-2xl border border-white/10"
            style={{
              backgroundColor: `${winnerTeam.color}22`,
              boxShadow: `0 0 32px ${winnerTeam.color}44`,
            }}
          >
            <TeamIcon className="size-8" style={{ color: winnerTeam.color }} />
          </div>
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <Trophy className="size-5" style={{ color: winnerTeam.color }} />
            Match won!
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/80">
            <span className="font-semibold" style={{ color: winnerTeam.color }}>
              {winnerTeam.name}
            </span>{' '}
            wins the match ({legsWon}/{legsToWin} legs).
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MatchWinDialog
