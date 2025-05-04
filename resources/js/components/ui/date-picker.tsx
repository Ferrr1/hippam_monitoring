import * as React from "react"
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function DatePickerWithPresets({
    value,
    onChange,
    months,
}: {
    value?: Date
    onChange: (date: Date) => void
    months: string[]
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"default"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "MMMM yyyy") : <span>Pilih Bulan dan Tahun</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-[240px] flex-col space-y-2 p-2">
                <Select
                    onValueChange={(value) => {
                        const selectedDate = parse(value, "MM-yyyy", new Date())
                        onChange(selectedDate)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full">
                        {months.length > 0 ? (
                            months.map((value) => {
                                const label = format(parse(value, "MM-yyyy", new Date()), "MMMM yyyy")
                                return (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            })
                        ) : (
                            <div className="px-2 py-1 text-sm text-muted-foreground">
                                Tidak ada data untuk difilter
                            </div>
                        )}
                    </SelectContent>
                </Select>
            </PopoverContent>
        </Popover>
    )
}
