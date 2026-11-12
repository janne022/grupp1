import { InputGroup, InputGroupInput, InputGroupAddon } from "@/shared/components/ui/input-group";
import { Search } from "lucide-react";


export default function SearchField() {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Sök skola, datum eller tid" />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
