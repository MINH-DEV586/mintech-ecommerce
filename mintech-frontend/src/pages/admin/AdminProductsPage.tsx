import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Search, Trash2, Package, Loader2 } from 'lucide-react';
import { formatVND } from '../../lib/utils';
import { Product } from '../../types';
import { productApi, categoryApi, brandApi } from '../../services/api';

export const AdminProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: productApi.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: categoryApi.getAll,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: brandApi.getAll,
  });

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [price, setPrice] = useState('15000000');
  const [originalPrice, setOriginalPrice] = useState('16500000');
  const [color, setColor] = useState('Tiêu chuẩn');
  const [stock, setStock] = useState('20');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: Parameters<typeof productApi.create>[0] }) =>
      id ? productApi.update(id, payload) : productApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Lưu sản phẩm thất bại.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Xóa sản phẩm thất bại.');
    },
  });

  const resetForm = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId('');
    setBrandId('');
    setPrice('15000000');
    setOriginalPrice('16500000');
    setColor('Tiêu chuẩn');
    setStock('20');
    setImageUrl('');
    setDescription('');
    setFormError(null);
  };

  const handleEdit = (product: Product) => {
    resetForm();
    setEditingProduct(product);
    setName(product.name);
    setCategoryId(product.categoryId ?? '');
    setBrandId(product.brandId ?? '');
    setImageUrl(product.thumbnailUrl ?? '');
    setDescription(product.description ?? '');
    setIsModalOpen(true);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const selectedCatId = categoryId || (categories.length > 0 ? categories[0].id : '');
    if (!selectedCatId) {
      setFormError('Vui lòng chọn danh mục cho sản phẩm. (Cần tạo danh mục trước)');
      return;
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `product-${Date.now()}`;

    const payload = {
      name: name.trim(),
      slug: editingProduct?.slug ?? slug,
      description: editingProduct ? description : description || 'Sản phẩm chính hãng tại Mintech.',
      status: editingProduct?.status ?? 'ACTIVE',
      thumbnailUrl:
        editingProduct ? imageUrl : imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
      categoryId: selectedCatId,
      brandId: brandId || (editingProduct ? undefined : brands[0]?.id),
    };

    if (editingProduct) {
      saveMutation.mutate({ id: editingProduct.id, payload });
      return;
    }

    saveMutation.mutate({
      payload: {
        ...payload,
        variants: [
          {
            color: color || 'Tiêu chuẩn',
            price: Number(price),
            originalPrice: Number(originalPrice) || Number(price),
            stockQuantity: Number(stock),
            sku: `SKU-${Date.now().toString().slice(-4)}`,
            status: 'ACTIVE',
          },
        ],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary">Quản Lý Sản Phẩm</h1>
          <p className="text-xs text-text-secondary mt-1">
            Danh sách thiết bị công nghệ, cấu hình biến thể và giá bán từ cơ sở dữ liệu
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            if (categories.length > 0) setCategoryId(categories[0].id);
            if (brands.length > 0) setBrandId(brands[0].id);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus size={16} />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="text-xs text-text-secondary font-medium">
            Tổng cộng: <strong className="text-text-primary">{filtered.length}</strong> sản phẩm
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-text-muted">
            <Loader2 size={32} className="animate-spin text-primary mb-3" />
            <span className="text-xs font-medium">Đang tải danh sách sản phẩm...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-xs">
            Không thể kết nối đến máy chủ để lấy sản phẩm.
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <Package size={40} className="mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm text-text-primary">Không có sản phẩm nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-text-muted font-bold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="p-3">Sản phẩm</th>
                  <th className="p-3">Danh mục / Hãng</th>
                  <th className="p-3">Giá bán</th>
                  <th className="p-3">Tồn kho</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((prod) => {
                  const defaultVariant = prod.variants?.[0];
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.thumbnailUrl}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-border p-1 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-text-primary block line-clamp-1">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-text-muted font-mono">{prod.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-medium text-text-primary block">{prod.categoryName || 'Chưa phân loại'}</span>
                        <span className="text-[11px] text-text-muted">{prod.brandName || 'Mintech'}</span>
                      </td>

                      <td className="p-3 font-bold text-red-600">
                        {defaultVariant ? formatVND(defaultVariant.price) : 'Chưa định giá'}
                      </td>

                      <td className="p-3 font-medium">
                        {defaultVariant ? (
                          <span>{defaultVariant.stockQuantity} máy</span>
                        ) : (
                          <span className="text-text-muted">0</span>
                        )}
                      </td>

                      <td className="p-3">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {prod.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleEdit(prod)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-50 transition-colors disabled:opacity-50"
                          aria-label="Sửa sản phẩm"
                          title="Sửa sản phẩm"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-border max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-black text-text-primary mb-1">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <p className="text-xs text-text-secondary mb-4">
              {editingProduct ? 'Cập nhật thông tin chung của sản phẩm.' : 'Nhập thông tin sản phẩm và biến thể đầu tiên.'}
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: iPhone 16 Pro Max 256GB"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Danh mục *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                  >
                    {categories.length === 0 && <option value="">Chưa có danh mục</option>}
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Hãng sản xuất</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                  >
                    <option value="">Chọn hãng (hoặc để trống)</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!editingProduct && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Giá bán (VNĐ) *</label>
                      <input
                        type="number"
                        required
                        min="1000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Giá niêm yết (VNĐ)</label>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Màu sắc biến thể</label>
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="VD: Titan Tự Nhiên"
                        className="w-full p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Số lượng tồn kho</label>
                      <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold mb-1">Link ảnh thumbnail</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tóm tắt tính năng nổi bật..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  disabled={saveMutation.isPending}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-slate-50 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
