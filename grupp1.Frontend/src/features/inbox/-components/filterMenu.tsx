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
import type { Dispatch, SetStateAction } from "react";

export default function FilterMenu({
  filterState,
  filterSetter,
}: {
  filterState: { fullDay: boolean; halfDay: boolean; thisWeek: boolean };
  filterSetter: Dispatch<
    SetStateAction<{ fullDay: boolean; halfDay: boolean; thisWeek: boolean }>
  >;
}) {
  let filterObject = filterState;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="p-3.5"
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
          <DropdownMenuCheckboxItem
            checked={filterState.fullDay}
            onCheckedChange={(e) =>
              filterSetter({ ...filterState, fullDay: e.valueOf() })
            }
          >
            Heldag (7h eller mer)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filterObject.halfDay}
            onCheckedChange={(e) =>
              filterSetter({ ...filterState, halfDay: e.valueOf() })
            }
          >
            Halvdag (mindre än 7h)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filterObject.thisWeek}
            onCheckedChange={(e) =>
              filterSetter({ ...filterState, thisWeek: e.valueOf() })
            }
          >
            Denna vecka
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <div className="flex justify-between w-full p-1.5">
            <Button
              variant="ghost"
              onClick={() =>
                filterSetter({
                  ...filterState,
                  fullDay: false,
                  halfDay: false,
                  thisWeek: false,
                })
              }
            >
              Rensa
            </Button>
            <Button onClick={() => filterSetter(filterObject)}>
              Visa pass
            </Button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
