import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { handlePageChange, handlePerPageChange, handleSort } from '@/services/FuzzyDataTableHandler';
import { ArrowDown, ArrowUp, FileSpreadsheet } from 'lucide-react';
import { useTruncateNumber } from '@/hooks/use-truncate-number';
import { Filters, Pagination, Sensor } from '@/types';
import { router } from '@inertiajs/react';


type DataTableProps = {
    sensors: {
        data: Sensor[];
    };
    filters: Filters;
    pagination: Pagination;
    total: number;
};

export default function DataTable({ sensors, total, filters, pagination }: DataTableProps) {
    const totalPages = Math.ceil(total / parseInt(filters.perPage));
    const showCountOptions = ['10', '20', '30'];
    const device = sensors.data[0].device.device_id;

    const handlePageChangeWrapper = (page: number) => {
        handlePageChange(page, filters);
    };
    const handlePerPageChangeWrapper = (perPage: string) => {
        handlePerPageChange(perPage, filters);
    };
    const handleExportData = () => {
        window.open(route('devices.sensor.exportData', device));
        console.log('export');
        console.log(device);
    };
    const handleSortWrapper = (column: string, filters: Filters) => handleSort(column, filters);

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
                    {/* Export Button */}
                    <Button
                        className='bg-green-100 border border-green-200 text-green-800 dark:bg-green-950 dark:text-green-50'
                        onClick={handleExportData}
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        Export
                    </Button>
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
                                    className="max-w-md text-center"
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Value Fuzzy
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="max-w-md text-center"
                                >
                                    <div className="flex items-center justify-center gap-1 text-center">
                                        Status
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
                                >
                                    Action
                                </TableHead>
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
                                        <TableCell>{useTruncateNumber(sensor.value_fuzzy['result'])} </TableCell>
                                        <TableCell>{sensor.water_condition}</TableCell>
                                        <TableCell>{sensor.created_at}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    router.get(`/admin/fuzzy/${sensor.sensor_data_id}/detail`);
                                                }}
                                            >
                                                Detail
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
                    <div />
                </div>
            </div>
            <PaginationWrapper currentPage={pagination.current_page} totalPages={totalPages} onPageChange={handlePageChangeWrapper} />
        </div>
    );
}
