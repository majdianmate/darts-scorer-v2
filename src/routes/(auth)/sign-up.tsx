import { createFileRoute } from '@tanstack/react-router'
import SignUp from '#/features/authentication/sign-up/sign-up'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <SignUp />
    </div>
  )
}
