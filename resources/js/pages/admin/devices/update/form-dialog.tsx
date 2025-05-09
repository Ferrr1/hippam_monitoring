import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";
import InputError from "@/components/input-error";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    defaultValues: {
        id: number | null;
        device_id: string | null;
        status: string | null;
    };
    onClose?: () => void;
}

export default function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    defaultValues,
    onClose,
}: FormDialogProps) {
    const { put, processing, data, setData, errors } = useForm({
        id: defaultValues.id,
        device_id: defaultValues.device_id,
        status: defaultValues.status,
    });
    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("devices.update", data.id!), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                onOpenChange(false);
                onClose?.();
            },
            onError: () => {
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <form onSubmit={handleUpdate} className="space-y-4 py-2">
                    <div>
                        <Label htmlFor="device_id">Device ID</Label>
                        <Input
                            id="device_id"
                            type="text"
                            value={data.device_id!}
                            onChange={(e) => setData("device_id", e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.device_id} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status!}
                            onValueChange={(val) => setData("status", val)}
                            disabled={processing}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aktif">Aktif</SelectItem>
                                <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-1" />
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

