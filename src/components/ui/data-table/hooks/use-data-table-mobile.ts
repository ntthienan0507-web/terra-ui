import { useEffect, useState } from 'react'

/**
 * Hook to detect mobile screen size (< 768px)
 * Used for responsive behavior in DataTable component
 */
export const useDataTableMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return { isMobile }
}
