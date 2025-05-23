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
) => {
    if (e.key === 'Enter' && search !== filters.search) {
        router.get(`/admin/fuzzy`, { ...filters, search }, {
            preserveState: true,
            preserveScroll: true
        });
    }
};

export const handleSearchonClick = (
    search: string,
    filters: Filters,
) => {
    router.get(`/admin/fuzzy`, { ...filters, search }, {
        preserveState: true,
        preserveScroll: true
    });
};

export const handleSort = (column: string, filters: Filters) => {
    const newDir = filters.sortBy === column && filters.sortDir === 'asc' ? 'desc' : 'asc';
    router.get(`/admin/fuzzy`, {
        ...filters,
        sortBy: column,
        sortDir: newDir,
    }, {
        preserveState: true,
        preserveScroll: true
    });
};

export const handlePageChange = (page: number, filters: Filters) => {
    router.get(`/admin/fuzzy`, { ...filters, page }, {
        preserveState: true,
        preserveScroll: true
    });
};


export const handlePerPageChange = (value: string, filters: Filters) => {
    router.get(`/admin/fuzzy`, { ...filters, perPage: value }, {
        preserveState: true,
        preserveScroll: true
    });
};
