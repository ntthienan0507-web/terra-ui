import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayjs.extend(isoWeek)
dayjs.extend(quarterOfYear)

// ============================================================================
// Types
// ============================================================================

export interface DateRange {
    from: Date
    to?: Date
}

export interface Preset {
    name: string
    label: string
}

/** Quick end-date preset: calculates endDate relative to startDate */
export interface EndDatePreset {
    name: string
    label: string
    getEndDate: (startDate: dayjs.Dayjs) => Date
}

// ============================================================================
// Default presets
// ============================================================================

export const DEFAULT_PRESETS: Preset[] = [
    { name: 'today', label: 'Today' },
    { name: 'yesterday', label: 'Yesterday' },
    { name: 'last7', label: 'Last 7 days' },
    { name: 'last14', label: 'Last 14 days' },
    { name: 'last30', label: 'Last 30 days' },
    { name: 'thisWeek', label: 'This week' },
    { name: 'lastWeek', label: 'Last week' },
    { name: 'thisMonth', label: 'This month' },
    { name: 'lastMonth', label: 'Last month' },
    { name: 'thisQuarter', label: 'This quarter' },
    { name: 'lastQuarter', label: 'Last quarter' },
    { name: 'thisYear', label: 'This year' },
    { name: 'lastYear', label: 'Last year' },
]

// ============================================================================
// Preset range calculation
// ============================================================================

/** Calculate preset date range using dayjs for reliable date math */
export function getPresetRange(presetName: string): DateRange {
    const now = dayjs()

    switch (presetName) {
        case 'today':
            return {
                from: now.startOf('day').toDate(),
                to: now.endOf('day').toDate(),
            }
        case 'yesterday': {
            const y = now.subtract(1, 'day')
            return {
                from: y.startOf('day').toDate(),
                to: y.endOf('day').toDate(),
            }
        }
        case 'last7':
            return {
                from: now.subtract(6, 'day').startOf('day').toDate(),
                to: now.endOf('day').toDate(),
            }
        case 'last14':
            return {
                from: now.subtract(13, 'day').startOf('day').toDate(),
                to: now.endOf('day').toDate(),
            }
        case 'last30':
            return {
                from: now.subtract(29, 'day').startOf('day').toDate(),
                to: now.endOf('day').toDate(),
            }
        case 'thisWeek':
            return {
                from: now.startOf('isoWeek' as any).toDate(), // Monday
                to: now.endOf('isoWeek' as any).toDate(),
            }
        case 'lastWeek': {
            const lastMon = now.subtract(1, 'week').startOf('isoWeek' as any)
            const lastSun = lastMon.endOf('isoWeek' as any)
            return { from: lastMon.toDate(), to: lastSun.toDate() }
        }
        case 'thisMonth':
            return {
                from: now.startOf('month').toDate(),
                to: now.endOf('month').toDate(),
            }
        case 'lastMonth': {
            const lm = now.subtract(1, 'month')
            return {
                from: lm.startOf('month').toDate(),
                to: lm.endOf('month').toDate(),
            }
        }
        case 'thisQuarter': {
            return {
                from: now.startOf('quarter' as any).toDate(),
                to: now.endOf('quarter' as any).toDate(),
            }
        }
        case 'lastQuarter': {
            const lq = now.subtract(1, 'quarter' as any)
            return {
                from: lq.startOf('quarter' as any).toDate(),
                to: lq.endOf('quarter' as any).toDate(),
            }
        }
        case 'thisYear':
            return {
                from: now.startOf('year').toDate(),
                to: now.endOf('year').toDate(),
            }
        case 'lastYear': {
            const ly = now.subtract(1, 'year')
            return {
                from: ly.startOf('year').toDate(),
                to: ly.endOf('year').toDate(),
            }
        }
        default:
            return {
                from: now.startOf('day').toDate(),
                to: now.endOf('day').toDate(),
            }
    }
}

// ============================================================================
// Preset utilities
// ============================================================================

/** Get the end-of-period date for "current" presets (thisWeek, thisMonth, etc.) */
export function getPeriodEnd(presetName: string): Date | null {
    const now = dayjs()
    switch (presetName) {
        case 'thisWeek':
            return now.endOf('isoWeek' as any).toDate()
        case 'thisMonth':
            return now.endOf('month').toDate()
        case 'thisQuarter':
            return now.endOf('quarter' as any).toDate()
        case 'thisYear':
            return now.endOf('year').toDate()
        default:
            return null
    }
}

function normalizeDay(date: Date): number {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
}

/** Detect which preset matches the given date range */
export function detectPreset(
    range: DateRange,
    presets: Preset[] = DEFAULT_PRESETS
): string | undefined {
    if (!range.from || !range.to) return undefined

    const fromTime = normalizeDay(range.from)
    const toTime = normalizeDay(range.to)

    for (const preset of presets) {
        const presetRange = getPresetRange(preset.name)
        const presetFromTime = normalizeDay(presetRange.from)
        const presetToTime = presetRange.to
            ? normalizeDay(presetRange.to)
            : null

        if (fromTime !== presetFromTime || presetToTime === null) continue

        // Exact match
        if (toTime === presetToTime) return preset.name

        // For "current period" presets, also match if to is between today and end of period
        const periodEnd = getPeriodEnd(preset.name)
        if (
            periodEnd &&
            toTime >= presetToTime &&
            toTime <= normalizeDay(periodEnd)
        ) {
            return preset.name
        }
    }
    return undefined
}

/** Filter presets based on min/max date constraints */
export function filterPresetsByDateBounds(
    presets: Preset[],
    minDate?: Date,
    maxDate?: Date
): Preset[] {
    if ((!maxDate && !minDate) || presets.length === 0) return presets

    const maxDayTs = maxDate ? normalizeDay(maxDate) : null
    const minDayTs = minDate ? normalizeDay(minDate) : null

    return presets.filter((preset) => {
        const range = getPresetRange(preset.name)
        // Filter out if entire range ends before minDate
        if (minDayTs && range.to && normalizeDay(range.to) < minDayTs)
            return false
        // Filter out if range starts after maxDate
        if (maxDayTs && normalizeDay(range.from) > maxDayTs) return false
        // For "current period" presets, hide if period end exceeds maxDate
        if (maxDayTs) {
            const periodEnd = getPeriodEnd(preset.name)
            if (periodEnd && normalizeDay(periodEnd) > maxDayTs) return false
        }
        return true
    })
}
