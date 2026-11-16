import { useState } from "react";
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
  const [filterList, setFilterList] = useState(filterState);

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
            checked={filterList.fullDay}
            onCheckedChange={(e) =>
              setFilterList({
                ...filterList,
                fullDay: e.valueOf(),
              })
            }
          >
            Heldag (7h eller mer)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filterList.halfDay}
            onCheckedChange={(e) =>
              setFilterList({
                ...filterList,
                halfDay: e.valueOf(),
              })
            }
          >
            Halvdag (mindre än 7h)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filterList.thisWeek}
            onCheckedChange={(e) =>
              setFilterList({
                ...filterList,
                thisWeek: e.valueOf(),
              })
            }
          >
            Denna vecka
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <div className="flex justify-between w-full p-1.5">
            <Button
              variant="ghost"
              onClick={() =>
                setFilterList({
                  ...filterState,
                  fullDay: false,
                  halfDay: false,
                  thisWeek: false,
                })
              }
            >
              Rensa
            </Button>
            <Button onClick={() => filterSetter(filterList)}>Visa pass</Button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
