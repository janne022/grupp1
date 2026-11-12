import FilterMenu from "./filterMenu";
import SearchField from "./searchField";

export default function HeaderBar() {
  return (
    <div className="flex gap-x-2">
      <SearchField />
      <FilterMenu />
    </div>
  );
}
