"use client";

import { createContext, useContext, useEffect, useState } from "react";

const KEY = "kjvdeaf:showDrafts";

interface DraftsCtx {
  showDrafts: boolean;
  setShowDrafts: (v: boolean) => void;
}

const Ctx = createContext<DraftsCtx>({ showDrafts: false, setShowDrafts: () => {} });

export function useDrafts() {
  return useContext(Ctx);
}

export function DraftsProvider({ children }: { children: React.ReactNode }) {
  // Default OFF — matches the server render, so no hydration mismatch.
  const [showDrafts, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") setShow(true);
    } catch {}
  }, []);

  const setShowDrafts = (v: boolean) => {
    setShow(v);
    try {
      localStorage.setItem(KEY, v ? "1" : "0");
    } catch {}
  };

  return <Ctx.Provider value={{ showDrafts, setShowDrafts }}>{children}</Ctx.Provider>;
}

export function DraftsToggle() {
  const { showDrafts, setShowDrafts } = useDrafts();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={showDrafts}
      onClick={() => setShowDrafts(!showDrafts)}
      className="tap inline-flex items-center gap-2.5 text-left"
    >
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          showDrafts ? "bg-review" : "bg-line"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-paper shadow transition-transform ${
            showDrafts ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-xs leading-tight text-ink-soft">
        Show draft chapters{" "}
        <span className="text-muted">(needs review)</span>
      </span>
    </button>
  );
}
