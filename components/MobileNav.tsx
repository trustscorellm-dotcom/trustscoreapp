"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { NAV_LINKS } from "@/utils/constants";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export function MobileNav({ open, onClose, user }: MobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          aria-label="Mobile"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden border-t border-border bg-background md:hidden"
        >
          <div className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth"
                    onClick={onClose}
                    className="rounded-md px-3 py-2 text-center text-sm font-medium text-foreground hover:bg-muted"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
