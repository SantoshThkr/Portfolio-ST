"use client";

import { useEffect, useState } from "react";
import styles from "./copy-email.module.css";

type Status = "idle" | "copied" | "failed";

const messages: Record<Status, string> = {
  idle: "",
  copied: "Email address copied.",
  failed: "Couldn't copy — select the address above instead.",
};

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <span className={styles.wrap}>
      <button type="button" className={`button button-secondary ${styles.button}`} onClick={copy}>
        {status === "copied" ? "Copied" : "Copy email address"}
      </button>
      <span role="status" className={styles.status}>
        {messages[status]}
      </span>
    </span>
  );
}
