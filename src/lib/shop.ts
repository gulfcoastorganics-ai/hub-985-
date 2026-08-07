/**
 * Storefront details.
 *
 * PLACEHOLDERS - these were not available in the database or the brief.
 * Edit this file with the real hours, address, and contact info before launch;
 * every public page reads from here so there is exactly one place to change.
 */

export const SHOP = {
  name: "Hub 985",
  tagline: "Loaded teas, protein shakes, and coffee made fresh to order.",
  phone: "(985) 555-0198",
  email: "hello@hub985.com",
  address: {
    line1: "123 Main Street",
    city: "Houma",
    state: "LA",
    zip: "70360",
  },
  /** 0 = Sunday, matching Date#getDay(). */
  hours: [
    { day: "Sunday", open: "Closed", close: null },
    { day: "Monday", open: "6:30 AM", close: "6:00 PM" },
    { day: "Tuesday", open: "6:30 AM", close: "6:00 PM" },
    { day: "Wednesday", open: "6:30 AM", close: "6:00 PM" },
    { day: "Thursday", open: "6:30 AM", close: "6:00 PM" },
    { day: "Friday", open: "6:30 AM", close: "7:00 PM" },
    { day: "Saturday", open: "8:00 AM", close: "4:00 PM" },
  ],
} as const;

export function formattedAddress(): string {
  const { line1, city, state, zip } = SHOP.address;
  return `${line1}, ${city}, ${state} ${zip}`;
}

/** Google Maps embed URL - uses the plain query form, no API key required. */
export function mapEmbedUrl(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    formattedAddress(),
  )}&output=embed`;
}

export function mapLinkUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    formattedAddress(),
  )}`;
}
