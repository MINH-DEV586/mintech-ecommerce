import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Clock, CheckCircle2, XCircle, Truck, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { formatVND } from '../../lib/utils';
import { orderApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

export const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const queryKey = ['my-orders', userId];

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey,
    enabled: !!userId,
    queryFn: orderApi.getMyOrders,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => orderApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Hủy đơn hàng thất bại');
    },
  });

  const handleCancelOrder = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      cancelMutation.mutate(id);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
            <Clock size={12} /> Chờ xác nhận
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
            <CheckCircle2 size={12} /> Đã xác nhận
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Truck size={12} /> Đang giao hàng
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 size={12} /> Giao thành công
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
            <XCircle size={12} /> Đã hủy
          </span>
        );
      default:
        return <span className="text-xs font-medium text-text-muted">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-4 hover:underline">
        <ArrowLeft size={14} />
        <span>Quay về trang chủ</span>
      </Link>

      <div className="flex justify-between items-baseline mb-6">
        <div>
          <h1 className="text-2xl font-black text-text-primary">Lịch Sử Đơn Hàng</h1>
          <p className="text-xs text-text-secondary mt-1">
            Theo dõi tiến độ giao hàng và thông tin chi tiết các đơn hàng của bạn từ hệ thống
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-text-muted">
          <Loader2 size={32} className="animate-spin text-primary mb-3" />
          <span className="text-xs font-medium">Đang tải danh sách đơn hàng...</span>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center text-red-600 text-xs">
          Không thể tải danh sách đơn hàng. Vui lòng kiểm tra kết nối tới máy chủ.
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <Package size={40} className="mx-auto text-text-muted mb-3" />
          <h3 className="text-base font-bold text-text-primary mb-1">Bạn chưa có đơn hàng nào</h3>
          <p className="text-xs text-text-secondary mb-4">
            Hãy khám phá các thiết bị công nghệ đỉnh cao và mua sắm ngay!
          </p>
          <Link
            to="/products"
            className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary flex items-center justify-center font-bold text-xs">
                    <Package size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-text-primary block">
                      Mã đơn: <span className="font-mono text-primary">{order.orderCode}</span>
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {renderStatusBadge(order.orderStatus)}
                </div>
              </div>

              <div className="divide-y divide-border-subtle">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={14} className="text-text-muted" />
                      <div>
                        <span className="font-semibold text-text-primary block">{item.productName}</span>
                        <span className="text-text-muted text-[11px]">
                          Phân loại: {item.color} · Số lượng: x{item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-text-primary">
                      {formatVND(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="text-text-secondary text-[11px] max-w-md">
                  <strong>Địa chỉ nhận:</strong> {order.recipientName} ({order.recipientPhone}) - {order.shippingAddress}
                </div>

                <div className="flex items-center gap-4 ml-auto">
                  <div className="text-right">
                    <span className="text-[11px] text-text-muted block">Tổng tiền đơn:</span>
                    <span className="text-base font-black text-red-600">
                      {formatVND(order.totalAmount)}
                    </span>
                  </div>

                  {order.orderStatus === 'PENDING' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancelMutation.isPending}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {cancelMutation.isPending ? 'Đang hủy...' : 'Hủy đơn'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
