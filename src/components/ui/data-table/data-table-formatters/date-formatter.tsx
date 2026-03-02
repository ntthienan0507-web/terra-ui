import type { ReactNode } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import type { DateFormatterConfig } from './types'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Render date formatter
 */
export function renderDateFormatter<T = any>(
    value: any,
    _row: T,
    config: DateFormatterConfig
): ReactNode {
    if (!value) return null

    const {
        format = 'DD/MM/YYYY',
        fromNow = false,
        locale,
        timezone: tz = 'local',
    } = config

    // Parse date based on timezone
    let date: dayjs.Dayjs

    if (tz === 'utc') {
        // Parse as UTC and keep in UTC (no conversion)
        date = dayjs.utc(value)
    } else if (tz === 'local') {
        // Parse and convert to local timezone (default behavior)
        date = dayjs(value)
    } else {
        // Parse and convert to specific timezone
        date = dayjs(value).tz(tz)
    }

    if (!date.isValid()) return String(value)

    if (locale) {
        // dayjs.locale(locale) // Set locale if needed
    }

    return <span>{fromNow ? date.fromNow() : date.format(format)}</span>
}
