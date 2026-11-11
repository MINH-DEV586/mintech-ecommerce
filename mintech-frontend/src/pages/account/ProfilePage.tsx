import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, ShieldCheck, Check, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { userApi } from '../../services/api';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMsg(null);
    try {
      const updatedUser = await userApi.updateProfile({ fullName, phone });
      updateUser(updatedUser);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Không thể cập nhật hồ sơ người dùng.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-text-primary mb-2">Thông Tin Tài Khoản</h1>
      <p className="text-xs text-text-secondary mb-6">
        Cập nhật thông tin cá nhân và quản lý bảo mật tài khoản thành viên Mintech từ máy chủ
      </p>

      <div className="bg-white rounded-2xl border border-border p-6 md:p-8 space-y-6">
        {isSaved && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold flex items-center gap-2">
            <Check size={16} />
            <span>Đã cập nhật thông tin thành công lên máy chủ!</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Họ và tên *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
              />
              <UserIcon size={16} className="absolute left-3 top-3 text-text-muted" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Địa chỉ Email (Định danh tài khoản)
            </label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-border bg-slate-100 text-text-muted cursor-not-allowed"
              />
              <Mail size={16} className="absolute left-3 top-3 text-text-muted" />
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              Email dùng để đăng nhập và nhận thông báo đơn hàng.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại..."
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
              />
              <Phone size={16} className="absolute left-3 top-3 text-text-muted" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-primary" />
              <div>
                <span className="text-xs font-bold text-text-primary block">
                  Vai trò tài khoản: {user?.role || 'CUSTOMER'}
                </span>
                <span className="text-[11px] text-text-muted">
                  Trạng thái: <strong className="text-emerald-600">{user?.status || 'ACTIVE'}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isUpdating && <Loader2 size={14} className="animate-spin" />}
            <span>{isUpdating ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
