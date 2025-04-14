import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { handlePageChange, handlePerPageChange, handleSearchChange, handleSearchKeyDown } from '@/services/UserTableHandler';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';

interface Filters {
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    perPage: string;
}

interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

type DataTableProps = {
    users: {
        data: User[];
    };
    filters: Filters;
    pagination: Pagination;
    total: number;
};

export default function DataTable({
    users,
    total,
    filters,
    pagination,
}: DataTableProps) {
    const [search, setSearch] = useState('');
    const totalPages = Math.ceil(total / parseInt(filters.perPage));
    const showCountOptions = ['10', '20', '30'];
    console.log(`Console Log dari Data Table Users:${users.data[0].name}, filters:${JSON.stringify(filters)}, pagination:${JSON.stringify(pagination)}, Total:${total}`);
    return (
        <div className="rounded-xl border p-4">
            <div className="mb-4 flex items-center gap-2">
                <span className="text-sm">Show:</span>
                <Select value={filters.perPage}
                    onValueChange={handlePerPageChange}
                >
                    <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                        {showCountOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value, setSearch)}
                    onKeyDown={(e) => handleSearchKeyDown(e, search, filters.search)}
                    className="max-w-xs"
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="bg-muted">
                        <TableHead className="text-center border-r border-white w-12">
                            <div className="flex text-center items-center justify-center gap-1">
                                No
                                {/* <ArrowUp className="h-4 w-4" /> */}
                                <ArrowDown className="h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="text-center border-r border-white max-w-md">
                            <div className="flex text-center items-center justify-center gap-1">
                                Nama
                                {/* <ArrowUp className="h-4 w-4" /> */}
                                <ArrowDown className="h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="text-center border-r border-white max-w-fit">
                            <div className="flex text-center items-center justify-center gap-1">
                                Email
                                {/* <ArrowUp className="h-4 w-4" /> */}
                                <ArrowDown className="h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="text-center border-r border-white max-w-sm w-44">
                            <div className="flex text-center items-center justify-center gap-1">
                                Role
                                {/* <ArrowUp className="h-4 w-4" /> */}
                                <ArrowDown className="h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="text-center border-r border-white max-w-sm w-44">
                            <div className="flex text-center items-center justify-center gap-1">
                                Created At
                                {/* <ArrowUp className="h-4 w-4" /> */}
                                <ArrowDown className="h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="text-center border-r border-white max-w-sm w-44">
                            <div className="flex text-center items-center justify-center gap-1">
                                Updated At
                                {/* <ArrowUp className="h-4 w-4" /> */}
                                <ArrowDown className="h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="text-center">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                {users.data.map((user, index) =>
                    <TableBody>
                        <TableRow key={user.id} className='text-center'>
                            <TableCell >{index + 1}</TableCell>
                            <TableCell >{user.name}</TableCell>
                            <TableCell >{user.email}</TableCell>
                            <TableCell>
                                <span
                                    className={`
                                    px-2 py-1 rounded-full text-sm font-medium
                                    ${user.role === 'admin'
                                            ? 'bg-green-100 text-green-700'
                                            : user.role === 'user'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }
                                    `}
                                >
                                    {user.role}
                                </span>
                            </TableCell>
                            <TableCell >{user.created_at}</TableCell>
                            <TableCell >{user.updated_at}</TableCell>
                            <TableCell className='flex gap-4 justify-center items-center'>
                                <Button>Edit</Button>
                                <Button variant={'destructive'}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                )}
            </Table>

            <PaginationWrapper currentPage={pagination.current_page} totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
