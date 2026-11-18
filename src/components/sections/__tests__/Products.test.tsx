import { render, screen, within } from "@testing-library/react";
import { Products } from "@/components/sections/Products";
import { products } from "@/lib/products";

describe("Products", () => {
  it("lists every flavour with its name and price", () => {
    render(<Products products={products} />);

    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(products.length);

    expect(screen.getByRole("heading", { name: "Nitro Green" })).toBeInTheDocument();
    expect(screen.getByText("12.00 $")).toBeInTheDocument();
  });

  it("gives each can a layout slot for the 3D scene", () => {
    const { container } = render(<Products products={products} />);
    const slots = container.querySelectorAll("[data-can-slot]");
    expect(slots).toHaveLength(products.length);
    // Only the non-featured cans get a scroll reveal; the featured can travels in.
    expect(container.querySelectorAll("[data-can-reveal]")).toHaveLength(products.length - 1);
  });
});
