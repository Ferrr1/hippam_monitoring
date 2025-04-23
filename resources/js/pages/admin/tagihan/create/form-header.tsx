import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface User {
    id: number;
    name: string;
    email: string;
}
type FormHeaderProps = {
    users: User[];
    action: string;
};


export default function FormHeader({ users, action }: FormHeaderProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        users_id: "",
        no_telp: "",
        alamat: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(action), {
            onSuccess: () => {
                reset("users_id", "no_telp", "alamat");
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
                        {/* Pengguna */}
                        <div className="grid gap-1">
                            <Label htmlFor="pengguna">Pengguna</Label>
                            <Select
                                value={data.users_id}
                                onValueChange={(value) => setData("users_id", (value))}
                            >
                                <SelectTrigger className="mt-1" id="pengguna">
                                    <SelectValue placeholder="Pilih Pengguna" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={String(user.id)}>
                                            {user.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.users_id} className="mt-1" />
                        </div>

                        {/* No Telepon */}
                        <div className="grid gap-1">
                            <Label htmlFor="no_telp">No Telepon</Label>
                            <Input
                                id="no_telp"
                                type="number"
                                value={data.no_telp!}
                                onChange={(e) => setData("no_telp", (e.target.value))}
                                placeholder="Nomor Telepon"

                                disabled={processing}
                                className="mt-1 block"
                            />
                            <InputError message={errors.no_telp} className="mt-1" />
                        </div>

                        {/* Alamat */}
                        <div className="grid gap-1">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Textarea
                                id="alamat"
                                value={data.alamat}
                                onChange={(e) => setData("alamat", e.target.value)}
                                placeholder="Masukkan alamat lengkap"

                                disabled={processing}
                                className="mt-1 max-h-28 block"
                            />
                            <InputError message={errors.alamat} className="mt-1" />
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
