import { useState } from "react";
import { type Product } from "./data";

export function ProductImage({ product }: { product: Product }) {
  let [index, setIndex] = useState(0);
  let images = product.variants.map((v) => v.image.url);

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
