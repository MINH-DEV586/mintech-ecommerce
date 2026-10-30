package com.mintech.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ProductSpecificationResponse {
    private UUID id;
    private String specName;
    private String specValue;
}
