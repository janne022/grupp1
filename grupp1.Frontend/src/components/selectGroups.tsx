import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { KindergartenDto } from "@/api/models";

export function SelectGroups({
  KindergartenDto,
  value,
  onChange,
}: {
  KindergartenDto: KindergartenDto[];
  value?: string[];
  onChange?: (value: string[]) => void;
}) {
  return (
    <Select
      multiple={true}
      items={KindergartenDto.map((dto) => ({
        label: dto.name,
        value: dto.id,
      }))}
      value={value}
      onValueChange={(newValue) => {
        if (onChange) {
          onChange(newValue);
        }
      }}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Välj Förskola" />
      </SelectTrigger>
      <SelectContent>
        {KindergartenDto.map((dto) => (
          <SelectItem key={dto.id} value={dto.id}>
            {dto.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
