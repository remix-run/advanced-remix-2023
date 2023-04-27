import { type CartItem } from "@prisma/client";
import { type Product } from "./data";
import { json } from "@remix-run/node";

export function getCartQuantity(product: Product, cart: CartItem[]) {
  let lineItem = cart.find((item) => {
    return item.variantId === product.variants[0].id;
  });
  return lineItem?.quantity || 0;
}

export function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(amount);
}

export function badRequest(body?: string) {
  return json(body || "", {
    status: 400,
    statusText: "Bad Request",
  });
}

export function validate(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw badRequest(msg);
  }
}
