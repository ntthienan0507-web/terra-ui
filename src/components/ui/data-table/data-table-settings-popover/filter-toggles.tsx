import { Check, Eye, Filter } from 'lucide-react'
import { useLabels } from '../../../../lib/labels'
import type { FilterToggle } from '../types'

interface FilterTogglesProps {
    filterToggles: FilterToggle[]
    toggleValues: Record<string, boolean>
    onToggleChange?: (key: string, value: boolean) => void
    hiddenOptions: Record<string, string[]>
    onHiddenOptionsChange?: (key: string, hiddenValues: string[]) => void
}

export function FilterToggles({
    filterToggles,
    toggleValues,
    onToggleChange,
    hiddenOptions,
    onHiddenOptionsChange,
}: FilterTogglesProps) {
    const labels = useLabels()

    if (filterToggles.length === 0) return null

    const visibilityToggles = filterToggles.filter(
        (t) => t.type === 'visibility'
    )
    const settingToggles = filterToggles.filter((t) => t.type === 'setting')
    const optionsToggles = filterToggles.filter((t) => t.type === 'options')

    const renderToggle = (toggle: FilterToggle) => {
        const isChecked =
            toggle.value !== undefined
                ? toggle.value
                : (toggleValues[toggle.key] ?? toggle.defaultValue ?? false)

        return (
            <label
                key={toggle.key}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full cursor-pointer transition-colors border ${
                    isChecked
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
            >
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                        const newValue = e.target.checked
                        toggle.onChange?.(newValue)
                        onToggleChange?.(toggle.key, newValue)
                    }}
                    className="sr-only"
                />
                {isChecked && <Check className="h-3 w-3" />}
                <span>
                    {toggle.group
                        ? `${toggle.group}: ${toggle.label}`
                        : toggle.label}
                </span>
            </label>
        )
    }

    const renderOptionsToggle = (toggle: FilterToggle) => {
        if (!toggle.options?.length) return null
        const currentHidden =
            hiddenOptions[toggle.key] ?? toggle.defaultHiddenOptions ?? []

        // For singleSelect mode, determine the selected option
        const getSelectedOption = () => {
            if (!toggle.singleSelect) return null
            const visibleOptions = toggle.options!.filter(
                (o) => !currentHidden.includes(o.value)
            )
            if (visibleOptions.length === 1) return visibleOptions[0].value
            return toggle.defaultSelectedOption ?? toggle.options![0].value
        }
        const selectedOption = toggle.singleSelect ? getSelectedOption() : null

        return (
            <div key={toggle.key} className="space-y-2">
                <div className="text-xs font-medium text-gray-600">
                    {toggle.label}
                </div>
                <div className="flex flex-wrap gap-2">
                    {toggle.options.map((option) => {
                        const isSelected = toggle.singleSelect
                            ? option.value === selectedOption
                            : !currentHidden.includes(option.value)

                        return (
                            <label
                                key={option.value}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full cursor-pointer transition-colors border ${
                                    isSelected
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <input
                                    type={
                                        toggle.singleSelect
                                            ? 'radio'
                                            : 'checkbox'
                                    }
                                    name={
                                        toggle.singleSelect
                                            ? toggle.key
                                            : undefined
                                    }
                                    checked={isSelected}
                                    onChange={() => {
                                        if (toggle.singleSelect) {
                                            const newHidden = toggle
                                                .options!.filter(
                                                    (o) =>
                                                        o.value !== option.value
                                                )
                                                .map((o) => o.value)
                                            onHiddenOptionsChange?.(
                                                toggle.key,
                                                newHidden
                                            )
                                        } else {
                                            const isHidden =
                                                currentHidden.includes(
                                                    option.value
                                                )
                                            const newHidden = isHidden
                                                ? currentHidden.filter(
                                                      (v) => v !== option.value
                                                  )
                                                : [
                                                      ...currentHidden,
                                                      option.value,
                                                  ]
                                            onHiddenOptionsChange?.(
                                                toggle.key,
                                                newHidden
                                            )
                                        }
                                    }}
                                    className="sr-only"
                                />
                                {isSelected && <Check className="h-3 w-3" />}
                                <span>{option.label}</span>
                            </label>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Visibility Toggles */}
            {visibilityToggles.length > 0 && (
                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="relative border border-gray-200 rounded-lg pt-4 pb-3 px-3">
                        <div className="absolute -top-2.5 left-3 px-2 bg-white flex items-center gap-1.5 text-xs font-medium text-gray-600">
                            <Eye className="h-3.5 w-3.5" />
                            <span>{labels.filterVisibility}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {visibilityToggles.map(renderToggle)}
                        </div>
                    </div>
                </div>
            )}

            {/* Setting Toggles */}
            {(settingToggles.length > 0 || optionsToggles.length > 0) && (
                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="relative border border-gray-200 rounded-lg pt-4 pb-3 px-3">
                        <div className="absolute -top-2.5 left-3 px-2 bg-white flex items-center gap-1.5 text-xs font-medium text-gray-600">
                            <Filter className="h-3.5 w-3.5" />
                            <span>{labels.filterSettings}</span>
                        </div>
                        <div className="space-y-3">
                            {settingToggles.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {settingToggles.map(renderToggle)}
                                </div>
                            )}
                            {optionsToggles.map(renderOptionsToggle)}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
