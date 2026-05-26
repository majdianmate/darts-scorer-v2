import type { LucideIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export interface DropdownOption {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'default' | 'destructive'
  render?: boolean | (() => boolean)
}

export interface DropdownComponentProps {
  options: DropdownOption[]
  trigger: React.ReactNode
}

const DropdownComponent = ({ options, trigger }: DropdownComponentProps) => {
  const visibleOptions = options.filter((opt) => {
    if (opt.render === undefined) return true
    if (typeof opt.render === 'function') return opt.render()
    return opt.render
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {visibleOptions.map((option) => {
          const Icon = option.icon as LucideIcon

          return (
            <DropdownMenuItem key={option.label} onClick={option.onClick} variant={option.variant} className="cursor-pointer">
              {option.icon && <Icon className="size-4" />}
              {option.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownComponent
