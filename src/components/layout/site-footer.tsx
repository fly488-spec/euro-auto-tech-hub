import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Shop",
    links: [
      { to: "/categories", label: "Categories" },
      { to: "/brands", label: "Brands" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About us" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms & conditions" },
      { to: "/privacy", label: "Privacy policy" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <p className="font-display text-lg font-semibold">DIAGNOSTIQ</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            European supplier of automotive diagnostic equipment, ECU/TCU programming tools,
            licenses and accessories.
          </p>
          <p className="eyebrow">EUR · USD · RUB</p>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="space-y-3">
            <p className="eyebrow">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Diagnostiq. All rights reserved.</p>
          <p className="spec-value">Card payment · Bank transfer · VAT invoices</p>
        </div>
      </div>
    </footer>
  );
}
