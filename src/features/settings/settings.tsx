import { Loader2 } from 'lucide-react'

import { usePageHeader } from '#/components/Sidebar'
import { useUser } from '../../../hooks/use-user'
import ProfileSettingsForm from './ProfileSettingsForm'

const Settings = () => {
  const { user, isUserLoading, updateProfileAsync, isUpdateProfilePending } =
    useUser()

  usePageHeader({ title: 'Settings' })

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading profile…
      </div>
    )
  }

  if (!user) {
    return (
      <p className="text-sm text-muted-foreground">
        Sign in to manage your settings.
      </p>
    )
  }

  return (
    <div className="flex w-full min-h-0 flex-1 flex-col">
      <div className="rounded-xl border border-border/60 bg-background p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update how you appear across the app.
          </p>
        </div>

        <ProfileSettingsForm
          user={user}
          isSaving={isUpdateProfilePending}
          onSave={async (params) => {
            await updateProfileAsync(params)
          }}
        />
      </div>
    </div>
  )
}

export default Settings
