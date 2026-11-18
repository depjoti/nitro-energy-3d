import { PageAnimations } from "@/components/animation/PageAnimations";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Products } from "@/components/sections/Products";
import { CanStageLoader } from "@/components/three/CanStageLoader";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Products products={products} />
      </main>
      <Footer />
      <CanStageLoader products={products} />
      <PageAnimations />
    </>
  );
}
