import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { formatVND } from '../../lib/utils';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-primary" />
              <h2 className="text-base font-semibold text-text-primary">
                Giỏ hàng của bạn ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 divide-y divide-border-subtle">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-text-muted mb-3">
                  <ShoppingBag size={28} />
                </div>
                <p className="text-sm font-medium text-text-primary mb-1">
                  Giỏ hàng chưa có sản phẩm
                </p>
                <p className="text-xs text-text-secondary mb-4 max-w-xs">
                  Khám phá hàng ngàn sản phẩm công nghệ chính hãng giá tốt tại Mintech!
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productVariantId} className="py-4 flex gap-3 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 rounded-lg bg-slate-50 border border-border flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-contain p-1" />
                    ) : (
                      <ShoppingBag size={20} className="text-text-muted" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-text-primary line-clamp-1">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        Phân loại: <span className="font-medium text-text-primary">{item.color}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-red-600">
                        {formatVND(item.price)}
                      </span>

                      <div className="flex items-center border border-border rounded-md overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.productVariantId, -1)}
                          className="p-1 hover:bg-slate-200 text-text-secondary"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-semibold text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productVariantId, 1)}
                          className="p-1 hover:bg-slate-200 text-text-secondary"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productVariantId)}
                        className="text-text-muted hover:text-red-600 p-1 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-5 border-t border-border bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary font-medium">Tạm tính:</span>
                <span className="text-base font-bold text-red-600">
                  {formatVND(totalPrice)}
                </span>
              </div>
              <p className="text-[11px] text-text-muted">
                Phí vận chuyển và mã giảm giá sẽ được tính toán tại bước thanh toán.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 px-3 rounded-lg border border-border bg-white text-text-primary text-xs font-semibold text-center hover:bg-slate-100 transition-colors"
                >
                  Xem chi tiết giỏ
                </Link>
                <button
                  onClick={handleCheckout}
                  className="py-2.5 px-3 rounded-lg bg-primary text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary-dark transition-colors shadow-sm"
                >
                  <span>Thanh toán</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

