import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        completed:
          "border-transparent bg-[rgb(var(--status-completed))] text-white hover:bg-[rgb(var(--status-completed),0.8)]",
        inprogress:
          "border-transparent bg-[rgb(var(--status-inprogress))] text-white hover:bg-[rgb(var(--status-inprogress),0.8)]",
        abandoned:
          "border-transparent bg-[rgb(var(--status-abandoned))] text-white hover:bg-[rgb(var(--status-abandoned),0.8)]",
        archived:
          "border-transparent bg-[rgb(var(--status-archived))] text-white hover:bg-[rgb(var(--status-archived),0.8)]",
        draft:
          "border-transparent bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300",
        average:
          "border-transparent bg-orange-100 text-orange-600 hover:bg-orange-200",
        bad: "border-transparent bg-red-100 text-red-600 hover:bg-red-200",
        well: "border-transparent bg-green-100 text-green-600 hover:bg-green-200",
        verywell:
          "border-transparent bg-green-200 text-green-700 hover:bg-green-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
