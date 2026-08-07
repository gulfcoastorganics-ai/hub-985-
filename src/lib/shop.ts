/**
 * Storefront details. Single source of truth for every public page.
 *
 * There is no public email address for this location, so the Info section
 * deliberately has no email field - phone is the contact channel.
 */

export const SHOP = {
  name: "Hub 985 Nutrition",
  tagline: "Loaded teas, protein shakes, and coffee made fresh to order.",
  phone: "(985) 246-4225",
  address: {
    line1: "100 N Tyler St",
    city: "Covington",
    state: "LA",
    zip: "70433",
  },
  /** Listed Sunday-first to match Date#getDay() ordering. */
  hours: [
    { day: "Sunday", open: "10:00 AM", close: "2:00 PM" },
    { day: "Monday", open: "6:00 AM", close: "5:30 PM" },
    { day: "Tuesday", open: "6:00 AM", close: "5:30 PM" },
    { day: "Wednesday", open: "6:00 AM", close: "5:30 PM" },
    { day: "Thursday", open: "6:00 AM", close: "5:30 PM" },
    { day: "Friday", open: "6:00 AM", close: "5:30 PM" },
    { day: "Saturday", open: "8:00 AM", close: "3:00 PM" },
  ],
} as const;

/** Digits only, for tel: links. */
export function phoneHref(): string {
  return `tel:${SHOP.phone.replace(/[^\d]/g, "")}`;
}

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
