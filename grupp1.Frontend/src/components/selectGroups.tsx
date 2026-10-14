import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { KindergartenGroup } from "@/api/types/types";

export function SelectGroups({
  KindergartenGroups,
}: {
  KindergartenGroups: KindergartenGroup[];
}) {
  return (
    <Select
      multiple={true}
      items={KindergartenGroups.flatMap((group) => group.kindergartens)}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Välj Förskola" />
      </SelectTrigger>
      <SelectContent>
        {KindergartenGroups.map((group) => (
          <>
            <SelectGroup key={group.groupName}>
              <SelectLabel>{group.groupName}</SelectLabel>
              {group.kindergartens.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
            {group !== KindergartenGroups[KindergartenGroups.length - 1] && (
              <SelectSeparator />
            )}
          </>
        ))}
      </SelectContent>
    </Select>
  );
}
