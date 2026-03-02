import { Input } from './input'
import { Search, X } from 'lucide-react'
import { useCallback } from 'react'

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    tourId?: string
}

export function SearchInput({
    value,
    onChange,
    placeholder = 'Search...',
    className = 'w-64',
    tourId,
}: SearchInputProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value)
        },
        [onChange]
    )

    const handleClear = useCallback(() => {
        onChange('')
    }, [onChange])

    return (
        <div className={className} data-tour={tourId}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    className="pl-9 pr-8 placeholder:italic placeholder:text-xs placeholder:text-muted-foreground/50"
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>
        </div>
    )
}
