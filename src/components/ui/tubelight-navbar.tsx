"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface NavBarProps {
  items: NavItem[];
  className?: string;
  initialActive?: string;
}

function getActiveItem(items: NavItem[]) {
  if (typeof window === "undefined") return items[0]?.name ?? "";

  const { hash, pathname } = window.location;
  const exactHashMatch = items.find((item) => {
    const destination = new URL(item.url, window.location.origin);
    return destination.pathname === pathname && destination.hash === hash && Boolean(hash);
  });

  if (exactHashMatch) return exactHashMatch.name;

  const pathMatch = items.find((item) => {
    const destination = new URL(item.url, window.location.origin);
    if (destination.hash) return false;
    if (destination.pathname === "/") return pathname === "/";
    return pathname.startsWith(destination.pathname);
  });

  return pathMatch?.name ?? items[0]?.name ?? "";
}

export function NavBar({ items, className, initialActive }: NavBarProps) {
  const fallbackActive = items.some((item) => item.name === initialActive)
    ? initialActive ?? ""
    : items[0]?.name ?? "";
  const [activeTab, setActiveTab] = useState(fallbackActive);

  const syncActiveTab = useCallback(() => {
    setActiveTab(getActiveItem(items));
  }, [items]);

  useEffect(() => {
    syncActiveTab();
    window.addEventListener("hashchange", syncActiveTab);
    window.addEventListener("popstate", syncActiveTab);
    document.addEventListener("astro:page-load", syncActiveTab);

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const pathname = window.location.pathname;
      if (pathname !== "/" && pathname !== "/index.html") return;

      const sections = [
        { id: "about", name: "About" },
        { id: "work", name: "Projects" },
        { id: "contact", name: "Contact" },
      ];

      const elements = sections
        .map((s) => ({ ...s, el: document.getElementById(s.id) }))
        .filter((s): s is { id: string; name: string; el: HTMLElement } => s.el !== null);

      if (elements.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          if (window.scrollY < 250) {
            setActiveTab("Home");
            return;
          }

          const visible = entries.find((entry) => entry.isIntersecting);
          if (visible) {
            const matched = elements.find((s) => s.el === visible.target);
            if (matched) {
              setActiveTab(matched.name);
            }
          }
        },
        { rootMargin: "-20% 0px -40% 0px", threshold: 0.1 }
      );

      elements.forEach((s) => observer?.observe(s.el));
    };

    const handleScroll = () => {
      const pathname = window.location.pathname;
      if ((pathname === "/" || pathname === "/index.html") && window.scrollY < 200) {
        setActiveTab("Home");
      }
    };

    setupObserver();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", syncActiveTab);
      window.removeEventListener("popstate", syncActiveTab);
      document.removeEventListener("astro:page-load", syncActiveTab);
    };
  }, [syncActiveTab]);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 z-50 mb-6 -translate-x-1/2 sm:top-0 sm:bottom-auto sm:mb-0 sm:pt-6",
        className,
      )}
    >
      <nav
        aria-label="Primary navigation"
        data-liquid-glass="nav"
        className="flex items-center gap-1 rounded-full border border-border bg-background/70 p-1 shadow-2xl shadow-black/10 backdrop-blur-xl sm:gap-2"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          const isDocument = /\.(?:pdf|docx?)$/i.test(item.url);

          return (
            <a
              key={item.name}
              href={item.url}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.name}
              data-astro-reload={isDocument ? "" : undefined}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-5 sm:py-2",
                isActive && "text-primary",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden" aria-hidden="true">
                <Icon size={18} strokeWidth={2.25} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 -z-10 w-full rounded-full bg-primary/8"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-primary">
                    <div className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-primary/20 blur-md" />
                    <div className="absolute -top-1 h-6 w-8 rounded-full bg-primary/20 blur-md" />
                    <div className="absolute top-0 left-2 h-4 w-4 rounded-full bg-primary/20 blur-sm" />
                  </div>
                </motion.div>
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
