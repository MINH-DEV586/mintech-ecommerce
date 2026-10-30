package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.BrandRequest;
import com.mintech.ecommerce.dto.response.BrandResponse;

import java.util.List;
import java.util.UUID;

public interface BrandService {
    BrandResponse createBrand(BrandRequest request);
    List<BrandResponse> getAllBrands();
    BrandResponse getBrandById(UUID id);
    BrandResponse updateBrand(UUID id, BrandRequest request);
    void deleteBrand(UUID id);
}

