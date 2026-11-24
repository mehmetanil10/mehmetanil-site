import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

const fields = z.object({
  title: z.string(), slug: z.string(), excerpt: z.string(), content: z.string(),
  coverImage: z.string(), categoryId: z.string(), status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: z.string(), seoDescription: z.string(),
});

export type PostFields = z.infer<typeof fields>;
export const emptyPost: PostFields = {
  title: "", slug: "", excerpt: "", content: "", coverImage: "", categoryId: "",
  status: "DRAFT", seoTitle: "", seoDescription: "",
};

const storedDraft = z.object({
  values: fields, revision: z.string(), savedAt: z.number().finite(),
});

const AUTOSAVE_DELAY_MS = 750;

export function usePostDraft(key: string, revision: string, initial: PostFields) {
  const [values, setFormValues] = useState(initial);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const lastSnapshot = useRef<string | null>(null);
  const lastValues = useRef(initial);
  const latestValues = useRef(initial);

  function setValues(update: (current: PostFields) => PostFields) {
    const next = update(latestValues.current);
    latestValues.current = next;
    setFormValues(next);
  }

  const flushDraft = useCallback(() => {
    const pending = latestValues.current;
    if (pending === lastValues.current) return;
    try {
      if (localStorage.getItem(key) !== lastSnapshot.current) {
        setNotice("Bu taslak başka bir sekmede değişti. Bu sekmede otomatik kayıt durdu.");
        return;
      }
      const savedAt = Date.now();
      const raw = JSON.stringify({ values: pending, revision, savedAt });
      localStorage.setItem(key, raw);
      lastSnapshot.current = raw;
      lastValues.current = pending;
      setNotice(`Bu tarayıcıda son kayıt · ${formatTime(savedAt)}`);
    } catch {
      setNotice("Tarayıcı taslağı kaydedemedi. Yazıyı kapatmadan kaydedin.");
    }
  }, [key, revision]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      lastSnapshot.current = raw;
      if (raw) {
        const saved = storedDraft.parse(JSON.parse(raw));
        if (saved.revision === revision) {
          lastValues.current = saved.values;
          latestValues.current = saved.values;
          setFormValues(saved.values);
          setNotice(`Taslak geri yüklendi · ${formatTime(saved.savedAt)}`);
        } else {
          setNotice("Sunucuda daha yeni bir sürüm var. Güncel yazı açıldı.");
        }
      }
    } catch {
      setNotice("Bu tarayıcıdaki taslak okunamadı.");
    }
    setReady(true);

    const saveWhenHidden = () => {
      if (document.visibilityState === "hidden") flushDraft();
    };
    document.addEventListener("visibilitychange", saveWhenHidden);
    window.addEventListener("pagehide", flushDraft);
    return () => {
      document.removeEventListener("visibilitychange", saveWhenHidden);
      window.removeEventListener("pagehide", flushDraft);
      flushDraft();
    };
  }, [key, revision, flushDraft]);

  useEffect(() => {
    if (!ready || values === lastValues.current) return;
    const timer = window.setTimeout(flushDraft, AUTOSAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [values, ready, flushDraft]);

  function clearDraft() {
    lastValues.current = latestValues.current;
    try {
      if (localStorage.getItem(key) === lastSnapshot.current) localStorage.removeItem(key);
    } catch {
      // Tarayıcı depolaması kullanılamadığında sunucuya kaydetme çalışmaya devam eder.
    }
  }

  return { values, setValues, ready, notice, clearDraft };
}

function formatTime(value: number) {
  return new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(value);
}
