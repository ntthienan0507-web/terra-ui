import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'

import { MultiSelect } from '../components/ui/select'

const meta: Meta<typeof MultiSelect> = {
    title: 'MultiSelect',
    component: MultiSelect,
    parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof MultiSelect>

const fruitOptions = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Durian', value: 'durian' },
    { label: 'Elderberry', value: 'elderberry' },
    { label: 'Fig', value: 'fig' },
    { label: 'Grape', value: 'grape' },
]

export const Basic: Story = {
    render: () => {
        const [selected, setSelected] = React.useState<(string | number)[]>([])
        return (
            <div className="w-[300px] space-y-4">
                <MultiSelect
                    options={fruitOptions}
                    selected={selected}
                    onChange={setSelected}
                    placeholder="Select fruits..."
                />
                <p className="text-sm text-muted-foreground">
                    Selected: {JSON.stringify(selected)}
                </p>
            </div>
        )
    },
}

export const WithPreselected: Story = {
    render: () => {
        const [selected, setSelected] = React.useState<(string | number)[]>([
            'apple',
            'banana',
            'cherry',
        ])
        return (
            <div className="w-[300px] space-y-4">
                <MultiSelect
                    options={fruitOptions}
                    selected={selected}
                    onChange={setSelected}
                    placeholder="Select fruits..."
                />
                <p className="text-sm text-muted-foreground">
                    Selected: {JSON.stringify(selected)}
                </p>
            </div>
        )
    },
}

export const ManySelected: Story = {
    render: () => {
        const [selected, setSelected] = React.useState<(string | number)[]>([
            'apple',
            'banana',
            'cherry',
            'durian',
            'elderberry',
        ])
        return (
            <div className="w-[300px] space-y-4">
                <MultiSelect
                    options={fruitOptions}
                    selected={selected}
                    onChange={setSelected}
                />
                <p className="text-sm text-muted-foreground">
                    Shows +N badge when more than 2 selected
                </p>
            </div>
        )
    },
}
