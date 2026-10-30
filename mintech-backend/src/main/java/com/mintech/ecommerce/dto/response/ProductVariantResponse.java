package com.mintech.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ProductVariantResponse {
    private UUID id;
    private String sku;
    private String color;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String status;
}
