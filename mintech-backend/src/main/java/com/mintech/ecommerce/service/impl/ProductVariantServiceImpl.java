package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.exception.ResourceNotFoundException;
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
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public ProductVariantResponse createVariant(UUID productId, ProductVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

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
    public List<ProductVariantResponse> getVariantsByProductId(UUID productId) {
        return productVariantRepository.findByProductId(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductVariantResponse getVariantById(UUID id) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Biến thể sản phẩm không tồn tại"));
        return mapToResponse(variant);
    }

    @Override
    @Transactional
    public ProductVariantResponse updateVariant(UUID id, ProductVariantRequest request) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Biến thể sản phẩm không tồn tại"));

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
    public void deleteVariant(UUID id) {
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
