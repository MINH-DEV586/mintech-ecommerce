import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layers, Pencil, Plus, Trash2, Loader2 } from 'lucide-react';
import { categoryApi } from '../../services/api';

export const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: categoryApi.getAll,
  });

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setFormError(null);
  };

  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | null; data: { name: string; slug: string; description: string } }) =>
      id ? categoryApi.update(id, data) : categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Lưu danh mục thất bại');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Xóa danh mục thất bại');
    },
  });

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setFormError(null);

    const generatedSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    saveMutation.mutate({
      id: editingId,
      data: { name: name.trim(), slug: generatedSlug, description: description.trim() },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-text-primary">Quản Lý Danh Mục</h1>
        <p className="text-xs text-text-secondary mt-1">
          Cấu trúc nhóm sản phẩm phục vụ điều hướng và phân loại thiết bị từ máy chủ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-border shadow-subtle space-y-4">
          <h2 className="text-sm font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
            <Plus size={16} className="text-primary" />
            <span>{editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}</span>
          </h2>

          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
              {formError}
            </div>
          )}

          <form onSubmit={handleSaveCategory} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Tên danh mục *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (editingId) return;
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, '')
                  );
                }}
                placeholder="VD: Máy tính bảng"
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Slug (Đường dẫn tĩnh) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="VD: may-tinh-bang"
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Mô tả
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Đang lưu...' : 'Lưu Danh Mục'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} disabled={saveMutation.isPending}
                className="w-full py-2 text-xs font-semibold text-text-secondary">
                Hủy sửa
              </button>
            )}
          </form>
        </div>

        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-border shadow-subtle space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Layers size={16} className="text-primary" />
              <span>Danh Sách Danh Mục ({categories.length})</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-text-muted">
              <Loader2 size={24} className="animate-spin text-primary mb-2" />
              <span className="text-xs">Đang tải danh mục...</span>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 text-xs">
              Không thể tải danh mục từ máy chủ.
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-xs">
              Chưa có danh mục nào. Hãy thêm danh mục đầu tiên ở biểu mẫu bên trái!
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {categories.map((cat) => (
                <div key={cat.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80'}
                      alt={cat.name}
                      className="w-9 h-9 rounded-lg object-contain bg-slate-50 border border-border p-1 flex-shrink-0"
                    />
                    <div>
                      <span className="font-bold text-text-primary block">{cat.name}</span>
                      <span className="text-[11px] text-text-muted font-mono">{cat.slug}</span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(cat.id);
                        setName(cat.name);
                        setSlug(cat.slug);
                        setDescription(cat.description ?? '');
                        setFormError(null);
                      }}
                      disabled={saveMutation.isPending || deleteMutation.isPending}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-50 transition-colors disabled:opacity-50"
                      aria-label="Sửa danh mục"
                      title="Sửa danh mục"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={deleteMutation.isPending || saveMutation.isPending || editingId === cat.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Xóa danh mục"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
