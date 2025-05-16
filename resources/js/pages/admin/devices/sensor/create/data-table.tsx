import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { handlePageChange, handlePerPageChange, handleSort } from '@/services/SensorDataTableHandler';
import { ArrowDown, ArrowUp, FileSpreadsheet, LoaderCircle } from 'lucide-react';
import { FormEvent, useState } from 'react';
import ConfirmDialog from '../delete/confirm-dialog';
import { useTruncateNumber } from '@/hooks/use-truncate-number';
import { Filters, Pagination, Sensor } from '@/types';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';


type DataTableProps = {
    device: string;
    sensors: {
        data: Sensor[];
    };
    filters: Filters;
    pagination: Pagination;
    total: number;
};

export default function DataTable({ sensors, device, total, filters, pagination }: DataTableProps) {
    // const inputFileRef = useRef<HTMLInputElement>(null);
    const {
        post,
        processing,
        data,
        setData,
        reset,
    } = useForm({
        file: null as File | null,
        device_id: device || null
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const totalPages = Math.ceil(total / parseInt(filters.perPage));
    const showCountOptions = ['10', '20', '30'];


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!data.file) {
            toast.warning('Pilih file terlebih dahulu');
            return;
        }
        post(route('devices.sensor.importData', device), {
            forceFormData: true,
            preserveState: false,
            onSuccess: () => {
                reset();
                setData('file', null);
            },
            onError: () => {
                reset();
            }
        });
    };


    const handlePageChangeWrapper = (page: number) => {
        handlePageChange(page, filters, device);
    };
    const handlePerPageChangeWrapper = (perPage: string) => {
        handlePerPageChange(perPage, filters, device);
    };
    const handleSortWrapper = (column: string, filters: Filters) => handleSort(column, filters, device);

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

                    <form onSubmit={handleSubmit} className="flex xl:flex-row gap-2" encType="multipart/form-data">
                        <Input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                        />

                        {/* Import Button */}
                        <Button
                            type='submit'
                            className='bg-green-100 border border-green-200 text-green-800 dark:bg-green-950 dark:text-green-50'
                            disabled={processing}
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            {processing ?
                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> : "Import"}
                        </Button>

                    </form>
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
                        <TableBody>
                            {sensors.data.length > 0 ? (
                                sensors.data.map((sensor, index) => (
                                    <TableRow key={sensor.sensor_data_id} className="text-center">
                                        <TableCell>{(pagination.current_page - 1) * pagination.per_page + index + 1}</TableCell>
                                        <TableCell>{sensor.device.device_id}</TableCell>
                                        <TableCell className='flex justify-center'>
                                            <div className='rounded-sm px-4 py-1 max-w-4xl text-sm font-medium bg-green-100 text-green-700'>
                                                {Object.entries(sensor.value).map(([key, val]) => (
                                                    <div key={key} className='flex justify-between gap-2'>
                                                        <span className='uppercase flex-1 text-left'>{key}</span>
                                                        <span>:</span>
                                                        <span className='flex-1 text-left'>{useTruncateNumber(val)}</span>
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
                                ))
                            ) : (
                                <TableRow className="h-28 text-center">
                                    <TableCell colSpan={7}>Tidak ada data</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
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
                    <div />
                </div>
            </div>
            <PaginationWrapper currentPage={pagination.current_page} totalPages={totalPages} onPageChange={handlePageChangeWrapper} />
        </div>
    );
}
