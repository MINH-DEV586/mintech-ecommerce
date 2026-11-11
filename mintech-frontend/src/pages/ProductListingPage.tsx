import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, SlidersHorizontal, ArrowUpDown, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { productApi, categoryApi, brandApi } from '../services/api';

export const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  const queryParam = searchParams.get('q');

  const { data: allProducts = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
  });

  const { data: allCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  const { data: allBrands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: brandApi.getAll,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(brandParam || 'all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');
  const [priceRange, setPriceRange] = useState<number>(100000000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        if (selectedCategory !== 'all') {
          const cat = allCategories.find((c) => c.slug === selectedCategory);
          if (cat && product.categoryName !== cat.name) return false;
        }

        if (selectedBrand !== 'all') {
          const brand = allBrands.find((b) => b.slug === selectedBrand);
          if (brand && product.brandName !== brand.name) return false;
        }

        if (queryParam) {
          const q = queryParam.toLowerCase();
          const matchName = product.name?.toLowerCase().includes(q);
          const matchDesc = product.description?.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        const minPrice = product.variants?.[0]?.price || 0;
        if (minPrice > priceRange) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.variants?.[0]?.price || 0;
        const priceB = b.variants?.[0]?.price || 0;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [allProducts, allCategories, allBrands, selectedCategory, selectedBrand, queryParam, priceRange, sortBy]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleBrandChange = (slug: string) => {
    setSelectedBrand(slug);
    if (slug === 'all') {
      searchParams.delete('brand');
    } else {
      searchParams.set('brand', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-text-primary">
          {queryParam
            ? `Kết quả tìm kiếm cho: "${queryParam}"`
            : selectedCategory !== 'all'
            ? allCategories.find((c) => c.slug === selectedCategory)?.name || 'Sản phẩm'
            : 'Tất cả sản phẩm công nghệ'}
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm chính hãng có sẵn từ máy chủ
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-64 bg-white rounded-xl border border-border p-5 space-y-6 flex-shrink-0 hidden lg:block">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Filter size={18} className="text-primary" />
            <span className="font-bold text-sm text-text-primary">Bộ lọc sản phẩm</span>
          </div>

          <div>
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2.5">
              Danh mục
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-secondary hover:bg-slate-50'
                }`}
              >
                Tất cả danh mục
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-primary text-white font-semibold'
                      : 'text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {allBrands.length > 0 && (
            <div className="border-t border-border-subtle pt-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2.5">
                Thương hiệu
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleBrandChange('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedBrand === 'all'
                      ? 'bg-primary text-white font-semibold'
                      : 'text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  Tất cả thương hiệu
                </button>
                {allBrands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandChange(brand.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      selectedBrand === brand.slug
                        ? 'bg-primary text-white font-semibold'
                        : 'text-text-secondary hover:bg-slate-50'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border-subtle pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Mức giá tối đa
              </h3>
            </div>
            <input
              type="range"
              min={1000000}
              max={100000000}
              step={1000000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="text-xs font-semibold text-primary mt-1 text-right">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange)}
            </div>
          </div>
        </aside>

        <div className="flex-1 w-full">
          <div className="bg-white p-3.5 rounded-xl border border-border mb-6 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-primary"
            >
              <SlidersHorizontal size={14} className="text-primary" />
              <span>Bộ lọc</span>
            </button>

            <div className="flex items-center gap-2 ml-auto text-xs">
              <ArrowUpDown size={14} className="text-text-muted" />
              <span className="font-medium text-text-secondary">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-border rounded-md px-2.5 py-1.5 font-medium text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="default">Nổi bật nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
              </select>
            </div>
          </div>

          {loadingProducts ? (
            <div className="py-20 flex flex-col items-center justify-center text-text-muted">
              <Loader2 size={32} className="animate-spin text-primary mb-3" />
              <span className="text-xs font-medium">Đang tải danh sách sản phẩm...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <p className="text-base font-semibold text-text-primary mb-1">
                Không tìm thấy sản phẩm phù hợp
              </p>
              <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
                Hãy thử chọn lại danh mục hoặc nới rộng khoảng giá để tìm được sản phẩm ưng ý.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setPriceRange(100000000);
                  setSearchParams({});
                }}
                className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
