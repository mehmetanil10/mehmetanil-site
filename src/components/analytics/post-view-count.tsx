"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { getVisitorId } from "@/lib/visitor-id";

type PostViewCountProps = {
  slug: string;
  initialCount: number;
};

export function PostViewCount({ slug, initialCount }: PostViewCountProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let active = true;

    fetch(`/api/posts/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId() }),
      cache: "no-store",
      keepalive: true,
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { count?: number }) => {
        if (active && typeof data.count === "number") setCount(data.count);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Eye size={12} />
      {count} görüntüleme
    </span>
  );
}
