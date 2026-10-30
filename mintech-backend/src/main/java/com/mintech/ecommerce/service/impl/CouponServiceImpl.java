package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.dto.request.CouponRequest;
import com.mintech.ecommerce.dto.response.CouponResponse;
import com.mintech.ecommerce.entity.Coupon;
import com.mintech.ecommerce.repository.CouponRepository;
import com.mintech.ecommerce.service.CouponService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    @Transactional
    public CouponResponse createCoupon(CouponRequest request) {
        if (couponRepository.findByCode(request.getCode().trim().toUpperCase()).isPresent()) {
            throw new IllegalArgumentException("Mã giảm giá '" + request.getCode() + "' đã tồn tại");
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode().trim().toUpperCase())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minOrderAmount(request.getMinOrderAmount())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .usageLimitPerUser(request.getUsageLimitPerUser() != null ? request.getUsageLimitPerUser() : 1)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus() != null ? request.getStatus() : Coupon.CouponStatus.ACTIVE)
                .build();

        return mapToResponse(couponRepository.save(coupon));
    }

    @Override
    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CouponResponse getCouponById(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Mã giảm giá không tồn tại với ID: " + id));
        return mapToResponse(coupon);
    }

    @Override
    @Transactional
    public CouponResponse updateCoupon(UUID id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Mã giảm giá không tồn tại với ID: " + id));

        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderAmount(request.getMinOrderAmount());
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setUsageLimit(request.getUsageLimit());
        if (request.getUsageLimitPerUser() != null) {
            coupon.setUsageLimitPerUser(request.getUsageLimitPerUser());
        }
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());
        if (request.getStatus() != null) {
            coupon.setStatus(request.getStatus());
        }

        return mapToResponse(couponRepository.save(coupon));
    }

    @Override
    @Transactional
    public void deleteCoupon(UUID id) {
        if (!couponRepository.existsById(id)) {
            throw new EntityNotFoundException("Mã giảm giá không tồn tại với ID: " + id);
        }
        couponRepository.deleteById(id);
    }

    @Override
    public CouponResponse validateCoupon(String code, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCode(code.trim().toUpperCase())
                .orElseThrow(() -> new EntityNotFoundException("Mã giảm giá không tồn tại"));

        LocalDateTime now = LocalDateTime.now();

        if (coupon.getStatus() != Coupon.CouponStatus.ACTIVE) {
            throw new IllegalArgumentException("Mã giảm giá hiện không khả dụng");
        }
        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            throw new IllegalArgumentException("Mã giảm giá chưa đến thời gian áp dụng");
        }
        if (coupon.getEndDate() != null && now.isAfter(coupon.getEndDate())) {
            throw new IllegalArgumentException("Mã giảm giá đã hết hạn");
        }
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new IllegalArgumentException("Mã giảm giá đã hết lượt sử dụng");
        }
        if (coupon.getMinOrderAmount() != null && orderAmount != null && orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new IllegalArgumentException("Đơn hàng phải tối thiểu " + coupon.getMinOrderAmount() + " để áp dụng mã này");
        }

        return mapToResponse(coupon);
    }

    private CouponResponse mapToResponse(Coupon coupon) {
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minOrderAmount(coupon.getMinOrderAmount())
                .maxDiscountAmount(coupon.getMaxDiscountAmount())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .usageLimitPerUser(coupon.getUsageLimitPerUser())
                .startDate(coupon.getStartDate())
                .endDate(coupon.getEndDate())
                .status(coupon.getStatus())
                .build();
    }
}

