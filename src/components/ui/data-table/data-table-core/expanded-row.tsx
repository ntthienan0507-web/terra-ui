import { useState, useEffect, type ReactNode } from 'react'

interface ExpandedRowContentProps<T> {
    row: T
    index: number
    render: (row: T, index: number) => ReactNode | Promise<ReactNode>
    loadingComponent?: ReactNode
    errorComponent?: (error: Error) => ReactNode
}

/**
 * Internal component to handle async expandable row rendering.
 * `render` is included in deps so content stays fresh when parent re-renders
 * with updated data (e.g. controlled form inputs).
 * Sync renders skip the loading state to avoid flicker.
 */
export function ExpandedRowContent<T>({
    row,
    index,
    render,
    loadingComponent,
    errorComponent,
}: ExpandedRowContentProps<T>) {
    const [content, setContent] = useState<ReactNode>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let mounted = true

        const loadContent = async () => {
            try {
                setError(null)
                const result = render(row, index)

                if (result instanceof Promise) {
                    // Async: show loading spinner while waiting
                    setIsLoading(true)
                    const resolvedContent = await result
                    if (mounted) {
                        setContent(resolvedContent)
                        setIsLoading(false)
                    }
                } else {
                    // Sync: update content directly, no loading flash
                    if (mounted) {
                        setContent(result)
                        setIsLoading(false)
                    }
                }
            } catch (err) {
                if (mounted) {
                    const error =
                        err instanceof Error ? err : new Error(String(err))
                    console.error(
                        '[DataTable] Failed to render expanded row:',
                        { row, index, error }
                    )
                    setError(error)
                    setIsLoading(false)
                }
            }
        }

        loadContent()

        return () => {
            mounted = false
        }
    }, [row, index, render]) // `render` included so content updates when parent data changes

    if (isLoading) {
        return (
            loadingComponent || (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-sm text-gray-600">
                        Loading...
                    </span>
                </div>
            )
        )
    }

    if (error) {
        return (
            errorComponent?.(error) || (
                <div className="flex items-center justify-center py-8 text-red-600">
                    <span className="text-sm">Error: {error.message}</span>
                </div>
            )
        )
    }

    return <>{content}</>
}
