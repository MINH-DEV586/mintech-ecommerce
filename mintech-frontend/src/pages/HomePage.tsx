import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { productApi, categoryApi, brandApi } from '../services/api';

export const HomePage: React.FC = () => {
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: brandApi.getAll,
  });

  const featuredProducts = products.slice(0, 4);
  const phones = products.filter(
    (p) => p.categoryName === 'Điện thoại' || p.categoryName?.toLowerCase().includes('phone')
  );
  const laptops = products.filter(
    (p) => p.categoryName === 'Laptop' || p.categoryName?.toLowerCase().includes('laptop')
  );
  const accessories = products.filter(
    (p) =>
      p.categoryName === 'Tai nghe' ||
      p.categoryName?.toLowerCase().includes('tai nghe') ||
      p.categoryName?.toLowerCase().includes('phụ kiện')
  );

  return (
    <div className="pb-16">
      <section className="max-w-7xl mx-auto px-4 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 bg-[#111827] rounded-lg overflow-hidden flex min-h-[320px]">
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-10">
              <p className="text-[12px] text-[#6B7280] mb-3 font-medium">Hệ thống phân phối công nghệ chính hãng</p>
              <h1 className="text-[28px] md:text-[38px] font-bold text-white leading-tight mb-3">
                MINTECH
                <br />
                Precision Gear
              </h1>
              <p className="text-[13px] text-[#D1D5DB] mb-6 leading-relaxed max-w-[280px]">
                Điện thoại, Laptop và thiết bị âm thanh đỉnh cao. Trợ giá thu cũ đổi mới, bảo hành 1 đổi 1.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to="/products"
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold rounded transition-colors"
                >
                  Khám phá ngay
                </Link>
                <Link
                  to="/products?filter=sale"
                  className="px-5 py-2.5 text-[#D1D5DB] hover:text-white text-[13px] transition-colors"
                >
                  Sản phẩm nổi bật
                </Link>
              </div>
              <p className="mt-5 text-[12px] text-[#6B7280]">
                Giao hàng hỏa tốc 2h <span className="ml-1 text-[#16A34A]">· Bảo hành chính hãng 100%</span>
              </p>
            </div>
            <div className="hidden md:flex w-48 lg:w-56 bg-[#1F2937] items-end justify-center overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80"
                alt="Mintech Tech Banner"
                className="w-full object-contain object-bottom"
                style={{ maxHeight: '340px' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="bg-[#111827] rounded-lg p-5 flex flex-col justify-between min-h-[152px]">
              <div>
                <p className="text-[11px] text-[#6B7280] mb-1">Workstation · Sáng tạo</p>
                <h3 className="text-[16px] font-bold text-white mb-1.5">Laptop Hiệu Năng Cao</h3>
                <p className="text-[12px] text-[#9CA3AF] leading-relaxed">
                  Trang bị chip M3 / Intel Core Ultra xử lý đồ họa mượt mà.
                </p>
              </div>
              <Link
                to="/products?category=laptop"
                className="mt-3 text-[12px] font-semibold text-[#60A5FA] hover:text-white flex items-center gap-1 transition-colors"
              >
                Khám phá <ArrowRight size={12} />
              </Link>
            </div>
            <div className="bg-[#111827] rounded-lg p-5 flex flex-col justify-between min-h-[152px]">
              <div>
                <p className="text-[11px] text-[#6B7280] mb-1">Flagship · AI</p>
                <h3 className="text-[16px] font-bold text-white mb-1.5">Smartphone Đỉnh Cao</h3>
                <p className="text-[12px] text-[#9CA3AF] leading-relaxed">
                  Thiết kế titanium, camera zoom quang học và trợ lý ảo thông minh.
                </p>
              </div>
              <Link
                to="/products?category=dien-thoai"
                className="mt-3 text-[12px] font-semibold text-[#34D399] hover:text-white flex items-center gap-1 transition-colors"
              >
                Xem chi tiết <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 rounded-lg overflow-hidden bg-white">
          <div className="px-5 py-3 text-[13px] bg-white">
            <span className="font-semibold text-[#111827]">Thu cũ đổi mới</span>
            <span className="text-[#6B7280] ml-1.5">Trợ giá thêm tới 30%</span>
          </div>
          <div className="px-5 py-3 text-[13px] bg-[#F5F6F8]">
            <span className="font-semibold text-[#111827]">Bảo hành 1 đổi 1</span>
            <span className="text-[#6B7280] ml-1.5">12 tháng tại cửa hàng</span>
          </div>
          <div className="px-5 py-3 text-[13px] bg-white">
            <span className="font-semibold text-[#111827]">Giao nhanh 2h</span>
            <span className="text-[#6B7280] ml-1.5">Nội thành Hà Nội & TP.HCM</span>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-bold text-[#111827]">Danh mục sản phẩm</h2>
            <Link to="/products" className="text-[13px] text-[#2563EB] hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group bg-white rounded-lg p-3 flex flex-col items-center text-center hover:bg-[#EFF6FF] transition-colors duration-150"
              >
                <div className="w-10 h-10 flex items-center justify-center overflow-hidden mb-2">
                  <img src={cat.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80'} alt={cat.name} className="w-8 h-8 object-contain" />
                </div>
                <span className="text-[12px] font-medium text-[#374151] group-hover:text-[#2563EB] leading-tight transition-colors duration-150">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-bold text-[#111827]">Sản phẩm nổi bật</h2>
            <p className="text-[12px] text-[#6B7280] mt-0.5">Thiết bị công nghệ phân phối chính hãng từ kho</p>
          </div>
          <Link
            to="/products"
            className="text-[13px] font-medium text-[#2563EB] hover:underline flex items-center gap-1"
          >
            Xem tất cả <ArrowRight size={13} />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="py-12 flex justify-center items-center text-text-muted">
            <Loader2 size={24} className="animate-spin text-primary mr-2" />
            <span className="text-xs">Đang tải danh sách sản phẩm...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-text-muted text-xs">
            Chưa có sản phẩm nào được tạo. Vui lòng đăng nhập quyền Admin để thêm sản phẩm vào hệ thống.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {phones.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[17px] font-bold text-[#111827]">Điện thoại nổi bật</h2>
            <Link
              to="/products?category=dien-thoai"
              className="text-[13px] font-medium text-[#2563EB] hover:underline flex items-center gap-1"
            >
              Tất cả điện thoại <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {phones.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {laptops.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[17px] font-bold text-[#111827]">Laptop bán chạy</h2>
            <Link
              to="/products?category=laptop"
              className="text-[13px] font-medium text-[#2563EB] hover:underline flex items-center gap-1"
            >
              Tất cả laptop <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {laptops.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {accessories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[17px] font-bold text-[#111827]">Phụ kiện & Âm thanh</h2>
            <Link
              to="/products"
              className="text-[13px] font-medium text-[#2563EB] hover:underline flex items-center gap-1"
            >
              Xem thêm <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {accessories.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {brands.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <h2 className="text-[14px] font-semibold text-[#6B7280] mb-3">Thương hiệu chính hãng</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/products?brand=${brand.slug}`}
                className="h-12 bg-white rounded-lg flex items-center justify-center text-[13px] font-semibold text-[#374151] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors duration-150"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
