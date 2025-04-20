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
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";
import InputError from "@/components/input-error";
import { Textarea } from "@/components/ui/textarea";

interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    defaultValues: {
        warga_id: number | null;
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
    defaultValues,
    onClose,
}: FormDialogProps) {
    const { put, processing, data, setData, errors } = useForm({
        warga_id: defaultValues.warga_id,
        no_telp: defaultValues.no_telp,
        alamat: defaultValues.alamat,
    });

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

