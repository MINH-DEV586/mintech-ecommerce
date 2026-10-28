package com.mintech.ecommerce.service.impl;

import org.springframework.stereotype.Service;

import com.mintech.ecommerce.repository.CategoryRepository;
import com.mintech.ecommerce.service.CategoryService;
import com.mintech.ecommerce.dto.response.CategoryResponse;
import com.mintech.ecommerce.dto.request.CategoryRequest;
import com.mintech.ecommerce.entity.Category;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        category.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .status(category.getStatus())
                .build();
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        category.setStatus(request.getStatus() != null ? request.getStatus() : category.getStatus());
        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
        return mapToResponse(category);
    }
}
