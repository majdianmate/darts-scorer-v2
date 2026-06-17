import { useAuthentication } from '../hooks/use-authentication'
import { Link, useNavigate } from '@tanstack/react-router'
import React, { type JSX, type SVGProps, useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

const SignUp = () => {
  const redirectTo = '/dashboard'
  const navigate = useNavigate()
  const { user, signUpWithCredentials, signInOrSignUpWithGoogle } =
    useAuthentication()

  const [name, setName] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await signUpWithCredentials({
        name,
        displayName,
        email,
        password,
        passwordAgain: confirmPassword,
      })
      navigate({ to: redirectTo })
    } catch {
      toast.error('Failed to sign up')
    } finally {
      setIsSubmitting(false) // <-- ez hiányzott
    }
  }

  useEffect(() => {
    if (user) {
      navigate({ to: redirectTo })
    }
  }, [user, navigate])

  const handleGoogleSignup = async () => {
    try {
      await signInOrSignUpWithGoogle() // redirect indul, ide nem tér vissza
      navigate({ to: redirectTo })
    } catch {
      toast.error('Failed to sign up with Google')
    }
  }

  const passwordsMatch = password === confirmPassword
  const canSubmit =
    passwordsMatch &&
    name &&
    displayName &&
    email &&
    password &&
    confirmPassword
  return (
    <div className="mx-auto w-full max-w-sm bg-background rounded-lg shadow-lg p-10">
      <h2 className="text-balance text-center text-lg font-semibold text-foreground">
        Create your account
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-2.5">
        <div>
          <Label
            htmlFor="name-signup-02"
            className="text-sm font-semibold text-foreground"
          >
            Name
          </Label>
          <Input
            id="name-signup-02"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            className="mt-1  border-2 px-3 text-sm font-medium shadow-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label
            htmlFor="display-name-signup-02"
            className="text-sm font-semibold text-foreground"
          >
            Display Name
          </Label>
          <Input
            id="display-name-signup-02"
            type="text"
            autoComplete="display-name"
            placeholder="John Doe Display Name"
            className="mt-1  border-2 px-3 text-sm font-medium shadow-none"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <Label
            htmlFor="email-signup-02"
            className="text-sm font-semibold text-foreground"
          >
            Email
          </Label>
          <Input
            id="email-signup-02"
            type="email"
            autoComplete="email"
            placeholder="example@example.com"
            className="mt-1  border-2 px-3 text-sm font-medium shadow-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label
            htmlFor="password-signup-02"
            className="text-sm font-semibold text-foreground"
          >
            Password
          </Label>
          <Input
            id="password-signup-02"
            type="password"
            autoComplete="new-password"
            placeholder="**************"
            className="mt-1  border-2 px-3 text-sm font-medium shadow-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label
            htmlFor="confirm-password-signup-02"
            className="text-sm font-semibold text-foreground"
          >
            Confirm password
          </Label>
          <Input
            id="confirm-password-signup-02"
            type="password"
            autoComplete="new-password"
            placeholder="**************"
            className="mt-1  border-2 px-3 text-sm font-medium shadow-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {!passwordsMatch && (
            <p className="mt-0.5 text-xs text-red-500">
              Passwords do not match.
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={!canSubmit}
          className=" w-full border-2 font-semibold bg-primary cursor-pointer"
        >
          {isSubmitting ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or with
          </span>
        </div>
      </div>

      <Button
        type="button"
        disabled={isSubmitting}
        className="flex  w-full items-center justify-center gap-2 border-2 font-semibold bg-primary cursor-pointer"
        onClick={handleGoogleSignup}
      >
        <GoogleIcon className="size-5" aria-hidden={true} />
        <span>Sign up with Google</span>
      </Button>

      <p className="text-pretty mt-3 text-xs text-muted-foreground flex justify-center">
        Already have an account?{' '}
        <Link to="/sign-in" className="text-primary cursor-pointer ml-1">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default SignUp

const GoogleIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
)
