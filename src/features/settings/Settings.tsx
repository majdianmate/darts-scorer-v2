import { Camera, Loader2, Save, UserRound } from 'lucide-react'
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { usePageHeader } from '#/components/Header/Header'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Separator } from '#/components/ui/separator'
import { useSettings } from './hooks/use-settings'

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const Settings = () => {
  const pageHeader = useMemo(() => ({ title: 'Settings' }), [])
  usePageHeader(pageHeader)

  const { user, updateUserSettings, uploadProfileImage, isLoading } =
    useSettings()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [image, setImage] = useState('')

  useEffect(() => {
    if (!user) return

    setName(user.name)
    setDisplayName(user.displayName)
    setImage(user.image)
  }, [user])

  const initials = useMemo(
    () => getInitials(displayName || name || user?.email || 'User'),
    [displayName, name, user?.email],
  )

  const isDirty =
    !!user &&
    (name !== user.name ||
      displayName !== user.displayName ||
      image !== user.image)

  const canSubmit =
    !!user && !!name.trim() && !!displayName.trim() && isDirty && !isLoading

  const handleReset = () => {
    if (!user) return

    setName(user.name)
    setDisplayName(user.displayName)
    setImage(user.image)
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const nextImage = await uploadProfileImage(file)
    setImage(nextImage)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    const updatedUser = await updateUserSettings({
      name: name.trim(),
      displayName: displayName.trim(),
      image: image.trim(),
    })

    setName(updatedUser.name)
    setDisplayName(updatedUser.displayName)
    setImage(updatedUser.image)
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="rounded-lg border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground shadow-sm">
          Loading settings...
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Account</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Manage your public profile details and account information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border/60 bg-background/90 shadow-sm"
      >
        <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr]">
          <div>
            <h2 className="text-base font-semibold">Profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This information is shown in your sidebar and profile surfaces.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative size-16">
                {image ? (
                  <img
                    src={image}
                    alt={displayName || name}
                    className="size-16 rounded-full object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary ring-1 ring-border">
                    {initials || <UserRound className="size-6" />}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handleImageChange}
                />

                <Button
                  type="button"
                  size="icon-sm"
                  aria-label="Choose profile image"
                  className="absolute -bottom-1 -right-1 rounded-full border border-background shadow-sm"
                  disabled={isLoading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Camera />
                  )}
                </Button>
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {displayName || name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG or WebP. Max 5 MB.
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settings-name">Name</Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-display-name">Display name</Label>
                <Input
                  id="settings-display-name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Display name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                value={user.email}
                readOnly
                className="text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Email changes are not available from this screen yet.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || isLoading}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Settings
