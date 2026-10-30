package com.mintech.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mintech.ecommerce.entity.ProductSpecification;

import java.util.List;
import java.util.UUID;

public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, UUID> {
    List<ProductSpecification> findByProductId(UUID productId);
}
