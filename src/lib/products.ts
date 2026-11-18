export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  /** Accent colour used for the can label glow and UI highlights. */
  color: string;
  /** The featured can is the hero can that travels through the page. */
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "nitro-orange",
    name: "Nitro Orange",
    tagline: "High intensity",
    price: 10.58,
    color: "#ff9f1c",
  },
  {
    id: "nitro-red",
    name: "Nitro Red",
    tagline: "High intensity",
    price: 11,
    color: "#ff3b3b",
  },
  {
    id: "nitro-green",
    name: "Nitro Green",
    tagline: "High intensity",
    price: 12,
    color: "#e0e600",
    featured: true,
  },
  {
    id: "nitro-sky",
    name: "Nitro Sky",
    tagline: "High intensity",
    price: 11,
    color: "#2fd4ff",
  },
  {
    id: "nitro-blue",
    name: "Nitro Blue",
    tagline: "High intensity",
    price: 10.58,
    color: "#5b63ff",
  },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export function getFeaturedProduct(list: Product[] = products): Product {
  return list.find((p) => p.featured) ?? list[0];
}

export function formatPrice(value: number): string {
  return `${value.toFixed(2)} $`;
}

export function slotIdFor(product: Pick<Product, "id">): string {
  return `product-${product.id}`;
}
