"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarIcon,
  Minus,
  Plus,
  Trash2,
  CreditCard,
  Truck,
  CalendarDays,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

import { useCart, type CartItem } from "@/app/cart-provider";
import { Button } from "@/components/ui/button";
import {
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Recommendations } from "@/components/recommendations";

const deliverySchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  address: z.string().min(5, "A valid address is required."),
  city: z.string().min(2, "City is required."),
  zipCode: z.string().regex(/^\d{5}$/, "Enter a valid 5-digit zip code."),
});

const scheduleSchema = z.object({
  deliveryDate: z.date({
    required_error: "A delivery date is required.",
  }),
  deliveryTime: z.string({
    required_error: "A delivery time is required.",
  }),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^(?:\d{4} ?){4}$/, "Enter a valid card number."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Enter MM/YY."),
  cvv: z.string().regex(/^\d{3,4}$/, "Enter a valid CVV."),
});

type CheckoutStep = "cart" | "delivery" | "schedule" | "payment";

export function ShoppingCart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    clearCart,
  } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<CheckoutStep>("cart");

  const deliveryForm = useForm<z.infer<typeof deliverySchema>>({
    resolver: zodResolver(deliverySchema),
    defaultValues: { fullName: "", address: "", city: "", zipCode: "" },
  });
  const scheduleForm = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
  });
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { cardNumber: "", expiryDate: "", cvv: "" },
  });

  const deliveryFee = 5.99;
  const finalTotal = totalPrice + deliveryFee;

  const handlePlaceOrder = () => {
    // In a real app, you would process the payment here.
    clearCart();
    router.push(`/order-confirmation?total=${finalTotal.toFixed(2)}`);
  };

  const deliverySubmit = () => setStep("schedule");
  const scheduleSubmit = () => setStep("payment");

  const renderCart = () => (
    <>
      <SheetHeader>
        <SheetTitle className="font-headline text-2xl">Your Cart</SheetTitle>
        <SheetDescription>
          Review your items and proceed to checkout.
        </SheetDescription>
      </SheetHeader>
      <ScrollArea className="flex-grow">
        <div className="pr-6">
          {cart.length > 0 ? (
            cart.map((item: CartItem) => (
              <div key={item.id} className="flex items-center gap-4 py-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                  data-ai-hint={item.dataAiHint}
                />
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="py-16 text-center text-muted-foreground">
              Your cart is empty.
            </p>
          )}
          {cart.length > 0 && <Recommendations cartItems={cart} />}
        </div>
      </ScrollArea>
      {cart.length > 0 && (
        <SheetFooter className="mt-auto flex-col space-y-4 pt-4 pr-6">
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Button
            size="lg"
            className="w-full"
            onClick={() => setStep("delivery")}
          >
            Checkout
          </Button>
        </SheetFooter>
      )}
    </>
  );

  const renderCheckout = () => (
    <>
      <SheetHeader>
        <SheetTitle className="font-headline text-2xl">Checkout</SheetTitle>
        <SheetDescription>
          Complete your order in just a few steps.
        </SheetDescription>
      </SheetHeader>
      <Tabs
        value={step}
        onValueChange={(value) => setStep(value as CheckoutStep)}
        className="flex-grow flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="delivery">
            <Truck className="mr-2 h-4 w-4" /> Delivery
          </TabsTrigger>
          <TabsTrigger value="schedule" disabled={!deliveryForm.formState.isValid}>
            <CalendarDays className="mr-2 h-4 w-4" /> Schedule
          </TabsTrigger>
          <TabsTrigger value="payment" disabled={!scheduleForm.formState.isValid}>
            <CreditCard className="mr-2 h-4 w-4" /> Payment
          </TabsTrigger>
        </TabsList>
        <div className="flex-grow overflow-auto pr-6">
          <TabsContent value="delivery" className="mt-4">
            <Form {...deliveryForm}>
              <form
                onSubmit={deliveryForm.handleSubmit(deliverySubmit)}
                className="space-y-4"
              >
                <FormField
                  control={deliveryForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={deliveryForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Green St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={deliveryForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Farmville" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={deliveryForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <Button type="submit" className="w-full">
                    Next: Schedule
                  </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="schedule" className="mt-4">
            <Form {...scheduleForm}>
              <form
                onSubmit={scheduleForm.handleSubmit(scheduleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={scheduleForm.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Delivery Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={scheduleForm.control}
                    name="deliveryTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="9am-11am">9:00 AM - 11:00 AM</SelectItem>
                            <SelectItem value="11am-1pm">11:00 AM - 1:00 PM</SelectItem>
                            <SelectItem value="1pm-3pm">1:00 PM - 3:00 PM</SelectItem>
                            <SelectItem value="3pm-5pm">3:00 PM - 5:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Next: Payment</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="payment" className="mt-4">
          <Form {...paymentForm}>
              <form
                onSubmit={paymentForm.handleSubmit(handlePlaceOrder)}
                className="space-y-4"
              >
                 <FormField
                  control={paymentForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="XXXX XXXX XXXX XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={paymentForm.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Expiry (MM/YY)</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <Button type="submit" className="w-full" size="lg">
                    Place Order - ${finalTotal.toFixed(2)}
                  </Button>
              </form>
            </Form>
          </TabsContent>
        </div>
      </Tabs>
      <SheetFooter className="mt-auto flex-col space-y-2 pt-4 pr-6">
        <Separator />
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
        <Button variant="outline" className="w-full" onClick={() => setStep("cart")}>
          Back to Cart
        </Button>
      </SheetFooter>
    </>
  );

  return step === "cart" ? renderCart() : renderCheckout();
}
