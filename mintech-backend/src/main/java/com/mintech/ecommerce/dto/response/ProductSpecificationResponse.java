package com.mintech.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductSpecificationResponse {
    private Long id;
    private String specName;
    private String specValue;
}
