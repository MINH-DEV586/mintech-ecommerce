package com.mintech.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class CategoryRequest {
    @NotBlank(message = "Danh mục không được để trống")
    private String name;

    @NotBlank(message = "Slug không được để trống")
    private String slug;

    private String description;

    private MultipartFile image;

    private String status;
}
