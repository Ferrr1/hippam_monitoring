import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { handlePageChange, handlePerPageChange, handleSearchChange, handleSearchKeyDown, handleSearchonClick, handleSort } from '@/services/UserTableHandler';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { useState } from 'react';
import FormDialog from '../update/form-dialog';
import ConfirmDialog from '../delete/confirm-dialog';
import { Filters, Pagination, User } from '@/types';


type DataTableProps = {
    users: {
        data: User[];
    };
    filters: Filters;
    pagination: Pagination;
    total: number;
};

export default function DataTable({ users, total, filters, pagination }: DataTableProps) {
    console.log(pagination)
    const [search, setSearch] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const totalPages = Math.ceil(total / parseInt(filters.perPage));
    const showCountOptions = ['10', '20', '30'];
    const handlePageChangeWrapper = (page: number) => {
        handlePageChange(page, filters);
    };
    const handlePerPageChangeWrapper = (perPage: string) => {
        handlePerPageChange(perPage, filters);
    };
    const handleSortWrapper = (column: string, filters: Filters) => handleSort(column, filters);

    return (
        <div className='flex flex-col gap-4'>
            <div className="rounded-xl bg-blue-50 dark:bg-accent border border-blue-100 dark:border-border p-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Show:</span>
                    <Select value={filters.perPage} onValueChange={handlePerPageChangeWrapper}>
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
                        onKeyDown={(e) => handleSearchKeyDown(e, search, filters)}
                        className="max-w-xs"
                    />
                    <Button onClick={() => handleSearchonClick(search, filters)}><Search className="h-4 w-4" /></Button>
                </div>
            </div>
            <div className="overflow-auto rounded-md bg-blue-50 dark:bg-accent border border-blue-100 dark:border-border">
                <div className="inline-block w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12 text-center">
                                    <div className="flex items-center justify-center gap-1 text-center">No</div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('name', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Nama
                                        {filters.sortBy === 'name' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('email', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Email
                                        {filters.sortBy === 'email' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('role', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Role
                                        {filters.sortBy === 'role' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('created_at', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Created At
                                        {filters.sortBy === 'created_at' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('updated_at', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Updated At
                                        {filters.sortBy === 'updated_at' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length > 0 ? (
                                users.data.map((user, index) => (
                                    <TableRow key={user.id} className="text-center">
                                        <TableCell>{(pagination.current_page - 1) * pagination.per_page + index + 1}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded-full px-2 py-1 text-sm font-medium ${user.role === 'admin'
                                                    ? 'bg-green-100 text-green-700'
                                                    : user.role === 'user'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                    } `}
                                            >
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>{user.created_at}</TableCell>
                                        <TableCell>{user.updated_at}</TableCell>
                                        <TableCell className="flex items-center justify-center gap-4">
                                            <Button
                                                variant="default"
                                                onClick={() => {
                                                    setSelectedId(user.id);
                                                    setSelectedName(user.name);
                                                    setSelectedEmail(user.email);
                                                    setSelectedRole(user.role);
                                                    setEditDialogOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    setSelectedEmail(user.email);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="h-28 text-center">
                                    <TableCell colSpan={7}>Tidak ada data</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {editDialogOpen && (
                        <FormDialog
                            open={editDialogOpen}
                            onOpenChange={(open) => {
                                setEditDialogOpen(open);
                                if (!open) {
                                    setSelectedId(null);
                                    setSelectedName(null);
                                    setSelectedEmail(null);
                                    setSelectedRole(null);
                                }
                            }}
                            title="Update Pengguna"
                            description="Apakah anda yakin ingin mengupdate pengguna ini?"
                            defaultValues={{
                                id: selectedId,
                                name: selectedName,
                                email: selectedEmail,
                                role: selectedRole,
                            }}
                            onClose={() => {
                                setEditDialogOpen(false);
                                setSelectedId(null);
                                setSelectedName(null);
                                setSelectedEmail(null);
                                setSelectedRole(null);
                            }}
                        />
                    )}
                    {selectedEmail !== null && deleteDialogOpen && (
                        <ConfirmDialog
                            open={deleteDialogOpen}
                            onOpenChange={(open) => {
                                setDeleteDialogOpen(open);
                                if (!open) setSelectedEmail(null);
                            }}
                            title="Delete Pengguna"
                            description="Apakah anda yakin ingin menghapus pengguna ini?"
                            email={selectedEmail!}
                            onClose={() => {
                                setDeleteDialogOpen(false);
                                setSelectedEmail(null);
                            }}
                        />
                    )}
                    <div />
                </div>
            </div>
            <PaginationWrapper currentPage={pagination.current_page} totalPages={totalPages} onPageChange={handlePageChangeWrapper} />
        </div>
    );
}
