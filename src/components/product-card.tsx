"use client";

import Image from "next/image";
import type { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/app/cart-provider";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
        <CardDescription className="mt-1 text-sm">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-lg font-semibold text-foreground">
          ${product.price.toFixed(2)}
        </p>
        <Button onClick={handleAddToCart}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
