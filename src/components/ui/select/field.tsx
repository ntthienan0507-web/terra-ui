import { X as XIcon } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './base'
import { cn } from '../../../lib/utils'

export interface SelectFieldOption {
    label: string
    value: any
}

interface SelectFieldProps {
    value: any
    onValueChange: (value: any) => void
    options: SelectFieldOption[]
    placeholder?: string
    className?: string
    disabled?: boolean
    showClearButton?: boolean
    size?: 'default' | 'sm'
}

export function SelectField({
    value,
    onValueChange,
    options,
    placeholder = 'Select...',
    className,
    disabled,
    showClearButton = true,
    size = 'default',
}: SelectFieldProps) {
    const handleClear = () => {
        onValueChange('')
    }

    return (
        <div className="relative w-full">
            <Select
                value={value || undefined}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <SelectTrigger
                    size={size}
                    className={cn(size === 'sm' && '!text-xs', className)}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={String(option.value)}
                            value={String(option.value)}
                            className={size === 'sm' ? 'text-xs' : ''}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {showClearButton && value && !disabled && (
                <button
                    onClick={handleClear}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                    type="button"
                >
                    <XIcon className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    )
}
