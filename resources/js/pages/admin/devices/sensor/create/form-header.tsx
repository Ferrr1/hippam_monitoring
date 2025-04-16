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
        mac_address: "",
        status: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(action), {
            onSuccess: () => {
                reset("device_id", "mac_address", "status");
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
                <div className="flex md:flex-row flex-col px-4 pt-2 pb-4 gap-2 justify-between border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
                    <div className="w-full grid md:grid-cols-2 gap-4">
                        {/* Devices */}
                        <div className="grid gap-1">
                            <Label htmlFor="device_id">Device ID</Label>
                            <Input
                                id="device_id"
                                type="text"
                                value={data.device_id}
                                onChange={(e) => setData("device_id", e.target.value)}
                                placeholder="Full device_id"

                                disabled={processing}
                                className="mt-1 block"
                            />
                            <InputError message={errors.device_id} className="mt-1" />
                        </div>

                        {/* No Telepon */}
                        <div className="grid gap-1">
                            <Label htmlFor="mac_address">Mac Address</Label>
                            <Input
                                id="mac_address"
                                type="text"
                                value={data.mac_address!}
                                onChange={(e) => setData("mac_address", (e.target.value))}
                                placeholder="30:AE:A4:07:0D:64"

                                disabled={processing}
                                className="mt-1 block"
                            />
                            <InputError message={errors.mac_address} className="mt-1" />
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
