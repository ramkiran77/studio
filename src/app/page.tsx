import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { products, type Product } from "@/lib/products";
import { CartProvider } from "@/app/cart-provider";

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen w-full">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline mb-8">
            Fresh Picks for You
          </h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
