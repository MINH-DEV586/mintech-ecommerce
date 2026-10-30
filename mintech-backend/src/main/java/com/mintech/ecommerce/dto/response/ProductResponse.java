package com.mintech.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ProductResponse {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String status;
    private String thumbnailUrl;

    private UUID categoryId;
    private String categoryName;

    private UUID brandId;
    private String brandName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<ProductVariantResponse> variants;
    private List<ProductImageResponse> images;
    private List<ProductSpecificationResponse> specifications;
}
