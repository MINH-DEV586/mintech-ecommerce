import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, CheckCircle2, Clock, Truck, XCircle, Loader2 } from 'lucide-react';
import { formatVND } from '../../lib/utils';
import { Order, OrderStatus } from '../../types';
import { orderApi } from '../../services/api';

export const AdminOrdersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderApi.getAllOrders(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: OrderStatus }) =>
      orderApi.updateStatus(id, { orderStatus: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Cập nhật trạng thái đơn hàng thất bại');
    },
  });

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-text-primary">Quản Lý Đơn Hàng</h1>
        <p className="text-xs text-text-secondary mt-1">
          Theo dõi trạng thái giao hàng, duyệt đơn và cập nhật thanh toán từ hệ thống
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-subtle">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-text-muted">
            <Loader2 size={32} className="animate-spin text-primary mb-3" />
            <span className="text-xs font-medium">Đang tải danh sách đơn hàng...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-xs">
            Không thể tải danh sách đơn hàng. Vui lòng kiểm tra quyền quản trị và kết nối backend.
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <ShoppingCart size={40} className="mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm text-text-primary">Chưa có đơn hàng nào trong hệ thống</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-text-muted font-bold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="p-4">Mã đơn & Ngày tạo</th>
                  <th className="p-4">Khách hàng / Nhận hàng</th>
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Tổng tiền</th>
                  <th className="p-4">Thanh toán</th>
                  <th className="p-4">Trạng thái xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-primary block">{ord.orderCode}</span>
                      <span className="text-[11px] text-text-muted">
                        {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-text-primary block">{ord.recipientName}</span>
                      <span className="text-[11px] text-text-muted">{ord.recipientPhone}</span>
                      <span className="text-[11px] text-text-muted block line-clamp-1 max-w-xs">
                        {ord.shippingAddress}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        {ord.items?.map((item) => (
                          <div key={item.id} className="text-[11px]">
                            • {item.productName} <span className="text-text-muted">(x{item.quantity})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-red-600 text-sm">
                      {formatVND(ord.totalAmount)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${ord.paymentStatus === 'PAID'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                          }`}
                      >
                        {ord.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                        disabled={updateStatusMutation.isPending}
                        className="bg-slate-50 border border-border rounded-lg px-2.5 py-1.5 font-semibold text-xs text-text-primary focus:outline-none focus:border-primary disabled:opacity-50"
                      >
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="SHIPPING">Đang giao hàng</option>
                        <option value="DELIVERED">Đã giao thành công</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
