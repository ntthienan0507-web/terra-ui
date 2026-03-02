import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { FormField } from '../components/ui/form-field'
import type { SelectOption } from '../components/ui/form-field/types'

const meta: Meta = {
    title: 'FormField',
    parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

// ============================================================================
// Helpers
// ============================================================================

const statusOptions: SelectOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
]

const roleOptions: SelectOption[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
    { label: 'Manager', value: 'manager' },
]

// ============================================================================
// Stories
// ============================================================================

export const TextField: Story = {
    render: () => {
        const { control, watch } = useForm({
            defaultValues: { name: '' },
        })
        const value = watch('name')
        return (
            <div className="max-w-sm space-y-4">
                <FormField
                    control={control}
                    name="name"
                    type="textfield"
                    label="Full Name"
                    placeholder="Enter your name"
                    required
                />
                <p className="text-sm text-muted-foreground">Value: {value}</p>
            </div>
        )
    },
}

export const TextFieldVariants: Story = {
    render: () => {
        const { control } = useForm({
            defaultValues: { email: '', password: '', url: '' },
        })
        return (
            <div className="max-w-sm space-y-4">
                <FormField
                    control={control}
                    name="email"
                    type="textfield"
                    inputType="email"
                    label="Email"
                    placeholder="you@example.com"
                />
                <FormField
                    control={control}
                    name="password"
                    type="textfield"
                    inputType="password"
                    label="Password"
                    placeholder="••••••••"
                />
                <FormField
                    control={control}
                    name="url"
                    type="textfield"
                    inputType="url"
                    label="Website"
                    placeholder="https://example.com"
                    helperText="Include the protocol (https://)"
                />
            </div>
        )
    },
}

export const TextareaField: Story = {
    render: () => {
        const { control } = useForm({
            defaultValues: { bio: '' },
        })
        return (
            <div className="max-w-sm">
                <FormField
                    control={control}
                    name="bio"
                    type="textarea"
                    label="Bio"
                    placeholder="Tell us about yourself..."
                    rows={4}
                />
            </div>
        )
    },
}

export const NumberField: Story = {
    render: () => {
        const { control, watch } = useForm({
            defaultValues: { amount: 0, price: 0 },
        })
        return (
            <div className="max-w-sm space-y-4">
                <FormField
                    control={control}
                    name="amount"
                    type="number"
                    label="Amount"
                    placeholder="0"
                    min={0}
                    max={1000}
                />
                <FormField
                    control={control}
                    name="price"
                    type="number"
                    label="Price"
                    placeholder="0"
                    formatted
                    suffix="VND"
                    decimals={0}
                />
                <p className="text-sm text-muted-foreground">
                    Amount: {watch('amount')} | Price: {watch('price')}
                </p>
            </div>
        )
    },
}

export const SelectField: Story = {
    render: () => {
        const { control, watch } = useForm({
            defaultValues: { status: '' },
        })
        return (
            <div className="max-w-sm space-y-4">
                <FormField
                    control={control}
                    name="status"
                    type="select"
                    label="Status"
                    placeholder="Select status"
                    options={statusOptions}
                    clearable
                />
                <p className="text-sm text-muted-foreground">
                    Selected: {watch('status') || '(none)'}
                </p>
            </div>
        )
    },
}

export const CheckboxField: Story = {
    render: () => {
        const { control, watch } = useForm({
            defaultValues: { agree: false, newsletter: false },
        })
        return (
            <div className="max-w-sm space-y-4">
                <FormField
                    control={control}
                    name="agree"
                    type="checkbox"
                    label="Terms & Conditions"
                    description="I agree to the terms and conditions"
                    required
                />
                <FormField
                    control={control}
                    name="newsletter"
                    type="checkbox"
                    label="Newsletter"
                    description="Subscribe to weekly newsletter"
                    bordered
                />
                <p className="text-sm text-muted-foreground">
                    Agree: {String(watch('agree'))} | Newsletter:{' '}
                    {String(watch('newsletter'))}
                </p>
            </div>
        )
    },
}

export const SwitchField: Story = {
    render: () => {
        const { control, watch } = useForm({
            defaultValues: { notifications: true, darkMode: false },
        })
        return (
            <div className="max-w-sm space-y-4">
                <FormField
                    control={control}
                    name="notifications"
                    type="switch"
                    label="Notifications"
                    description="Enable push notifications"
                />
                <FormField
                    control={control}
                    name="darkMode"
                    type="switch"
                    label="Dark Mode"
                    description="Toggle dark mode"
                    bordered
                />
                <p className="text-sm text-muted-foreground">
                    Notifications: {String(watch('notifications'))} | Dark:{' '}
                    {String(watch('darkMode'))}
                </p>
            </div>
        )
    },
}

export const DatePickerField: Story = {
    render: () => {
        const { control, watch } = useForm({
            defaultValues: { birthday: undefined as Date | undefined },
        })
        return (
            <div className="max-w-sm space-y-4">
                <FormField
                    control={control}
                    name="birthday"
                    type="datepicker"
                    label="Birthday"
                    placeholder="Pick your birthday"
                />
                <p className="text-sm text-muted-foreground">
                    Value: {watch('birthday')?.toLocaleDateString() ?? '(none)'}
                </p>
            </div>
        )
    },
}

export const DisabledFields: Story = {
    render: () => {
        const { control } = useForm({
            defaultValues: {
                name: 'John Doe',
                status: 'active',
                agree: true,
            },
        })
        return (
            <div className="max-w-sm space-y-4">
                <FormField
                    control={control}
                    name="name"
                    type="textfield"
                    label="Name"
                    disabled
                />
                <FormField
                    control={control}
                    name="status"
                    type="select"
                    label="Status"
                    options={statusOptions}
                    disabled
                />
                <FormField
                    control={control}
                    name="agree"
                    type="checkbox"
                    label="Agreement"
                    description="Agreed"
                    disabled
                />
            </div>
        )
    },
}

export const FullForm: Story = {
    render: () => {
        const { control, handleSubmit, watch } = useForm({
            defaultValues: {
                name: '',
                email: '',
                role: '',
                salary: 0,
                bio: '',
                active: true,
                notifications: false,
            },
        })

        const onSubmit = (data: any) => {
            alert(JSON.stringify(data, null, 2))
        }

        return (
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-lg space-y-4"
            >
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="name"
                        type="textfield"
                        label="Name"
                        placeholder="Full name"
                        required
                    />
                    <FormField
                        control={control}
                        name="email"
                        type="textfield"
                        inputType="email"
                        label="Email"
                        placeholder="Email address"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="role"
                        type="select"
                        label="Role"
                        options={roleOptions}
                        clearable
                    />
                    <FormField
                        control={control}
                        name="salary"
                        type="number"
                        label="Salary"
                        formatted
                        suffix="USD"
                    />
                </div>
                <FormField
                    control={control}
                    name="bio"
                    type="textarea"
                    label="Bio"
                    placeholder="Short bio..."
                    rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="active"
                        type="switch"
                        label="Active"
                        description="Account is active"
                    />
                    <FormField
                        control={control}
                        name="notifications"
                        type="checkbox"
                        label="Notifications"
                        description="Enable email notifications"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary-hover"
                >
                    Submit
                </button>
            </form>
        )
    },
}
