"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { documentApi, categoryApi } from "../../lib/api";
import { DocumentType } from "../../types";

function CategoryCreator({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!name) return alert("Название категории обязательно");
    setLoading(true);
    try {
      await categoryApi.create({ name, description });
      setName("");
      setDescription("");
      onCreated && onCreated();
    } catch (err: any) {
      alert(err.message || "Ошибка при создании");
    }
    setLoading(false);
  };

  return (
    <div className="field space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Название категории"
        className="input"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание"
        className="input"
      />
      <div className="flex gap-2">
        <button
          className="btn"
          type="button"
          onClick={create}
          disabled={loading}
        >
          Создать
        </button>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const { user, logout } = useAuth();
  const [docs, setDocs] = useState<DocumentType[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await documentApi.getAll(token);
      setDocs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCats = async () => {
    try {
      const data = await categoryApi.getAll();
      if (Array.isArray(data)) setCats(data);
      else setCats([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocs();
      fetchCats();
    }
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { title, description, category_id: categoryId };
      if (file) payload.file = file;
      const newDoc = await documentApi.create(token, payload);
      setTitle("");
      setDescription("");
      setCategoryId(undefined);
      setFile(null);
      setDocs((prev) => [newDoc, ...prev]);
    } catch (err: any) {
      alert(err.message || "Ошибка при создании");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить этот документ?")) return;
    try {
      await documentApi.delete(token, id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      alert(err.message || "Ошибка при удалении");
    }
  };

  const handleChangeCategory = async (id: number, catId?: number) => {
    try {
      const updated = await documentApi.update(token, id, {
        category_id: catId,
      });
      setDocs((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } catch (err: any) {
      alert(err.message || "Ошибка при обновлении");
    }
  };

  const sanitizeFilename = (s: string) => {
    return s
      .replace(/[\\/:*?"<>|]/g, "-") 
      .replace(/\s+/g, ' ') 
      .trim()
      .slice(0, 120);
  };

  const getExtFromUrl = (url: string) => {
    try {
      const p = new URL(url).pathname;
      const seg = p.split('/').pop() || '';
      const m = seg.match(/(\.[a-z0-9]+)(?:[?#]|$)/i);
      return m ? m[1] : '';
    } catch (e) { return ''; }
  };

  const handleDownload = async (doc: DocumentType) => {
    const anyDoc: any = doc as any;
    const url = anyDoc.file_path || anyDoc.image_path;
    if (!url) return alert('Файл не найден');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Не удалось скачать файл');
      const blob = await res.blob();
      let ext = getExtFromUrl(url);
      if (!ext && blob.type) {
        const t = blob.type.split('/').pop();
        ext = t ? '.' + t : '';
      }
      if (!ext) ext = '.bin';

      const titlePart = sanitizeFilename(doc.title || 'document');
      const descPart = sanitizeFilename((doc as any).description || '');
      const nameBase = descPart ? `${titlePart} - ${descPart}` : titlePart;
      const filename = `${nameBase}${ext}`;

      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Ошибка при скачивании');
    }
  };

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const startEdit = (d: DocumentType) => {
    setEditingId(d.id);
    setEditTitle(d.title);
    setEditDescription(d.description || "");
  };
  const saveEdit = async (id: number) => {
    try {
      const updated = await documentApi.update(token, id, {
        title: editTitle,
        description: editDescription,
      });
      setDocs((prev) => prev.map((d) => (d.id === id ? updated : d)));
      setEditingId(null);
    } catch (err: any) {
      alert(err.message || "Ошибка при сохранении");
    }
  };

  if (!user)
    return (
      <div className="card">Пожалуйста, войдите, чтобы видеть документы.</div>
    );

  return (
    <div className="grid grid-cols-3 gap-6">
      <section className="col-span-2">
        <div className="card">
          <h3 className="flex justify-between items-center mb-4">
            <span>Ваши документы</span>
            <select
              className="select"
              value={categoryId ?? ""}
              onChange={(e) =>
                setCategoryId(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            >
              <option value="">Все категории</option>
              {Array.isArray(cats) ? (
                cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option disabled>Категории недоступны</option>
              )}
            </select>
          </h3>
          {loading ? (
            <div className="muted">Загрузка...</div>
          ) : (
            <div className="doc-grid grid grid-cols-3 gap-4">
              {docs.filter(
                (d) => !categoryId || (d as any).category_id === categoryId
              ).length === 0 && (
                <div className="muted">Документы отсутствуют</div>
              )}
              {docs
                .filter(
                  (d) => !categoryId || (d as any).category_id === categoryId
                )
                .map((d) => (
                  <div
                    key={d.id}
                    className="doc-tile card flex flex-col items-center p-2 shadow hover:shadow-md rounded-lg w-36"
                  >
                    {(d as any).image_path ? (
                      <img
                        src={(d as any).image_path}
                        alt={d.title}
                        className="w-8 h-8 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-400 rounded mb-2 text-xs">
                        -
                      </div>
                    )}

                    <div className="text-center text-sm font-semibold mb-1 truncate">
                      {d.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {d.description}
                    </div>

                    <select
                      className="small text-xs mt-1"
                      value={(d as any).category_id ?? ""}
                      onChange={(e) =>
                        handleChangeCategory(
                          d.id,
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    >
                      <option value="">Без категории</option>
                      {Array.isArray(cats) &&
                        cats.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>

                    <div className="flex gap-1 mt-1">
                      <button
                        className="btn ghost text-xs"
                        onClick={() => handleDownload(d)}
                      >
                        Скачать
                      </button>
                      <button
                        className="btn text-xs"
                        onClick={() => handleDelete(d.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      <aside className="space-y-6">
        <div className="card p-4">
          <h4 className="mb-3">Создать документ</h4>
          <form onSubmit={handleCreate} className="field space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название документа"
              required
              className="input"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание"
              className="input"
            />
            <select
              value={categoryId ?? ""}
              onChange={(e) =>
                setCategoryId(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="select"
            >
              <option value="">Без категории</option>
              {Array.isArray(cats) ? (
                cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option disabled>Категории недоступны</option>
              )}
            </select>
            <div>
              <label className="small muted">
                Прикрепить изображение или PDF
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="input"
              />
            </div>
            <div className="flex gap-2">
              <button className="btn" type="submit">
                Создать
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => logout()}
              >
                Выйти
              </button>
            </div>
          </form>
        </div>

        <div className="card p-4">
          <h4 className="mb-3">Создать категорию</h4>
          <CategoryCreator onCreated={fetchCats} />
        </div>
      </aside>
    </div>
  );
}
