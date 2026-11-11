import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không đúng định dạng'),
  phone: z.string().regex(/^(\+?84|0)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không trùng khớp',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await authApi.register({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      const authRes = await authApi.login({
        email: values.email,
        password: values.password,
      });

      const userRes = await authApi.getMe(authRes.accessToken);
      login(authRes.accessToken, userRes);

      navigate('/');
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      setErrorMessage(serverMsg || 'Đăng ký không thành công. Email có thể đã được sử dụng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-3">
            <span className="text-2xl font-black tracking-tight text-text-primary">
              MIN<span className="text-primary">TECH</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-text-primary">Tạo Tài Khoản Mới</h1>
          <p className="text-xs text-text-secondary mt-1">
            Gia nhập cộng đồng Mintech Member nhận voucher giảm giá 500k
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Họ và tên *
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('fullName')}
                placeholder="Nguyễn Văn A"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
              />
              <User size={16} className="absolute left-3 top-3 text-text-muted" />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Địa chỉ Email *
            </label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                placeholder="vidu@mintech.vn"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
              />
              <Mail size={16} className="absolute left-3 top-3 text-text-muted" />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Số điện thoại *
            </label>
            <div className="relative">
              <input
                type="tel"
                {...register('phone')}
                placeholder="0987654321"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
              />
              <Phone size={16} className="absolute left-3 top-3 text-text-muted" />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Mật khẩu *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full text-xs pl-9 pr-10 py-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
              />
              <Lock size={16} className="absolute left-3 top-3 text-text-muted" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Xác nhận lại mật khẩu *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Nhập lại mật khẩu vừa nhập"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-border bg-slate-50 focus:bg-white focus:border-primary focus:outline-none"
              />
              <Lock size={16} className="absolute left-3 top-3 text-text-muted" />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60 mt-4"
          >
            <span>{isLoading ? 'Đang khởi tạo...' : 'Đăng ký tài khoản'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-text-secondary">
          Bạn đã có tài khoản Mintech?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

