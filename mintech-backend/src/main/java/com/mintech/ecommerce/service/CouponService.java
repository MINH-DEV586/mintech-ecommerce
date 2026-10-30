package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.CouponRequest;
import com.mintech.ecommerce.dto.response.CouponResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface CouponService {
    CouponResponse createCoupon(CouponRequest request);
    List<CouponResponse> getAllCoupons();
    CouponResponse getCouponById(UUID id);
    CouponResponse updateCoupon(UUID id, CouponRequest request);
    void deleteCoupon(UUID id);
    CouponResponse validateCoupon(String code, BigDecimal orderAmount);
}

