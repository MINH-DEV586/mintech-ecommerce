package com.mintech.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductVariantResponse {
    private Long id;
    private String sku;
    private String color;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String status;
}
