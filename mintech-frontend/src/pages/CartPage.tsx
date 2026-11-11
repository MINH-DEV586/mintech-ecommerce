import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { formatVND } from '../lib/utils';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const navigate = useNavigate();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-text-muted mx-auto mb-4">
          <ShoppingBag size={36} />
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="text-sm text-text-secondary max-w-sm mx-auto mb-6">
          Hãy tìm kiếm sản phẩm bạn quan tâm và thêm vào giỏ để nhận nhiều ưu đãi hấp dẫn!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-text-primary mb-6 flex items-center gap-2">
        <ShoppingBag className="text-primary" />
        <span>Giỏ hàng ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-border p-6 divide-y divide-border-subtle">
          <div className="flex justify-between items-center pb-4 text-xs text-text-muted font-medium">
            <span>Thông tin sản phẩm</span>
            <button
              onClick={clearCart}
              className="text-red-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <Trash2 size={13} />
              <span>Xóa toàn bộ giỏ</span>
            </button>
          </div>

          {items.map((item) => (
            <div key={item.productVariantId} className="py-4 flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl bg-slate-50 border border-border flex-shrink-0 flex items-center justify-center p-2 overflow-hidden">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-contain" />
                ) : (
                  <ShoppingBag size={24} className="text-text-muted" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-text-primary line-clamp-1">
                  {item.productName}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Phân loại: <strong className="text-text-primary">{item.color}</strong> · SKU: {item.sku}
                </p>
                <div className="text-sm font-bold text-red-600 mt-1">
                  {formatVND(item.price)}
                </div>
              </div>

              <div className="flex items-center border border-border rounded-lg bg-slate-50 overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.productVariantId, -1)}
                  className="px-2.5 py-1 hover:bg-slate-200 text-text-secondary transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="px-3 text-xs font-bold text-text-primary">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productVariantId, 1)}
                  className="px-2.5 py-1 hover:bg-slate-200 text-text-secondary transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>

              <div className="text-sm font-bold text-text-primary text-right min-w-[100px] hidden sm:block">
                {formatVND(item.subtotal)}
              </div>

              <button
                onClick={() => removeItem(item.productVariantId)}
                className="p-1.5 text-text-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                title="Xóa sản phẩm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div className="pt-4 flex justify-between items-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Tiếp tục chọn thêm sản phẩm</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-border p-6 space-y-4 sticky top-24">
          <h2 className="text-base font-bold text-text-primary border-b border-border pb-3">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-text-secondary">
              <span>Tạm tính hàng hóa:</span>
              <span className="font-semibold text-text-primary">{formatVND(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Phí giao hàng:</span>
              <span className="font-semibold text-emerald-600">Miễn phí 100%</span>
            </div>
          </div>

          <div className="border-t border-border pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold text-text-primary">Tổng tiền thanh toán:</span>
            <span className="text-xl font-black text-red-600">
              {formatVND(totalPrice)}
            </span>
          </div>

          <p className="text-[11px] text-text-muted">
            (Đã bao gồm thuế GTGT và bảo hành chính hãng toàn diện)
          </p>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Tiến hành đặt hàng</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

