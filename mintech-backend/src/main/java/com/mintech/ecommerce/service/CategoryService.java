package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.CategoryRequest;
import com.mintech.ecommerce.dto.response.CategoryResponse;
import java.util.List;

public interface CategoryService {
    public CategoryResponse createCategory(CategoryRequest request);

    public List<CategoryResponse> getAllCategories();

    public void deleteCategory(Long id);

    public CategoryResponse updateCategory(Long id, CategoryRequest request);

    public CategoryResponse getCategoryById(Long id);
}
