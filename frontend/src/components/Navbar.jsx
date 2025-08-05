import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (isActive) => `
    px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out relative
    ${isActive ? "text-white" : "text-gray-300 hover:text-white"}
    after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
    after:h-0.5 after:bg-amber-500 after:transition-all after:duration-300 after:ease-in-out
    ${
      isActive
        ? "after:w-4/5 after:opacity-100"
        : "after:w-0 after:opacity-0 hover:after:w-4/5 hover:after:opacity-100"
    }
  `;

  const mobileNavLinkClass = (isActive) => `
    block px-4 py-3 text-base font-medium transition-all duration-200 ease-in-out relative
    ${isActive ? "text-white" : "text-gray-300 hover:text-white"}
    after:content-[''] after:absolute after:bottom-2 after:left-4
    after:h-0.5 after:bg-amber-500 after:transition-all after:duration-300 after:ease-in-out
    ${
      isActive
        ? "after:w-8 after:opacity-100"
        : "after:w-0 after:opacity-0 hover:after:w-8 hover:after:opacity-100"
    }
  `;

  return (
    <nav
      className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
      ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700/30"
          : "bg-gray-900/90 backdrop-blur-sm"
      }
    `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center group focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg"
              aria-label="Home"
            >
              <div className="relative">
                <img
                  className="h-15 w-15 transition-transform duration-300 group-hover:scale-110"
                  src={logo}
                  alt="Cricket Club Logo"
                />
                <div className="absolute inset-0 bg-amber-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                CrickNex Club
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-baseline space-x-1">
              <Link
                to="/"
                className={navLinkClass(isActiveRoute("/"))}
                aria-current={isActiveRoute("/") ? "page" : undefined}
              >
                Home
              </Link>
              <Link
                to="/matches"
                className={navLinkClass(isActiveRoute("/matches"))}
                aria-current={isActiveRoute("/matches") ? "page" : undefined}
              >
                Matches
              </Link>
              <Link
                to="/players"
                className={navLinkClass(isActiveRoute("/players"))}
                aria-current={isActiveRoute("/players") ? "page" : undefined}
              >
                Players
              </Link>
              <Link
                to="/tournaments"
                className={navLinkClass(isActiveRoute("/tournaments"))}
                aria-current={
                  isActiveRoute("/tournaments") ? "page" : undefined
                }
              >
                Tournaments
              </Link>
              <Link
                to="/contact"
                className={navLinkClass(isActiveRoute("/contact"))}
                aria-current={isActiveRoute("/contact") ? "page" : undefined}
              >
                Contact
              </Link>
            </div>

            {/* Conditional rendering based on auth state */}
            {user ? (
              <div className="flex items-center space-x-2 ml-5">
                <Link
                  to="/profile"
                  className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  title="Profile"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="h-8 w-8 rounded-full border-2 border-gray-600 hover:border-amber-500 transition-all duration-300"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600 hover:border-amber-500 transition-all duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 pl-5 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 ease-in-out
                  bg-gray-800 hover:bg-gray-700 hover:shadow-md active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-5 py-2  rounded-lg text-sm font-medium text-white hover:text-white transition-all duration-200 ease-in-out
                bg-gray-700/60 border border-amber-400 hover:bg-gray-800 hover:shadow-md  active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <span className="sr-only">
                {isOpen ? "Close menu" : "Open menu"}
              </span>
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
        md:hidden transition-all duration-200 ease-in-out overflow-hidden
        ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
      `}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/30">
          <Link
            to="/"
            className={mobileNavLinkClass(isActiveRoute("/"))}
            aria-current={isActiveRoute("/") ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            to="/matches"
            className={mobileNavLinkClass(isActiveRoute("/matches"))}
            aria-current={isActiveRoute("/matches") ? "page" : undefined}
          >
            Matches
          </Link>
          <Link
            to="/players"
            className={mobileNavLinkClass(isActiveRoute("/players"))}
            aria-current={isActiveRoute("/players") ? "page" : undefined}
          >
            Players
          </Link>
          <Link
            to="/tournaments"
            className={mobileNavLinkClass(isActiveRoute("/tournaments"))}
            aria-current={isActiveRoute("/tournaments") ? "page" : undefined}
          >
            Tournaments
          </Link>
          <Link
            to="/contact"
            className={mobileNavLinkClass(isActiveRoute("/contact"))}
            aria-current={isActiveRoute("/contact") ? "page" : undefined}
          >
            Contact
          </Link>

          {/* Conditional rendering for mobile */}
          {user ? (
            <>
              <Link
                to="/profile"
                className={mobileNavLinkClass(isActiveRoute("/profile"))}
                aria-current={isActiveRoute("/profile") ? "page" : undefined}
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white transition-all duration-200 ease-in-out
                bg-gray-700 hover:bg-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-3 rounded-lg text-base font-medium bg-amber-700 text-white hover:bg-amber-800 transition-all duration-200 ease-in-out hover:shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
