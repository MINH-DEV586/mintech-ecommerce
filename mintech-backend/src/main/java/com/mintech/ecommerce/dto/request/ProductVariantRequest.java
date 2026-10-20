package com.mintech.ecommerce.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductVariantRequest {

    @NotBlank(message = "Màu sắc không được để trống")
    @Size(max = 50, message = "Màu sắc không được vượt quá 50 ký tự")
    private String color;

    @NotNull(message = "Giá bán không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá bán phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Giá gốc không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá gốc phải lớn hơn 0")
    private BigDecimal originalPrice;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 0, message = "Số lượng tồn kho không được âm")
    private Integer stockQuantity;

    @Size(max = 50, message = "SKU không được vượt quá 50 ký tự")
    private String sku;

    @Pattern(regexp = "^(ACTIVE|INACTIVE)$",
            message = "Trạng thái phải là ACTIVE hoặc INACTIVE")
    private String status = "ACTIVE";
}