import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Settings,
  Menu,
  X,
  Phone,
  Package,
} from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

const NAV_CATEGORIES = [
  { name: 'Điện thoại', slug: 'dien-thoai' },
  { name: 'Laptop', slug: 'laptop' },
  { name: 'Máy tính bảng', slug: 'may-tinh-bang' },
  { name: 'Tai nghe', slug: 'tai-nghe' },
  { name: 'Đồng hồ thông minh', slug: 'dong-ho' },
  { name: 'Phụ kiện', slug: 'phu-kien' },
];

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, setIsOpen } = useCartStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();

  const totalItems = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB]">
      <div className="bg-[#111827] text-[#9CA3AF] text-[11px] py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="tel:18006969" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={10} />
              <span>Hotline: <strong className="text-white">1800.6969</strong> (miễn phí)</span>
            </a>
            <span className="text-[#4B5563]">|</span>
            <span>68 cửa hàng toàn quốc</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/account/orders" className="hover:text-white transition-colors">Tra cứu đơn hàng</Link>
            {isAuthenticated && isAdmin && (
              <Link to="/admin" className="text-[#FCD34D] hover:text-[#FDE68A] transition-colors flex items-center gap-1 font-semibold">
                <Settings size={10} />
                Quản trị
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4 lg:gap-6">
        <Link to="/" className="flex-shrink-0">
          <span className="text-[20px] font-extrabold tracking-tight text-[#111827] leading-none">
            MIN<span className="text-[#2563EB]">TECH</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="flex items-center bg-[#F5F6F8] border border-[#E5E7EB] rounded-md overflow-hidden focus-within:border-[#2563EB] focus-within:bg-white transition-colors">
            <input
              type="text"
              placeholder="Tìm sản phẩm, thương hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#111827] placeholder-[#9CA3AF] px-3 py-2.5 outline-none"
              aria-label="Tìm kiếm sản phẩm"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium transition-colors flex items-center gap-1.5"
              aria-label="Tìm kiếm"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Tìm</span>
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Link
            to="/account/orders"
            className="hidden sm:flex flex-col items-center px-2.5 py-1.5 rounded hover:bg-[#F5F6F8] transition-colors text-[#6B7280] hover:text-[#111827]"
            aria-label="Đơn hàng"
          >
            <Package size={18} />
            <span className="text-[10px] mt-0.5 font-medium">Đơn hàng</span>
          </Link>

          {isAuthenticated && user ? (
            <div className="relative group">
              <button className="flex flex-col items-center px-2.5 py-1.5 rounded hover:bg-[#F5F6F8] transition-colors text-[#6B7280] hover:text-[#111827]">
                <div className="w-[18px] h-[18px] rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] mt-0.5 font-medium max-w-[64px] truncate">{user.fullName.split(' ').pop()}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow-md py-1 hidden group-hover:block z-50">
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#2563EB] font-medium hover:bg-[#EFF6FF]">
                    <Settings size={13} />
                    Quản trị Admin
                  </Link>
                )}
                <Link to="/account/profile" className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#111827] hover:bg-[#F5F6F8]">
                  <UserIcon size={13} />
                  Tài khoản
                </Link>
                <Link to="/account/orders" className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#111827] hover:bg-[#F5F6F8]">
                  <Package size={13} />
                  Đơn hàng của tôi
                </Link>
                <div className="h-px bg-[#F3F4F6] my-1" aria-hidden="true"></div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#DC2626] hover:bg-[#FEF2F2] text-left"
                >
                  <LogOut size={13} />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center px-2.5 py-1.5 rounded hover:bg-[#F5F6F8] transition-colors text-[#6B7280] hover:text-[#111827]"
            >
              <UserIcon size={18} />
              <span className="text-[10px] mt-0.5 font-medium">Đăng nhập</span>
            </Link>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex flex-col items-center px-2.5 py-1.5 rounded hover:bg-[#F5F6F8] transition-colors text-[#6B7280] hover:text-[#111827]"
            aria-label={`Giỏ hàng, ${totalItems} sản phẩm`}
          >
            <div className="relative">
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Giỏ hàng</span>
          </button>

          <button
            className="md:hidden p-2 rounded hover:bg-[#F5F6F8] text-[#6B7280]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <nav className="border-t border-[#F3F4F6] hidden md:block" aria-label="Danh mục sản phẩm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0">
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="px-4 py-2.5 text-[13px] font-medium text-[#374151] hover:text-[#2563EB] hover:border-b-2 hover:border-[#2563EB] border-b-2 border-transparent transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/products?filter=sale"
              className="px-4 py-2.5 text-[13px] font-medium text-[#DC2626] hover:text-[#B91C1C] border-b-2 border-transparent hover:border-b-2 hover:border-[#DC2626] transition-colors whitespace-nowrap ml-2"
            >
              Giá tốt hôm nay
            </Link>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white">
          <form onSubmit={handleSearch} className="px-4 pt-3 pb-2">
            <div className="flex items-center bg-[#F5F6F8] border border-[#E5E7EB] rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-[13px] px-3 py-2.5 outline-none"
              />
              <button type="submit" className="px-3 py-2.5 bg-[#2563EB] text-white">
                <Search size={14} />
              </button>
            </div>
          </form>
          <nav className="px-4 pb-3">
            <div className="space-y-0.5">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/products?category=${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 text-[14px] text-[#374151] border-b border-[#F3F4F6] hover:text-[#2563EB]"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/products?filter=sale"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 text-[14px] text-[#DC2626] font-medium"
              >
                Giá tốt hôm nay
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
