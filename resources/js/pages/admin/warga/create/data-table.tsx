import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { handlePageChange, handlePerPageChange, handleSearchChange, handleSearchKeyDown, handleSearchonClick, handleSort } from '@/services/WargaTableHandler';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { useState } from 'react';
import FormDialog from '../update/form-dialog';
import ConfirmDialog from '../delete/confirm-dialog';

interface Filters {
    search: string;
    sortBy: string;
    sortDir: 'asc' | 'desc';
    perPage: string;
}

interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
}

interface Warga {
    warga_id: number;
    no_telp: number;
    alamat: string;
    user: {
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
}

type DataTableProps = {
    wargas: {
        data: Warga[];
    };
    filters: Filters;
    pagination: Pagination;
    total: number;
};

export default function DataTable({ wargas, total, filters, pagination }: DataTableProps) {
    const [search, setSearch] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedNoTelp, setSelectedNoTelp] = useState<string | null>(null);
    const [selectedAlamat, setSelectedAlamat] = useState<string | null>(null);
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
        <div>
            <div className="rounded-xl border p-4">
                <div className="mb-4 flex items-center gap-2">
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
            <div className="overflow-auto pt-4">
                <div className="inline-block w-full overflow-x-auto rounded-md shadow">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted">
                                <TableHead className="w-12 border-r border-white text-center">
                                    <div className="flex items-center justify-center gap-1 text-center">No</div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer border-r border-white text-center"
                                    onClick={() => handleSortWrapper('name', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Nama
                                        {filters.sortBy === 'name' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer border-r border-white text-center"
                                    onClick={() => handleSortWrapper('email', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Email
                                        {filters.sortBy === 'email' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer border-r border-white text-center"
                                    onClick={() => handleSortWrapper('no_telp', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        No Telepon
                                        {filters.sortBy === 'no_telp' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer border-r border-white text-center"
                                    onClick={() => handleSortWrapper('alamat', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Alamat
                                        {filters.sortBy === 'alamat' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        {wargas.data.length > 0 ? (
                            wargas.data.map((warga, index) => (
                                <TableBody key={warga.warga_id}>
                                    <TableRow className="text-center">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{warga.user.name}</TableCell>
                                        <TableCell>{warga.user.email}</TableCell>
                                        <TableCell>{warga.no_telp}</TableCell>
                                        <TableCell className='max-w-md break-words'>{warga.alamat}</TableCell>
                                        <TableCell className="flex justify-center items-center gap-4">
                                            <Button
                                                variant="default"
                                                onClick={() => {
                                                    setSelectedId(warga.warga_id);
                                                    setSelectedNoTelp(String(warga.no_telp));
                                                    setSelectedAlamat(warga.alamat);
                                                    setEditDialogOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    setSelectedId(warga.warga_id);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ))
                        ) : (
                            <TableBody>
                                <TableRow className="h-28 text-center">
                                    <TableCell colSpan={7}>Tidak ada data</TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>

                    {selectedId !== null && editDialogOpen && (
                        <FormDialog
                            open={editDialogOpen}
                            onOpenChange={(open) => {
                                setEditDialogOpen(open);
                                if (!open) {
                                    setSelectedId(null);
                                    setSelectedNoTelp(null);
                                    setSelectedAlamat(null);
                                }
                            }}
                            title="Update Warga"
                            description="Apakah anda yakin ingin mengupdate warga ini?"
                            defaultValues={{
                                warga_id: selectedId,
                                no_telp: selectedNoTelp,
                                alamat: selectedAlamat,
                            }}
                            onClose={() => {
                                setEditDialogOpen(false);
                                setSelectedId(null);
                                setSelectedNoTelp(null);
                                setSelectedAlamat(null);
                            }}
                        />
                    )}
                    {deleteDialogOpen && (
                        <ConfirmDialog
                            open={deleteDialogOpen}
                            onOpenChange={(open) => {
                                setDeleteDialogOpen(open);
                                if (!open) setSelectedId(null);
                            }}
                            title="Delete Warga"
                            description="Apakah anda yakin ingin menghapus warga ini?"
                            warga_id={selectedId!}
                            onClose={() => {
                                setDeleteDialogOpen(false);
                                setSelectedId(null);
                            }}
                        />
                    )}
                    <PaginationWrapper currentPage={pagination.current_page} totalPages={totalPages} onPageChange={handlePageChangeWrapper} />
                    <div />
                </div>
            </div>
        </div>
    );
}
