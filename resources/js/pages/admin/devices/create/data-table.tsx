import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { handlePageChange, handlePerPageChange, handleSearchChange, handleSearchKeyDown, handleSort } from '@/services/DeviceTableHandler';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import FormDialog from '../update/form-dialog';
import ConfirmDialog from '../delete/confirm-dialog';
import { router } from '@inertiajs/react';

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

interface Perangkat {
    id: number;
    device_id: string;
    mac_address: number | string;
    status: string;
    created_at: string;
    updated_at: string;
}

type DataTableProps = {
    devices: {
        data: Perangkat[];
    };
    filters: Filters;
    pagination: Pagination;
    total: number;
};

export default function DataTable({ devices, total, filters, pagination }: DataTableProps) {
    const [search, setSearch] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedDeviceID, setSelectedDeviceID] = useState<string | null>(null);
    const [selectedMacAddress, setSelectedMacAddress] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
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
                                    onClick={() => handleSortWrapper('device_id', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Device ID
                                        {filters.sortBy === 'device_id' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer border-r border-white text-center"
                                    onClick={() => handleSortWrapper('mac_address', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Mac Address
                                        {filters.sortBy === 'mac_address' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer border-r border-white text-center"
                                    onClick={() => handleSortWrapper('status', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Status
                                        {filters.sortBy === 'status' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        {devices.data.length > 0 ? (
                            devices.data.map((device, index) => (
                                <TableBody key={device.id}>
                                    <TableRow className="text-center">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{device.device_id}</TableCell>
                                        <TableCell>{device.mac_address}</TableCell>
                                        <TableCell><span
                                            className={`rounded-full px-2 py-1 text-sm font-medium ${device.status === 'aktif'
                                                ? 'bg-green-100 text-green-700'
                                                : device.status === 'tidak_aktif'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                } `}
                                        >
                                            {device.status === 'aktif' ? "Aktif" : "Tidak Aktif"}
                                        </span></TableCell>
                                        <TableCell className="flex items-center justify-center gap-4">
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    router.get(`/admin/devices/${device.device_id}/show`);
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="default"
                                                onClick={() => {
                                                    setSelectedId(device.id);
                                                    setSelectedDeviceID(device.device_id);
                                                    setSelectedMacAddress(String(device.mac_address));
                                                    setSelectedStatus(device.status);
                                                    setEditDialogOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    setSelectedId(device.id);
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

                    {editDialogOpen && (
                        <FormDialog
                            open={editDialogOpen}
                            onOpenChange={(open) => {
                                setEditDialogOpen(open);
                                if (!open) {
                                    setSelectedId(null);
                                    setSelectedDeviceID(null);
                                    setSelectedMacAddress(null);
                                    setSelectedStatus(null);
                                }
                            }}
                            title="Update Device"
                            description="Apakah anda yakin ingin mengupdate perangkat ini?"
                            defaultValues={{
                                id: selectedId,
                                device_id: selectedDeviceID,
                                mac_address: selectedMacAddress,
                                status: selectedStatus,
                            }}
                            onClose={() => {
                                setEditDialogOpen(false);
                                setSelectedId(null);
                                setSelectedDeviceID(null);
                                setSelectedMacAddress(null);
                                setSelectedStatus(null);
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
                            title="Delete Device"
                            description="Apakah anda yakin ingin menghapus perangkat ini?"
                            id={selectedId}
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
