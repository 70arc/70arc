"use client";

import { useState } from "react";
import { announcementKey, site } from "@content/site";

export function Announcement() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="announcement">
      <p>{site.announcement}</p>
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.setItem(announcementKey, "dismissed");
          } catch {
            /* Storage can be unavailable. The bar still closes for this view. */
          }
          document.documentElement.dataset.announcement = "off";
          setVisible(false);
        }}
      >
        {site.dismiss}
      </button>
    </div>
  );
}
