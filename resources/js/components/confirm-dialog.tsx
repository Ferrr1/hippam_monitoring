import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

interface ConfirmDialogProps {
    trigger: ReactNode;
    title: string;
    description?: string;
    onConfirm: (close: () => void) => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmDialog({
    trigger,
    title,
    description,
    onConfirm,
    confirmText = "Yes, confirm",
    cancelText = "Cancel",
}: ConfirmDialogProps) {
    const [open, setOpen] = useState(false);
    const handleConfirm = () => {
        onConfirm(() => setOpen(false));
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">{cancelText}</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleConfirm}>
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
