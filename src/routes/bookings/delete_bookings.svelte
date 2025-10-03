
<script lang="ts">
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { deleteBookings } from "$lib/stores";
    import { toast } from "svelte-sonner";
    let {
        selectedBookingIDs
    } = $props()

    let dialogIsOpen = $state(false);

    function deleteSelectedBookings() {
        deleteBookings(selectedBookingIDs);
        dialogIsOpen = false;
        toast(`Successfully deleted Bookings ${selectedBookingIDs.toString()}`);
    }
</script>

<AlertDialog.Root bind:open={dialogIsOpen}>
    <AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>
        Delete caftans
    </AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Bookings deletion</AlertDialog.Title>
            <AlertDialog.Description>
                Are you sure you want to delete these bookings : 
                {selectedBookingIDs.toString()}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onclick={deleteSelectedBookings} >Continue</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
