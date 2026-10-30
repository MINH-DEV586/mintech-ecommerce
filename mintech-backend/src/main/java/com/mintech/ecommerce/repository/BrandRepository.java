package com.mintech.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mintech.ecommerce.entity.Brand;

import java.util.UUID;

public interface BrandRepository extends JpaRepository<Brand, UUID> {
}
