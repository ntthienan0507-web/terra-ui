import { useState } from 'react'
import {
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from 'lucide-react'
import { formatNumber } from '../../../../lib/utils'
import { useLabels } from '../../../../lib/labels'
import { SelectField } from '../../select'

export interface PaginationFooterProps {
    page: number
    pageSize: number
    total: number
    totalPages: number
    pageSizeOptions: number[]
    onPageChange?: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
    loading?: boolean
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
    page: initialPage,
    pageSize: initialPageSize,
    total,
    totalPages,
    pageSizeOptions,
    onPageChange,
    onPageSizeChange,
    loading = false,
}) => {
    const labels = useLabels()
    const [goToPageValue, setGoToPageValue] = useState('')

    // Internal state for client-side pagination (when callbacks not provided)
    const [internalPage, setInternalPage] = useState(initialPage)
    const [internalPageSize, setInternalPageSize] = useState(initialPageSize)

    // Use controlled values if callbacks provided, otherwise use internal state
    const page = onPageChange ? initialPage : internalPage
    const pageSize = onPageSizeChange ? initialPageSize : internalPageSize

    const handlePageChange = (newPage: number) => {
        if (onPageChange) {
            onPageChange(newPage)
        } else {
            setInternalPage(newPage)
        }
    }

    const handlePageSizeChange = (newPageSize: number) => {
        if (onPageSizeChange) {
            onPageSizeChange(newPageSize)
        } else {
            setInternalPageSize(newPageSize)
            // Reset to page 1 when page size changes (client-side only)
            setInternalPage(1)
        }
    }

    const handleGoToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(goToPageValue, 10)
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                handlePageChange(pageNum)
                setGoToPageValue('')
            }
        }
    }

    const handleGoToPageBlur = () => {
        const pageNum = parseInt(goToPageValue, 10)
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            handlePageChange(pageNum)
        }
        setGoToPageValue('')
    }

    const formattedTotal = formatNumber(total)

    return (
        <div
            className="flex flex-wrap items-center justify-between px-4 py-1.5 bg-white border-t border-gray-200 gap-4"
            aria-labelledby="ui:DataTable:PaginationFooter"
        >
            {/* Left side - Page info and rows per page */}
            <div className="flex flex-wrap items-center gap-4 shrink-0">
                <div className="text-sm text-gray-700 whitespace-nowrap">
                    {labels.pageInfo(page, totalPages, formattedTotal)}
                </div>

                <div className="flex flex-nowrap items-center gap-2">
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                        {labels.records}:
                    </span>
                    <SelectField
                        showClearButton={false}
                        className="w-20"
                        size="sm"
                        value={String(pageSize)}
                        onValueChange={(value) =>
                            handlePageSizeChange(Number(value))
                        }
                        options={pageSizeOptions.map((size) => ({
                            value: String(size),
                            label: String(size),
                        }))}
                    />
                </div>
            </div>

            {/* Right side - Navigation */}
            <div className="flex flex-wrap items-center gap-4 shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                        {labels.goToPage}:
                    </span>
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={goToPageValue}
                        onChange={(e) => setGoToPageValue(e.target.value)}
                        onKeyDown={handleGoToPage}
                        onBlur={handleGoToPageBlur}
                        placeholder={String(page)}
                        className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                <div className="flex flex-nowrap items-center gap-1">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={page <= 1 || loading}
                        className="flex items-center justify-center w-7 h-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        title={labels.firstPage}
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1 || loading}
                        className="flex items-center justify-center w-7 h-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        title={labels.previousPage}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages || loading}
                        className="flex items-center justify-center w-7 h-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        title={labels.nextPage}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={page >= totalPages || loading}
                        className="flex items-center justify-center w-7 h-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        title={labels.lastPage}
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
