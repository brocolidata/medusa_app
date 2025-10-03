<script lang="ts">
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { deleteCaftans } from "$lib/stores";
    import { toast } from "svelte-sonner";
    let {
        selectedCaftanCodes
    } = $props()

    let dialogIsOpen = $state(false);

    function deleteSelectedCaftans() {
        deleteCaftans(selectedCaftanCodes);
        dialogIsOpen = false;
        toast(`Successfully deleted Caftans ${selectedCaftanCodes.toString()}`);
    }
</script>

<AlertDialog.Root bind:open={dialogIsOpen}>
    <AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>
        Delete caftans
    </AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Caftans deletion</AlertDialog.Title>
            <AlertDialog.Description>
                Are you sure you want to delete these caftans : 
                {selectedCaftanCodes.toString()}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onclick={deleteSelectedCaftans} >Continue</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
