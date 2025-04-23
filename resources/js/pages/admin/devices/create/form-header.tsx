import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FormHeaderProps = {
    action: string;
};


export default function FormHeader({ action }: FormHeaderProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        device_id: "",
        status: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(action), {
            onSuccess: () => {
                reset("device_id", "status");
                toast.success("Berhasil menambahkan data warga");
            },
            onError: (errors) => {
                if (errors) toast.error("Gagal menambahkan data warga");
            }
        });
    };

    return (
        <form onSubmit={submit}>
            <div className="flex h-fit flex-col gap-4 rounded-xl">
                <div className="flex md:flex-row flex-col p-4 gap-2 justify-between bg-blue-50 dark:bg-accent border border-blue-100 dark:border-border overflow-hidden rounded-xl">
                    <div className="w-full grid md:grid-cols-2 gap-4">
                        {/* Devices */}
                        <div className="grid gap-1">
                            <Label htmlFor="device_id">Device ID</Label>
                            <Input
                                id="device_id"
                                type="text"
                                value={data.device_id}
                                onChange={(e) => setData("device_id", e.target.value)}
                                placeholder="ESP_01"

                                disabled={processing}
                                className="mt-1 block"
                            />
                            <InputError message={errors.device_id} className="mt-1" />
                        </div>

                        {/* Status */}
                        <div className="grid gap-1">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value) => setData("status", value)}
                            >
                                <SelectTrigger className="mt-1" id="status">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} className="mt-1" />
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-fit" disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Tambah Data
                </Button>
            </div>
        </form>
    );
}
