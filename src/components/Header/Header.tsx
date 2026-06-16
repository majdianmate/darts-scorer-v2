import React from 'react'

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between bg-background px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
    </header>
  )
}

export default Header