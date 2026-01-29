import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  HomeIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { token, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef();

  // One-page navigation items (scroll to sections)
  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Rooms", href: "#rooms" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  // Handle scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false); // Close mobile menu
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          
          {/* Logo - Left Side */}
          <Link
            to="/"
            className="flex items-center space-x-3 group transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div
              className={`p-2 rounded-xl transition-all duration-300 ${
                scrolled
                  ? "bg-primary text-light-color"
                  : "bg-light-color/20 text-light-color"
              }`}
            >
              <BuildingOfficeIcon className="h-7 w-7" />
            </div>
            <div className="hidden sm:block">
              <h1
                className={`text-xl font-medium transition-all duration-300 ${
                  scrolled ? "text-heading-color" : "text-light-color"
                }`}
              >
                Officers Hostel
              </h1>
              <p
                className={`text-xs transition-all duration-300 ${
                  scrolled ? "text-meta-color" : "text-light-color/80"
                }`}
              >
                Premium Accommodation
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`px-5 py-2.5 rounded-btn transition-all duration-300 font-medium ${
                  scrolled
                    ? "text-foreground hover:text-primary hover:bg-primary-shade"
                    : "text-light-color hover:text-light-color hover:bg-light-color/20"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* User Actions - Right Side */}
          <div className="flex items-center space-x-4">
            {token ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-btn transition-all duration-300 font-medium ${
                    scrolled
                      ? "bg-primary hover:bg-dark-shade text-light-color"
                      : "bg-light-color/20 hover:bg-light-color/30 text-light-color backdrop-blur-sm"
                  }`}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <div className="text-left hidden sm:block">
                    <div className="text-sm">
                      {user?.name?.split(' ')[0] || "Account"}
                    </div>
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-border-color py-2 animate-fadeIn z-50">
                    <div className="px-4 py-3 border-b border-border-color">
                      <p className="font-medium text-heading-color">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-meta-color truncate">
                        {user?.email || "user@hostel.com"}
                      </p>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-primary-shade transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <BuildingOfficeIcon className="h-5 w-5 text-secondary" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-primary-shade transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserCircleIcon className="h-5 w-5 text-primary" />
                      <span>Profile Settings</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-border-color mt-1"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-6 py-2.5 rounded-btn font-medium transition-all duration-300 hidden sm:inline-block ${
                    scrolled
                      ? "bg-heading-color hover:bg-primary text-light-color"
                      : "bg-light-color/20 hover:bg-light-color/30 text-light-color backdrop-blur-sm"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-2.5 rounded-btn font-medium transition-all duration-300 hidden sm:inline-block ${
                    scrolled
                      ? "border-2 border-heading-color text-heading-color hover:bg-heading-color hover:text-light-color"
                      : "border-2 border-light-color text-light-color hover:bg-light-color hover:text-heading-color"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2.5 rounded-btn transition-all duration-300 ${
                scrolled
                  ? "bg-primary-shade hover:bg-primary hover:text-light-color text-primary"
                  : "bg-light-color/20 hover:bg-light-color/30 text-light-color backdrop-blur-sm"
              }`}
            >
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white border-t border-border-color shadow-xl transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-primary-shade rounded-btn transition-colors font-medium"
            >
              <span>{item.name}</span>
              <ChevronDownIcon className="h-4 w-4 rotate-90" />
            </button>
          ))}
          
          <div className="pt-6 mt-4 border-t border-border-color space-y-4">
            <div className="flex items-center space-x-3 text-foreground px-4">
              <PhoneIcon className="h-5 w-5 text-primary" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3 text-foreground px-4">
              <EnvelopeIcon className="h-5 w-5 text-primary" />
              <span className="text-sm">info@officershostel.com</span>
            </div>
            <div className="flex items-center space-x-3 text-foreground px-4">
              <MapPinIcon className="h-5 w-5 text-primary" />
              <span className="text-sm">123 University Road</span>
            </div>
          </div>
          
          {token ? (
            <>
              <div className="border-t border-border-color my-4"></div>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-primary-shade rounded-btn font-medium"
              >
                <BuildingOfficeIcon className="h-5 w-5 text-secondary" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-primary-shade rounded-btn font-medium"
              >
                <UserCircleIcon className="h-5 w-5 text-primary" />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-btn font-medium"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-border-color my-4"></div>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 bg-heading-color text-light-color rounded-btn hover:bg-primary transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 border-2 border-heading-color text-heading-color rounded-btn hover:bg-heading-color hover:text-light-color transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}