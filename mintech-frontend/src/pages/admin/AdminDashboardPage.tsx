import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { formatVND } from '../../lib/utils';
import { productApi, orderApi, userApi } from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: productApi.getAll,
  });

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderApi.getAllOrders(),
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: userApi.getAll,
  });

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING');
  const recentOrders = orders.slice(0, 5);

  const revenueChartData = [
    { month: 'T7', revenue: totalRevenue * 0.15, orders: Math.floor(orders.length * 0.15) },
    { month: 'T8', revenue: totalRevenue * 0.20, orders: Math.floor(orders.length * 0.20) },
    { month: 'T9', revenue: totalRevenue * 0.25, orders: Math.floor(orders.length * 0.25) },
    { month: 'T10', revenue: totalRevenue * 0.40, orders: Math.ceil(orders.length * 0.40) || orders.length },
  ];

  const isLoading = loadingProducts || loadingOrders || loadingUsers;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-text-primary">Tổng Quan Hệ Thống</h1>
        <p className="text-xs text-text-secondary mt-1">
          Báo cáo doanh số bán hàng, lượng đơn đặt và số lượng thiết bị thực tế từ cơ sở dữ liệu
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-text-muted">
          <Loader2 size={32} className="animate-spin text-primary mb-3" />
          <span className="text-xs font-medium">Đang tổng hợp dữ liệu hệ thống...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-muted block">Tổng Doanh Thu Đơn Hàng</span>
                <span className="text-2xl font-black text-text-primary mt-1 block">
                  {formatVND(totalRevenue)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-1 mt-1">
                  <TrendingUp size={12} /> {orders.length} giao dịch
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                <DollarSign size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-muted block">Tổng Đơn Hàng</span>
                <span className="text-2xl font-black text-text-primary mt-1 block">{orders.length} đơn</span>
                <span className="text-[11px] font-semibold text-amber-600 inline-flex items-center gap-1 mt-1">
                  <Clock size={12} /> {pendingOrders.length} đơn chờ duyệt
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-muted block">Sản Phẩm Trong Kho</span>
                <span className="text-2xl font-black text-text-primary mt-1 block">
                  {products.length} sản phẩm
                </span>
                <span className="text-[11px] font-medium text-text-muted mt-1 block">
                  Đang phân phối tại Mintech
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Package size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-muted block">Thành Viên Hệ Thống</span>
                <span className="text-2xl font-black text-text-primary mt-1 block">
                  {users.length} tài khoản
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-1 mt-1">
                  <TrendingUp size={12} /> Đồng bộ cơ sở dữ liệu
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-border shadow-subtle space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-text-primary">Biểu Đồ Doanh Thu Ước Tính (VND)</h3>
                <span className="text-xs font-semibold text-primary bg-primary-subtle px-2.5 py-1 rounded-md">
                  Theo kỳ kinh doanh
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip 
                      formatter={(val: any) => [formatVND(val), 'Doanh thu']}
                      labelFormatter={(lbl) => `Kỳ ${lbl}`}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-border shadow-subtle space-y-4">
              <h3 className="text-sm font-bold text-text-primary">Lượng Đơn Hàng Phân Bổ</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip formatter={(val: any) => [`${val} đơn`, 'Số lượng đơn']} />
                    <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-text-primary">Đơn Hàng Gần Đây Cần Xử Lý</h3>
            {recentOrders.length === 0 ? (
              <p className="text-xs text-text-muted py-4">Chưa có đơn hàng nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-text-muted font-bold uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="p-3">Mã đơn</th>
                      <th className="p-3">Khách hàng</th>
                      <th className="p-3">Tổng tiền</th>
                      <th className="p-3">Thanh toán</th>
                      <th className="p-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-primary">{ord.orderCode}</td>
                        <td className="p-3 font-semibold text-text-primary">{ord.recipientName}</td>
                        <td className="p-3 font-bold text-red-600">{formatVND(ord.totalAmount)}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 font-semibold">
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
