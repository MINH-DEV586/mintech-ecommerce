package com.mintech.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String status;
    private String thumbnailUrl;

    private Long categoryId;
    private String categoryName;

    private Long brandId;
    private String brandName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<ProductVariantResponse> variants;
    private List<ProductImageResponse> images;
    private List<ProductSpecificationResponse> specifications;
}
