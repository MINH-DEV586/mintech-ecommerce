package com.mintech.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mintech.ecommerce.entity.ProductVariant;

import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);
}
