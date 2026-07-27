"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { getCategories, createCategory, deleteCategory, updateCategory } from "@/actions/category-actions";
import { slugify } from "@/lib/utils";
import type { Category } from "@prisma/client";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const cats = await getCategories();
    setCategories(cats);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    setLoading(true);
    await createCategory({ name: newName.trim(), slug: slugify(newName) });
    setNewName("");
    await load();
    setLoading(false);
  }

  async function handleUpdate() {
    if (!editId || !editName.trim()) return;
    setLoading(true);
    await updateCategory(editId, { name: editName.trim(), slug: slugify(editName) });
    setEditId(null);
    setEditName("");
    await load();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kategoriyi silmek istediğinden emin misin?")) return;
    await deleteCategory(id);
    await load();
  }

  const inputClass =
    "rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-xl font-semibold mb-8">Kategoriler</h1>

      {/* Add */}
      <div className="flex gap-2 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Yeni kategori..."
          className={`${inputClass} flex-1`}
        />
        <button
          onClick={handleCreate}
          disabled={loading || !newName.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Plus size={15} /> Ekle
        </button>
      </div>

      {/* List */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        {categories.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Henüz kategori yok.
          </p>
        ) : (
          <ul>
            {categories.map((cat, idx) => (
              <li
                key={cat.id}
                className={`flex items-center justify-between px-4 py-3 ${
                  idx < categories.length - 1 ? "border-b border-border/30" : ""
                }`}
              >
                {editId === cat.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdate();
                      if (e.key === "Escape") setEditId(null);
                    }}
                    className={`${inputClass} flex-1 mr-3`}
                    autoFocus
                  />
                ) : (
                  <div>
                    <p className="text-sm font-medium">{cat.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{cat.slug}</p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 ml-3 shrink-0">
                  {editId === cat.id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
