import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SelectGroups() {
    const roslagen = [
        { label: "Korven", value: "apple" },
        { label: "Apan", value: "banana" },
        { label: "Bananen", value: "blueberry" },
    ]
    const taby = [
        { label: "Tjorven", value: "carrot" },
        { label: "Lillen", value: "broccoli" },
        { label: "Bollen", value: "spinach" },
    ]
    const allItems = [
        { label: "Select a fruit", value: null },
        ...roslagen,
        ...taby,
    ]
    return (
        <Select multiple={true} items={allItems}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Roslagen</SelectLabel>
                    {roslagen.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Täby</SelectLabel>
                    {taby.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
