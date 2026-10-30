package com.mintech.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrandRequest {

    @NotBlank(message = "Tên thương hiệu không được để trống")
    @Size(max = 100, message = "Tên thương hiệu không được vượt quá 100 ký tự")
    private String name;

    @Size(max = 150, message = "Slug không được vượt quá 150 ký tự")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
            message = "Slug chỉ được chứa chữ thường, số và dấu gạch ngang")
    private String slug;

    @Size(max = 255, message = "URL logo không được vượt quá 255 ký tự")
    private String logoUrl;

    @Pattern(regexp = "^(ACTIVE|INACTIVE)$", message = "Trạng thái phải là ACTIVE hoặc INACTIVE")
    private String status;
}

