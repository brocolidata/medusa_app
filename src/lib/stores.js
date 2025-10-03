import { get } from 'svelte/store';
import { localStorageStore } from "$lib/localStorage_stores";

export const ordersIndex = localStorageStore('ordersIndex', []);
export const caftansIndex = localStorageStore('caftansIndex', []);

export function getUniqueProductCodes() {
    const caftansArray = get(caftansIndex);
    if (!Array.isArray(caftansArray)) {
        console.error("Input must be an array.");
        return [];
    }

    // 1. Use map to pull out all product_code values.
    const caftanCodes = caftansArray.map(caftan => caftan.caftan_code);

    // 2. Use a Set to filter out duplicates, then spread back into an array.
    const uniqueCodes = [...new Set(caftanCodes)];

    return uniqueCodes;
}

export function createCaftan(caftan) {
  caftansIndex.update((currentCaftans) => {
    // Check if the dashboard already exists (e.g., by name) to avoid duplicates
    if (currentCaftans.some(c => c.caftan_code === caftan.caftan_code)) {
      console.warn(`Caftan with code "${caftan.caftan_code}" already exists.`);
      return currentCaftans;
    }
    // Add the new dashboard to the list
    return [...currentCaftans, caftan];
  });
}

export function batchCreateCaftans(newCaftans) {
  caftansIndex.update(currentData => {
      // Create a new array that combines the existing data and the new data
      return [...currentData, ...newCaftans];
  });
}

export function deleteCaftans(codesToDelete) {
    caftansIndex.update(currentCaftans => {
        // Return a new array that includes items whose code is NOT in the list of codesToDelete.
        const updatedCaftans = currentCaftans.filter(caftan => 
            !codesToDelete.includes(caftan.caftan_code)
        );        
        return updatedCaftans;
    });
}

export function createBooking(booking) {
  ordersIndex.update((currentOrders) => {
    // Check if the dashboard already exists (e.g., by name) to avoid duplicates
    // if (currentOrders.some(o => o.caftan_code === caftan.caftan_code)) {
    //   console.warn(`Caftan with code "${caftan.caftan_code}" already exists.`);
    //   return currentCaftans;
    // }
    // Add the new dashboard to the list
    return [...currentOrders, booking];
  });
}

export function getBookingsForCaftan(caftan_code) {
  const orders = get(ordersIndex);
  return orders.filter((order) => order.caftan_code === caftan_code) || [];
}

export function deleteBookings(IDsToDelete) {
    ordersIndex.update(currentOrders => {
        // Return a new array that includes items whose code is NOT in the list of IDsToDelete.
        const updatedOrders = currentOrders.filter(booking => 
            !IDsToDelete.includes(booking.booking_id)
        );        
        return updatedOrders;
    });
}

export function getCaftanCodeOptions() {
    const caftansArray = get(caftansIndex);
    return caftansArray.map((caftan) => ({
        label: caftan.caftan_code,
        value: caftan.caftan_code,
    }));
}

