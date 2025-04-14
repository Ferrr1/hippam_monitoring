import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationWrapperProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
    const delta = 2;
    const range: (number | "ellipsis")[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    if (left > 2) range.push("ellipsis");

    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push("ellipsis");

    if (total > 1) range.push(total);

    return range;
}

export default function PaginationWrapper({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationWrapperProps) {
    return (
        <Pagination className="my-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={() => onPageChange(currentPage - 1)} data-disabled={currentPage === 1} />
                </PaginationItem>
                {getPageNumbers(currentPage, totalPages).map((item, idx) =>
                    item === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={item}>
                            <PaginationLink
                                isActive={currentPage === item}
                                onClick={() => onPageChange(item)}
                            >
                                {item}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}
                <PaginationItem>
                    <PaginationNext href="#" onClick={() => onPageChange(currentPage + 1)} data-disabled={currentPage === totalPages} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
