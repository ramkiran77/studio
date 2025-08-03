import { CheckCircle } from "lucide-react";
import OrderStatus from "./order-status";
import { Suspense } from "react";

function ConfirmationContent({ total }: { total: string | undefined }) {
    return (
        <>
            <CheckCircle className="h-16 w-16 text-primary" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Thank you for your order!
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Your order of <span className="font-semibold text-foreground">${total || "0.00"}</span> has been placed.
            </p>
            <p className="text-muted-foreground">
                You can track the status of your delivery below.
            </p>
            <div className="mt-8 w-full max-w-md">
                <OrderStatus />
            </div>
        </>
    );
}

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const total = searchParams?.total as string | undefined;

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <Suspense fallback={<div>Loading confirmation...</div>}>
            <ConfirmationContent total={total} />
        </Suspense>
    </main>
  );
}
