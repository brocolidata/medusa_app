// import { writable } from 'svelte/store';
// import { browser } from '$app/environment'; // Use SvelteKit's built-in browser check

// const PREFIX = 'medusa_'; // A unique prefix for your new app

// /**
//  * Creates a Svelte writable store that automatically syncs with localStorage.
//  * @param {string} key The unique key for the store (without prefix).
//  * @param {any} initialValue The initial value if nothing is found in localStorage.
//  * @returns {import('svelte/store').Writable<any>} A writable store.
//  */
// export function localStorageStore(key, initialValue) {
//     const storageKey = `${PREFIX}${key}`;

//     let initialStoreValue = initialValue;

//     // 1. Load persisted value from localStorage only in the browser
//     if (browser) {
//         const fromStorage = localStorage.getItem(storageKey);
//         if (fromStorage !== null) {
//             try {
//                 // Attempt to parse the stored JSON
//                 initialStoreValue = JSON.parse(fromStorage);
//             } catch (e) {
//                 console.warn(`Failed to parse ${storageKey} from localStorage. Using initial value.`, e);
//                 // Optionally, clear the bad data:
//                 // localStorage.removeItem(storageKey); 
//             }
//         }
//     }

//     // Main writable store
//     const store = writable(initialStoreValue);

//     // 2. & 3. Subscribe to the store and sync to localStorage on change
//     if (browser) {
//         store.subscribe((value) => {
//             try {
//                 // Only save to localStorage if running in the browser
//                 localStorage.setItem(storageKey, JSON.stringify(value));
//             } catch (e) {
//                 console.error(`Failed to save ${storageKey} to localStorage.`, e);
//             }
//         });
//     }

//     // Note: The returned object is a standard Svelte Writable store
//     return store;
// }

// // Example usage in your stores files:
// // export const suits = localStorageStore('suits_data', []);
// // export const bookings = localStorageStore('bookings_list', {});


import { writable } from 'svelte/store';
import { browser } from '$app/environment';
// You already have date-fns imported in your components for formatting/logic.

const PREFIX = 'medusa_';

/**
 * Reviver function for JSON.parse to convert date-like strings back to Date objects.
 * @param {string} key
 * @param {any} value
 * @returns {any}
 */
function dateReviver(key, value) {
    // Only process strings
    if (typeof value === 'string') {
        // Simple check: is it an ISO-like string?
        // JSON.stringify always outputs this format: "YYYY-MM-DDTHH:mm:ss.sssZ"
        // We rely on the native Date constructor to parse it correctly.
        
        // This regex is slightly less strict than the previous one, 
        // covering common ISO-like date and datetime strings.
        const isDateString = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z?/.test(value);

        if (isDateString) {
            const date = new Date(value);
            // Check if it resulted in a valid Date object
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
    }
    // Return original value if it's not a parsable date string
    return value;
}

/**
 * Creates a Svelte writable store that automatically syncs with localStorage,
 * handling Date object conversion for persistence.
 * @param {string} key The unique key for the store (without prefix).
 * @param {any} initialValue The initial value if nothing is found in localStorage.
 * @returns {import('svelte/store').Writable<any>} A writable store.
 */
export function localStorageStore(key, initialValue) {
    const storageKey = `${PREFIX}${key}`;

    let initialStoreValue = initialValue;

    if (browser) {
        const fromStorage = localStorage.getItem(storageKey);
        if (fromStorage !== null) {
            try {
                // Use dateReviver here
                initialStoreValue = JSON.parse(fromStorage, dateReviver);
            } catch (e) {
                console.warn(`Failed to parse ${storageKey} from localStorage. Using initial value.`, e);
            }
        }
    }

    const store = writable(initialStoreValue);

    if (browser) {
        store.subscribe((value) => {
            try {
                // JSON.stringify automatically converts Date objects to ISO 8601 strings.
                localStorage.setItem(storageKey, JSON.stringify(value));
            } catch (e) {
                console.error(`Failed to save ${storageKey} to localStorage.`, e);
            }
        });
    }

    return store;
}