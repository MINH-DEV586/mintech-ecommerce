package com.mintech.ecommerce.controller;

import com.mintech.ecommerce.dto.request.CouponRequest;
import com.mintech.ecommerce.dto.response.CouponResponse;
import com.mintech.ecommerce.service.CouponService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // Khách hàng / Public kiểm tra tính hợp lệ của mã giảm giá
    @GetMapping("/validate")
    public ResponseEntity<CouponResponse> validateCoupon(
            @RequestParam String code,
            @RequestParam(required = false) BigDecimal amount) {
        return ResponseEntity.ok(couponService.validateCoupon(code, amount));
    }

    // ADMIN: Xem toàn bộ mã giảm giá
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<CouponResponse>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    // ADMIN: Chi tiết mã giảm giá
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<CouponResponse> getCouponById(@PathVariable UUID id) {
        return ResponseEntity.ok(couponService.getCouponById(id));
    }

    // ADMIN: Tạo mã giảm giá mới
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<CouponResponse> createCoupon(@Valid @RequestBody CouponRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(couponService.createCoupon(request));
    }

    // ADMIN: Sửa mã giảm giá
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CouponResponse> updateCoupon(
            @PathVariable UUID id,
            @Valid @RequestBody CouponRequest request) {
        return ResponseEntity.ok(couponService.updateCoupon(id, request));
    }

    // ADMIN: Xóa mã giảm giá
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}

