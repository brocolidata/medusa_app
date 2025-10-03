<script lang="ts">
    import RangeCalendar from "$lib/components/ui/range-calendar/range-calendar.svelte";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { ChevronDown } from "@lucide/svelte";
    import { getLocalTimeZone } from "@internationalized/date";
    import { getUnavailableBookingAndCleaningDates } from "$lib/booking_utils";

    const id = $props.id();

    let { value = $bindable(), existingBookings } = $props();

    let open = $state(false);
    // 1. Generate the list of unavailable dates (Booking + Dry Cleaning)
    let unavailableDatesList = $derived(
        getUnavailableBookingAndCleaningDates(existingBookings),
    );

    // 2. Convert to timestamps for efficient checking in the Calendar prop
    let unavailableTimestamps = $derived(
        unavailableDatesList.map((d) => d.getTime()),
    );

    /**
     * The final function passed to the <Calendar /> component's isDateUnavailable prop.
     * It checks three conditions: existing booking/cleaning, and Sunday.
     *
     * @param date - The Date object currently being rendered by the calendar.
     * @returns true if the date is unavailable, false otherwise.
     */
    const isDateUnavailable = (date: Date): boolean => {
        // Normalize the date to midnight for comparison with the pre-calculated list
        const dateToCompare = new Date(date);
        dateToCompare.setHours(0, 0, 0, 0);

        // 4. Rule: Check against Booking/Dry Cleaning List
        return unavailableTimestamps.includes(dateToCompare.getTime());
    };

    const isDateDisabled = (date: any): boolean => {
        // Convert the library-specific date object to a standard JS Date object
        const jsDate: Date | null = date?.toDate
            ? date.toDate()
            : date instanceof Date
              ? date
              : null;

        if (!jsDate) return false;

        // Now we safely call .getDay() on the converted native Date object
        return jsDate.getDay() === 0;
    };
</script>

<div class="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
    <Label
        for="{id}-dates"
        class="text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-1"
    >
        Booking Dates
    </Label>

    <div class="sm:col-span-2">
        <Popover.Root bind:open>
            <Popover.Trigger id="{id}-dates" class="w-full">
                {#snippet child({ props })}
                    <Button
                        {...props}
                        variant="outline"
                        class="w-full justify-between font-normal text-left px-3 py-2 border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                        {value?.start && value?.end
                            ? `${value.start.toDate(getLocalTimeZone()).toLocaleDateString()} - ${value.end.toDate(getLocalTimeZone()).toLocaleDateString()}`
                            : "Select a range"}

                        <ChevronDown class="h-4 w-4 ml-2 shrink-0 opacity-70" />
                    </Button>
                {/snippet}
            </Popover.Trigger>

            <Popover.Content
                class="w-auto overflow-hidden p-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                align="start"
            >
                <RangeCalendar
                    bind:value
                    {isDateUnavailable}
                    {isDateDisabled}
                    locale="fr"
                    captionLayout="dropdown"
                    numberOfMonths={2} 
                />
            </Popover.Content>
        </Popover.Root>
    </div>
</div>
