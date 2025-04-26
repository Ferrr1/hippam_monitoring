export function useTruncateNumber(value: number) {
    const val = Math.trunc(value * 100) / 100;
    return val;
}
