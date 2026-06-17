import { type User } from "#/features/authentication/types/user-types";
import React, { type FC, useState } from "react";

export interface AvatarProps {
  name: string;
  image: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ name, image, size = "md", className = "" }) => {
  console.log(image);
  // Méretek definiálása
  const sizeClasses = {
    xs: "h-5 w-5 text-[9px]",
    sm: "h-6 w-6 text-[10px]",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-lg",
  };

  // Monogram generálása a fallbackhez
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "";

  return (
    <div 
      className={`relative flex shrink-0 overflow-hidden rounded-full border bg-muted shadow-sm ${sizeClasses[size]} ${className}`}
    >
      {image ? (
        <img
          src={image || undefined}
          alt={name || "User avatar"}
          referrerPolicy="no-referrer" // <--- EZ KELL A GOOGLE KÉPHEZ
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-semibold bg-secondary text-secondary-foreground">
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;