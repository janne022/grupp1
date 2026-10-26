import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

interface KindergartenDropDownProps {
  kindergartensNames: string[];
  selectedKindergarten: string | null;
  onSelect: (kindergarten: string | null) => void;
  disabled?: boolean;
}

export function KindergartenDropDown({
  kindergartensNames,
  selectedKindergarten,
  onSelect,
  disabled,
}: KindergartenDropDownProps) {
  return (
    <Select
      value={selectedKindergarten}
      onValueChange={onSelect}
      disabled={disabled}
    >
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Välj förskola" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Förskolor</SelectLabel>
          {kindergartensNames.map((kindergarten) => (
            <SelectItem key={kindergarten} value={kindergarten}>
              {kindergarten}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
