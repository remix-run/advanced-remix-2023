import { json, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {
  useLoaderData,
  type FetcherWithComponents,
  useFetcher,
  useFetchers,
} from "@remix-run/react";

import { getCart } from "./cart.server";
import { type Product, fakeGetProducts } from "./data";
import { Icon } from "./icon";
import { ProductImage } from "./product-image";
import { Spinner } from "./spinner";
import { badRequest, formatPrice, getCartQuantity, validate } from "./utils";

export { ErrorBoundary } from "./boundary";

export async function loader({ request }: LoaderArgs) {
  let products = await fakeGetProducts();
  let cart = await getCart(request);
  let items = await cart.read();
  return json(
    { products, cart: items },
    { headers: { "Set-Cookie": await cart.commit() } }
  );
}

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let cart = await getCart(request);

  let id = formData.get("variantId");
  validate(typeof id === "string", "Missing variantId");

  switch (formData.get("intent")) {
    case "add": {
      await cart.add(id, 1);
      break;
    }

    case "update": {
      let quantity = formData.get("quantity");
      validate(typeof quantity === "string", "missing quantity");
      await cart.update(id, parseInt(quantity, 10));
      break;
    }

    default: {
      throw badRequest("No intent");
    }
  }

  return json(true, {
    headers: { "Set-Cookie": await cart.commit() },
  });
}

export default function Component() {
  let { products, cart } = useLoaderData<typeof loader>();

  return (
    <>
      <Cart />

      <div className="p-10">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={getCartQuantity(product, cart)}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

function ProductCard({
  product,
  cartQuantity,
}: {
  product: Product;
  cartQuantity: number;
}) {
  let fetcher = useFetcher();
  let variant = product.variants[0];

  let quantity = cartQuantity;
  if (fetcher.formData) {
    let intent = fetcher.formData.get("intent");
    if (intent === "add") {
      quantity = 1;
    } else if (intent === "update") {
      quantity = parseInt(fetcher.formData.get("quantity") as string, 10);
    }
  }

  let isBusy = fetcher.state != "idle";

  return (
    <li className="relative">
      <ProductImage product={product} />
      <div className="my-2 flex items-center justify-between">
        <div>
          <p className="block truncate font-medium text-gray-900">
            {product.title}
          </p>
          <div className="text-gray-700">
            {formatPrice(
              parseInt(variant.price.amount),
              variant.price.currencyCode
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Spinner hidden={!isBusy} />

          {quantity === 0 ? (
            <fetcher.Form method="post">
              <input type="hidden" name="variantId" value={variant.id} />
              <button
                aria-label="Add to bag"
                name="intent"
                value="add"
                className="flex items-center rounded-full bg-white  px-2.5 py-1 text-xs font-semibold uppercase text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <Icon id="bag" /> <Icon id="plus" />
              </button>
            </fetcher.Form>
          ) : (
            <QuantityPicker
              fetcher={fetcher}
              variantId={variant.id}
              quantity={quantity}
            />
          )}
        </div>
      </div>
      <p className="block text-sm font-light text-gray-500">
        {product.description}
      </p>
    </li>
  );
}

function QuantityPicker({
  variantId,
  quantity,
  fetcher,
}: {
  variantId: string;
  quantity: number;
  fetcher: FetcherWithComponents<typeof action>;
}) {
  return (
    <fetcher.Form
      method="post"
      className="flex justify-center rounded-md border p-1"
    >
      <input type="hidden" name="intent" value="update" />
      <input type="hidden" name="variantId" value={variantId} />

      <button
        aria-label="decrease quantity by 1"
        type="submit"
        name="quantity"
        value={quantity - 1}
      >
        <Icon id="minus" />
      </button>
      <input
        type="text"
        className="w-8 text-center text-pink-500"
        value={quantity}
        readOnly
      />
      <button
        aria-label="increase quantity by 1"
        type="submit"
        name="quantity"
        value={quantity + 1}
      >
        <Icon id="plus" />
      </button>
    </fetcher.Form>
  );
}

function Cart() {
  let { cart } = useLoaderData<typeof loader>();
  let cartMap = new Map(cart.map((i) => [i.variantId, i.quantity]));

  let fetchers = useFetchers();
  for (let f of fetchers) {
    if (f.formData) {
      let intent = f.formData.get("intent");
      let id = f.formData.get("variantId");
      if (typeof id !== "string") continue;

      if (intent === "add") {
        cartMap.set(id, 1);
      } else if (intent === "update") {
        let quantity = f.formData.get("quantity");
        if (typeof quantity !== "string") continue;
        cartMap.set(id, parseInt(quantity, 10));
      }
    }
  }

  let totalItems = 0;
  for (let [, qty] of cartMap) totalItems += qty;

  return (
    <div className="absolute right-10 top-10 flex items-center gap-1">
      <Icon id="bag" /> {totalItems}
    </div>
  );
}
