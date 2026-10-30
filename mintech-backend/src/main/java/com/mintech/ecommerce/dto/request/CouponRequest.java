package com.mintech.ecommerce.dto.request;

import com.mintech.ecommerce.entity.Coupon;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {

    @NotBlank(message = "Mã giảm giá không được để trống")
    @Size(max = 50, message = "Mã không được vượt quá 50 ký tự")
    private String code;

    @NotNull(message = "Loại giảm giá không được để trống (PERCENTAGE hoặc FIXED_AMOUNT)")
    private Coupon.DiscountType discountType;

    @NotNull(message = "Giá trị giảm không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị giảm phải lớn hơn 0")
    private BigDecimal discountValue;

    private BigDecimal minOrderAmount;

    private BigDecimal maxDiscountAmount;

    @Min(value = 1, message = "Giới hạn sử dụng phải ít nhất là 1")
    private Integer usageLimit;

    private Integer usageLimitPerUser;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Coupon.CouponStatus status;
}

