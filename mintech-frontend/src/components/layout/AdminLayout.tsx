import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  LogOut, 
  Store,
  Bell,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Tổng quan Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Quản lý Sản phẩm', path: '/admin/products', icon: Package },
    { label: 'Quản lý Danh mục', path: '/admin/categories', icon: Layers },
    { label: 'Quản lý Đơn hàng', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Quản lý Khách hàng', path: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0 z-20">
        <div>
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold text-base">
              M
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">MINTECH</span>
              <span className="text-[10px] text-primary-light block font-semibold uppercase tracking-wider">
                Management Suite
              </span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Hệ thống
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Store size={16} />
            <span>Xem trang bán lẻ</span>
          </Link>

          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{user?.fullName || 'Admin User'}</div>
                <div className="text-[10px] text-emerald-400 font-medium">Administrator</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 p-1"
              title="Đăng xuất"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-border px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-primary border border-blue-200">
              <ShieldCheck size={14} />
              Admin Portal
            </span>
            <span className="text-xs text-text-muted">
              Kết nối trực tiếp cơ sở dữ liệu Spring Boot
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-slate-100 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="text-xs text-right hidden sm:block">
              <div className="font-semibold text-text-primary">{user?.email || 'admin@mintech.vn'}</div>
              <div className="text-[11px] text-text-muted">Role: {user?.role || 'ADMIN'}</div>
            </div>
          </div>
        </header>

        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

