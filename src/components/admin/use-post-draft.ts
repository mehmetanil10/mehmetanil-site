import { useEffect, useRef, useState } from "react";
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

export function usePostDraft(key: string, revision: string, initial: PostFields) {
  const [values, setValues] = useState(initial);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const lastSnapshot = useRef<string | null>(null);
  const lastValues = useRef(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      lastSnapshot.current = raw;
      if (raw) {
        const saved = storedDraft.parse(JSON.parse(raw));
        if (saved.revision === revision) {
          lastValues.current = saved.values;
          setValues(saved.values);
          setNotice(`Taslak geri yüklendi · ${formatTime(saved.savedAt)}`);
        } else {
          setNotice("Sunucuda daha yeni bir sürüm var. Güncel yazı açıldı.");
        }
      }
    } catch {
      setNotice("Bu tarayıcıdaki taslak okunamadı.");
    }
    setReady(true);
  }, [key, revision]);

  useEffect(() => {
    if (!ready || values === lastValues.current) return;
    try {
      if (localStorage.getItem(key) !== lastSnapshot.current) {
        setNotice("Bu taslak başka bir sekmede değişti. Bu sekmede otomatik kayıt durdu.");
        return;
      }
      const savedAt = Date.now();
      const raw = JSON.stringify({ values, revision, savedAt });
      localStorage.setItem(key, raw);
      lastSnapshot.current = raw;
      lastValues.current = values;
      setNotice(`Bu tarayıcıda son kayıt · ${formatTime(savedAt)}`);
    } catch {
      setNotice("Tarayıcı taslağı kaydedemedi. Yazıyı kapatmadan kaydedin.");
    }
  }, [key, ready, revision, values]);

  function clearDraft() {
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
