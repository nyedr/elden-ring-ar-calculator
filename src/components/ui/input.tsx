"use client";

import * as React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  isPrivateable?: boolean;
  containerClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, errorMessage, isPrivateable, containerClass, ...props },
    ref
  ) => {
    const [isPrivate, setIsPrivate] = useState(true);

    return (
      <div className={cn(containerClass, "relative peer")}>
        <input
          type={
            isPrivateable
              ? type === "password" && !isPrivate
                ? "text"
                : isPrivate
                ? "password"
                : type
              : type
          }
          className={cn(
            "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-[0.4rem] text-sm ring-offset-current duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium invalid:text-pink-600 invalid:ring-pink-500 focus:outline-none focus:invalid:ring-pink-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPrivateable && (
          <span className="absolute inset-y-0 grid w-10 end-0 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Hide</span>
              {isPrivate ? (
                <Eye
                  onClick={() => setIsPrivate((prev) => !prev)}
                  className="w-5 h-5"
                />
              ) : (
                <EyeOff
                  onClick={() => setIsPrivate((prev) => !prev)}
                  className="w-5 h-5"
                />
              )}
            </button>
          </span>
        )}
        {errorMessage && (
          <div className="text-pink-600 text-sm mt-1">{errorMessage}</div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
