package com.mintech.ecommerce.controller;

import com.mintech.ecommerce.dto.request.ProductVariantRequest;
import com.mintech.ecommerce.dto.response.ProductVariantResponse;
import com.mintech.ecommerce.service.ProductVariantService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products/{productId}/variants")
@RequiredArgsConstructor
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProductVariantResponse> createVariant(
            @PathVariable UUID productId,
            @Valid @RequestBody ProductVariantRequest request) {
        ProductVariantResponse response = productVariantService.createVariant(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProductVariantResponse>> getVariantsByProduct(@PathVariable UUID productId) {
        List<ProductVariantResponse> variants = productVariantService.getVariantsByProductId(productId);
        return ResponseEntity.ok(variants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductVariantResponse> getVariantById(
            @PathVariable UUID productId,
            @PathVariable UUID id) {
        ProductVariantResponse response = productVariantService.getVariantById(id);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductVariantResponse> updateVariant(
            @PathVariable UUID productId,
            @PathVariable UUID id,
            @Valid @RequestBody ProductVariantRequest request) {
        ProductVariantResponse response = productVariantService.updateVariant(id, request);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVariant(
            @PathVariable UUID productId,
            @PathVariable UUID id) {
        productVariantService.deleteVariant(id);
        return ResponseEntity.noContent().build();
    }
}
