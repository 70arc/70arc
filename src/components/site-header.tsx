"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { publishedProducts } from "@content/products";
import { site } from "@content/site";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { StatusPill } from "@/components/status-pill";
import styles from "./site-header.module.css";

function pageCurrent(pathname: string, href: string) {
  return pathname === href ? "page" : undefined;
}

export function SiteHeader() {
  const pathname = usePathname();
  const products = publishedProducts();
  const headerRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const productsButtonRef = useRef<HTMLButtonElement>(null);
  const returnMenuFocus = useRef(false);
  const [path, setPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  if (path !== pathname) {
    setPath(pathname);
    setMenu(false);
    setProductsOpen(false);
  }

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const next = window.scrollY > 0;
      setScrolled((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenu(false);
      else setProductsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-scroll-lock", menu);
    return () => document.documentElement.removeAttribute("data-scroll-lock");
  }, [menu]);

  useEffect(() => {
    if (!menu) {
      if (returnMenuFocus.current) {
        returnMenuFocus.current = false;
        menuButtonRef.current?.focus();
      }
      return;
    }
    sheetRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    const root = headerRef.current;
    if (!root) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        returnMenuFocus.current = true;
        setMenu(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter(
        (node) => node.getClientRects().length > 0,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !root.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (root.contains(event.target)) return;
      returnMenuFocus.current = true;
      setMenu(false);
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [menu]);

  useEffect(() => {
    if (!productsOpen) return;
    const root = headerRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setProductsOpen(false);
      productsButtonRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || root?.contains(event.target)) return;
      setProductsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [productsOpen]);

  return (
    <header
      ref={headerRef}
      className={`${styles.header} chrome`}
      data-scrolled={scrolled ? "true" : "false"}
    >
      <div className={styles.bar}>
        <Logo priority current={pathname === "/"} />
        <nav className={styles.desktop} aria-label={site.nav.primary}>
          <div
            className={styles.products}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setProductsOpen(false);
            }}
          >
            <button
              ref={productsButtonRef}
              className={styles.item}
              type="button"
              aria-expanded={productsOpen}
              aria-controls="product-menu"
              onClick={() => setProductsOpen((open) => !open)}
            >
              {site.nav.products}
              <Icon name="chevron-down" />
            </button>
            <div
              id="product-menu"
              className={styles.panel}
              data-open={productsOpen ? "true" : "false"}
              aria-hidden={productsOpen ? undefined : true}
              inert={productsOpen ? undefined : true}
            >
              {products.map((product) => {
                const href = `/products/${product.slug}`;
                return (
                  <Link
                    key={product.slug}
                    className={styles.productLink}
                    href={href}
                    aria-current={pageCurrent(pathname, href)}
                    onClick={() => setProductsOpen(false)}
                  >
                    <span className={styles.name}>{product.name}</span>
                    <StatusPill status={product.status} />
                    <span className={styles.tag}>{product.tagline}</span>
                  </Link>
                );
              })}
              <div className={styles.viewAll}>
                <Link
                  className="chevron-link"
                  href="/products"
                  aria-current={pageCurrent(pathname, "/products")}
                  onClick={() => setProductsOpen(false)}
                >
                  {site.nav.viewAll}
                  <Icon name="chevron" />
                </Link>
              </div>
            </div>
          </div>
          <Link className={styles.item} href="/#approach">
            {site.nav.approach}
          </Link>
          <Link className={styles.item} href="/company" aria-current={pageCurrent(pathname, "/company")}>
            {site.nav.company}
          </Link>
        </nav>
        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-expanded={menu}
          aria-controls="site-menu"
          onClick={() => {
            setProductsOpen(false);
            setMenu((open) => {
              if (open) returnMenuFocus.current = true;
              return !open;
            });
          }}
        >
          <Icon name={menu ? "close" : "menu"} />
          {menu ? site.nav.close : site.nav.menu}
        </button>
      </div>
      <div
        id="site-menu"
        ref={sheetRef}
        className={`${styles.sheet} chrome`}
        data-open={menu ? "true" : "false"}
        aria-hidden={menu ? undefined : true}
        inert={menu ? undefined : true}
      >
        <div className={styles.sheetInner}>
          <nav className={styles.mobileNav} aria-label={site.nav.mobile}>
            <p className={`caption ${styles.groupLabel}`}>{site.nav.products}</p>
            {products.map((product) => {
              const href = `/products/${product.slug}`;
              return (
                <Link
                  key={product.slug}
                  className={styles.subLink}
                  href={href}
                  aria-current={pageCurrent(pathname, href)}
                  onClick={() => setMenu(false)}
                >
                  <span>{product.name}</span>
                  <StatusPill status={product.status} />
                </Link>
              );
            })}
            <Link className={styles.subLink} href="/products" aria-current={pageCurrent(pathname, "/products")} onClick={() => setMenu(false)}>
              {site.nav.viewAll}
            </Link>
            <Link className={styles.mobileLink} href="/#approach" onClick={() => setMenu(false)}>
              {site.nav.approach}
            </Link>
            <Link className={styles.mobileLink} href="/company" aria-current={pageCurrent(pathname, "/company")} onClick={() => setMenu(false)}>
              {site.nav.company}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
