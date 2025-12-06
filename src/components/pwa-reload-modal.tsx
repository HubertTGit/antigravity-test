"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function PwaReloadModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      // Add event listeners to handle any of these events.
      wb.addEventListener("waiting", () => {
        console.log("Service Worker is waiting to activate.");
        setIsOpen(true);
      });

      wb.addEventListener("externalwaiting", () => {
        console.log("External Service Worker is waiting to activate.");
        setIsOpen(true);
      });
    }
  }, []);

  const handleReload = () => {
    // Assuming next-pwa and workbox are set up, we can just reload.
    // Ideally we should tell the SW to skipWaiting, but if auto-update is on (default),
    // a reload usually suffices to grab basic new assets if cache strategy allows,
    // OR we explicitly message properties.
    if (window.workbox) {
      window.workbox.messageSkipWaiting();

      // Listen for the controlling service worker to change
      // and reload the window to ensure the new service worker takes over immediately
      window.workbox.addEventListener("controlling", () => {
        window.location.reload();
      });
    }
    // Fallback reload if something fails or is simple
    window.location.reload();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>New Connection Available</AlertDialogTitle>
          <AlertDialogDescription>
            A new version of the app is available. Reload to update?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleReload}>Reload</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
