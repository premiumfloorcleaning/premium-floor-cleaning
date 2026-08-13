"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Close, Menu, Phone } from "./Icons";
import { media } from "@/lib/media";
import { navLinks, site } from "@/lib/site";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand}>
          <Image
            src={media.brand.logoBadge}
            alt={site.name}
            width={300}
            height={304}
            priority
            className={styles.badge}
          />
          <span>
            <span className={styles.brandName}>{site.name}</span>
            <span className={styles.brandKicker}>{site.kicker}</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href={site.phone.href} className={styles.phone}>
            <Phone />
            {site.phone.display}
          </a>
          <Link href="/#contact" className={styles.quote}>
            Free quote
            <ArrowRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className={styles.menuButton}
        >
          {menuOpen ? <Close /> : <Menu />}
        </button>
      </div>

      {menuOpen ? (
        <nav className={styles.mobileNav} aria-label="Mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink}
            >
              {link.label}
            </Link>
          ))}

          {/*
            The desktop bar's two actions, repeated here — an open menu covers
            the sticky bottom bar, so without these the menu is a dead end for
            anyone who opened it wanting to get in touch.
          */}
          <div className={styles.mobileActions}>
            <a href={site.phone.href} className={styles.mobileCall}>
              <Phone size={16} />
              {site.phone.display}
            </a>
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className={styles.mobileQuote}
            >
              Free quote
              <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
