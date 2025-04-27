import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { handlePageChange, handlePerPageChange, handleSearchChange, handleSearchKeyDown, handleSearchonClick, handleSort } from '@/services/TagihanTableHandler';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '../delete/confirm-dialog';
import SelectForm from '../update/select-form';
import ImageModal from '@/components/image-modal';
import { Filters, Pagination, Tagihan } from '@/types';


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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const totalPages = Math.ceil(total / parseInt(filters.perPage));
    const [isModalOpen, setModalOpen] = useState(false);
    const showCountOptions = ['10', '20', '30'];
    const handlePageChangeWrapper = (page: number) => {
        handlePageChange(page, filters);
    };
    const handlePerPageChangeWrapper = (perPage: string) => {
        handlePerPageChange(perPage, filters);
    };
    const handleSortWrapper = (column: string, filters: Filters) => handleSort(column, filters);

    const handleImageClick = (src: string) => {
        setSelectedImage(src);
        setModalOpen(true);
    };
    return (
        <div className='flex flex-col gap-4'>
            <div className="rounded-xl p-4 bg-blue-50 dark:bg-accent border border-blue-100 dark:border-border">
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
                                    onClick={() => handleSortWrapper('device_id', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Device ID
                                        {filters.sortBy === 'device_id' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('meter_awal', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Meter Awal
                                        {filters.sortBy === 'meter_awal' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('meter_akhir', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Meter Akhir
                                        {filters.sortBy === 'meter_akhir' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md  text-center"
                                >
                                    Tarif Air
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('tanggal_mulai', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Periode
                                        {filters.sortBy === 'tanggal_mulai' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('pemakaian', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Pemakaian
                                        {filters.sortBy === 'pemakaian' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('total_bayar', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Total
                                        {filters.sortBy === 'total_bayar' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                >
                                    Bukti Pembayaran
                                </TableHead>
                                <TableHead
                                    className="max-w-md w-[200px] cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('status', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Status Pembayaran
                                        {filters.sortBy === 'status' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tagihans.data.length > 0 ? (
                                tagihans.data.map((tagihan, index) => (
                                    <TableRow key={tagihan.tagihan_id} className="text-center">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{tagihan.warga.user.name}</TableCell>
                                        <TableCell className='break-normal'>{tagihan.warga.user.email}</TableCell>
                                        <TableCell>{tagihan.device.device_id}</TableCell>
                                        <TableCell>{tagihan.meter_awal}</TableCell>
                                        <TableCell>{tagihan.meter_akhir}</TableCell>
                                        <TableCell>{tagihan.tarif.harga}</TableCell>
                                        <TableCell>{tagihan.tanggal_mulai} - {tagihan.tanggal_akhir}</TableCell>
                                        <TableCell>{tagihan.pemakaian} m³</TableCell>
                                        <TableCell>{tagihan.total_bayar}</TableCell>
                                        <TableCell className='w-40 h-30'>
                                            {tagihan.bukti_pembayaran ? (
                                                <img
                                                    src={tagihan.bukti_pembayaran.startsWith('http')
                                                        ? tagihan.bukti_pembayaran
                                                        : `/storage/${tagihan.bukti_pembayaran}`
                                                    }
                                                    alt="Bukti Pembayaran"
                                                    className="w-full h-full object-cover cursor-pointer"
                                                    onClick={() => handleImageClick(
                                                        tagihan.bukti_pembayaran.startsWith('http')
                                                            ? tagihan.bukti_pembayaran
                                                            : `/storage/${tagihan.bukti_pembayaran}`
                                                    )}
                                                />
                                            ) : (
                                                "Tidak ada bukti pembayaran"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <SelectForm
                                                defaultValues={{
                                                    tagihan_id: tagihan.tagihan_id,
                                                    status: tagihan.status,
                                                }}
                                            />
                                        </TableCell>
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
                                ))
                            ) : (
                                <TableRow className="h-28 text-center">
                                    <TableCell colSpan={12}>Tidak ada data</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {selectedImage && isModalOpen && (
                        <ImageModal
                            src={selectedImage}
                            alt="Bukti Pembayaran"
                            isOpen={isModalOpen}
                            onClose={() => {
                                setModalOpen(false);
                                setSelectedImage(null);
                            }}
                        />
                    )}
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
