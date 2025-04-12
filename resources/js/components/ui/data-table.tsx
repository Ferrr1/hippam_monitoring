import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

type Column = {
    key: string;
    label: string;
};

type Row = Record<string, string>;

type DataTableProps = {
    columns: Column[];
    data: Row[];
    onEdit?: (row: Row) => void;
    onDelete?: (row: Row) => void;
};

export default function DataTable({ columns, data, onEdit, onDelete }: DataTableProps) {
    const [showCount, setShowCount] = useState("10");
    const [sortBy, setSortBy] = useState<string>(columns[0]?.key || "");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const toggleSort = (key: string) => {
        if (key === sortBy) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortDir("asc");
        }
    };

    const filteredData = useMemo(() => {
        return data
            .filter((row) =>
                Object.values(row).some((value) =>
                    value.toLowerCase().includes(search.toLowerCase())
                )
            )
            .sort((a, b) => {
                const valA = a[sortBy]?.toLowerCase() || "";
                const valB = b[sortBy]?.toLowerCase() || "";

                if (valA < valB) return sortDir === "asc" ? -1 : 1;
                if (valA > valB) return sortDir === "asc" ? 1 : -1;
                return 0;
            });
    }, [data, search, sortBy, sortDir]);

    const totalPages = Math.ceil(filteredData.length / parseInt(showCount));
    const paginatedData = filteredData.slice(
        (currentPage - 1) * parseInt(showCount),
        currentPage * parseInt(showCount)
    );

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
        const delta = 2;
        const range: (number | 'ellipsis')[] = [];
        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        range.push(1);

        if (left > 2) {
            range.push("ellipsis");
        }

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < total - 1) {
            range.push("ellipsis");
        }

        if (total > 1) {
            range.push(total);
        }

        return range;
    }


    useEffect(() => {
        setCurrentPage(1);
    }, [search, showCount]);

    return (
        <div className="flex flex-col gap-4 rounded-xl">
            <div className="p-2 border-sidebar-border/70 dark:border-sidebar-border flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <div className="flex gap-2 items-center px-2 py-4">
                    <span className="text-sm">Show :</span>
                    <Select value={showCount} onValueChange={setShowCount}>
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-xs"
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-sidebar-border">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className="cursor-pointer select-none"
                                    onClick={() => toggleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {sortBy === col.key ? (
                                            sortDir === "asc" ? (
                                                <ArrowUp className="w-4 h-4" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4" />
                                            )
                                        ) : null}
                                    </div>
                                </TableHead>
                            ))}
                            {(onEdit || onDelete) && (
                                <TableHead className="text-center w-12">Action</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((row, i) => (
                            <TableRow key={i}>
                                {columns.map((col) => (
                                    <TableCell key={col.key}>{row[col.key]}</TableCell>
                                ))}
                                {(onEdit || onDelete) && (
                                    <TableCell className="flex gap-2 justify-end">
                                        {onEdit && (
                                            <Button
                                                variant={"outline"}
                                                onClick={() => onEdit(row)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button
                                                variant={"destructive"}
                                                onClick={() => onDelete(row)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Pagination className="my-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={() => goToPage(currentPage - 1)} />
                        </PaginationItem>
                        {getPageNumbers(currentPage, totalPages).map((item, idx) => (
                            item === "ellipsis" ? (
                                <PaginationItem key={`ellipsis-${idx}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={item}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === item}
                                        onClick={() => goToPage(item)}
                                    >
                                        {item}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        ))}
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => goToPage(currentPage + 1)} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
