"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const statuses = [
  { name: "Order Placed", progress: 10 },
  { name: "Preparing", progress: 40 },
  { name: "Out for Delivery", progress: 75 },
  { name: "Delivered", progress: 100 },
];

export default function OrderStatus() {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatusIndex((prevIndex) => {
        if (prevIndex < statuses.length - 1) {
          return prevIndex + 1;
        }
        clearInterval(interval);
        return prevIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentProgress = statuses[currentStatusIndex].progress;
  const currentStatusText = statuses[currentStatusIndex].name;

  return (
    <div className="space-y-4">
      <div className="flex justify-between font-medium">
        <h2 className="text-lg">Order Status</h2>
        <p className="text-primary">{currentStatusText}</p>
      </div>
      <Progress value={currentProgress} className="h-3" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Placed</span>
        <span>Preparing</span>
        <span>On its way</span>
        <span>Delivered</span>
      </div>
    </div>
  );
}
