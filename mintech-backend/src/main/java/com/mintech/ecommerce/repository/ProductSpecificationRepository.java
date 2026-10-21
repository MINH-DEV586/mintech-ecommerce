package com.mintech.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mintech.ecommerce.entity.ProductSpecification;

import java.util.List;

public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Long> {
    List<ProductSpecification> findByProductId(Long productId);
}
