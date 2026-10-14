import type { Product } from '../data/products'

/** What the customer actually pays per unit. */
export const unitPrice = (p: Pick<Product, 'price' | 'salePrice'>): number =>
  p.salePrice !== undefined && p.salePrice < p.price ? p.salePrice : p.price

export const isOnSale = (p: Pick<Product, 'price' | 'salePrice'>): boolean => unitPrice(p) < p.price

export const isSoldOut = (p: Pick<Product, 'stock'>): boolean => p.stock <= 0

/** Low-stock threshold for the "Only N left" hint. */
export const isLowStock = (p: Pick<Product, 'stock'>): boolean => p.stock > 0 && p.stock <= 3
