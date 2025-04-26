import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import InputError from "@/components/input-error";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import debounce from 'lodash/debounce';
import { Device } from "..";


interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    devices: any;
    defaultValues: {
        warga_id: number | null;
        device_id: number | null;
        no_telp: string | null;
        alamat: string | null;
    };
    onClose?: () => void;
}

export default function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    devices,
    defaultValues,
    onClose,
}: FormDialogProps) {
    const { put, processing, data, setData, errors } = useForm({
        warga_id: defaultValues.warga_id,
        device_id: defaultValues.device_id,
        no_telp: defaultValues.no_telp,
        alamat: defaultValues.alamat,
    });
    const [devicesData, setDevicesData] = useState<Device[]>(devices); // dari props
    const [isLoadingDevices, setIsLoadingDevices] = useState(false);
    const [searchDevice, setSearchDevice] = useState("");
    const searchDevices = useCallback(
        debounce(async (keyword: string) => {
            try {
                setIsLoadingDevices(true);
                const res = await axios.get(route('warga.index'), {
                    params: {
                        search: keyword,
                        sortBy: 'device_id',
                        sortDir: 'asc',
                        perPage: 10,
                    },
                    headers: {
                        'Accept': 'application/json',
                    },
                });
                setDevicesData(res.data.devices.data);
            } catch (error) {
                console.error("Search device error", error);
            } finally {
                setIsLoadingDevices(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        return () => {
            searchDevices.cancel();
        };
    }, [searchDevices]);

    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("warga.update", data.warga_id!), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success("Data Warga Berhasil diubah");
                onOpenChange(false);
                onClose?.();
            },
            onError: () => {
                toast.error("Gagal Mengubah Data Warga");
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <form onSubmit={handleUpdate} className="space-y-4 py-2">
                    {/* Device */}
                    <div className="grid gap-1">
                        <Label>Device</Label>
                        <Select
                            value={data.device_id!}
                            onValueChange={(value) =>
                                setData("device_id", Number(value))}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Pilih Device" />
                            </SelectTrigger>
                            <SelectContent className="max-h-64 overflow-y-auto">
                                <div className="sticky top-0 z-10 bg-background">
                                    <Input
                                        type="text"
                                        placeholder="Search Device..."
                                        value={searchDevice}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setSearchDevice(value);
                                            searchDevices(value);
                                        }}
                                        className="relative max-w-full mb-2"
                                    />
                                    {isLoadingDevices && (
                                        <LoaderCircle className="absolute right-0 top-2 h-5 w-5 animate-spin mr-2" />
                                    )}
                                </div>
                                {devicesData.map((device) => (
                                    <SelectItem key={device.id} value={Number(device.id)}>
                                        {device.device_id}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.device_id} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="no_telp">No Telepon</Label>
                        <Input
                            id="no_telp"
                            type="number"
                            value={data.no_telp!}
                            onChange={(e) => setData("no_telp", e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.no_telp} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="alamat">Alamat</Label>
                        <Textarea
                            id="alamat"
                            value={data.alamat!}
                            onChange={(e) => setData("alamat", e.target.value)}
                            disabled={processing}
                            className="max-h-28 break-all"
                        />
                        <InputError message={errors.alamat} className="mt-1" />
                        <InputError className="mt-2" message={errors.message} />
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                            )}
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

