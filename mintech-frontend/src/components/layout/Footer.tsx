import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#E5E7EB]">
      <div className="bg-[#111827] text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <div>
            <span className="text-[20px] font-extrabold text-white tracking-tight block mb-3">
              MIN<span className="text-[#60A5FA]">TECH</span>
            </span>
            <p className="text-[13px] text-[#6B7280] leading-relaxed mb-4">
              Hệ thống bán lẻ điện thoại, laptop và phụ kiện công nghệ chính hãng toàn quốc.
            </p>
            <div className="space-y-1.5 text-[13px]">
              <p>Hotline mua hàng: <strong className="text-white">1800.6969</strong></p>
              <p>Bảo hành & sửa chữa: <strong className="text-white">1800.6971</strong></p>
              <p className="text-[#6B7280]">cskh@mintech.vn</p>
              <p className="text-[#6B7280] text-[12px] mt-2">Trụ sở: Mintech Tower, Cầu Giấy, Hà Nội</p>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white mb-3">Chính sách mua hàng</h4>
            <ul className="space-y-2 text-[13px]">
              {['Chính sách bảo hành', 'Vận chuyển & giao nhận', 'Đổi trả trong 30 ngày', 'Bảo mật thông tin', 'Trả góp 0% lãi suất'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white mb-3">Về Mintech</h4>
            <ul className="space-y-2 text-[13px]">
              {['Giới thiệu hệ thống', '68 cửa hàng toàn quốc', 'Tuyển dụng', 'Bán hàng doanh nghiệp B2B', 'Đại lý ủy quyền Apple & Samsung'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white mb-3">Phương thức thanh toán</h4>
            <div className="flex flex-wrap gap-2 mb-5">
              {['COD', 'VNPay', 'MoMo', 'Thẻ tín dụng', 'Trả góp', 'Chuyển khoản'].map((method) => (
                <span key={method} className="px-2 py-1 bg-[#1F2937] border border-[#374151] rounded text-[11px] font-medium text-[#D1D5DB]">
                  {method}
                </span>
              ))}
            </div>
            <h4 className="text-[13px] font-semibold text-white mb-2">Khu vực giao hàng</h4>
            <p className="text-[13px]">Toàn quốc · Hỏa tốc 2h tại Hà Nội & TP.HCM</p>
          </div>
        </div>

        <div className="border-t border-[#1F2937] px-4 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#4B5563]">
            <p>© 2026 MINTECH. Đăng ký kinh doanh số 0123456789 do Sở KHĐT Hà Nội cấp.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[#9CA3AF] transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-[#9CA3AF] transition-colors">Bảo mật</a>
              <a href="#" className="hover:text-[#9CA3AF] transition-colors">Cookie</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
