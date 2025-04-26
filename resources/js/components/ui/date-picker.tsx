import * as React from "react"
import { addMonths, format, parse } from "date-fns"
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
}: {
    value?: Date
    onChange: (date: Date) => void
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
                    <CalendarIcon />
                    {value ? format(value, "MMMM yyyy") : <span>Pilih Bulan dan Tahun</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="flex w-[240px] flex-col space-y-2 p-2"
            >
                <Select
                    onValueChange={(value) => {
                        const selectedDate = parse(value, "MM-yyyy", new Date())
                        onChange(selectedDate)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full">
                        {[...Array(12)].map((_, i) => {
                            const date = addMonths(new Date(), i)
                            const value = format(date, "MM-yyyy")
                            const label = format(date, "MMMM yyyy")
                            return (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </PopoverContent>
        </Popover>
    )
}

