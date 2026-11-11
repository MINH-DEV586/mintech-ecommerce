import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const authRes = await authApi.login(values);

      const userRes = await authApi.getMe(authRes.accessToken);
      login(authRes.accessToken, userRes);

      if (userRes.role === 'ADMIN') {
        navigate(from && from.startsWith('/admin') ? from : '/admin', { replace: true });
      } else {
        navigate(from && !from.startsWith('/admin') ? from : '/account/profile', { replace: true });
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        setErrorMessage('Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau một phút.');
        return;
      }
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      setErrorMessage(
        serverMessage || 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.'
      );
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
          <h1 className="text-xl font-bold text-text-primary">Đăng Nhập Tài Khoản</h1>
          <p className="text-xs text-text-secondary mt-1">
            Quản lý đơn hàng, địa chỉ giao hàng và nhận ưu đãi độc quyền
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Địa chỉ Email
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-text-primary">
                Mật khẩu
              </label>
              <a href="#" className="text-[11px] font-medium text-primary hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60 mt-2"
          >
            <span>{isLoading ? 'Đang xác thực...' : 'Đăng nhập ngay'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-text-secondary">
          Bạn chưa có tài khoản Mintech?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Đăng ký thành viên
          </Link>
        </div>
      </div>
    </div>
  );
};

