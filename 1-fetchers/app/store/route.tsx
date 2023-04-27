import { json, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useNavigation,
  type FetcherWithComponents,
  useFetcher,
  useFetchers,
} from "@remix-run/react";
import { type Product, fakeGetProducts } from "./data";
import { getCart } from "./cart.server";
import { useState } from "react";

export async function loader({ request }: LoaderArgs) {
  let products = fakeGetProducts();
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
      cart.add(id, 1);
      break;
    }

    case "update": {
      let formValue = formData.get("quantity");
      validate(typeof formValue === "string", "missing quantity");

      let n = parseInt(formValue, 10);
      validate(typeof n === "number", "bad quantity");

      cart.update(id, n);
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

export default function IndexRoute() {
  let { products, cart } = useLoaderData<typeof loader>();

  let getCartQuantity = (product: Product) =>
    cart.find((item) => item.variantId === product.variants[0].id)?.quantity ||
    0;

  return (
    <>
      <Cart />
      <div className="p-10">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={getCartQuantity(product)}
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
  let price = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: variant.price.currencyCode,
  }).format(Number.parseFloat(variant.price.amount));

  let images = product.variants.map((v) => v.image.url);

  let quantity = cartQuantity;

  let navigation = useNavigation();
  let isBusy = Boolean(navigation.formData?.get("variantId") === variant.id);

  return (
    <li className="relative">
      <ProductImage images={images} />
      <div className="my-2 flex items-center justify-between">
        <div>
          <p className="block truncate font-medium text-gray-900">
            {product.title}
          </p>
          <div className="text-gray-700">{price}</div>
        </div>

        <div className="flex items-center gap-1">
          <Spinner hidden={!isBusy} />

          {quantity === 0 ? (
            <Form method="post">
              <input type="hidden" name="variantId" value={variant.id} />
              <button
                aria-label="Add to bag"
                name="intent"
                value="add"
                className="flex items-center rounded-full bg-white  px-2.5 py-1 text-xs font-semibold uppercase text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <Icon id="bag" /> <Icon id="plus" />
              </button>
            </Form>
          ) : (
            <QuantityPicker quantity={quantity} variantId={variant.id} />
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
  quantity,
  variantId,
}: {
  quantity: number;
  variantId: string;
}) {
  return (
    <Form method="post" className="flex justify-center rounded-md border p-1">
      <input type="hidden" name="intent" value="update" />
      <input type="hidden" name="variantId" value={variantId} />
      <button
        aria-label="decrease quantity by 1"
        name="quantity"
        value={quantity - 1}
        type="submit"
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
        name="quantity"
        value={quantity + 1}
        type="submit"
      >
        <Icon id="plus" />
      </button>
    </Form>
  );
}

function Icon({ id }: { id: string }) {
  return (
    <svg className="h-4 w-4">
      <use href={`/sprite.svg#${id}`} />
    </svg>
  );
}

function ProductImage({ images }: { images: string[] }) {
  let [index, setIndex] = useState(0);

  return (
    <div
      onClick={() => {
        setIndex((index + 1) % images.length);
      }}
      className="aspect-h-10 aspect-w-10 group block w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
    >
      <img src={images[index]} alt="" className="object-cover" />
    </div>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-center">
        <div>
          <h2 className="font-bold">
            {error.status} | {error.statusText}
          </h2>
          <pre>{error.data}</pre>
        </div>
      </div>
    );
  }

  throw error;
}

function Spinner({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={[
        `h-full w-full animate-spin text-pink-600 transition-opacity`,
        hidden ? "opacity-0" : "opacit-100",
      ].join(" ")}
    >
      <Icon id="arrows" />
    </div>
  );
}

function Cart() {
  let { cart } = useLoaderData<typeof loader>();
  let cartMap = new Map(cart.map((i) => [i.variantId, i.quantity]));

  let totalItems = 0;
  for (let [, qty] of cartMap) totalItems += qty;

  return (
    <div className="absolute right-10 top-10 flex items-center gap-1">
      <Icon id="bag" /> {totalItems}
    </div>
  );
}

function badRequest(body?: string) {
  return json(body || "", {
    status: 400,
    statusText: "Bad Request",
  });
}

function validate(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw badRequest(msg);
  }
}
