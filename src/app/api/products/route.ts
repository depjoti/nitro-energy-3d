import { getProducts } from "@/lib/products";

/** Product catalogue as JSON. Static, so it is prerendered at build time. */
export async function GET() {
  return Response.json(await getProducts());
}
