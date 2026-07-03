"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "eagle-voter-fp";

function generateFingerprint(): string {
  return `fp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function useVoterFingerprint(): string {
  const [fingerprint, setFingerprint] = useState("");

  useEffect(() => {
    let fp = localStorage.getItem(STORAGE_KEY);
    if (!fp) {
      fp = generateFingerprint();
      localStorage.setItem(STORAGE_KEY, fp);
    }
    setFingerprint(fp);
  }, []);

  return fingerprint;
}

export function getVoterFingerprint(): string {
  if (typeof window === "undefined") return "server";
  let fp = localStorage.getItem(STORAGE_KEY);
  if (!fp) {
    fp = generateFingerprint();
    localStorage.setItem(STORAGE_KEY, fp);
  }
  return fp;
}
