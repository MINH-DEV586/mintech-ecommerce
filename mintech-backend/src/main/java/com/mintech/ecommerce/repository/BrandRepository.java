package com.mintech.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mintech.ecommerce.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
}
