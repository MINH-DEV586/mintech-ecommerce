package com.mintech.ecommerce.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 255, message = "Tên sản phẩm không được vượt quá 255 ký tự")
    private String name;

    @Size(max = 100, message = "Slug không được vượt quá 100 ký tự")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
            message = "Slug chỉ được chứa chữ thường, số và dấu gạch ngang")
    private String slug;

    private String description;

    @Pattern(regexp = "^(ACTIVE|INACTIVE)$",
            message = "Trạng thái phải là ACTIVE hoặc INACTIVE")
    private String status = "ACTIVE";

    @Size(max = 255, message = "URL thumbnail không được vượt quá 255 ký tự")
    private String thumbnailUrl;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    private Long brandId;

    @Valid
    private List<ProductVariantRequest> variants;

    private List<ProductImageRequest> images;

    @Valid
    private List<ProductSpecificationRequest> specifications;
}