import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { LoaderCircle, Check, ChevronsUpDown } from "lucide-react";

import InputError from "@/components/input-error";
import { useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import axios from "axios";
import { Filters, Perangkat, User } from "@/types";

type FormHeaderProps = {
    users: {
        data: User[];
        next_page_url: string;
    };
    devices: {
        data: Perangkat[];
        next_page_url: string;
    };
    filters: Filters;
    action: string;
};

export default function FormHeader({ users, devices, action }: FormHeaderProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        users_id: "",
        device_id: "",
        no_telp: "",
        alamat: "",
    });

    const [openUser, setOpenUser] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [usersData, setUsersData] = useState<User[]>(users.data);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [openDevice, setOpenDevice] = useState(false);
    const [searchDevice, setSearchDevice] = useState("");
    const [devicesData, setDevicesData] = useState<Perangkat[]>(devices.data);
    const [isLoadingDevices, setIsLoadingDevices] = useState(false);

    const fetchUsers = useCallback(
        debounce(async (keyword: string) => {
            try {
                setIsLoadingUsers(true);
                const res = await axios.get(route('warga.index'), {
                    params: {
                        search: keyword,
                        sortBy: "created_at",
                        sortDir: "asc",
                        perPage: 10,
                    },
                    headers: {
                        Accept: "application/json",
                    },
                });
                setUsersData(res.data.users.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingUsers(false);
            }
        }, 500),
        []
    );

    const fetchDevices = useCallback(
        debounce(async (keyword: string) => {
            try {
                setIsLoadingDevices(true);
                const res = await axios.get(route('warga.index'), {
                    params: {
                        search: keyword,
                        sortBy: "device_id",
                        sortDir: "asc",
                        perPage: 10,
                    },
                    headers: {
                        Accept: "application/json",
                    },
                });
                setDevicesData(res.data.devices.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingDevices(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        return () => {
            fetchUsers.cancel();
            fetchDevices.cancel();
        };
    }, [fetchUsers, fetchDevices]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route(action), {
            onSuccess: () => {
                reset();
                toast.success("Berhasil menambahkan data warga");
            },
            onError: () => {
                toast.error("Gagal menambahkan data warga");
            },
        });
    };

    return (
        <form onSubmit={submit}>
            <div className="flex flex-col gap-4 rounded-xl">
                <div className="flex flex-col md:flex-row p-4 gap-2 bg-blue-50 dark:bg-accent border border-blue-100 dark:border-border rounded-xl">
                    <div className="w-full grid md:grid-cols-2 gap-4">
                        {/* Pengguna */}
                        <div className="grid gap-1">
                            <Label htmlFor="pengguna">Pengguna</Label>
                            <Popover open={openUser} onOpenChange={setOpenUser}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        role="combobox"
                                        aria-expanded={openUser}
                                        className="w-full justify-between"
                                    >
                                        {data.users_id
                                            ? usersData.find((u) => u.id === Number(data.users_id))?.email
                                            : <p className="text-muted-foreground">Pilih Pengguna</p>}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-sm p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Cari Pengguna..."
                                            value={userSearch}
                                            onValueChange={(value) => {
                                                setUserSearch(value);
                                                fetchUsers(value);
                                            }}
                                            className="h-9"
                                        />
                                        <CommandList>
                                            {usersData.length > 0 ? (
                                                <CommandGroup>
                                                    {usersData.map((user) => (
                                                        <CommandItem
                                                            key={user.id}
                                                            value={user.email}
                                                            onSelect={() => {
                                                                setData("users_id", String(user.id));
                                                                setOpenUser(false);
                                                            }}
                                                        >
                                                            {user.email}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    data.users_id == String(user.id) ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            ) : (
                                                <CommandEmpty>Pengguna tidak ditemukan.</CommandEmpty>
                                            )}
                                            {isLoadingUsers && (
                                                <div className="flex items-center justify-center py-4">
                                                    <LoaderCircle className="animate-spin h-5 w-5" />
                                                </div>
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.users_id} className="mt-1" />
                        </div>

                        {/* Devices */}
                        <div className="grid gap-1">
                            <Label htmlFor="perangkat">Perangkat</Label>
                            <Popover open={openDevice} onOpenChange={setOpenDevice}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        role="combobox"
                                        aria-expanded={openDevice}
                                        className="w-full justify-between"
                                    >
                                        {data.device_id
                                            ? devicesData.find((u) => u.id === Number(data.device_id))?.device_id
                                            : <p className="text-muted-foreground">Pilih Pengguna</p>}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-sm p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Cari Perangkat..."
                                            value={searchDevice}
                                            onValueChange={(value) => {
                                                setSearchDevice(value);
                                                fetchDevices(value);
                                            }}
                                            className="h-9"
                                        />
                                        <CommandList>
                                            {devicesData.length > 0 ? (
                                                <CommandGroup>
                                                    {devicesData.map((device) => (
                                                        <CommandItem
                                                            key={device.id}
                                                            value={String(device.device_id)}
                                                            onSelect={() => {
                                                                setData("device_id", String(device.id));
                                                                setOpenDevice(false);
                                                            }}
                                                        >
                                                            {device.device_id}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    data.device_id == String(device.id) ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            ) : (
                                                <CommandEmpty>Perangkat tidak ditemukan.</CommandEmpty>
                                            )}
                                            {isLoadingDevices && (
                                                <div className="flex items-center justify-center py-4">
                                                    <LoaderCircle className="animate-spin h-5 w-5" />
                                                </div>
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.device_id} className="mt-1" />
                        </div>

                        {/* No Telepon */}
                        <div className="grid gap-1">
                            <Label htmlFor="no_telp">No Telepon</Label>
                            <Input
                                id="no_telp"
                                type="text"
                                value={data.no_telp}
                                onChange={(e) => setData("no_telp", e.target.value)}
                                placeholder="Nomor Telepon"
                                disabled={processing}
                                className="mt-1"
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
                                className="mt-1 max-h-28"
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
