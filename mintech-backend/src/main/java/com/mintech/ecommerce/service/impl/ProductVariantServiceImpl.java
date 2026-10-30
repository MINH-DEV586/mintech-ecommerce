package com.mintech.ecommerce.service.impl;

import org.springframework.stereotype.Service;

import com.mintech.ecommerce.dto.request.ProductVariantRequest;
import com.mintech.ecommerce.dto.response.ProductVariantResponse;
import com.mintech.ecommerce.entity.Product;
import com.mintech.ecommerce.entity.ProductVariant;
import com.mintech.ecommerce.repository.ProductRepository;
import com.mintech.ecommerce.repository.ProductVariantRepository;
import com.mintech.ecommerce.service.ProductVariantService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public ProductVariantResponse createVariant(Long productId, ProductVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setSku(request.getSku());
        variant.setColor(request.getColor());
        variant.setPrice(request.getPrice());
        variant.setOriginalPrice(request.getOriginalPrice());
        variant.setStockQuantity(request.getStockQuantity());
        variant.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        return mapToResponse(productVariantRepository.save(variant));
    }

    @Override
    public List<ProductVariantResponse> getVariantsByProductId(Long productId) {
        return productVariantRepository.findByProductId(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductVariantResponse getVariantById(Long id) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Biến thể sản phẩm không tồn tại"));
        return mapToResponse(variant);
    }

    @Override
    @Transactional
    public ProductVariantResponse updateVariant(Long id, ProductVariantRequest request) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Biến thể sản phẩm không tồn tại"));

        variant.setSku(request.getSku());
        variant.setColor(request.getColor());
        variant.setPrice(request.getPrice());
        variant.setOriginalPrice(request.getOriginalPrice());
        variant.setStockQuantity(request.getStockQuantity());
        variant.setStatus(request.getStatus() != null ? request.getStatus() : variant.getStatus());

        return mapToResponse(productVariantRepository.save(variant));
    }

    @Override
    @Transactional
    public void deleteVariant(Long id) {
        productVariantRepository.deleteById(id);
    }

    private ProductVariantResponse mapToResponse(ProductVariant variant) {
        return ProductVariantResponse.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .color(variant.getColor())
                .price(variant.getPrice())
                .originalPrice(variant.getOriginalPrice())
                .stockQuantity(variant.getStockQuantity())
                .status(variant.getStatus())
                .build();
    }
}
