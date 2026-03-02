import * as React from 'react'
import { cn } from '../../../lib/utils'
import { FLOATING_LABEL_STYLES } from '../form-field'

export interface TextareaAutoResizeProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Minimum number of rows, default 2 */
    minRows?: number
    /** Maximum number of rows, default unlimited */
    maxRows?: number
    /** Floating label text */
    label?: string
}

/**
 * Auto-resizing textarea component
 *
 * Automatically adjusts height based on content while respecting min/max rows.
 *
 * @example
 * <TextareaAutoResize
 *   placeholder="Enter your message..."
 *   minRows={3}
 *   maxRows={10}
 * />
 */
const TextareaAutoResize = React.forwardRef<
    HTMLTextAreaElement,
    TextareaAutoResizeProps
>(
    (
        { className, minRows = 2, maxRows, onChange, value, label, ...props },
        ref
    ) => {
        const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
        const [lineHeight, setLineHeight] = React.useState(0)

        // Combine refs
        React.useImperativeHandle(ref, () => textareaRef.current!)

        // Calculate line height on mount
        React.useEffect(() => {
            if (textareaRef.current) {
                const styles = window.getComputedStyle(textareaRef.current)
                const lh = parseFloat(styles.lineHeight)
                setLineHeight(lh || 24) // fallback to 24px
            }
        }, [])

        // Auto-resize function
        const adjustHeight = React.useCallback(() => {
            const textarea = textareaRef.current
            if (!textarea || lineHeight === 0) return

            // Reset height to auto to get the correct scrollHeight
            textarea.style.height = 'auto'

            // Calculate min and max heights
            const minHeight = lineHeight * minRows
            const maxHeight = maxRows ? lineHeight * maxRows : Infinity

            // Get the scroll height (content height)
            const scrollHeight = textarea.scrollHeight

            // Set height within bounds
            const newHeight = Math.min(
                Math.max(scrollHeight, minHeight),
                maxHeight
            )
            textarea.style.height = `${newHeight}px`

            // Enable/disable scrollbar based on whether we hit max height
            textarea.style.overflowY =
                maxRows && scrollHeight > maxHeight ? 'auto' : 'hidden'
        }, [lineHeight, minRows, maxRows])

        // Adjust height when value changes
        React.useEffect(() => {
            adjustHeight()
        }, [value, adjustHeight])

        // Handle change event - memoized to prevent unnecessary re-renders
        const handleChange = React.useCallback(
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                adjustHeight()
                onChange?.(e)
            },
            [adjustHeight, onChange]
        )

        return (
            <div className="relative w-full">
                {label && (
                    <span
                        className={cn(
                            FLOATING_LABEL_STYLES.base,
                            FLOATING_LABEL_STYLES.bg,
                            FLOATING_LABEL_STYLES.default
                        )}
                    >
                        {label}
                    </span>
                )}
                <textarea
                    ref={textareaRef}
                    className={cn(
                        'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-[height] duration-100 ease-out resize-none overflow-hidden',
                        className
                    )}
                    onChange={handleChange}
                    value={value}
                    rows={minRows}
                    {...props}
                />
            </div>
        )
    }
)

TextareaAutoResize.displayName = 'TextareaAutoResize'

export { TextareaAutoResize }
