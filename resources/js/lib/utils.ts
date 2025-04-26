import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatFullDateTime(dateInput: Date | string | number): string {
    const date = new Date(dateInput);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',    // e.g. Monday
      year: 'numeric',    // e.g. 2025
      month: 'long',      // e.g. April
      day: 'numeric',     // e.g. 23
      hour: '2-digit',    // e.g. 14
      minute: '2-digit',  // e.g. 05
      second: '2-digit',  // e.g. 30
      hour12: false,      // 24-hour format
    };

    return new Intl.DateTimeFormat('id-ID', options).format(date);
  }
