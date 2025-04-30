import { Filters } from '@/types';
import { router } from '@inertiajs/react';


export const handleSearchChange = (
    val: string,
    setSearch: (value: string) => void
) => {
    setSearch(val);
};

export const handleSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    search: string,
    filters: Filters,
    device_id: string | null
) => {
    if (e.key === 'Enter' && search !== filters.search) {
        router.get(`/admin/devices/${device_id}/show`, { ...filters, search }, {
            preserveState: true,
            preserveScroll: true
        });
    }
};

export const handleSearchonClick = (
    search: string,
    filters: Filters,
    device_id: string | null
) => {
    router.get(`/admin/devices/${device_id}/show`, { ...filters, search }, {
        preserveState: true,
        preserveScroll: true
    });
};

export const handleImportData = (
    device_id: string | null
) => {
    router.get(`/admin/devices/${device_id}/show`, {
        preserveState: true,
        preserveScroll: true
    });
};

export const handleExportData = (
    device_id: string | null
) => {
    router.get(`/admin/devices/${device_id}/show`, {
        preserveState: true,
        preserveScroll: true
    });
};

export const handleSort = (column: string, filters: Filters, device_id: string | null) => {
    const newDir = filters.sortBy === column && filters.sortDir === 'asc' ? 'desc' : 'asc';
    router.get(`/admin/devices/${device_id}/show`, {
        ...filters,
        sortBy: column,
        sortDir: newDir,
    }, {
        preserveState: true,
        preserveScroll: true
    });
};

export const handlePageChange = (page: number, filters: Filters, device_id: string | null) => {
    router.get(`/admin/devices/${device_id}/show`, { ...filters, page }, {
        preserveState: true,
        preserveScroll: true
    });
};


export const handlePerPageChange = (value: string, filters: Filters, device_id: string | null) => {
    router.get(`/admin/devices/${device_id}/show`, { ...filters, perPage: value }, {
        preserveState: true,
        preserveScroll: true
    });
};
