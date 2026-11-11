import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatVND, calculateDiscount } from '../../lib/utils';
import { useCartStore } from '../../stores/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((s) => s.addItem);
  const primaryVariant = product.variants?.[0];

  if (!primaryVariant) return null;

  const discountPercent = calculateDiscount(primaryVariant.price, primaryVariant.originalPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, primaryVariant, 1);
  };

  const inStock = primaryVariant.stockQuantity > 0;

  return (
    <div className="group bg-white border border-[#E5E7EB] rounded-lg transition-colors duration-150 hover:border-[#D1D5DB] flex flex-col overflow-hidden">
      <Link to={`/products/${product.slug}`} className="block relative">
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 z-10 bg-[#DC2626] text-white text-[11px] font-semibold px-1.5 py-0.5 rounded">
            -{discountPercent}%
          </span>
        )}

        <div className="aspect-square w-full bg-white flex items-center justify-center overflow-hidden bg-[#F9FAFB]">
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-4/5 h-4/5 object-contain transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3">
        {product.brandName && (
          <span className="text-[11px] text-[#9CA3AF] mb-1">{product.brandName}</span>
        )}

        <Link to={`/products/${product.slug}`}>
          <h3 className="text-[13px] font-medium text-[#111827] line-clamp-2 min-h-[38px] leading-snug hover:text-[#2563EB] transition-colors duration-150 mb-2">
            {product.name}
          </h3>
        </Link>

        {product.variants && product.variants.length > 1 && (
          <p className="text-[11px] text-[#9CA3AF] mb-2">{product.variants.length} phiên bản</p>
        )}

        <div className="flex items-baseline gap-2 mt-auto mb-2.5">
          <span className="text-[15px] font-bold text-[#DC2626] leading-tight">
            {formatVND(primaryVariant.price)}
          </span>
          {primaryVariant.originalPrice > primaryVariant.price && (
            <span className="text-[12px] text-[#9CA3AF] line-through">
              {formatVND(primaryVariant.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-medium ${inStock ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>
            {inStock ? 'Còn hàng' : 'Hết hàng'}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-[#2563EB] border border-[#BFDBFE] rounded hover:bg-[#EFF6FF] hover:border-[#93C5FD] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <ShoppingBag size={12} />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
