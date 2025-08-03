"use client";

import { Leaf, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/app/cart-provider";
import { ShoppingCart } from "@/components/shopping-cart";

export function Header() {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground font-headline">
            Green Thumb Grocery
          </h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Open shopping cart</span>
              {itemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-2 text-primary-foreground"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
            <ShoppingCart />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
