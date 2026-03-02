import type { Meta, StoryObj } from '@storybook/react'
import { useState, useCallback } from 'react'
import { DataTableCustomized, createColumns } from '../components/ui/data-table'
import type {
    DataTableColumn,
    DataTablePagination,
    DataTableSorting,
    DataTableSelection,
} from '../components/ui/data-table'
import { DataTableLabelsProvider } from '../lib/labels'

// ==================== MOCK DATA ====================

interface Employee {
    id: number
    name: string
    email: string
    department: string
    position: string
    salary: number
    status: 'active' | 'inactive' | 'on_leave'
    joinDate: string
    isRemote: boolean
    avatar?: string
    phone: string
}

const mockEmployees: Employee[] = [
    { id: 1, name: 'Nguyen Van A', email: 'a.nguyen@company.com', department: 'Engineering', position: 'Senior Developer', salary: 2500, status: 'active', joinDate: '2022-03-15', isRemote: true, phone: '0901234567' },
    { id: 2, name: 'Tran Thi B', email: 'b.tran@company.com', department: 'Design', position: 'UI/UX Designer', salary: 2000, status: 'active', joinDate: '2023-01-10', isRemote: false, phone: '0912345678' },
    { id: 3, name: 'Le Van C', email: 'c.le@company.com', department: 'Engineering', position: 'Junior Developer', salary: 1200, status: 'on_leave', joinDate: '2023-06-20', isRemote: true, phone: '0923456789' },
    { id: 4, name: 'Pham Thi D', email: 'd.pham@company.com', department: 'Marketing', position: 'Marketing Manager', salary: 2800, status: 'active', joinDate: '2021-11-01', isRemote: false, phone: '0934567890' },
    { id: 5, name: 'Hoang Van E', email: 'e.hoang@company.com', department: 'Engineering', position: 'Tech Lead', salary: 3500, status: 'active', joinDate: '2020-08-15', isRemote: true, phone: '0945678901' },
    { id: 6, name: 'Vo Thi F', email: 'f.vo@company.com', department: 'HR', position: 'HR Specialist', salary: 1800, status: 'active', joinDate: '2022-09-01', isRemote: false, phone: '0956789012' },
    { id: 7, name: 'Dang Van G', email: 'g.dang@company.com', department: 'Engineering', position: 'DevOps Engineer', salary: 2800, status: 'inactive', joinDate: '2021-04-10', isRemote: true, phone: '0967890123' },
    { id: 8, name: 'Bui Thi H', email: 'h.bui@company.com', department: 'Finance', position: 'Accountant', salary: 1600, status: 'active', joinDate: '2023-02-28', isRemote: false, phone: '0978901234' },
    { id: 9, name: 'Nguyen Van I', email: 'i.nguyen@company.com', department: 'Engineering', position: 'QA Engineer', salary: 1900, status: 'active', joinDate: '2022-07-15', isRemote: true, phone: '0989012345' },
    { id: 10, name: 'Tran Van K', email: 'k.tran@company.com', department: 'Design', position: 'Graphic Designer', salary: 1700, status: 'on_leave', joinDate: '2023-04-01', isRemote: false, phone: '0990123456' },
    { id: 11, name: 'Le Thi L', email: 'l.le@company.com', department: 'Engineering', position: 'Frontend Developer', salary: 2200, status: 'active', joinDate: '2022-12-01', isRemote: true, phone: '0901234568' },
    { id: 12, name: 'Pham Van M', email: 'm.pham@company.com', department: 'Marketing', position: 'Content Writer', salary: 1400, status: 'active', joinDate: '2023-08-15', isRemote: false, phone: '0912345679' },
]

// ==================== BASIC COLUMNS ====================

const basicColumns: DataTableColumn<Employee>[] = [
    { key: 'name', title: 'Name', width: 180 },
    { key: 'email', title: 'Email', width: 220 },
    { key: 'department', title: 'Department', width: 130 },
    { key: 'position', title: 'Position', width: 180 },
]

// ==================== STORYBOOK META ====================

const meta: Meta<typeof DataTableCustomized> = {
    title: 'Components/DataTable',
    component: DataTableCustomized as any,
    parameters: {
        layout: 'padded',
    },
    decorators: [
        (Story) => (
            <div className="p-4 max-w-[1200px]">
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof meta>

// ==================== STORIES ====================

// 1. Basic
export const Basic: Story = {
    render: () => (
        <DataTableCustomized<Employee>
            columns={basicColumns}
            rows={mockEmployees.slice(0, 5)}
        />
    ),
}

// 2. With Index
export const WithIndex: Story = {
    render: () => (
        <DataTableCustomized<Employee>
            columns={basicColumns}
            rows={mockEmployees.slice(0, 5)}
            showIndex
        />
    ),
}

// 3. With Pagination
const PaginationDemo = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)

    const pagination: DataTablePagination = {
        page,
        pageSize,
        total: mockEmployees.length,
        onPageChange: setPage,
        onPageSizeChange: (size) => {
            setPageSize(size)
            setPage(1)
        },
        pageSizeOptions: [5, 10, 20],
    }

    return (
        <DataTableCustomized<Employee>
            columns={basicColumns}
            rows={mockEmployees}
            pagination={pagination}
            showIndex
        />
    )
}

export const WithPagination: Story = {
    render: () => <PaginationDemo />,
}

// 4. With Sorting
const SortingDemo = () => {
    const [sortBy, setSortBy] = useState<string | undefined>()
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

    const sorting: DataTableSorting = {
        sortBy,
        sortOrder,
        onSortChange: (by, order) => {
            setSortBy(by)
            setSortOrder(order)
        },
    }

    const sortableColumns: DataTableColumn<Employee>[] = [
        { key: 'name', title: 'Name', width: 180, sortable: true },
        { key: 'email', title: 'Email', width: 220 },
        { key: 'department', title: 'Department', width: 130, sortable: true },
        { key: 'salary', title: 'Salary', width: 120, sortable: true },
    ]

    const sortedRows = [...mockEmployees].sort((a, b) => {
        if (!sortBy) return 0
        const aVal = a[sortBy as keyof Employee]
        const bVal = b[sortBy as keyof Employee]
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
    })

    return (
        <DataTableCustomized<Employee>
            columns={sortableColumns}
            rows={sortedRows}
            sorting={sorting}
        />
    )
}

export const WithSorting: Story = {
    render: () => <SortingDemo />,
}

// 5. With Selection
const SelectionDemo = () => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])

    const selection: DataTableSelection<Employee> = {
        selectedKeys,
        onSelectionChange: setSelectedKeys,
        getRowKey: (row) => String(row.id),
        actions: [
            {
                key: 'delete',
                label: 'Delete Selected',
                onClick: (keys) => {
                    alert(`Delete ${keys.length} items: ${keys.join(', ')}`)
                    setSelectedKeys([])
                },
                variant: 'destructive',
            },
            {
                key: 'export',
                label: 'Export Selected',
                onClick: (keys) => {
                    alert(`Export ${keys.length} items`)
                },
            },
        ],
    }

    return (
        <DataTableCustomized<Employee>
            columns={basicColumns}
            rows={mockEmployees.slice(0, 8)}
            selection={selection}
            showIndex
        />
    )
}

export const WithSelection: Story = {
    render: () => <SelectionDemo />,
}

// 6. With Formatters
export const WithFormatters: Story = {
    render: () => {
        const formatterColumns: DataTableColumn<Employee>[] = [
            { key: 'name', title: 'Name', width: 160 },
            {
                key: 'status',
                title: 'Status',
                width: 120,
                formatter: {
                    type: 'chip',
                    colorMap: {
                        active: { label: 'Active', color: 'success' },
                        inactive: { label: 'Inactive', color: 'error' },
                        on_leave: { label: 'On Leave', color: 'warning' },
                    },
                },
            },
            {
                key: 'salary',
                title: 'Salary',
                width: 130,
                formatter: {
                    type: 'currency',
                    currency: 'USD',
                },
            },
            {
                key: 'joinDate',
                title: 'Join Date',
                width: 140,
                formatter: {
                    type: 'date',
                    format: 'DD/MM/YYYY',
                },
            },
            {
                key: 'isRemote',
                title: 'Remote',
                width: 100,
                formatter: {
                    type: 'boolean',
                    displayMode: 'icon',
                },
            },
            {
                key: 'email',
                title: 'Email',
                width: 220,
                formatter: {
                    type: 'link',
                    href: (value: any) => `mailto:${value}`,
                },
            },
            {
                key: 'department',
                title: 'Department',
                width: 140,
                formatter: {
                    type: 'badge',
                    variant: 'outline',
                },
            },
        ]

        return (
            <DataTableCustomized<Employee>
                columns={formatterColumns}
                rows={mockEmployees.slice(0, 6)}
            />
        )
    },
}

// 7. With Expandable Rows
export const WithExpandableRows: Story = {
    render: () => {
        const expandableColumns: DataTableColumn<Employee>[] = [
            { key: 'name', title: 'Name', width: 180 },
            { key: 'department', title: 'Department', width: 130 },
            { key: 'position', title: 'Position', width: 180 },
        ]

        return (
            <DataTableCustomized<Employee>
                columns={expandableColumns}
                rows={mockEmployees.slice(0, 5)}
                expandable={{
                    expandedRowRender: (row) => (
                        <div className="p-4 bg-muted/30 space-y-2">
                            <p><strong>Email:</strong> {row.email}</p>
                            <p><strong>Phone:</strong> {row.phone}</p>
                            <p><strong>Salary:</strong> ${row.salary.toLocaleString()}</p>
                            <p><strong>Join Date:</strong> {row.joinDate}</p>
                            <p><strong>Remote:</strong> {row.isRemote ? 'Yes' : 'No'}</p>
                        </div>
                    ),
                }}
            />
        )
    },
}

// 8. With Actions
export const WithActions: Story = {
    render: () => (
        <DataTableCustomized<Employee>
            columns={basicColumns}
            rows={mockEmployees.slice(0, 5)}
            actions={[
                {
                    key: 'view',
                    label: 'View Details',
                    onClick: (row) => alert(`View: ${row.name}`),
                },
                {
                    key: 'edit',
                    label: 'Edit',
                    onClick: (row) => alert(`Edit: ${row.name}`),
                },
                {
                    key: 'delete',
                    label: 'Delete',
                    onClick: (row) => alert(`Delete: ${row.name}`),
                    variant: 'danger',
                },
            ]}
        />
    ),
}

// 9. With Toolbar
const ToolbarDemo = () => {
    const [search, setSearch] = useState('')

    const filteredRows = mockEmployees.filter(
        (row) =>
            !search ||
            row.name.toLowerCase().includes(search.toLowerCase()) ||
            row.email.toLowerCase().includes(search.toLowerCase()) ||
            row.department.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <DataTableCustomized<Employee>
            columns={[
                { key: 'name', title: 'Name', width: 180 },
                { key: 'email', title: 'Email', width: 220 },
                { key: 'department', title: 'Department', width: 130 },
                { key: 'position', title: 'Position', width: 180 },
                { key: 'salary', title: 'Salary', width: 120 },
                { key: 'phone', title: 'Phone', width: 130 },
            ]}
            rows={filteredRows}
            showIndex
            toolbar={{
                search: {
                    value: search,
                    onChange: setSearch,
                    placeholder: 'Search employees',
                },
                visibilityColumn: true,
                settings: {
                    show: true,
                    showFontSize: true,
                    showRowHeight: true,
                    showColumnVisibility: true,
                    storageKey: 'storybook-demo',
                },
            }}
        />
    )
}

export const WithToolbar: Story = {
    render: () => <ToolbarDemo />,
}

// 10. Bordered & Resizable
export const BorderedAndResizable: Story = {
    render: () => (
        <DataTableCustomized<Employee>
            columns={[
                { key: 'name', title: 'Name', width: 180 },
                { key: 'email', title: 'Email', width: 220 },
                { key: 'department', title: 'Department', width: 130 },
                { key: 'position', title: 'Position', width: 180 },
                { key: 'salary', title: 'Salary', width: 120 },
            ]}
            rows={mockEmployees.slice(0, 6)}
            bordered
            resizable
            showIndex
        />
    ),
}

// 11. Loading States
export const LoadingState: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-sm font-medium mb-2">Loading (no data yet)</h3>
                <DataTableCustomized<Employee>
                    columns={basicColumns}
                    rows={[]}
                    loading
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2">Fetching (has data, refreshing)</h3>
                <DataTableCustomized<Employee>
                    columns={basicColumns}
                    rows={mockEmployees.slice(0, 3)}
                    isFetching
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2">Empty</h3>
                <DataTableCustomized<Employee>
                    columns={basicColumns}
                    rows={[]}
                    emptyMessage="No employees found"
                />
            </div>
        </div>
    ),
}

// 12. Custom Labels (Vietnamese)
export const CustomLabelsVietnamese: Story = {
    render: () => {
        const VietnameseDemo = () => {
            const [page, setPage] = useState(1)
            const [selectedKeys, setSelectedKeys] = useState<string[]>([])

            return (
                <DataTableCustomized<Employee>
                    columns={[
                        { key: 'name', title: 'Họ tên', width: 180 },
                        { key: 'email', title: 'Email', width: 220 },
                        { key: 'department', title: 'Phòng ban', width: 130 },
                        { key: 'position', title: 'Chức vụ', width: 180 },
                    ]}
                    rows={mockEmployees}
                    showIndex
                    pagination={{
                        page,
                        pageSize: 5,
                        total: mockEmployees.length,
                        onPageChange: setPage,
                        pageSizeOptions: [5, 10],
                    }}
                    selection={{
                        selectedKeys,
                        onSelectionChange: setSelectedKeys,
                        getRowKey: (row) => String(row.id),
                    }}
                    labels={{
                        indexColumnTitle: 'STT',
                        noData: 'Không có dữ liệu',
                        loading: 'Đang tải...',
                        selectedCount: (n) => `Đã chọn ${n} mục`,
                        previewSelected: 'Xem danh sách',
                        clearSelection: 'Bỏ chọn',
                        pageInfo: (p, t, total) => `Trang ${p} / ${t} (${total} bản ghi)`,
                        records: 'Bản ghi',
                        goToPage: 'Đi đến trang',
                        firstPage: 'Trang đầu',
                        previousPage: 'Trang trước',
                        nextPage: 'Trang sau',
                        lastPage: 'Trang cuối',
                    }}
                />
            )
        }

        return <VietnameseDemo />
    },
}

// 13. Full Featured
const FullFeaturedDemo = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [sortBy, setSortBy] = useState<string | undefined>()
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const [search, setSearch] = useState('')

    const filteredRows = mockEmployees.filter(
        (row) =>
            !search ||
            row.name.toLowerCase().includes(search.toLowerCase()) ||
            row.department.toLowerCase().includes(search.toLowerCase())
    )

    const sortedRows = [...filteredRows].sort((a, b) => {
        if (!sortBy) return 0
        const aVal = a[sortBy as keyof Employee]
        const bVal = b[sortBy as keyof Employee]
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
    })

    const fullColumns: DataTableColumn<Employee>[] = [
        { key: 'name', title: 'Name', width: 160, sortable: true, pinned: 'left' },
        {
            key: 'status',
            title: 'Status',
            width: 120,
            sortable: true,
            formatter: {
                type: 'chip',
                colorMap: {
                    active: { label: 'Active', color: 'success' },
                    inactive: { label: 'Inactive', color: 'error' },
                    on_leave: { label: 'On Leave', color: 'warning' },
                },
            },
        },
        { key: 'department', title: 'Department', width: 130, sortable: true },
        { key: 'position', title: 'Position', width: 180 },
        {
            key: 'salary',
            title: 'Salary',
            width: 130,
            sortable: true,
            formatter: { type: 'currency', currency: 'USD' },
        },
        {
            key: 'joinDate',
            title: 'Join Date',
            width: 130,
            formatter: { type: 'date', format: 'DD/MM/YYYY' },
        },
        {
            key: 'isRemote',
            title: 'Remote',
            width: 90,
            formatter: { type: 'boolean', displayMode: 'icon' },
        },
        { key: 'phone', title: 'Phone', width: 130 },
    ]

    return (
        <DataTableCustomized<Employee>
            columns={fullColumns}
            rows={sortedRows}
            showIndex
            bordered
            resizable
            pagination={{
                page,
                pageSize,
                total: filteredRows.length,
                onPageChange: setPage,
                onPageSizeChange: (size) => { setPageSize(size); setPage(1) },
                pageSizeOptions: [5, 10, 20],
            }}
            sorting={{
                sortBy,
                sortOrder,
                onSortChange: (by, order) => { setSortBy(by); setSortOrder(order) },
            }}
            selection={{
                selectedKeys,
                onSelectionChange: setSelectedKeys,
                getRowKey: (row) => String(row.id),
                actions: [
                    {
                        key: 'delete',
                        label: 'Delete',
                        onClick: () => setSelectedKeys([]),
                        variant: 'destructive',
                    },
                ],
            }}
            toolbar={{
                search: {
                    value: search,
                    onChange: setSearch,
                    placeholder: 'Search...',
                },
                visibilityColumn: true,
                settings: {
                    show: true,
                    showFontSize: true,
                    showRowHeight: true,
                    showColumnVisibility: true,
                    storageKey: 'storybook-full',
                },
            }}
            actions={[
                { key: 'view', label: 'View', onClick: (row) => alert(`View: ${row.name}`) },
                { key: 'edit', label: 'Edit', onClick: (row) => alert(`Edit: ${row.name}`) },
                { key: 'delete', label: 'Delete', onClick: (row) => alert(`Delete: ${row.name}`), variant: 'danger' },
            ]}
            expandable={{
                expandedRowRender: (row) => (
                    <div className="p-4 bg-muted/30">
                        <p><strong>Email:</strong> {row.email}</p>
                        <p><strong>Phone:</strong> {row.phone}</p>
                    </div>
                ),
            }}
        />
    )
}

export const FullFeatured: Story = {
    render: () => <FullFeaturedDemo />,
}

// 14. Size Variants
export const SizeVariants: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-sm font-medium mb-2">Small (default)</h3>
                <DataTableCustomized<Employee>
                    columns={basicColumns}
                    rows={mockEmployees.slice(0, 3)}
                    size="small"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2">Medium</h3>
                <DataTableCustomized<Employee>
                    columns={basicColumns}
                    rows={mockEmployees.slice(0, 3)}
                    size="medium"
                />
            </div>
        </div>
    ),
}

// 15. Footer Row
export const WithFooterRow: Story = {
    render: () => (
        <DataTableCustomized<Employee>
            columns={[
                { key: 'name', title: 'Name', width: 180 },
                { key: 'department', title: 'Department', width: 130 },
                { key: 'salary', title: 'Salary', width: 130 },
            ]}
            rows={mockEmployees.slice(0, 6)}
            showIndex
            footerRow={{
                cells: {
                    name: <strong>Total</strong>,
                    salary: (
                        <strong>
                            ${mockEmployees.slice(0, 6).reduce((sum, e) => sum + e.salary, 0).toLocaleString()}
                        </strong>
                    ),
                },
            }}
        />
    ),
}
