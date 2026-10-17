package com.mintech.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mintech.ecommerce.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
