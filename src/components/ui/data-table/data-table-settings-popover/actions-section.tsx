import type { ReactNode } from 'react'
import { useLabels } from '../../../../lib/labels'

interface ActionsSectionProps {
    actionComponents?: ReactNode[]
    slotComponents?: ReactNode[]
}

export function ActionsSection({
    actionComponents,
    slotComponents,
}: ActionsSectionProps) {
    const labels = useLabels()

    const hasActions =
        (actionComponents && actionComponents.length > 0) ||
        (slotComponents && slotComponents.length > 0)

    if (!hasActions) return null

    return (
        <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative border border-gray-200 rounded-lg pt-4 pb-3 px-3">
                <div className="absolute -top-2.5 left-3 px-2 bg-white text-xs font-medium text-gray-600">
                    {labels.actions}
                </div>
                <div className="space-y-2 [&_button]:border [&_button]:border-gray-200 [&_button]:bg-white [&_button]:text-gray-700 [&_button]:hover:bg-gray-50">
                    {actionComponents?.map((action, index) => (
                        <div
                            key={`action-${index}`}
                            className="w-full [&>*]:w-full"
                        >
                            {action}
                        </div>
                    ))}
                    {slotComponents?.map((slot, index) => (
                        <div
                            key={`slot-${index}`}
                            className="w-full [&>*]:w-full"
                        >
                            {slot}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
