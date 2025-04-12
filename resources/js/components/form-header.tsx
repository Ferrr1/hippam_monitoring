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
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";

type FieldType = "text" | "email" | "password" | "select";

type FieldOption = {
    label: string;
    value: string;
};

type FormField = {
    name: string;
    label: string;
    type: FieldType;
    placeholder: string;
    required?: boolean;
    options?: FieldOption[]; // For select
};

type FormHeaderProps = {
    fields: FormField[];
    action: string;
};

interface ErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
}

export default function FormHeader({ fields, action }: FormHeaderProps) {
    const initialData = fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {} as Record<string, string>);

    const { data, setData, reset } = useForm(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post(route(action), data);

            toast.success(response.data?.message);
            reset();
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            if (err.response?.status === 422) {
                const responseErrors = err.response.data.errors;

                if (responseErrors) {
                    const allMessages = Object.values(responseErrors)
                        .map((messages) => messages[0]);

                    toast.error(
                        <div>
                            {allMessages.map((msg, i) => (
                                <p key={i}>{msg}</p>
                            ))}
                        </div>
                    );
                } else {
                    toast.error('Validasi gagal. Cek input Anda.');
                }
            } else {
                toast.error('Terjadi kesalahan server. Coba lagi nanti.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={submit}>
            <div className="flex h-fit flex-col gap-4 rounded-xl">
                <div className="flex md:flex-row flex-col px-4 pt-2 pb-4 gap-2 justify-between border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
                    <div className="w-full grid md:grid-cols-2 gap-4">
                        {fields.map((field) => (
                            <div key={field.name} className="grid gap-2">
                                <Label htmlFor={field.name}>{field.label}</Label>

                                {field.type === "select" && field.options ? (
                                    <Select
                                        value={data[field.name] ?? ""}
                                        onValueChange={(value) => setData(field.name, value)}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder={field.placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.options.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={data[field.name] ?? ""}
                                        onChange={(e) => setData(field.name, e.target.value)}
                                        required={field.required}
                                        className="mt-1 block"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-fit" disabled={isSubmitting}>
                    {isSubmitting && (
                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Tambah Data
                </Button>
            </div>
        </form>
    );
}
