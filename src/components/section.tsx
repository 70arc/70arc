import type { ReactNode } from "react";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  const classes = ["container", className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}

export function Section({
  children,
  id,
  labelledBy,
  className,
  progress = false,
  marker,
}: {
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  className?: string;
  progress?: boolean;
  marker?: string;
}) {
  const classes = ["section", className].filter(Boolean).join(" ");
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={classes}
      data-scroll-progress={progress ? "" : undefined}
      data-nav-section={marker}
    >
      {children}
    </section>
  );
}
