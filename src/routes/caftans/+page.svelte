<script>
    import { caftansIndex, sortByKey } from "$lib/stores";
    import DataTable from "$lib/components/custom_ui/data_table.svelte";
    import { renderComponent } from "$lib/components/ui/data-table/index.js";
    import DataTableCheckbox from "$custom_ui/data_table_checkbox.svelte";
    import CreateCaftans from "./create_caftans.svelte";
    import DeleteCaftans from "./delete_caftans.svelte";
    import UploadCaftans from "./upload_caftans.svelte";

    let pagination = $state({ pageIndex: 0, pageSize: 20 });
    let sorting = $state([]);
    let rowCount = $state();
    let columnVisibility = $state({});
    let rowSelection = $state({});
    let data = $derived(sortData($caftansIndex, sorting));
    let selectedCaftanData = $state([]);
    let selectedCaftanCodes = $derived(
        selectedCaftanData.map((item) => item.caftan_code),
    );

    const caftansColumns = [{ label: "caftan_code", type: "string"}];
    const columns = processTableColumns(caftansColumns);
    const typeMap = Object.fromEntries(
		caftansColumns.map(col => [col.label, col.type])
	);

    function sortData(dataArray, sortingObject) {
        console.log('DEBUG sortingObject.length: ', sortingObject.length);
        if (sortingObject.length > 0) {
            const key = sortingObject[0]['id'];
            const order = sortingObject[0]['desc'] === true 
                ? 'desc' 
                : 'asc';
            const columnType = typeMap[key];
            const dataCopy = [...dataArray];
            const sortedData = sortByKey(dataCopy, key, columnType, order);
            return sortedData;
        } else {
            return dataArray;
        }
    }

    function processTableColumns(dataset_columns) {
        const columns_definitions = dataset_columns.map((col) => ({
            accessorKey: col.label,
            header: col.label
                .replace("_", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()),
            enableSorting: true,
            enableHiding: true,
        }));
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

<div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <header class="flex items-center justify-between mb-6 sm:mb-8">
        <h2
            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        >
            Caftans
        </h2>
        <div>
            {#if selectedCaftanCodes.length > 0}
                <DeleteCaftans {selectedCaftanCodes} />
            {/if}
            
            <CreateCaftans />
            <UploadCaftans />
        </div>
    </header>

    <section class="mt-4 shadow-lg rounded-lg overflow-hidden border">
        <DataTable
            {data}
            {rowCount}
            {columns}
            bind:columnVisibility
            bind:pagination
            bind:sorting
            bind:rowSelection
            bind:selectedRows={selectedCaftanData}
        />
    </section>
</div>
