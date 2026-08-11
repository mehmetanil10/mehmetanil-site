"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const LOAD_TIMEOUT_MS = 10_000;

type TurnstileOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  action?: string;
  retry?: "auto" | "never";
  "retry-interval"?: number;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
  "error-callback"?: (errorCode?: string) => boolean | void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileStatus = "loading" | "ready" | "verified" | "error";

export type TurnstileWidgetHandle = {
  reset: () => void;
  retry: () => void;
};

type TurnstileWidgetProps = {
  siteKey: string;
  onVerify: (token: string | null) => void;
  onError: () => void;
  onStatusChange?: (status: TurnstileStatus) => void;
};

function loadTurnstileScript(forceReload: boolean) {
  if (window.turnstile) return Promise.resolve();

  let script = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
  if (script && forceReload) {
    script.remove();
    script = null;
  }

  if (!script) {
    script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  return new Promise<void>((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    script?.addEventListener(
      "load",
      () => (window.turnstile ? resolve() : reject(new Error("Turnstile API unavailable"))),
      { once: true },
    );
    script?.addEventListener("error", () => reject(new Error("Turnstile script failed")), {
      once: true,
    });
  });
}

export const TurnstileWidget = forwardRef<
  TurnstileWidgetHandle,
  TurnstileWidgetProps
>(function TurnstileWidget(
  { siteKey, onVerify, onError, onStatusChange },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const onErrorRef = useRef(onError);
  const onStatusChangeRef = useRef(onStatusChange);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onErrorRef.current = onError;
    onStatusChangeRef.current = onStatusChange;
  }, [onError, onStatusChange, onVerify]);

  const updateStatus = useCallback((status: TurnstileStatus) => {
    onStatusChangeRef.current?.(status);
  }, []);

  const destroyWidget = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // Widget zaten kaldırılmış olabilir.
      }
    }
    widgetIdRef.current = null;
    containerRef.current?.replaceChildren();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => {
      setTheme(root.classList.contains("light") ? "light" : "dark");
    };
    const observer = new MutationObserver(syncTheme);

    syncTheme();
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!theme) return;

    let cancelled = false;
    updateStatus("loading");
    onVerifyRef.current(null);

    const fail = () => {
      if (cancelled) return;
      updateStatus("error");
      onVerifyRef.current(null);
      onErrorRef.current();
    };
    const timeout = window.setTimeout(fail, LOAD_TIMEOUT_MS);

    if (!siteKey) {
      window.clearTimeout(timeout);
      fail();
      return () => {
        cancelled = true;
      };
    }

    void loadTurnstileScript(attempt > 0 && !window.turnstile)
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;

        destroyWidget();
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          action: "contact",
          retry: "auto",
          "retry-interval": 8_000,
          callback: (token) => {
            window.clearTimeout(timeout);
            updateStatus("verified");
            onVerifyRef.current(token);
          },
          "expired-callback": () => {
            updateStatus("ready");
            onVerifyRef.current(null);
          },
          "timeout-callback": fail,
          "error-callback": () => {
            fail();
            return true;
          },
        });
        window.clearTimeout(timeout);
        updateStatus("ready");
      })
      .catch(fail);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      destroyWidget();
    };
  }, [attempt, destroyWidget, siteKey, theme, updateStatus]);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
          updateStatus("ready");
        }
        onVerifyRef.current(null);
      },
      retry() {
        onVerifyRef.current(null);
        setAttempt((current) => current + 1);
      },
    }),
    [updateStatus],
  );

  return (
    <div
      ref={containerRef}
      className="min-h-[65px] max-w-full overflow-hidden"
      aria-label="İnsan doğrulaması"
    />
  );
});
