import { useCallback, useEffect, useState } from 'react'

interface SettingsDefaults {
    fontSize: string
    rowHeight: string
    hiddenColumns: string[]
    columnsPinned: boolean
    filterToggles: Record<string, boolean>
    hiddenOptions: Record<string, string[]>
}

/**
 * Hook for managing data table settings with localStorage persistence
 */
export function useDataTableSettings(storageKey?: string) {
    /**
     * Get stored settings from localStorage
     */
    const getStoredSettings = useCallback((): SettingsDefaults => {
        const defaults: SettingsDefaults = {
            fontSize: 'text-xs',
            rowHeight: 'h-10',
            hiddenColumns: [],
            columnsPinned: false,
            filterToggles: {},
            hiddenOptions: {},
        }
        if (!storageKey) return defaults
        try {
            const stored = localStorage.getItem(`dt-settings-${storageKey}`)
            if (stored) {
                const parsed = JSON.parse(stored)
                return {
                    fontSize: parsed.fontSize || 'text-xs',
                    rowHeight: parsed.rowHeight || 'h-10',
                    hiddenColumns: parsed.hiddenColumns || [],
                    columnsPinned: parsed.columnsPinned || false,
                    filterToggles: parsed.filterToggles || {},
                    hiddenOptions: parsed.hiddenOptions || {},
                }
            }
        } catch {
            // Ignore parse errors
        }
        return defaults
    }, [storageKey])

    // Internal state for settings
    const [internalFontSize, setInternalFontSize] = useState<string>(
        () => getStoredSettings().fontSize
    )
    const [internalRowHeight, setInternalRowHeight] = useState<string>(
        () => getStoredSettings().rowHeight
    )
    const [internalHiddenColumns, setInternalHiddenColumns] = useState<
        Set<string>
    >(() => new Set(getStoredSettings().hiddenColumns))
    const [internalColumnsPinned, setInternalColumnsPinned] = useState<boolean>(
        () => getStoredSettings().columnsPinned
    )
    const [internalToggleValues, setInternalToggleValues] = useState<
        Record<string, boolean>
    >(() => getStoredSettings().filterToggles)
    const [internalHiddenOptions, setInternalHiddenOptions] = useState<
        Record<string, string[]>
    >(() => getStoredSettings().hiddenOptions)

    /**
     * Handle filter toggle change
     */
    const handleToggleChange = useCallback((key: string, value: boolean) => {
        setInternalToggleValues((prev) => ({ ...prev, [key]: value }))
    }, [])

    /**
     * Handle hidden options change
     */
    const handleHiddenOptionsChange = useCallback(
        (key: string, hiddenValues: string[]) => {
            setInternalHiddenOptions((prev) => ({
                ...prev,
                [key]: hiddenValues,
            }))
        },
        []
    )

    /**
     * Save settings to localStorage when they change
     */
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(
                `dt-settings-${storageKey}`,
                JSON.stringify({
                    fontSize: internalFontSize,
                    rowHeight: internalRowHeight,
                    hiddenColumns: Array.from(internalHiddenColumns),
                    columnsPinned: internalColumnsPinned,
                    filterToggles: internalToggleValues,
                    hiddenOptions: internalHiddenOptions,
                })
            )
        }
    }, [
        storageKey,
        internalFontSize,
        internalRowHeight,
        internalHiddenColumns,
        internalColumnsPinned,
        internalToggleValues,
        internalHiddenOptions,
    ])

    return {
        internalFontSize,
        setInternalFontSize,
        internalRowHeight,
        setInternalRowHeight,
        internalHiddenColumns,
        setInternalHiddenColumns,
        internalColumnsPinned,
        setInternalColumnsPinned,
        internalToggleValues,
        setInternalToggleValues,
        internalHiddenOptions,
        setInternalHiddenOptions,
        handleToggleChange,
        handleHiddenOptionsChange,
    }
}
