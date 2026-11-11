import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Mail, Phone, Loader2 } from 'lucide-react';
import { userApi } from '../../services/api';

export const AdminCustomersPage: React.FC = () => {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: userApi.getAll,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-text-primary">Quản Lý Khách Hàng</h1>
        <p className="text-xs text-text-secondary mt-1">
          Danh sách tài khoản thành viên và phân quyền người dùng trong hệ thống
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-subtle">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-text-muted">
            <Loader2 size={32} className="animate-spin text-primary mb-3" />
            <span className="text-xs font-medium">Đang tải danh sách người dùng...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-xs">
            Không thể tải danh sách người dùng từ máy chủ. Vui lòng kiểm tra quyền truy cập.
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <Users size={40} className="mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm text-text-primary">Chưa có người dùng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-text-muted font-bold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="p-4">Khách hàng / Thành viên</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Vai trò (Role)</th>
                  <th className="p-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {u.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <span className="font-bold text-text-primary block">{u.fullName}</span>
                          <span className="text-[10px] text-text-muted font-mono">{u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-text-primary font-medium">{u.email}</td>
                    <td className="p-4 text-text-secondary">{u.phone || 'Chưa cập nhật'}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa'}
                      </span>
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
