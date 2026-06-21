"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { isLocalPersistEnabled, setLocalPersistEnabled } from "@/lib/persistence/assessment-store";

/**
 * Privacy-forward, opt in "stays on your device" persistence (§6.1, §11).
 * Off by default (session-only). When on, the assessment is mirrored to
 * localStorage, still entirely on the device, never sent to a server.
 */
export function PersistenceToggle() {
  const [state, setState] = useState({ mounted: false, enabled: false });

  useEffect(() => {
    // Hydration-safe: read client-only localStorage after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ mounted: true, enabled: isLocalPersistEnabled() });
  }, []);

  function handleChange(next: boolean) {
    setLocalPersistEnabled(next);
    setState((s) => ({ ...s, enabled: next }));
  }

  const on = state.mounted && state.enabled;

  return (
    <div className="border-border-hair bg-surface flex items-start justify-between gap-4 rounded-2xl border px-5 py-4">
      <div className="flex items-start gap-3">
        <Lock className="text-accent-strong mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-ink text-sm font-medium">Keep this on my device</p>
          <p className="text-ink-muted mt-1 text-sm leading-relaxed">
            {on
              ? "Saved to this browser only, it’ll be here when you come back."
              : "Off, your assessment clears when you close this tab."}
          </p>
        </div>
      </div>
      <Switch
        checked={on}
        onCheckedChange={handleChange}
        aria-label="Keep this assessment on my device"
      />
    </div>
  );
}
