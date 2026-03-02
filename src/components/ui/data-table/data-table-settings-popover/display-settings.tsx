import { Type, GripVertical } from 'lucide-react'
import { useLabels } from '../../../../lib/labels'

interface DisplaySettingsProps {
    showFontSize?: boolean
    fontSizeOptions?: { label: string; value: string }[]
    fontSize?: string
    onFontSizeChange?: (fontSize: string) => void
    showRowHeight?: boolean
    rowHeightOptions?: { label: string; value: string }[]
    rowHeight?: string
    onRowHeightChange?: (rowHeight: string) => void
}

export function DisplaySettings({
    showFontSize,
    fontSizeOptions = [],
    fontSize,
    onFontSizeChange,
    showRowHeight,
    rowHeightOptions = [],
    rowHeight,
    onRowHeightChange,
}: DisplaySettingsProps) {
    const labels = useLabels()

    if (!showFontSize && !showRowHeight) return null

    return (
        <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex flex-col gap-3">
                {/* Font Size */}
                {showFontSize && (
                    <div className="flex-1 relative border border-gray-200 rounded-lg pt-4 pb-3 px-3">
                        <div className="absolute -top-2.5 left-3 px-2 bg-white flex items-center gap-1.5 text-xs font-medium text-gray-600">
                            <Type className="h-3.5 w-3.5" />
                            <span>{labels.fontSize}</span>
                        </div>
                        <div className="flex gap-1">
                            {fontSizeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        onFontSizeChange?.(option.value)
                                    }
                                    className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                                        fontSize === option.value
                                            ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Row Height */}
                {showRowHeight && (
                    <div className="flex-1 relative border border-gray-200 rounded-lg pt-4 pb-3 px-3">
                        <div className="absolute -top-2.5 left-3 px-2 bg-white flex items-center gap-1.5 text-xs font-medium text-gray-600">
                            <GripVertical className="h-3.5 w-3.5" />
                            <span>{labels.rowHeight}</span>
                        </div>
                        <div className="flex gap-1">
                            {rowHeightOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        onRowHeightChange?.(option.value)
                                    }
                                    className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                                        rowHeight === option.value
                                            ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
