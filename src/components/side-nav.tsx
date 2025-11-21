"use client";

import { useState } from "react";
import { Home, Settings, Users, BarChart2, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Mail, label: "Messages", href: "/messages" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function SideNav() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-background border-r transition-all duration-300 ease-in-out z-40",
        isHovered ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center h-16 border-b">
        <span className={cn("font-bold text-xl transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0 hidden")}>
          MyApp
        </span>
        <span className={cn("font-bold text-xl transition-opacity duration-300", isHovered ? "opacity-0 hidden" : "opacity-100")}>
          M
        </span>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
              isHovered ? "justify-start" : "justify-center"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span
              className={cn(
                "ml-4 whitespace-nowrap transition-all duration-300 overflow-hidden",
                isHovered ? "w-auto opacity-100" : "w-0 opacity-0"
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
