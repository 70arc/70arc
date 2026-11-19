import type { ReactNode } from "react";

type IconName = "chevron" | "chevron-down" | "menu" | "close" | "arrow-up-right";

const paths: Record<IconName, ReactNode> = {
  chevron: <path d="M9 6l6 6-6 6" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  menu: (
    <>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </>
  ),
};

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
