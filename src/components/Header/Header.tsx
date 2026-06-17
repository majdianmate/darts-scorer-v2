import type { LucideIcon } from 'lucide-react'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Button } from '../ui/button'

export interface HeaderButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  className?: string
  disabled?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'link'
}

interface HeaderProps {
  title: string
  buttons?: HeaderButtonProps[]
}

const defaultHeader: HeaderProps = {
  title: 'Dashboard',
  buttons: [],
}

const HeaderContext = createContext<{
  header: HeaderProps
  setHeader: React.Dispatch<React.SetStateAction<HeaderProps>>
} | null>(null)

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [header, setHeader] = useState<HeaderProps>(defaultHeader)
  const value = useMemo(() => ({ header, setHeader }), [header])

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeader must be used inside HeaderProvider')
  }
  return context
}
export function usePageHeader(header: HeaderProps) {
  const { setHeader } = useHeader()

  useEffect(() => {
    setHeader(header)

    return () => setHeader(defaultHeader)
  }, [header, setHeader])
}

const Header: React.FC<HeaderProps> = ({ title, buttons }) => {
  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between bg-background px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-2">
        {buttons?.map(({ icon: Icon, label, ...button }) => (
          <Button key={label} {...button}>
            <Icon className="size-4" />
            {label}
          </Button>
        ))}
      </div>
    </header>
  )
}

export default Header