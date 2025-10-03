<script>
    import { createCaftan } from "$lib/stores";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { toast } from "svelte-sonner";
    
    let newCaftanCode = $state();
    let newCaftanDialogIsOpen = $state(false);

    function saveCaftan() {
        createCaftan({ caftan_code: newCaftanCode });
        newCaftanDialogIsOpen = false;
        toast(`Successfully created Caftan ${newCaftanCode}`);
    }
</script>

<Dialog.Root bind:open={newCaftanDialogIsOpen}>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
        >Add caftan</Dialog.Trigger
    >

    <Dialog.Content class="sm:max-w-lg">
        <Dialog.Header>
            <Dialog.Title class="text-xl font-semibold">Add caftan</Dialog.Title
            >
            <Dialog.Description class="text-sm text-gray-500">
                Create a new Caftan
            </Dialog.Description>
        </Dialog.Header>

        <div class="grid gap-4 py-4 px-2 sm:px-4 border-gray-200 mt-2">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="caftan_code" class="text-right font-medium"
                    >Caftan Code</Label
                >
                <Input
                    id="caftan_code"
                    class="col-span-3"
                    bind:value={newCaftanCode}
                />
            </div>
        </div>

        <Dialog.Footer class="pt-4 border-gray-200">
            <Button onclick={saveCaftan} type="submit">Save changes</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
