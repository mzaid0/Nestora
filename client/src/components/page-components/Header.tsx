import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { clearUser } from "@/store/user/user-slice";
import {
  Bolt,
  Layers2,
  LogOut,
  Home,
  List,
  Users,
  Phone,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { IoMdSearch } from "react-icons/io";
import { Link } from "react-router-dom";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAppSelector((s) => s.user);
  const dispatch = useAppDispatch();

  const defaultAvatar = "/avatar-placeholder.png";

  const navLinks = user
    ? ([
        "Home",
        "Listings",
        "Agents",
        "Contact",
        "Favorites",
        "Dashboard",
      ] as const)
    : (["Home", "Listings", "Agents", "Contact"] as const);

  const navIcons = {
    Home: Home,
    Listings: List,
    Agents: Users,
    Contact: Phone,
    Favorites: Heart,
    Dashboard: LayoutDashboard,
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold uppercase text-red-700 hover:text-red-800 transition"
        >
          Nestora
        </Link>

        {/* Search (desktop only) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
          <IoMdSearch
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by city or zip"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700 transition"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {["Home", "Listings", "Agents", "Contact"].map((label) => (
            <Link
              key={label}
              to={`/${label.toLowerCase()}`}
              className="relative group text-gray-700 hover:text-red-700 transition"
            >
              {label}
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Open account menu"
                >
                  <img
                    src={user.avatar || defaultAvatar}
                    alt={user.username}
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-w-64">
                <DropdownMenuLabel className="flex items-start gap-3">
                  <img
                    src={user.avatar || defaultAvatar}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="shrink-0 rounded-full"
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                      {user.username}
                    </span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Bolt
                      size={16}
                      strokeWidth={2}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Layers2
                      size={16}
                      strokeWidth={2}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => dispatch(clearUser())}>
                  <LogOut
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                to="/signin"
                className="relative group text-gray-700 hover:text-red-700 transition"
              >
                Sign In
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiX size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <nav className="md:hidden bg-white shadow-inner">
          {/* Search bar */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="relative">
              <IoMdSearch
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by city or zip"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700 transition"
              />
            </div>
          </div>

          {/* User profile (logged-in only) */}
          {user && (
            <Link
              to="/profile"
              className="block px-4 py-3 border-b border-gray-200"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex items-center">
                <img
                  src={user.avatar || defaultAvatar}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </Link>
          )}

          {/* Navigation links */}
          {navLinks.map((label) => {
            const Icon = navIcons[label];
            return (
              <Link
                key={label}
                to={`/${label.toLowerCase()}`}
                className="flex items-center px-4 py-3 border-b border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setMobileOpen(false)}
              >
                {Icon && <Icon size={20} className="mr-2" />}
                {label}
              </Link>
            );
          })}

          {/* User options */}
          {user ? (
            <button
              onClick={() => {
                dispatch(clearUser());
                setMobileOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/signin"
                className="block px-4 py-3 border-b border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-3 border-b border-gray-200 bg-red-700 text-white hover:bg-red-800 transition"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
