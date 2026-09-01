import * as React from "react";

import { cn } from "@/shared/lib/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea =
  React.forwardRef<
    HTMLTextAreaElement,
    TextareaProps
  >(
    (
      { className, ...props },
      ref
    ) => {
      return (
        <textarea
          ref={ref}
          className={cn(
            `
            flex
            min-h-[100px]
            w-full
            rounded-2xl
            border
            border-gray-200
            bg-white
            px-4
            py-3
            text-sm
            text-black
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
            disabled:cursor-not-allowed
            disabled:opacity-50
          `,
            className
          )}
          {...props}
        />
      );
    }
  );

Textarea.displayName =
  "Textarea";

export { Textarea };