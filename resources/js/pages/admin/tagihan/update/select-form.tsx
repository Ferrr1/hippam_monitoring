import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormDialogProps {
    defaultValues: {
        tagihan_id: number | null;
        status: string | null;
    };
    onClose?: () => void;
}

export default function SelectForm({
    defaultValues,
}: FormDialogProps) {
    const { put, processing, data, setData } = useForm({
        tagihan_id: defaultValues.tagihan_id,
        status: defaultValues.status,
    });

    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (data.status === null || data.tagihan_id === null) return
        put(route("tagihan.update", data.tagihan_id!), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success("Status Berhasil diubah");
            },
            onError: () => {
                toast.error("Gagal Mengubah Status");
            },
        });
    }, [data.status]);

    return (
        <div>
            <Select
                value={data.status!}
                onValueChange={(val) => {
                    setData("status", val);
                }}
                disabled={processing}
            >
                <SelectTrigger id="status">
                    <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="lunas">
                        <span className="rounded-md px-2 py-1 whitespace-nowrap text-sm font-medium bg-green-100 text-green-700">Lunas</span>
                    </SelectItem>
                    <SelectItem value="belum_lunas">
                        <span className="rounded-md px-2 py-1 whitespace-nowrap text-sm font-medium bg-red-100 text-red-700">Belum Lunas</span>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

