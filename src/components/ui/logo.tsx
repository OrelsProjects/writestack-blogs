"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const APP_NAME = "WriteStack";
const LOGO = "https://cdn.writestack.io/writestack-app/og/logo.png";

export interface LogoProps {
  height?: number;
  width?: number;
  textClassName?: string;
  className?: string;
  withText?: boolean;
  includeByOrel?: boolean;
  onClick?: () => void;
}

export default function Logo({
  height,
  width,
  className,
  textClassName,
  includeByOrel = false,
  withText = true,
  onClick,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} onClick={onClick}>
      <Image
        src={LOGO}
        alt={APP_NAME}
        width={width || 32}
        height={height || 32}
        quality={100}
        unoptimized={true}
      />
      {(withText || includeByOrel) && (
        <div className="flex flex-col gap-0.5">
          {withText && (
            <span
              className={cn(
                "text-base text-foreground font-semibold",
                textClassName
              )}
            >
              {APP_NAME}
            </span>
          )}
          {includeByOrel && (
            <span className="text-xs text-muted-foreground">
              By Orel Zilberman
            </span>
          )}
        </div>
      )}
    </div>
  );
}
