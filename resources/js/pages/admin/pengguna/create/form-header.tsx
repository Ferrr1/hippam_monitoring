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

type FormHeaderProps = {
    action: string;
    success?: string;
};

export default function FormHeader({ action }: FormHeaderProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        role: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(action), {
            onSuccess: () => {
                reset("name", "email", "password", "role");
                toast.success("Berhasil membuat pengguna");
            },
            onError: (errors) => {
                if (errors) toast.error("Gagal membuat pengguna");
            }
        });
    };

    return (
        <form onSubmit={submit}>
            <div className="flex h-fit flex-col gap-4 rounded-xl">
                <div className="flex md:flex-row flex-col px-4 pt-2 pb-4 gap-2 justify-between border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
                    <div className="w-full grid md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="grid gap-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Full name"

                                disabled={processing}
                                className="mt-1 block"
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Email */}
                        <div className="grid gap-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="email@example.com"

                                disabled={processing}
                                className="mt-1 block"
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Password */}
                        <div className="grid gap-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="Password"

                                disabled={processing}
                                className="mt-1 block"
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Role */}
                        <div className="grid gap-1">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) => setData("role", value)}
                            >
                                <SelectTrigger className="mt-1" id="role">
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} className="mt-1" />
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
