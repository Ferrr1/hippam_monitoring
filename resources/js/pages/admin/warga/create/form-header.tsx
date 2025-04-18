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
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import debounce from 'lodash/debounce';

interface User {
    id: number;
    name: string;
    email: string;
}
interface Filters {
    search: string;
    sortBy: string;
    sortDir: 'asc' | 'desc';
    perPage: string;
}
type FormHeaderProps = {
    users: {
        data: User[];
        next_page_url: string;
    }
    filters: Filters;
    action: string;
};


export default function FormHeader({ users, action }: FormHeaderProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        users_id: "",
        no_telp: "",
        alamat: "",
    });
    const [search, setSearch] = useState('');
    const [usersData, setUsersData] = useState<User[]>(users.data);
    // const [usersNextPage, setUsersNextPage] = useState(users.next_page_url);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // const loadMoreUsers = async () => {
    //     if (!usersNextPage || isLoadingUsers) return;

    //     setIsLoadingUsers(true);
    //     try {
    //         const res = await axios.get(usersNextPage);
    //         const newUsers = res.data.users.data;
    //         setUsersData(prev => [...prev, ...newUsers]);
    //         setUsersNextPage(res.data.users.next_page_url);
    //     } catch (error) {
    //         console.error("Failed to load more users", error);
    //     } finally {
    //         setIsLoadingUsers(false);
    //     }
    // };
    const searchUsers = useCallback(
        debounce(async (keyword: string) => {
            try {
                setIsLoadingUsers(true);
                const res = await axios.get(route('warga.index'), {
                    params: {
                        search: keyword,
                        sortBy: 'created_at',
                        sortDir: 'asc',
                        perPage: '10',
                    },
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                setUsersData(res.data.users.data);
                setUsersNextPage(res.data.users.next_page_url);
            } catch (error) {
                console.error("Search user error", error);
            } finally {
                setIsLoadingUsers(false);
            }
        }, 500),
        [] // empty deps, biar gak recreate
    );
    useEffect(() => {
        return () => {
            searchUsers.cancel();
        };
    }, [searchUsers]);


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
                <div className="flex md:flex-row flex-col px-4 pt-2 pb-4 gap-2 justify-between border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
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
                                <SelectContent className="max-h-64 overflow-y-auto">
                                    <div className="sticky top-0 z-10 bg-background">
                                        <Input
                                            type="text"
                                            placeholder="Search..."
                                            value={search}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSearch(value);
                                                searchUsers(value);
                                            }}
                                            className="relative max-w-full mb-2"
                                        />
                                        {isLoadingUsers && <LoaderCircle className="absolute right-0 top-2 h-5 w-5 animate-spin mr-2" />}
                                    </div>
                                    {usersData.map((user) => (
                                        <SelectItem key={user.id} value={String(user.id)}>
                                            {user.email}
                                        </SelectItem>
                                    ))}
                                    {/* {usersNextPage && (
                                        <div className="p-2 text-center">
                                            <Button size="sm" variant={"ghost"} className="w-full" onClick={loadMoreUsers} disabled={isLoadingUsers}>
                                                {isLoadingUsers ? <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> : "Muat Lagi"}
                                            </Button>
                                        </div>
                                    )} */}
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
