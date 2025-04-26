import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";

const Header = () => {
  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
          {/* Left Section - Logo */}
          <Link
            to="/"
            className="text-2xl font-bold uppercase text-red-700 hover:text-red-700 transition-colors"
          >
            Nestora
          </Link>

          {/* Center Section - Search Bar */}
          <div className="flex-1 max-w-xl w-full md:mx-8 order-3 md:order-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <IoMdSearch size={20} />
              </span>
            </div>
          </div>

          {/* Right Section - Navigation Links */}
          <nav className="flex items-center gap-6 order-2 md:order-3">
            <Link
              to="/"
              className="text-red-700 hover:text-red-700 transition-colors font-medium group"
            >
              Home
              <span className="block h-0.5 bg-red-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>

            <Link
              to="/signin"
              className="text-red-700 hover:text-red-700 transition-colors font-medium group"
            >
              Sign In
              <span className="block h-0.5 bg-red-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
