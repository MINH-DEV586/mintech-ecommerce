package com.mintech.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mintech.ecommerce.entity.Category;

import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
}
