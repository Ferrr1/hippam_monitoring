import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PaginationWrapper from '@/components/pagination-wrapper';
import { handlePageChange } from '@/services/RiwayatTagihanTableHandler';
import ImageModal from '@/components/image-modal';
import { useState } from 'react';
import { Pagination, Tagihan } from '@/types';

type DataTableProps = {
    tagihans: Tagihan[];
    pagination: Pagination;
};

export default function DataTable({ tagihans, pagination }: DataTableProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const handleImageClick = (src: string) => {
        setSelectedImage(src);
        setModalOpen(true);
    };
    return (
        <div>
            <div className="overflow-auto pt-2">
                <div className="inline-block w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12 text-center">
                                    No
                                </TableHead>
                                <TableHead
                                    className="max-w-md text-center"
                                >
                                    Meter Awal
                                </TableHead>
                                <TableHead
                                    className="max-w-md text-center"
                                >
                                    Meter Akhir
                                </TableHead>
                                <TableHead
                                    className="max-w-md text-center"
                                >
                                    Periode
                                </TableHead>
                                <TableHead
                                    className="max-w-md text-center"
                                >
                                    Pemakaian
                                </TableHead>
                                <TableHead
                                    className="max-w-md text-center"
                                >
                                    Biaya /m³
                                </TableHead>
                                <TableHead
                                    className="max-w-md text-center"
                                >
                                    Total
                                </TableHead>
                                <TableHead
                                    className="max-w-md w-[200px] text-center"
                                >
                                    Status
                                </TableHead>
                                <TableHead
                                    className="max-w-md text-center"
                                >
                                    Bukti Pembayaran
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tagihans.length > 0 ? (
                                tagihans.map((tagihan, index) => (
                                    <TableRow key={index} className="text-center">
                                        <TableCell>{(pagination.current_page - 1) * pagination.per_page + index + 1}</TableCell>
                                        <TableCell>{tagihan.meter_awal} m³</TableCell>
                                        <TableCell>{tagihan.meter_akhir} m³</TableCell>
                                        <TableCell>{tagihan.tanggal_mulai} - {tagihan.tanggal_akhir}</TableCell>
                                        <TableCell>{tagihan.pemakaian} m³</TableCell>
                                        <TableCell>{tagihan.tarif ? `${tagihan.tarif.harga} / m³` : 'Tidak ada tarif'}</TableCell>
                                        <TableCell>{tagihan.total_bayar}</TableCell>
                                        <TableCell className='whitespace-nowrap'>{tagihan.status === "belum_lunas" ? (
                                            <span className='px-2 py-1 rounded-md bg-red-100 text-red-700'>Belum Lunas</span>
                                        ) : tagihan ? (
                                            <span className='px-2 py-1 rounded-md bg-green-100 text-green-700'>Lunas</span>
                                        ) : (
                                            <span className='px-2 py-1 rounded-md bg-gray-700 text-gray-100 dark:bg-gray-100 dark:text-gray-700'>Belum ditetapkan</span>
                                        )}</TableCell>
                                        <TableCell className='w-40 h-30'>
                                            {tagihan.bukti_pembayaran ? (
                                                <img
                                                    src={`/storage/${tagihan.bukti_pembayaran}`}
                                                    alt="Bukti Pembayaran"
                                                    className="w-full h-full object-cover cursor-pointer"
                                                    onClick={() => handleImageClick(`/storage/${tagihan.bukti_pembayaran}`)}
                                                />
                                            ) : (
                                                "Tidak ada bukti pembayaran"
                                            )}
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
                    <div />
                </div>
            </div>
            <PaginationWrapper currentPage={pagination.current_page} totalPages={pagination.total / 5} onPageChange={handlePageChange} />
        </div>
    );
}
