import React, { useState } from "react";
import {
  Plane,
  Compass,
  Home,
  Search,
  Mail,
  Menu,
  X,
  Luggage,
  BedDouble,
} from "lucide-react";

const navigationItems = [
  {
    href: "#",
    icon: <Luggage className="h-5 w-5" />,
    label: "Travel",
  },
  {
    href: "#",
    icon: <Compass className="h-5 w-5" />,
    label: "Explore",
  },
  {
    href: "#",
    icon: <Plane className="h-5 w-5" />,
    label: "Flights",
  },
  {
    href: "#",
    icon: <BedDouble className="h-5 w-5" />,
    label: "Hotels",
  },
  {
    href: "#",
    icon: <Home className="h-5 w-5" />,
    label: "Holiday Rentals",
  },
];

const NavItem = ({ href, icon, label }) => (
  <a
    href={href}
    className="flex text-sm font-medium items-center space-x-2 text-gray-700 border rounded-full py-2 px-3 hover:text-blue-600 hover:border-blue-500 transition-colors duration-200"
  >
    {React.cloneElement(icon, { className: "h-5 w-5 text-blue-500" })}
    <span>{label}</span>
  </a>
);

const ActionButton = ({ icon }) => (
  <button className="text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200">
    {icon}
  </button>
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200 font-noto">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden mr-4 text-gray-700 hover:bg-gray-100 p-2 rounded-full"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <img
            src="/google.png"
            alt="Google Flights"
            className="h-8 mr-4 shrink-0"
          />

          <nav className="hidden lg:flex space-x-3">
            {navigationItems.map((item) => (
              <NavItem
                key={item.label}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <ActionButton icon={<Search className="h-6 w-6 text-blue-500" />} />
            <ActionButton icon={<Mail className="h-6 w-6 text-blue-500" />} />
          </div>
          <button className="bg-blue-500 text-base text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200">
            Sign in
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg">
          <nav className="flex flex-col">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-2 text-gray-700 px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
              >
                {React.cloneElement(item.icon, {
                  className: "h-5 w-5 text-blue-500",
                })}
                <span>{item.label}</span>
              </a>
            ))}
            <div className="md:hidden flex items-center space-x-4 px-4 py-3 border-t">
              <ActionButton
                icon={<Search className="h-6 w-6 text-blue-500" />}
              />
              <ActionButton icon={<Mail className="h-6 w-6 text-blue-500" />} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
