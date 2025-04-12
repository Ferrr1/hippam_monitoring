import { useEffect, useRef, useState } from "react";

type ErrorItem = {
    id: string;
    message: string;
};

export default function useAnimatedErrors(
    errors: Record<string, string>,
    duration = 4000
): ErrorItem[] {
    const [animatedErrors, setAnimatedErrors] = useState<ErrorItem[]>([]);
    const shownErrors = useRef<Set<string>>(new Set());

    useEffect(() => {
        const newErrors: ErrorItem[] = [];

        Object.entries(errors).forEach(([key, message]) => {
            const uniqueKey = `${key}-${message}`;

            if (!shownErrors.current.has(uniqueKey)) {
                shownErrors.current.add(uniqueKey);

                const id = `${uniqueKey}-${Date.now()}`;
                newErrors.push({ id, message: `- ${message}` });

                setTimeout(() => {
                    setAnimatedErrors((prev) => prev.filter((err) => err.id !== id));
                    shownErrors.current.delete(uniqueKey);
                }, duration);
            }
        });

        if (newErrors.length > 0) {
            setAnimatedErrors((prev) => [...prev, ...newErrors]);
        }
    }, [errors, duration]);

    return animatedErrors;
}
