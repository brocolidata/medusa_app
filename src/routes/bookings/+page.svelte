<script>
    import { format } from 'date-fns';
    import { ordersIndex } from "$lib/stores";
    import DataTable from "$lib/components/custom_ui/data_table.svelte";
    import { renderComponent } from "$lib/components/ui/data-table/index.js";
    import DeleteBookings from './delete_bookings.svelte';
    import DataTableCheckbox from '$custom_ui/data_table_checkbox.svelte';

    let pagination = $state({ pageIndex: 0, pageSize: 20 });
	let sorting = $state([]);
	let rowCount = $state();
    let columnVisibility = $state({booking_id:false});
    let rowSelection = $state({});
    let data = $derived($ordersIndex);
    let selectedBookingData = $state([]);
    let selectedBookingIDs = $derived(
        selectedBookingData.map((item) => item.booking_id),
    );
    const ordersColumns = [
        {label: "booking_id", type: "string"},
        {label: "caftan_code", type: "string"},
        {label: "customer_name", type: "string"},
        {label: "pickup_date", type: "date"},
        {label: "dropoff_date", type: "date"}
    ]
    const columns = processTableColumns(ordersColumns);

    /**
     * Creates TanStack table column definitions, applying custom cell rendering for dates.
     * @param {Array<{ label: string, type: string }>} dataset_columns 
     * @returns {Array<import('@tanstack/table-core').ColumnDef<any>>}
     */
    function processTableColumns(dataset_columns) {
        const columns_definitions = dataset_columns.map(col => {
            const baseDefinition = {
                accessorKey: col.label,
                header: col.label.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                enableSorting: true,
                enableHiding: true,
            };

            // 2. CHECK THE TYPE AND ADD CUSTOM CELL RENDERING
            if (col.type === "date") {
                return {
                    ...baseDefinition,
                    // Define the custom cell function here
                    cell: ({ getValue }) => {
                        const date = getValue(); // This is the native Date object

                        if (date instanceof Date && !isNaN(date.getTime())) {
                            // Use date-fns format
                            return format(date, 'dd/MM/yyyy');
                        }
                        return 'N/A';
                    },
                };
            }

            // 3. Return the base definition for all other types (e.g., "string")
            return baseDefinition;
        });
        const select_definition = {
            id: "select",
            header: ({ table }) =>
                renderComponent(DataTableCheckbox, {
                    checked: table.getIsAllPageRowsSelected(),
                    indeterminate:
                        table.getIsSomePageRowsSelected() &&
                        !table.getIsAllPageRowsSelected(),
                    onCheckedChange: (value) =>
                        table.toggleAllPageRowsSelected(!!value),
                    "aria-label": "Select all",
                }),
            cell: ({ row }) =>
                renderComponent(DataTableCheckbox, {
                    checked: row.getIsSelected(),
                    onCheckedChange: (value) => row.toggleSelected(!!value),
                    "aria-label": "Select row",
                }),
            enableSorting: false,
            enableHiding: false,
        };
        return [select_definition, ...columns_definitions];
    }
</script>

<div class="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
    
    <header class="mb-6 sm:mb-8">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Bookings</h2>
    </header>
    <div>
        {#if selectedBookingIDs.length > 0}
            <DeleteBookings {selectedBookingIDs} />
        {/if}
    </div>

    <section class="mt-4 shadow-lg rounded-lg overflow-hidden border">
        <DataTable 
            {data} 
            {rowCount} 
            {columns}
            bind:columnVisibility 
            bind:pagination 
            bind:sorting
            bind:rowSelection
            bind:selectedRows={selectedBookingData}
        />
    </section>

</div>