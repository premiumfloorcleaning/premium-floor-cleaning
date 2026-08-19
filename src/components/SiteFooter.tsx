import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "./Icons";
import { media } from "@/lib/media";
import {
  serviceAreaList,
  serviceAreas,
  services,
  site,
  tagline,
} from "@/lib/site";
import styles from "./SiteFooter.module.css";

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/commercial", label: "Commercial" },
  { href: "/#about", label: "About us" },
  { href: "/#results", label: "Our results" },
  { href: "/#areas", label: "Areas we cover" },
  { href: "/#faq", label: "FAQs" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <Image
                src={media.brand.logoBadge}
                alt={site.name}
                width={300}
                height={304}
                className={styles.badge}
              />
              <span className={styles.brandName}>
                Premium Floor
                <br />
                Cleaning Services
              </span>
            </div>
            <p className={styles.about}>
              {tagline} Strip and seal, floor scrubbing and acid washing, tile
              and grout, carpet, pressure washing, windows and graffiti removal.
            </p>
            {/*
              Areas sit here as an inline row rather than a fifth column — five
              columns wrapped "Get in touch" onto a second line and doubled the
              footer's height.
            */}
            <p className={styles.areasLabel}>Areas we cover</p>
            <div className={styles.areas}>
              {serviceAreas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/areas/${area.slug}`}
                  className={styles.areaLink}
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className={styles.colTitle}>Services</p>
            <div className={styles.links}>
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className={styles.link}
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className={styles.colTitle}>Company</p>
            <div className={styles.links}>
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className={styles.colTitle}>Get in touch</p>
            <div className={styles.links}>
              <a href={site.phone.href} className={styles.link}>
                {site.phone.display}
              </a>
              <a
                href={`mailto:${site.email}`}
                className={`${styles.link} ${styles.breakAll}`}
              >
                {site.email}
              </a>
              <span>
                {site.address.street}, {site.address.locality}{" "}
                {site.address.postcode} {site.address.region}
              </span>
              <span>{site.hoursShort}</span>
            </div>
          </div>
        </div>

        <div className={styles.legal}>
          <span>© 2026 {site.name}. All rights reserved.</span>
          <span>{serviceAreaList}</span>
          {/* Social moved down here so no column runs taller than the rest. */}
          <div className={styles.social}>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              className={styles.socialLink}
            >
              <Facebook />
            </a>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className={styles.socialLink}
            >
              <Instagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
