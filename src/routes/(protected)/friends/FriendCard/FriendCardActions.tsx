import { Loader2, MoreHorizontal, Target, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FriendCardActionsProps = {
  friendshipId: string;
  friendName: string;
  onDelete?: (friendshipId: string) => void;
  isDeleting?: boolean;
};

export function FriendCardActions({
  friendshipId,
  friendName,
  onDelete,
  isDeleting = false,
}: FriendCardActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="flex-1"
        disabled
        title="Hamarosan"
      >
        <UserRound />
        Profil
      </Button>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="flex-1"
        disabled
        title="Hamarosan"
      >
        <Target />
        Meccs
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`További műveletek: ${friendName}`}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem disabled>Profil megtekintése</DropdownMenuItem>
          <DropdownMenuItem disabled>Meccs indítása</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isDeleting || !onDelete}
            onClick={() => onDelete?.(friendshipId)}
          >
            {isDeleting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 />
            )}
            Barát eltávolítása
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        type="button"
        variant="destructive"
        size="icon-sm"
        aria-label={`${friendName} eltávolítása`}
        disabled={isDeleting || !onDelete}
        onClick={() => onDelete?.(friendshipId)}
        className="shrink-0 md:hidden"
      >
        {isDeleting ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Trash2 />
        )}
      </Button>
    </div>
  );
}
