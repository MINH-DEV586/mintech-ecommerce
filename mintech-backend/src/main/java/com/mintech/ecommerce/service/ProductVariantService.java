package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.ProductVariantRequest;
import com.mintech.ecommerce.dto.response.ProductVariantResponse;

import java.util.List;

public interface ProductVariantService {

    ProductVariantResponse createVariant(Long productId, ProductVariantRequest request);

    List<ProductVariantResponse> getVariantsByProductId(Long productId);

    ProductVariantResponse getVariantById(Long id);

    ProductVariantResponse updateVariant(Long id, ProductVariantRequest request);

    void deleteVariant(Long id);
}
