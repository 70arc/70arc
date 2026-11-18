"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { publishedProducts } from "@content/products";
import { site } from "@content/site";

export function SiteHeader() {
  const products = publishedProducts();
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [productsOpen, setProductsOpen] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(false);
    setMenu(false);
  }

  useEffect(() => {
    let last = window.scrollY;
    let solidNow = false;
    let hiddenNow = false;
    const onScroll = () => {
      const y = window.scrollY;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const nextSolid = y > 40;
      const nextHidden = !reduce && !menu && !open && y > last && y > 80;
      if (nextSolid !== solidNow) {
        solidNow = nextSolid;
        setSolid(nextSolid);
      }
      if (nextHidden !== hiddenNow) {
        hiddenNow = nextHidden;
        setHidden(nextHidden);
      }
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menu, open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (document.getElementById("product-menu-root")?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    if (menu) {
      wasOpen.current = true;
      menuRef.current?.querySelector("button")?.focus();
    } else if (wasOpen.current) {
      buttonRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <header className={solid || open || menu ? "nav is-solid" : "nav"} data-hidden={hidden ? "true" : "false"}>
        <Link className="nav-logo" href="/" aria-label={site.nav.home}>
          <Image src="/brand/logo-nav.png" alt="" width={72} height={72} />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <div id="product-menu-root" className="menu-root" onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
          }}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="product-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {site.nav.products}
            </button>
            <div id="product-menu" className={open ? "dropdown is-open" : "dropdown"} aria-hidden={!open} inert={open ? undefined : true}>
              {products.map((product) => (
                <Link key={product.slug} href={`/products/${product.slug}`} onClick={() => setOpen(false)}>
                  <span>{product.name}</span>
                  <span className="pill">{product.status}</span>
                  <small>{product.tagline}</small>
                </Link>
              ))}
              <Link className="dropdown-all" href="/products" onClick={() => setOpen(false)}>{site.nav.viewAll}</Link>
            </div>
          </div>
          <Link href="/#approach">{site.nav.approach}</Link>
          <Link href="/company">{site.nav.company}</Link>
        </nav>
        <button
          ref={buttonRef}
          className="menu-toggle"
          type="button"
          aria-expanded={menu}
          aria-controls="mobile-menu"
          onClick={() => {
            setMenu((value) => !value);
            setProductsOpen(true);
          }}
        >
          {menu ? site.nav.close : site.nav.menu}
        </button>
      </header>
      <nav
        ref={menuRef}
        id="mobile-menu"
        className={menu ? "mobile is-open" : "mobile"}
        aria-label="Mobile"
        aria-hidden={!menu}
        inert={menu ? undefined : true}
      >
        <button className="menu-close" type="button" onClick={() => setMenu(false)}>{site.nav.close}</button>
        <button type="button" aria-expanded={productsOpen} aria-controls="mobile-products" onClick={() => setProductsOpen((value) => !value)}>
          {site.nav.products}
        </button>
        <div id="mobile-products" className={productsOpen ? "accordion is-open" : "accordion"}>
          {products.map((product) => (
            <Link key={product.slug} href={`/products/${product.slug}`} onClick={() => setMenu(false)}>{product.name}</Link>
          ))}
          <Link href="/products" onClick={() => setMenu(false)}>{site.nav.viewAll}</Link>
        </div>
        <Link href="/#approach" onClick={() => setMenu(false)}>{site.nav.approach}</Link>
        <Link href="/company" onClick={() => setMenu(false)}>{site.nav.company}</Link>
      </nav>
    </>
  );
}
