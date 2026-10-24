package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.dto.request.ProductImageRequest;
import com.mintech.ecommerce.dto.request.ProductRequest;
import com.mintech.ecommerce.dto.request.ProductSpecificationRequest;
import com.mintech.ecommerce.dto.request.ProductVariantRequest;
import com.mintech.ecommerce.dto.response.ProductImageResponse;
import com.mintech.ecommerce.dto.response.ProductResponse;
import com.mintech.ecommerce.dto.response.ProductSpecificationResponse;
import com.mintech.ecommerce.dto.response.ProductVariantResponse;
import com.mintech.ecommerce.entity.Brand;
import com.mintech.ecommerce.entity.Category;
import com.mintech.ecommerce.entity.Product;
import com.mintech.ecommerce.entity.ProductImage;
import com.mintech.ecommerce.entity.ProductSpecification;
import com.mintech.ecommerce.entity.ProductVariant;
import com.mintech.ecommerce.repository.BrandRepository;
import com.mintech.ecommerce.repository.CategoryRepository;
import com.mintech.ecommerce.repository.ProductImageRepository;
import com.mintech.ecommerce.repository.ProductRepository;
import com.mintech.ecommerce.repository.ProductSpecificationRepository;
import com.mintech.ecommerce.repository.ProductVariantRepository;
import com.mintech.ecommerce.service.ProductService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductSpecificationRepository productSpecificationRepository;

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Danh mục không tồn tại với ID: " + request.getCategoryId()));

        Brand brand = null;
        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Thương hiệu không tồn tại với ID: " + request.getBrandId()));
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        product.setThumbnailUrl(request.getThumbnailUrl());
        product.setCategory(category);
        product.setBrand(brand);

        Product savedProduct = productRepository.save(product);

        // Lưu danh sách biến thể (ProductVariant)
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            List<ProductVariant> variants = request.getVariants().stream().map(vReq -> {
                ProductVariant variant = new ProductVariant();
                variant.setSku(vReq.getSku());
                variant.setColor(vReq.getColor());
                variant.setPrice(vReq.getPrice());
                variant.setOriginalPrice(vReq.getOriginalPrice());
                variant.setStockQuantity(vReq.getStockQuantity());
                variant.setStatus(vReq.getStatus() != null ? vReq.getStatus() : "ACTIVE");
                variant.setProduct(savedProduct);
                return variant;
            }).collect(Collectors.toList());
            productVariantRepository.saveAll(variants);
        }

        // Lưu danh sách hình ảnh phụ (ProductImage)
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<ProductImage> images = request.getImages().stream().map(imgReq -> {
                ProductImage image = new ProductImage();
                image.setImageUrl(imgReq.getImageUrl());
                image.setSortDisplay(imgReq.getSortDisplay());
                image.setProduct(savedProduct);
                return image;
            }).collect(Collectors.toList());
            productImageRepository.saveAll(images);
        }

        if (request.getSpecifications() != null && !request.getSpecifications().isEmpty()) {
            List<ProductSpecification> specs = request.getSpecifications().stream().map(sReq -> {
                ProductSpecification spec = new ProductSpecification();
                spec.setSpecName(sReq.getSpecName());
                spec.setSpecValue(sReq.getSpecValue());
                spec.setProduct(savedProduct);
                return spec;
            }).collect(Collectors.toList());
            productSpecificationRepository.saveAll(specs);
        }

        return mapToResponse(savedProduct);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sản phẩm không tồn tại với ID: " + id));
        return mapToResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sản phẩm không tồn tại với ID: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Danh mục không tồn tại với ID: " + request.getCategoryId()));

        Brand brand = null;
        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Thương hiệu không tồn tại với ID: " + request.getBrandId()));
        }

        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setStatus(request.getStatus() != null ? request.getStatus() : product.getStatus());
        product.setThumbnailUrl(request.getThumbnailUrl());
        product.setCategory(category);
        product.setBrand(brand);

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Sản phẩm không tồn tại với ID: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse mapToResponse(Product product) {
        List<ProductVariantResponse> variants = productVariantRepository
                .findByProductId(product.getId())
                .stream()
                .map(v -> ProductVariantResponse.builder()
                        .id(v.getId())
                        .sku(v.getSku())
                        .color(v.getColor())
                        .price(v.getPrice())
                        .originalPrice(v.getOriginalPrice())
                        .stockQuantity(v.getStockQuantity())
                        .status(v.getStatus())
                        .build())
                .collect(Collectors.toList());

        List<ProductImageResponse> images = productImageRepository
                .findByProductId(product.getId())
                .stream()
                .map(img -> ProductImageResponse.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .sortDisplay(img.getSortDisplay())
                        .build())
                .collect(Collectors.toList());

        List<ProductSpecificationResponse> specs = productSpecificationRepository
                .findByProductId(product.getId())
                .stream()
                .map(s -> ProductSpecificationResponse.builder()
                        .id(s.getId())
                        .specName(s.getSpecName())
                        .specValue(s.getSpecValue())
                        .build())
                .collect(Collectors.toList());

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .status(product.getStatus())
                .thumbnailUrl(product.getThumbnailUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .variants(variants)
                .images(images)
                .specifications(specs)
                .build();
    }
}
