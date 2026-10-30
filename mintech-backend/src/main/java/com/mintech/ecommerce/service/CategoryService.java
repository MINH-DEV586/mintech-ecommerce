package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.CategoryRequest;
import com.mintech.ecommerce.dto.response.CategoryResponse;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    List<CategoryResponse> getAllCategories();
    void deleteCategory(UUID id);
    CategoryResponse updateCategory(UUID id, CategoryRequest request);
    CategoryResponse getCategoryById(UUID id);
}
