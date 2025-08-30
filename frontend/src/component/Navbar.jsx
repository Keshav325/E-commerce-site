import React from "react";
import { Link, useResolvedPath } from "react-router-dom";
import { ShoppingCartIcon, ShoppingBagIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { pathname } = useResolvedPath();
  const isHomePage = pathname === "/";

  return (
    <div className="bg-base-100/60 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-6 min-h-[4.2rem] flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <ShoppingCartIcon className="size-9 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-bold font-mono tracking-widest text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary group-hover:opacity-80 transition-opacity">
              POSGRESTORE
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <ThemeSelector />

            {/* Cart (only on homepage) */}
            {isHomePage && (
              <Link to="/cart" className="indicator group">
                <div className="p-2 rounded-full hover:bg-base-200 transition-colors relative">
                  <ShoppingBagIcon className="size-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="badge badge-sm badge-primary indicator-item animate-bounce">
                    8
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
