<script>
    import { base } from "$app/paths";
    import { goto } from "$app/navigation";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import Combobox from "$custom_ui/combobox.svelte";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {
        getCaftanCodeOptions,
        createBooking,
        getBookingsForCaftan,
    } from "$lib/stores.js";
    import BookingCalendar from "$custom_ui/booking_calendar.svelte";
    import { Save, Plus } from "@lucide/svelte";
    import { toast } from "svelte-sonner";
    import { v7 as uuidv7 } from 'uuid';


    let caftanCodesOptions = $derived(getCaftanCodeOptions());
    let caftanCode = $state();
    let newCustomerName = $state();
    let openFrom = $state(false);
    let openTo = $state(false);
    let valueFrom = $state();
    let valueTo = $state();
    let dateValue = $state();
    let existingBookings = $derived(getBookingsForCaftan(caftanCode));
    let newBookingDialogIsOpen = $state(false);

    function convertStructuredDateToNativeDate(structuredDate) {
        if (!structuredDate || !structuredDate.year) {
            return null; // Handle null/undefined dates
        }
        
        // Note: JavaScript Date constructor uses 0-indexed months (0 = Jan, 11 = Dec)
        // Your structured date uses 1-indexed months (1 = Jan, 12 = Dec).
        // We must subtract 1 from the month.
        return new Date(
            structuredDate.year,
            structuredDate.month - 1, // Subtract 1 for 0-indexing!
            structuredDate.day
        );
    }

    function saveBooking() {
        const nativePickupDate = convertStructuredDateToNativeDate(dateValue.start);
        const nativeDropoffDate = convertStructuredDateToNativeDate(dateValue.end);
        const newBooking = {
            booking_id: uuidv7(),
            caftan_code: caftanCode,
            customer_name: newCustomerName,
            pickup_date: nativePickupDate,
            dropoff_date: nativeDropoffDate,
        };
        createBooking(newBooking);
        newBookingDialogIsOpen = false;
        goto(`${base}/bookings`);
        toast(`Successfully created booking`);
    }
</script>

<Dialog.Root bind:open={newBookingDialogIsOpen}>
    <!-- <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
        >Book a caftan</Dialog.Trigger
    > -->
    <Dialog.Trigger 
        class="bg-green-400 dark:bg-green-600 justify-center {buttonVariants({ variant: "primary" })}"
    >
        <Plus class=""/>
        Book a caftan
    </Dialog.Trigger>

    <Dialog.Content class="sm:max-w-lg">
        <Dialog.Header>
            <Dialog.Title class="text-xl font-semibold"
                >Book a caftan</Dialog.Title
            >
            <Dialog.Description class="text-sm text-gray-500">
                Create a new booking for a caftan
            </Dialog.Description>
        </Dialog.Header>

        <div class="grid gap-4 py-4 px-2 sm:px-4 border-gray-200 mt-2">
            <div class="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <Label
                    for="caftan-combobox"
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-1"
                    >Caftan code</Label
                >
                <div class="sm:col-span-2">
                    <Combobox
                        boxOptions={caftanCodesOptions}
                        objectName="caftan"
                        bind:value={caftanCode}
                    />
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <Label
                    for="customer_name"
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-1"
                    >Customer name</Label
                >
                <Input
                    id="customer_name"
                    class="sm:col-span-2"
                    bind:value={newCustomerName}
                />
            </div>

            <div class=" border-gray-200 dark:border-gray-700">
                <!-- <h3 class="text-lg font-medium mb-3">Select Date:</h3> -->
                <BookingCalendar bind:value={dateValue} {existingBookings} />
            </div>
        </div>

        <Dialog.Footer class="pt-4 border-gray-200">
            <Button onclick={saveBooking} type="submit">Save booking</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
