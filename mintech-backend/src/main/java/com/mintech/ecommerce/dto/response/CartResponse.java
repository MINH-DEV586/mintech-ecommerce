package com.mintech.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private BigDecimal totalPrice;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class CartItemResponse {
        private Long cartItemId;
        private Long productVariantId;
        private String productName;
        private String color;
        private String sku;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal subtotal;
    }
}

