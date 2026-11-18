import { formatPrice, getFeaturedProduct, products, slotIdFor } from "@/lib/products";

describe("products catalogue", () => {
  it("has exactly one featured can, placed in the centre of the lineup", () => {
    const featured = products.filter((p) => p.featured);
    expect(featured).toHaveLength(1);
    expect(products.indexOf(featured[0])).toBe(Math.floor(products.length / 2));
  });

  it("uses unique ids", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });

  it("falls back to the first product when none is featured", () => {
    const list = products.map((p) => ({ ...p, featured: false }));
    expect(getFeaturedProduct(list)).toBe(list[0]);
  });
});

describe("formatPrice", () => {
  it("formats prices like the design (two decimals, trailing $)", () => {
    expect(formatPrice(10.58)).toBe("10.58 $");
    expect(formatPrice(12)).toBe("12.00 $");
  });
});

describe("slotIdFor", () => {
  it("prefixes the product id", () => {
    expect(slotIdFor({ id: "nitro-red" })).toBe("product-nitro-red");
  });
});
