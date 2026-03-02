import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { FilterSelect } from '../components/ui/filters/filter-select'
import { FilterMultiSelect } from '../components/ui/filters/filter-multi-select'

const meta: Meta = {
    title: 'Filters',
    parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

// ============================================================================
// Mock data
// ============================================================================

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
    { label: 'Suspended', value: 'suspended' },
]

const departmentOptions = [
    { label: 'Engineering', value: 'engineering' },
    { label: 'Design', value: 'design' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Sales', value: 'sales' },
    { label: 'HR', value: 'hr' },
    { label: 'Finance', value: 'finance' },
    { label: 'Operations', value: 'operations' },
    { label: 'Legal', value: 'legal' },
]

const tagOptions = [
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
    { label: 'DevOps', value: 'devops' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'QA', value: 'qa' },
    { label: 'Data Science', value: 'data-science' },
]

// ============================================================================
// FilterSelect
// ============================================================================

export const SingleSelect: Story = {
    render: () => {
        const { control, watch } = useForm({
            defaultValues: { status: '' },
        })
        return (
            <div className="max-w-xs space-y-4">
                <FilterSelect
                    control={control}
                    name="status"
                    label="Status"
                    options={statusOptions}
                />
                <p className="text-sm text-muted-foreground">
                    Selected: {watch('status') || '(none)'}
                </p>
            </div>
        )
    },
}

export const SingleSelectWithFooter: Story = {
    render: () => {
        const { control } = useForm({
            defaultValues: { department: '' },
        })
        return (
            <div className="max-w-xs">
                <FilterSelect
                    control={control}
                    name="department"
                    label="Department"
                    options={departmentOptions}
                    placeholder="Select department"
                    searchPlaceholder="Search departments..."
                />
            </div>
        )
    },
}

// ============================================================================
// FilterMultiSelect
// ============================================================================

export const MultiSelect: Story = {
    render: () => {
        const { control, watch } = useForm({
            defaultValues: { tags: [] as string[] },
        })
        return (
            <div className="max-w-sm space-y-4">
                <FilterMultiSelect
                    control={control}
                    name="tags"
                    label="Tags"
                    options={tagOptions}
                />
                <p className="text-sm text-muted-foreground">
                    Selected: {JSON.stringify(watch('tags'))}
                </p>
            </div>
        )
    },
}

export const MultiSelectPreselected: Story = {
    render: () => {
        const { control, watch } = useForm({
            defaultValues: {
                departments: ['engineering', 'design', 'marketing'],
            },
        })
        return (
            <div className="max-w-sm space-y-4">
                <FilterMultiSelect
                    control={control}
                    name="departments"
                    label="Departments"
                    options={departmentOptions}
                />
                <p className="text-sm text-muted-foreground">
                    Selected: {JSON.stringify(watch('departments'))}
                </p>
            </div>
        )
    },
}

// ============================================================================
// Filter Bar Example
// ============================================================================

export const FilterBarExample: Story = {
    render: () => {
        const { control, watch, reset } = useForm({
            defaultValues: {
                status: '',
                department: '',
                tags: [] as string[],
            },
        })
        const values = watch()
        return (
            <div className="space-y-4">
                <div className="flex items-end gap-3 flex-wrap">
                    <div className="w-[180px]">
                        <FilterSelect
                            control={control}
                            name="status"
                            label="Status"
                            options={statusOptions}
                        />
                    </div>
                    <div className="w-[200px]">
                        <FilterSelect
                            control={control}
                            name="department"
                            label="Department"
                            options={departmentOptions}
                        />
                    </div>
                    <div className="w-[250px]">
                        <FilterMultiSelect
                            control={control}
                            name="tags"
                            label="Tags"
                            options={tagOptions}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            reset({ status: '', department: '', tags: [] })
                        }
                        className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                    >
                        Reset
                    </button>
                </div>
                <pre className="rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(values, null, 2)}
                </pre>
            </div>
        )
    },
}
