"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navigation, brand } from "@/app/lib/content";
import { cn } from "@/app/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const [menuState, setMenuState] = useState({ open: false, path: pathname });
  const isMenuOpen = menuState.open && menuState.path === pathname;
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setMenuState((prev) =>
      prev.open && prev.path === pathname
        ? { open: false, path: pathname }
        : { open: true, path: pathname }
    );
  };

  const closeMenu = () => setMenuState({ open: false, path: pathname });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuState({ open: false, path: pathname });
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isMenuOpen, pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-2" : "py-4"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          className={cn(
            "relative z-20 rounded-full px-4 sm:px-6 py-1 flex items-center justify-between transition-all duration-300",
            isScrolled 
              ? "glass-card shadow-lg" 
              : "glass-card-light"
          )}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center min-w-0 shrink-0 hover:opacity-80 transition-opacity"
            aria-label={`${brand.name} - Home`}
          >
            {brand.logoImage ? (
              <Image
                src={brand.logoImage}
                alt={brand.name}
                width={120}
                height={40}
                className="h-8 sm:h-12 w-auto"
                priority
              />
            ) : (
              <span className="font-serif text-xl sm:text-2xl font-bold text-charcoal dark:text-white hover:text-safety-orange transition-colors">
                {brand.name}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6 min-w-0">
            {navigation.main.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative group whitespace-nowrap",
                  pathname === link.href
                    ? "text-safety-orange"
                    : "text-charcoal/70 dark:text-white/70 hover:text-charcoal dark:hover:text-white"
                )}
              >
                {link.label}
                <span 
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-safety-orange transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <Link
              href="/contact"
              className="px-4 lg:px-5 py-2 bg-charcoal dark:bg-white text-white dark:text-charcoal text-sm font-medium rounded-full hover:bg-safety-orange dark:hover:bg-safety-orange dark:hover:text-white transition-colors"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <motion.span
                  className="w-full h-0.5 bg-current origin-center rounded-full"
                  animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 9 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-current rounded-full"
                  animate={{ opacity: isMenuOpen ? 0 : 1, scaleX: isMenuOpen ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-current origin-center rounded-full"
                  animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? -9 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              className="md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-0 bg-charcoal/20 dark:bg-black/40 backdrop-blur-sm"
                onClick={closeMenu}
              />
              
              {/* Menu Panel */}
              <div
                id="mobile-navigation"
                className="relative z-10 mt-4 glass-card rounded-3xl p-6 overflow-hidden"
              >
                <nav className="flex flex-col gap-2">
                  {navigation.main.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className={cn(
                          "block text-lg font-medium py-3 px-4 rounded-xl transition-colors",
                          pathname === link.href
                            ? "text-safety-orange bg-safety-orange/10"
                            : "text-charcoal/70 dark:text-white/70 hover:text-charcoal dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigation.main.length * 0.1 }}
                  >
                    <Link
                      href="/contact"
                      onClick={closeMenu}
                      className="block mt-4 px-6 py-3 bg-charcoal dark:bg-white text-white dark:text-charcoal text-center font-medium rounded-full hover:bg-safety-orange dark:hover:bg-safety-orange dark:hover:text-white transition-colors"
                    >
                      Get in Touch
                    </Link>
                  </motion.div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
