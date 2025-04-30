import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { FormEventHandler } from "react";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    sensor_data_id: number;
    onClose?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    sensor_data_id,
    onClose,
    confirmText = "Yes, confirm",
    cancelText = "Cancel",
}: ConfirmDialogProps) {
    const {
        delete: destroy,
        processing,
    } = useForm({ sensor_data_id: null });

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route("devices.sensor.destroy", sensor_data_id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success("Sensor Data Berhasil dihapus");
                onOpenChange(false);
                onClose?.();
            },
            onError: () => {
                toast.error("Gagal Menghapus Sensor Data");
                onOpenChange(false);
                onClose?.();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleDelete} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                {cancelText}
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            {confirmText}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
