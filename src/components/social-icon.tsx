import type { SVGProps } from "react";

export type SocialIconName = "linkedin" | "x" | "instagram";

const shared: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  "aria-hidden": true,
};

export function SocialIcon({ name }: { name: SocialIconName }) {
  if (name === "linkedin") {
    return (
      <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="2" />
        <path d="M8 10.75V16.25" />
        <path d="M8 7.8h.01" />
        <path d="M12.15 16.25v-3.05a1.95 1.95 0 0 1 3.9 0v3.05" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg {...shared} fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </svg>
    );
  }

  return (
    <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.6" cy="7.4" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
