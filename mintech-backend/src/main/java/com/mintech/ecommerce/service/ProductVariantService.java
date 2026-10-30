package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.ProductVariantRequest;
import com.mintech.ecommerce.dto.response.ProductVariantResponse;

import java.util.List;
import java.util.UUID;

public interface ProductVariantService {

    ProductVariantResponse createVariant(UUID productId, ProductVariantRequest request);

    List<ProductVariantResponse> getVariantsByProductId(UUID productId);

    ProductVariantResponse getVariantById(UUID id);

    ProductVariantResponse updateVariant(UUID id, ProductVariantRequest request);

    void deleteVariant(UUID id);
}
