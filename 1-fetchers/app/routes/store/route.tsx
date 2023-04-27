import { json, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {
  Form,
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
import { badRequest, formatPrice, getCartQuantity } from "./utils";

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
  let cart = await getCart(request);

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
  let variant = product.variants[0];
  let isBusy = false;

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
              parseFloat(variant.price.amount),
              variant.price.currencyCode
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Spinner hidden={!isBusy} />

          {cartQuantity === 0 ? (
            <Form method="post">
              <button
                aria-label="Add to bag"
                className="flex items-center rounded-full bg-white  px-2.5 py-1 text-xs font-semibold uppercase text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <Icon id="bag" /> <Icon id="plus" />
              </button>
            </Form>
          ) : (
            <QuantityPicker />
          )}
        </div>
      </div>
      <p className="block text-sm font-light text-gray-500">
        {product.description}
      </p>
    </li>
  );
}

function QuantityPicker() {
  let quantity = 0;
  return (
    <Form method="post" className="flex justify-center rounded-md border p-1">
      <button aria-label="decrease quantity by 1" type="submit">
        <Icon id="minus" />
      </button>
      <input
        type="text"
        className="w-8 text-center text-pink-500"
        value={quantity}
        readOnly
      />
      <button aria-label="increase quantity by 1" type="submit">
        <Icon id="plus" />
      </button>
    </Form>
  );
}

function Cart() {
  let { cart } = useLoaderData<typeof loader>();
  let cartMap = new Map(cart.map((i) => [i.variantId, i.quantity]));

  let totalItems = 0;
  for (let [, qty] of cartMap) {
    totalItems += qty;
  }

  return (
    <div className="absolute right-10 top-10 flex items-center gap-1">
      <Icon id="bag" /> {totalItems}
    </div>
  );
}
