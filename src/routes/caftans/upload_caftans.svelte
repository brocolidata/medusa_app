<script>
    import { batchCreateCaftans } from "$lib/stores";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import Papa from 'papaparse';
    import { toast } from "svelte-sonner";



    let file = $state();
    let fileLabel = $state("");
    let uploadCSVDialogIsOpen = $state(false);

    function handleDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith(".csv")) {
            file = droppedFile;
            fileLabel = droppedFile.name.replace(/\.csv$/i, "");
        } else {
            alert("Please upload a .csv file");
        }
    }

    function handleFileSelect(event) {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.name.endsWith(".csv")) {
            file = selectedFile;
            fileLabel = selectedFile.name.replace(/\.csv$/i, "");
        } else {
            alert("Please upload a .csv file");
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleSave() {
        if (!file) {
            alert("Please select a .csv file before saving");
            return;
        }

        // Papa.parse is asynchronous when handling a File object
        Papa.parse(file, {
            header: true,
            delimiter:",",
            encoding: "utf-8",
            // skipEmptyLines: true, // Optional: skip any blank rows
            complete: function(results, file) {
                // The parsing is complete inside this function
                const parsedData = results.data;
                const errors = results.errors;
                const meta = results.meta;

                // console.log('DEBUG PapaParse Results: ', results);
                // console.log('DEBUG Parsed Data: ', parsedData);
                // console.log('DEBUG Errors: ', errors);
                // console.log('DEBUG Meta: ', meta);

                if (errors.length > 0) {
                    alert(`CSV Parsing Errors found: ${errors.length}. Check console for details.`);
                    return; 
                }

                batchCreateCaftans(parsedData);
                uploadCSVDialogIsOpen = false;
                toast(`Successfully added caftans from file`);
            },
            error: function(error, file) {
                console.error('PapaParse error:', error);
                alert('An error occurred while reading the file.');
            }
        });
    }
</script>

<Dialog.Root bind:open={uploadCSVDialogIsOpen}>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
        Upload caftans
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Upload data source</Dialog.Title>
            <Dialog.Description>
                Upload a data source in .parquet format
            </Dialog.Description>
        </Dialog.Header>

        <div class="grid gap-4 py-4">

            <!-- Drag and Drop Zone -->
            <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                ondrop={handleDrop}
                ondragover={handleDragOver}
                onclick={() => document.getElementById("fileInput").click()}
            >
                <input
                    id="fileInput"
                    type="file"
                    accept=".csv"
                    class="hidden"
                    onchange={handleFileSelect}
                />
                {#if file}
                    <p class="text-sm text-gray-700">Selected: {file.name}</p>
                {:else}
                    <p class="text-sm text-gray-500">
                        Drag & drop your .csv file here, or click to select
                    </p>
                {/if}
            </div>
        </div>

        <Dialog.Footer>
            <Button type="button" onclick={handleSave}>Save</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
