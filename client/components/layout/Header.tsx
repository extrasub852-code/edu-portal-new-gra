import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "How to Use" },
  { to: "/contact", label: "Contact Us" },
  { to: "/use-case-finder", label: "Use Case Finder" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { loggedIn, user, logout, login } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#003057]/15 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-[#003057]">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#003057]">
            <span className="text-sm font-extrabold tracking-tight text-[#B3A369]">EP</span>
          </div>
          <span className="text-lg font-extrabold">EduPortal</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-4 py-2 text-sm font-semibold text-[#003057] transition-colors hover:bg-[#003057]/5",
                  isActive &&
                    "bg-[#003057]/5 text-[#003057] ring-1 ring-[#B3A369]/50",
                  pathname === "/use-case-finder" && item.to === "/use-case-finder" &&
                    "bg-[#003057]/5 text-[#003057] ring-1 ring-[#B3A369]/50",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <>
              <span className="text-sm text-[#003057]/80">{user}</span>
              <button
                onClick={() => logout()}
                className="rounded-md bg-[#003057] px-4 py-2 text-sm font-semibold text-[#B3A369] transition-colors hover:bg-[#003057]/90"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => login(pathname === "/login" ? "/" : pathname)}
              className="rounded-md bg-[#B3A369] px-4 py-2 text-sm font-semibold text-[#003057] shadow-sm transition-colors hover:bg-[#a4945c]"
            >
              Login with GT SSO
            </button>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-[#003057] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <Menu />
        </button>
      </div>
      {open && (
        <div className="border-t border-[#003057]/10 md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2 text-sm font-semibold text-[#003057] hover:bg-[#003057]/5",
                      isActive && "bg-[#003057]/5 ring-1 ring-[#B3A369]/50",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              {loggedIn ? (
                <>
                  <span className="text-sm text-[#003057]/80">{user}</span>
                  <button
                    onClick={() => logout()}
                    className="rounded-md bg-[#003057] px-3 py-2 text-sm font-semibold text-[#B3A369]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    login(pathname === "/login" ? "/" : pathname);
                  }}
                  className="rounded-md bg-[#B3A369] px-3 py-2 text-sm font-semibold text-[#003057]"
                >
                  Login with GT SSO
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
