import { cn } from '../../../lib/utils'
import { Label } from '../label'
import { FLOATING_LABEL_STYLES, type FormFieldWrapperProps } from './types'

export function FormFieldWrapper({
    label,
    required,
    error,
    helperText,
    className,
    children,
    inline,
}: FormFieldWrapperProps) {
    return (
        <div className={cn('relative overflow-visible', className)}>
            {/* Inline layout for checkbox/switch */}
            {inline ? (
                <div className="flex items-center gap-2">
                    {children}
                    {label && (
                        <Label
                            className={cn(
                                'text-sm font-medium cursor-pointer',
                                error && 'text-destructive'
                            )}
                        >
                            {label}
                            {required && (
                                <span className="text-destructive ml-0.5">
                                    *
                                </span>
                            )}
                        </Label>
                    )}
                </div>
            ) : (
                <>
                    {/* Floating label - uses standardized styles */}
                    {label && (
                        <span
                            className={cn(
                                FLOATING_LABEL_STYLES.base,
                                FLOATING_LABEL_STYLES.bg,
                                error
                                    ? FLOATING_LABEL_STYLES.error
                                    : FLOATING_LABEL_STYLES.default
                            )}
                        >
                            {label}
                            {required && (
                                <span className="text-destructive ml-0.5">
                                    *
                                </span>
                            )}
                        </span>
                    )}
                    {children}
                </>
            )}

            {/* Error message */}
            {error && (
                <p className="text-xs text-destructive ps-2 mt-1">{error}</p>
            )}

            {/* Helper text (only show if no error) */}
            {!error && helperText && (
                <p className="text-xs text-muted-foreground mt-1">
                    {helperText}
                </p>
            )}
        </div>
    )
}
