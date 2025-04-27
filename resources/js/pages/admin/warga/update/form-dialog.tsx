import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { LoaderCircle, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import InputError from "@/components/input-error";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import debounce from 'lodash/debounce';
import { Perangkat } from "@/types";
import { cn } from "@/lib/utils";


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
    const [devicesData, setDevicesData] = useState<Perangkat[]>(devices); // dari props
    const [isLoadingDevices, setIsLoadingDevices] = useState(false);
    const [openDevice, setOpenDevice] = useState(false);
    const [searchDevice, setSearchDevice] = useState("");
    const fetchDevices = useCallback(
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
            fetchDevices.cancel();
        };
    }, [fetchDevices]);

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
        <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
            <div className="fixed inset-0 bg-black/80 z-50" />
            <DialogContent className="w-full z-50">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <form onSubmit={handleUpdate} className="space-y-4 py-2">
                    {/* Devices */}
                    <div className="grid gap-1">
                        <Label htmlFor="perangkat">Perangkat</Label>
                        <Popover open={openDevice} onOpenChange={setOpenDevice}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    role="combobox"
                                    aria-expanded={openDevice}
                                    className="w-full justify-between"
                                >
                                    {data.device_id
                                        ? devicesData.find((u) => u.id === Number(data.device_id))?.device_id
                                        : <p className="text-muted-foreground">Pilih Pengguna</p>}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-sm p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Perangkat..."
                                        value={searchDevice}
                                        onValueChange={(value) => {
                                            setSearchDevice(value);
                                            fetchDevices(value);
                                        }}
                                        className="h-9"
                                    />
                                    <CommandList>
                                        {devicesData.length > 0 ? (
                                            <CommandGroup>
                                                {devicesData.map((device) => (
                                                    <CommandItem
                                                        key={device.id}
                                                        value={String(device.device_id)}
                                                        onSelect={() => {
                                                            setData("device_id", (device.id));
                                                            setOpenDevice(false);
                                                        }}
                                                    >
                                                        {device.device_id}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                data.device_id == (device.id) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        ) : (
                                            <CommandEmpty>Perangkat tidak ditemukan.</CommandEmpty>
                                        )}
                                        {isLoadingDevices && (
                                            <div className="flex items-center justify-center py-4">
                                                <LoaderCircle className="animate-spin h-5 w-5" />
                                            </div>
                                        )}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
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

