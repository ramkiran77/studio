"use client";

import { useEffect, useState, useTransition } from "react";
import { useCart, type CartItem } from "@/app/cart-provider";
import { getProductRecommendations } from "@/ai/flows/product-recommendations";
import { products } from "@/lib/products";
import { Button } from "./ui/button";
import { Wand2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

interface RecommendationsProps {
  cartItems: CartItem[];
}

export function Recommendations({ cartItems }: RecommendationsProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (cartItems.length > 0) {
      startTransition(async () => {
        const cartItemNames = cartItems.map((item) => item.name);
        try {
          const result = await getProductRecommendations({
            cartItems: cartItemNames,
          });
          setRecommendations(result.recommendedItems || []);
        } catch (error) {
          console.error("Failed to get recommendations:", error);
          setRecommendations([]);
        }
      });
    } else {
      setRecommendations([]);
    }
  }, [cartItems]);

  const recommendedProducts = recommendations
    .map((name) => products.find((p) => p.name === name))
    .filter(Boolean);

  if (isPending) {
    return (
      <div className="mt-6">
        <h3 className="flex items-center text-lg font-semibold">
          <Wand2 className="mr-2 h-5 w-5 text-primary" />
          You might also like...
        </h3>
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (recommendedProducts.length === 0) {
    return null;
  }

  const handleAddRecommendation = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="flex items-center text-lg font-semibold">
        <Wand2 className="mr-2 h-5 w-5 text-primary" />
        You might also like...
      </h3>
      <div className="mt-2 space-y-3">
        {recommendedProducts.map((product) =>
          product ? (
            <div key={product.id} className="flex items-center gap-4">
              <Image
                src={product.image}
                alt={product.name}
                width={64}
                height={64}
                className="rounded-md object-cover"
                data-ai-hint={product.dataAiHint}
              />
              <div className="flex-grow">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={() => handleAddRecommendation(product)}
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
