import { createCookieSessionStorage } from "@remix-run/node";

export type CartItem = {
  variantId: string;
  quantity: number;
};

let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["please use a process.env value here"],
  },
});

let cartSessionKey = "cart";

export async function getCart(request: Request) {
  let cookieHeader = request.headers.get("Cookie");
  let session = await sessionStorage.getSession(cookieHeader);
  let cart = JSON.parse(session.get(cartSessionKey) || "[]") as CartItem[];

  function setCart(cart: CartItem[]) {
    session.set(cartSessionKey, JSON.stringify(cart));
  }

  return {
    get items() {
      return cart;
    },

    async commit() {
      setCart(cart);
      return sessionStorage.commitSession(session);
    },

    add(variantId: string, quantity: number) {
      let added = false;
      for (let item of cart) {
        if (item.variantId === variantId) {
          item.quantity += quantity;
          added = true;
          break;
        }
      }
      if (!added) {
        cart.push({ variantId, quantity });
      }
      return cart;
    },

    update(variantId: string, quantity: number) {
      let updated = false;
      for (let item of cart) {
        if (item.variantId === variantId) {
          item.quantity = quantity;
          updated = true;
          break;
        }
      }
      if (!updated) {
        cart.push({ variantId, quantity });
      }
      return cart;
    },

    remove(variantId: string) {
      return cart.filter((item) => item.variantId !== variantId);
    },
  };
}
