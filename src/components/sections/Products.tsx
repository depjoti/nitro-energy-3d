import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

function tierFor(index: number, count: number) {
  const center = Math.floor(count / 2);
  const distance = Math.abs(index - center);
  return distance === 0 ? "featured" : distance === 1 ? "near" : "far";
}

export function Products({ products }: { products: Product[] }) {
  return (
    <section
      id="shop"
      data-can-section
      aria-labelledby="shop-title"
      className="bg-stage relative flex min-h-svh flex-col justify-center pt-28 pb-20 md:pt-32"
    >
      <h2 id="shop-title" className="sr-only">
        Our flavours
      </h2>
      <ul className="container-page grid grid-cols-2 gap-x-4 gap-y-14 md:flex md:items-end md:justify-between md:gap-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} tier={tierFor(i, products.length)} />
        ))}
      </ul>
    </section>
  );
}
