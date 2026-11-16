import type { Dispatch, SetStateAction } from "react";
import FilterMenu from "./filterMenu";
import SearchField from "./searchField";

export default function HeaderBar({
  searchSetter,
  searchState,
}: {
  searchSetter: Dispatch<SetStateAction<string>>,
  searchState: string
}) {
  return (
    <div className="flex gap-x-2">
      <SearchField searchState={searchState} searchSetter={searchSetter} />
      <FilterMenu />
    </div>
  );
}
