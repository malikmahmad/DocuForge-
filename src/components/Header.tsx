import React from "react";
import { FileText, Shield, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "FAQ", href: "#faq" },
    { name: "Privacy Policy", href: "#privacy" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={scrollToTop}>
            <div className="bg-navy-900 dark:bg-navy-700 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-navy-900 dark:text-white tracking-tight">
              Docu<span className="text-slate-400 dark:text-navy-600">Forge</span>
            </span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-navy-800 px-3 py-1 rounded-full border border-slate-200 dark:border-navy-700">
              <Shield className="w-3 h-3" />
              Secure
            </div>

            <button className="lg:hidden p-2 text-slate-600 dark:text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-700 p-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
