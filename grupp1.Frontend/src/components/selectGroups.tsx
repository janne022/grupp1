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

import type { KindergartenDto } from "@/api/models";

export function SelectGroups({
  KindergartenDto,
}: {
  KindergartenDto: KindergartenDto[];
}) {

  return (
    <Select
      multiple={true}
      items={KindergartenDto.map((dto) => ({
        label: dto.name,
        value: dto.id
      }))}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Välj Förskola" />
      </SelectTrigger>
      <SelectContent>
        {KindergartenDto.map((dto) => (
          <SelectItem key={dto.id} value={dto.id}>{dto.name}</SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
