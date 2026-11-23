import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type EditToggleButtonProps = {
  unlocked: boolean;
  onClick: () => void;
  label: string;
};

export function EditToggleButton({
  unlocked,
  onClick,
  label,
}: EditToggleButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      variant={unlocked ? "default" : "outline"}
      onClick={onClick}
      aria-pressed={unlocked}
      aria-label={unlocked ? `Sluta redigera ${label}` : `Redigera ${label}`}
    >
      <Pencil />
    </Button>
  );
}
