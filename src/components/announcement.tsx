"use client";

import { useState } from "react";
import { announcementKey, site } from "@content/site";
import styles from "./announcement.module.css";

export function Announcement() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className={styles.bar} data-announcement="">
      <p>{site.announcement}</p>
      <button
        className={styles.dismiss}
        type="button"
        onClick={() => {
          try {
            localStorage.setItem(announcementKey, "dismissed");
          } catch {
            /* Storage can be blocked. The bar still closes for this view. */
          }
          document.documentElement.dataset.announcement = "off";
          setOpen(false);
        }}
      >
        {site.dismiss}
      </button>
    </div>
  );
}
