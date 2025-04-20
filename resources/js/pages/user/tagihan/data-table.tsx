import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tagihan } from './index';
type DataTableProps = {
    tagihan: Tagihan;
};

export default function DataTable({ tagihan }: DataTableProps) {
    return (
        <div className='my-4'>
            <div className="overflow-auto pt-4">
                <div className="inline-block w-full overflow-x-auto rounded-md shadow">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted">
                                <TableHead className="w-12 border-r border-white text-center">
                                    No
                                </TableHead>
                                <TableHead
                                    className="max-w-md border-r border-white text-center"
                                >
                                    Meter Awal
                                </TableHead>
                                <TableHead
                                    className="max-w-md border-r border-white text-center"
                                >
                                    Meter Akhir
                                </TableHead>
                                <TableHead
                                    className="max-w-md border-r border-white text-center"
                                >
                                    Pemakaian
                                </TableHead>
                                <TableHead
                                    className="max-w-md border-r border-white text-center"
                                >
                                    Biaya /m³
                                </TableHead>
                                <TableHead
                                    className="max-w-md text-center"
                                >
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        {tagihan && tagihan.tagihan_id !== null ? (
                            <TableBody>
                                <TableRow className="text-center">
                                    <TableCell>1</TableCell>
                                    <TableCell>{tagihan.meter_awal} m³</TableCell>
                                    <TableCell>{tagihan.meter_akhir} m³</TableCell>
                                    <TableCell>{tagihan.pemakaian} m³</TableCell>
                                    <TableCell>{tagihan.tarif ? `${tagihan.tarif.harga} / m³` : 'Tidak ada tarif'}</TableCell>
                                    <TableCell>{tagihan.total_bayar}</TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <TableBody>
                                <TableRow className="h-28 text-center">
                                    <TableCell colSpan={6}>Tidak ada data</TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                    <div />
                </div>
            </div>
        </div>
    );
}
