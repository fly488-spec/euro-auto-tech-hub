import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/hooks/use-session";


const nav = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/brands", label: "Brands" },
  { to: "/about", label: "Company" },
  { to: "/contact", label: "Contact" },
] as const;

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[image:var(--gradient-signal)] font-display text-sm font-bold text-primary-foreground">
        D
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-base font-semibold tracking-tight">DIAGNOSTIQ</span>
        <span className="eyebrow text-[0.55rem]">ECU · TCU · Tuning</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session } = useSession();


  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Wordmark />

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-sm px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search products">
            <Search className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label={session ? "Account" : "Sign in"}>
            <Link to={session ? "/admin" : "/auth"}>
              <User className="size-4" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCart className="size-4" />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-surface">
              <div className="mt-10 flex flex-col gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-sm px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
                    activeProps={{ className: "text-foreground" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
