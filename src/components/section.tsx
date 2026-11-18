import type { ReactNode } from "react";

export function Container({
  children,
  wide = false,
  className,
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  const classes = [wide ? "container-wide" : "container", className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}

export function Section({
  children,
  id,
  labelledBy,
  className,
  progress = false,
}: {
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  className?: string;
  progress?: boolean;
}) {
  const classes = ["section", className].filter(Boolean).join(" ");
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={classes}
      data-scroll-progress={progress ? "" : undefined}
    >
      {children}
    </section>
  );
}
