import type { Dispatch, SetStateAction } from "react";
import FilterMenu from "./filterMenu";
import SearchField from "./searchField";

export default function HeaderBar({
  filterState,
  filterSetter,
  searchSetter,
  searchState,
}: {
  filterState: { fullDay: boolean; halfDay: boolean; thisWeek: boolean };
  filterSetter: Dispatch<SetStateAction<{fullDay: boolean; halfDay: boolean; thisWeek: boolean;}>>;
  searchSetter: Dispatch<SetStateAction<string>>;
  searchState: string;
}) {
  return (
    <div className="flex gap-x-2">
      <SearchField searchState={searchState} searchSetter={searchSetter} />
      <FilterMenu filterState={filterState} filterSetter={filterSetter} />
    </div>
  );
}
