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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";
import InputError from "@/components/input-error";

interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    defaultValues: {
        id: number | null;
        name: string | null;
        email: string | null;
        role: string | null;
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
        name: defaultValues.name,
        email: defaultValues.email,
        role: defaultValues.role,
    });

    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("register.update", data.id!), {
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
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            value={data.name!}
                            onChange={(e) => setData("name", e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={data.email!}
                            onChange={(e) => setData("email", e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={data.role!}
                            onValueChange={(val) => setData("role", val)}
                            disabled={processing}
                        >
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} className="mt-1" />
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

