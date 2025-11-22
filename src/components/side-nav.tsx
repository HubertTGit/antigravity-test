"use client";

import { Home, Settings, Users, BarChart2, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Mail, label: "Messages", href: "/messages" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-16 bg-background border-r z-40">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="font-bold text-xl">M</span>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-2 items-center">
        <TooltipProvider>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </div>
  );
}
