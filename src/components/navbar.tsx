import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";


export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center justify-end px-4">
        
        
          <nav className="flex items-center gap-2">
           
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium hover:underline">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
             <ThemeToggle />
          </nav>
       
      </div>
    </header>
  );
}
