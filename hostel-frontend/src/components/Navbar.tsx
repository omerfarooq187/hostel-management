import { Link, useLocation } from "react-router-dom";
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
  StarIcon,
  HeartIcon,
  KeyIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export default function Navbar() {
  const { token, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const dropdownRef = useRef();
  const location = useLocation();
  
  // Check if we're on the home page (one-page layout)
  const isHomePage = location.pathname === "/";

  // Navigation items - different behavior for home page vs other pages
  const navItems = [
    { name: "Home", href: "/", section: "#home", icon: HomeIcon },
    { name: "About", href: isHomePage ? "#about" : "/#about", section: "#about", icon: InformationCircleIcon },
    { name: "Features", href: isHomePage ? "#features" : "/#features", section: "#features", icon: StarIcon },
    { name: "Rooms", href: isHomePage ? "#rooms" : "/#rooms", section: "#rooms", icon: BuildingOfficeIcon },
    { name: "Testimonials", href: isHomePage ? "#testimonials" : "/#testimonials", section: "#testimonials", icon: HeartIcon },
    { name: "Contact", href: isHomePage ? "#contact" : "/#contact", section: "#contact", icon: EnvelopeIcon },
  ];

  // Handle scroll effects (only on home page)
  useEffect(() => {
    if (!isHomePage) return;
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      
      // Update active section (only on home page)
      if (isHomePage) {
        const sections = navItems.map(item => item.section.substring(1));
        const current = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        if (current) setActiveSection(current);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle navigation based on current page
  const handleNavigation = (href, section) => {
    if (isHomePage) {
      // On home page, scroll to section
      const element = document.querySelector(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
      }
    } else {
      // On other pages, navigate to home page with hash
      if (href.startsWith('/#')) {
        // Store the target section to scroll to after navigation
        sessionStorage.setItem('scrollToSection', section);
        // Navigate to home page first
        window.location.href = href;
      } else {
        // Regular link navigation
        window.location.href = href;
      }
    }
  };

  // Reset scroll position when navigating back to home
  useEffect(() => {
    if (isHomePage) {
      const scrollToSection = sessionStorage.getItem('scrollToSection');
      if (scrollToSection) {
        const element = document.querySelector(scrollToSection);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
        sessionStorage.removeItem('scrollToSection');
      }
    }
  }, [isHomePage]);

  // On non-home pages, don't track scroll
  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true); // Always show solid navbar on other pages
    }
  }, [isHomePage]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        scrolled || !isHomePage
          ? "bg-white/95 backdrop-blur-lg shadow-sm py-3"
          : "bg-white/70 backdrop-blur-sm py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group transition-all duration-300"
          >
            <div className={`p-2.5 rounded-xl transition-all duration-300 ${
              scrolled || !isHomePage
                ? "bg-blue-600 text-white shadow-md"
                : "bg-blue-600 text-white shadow-sm"
            } group-hover:scale-105 group-hover:shadow-lg`}>
              <BuildingOfficeIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className={`text-lg font-semibold transition-colors duration-300 ${
                scrolled || !isHomePage ? "text-gray-800" : "text-gray-800"
              }`}>
                Officers Group of Hostels
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Premium Accommodation
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = isHomePage && activeSection === item.section.substring(1);
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.section)}
                  className={`relative px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className={`h-4 w-4 transition-all duration-200 ${
                      isActive ? 'scale-110' : ''
                    }`} />
                    <span>{item.name}</span>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div className="h-1 w-4 bg-blue-600 rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {token ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    scrolled || !isHomePage
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-blue-50 hover:bg-blue-100"
                  }`}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <UserCircleIcon className="h-5 w-5" />
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-medium text-gray-700">
                      {user?.name?.split(' ')[0] || "Account"}
                    </div>
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fadeIn z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || "user@hostel.com"}
                      </p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserCircleIcon className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors hidden md:inline-block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hidden md:inline-block"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2.5 rounded-lg transition-colors ${
                scrolled || !isHomePage
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-gray-600 hover:bg-gray-100"
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
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute right-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Menu Header */}
          <div className="p-6 bg-gradient-to-b from-blue-600 to-blue-500 text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {token ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{user?.name || "User"}</p>
                  <p className="text-sm opacity-90">{user?.email || "user@hostel.com"}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-medium">Welcome Guest</p>
                <p className="text-sm opacity-90">Login to access your account</p>
              </div>
            )}
          </div>
          
          {/* Menu Content */}
          <div className="h-[calc(100%-140px)] overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.section)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                    isHomePage && activeSection === item.section.substring(1)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </div>
            
            {token ? (
              <div className="mt-6 border-t border-gray-100 pt-4 px-3">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium mt-2"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-6 border-t border-gray-100 pt-4 px-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mb-2"
                >
                  <KeyIcon className="h-5 w-5" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium"
                >
                  <ShieldCheckIcon className="h-5 w-5" />
                  Register
                </Link>
              </div>
            )}
            
            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-gray-100 px-3">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <PhoneIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">info@officershostels.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPinIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">123 University Road</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}