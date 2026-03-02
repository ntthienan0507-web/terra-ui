interface SizeConfig {
    heightClass: string
    padding: string
    fontSize: string
    customHeight?: string
    customFontSize?: string
}

/**
 * Get size-specific classes and styles for data table
 */
export function getSizeConfig(
    size: 'small' | 'medium' | 'custom' = 'small',
    customRowHeight?: string,
    customFontSize?: string,
    settingsFontSize?: string,
    settingsRowHeight?: string,
    toolbarSettingsShow?: boolean
): SizeConfig {
    // Check if customFontSize is a CSS value (e.g., "12px", "0.75rem") or Tailwind class
    const isCssFontSize = customFontSize && /^\d/.test(customFontSize)
    const fontSizeClass =
        customFontSize && !isCssFontSize ? customFontSize : 'text-xs'
    const fontSizeStyle = isCssFontSize ? customFontSize : undefined

    // If settings is enabled, use settings values from toolbar
    const effectiveFontSize = toolbarSettingsShow ? settingsFontSize : undefined
    const effectiveRowHeight = toolbarSettingsShow
        ? settingsRowHeight
        : undefined

    switch (size) {
        case 'small':
            return {
                heightClass: effectiveRowHeight || 'h-10',
                padding: 'py-2',
                fontSize: effectiveFontSize || 'text-xs',
            }
        case 'medium':
            return {
                heightClass: effectiveRowHeight || 'h-12',
                padding: 'py-3',
                fontSize: effectiveFontSize || 'text-sm',
            }
        case 'custom':
            return {
                heightClass: effectiveRowHeight || '',
                padding: 'py-2',
                fontSize: effectiveFontSize || fontSizeClass,
                customHeight: customRowHeight,
                customFontSize: fontSizeStyle,
            }
        default:
            return {
                heightClass: effectiveRowHeight || 'h-10',
                padding: 'py-2',
                fontSize: effectiveFontSize || 'text-xs',
            }
    }
}
