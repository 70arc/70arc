import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "@/components/icon";

type Variant = "primary" | "secondary" | "text";

function classes(variant: Variant, className?: string) {
  const base =
    variant === "text"
      ? "chevron-link"
      : variant === "primary"
        ? "button button-primary"
        : "button button-secondary";
  return className ? `${base} ${className}` : base;
}

function content(variant: Variant, children: ReactNode) {
  return (
    <>
      {children}
      {variant === "text" ? <Icon name="chevron" /> : null}
    </>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button type={type} className={classes(variant, className)} {...props}>
      {content(variant, children)}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  const classNames = classes(variant, className);
  const body = content(variant, children);
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a className={classNames} href={href} rel="noopener noreferrer">
        {body}
      </a>
    );
  }
  return (
    <Link className={classNames} href={href}>
      {body}
    </Link>
  );
}
