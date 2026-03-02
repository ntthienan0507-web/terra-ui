// Main component
export { DataTableCustomized } from './components/ui/data-table'
export { DataTableCustomized as DataTable } from './components/ui/data-table'

// Labels system
export { DataTableLabelsProvider, defaultLabels, useLabels } from './lib/labels'
export type { DataTableLabels } from './lib/labels'

// All types
export type {
    DataTableAction,
    DataTableColumn,
    DataTableExpandable,
    DataTableFooterRow,
    DataTableKey,
    DataTablePagination,
    DataTableProps,
    DataTableSelection,
    DataTableSelectionAction,
    DataTableSorting,
    FilterToggle,
    FilterToggleOption,
    SortOrder,
} from './components/ui/data-table'

// Formatter types
export type {
    FormatterConfig,
    ChipFormatterConfig,
    LinkFormatterConfig,
    DateFormatterConfig,
    NumberFormatterConfig,
    CurrencyFormatterConfig,
    BadgeFormatterConfig,
    BooleanFormatterConfig,
    AvatarFormatterConfig,
    TimeRangeFormatterConfig,
    OptionsFormatterConfig,
    OptionItem,
    ChipVariant,
    ChipSize,
    ChipColorConfig,
} from './components/ui/data-table'

// Formatter helpers
export {
    createLinkFormatter,
    createChipFormatter,
    createOptionsFormatter,
    createDateFormatter,
    createTimeRangeFormatter,
    createNumberFormatter,
    createCurrencyFormatter,
    renderOptionsFormatter,
    renderFormatter,
    createColumns,
} from './components/ui/data-table'

// GroupedTableHeader
export { GroupedTableHeader } from './components/ui/data-table'
export type {
    GroupedHeaderCell,
    GroupedTableHeaderProps,
} from './components/ui/data-table'

// Toolbar
export { DataTableToolbar } from './components/ui/data-table'
export type { DataTableToolbarProps } from './components/ui/data-table'

// Date Picker
export {
    Calendar,
    CalendarDayButton,
    DatePicker,
    SimpleDateRangePicker,
    DateRangePicker,
    DateInput,
    DEFAULT_PRESETS,
    getPresetRange,
    detectPreset,
    filterPresetsByDateBounds,
    getPeriodEnd,
} from './components/ui/date-picker'
export type {
    DatePickerProps,
    SimpleDateRangePickerProps,
    DateRangePickerProps,
    DateRange,
    Preset,
    EndDatePreset,
    DateInputProps,
} from './components/ui/date-picker'

// Popover
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './components/ui/popover'

// Command
export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
} from './components/ui/command'

// Label
export { Label } from './components/ui/label'

// Switch
export { Switch } from './components/ui/switch'

// ScrollArea
export { ScrollArea, ScrollBar } from './components/ui/scroll-area'

// Textarea
export { Textarea, TextareaAutoResize, TextareaAutoResize as AutoResizeTextarea } from './components/ui/textarea'
export type { TextareaAutoResizeProps } from './components/ui/textarea'

// Select (additional)
export { MultiSelect } from './components/ui/select'
export type { MultiSelectOption } from './components/ui/select'

// Form Field
export { FormField, FormFieldWrapper, FLOATING_LABEL_STYLES } from './components/ui/form-field'
export type {
    FormFieldProps,
    FormFieldType,
    FormFieldWrapperProps,
    FormFieldTextProps,
    FormFieldTextareaProps,
    FormFieldNumberProps,
    FormFieldSelectProps,
    FormFieldCheckboxProps,
    FormFieldSwitchProps,
    FormFieldDatepickerProps,
    FormFieldDateRangePickerProps,
} from './components/ui/form-field'

// Filters
export { FilterSelect } from './components/ui/filters'
export { FilterMultiSelect } from './components/ui/filters'
export { AsyncFilterSelect } from './components/ui/filters'
export type { FilterMultiSelectOption, FilterMultiSelectProps } from './components/ui/filters/filter-multi-select/types'
export type { AsyncFilterSelectOption, AsyncFilterSelectProps } from './components/ui/filters/async-filter-select/types'

// Accordion
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'

// Alert
export { Alert, AlertTitle, AlertDescription } from './components/ui/alert'

// Card
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/ui/card'

// Progress
export { Progress } from './components/ui/progress'

// Separator
export { Separator } from './components/ui/separator'

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'

// Skeleton
export { Skeleton, SkeletonTable } from './components/ui/skeleton'

// InfoGrid
export { InfoGrid } from './components/ui/info-grid'

// Hooks
export { default as useDebounce } from './lib/hooks/use-debounce'

// Utility
export { cn } from './lib/utils'
