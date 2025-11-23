import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";


export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur ">
      <div className="flex h-14 w-full items-center justify-end px-4">
        
        
          <nav className="flex items-center gap-2">
           
            <SignedIn>
              <UserButton />
            </SignedIn>
            
             <ThemeToggle />
          </nav>
       
      </div>
    </header>
  );
}
