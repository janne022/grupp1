import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { Funnel } from "lucide-react";

export default function FilterMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-3.5"
        render={
          <Button variant="outline">
            <Funnel />
            Filter
          </Button>
        }
      />
      <DropdownMenuContent className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Visa pass som är</DropdownMenuLabel>
          <DropdownMenuCheckboxItem>
            Heldag (7h eller mer)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            Halvdag (mindre än 7h)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Denna vecka</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
            <div className="flex justify-between w-full p-1.5">
              <Button variant="ghost">Rensa</Button>
              <Button>Visa pass</Button>
            </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
