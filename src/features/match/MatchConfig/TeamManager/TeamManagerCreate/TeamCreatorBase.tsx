import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { ColorPicker } from "#/components/ui/color-picker";
import { IconPicker, type SquadIconKey } from "#/components/IconPicker";
import { cn } from "#/lib/utils.ts";

export interface TeamCreatorBaseProps {
  name: string;
  color: string;
  icon: string;
  onNameChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onIconChange: (value: SquadIconKey) => void;
  disabled?: boolean;
  className?: string;
}

const TeamCreatorBase = ({
  name,
  color,
  icon,
  onNameChange,
  onColorChange,
  onIconChange,
  disabled = false,
  className,
}: TeamCreatorBaseProps) => (
  <div className={cn("space-y-3", className)}>
    <div className="space-y-1">
      <Label htmlFor="team-name" className="text-xs text-muted-foreground">
        Name
      </Label>
      <Input
        id="team-name"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder="e.g. Team Alpha"
        disabled={disabled}
        maxLength={50}
        autoComplete="off"
        className="h-8"
      />
    </div>

    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">Color</Label>
      <ColorPicker value={color} onChange={onColorChange} disabled={disabled} />
    </div>

    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">Icon</Label>
      <IconPicker value={icon} onChange={onIconChange} disabled={disabled} />
    </div>
  </div>
);

export default TeamCreatorBase;
