import { createFileRoute, Link } from '@tanstack/react-router'
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "../../../hooks/use-user";

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const { resetPassword } = useUser();

  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const canSubmit = email.trim().length > 0 && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await resetPassword(email.trim());
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <h2 className="text-balance text-center text-lg font-semibold text-foreground">
        Forgot your password?
      </h2>
      <p className="mt-1.5 text-balance text-center text-xs text-muted-foreground">
        Enter the email linked to your account and we'll send you a reset link.
      </p>

      {submitted ? (
        <div className="mt-4 space-y-2.5">
          <div className="rounded-lg border-2 border-border bg-muted/30 p-3 text-sm text-foreground">
            If an account exists for{" "}
            <span className="font-semibold">{email}</span>, a reset link is on
            its way. Check your inbox (and spam folder).
          </div>
          <Button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setEmail("");
            }}
            className="h-11 w-full border-2 font-semibold bg-primary cursor-pointer"
          >
            Send to another email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2.5">
          <div>
            <Label
              htmlFor="email-forgot-02"
              className="text-sm font-semibold text-foreground"
            >
              Email
            </Label>
            <Input
              id="email-forgot-02"
              type="email"
              autoComplete="email"
              placeholder="example@example.com"
              className="mt-1 h-11 border-2 px-3 text-sm font-medium shadow-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="h-11 w-full border-2 font-semibold bg-primary cursor-pointer"
          >
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="text-pretty mt-3 text-xs text-muted-foreground flex justify-center">
        Remembered your password?{" "}
        <Link to="/sign-in" className="text-primary cursor-pointer ml-1">
          Sign in
        </Link>
      </p>
    </div>
  );
}
