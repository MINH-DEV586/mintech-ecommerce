package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.dto.request.BrandRequest;
import com.mintech.ecommerce.dto.response.BrandResponse;
import com.mintech.ecommerce.entity.Brand;
import com.mintech.ecommerce.repository.BrandRepository;
import com.mintech.ecommerce.service.BrandService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Override
    @Transactional
    public BrandResponse createBrand(BrandRequest request) {
        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setSlug(request.getSlug());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        return mapToResponse(brandRepository.save(brand));
    }

    @Override
    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BrandResponse getBrandById(UUID id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Thương hiệu không tồn tại với ID: " + id));
        return mapToResponse(brand);
    }

    @Override
    @Transactional
    public BrandResponse updateBrand(UUID id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Thương hiệu không tồn tại với ID: " + id));

        brand.setName(request.getName());
        if (request.getSlug() != null) {
            brand.setSlug(request.getSlug());
        }
        brand.setLogoUrl(request.getLogoUrl());
        if (request.getStatus() != null) {
            brand.setStatus(request.getStatus());
        }

        return mapToResponse(brandRepository.save(brand));
    }

    @Override
    @Transactional
    public void deleteBrand(UUID id) {
        if (!brandRepository.existsById(id)) {
            throw new EntityNotFoundException("Thương hiệu không tồn tại với ID: " + id);
        }
        brandRepository.deleteById(id);
    }

    private BrandResponse mapToResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .slug(brand.getSlug())
                .logoUrl(brand.getLogoUrl())
                .status(brand.getStatus())
                .build();
    }
}

