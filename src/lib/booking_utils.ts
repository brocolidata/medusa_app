// File: booking-utils.ts

import { 
    addDays, 
    isSunday, 
    startOfDay, 
    isSameDay, 
    getTime 
} from 'date-fns';
import { fr } from 'date-fns/locale';

// --- Order Interface Remains the Same ---
interface Order {
    caftan_code: string;
    customer_name: string;
    pickup_date: string | Date;
    dropoff_date: string | Date;
}

// DRY CLEANING CONSTANTS
const DRY_CLEANING_DAYS = 2;
// Use the ISO standard for 'fr' where the week starts on Monday (1) and ends on Sunday (0)
const LOCALE_OPTIONS = { locale: fr };

// NOTE: We no longer need normalizeDate or addDays as they are handled by date-fns.
// We also no longer need a custom isSunday, but we'll use date-fns's.

/**
 * Calculates the required non-Sunday cleaning days starting from the day *after* the dropoff.
 * * @param startDate The date to start counting from (e.g., day after dropoff).
 * @returns Array of Date objects representing the required working cleaning days.
 */
const getPostDropoffCleaningDates = (dropoffDate: Date): Date[] => {
    const cleaningDates: Date[] = [];
    let workingDaysCount = 0;
    // Start from the day immediately after dropoff
    let currentDate = addDays(dropoffDate, 1);

    while (workingDaysCount < DRY_CLEANING_DAYS) {
        // date-fns's isSunday relies on the system/locale's definition of the week,
        // but since JS Date always returns 0 for Sunday, this is safe.
        if (!isSunday(currentDate)) {
            cleaningDates.push(startOfDay(currentDate)); // Use startOfDay for normalization
            workingDaysCount++;
        }
        currentDate = addDays(currentDate, 1);
    }
    return cleaningDates;
};

/**
 * Calculates the required non-Sunday cleaning days starting from the day *before* the pickup.
 *
 * @param pickupDate The date to end counting backwards at (e.g., day of pickup).
 * @returns Array of Date objects representing the required working cleaning days.
 */
const getPrePickupCleaningDates = (pickupDate: Date): Date[] => {
    const cleaningDates: Date[] = [];
    let workingDaysCount = 0;
    // Start counting backwards from the day immediately BEFORE pickup
    let currentDate = addDays(pickupDate, -1);

    while (workingDaysCount < DRY_CLEANING_DAYS) {
        if (!isSunday(currentDate)) {
            cleaningDates.unshift(startOfDay(currentDate)); // Use unshift to keep chronological order
            workingDaysCount++;
        }
        currentDate = addDays(currentDate, -1);
    }
    return cleaningDates;
};


// --- Main Function (Simplified) ---

/**
 * Generates a list of unavailable dates based on existing bookings,
 * and 2 working days for both post-dropoff and pre-pickup cleaning.
 * * @param bookingsArray - Array of existing booking objects.
 * @returns An array of Date objects representing booked and dry cleaning days.
 */
export function getUnavailableBookingAndCleaningDates(bookingsArray: Order[]): Date[] {
    // Use a Set to store dates as milliseconds (timestamp) for uniqueness
    const unavailableTimestamps = new Set<number>();

    for (const order of bookingsArray) {
        // 1. Normalize dates from the order data
        const pickup = startOfDay(new Date(order.pickup_date));
        const dropoff = startOfDay(new Date(order.dropoff_date));

        // 2. Rule: Existing Booking Period (Inclusive)
        let currentDate = pickup;
        while (!isSameDay(currentDate, addDays(dropoff, 1))) {
            unavailableTimestamps.add(getTime(currentDate));
            currentDate = addDays(currentDate, 1);
        }

        // 3. Rule: Dry Cleaning Period (Post-Dropoff)
        const postDropoffCleaningDates = getPostDropoffCleaningDates(dropoff);
        for (const date of postDropoffCleaningDates) {
            unavailableTimestamps.add(getTime(date));
        }

        // 4. Rule: Dry Cleaning Period (Pre-Pickup)
        const prePickupCleaningDates = getPrePickupCleaningDates(pickup);
        for (const date of prePickupCleaningDates) {
            unavailableTimestamps.add(getTime(date));
        }
    }

    // Convert the unique timestamps back into Date objects and sort them
    return Array.from(unavailableTimestamps)
        .map(timestamp => new Date(timestamp))
        .sort((a, b) => a.getTime() - b.getTime());
}