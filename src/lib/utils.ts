import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatNumber = (amount: number) => {
    if (isNaN(amount)) return String(amount)
    return Intl.NumberFormat('en-US').format(amount)
}
