import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { handlePageChange, handlePerPageChange, handleSearchChange, handleSearchKeyDown, handleSearchonClick, handleSort } from '@/services/SensorDataTableHandler';
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

interface Sensor {
    sensor_data_id: number;
    device: {
        device_id: string;
    };
    value: JSON;
    created_at: string;
    updated_at: string;
}

type DataTableProps = {
    sensors: {
        data: Sensor[];
    };
    filters: Filters;
    pagination: Pagination;
    total: number;
};

export default function DataTable({ sensors, total, filters, pagination }: DataTableProps) {
    const [search, setSearch] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const totalPages = Math.ceil(total / parseInt(filters.perPage));
    const showCountOptions = ['10', '20', '30'];

    const handlePageChangeWrapper = (page: number) => {
        handlePageChange(page, filters, sensors.data[0].device.device_id);
    };
    const handlePerPageChangeWrapper = (perPage: string) => {
        handlePerPageChange(perPage, filters, sensors.data[0].device.device_id);
    };
    const handleSortWrapper = (column: string, filters: Filters) => handleSort(column, filters, sensors.data[0].device.device_id);

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
                        onKeyDown={(e) => handleSearchKeyDown(e, search, filters, sensors.data[0].device.device_id)}
                        className="max-w-xs"
                    />
                    <Button onClick={() => handleSearchonClick(search, filters, sensors.data[0].device.device_id)}><Search className="h-4 w-4" /></Button>
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
                                    onClick={() => handleSortWrapper('value', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Value
                                        {filters.sortBy === 'value' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('created_at', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Created at
                                        {filters.sortBy === 'created_at' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md cursor-pointer text-center"
                                    onClick={() => handleSortWrapper('updated_at', filters)}
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Updated at
                                        {filters.sortBy === 'updated_at' &&
                                            (filters.sortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        {sensors.data.length > 0 ? (
                            sensors.data.map((sensor, index) => (
                                <TableBody key={sensor.sensor_data_id}>
                                    <TableRow className="text-center">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{sensor.device.device_id}</TableCell>
                                        <TableCell className='flex justify-center'>
                                            <div className='rounded-sm px-2 py-1 max-w-28 text-sm font-medium bg-green-100 text-green-700'>
                                                {Object.entries(sensor.value).map(([key, val]) => (
                                                    <div key={key} className='flex justify-between gap-2'>
                                                        <span className='uppercase flex-1 text-left'>{key}</span>
                                                        <span>:</span>
                                                        <span className='flex-1 text-left'>{val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{sensor.created_at}</TableCell>
                                        <TableCell>{sensor.updated_at}</TableCell>
                                        <TableCell className="">
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    setSelectedId(sensor.sensor_data_id);
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

                    {selectedId !== null && deleteDialogOpen && (
                        <ConfirmDialog
                            open={deleteDialogOpen}
                            onOpenChange={(open) => {
                                setDeleteDialogOpen(open);
                                if (!open) setSelectedId(null);
                            }}
                            title="Delete Sensor Data"
                            description="Apakah anda yakin ingin menghapus data ini?"
                            sensor_data_id={selectedId!}
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
