import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/shared/components/ui/input-group";
import { Search } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export default function SearchField({
  searchSetter,
  searchState,
}: {
  searchSetter: Dispatch<SetStateAction<string>>;
  searchState: string;
}) {
  return (
    <InputGroup>
      <InputGroupInput value={searchState} onChange={(e) => searchSetter(e.target.value)} placeholder="Sök skola, datum eller tid" />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
