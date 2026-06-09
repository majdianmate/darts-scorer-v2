import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Camera, Loader2, Save, X } from 'lucide-react'
import { toast } from 'sonner'

import Avatar from '#/components/Avatar'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { validateProfileImage } from '../../../services/user-service'
import type { User } from '../../../types/user-types'

type ProfileSettingsFormProps = {
  user: User
  onSave: (params: { displayName: string; imageFile?: File }) => Promise<void>
  isSaving?: boolean
}

const ProfileSettingsForm = ({
  user,
  onSave,
  isSaving = false,
}: ProfileSettingsFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState(user.displayName || user.name)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    setDisplayName(user.displayName || user.name)
    setSelectedFile(null)
    setPreviewUrl(null)
  }, [user.displayName, user.id, user.name])

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const avatarImage = previewUrl ?? user.image
  const avatarName = displayName.trim() || user.name

  const isDirty = useMemo(() => {
    const currentDisplayName = (user.displayName || user.name).trim()
    return (
      displayName.trim() !== currentDisplayName || selectedFile !== null
    )
  }, [displayName, selectedFile, user.displayName, user.name])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      validateProfileImage(file)
      setSelectedFile(file)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Invalid image file.',
      )
    }
  }

  const handleRemoveSelectedImage = () => {
    setSelectedFile(null)
  }

  const handleSave = async () => {
    const trimmedName = displayName.trim()
    if (!trimmedName) {
      toast.error('Display name is required.')
      return
    }

    if (!isDirty) return

    try {
      await onSave({
        displayName: trimmedName,
        imageFile: selectedFile ?? undefined,
      })
      setSelectedFile(null)
    } catch {
      // Error toast is handled in useUser mutation.
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <Avatar name={avatarName} image={avatarImage} size="lg" />
          <button
            type="button"
            className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-muted"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            aria-label="Change profile picture"
          >
            <Camera className="size-4 text-muted-foreground" />
          </button>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-foreground">Profile picture</p>
          <p className="text-sm text-muted-foreground">
            JPG, PNG, or WebP. Max 5 MB.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload photo
            </Button>
            {selectedFile ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSaving}
                onClick={handleRemoveSelectedImage}
              >
                <X className="size-4" />
                Cancel selection
              </Button>
            ) : null}
          </div>
          {selectedFile ? (
            <p className="text-xs text-muted-foreground">
              New photo selected: {selectedFile.name}
            </p>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="display-name">Display name</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your display name"
            disabled={isSaving}
            maxLength={50}
            autoComplete="name"
          />
          <p className="text-xs text-muted-foreground">
            {displayName.length}/50
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={user.username}
            disabled
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled readOnly />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
        <Button
          type="button"
          variant="outline"
          disabled={!isDirty || isSaving}
          onClick={() => {
            setDisplayName(user.displayName || user.name)
            setSelectedFile(null)
          }}
        >
          Reset
        </Button>
        <Button
          type="button"
          disabled={!displayName.trim() || !isDirty || isSaving}
          onClick={handleSave}
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default ProfileSettingsForm
