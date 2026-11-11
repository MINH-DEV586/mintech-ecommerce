import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, Truck, CheckCircle, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { orderApi, couponApi } from '../services/api';
import { formatVND } from '../lib/utils';

const checkoutSchema = z.object({
  recipientName: z.string().min(2, 'Vui lòng nhập họ và tên người nhận'),
  recipientPhone: z.string().regex(/^(\+?84|0)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ (10 số)'),
  province: z.string().min(1, 'Vui lòng chọn Tỉnh / Thành phố'),
  district: z.string().min(1, 'Vui lòng chọn Quận / Huyện'),
  detailAddress: z.string().min(5, 'Vui lòng nhập địa chỉ chi tiết (số nhà, tên đường)'),
  note: z.string().optional(),
  paymentMethod: z.literal('COD'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const CheckoutPage: React.FC = () => {
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessCode, setOrderSuccessCode] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const shippingFee = 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      recipientName: user?.fullName || '',
      recipientPhone: user?.phone || '',
      province: 'Hà Nội',
      district: 'Cầu Giấy',
      detailAddress: '',
      paymentMethod: 'COD',
    },
  });

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await couponApi.validate(couponCode.trim(), subtotal);
      if (res.discountType === 'PERCENTAGE') {
        const disc = (subtotal * res.discountValue) / 100;
        setDiscountAmount(res.maxDiscountAmount ? Math.min(disc, res.maxDiscountAmount) : disc);
      } else {
        setDiscountAmount(res.discountValue);
      }
      setCouponMsg({ text: `Áp dụng mã ${res.code} thành công!`, error: false });
    } catch (err: any) {
      setDiscountAmount(0);
      const msg = err.response?.data?.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
      setCouponMsg({ text: msg, error: true });
    }
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const fullAddress = `${values.detailAddress}, ${values.district}, ${values.province}`;

    const orderPayload = {
      recipientName: values.recipientName,
      recipientPhone: values.recipientPhone,
      shippingAddress: fullAddress,
      note: values.note || '',
      couponCode: discountAmount > 0 ? couponCode : undefined,
      items: items.map((i) => ({
        productVariantId: i.productVariantId,
        quantity: i.quantity,
      })),
    };

    try {
      const res = await orderApi.create(orderPayload);
      clearCart();
      setOrderSuccessCode(res.orderCode);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Đặt hàng thất bại. Vui lòng kiểm tra lại trạng thái sản phẩm hoặc đăng nhập.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccessCode) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={44} />
        </div>
        <h1 className="text-2xl font-black text-text-primary mb-2">
          Đặt Hàng Thành Công!
        </h1>
        <p className="text-sm text-text-secondary mb-4">
          Cảm ơn bạn đã lựa chọn Mintech. Mã đơn hàng của bạn là:{' '}
          <strong className="text-primary font-mono text-base">{orderSuccessCode}</strong>
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-border text-xs text-text-secondary max-w-md mx-auto mb-8 text-left space-y-1">
          <p>• Nhân viên CSKH Mintech sẽ liên hệ xác nhận đơn trong vòng 15 phút.</p>
          <p>• Đơn hàng sẽ được đóng gói và giao hỏa tốc trong 2 giờ.</p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            to="/account/orders"
            className="px-5 py-2.5 rounded-lg border border-border bg-white text-xs font-semibold text-text-primary hover:bg-slate-50"
          >
            Quản lý đơn hàng
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark"
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-4 hover:underline">
        <ArrowLeft size={14} />
        <span>Quay lại giỏ hàng</span>
      </Link>

      <h1 className="text-2xl font-black text-text-primary mb-6">
        Thông Tin Thanh Toán & Đặt Hàng
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-base font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
                <Truck size={18} className="text-primary" />
                <span>1. Địa chỉ nhận hàng</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Họ và tên người nhận *
                  </label>
                  <input
                    type="text"
                    {...register('recipientName')}
                    className="w-full text-xs p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.recipientName && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.recipientName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Số điện thoại nhận hàng *
                  </label>
                  <input
                    type="tel"
                    {...register('recipientPhone')}
                    className="w-full text-xs p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                    placeholder="0987654321"
                  />
                  {errors.recipientPhone && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.recipientPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Tỉnh / Thành phố *
                  </label>
                  <input
                    type="text"
                    {...register('province')}
                    className="w-full text-xs p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                    placeholder="Hà Nội, TP.HCM..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Quận / Huyện *
                  </label>
                  <input
                    type="text"
                    {...register('district')}
                    className="w-full text-xs p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                    placeholder="Cầu Giấy, Quận 1..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Địa chỉ chi tiết (Số nhà, tên ngõ, đường) *
                </label>
                <input
                  type="text"
                  {...register('detailAddress')}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="Số 88, Đường Cầu Giấy, Phường Dịch Vọng"
                />
                {errors.detailAddress && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.detailAddress.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Ghi chú cho đơn vị giao hàng (Không bắt buộc)
                </label>
                <textarea
                  rows={2}
                  {...register('note')}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="Giao hàng vào giờ hành chính, gọi trước khi đến..."
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-base font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                <span>2. Phương thức thanh toán</span>
              </h2>

              <div className="space-y-2.5">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    value="COD"
                    {...register('paymentMethod')}
                    className="accent-primary"
                  />
                  <Banknote size={20} className="text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-text-primary">
                      Thanh toán khi nhận hàng (COD)
                    </div>
                    <div className="text-[11px] text-text-muted">
                      Kiểm tra hàng thoải mái trước khi thanh toán tiền mặt cho bưu tá
                    </div>
                  </div>
                </label>

                <p className="text-[11px] text-text-muted">Thanh toán online chưa khả dụng.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-border p-6 space-y-4 sticky top-24">
            <h2 className="text-base font-bold text-text-primary border-b border-border pb-3">
              Đơn hàng của bạn ({items.length} mặt hàng)
            </h2>

            <div className="max-h-60 overflow-y-auto divide-y divide-border-subtle pr-1">
              {items.map((i) => (
                <div key={i.productVariantId} className="py-2.5 flex justify-between gap-3 text-xs">
                  <div className="flex-1">
                    <span className="font-semibold text-text-primary block line-clamp-1">{i.productName}</span>
                    <span className="text-text-muted text-[11px]">Màu: {i.color} · SL: {i.quantity}</span>
                  </div>
                  <span className="font-bold text-text-primary whitespace-nowrap">
                    {formatVND(i.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3">
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Mã giảm giá / Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã (VD: MINTECH2026)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-lg border border-border uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900"
                >
                  Áp dụng
                </button>
              </div>
              {couponMsg && (
                <p className={`text-[11px] mt-1 ${couponMsg.error ? 'text-red-600' : 'text-emerald-600'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            <div className="border-t border-border pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Tiền hàng:</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Giảm giá voucher:</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Phí vận chuyển:</span>
                <span className="text-emerald-600 font-semibold">Miễn phí</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-border text-sm font-bold text-text-primary">
                <span>Tổng cộng:</span>
                <span className="text-xl font-black text-red-600">
                  {formatVND(finalTotal)}
                </span>
              </div>
            </div>

            {submitError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <ShieldCheck size={18} />
              <span>{isSubmitting ? 'Đang tạo đơn...' : 'Xác Nhận Đặt Hàng'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

