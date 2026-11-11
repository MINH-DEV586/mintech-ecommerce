import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  Share2,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';
import { formatVND, calculateDiscount } from '../lib/utils';
import { useCartStore } from '../stores/cartStore';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
  });

  const product = products.find((p) => p.slug === slug || p.id === slug);

  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]);
  const [selectedImage, setSelectedImage] = useState(product?.thumbnailUrl || '');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
      setSelectedImage(product.thumbnailUrl);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-text-muted">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm font-medium">Đang tải thông tin chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <AlertCircle size={48} className="mx-auto text-amber-500 mb-3" />
        <h2 className="text-xl font-bold text-text-primary mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-xs text-text-secondary mb-6">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.
        </p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-semibold"
        >
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const discountPercent = calculateDiscount(
    selectedVariant.price,
    selectedVariant.originalPrice
  );

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categoryName === product.categoryName)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      <nav className="flex items-center gap-1.5 text-xs text-text-muted">
        <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <ChevronRight size={12} />
        <Link to={`/products?category=${product.categoryName}`} className="hover:text-primary transition-colors">
          {product.categoryName || 'Sản phẩm'}
        </Link>
        <ChevronRight size={12} />
        <span className="text-text-primary font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-border p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square rounded-xl bg-slate-50 border border-border flex items-center justify-center p-6 overflow-hidden">
            <img
              src={selectedImage || product.thumbnailUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105"
            />
          </div>

          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedImage(product.thumbnailUrl)}
                className={`w-16 h-16 rounded-lg border p-1 bg-slate-50 flex-shrink-0 transition-all ${
                  selectedImage === product.thumbnailUrl ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                }`}
              >
                <img src={product.thumbnailUrl} alt="Thumb" className="w-full h-full object-contain" />
              </button>
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`w-16 h-16 rounded-lg border p-1 bg-slate-50 flex-shrink-0 transition-all ${
                    selectedImage === img.imageUrl ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                >
                  <img src={img.imageUrl} alt="Thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-primary uppercase tracking-wider">
                {product.brandName || 'Mintech'}
              </span>
              <span className="text-border">|</span>
              <span className="text-text-muted">SKU: <span className="font-mono">{selectedVariant.sku || 'N/A'}</span></span>
              <span className="text-border">|</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <Check size={14} /> {selectedVariant.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-text-primary leading-snug">
              {product.name}
            </h1>

            <div className="p-4 rounded-xl bg-slate-50 border border-border flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-black text-red-600">
                {formatVND(selectedVariant.price)}
              </span>
              {selectedVariant.originalPrice > selectedVariant.price && (
                <>
                  <span className="text-sm text-text-muted line-through">
                    {formatVND(selectedVariant.originalPrice)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-600">
                      Tiết kiệm {discountPercent}%
                    </span>
                  )}
                </>
              )}
            </div>

            {product.variants && product.variants.length > 1 && (
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-bold text-text-primary">
                  Lựa chọn phiên bản / Màu sắc: <span className="text-primary font-semibold">{selectedVariant.color}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border text-left transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                            : 'border-border bg-white text-text-primary hover:border-slate-300'
                        }`}
                      >
                        <span>{v.color}</span>
                        <span className="text-[11px] text-text-muted">({formatVND(v.price)})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-text-primary">Số lượng:</span>
              <div className="flex items-center border border-border rounded-lg bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-xs font-bold text-text-primary">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedVariant.stockQuantity || 99, quantity + 1))}
                  className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-30"
                  disabled={quantity >= selectedVariant.stockQuantity}
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-text-muted">
                (Còn {selectedVariant.stockQuantity} sản phẩm trong kho)
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={selectedVariant.stockQuantity <= 0}
                className="w-full py-3.5 px-4 rounded-xl border-2 border-primary text-primary hover:bg-primary-subtle font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={selectedVariant.stockQuantity <= 0}
                className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs md:text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Mua Ngay (Giao Hỏa Tốc)
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-text-secondary">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-border">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Bảo hành 12T 1 đổi 1</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-border">
                <Truck size={16} className="text-primary flex-shrink-0" />
                <span>Giao nhanh 2h miễn phí</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-border">
                <RotateCcw size={16} className="text-amber-600 flex-shrink-0" />
                <span>30 ngày hoàn trả miễn phí</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-black text-text-primary border-b border-border pb-3">
          Thông Tin Chi Tiết Sản Phẩm
        </h2>
        <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed">
          <p>{product.description || 'Chưa có thông tin mô tả chi tiết cho thiết bị này.'}</p>
        </div>

        {product.specifications && product.specifications.length > 0 && (
          <div className="pt-4">
            <h3 className="text-sm font-bold text-text-primary mb-3">Thông số kỹ thuật</h3>
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden max-w-2xl text-xs">
              {product.specifications.map((spec) => (
                <div key={spec.id} className="grid grid-cols-3 p-3 bg-white even:bg-slate-50">
                  <span className="font-semibold text-text-secondary">{spec.specName}</span>
                  <span className="col-span-2 text-text-primary">{spec.specValue}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-text-primary">Sản Phẩm Cùng Danh Mục</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
