import { randomUUID } from "crypto";
import { createCookie } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

let CartCookie = createCookie("remix-cart", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secrets: ["please use a process.env value here"],
});

export async function getCart(request: Request) {
  let cartCookie = await getCartCookie(request);
  let sessionId = cartCookie.id;

  return {
    commit: cartCookie.commit,
    read() {
      return prisma.cartItem.findMany({ where: { sessionId } });
    },
    add: upsert,
    update: upsert,
    remove(variantId: string) {
      upsert(variantId, 0);
    },
  };

  async function upsert(variantId: string, quantity: number) {
    let id = sessionId + variantId;

    if (quantity <= 0) {
      return prisma.cartItem.deleteMany({ where: { id } });
    }

    return prisma.cartItem.upsert({
      where: { id },
      create: {
        id,
        sessionId,
        variantId,
        quantity,
      },
      update: { quantity },
    });
  }
}

export async function getCartCookie(request: Request) {
  let cookie = (await CartCookie.parse(request.headers.get("Cookie"))) || {};

  if (!cookie.id) {
    cookie.id = randomUUID();
  }

  let brownie = {
    id: cookie.id,

    async commit() {
      return await CartCookie.serialize(cookie);
    },
  };

  return brownie;
}
