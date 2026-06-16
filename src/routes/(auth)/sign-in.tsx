import SignIn from '#/features/authentication/sign-in/sign-in'
import { createFileRoute } from '@tanstack/react-router'
// ^ Figyelj a relatív útra! Mivel most az (auth) mappában vagy, 
// valószínűleg egy szinttel többet kell visszalépned (../../../)

export const Route = createFileRoute('/(auth)/sign-in')({ // <-- KÖTELEZŐ A ZÁRÓJEL ITT IS!
  component: SignInPage,
})

function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <SignIn />
    </div>
  )
}