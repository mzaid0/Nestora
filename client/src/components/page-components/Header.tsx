import { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { useAppSelector, useAppDispatch } from "@/hooks/redux-hooks";
import { clearUser } from "@/store/user/user-slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LayoutDashboard, LogOut } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAppSelector((s) => s.user);
  const dispatch = useAppDispatch();

  const defaultAvatar = "/avatar-placeholder.png";

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
              <span
                className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-red-700
                               transform scale-x-0 group-hover:scale-x-100
                               transition-transform origin-left"
              />
            </Link>
          ))}

          {user ? (
            // Profile hover-dropdown
            <div className="relative group">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              {/* Dropdown */}
              <div
                className="
      absolute right-0 mt-2 w-48 text-sm
      bg-white rounded-lg shadow-xl
      divide-y divide-gray-100
      opacity-0 group-hover:opacity-100
      translate-y-2 group-hover:translate-y-0
      transform transition-all duration-200
      z-50
    "
              >
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  <User className="w-5 h-5 mr-2 text-gray-500" />
                  Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  <LayoutDashboard className="w-5 h-5 mr-2 text-gray-500" />
                  Dashboard
                </Link>
                <button
                  onClick={() => dispatch(clearUser())}
                  className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  <LogOut className="w-5 h-5 mr-2 text-gray-500" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/signin"
                className="relative group text-gray-700 hover:text-red-700 transition"
              >
                Sign In
                <span
                  className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-red-700
                                 transform scale-x-0 group-hover:scale-x-100
                                 transition-transform origin-left"
                />
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
          {["Home", "Listings", "Agents", "Contact"].map((label) => (
            <Link
              key={label}
              to={`/${label.toLowerCase()}`}
              className="block px-4 py-3 border-b border-gray-200 text-gray-700 hover:bg-gray-100 transition"
            >
              {label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to="/favorites"
                className="block px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition"
              >
                Favorites
              </Link>
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <img
                  src={user.avatar || defaultAvatar}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover mr-2 border-2 border-red-700"
                />
                Profile
              </Link>
              <button
                onClick={() => dispatch(clearUser())}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="block px-4 py-3 border-b border-gray-200 text-gray-700 hover:bg-gray-100 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-3 border-b border-gray-200 bg-red-700 text-white hover:bg-red-800 transition"
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
