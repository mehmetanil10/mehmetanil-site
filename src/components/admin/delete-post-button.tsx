"use client";

import { Trash2 } from "lucide-react";

export function DeletePostButton() {
  return (
    <button
      type="submit"
      className="p-1 text-muted-foreground transition-colors hover:text-red-400"
      onClick={(e) => {
        if (!window.confirm("Bu yazıyı silmek istediğinden emin misin?")) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 size={14} />
    </button>
  );
}
