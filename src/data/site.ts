/**
 * Brand + contact details. PLACEHOLDERS — replace with the owner's real
 * details; every component reads from here so nothing else needs editing.
 */
export const site = {
  name: 'Foodbekary',
  /** Wordmark split so the suffix can take the accent colour. */
  wordmark: { lead: 'Food', accent: 'bekary' },
  tagline: 'Baked fresh daily',
  description:
    'Handcrafted cakes, cookies, macarons and pastries baked fresh every morning in small batches.',
  currency: 'BDT',
  hours: { open: 8, close: 22, label: 'Daily 8:00 AM – 10:00 PM' },
  contact: {
    phone: '+880 1700-000000',
    whatsapp: '8801700000000',
    email: 'hello@foodbekary.example',
    address: 'Gulshan 2, Dhaka',
  },
  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
  },
} as const

export type Site = typeof site
