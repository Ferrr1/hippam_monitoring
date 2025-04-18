import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { handlePageChange, handlePerPageChange, handleSearchChange, handleSearchKeyDown, handleSearchonClick, handleSort } from '@/services/TagihanTableHandler';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { useState } from 'react';
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

interface Tagihan {
    tagihan_id: number;
    tanggal_mulai: string;
    tanggal_akhir: string;
    pemakaian: number;
    total_bayar: number;
    warga: {
        user: {
            name: string;
            email: string;
        }
        no_telp: number;
        alamat: string;
    };
    device: {
        device_id: string;
        mac_address: number | string;
        status: string;
    };
    tarif: {
        harga: number;
    };
    created_at: string;
    updated_at: string;
}

type DataTableProps = {
    tagihans: {
        data: Tagihan[];
    };
    filters: Filters;
    pagination: Pagination;
    total: number;
};

export default function DataTable({ tagihans, total, filters, pagination }: DataTableProps) {
    const [search, setSearch] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
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
                                    onClick={() => handleSortWrapper('device_id', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Device ID
                                        {filters.sortBy === 'device_id' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md border-r border-white text-center"
                                >
                                    Tarif Air
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer border-r border-white text-center"
                                    onClick={() => handleSortWrapper('tanggal_mulai', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Periode
                                        {filters.sortBy === 'tanggal_mulai' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer border-r border-white text-center"
                                    onClick={() => handleSortWrapper('pemakaian', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Pemakaian
                                        {filters.sortBy === 'pemakaian' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer border-r border-white text-center"
                                    onClick={() => handleSortWrapper('total_bayar', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Total
                                        {filters.sortBy === 'total_bayar' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer border-r border-white text-center"
                                    onClick={() => handleSortWrapper('created_at', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Created At
                                        {filters.sortBy === 'created_at' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        {tagihans.data.length > 0 ? (
                            tagihans.data.map((tagihan, index) => (
                                <TableBody key={tagihan.tagihan_id}>
                                    <TableRow className="text-center">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{tagihan.warga.user.name}</TableCell>
                                        <TableCell className='break-normal'>{tagihan.warga.user.email}</TableCell>
                                        <TableCell>{tagihan.device.device_id}</TableCell>
                                        <TableCell>Rp. {tagihan.tarif.harga}</TableCell>
                                        <TableCell>{tagihan.tanggal_mulai} - {tagihan.tanggal_akhir}</TableCell>
                                        <TableCell>{tagihan.pemakaian} m³</TableCell>
                                        <TableCell>Rp. {tagihan.total_bayar}</TableCell>
                                        <TableCell>{tagihan.created_at}</TableCell>
                                        <TableCell className="flex items-center justify-center gap-4">
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    setSelectedId(tagihan.tagihan_id);
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
                                    <TableCell colSpan={12}>Tidak ada data</TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>

                    {selectedId !== null && deleteDialogOpen && (
                        <ConfirmDialog
                            open={deleteDialogOpen}
                            onOpenChange={(open) => {
                                setDeleteDialogOpen(open);
                                if (!open) setSelectedId(null);
                            }}
                            title="Delete Tagihan"
                            description="Apakah anda yakin ingin menghapus tagihan ini?"
                            tagihan_id={selectedId!}
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
