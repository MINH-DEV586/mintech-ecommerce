package com.mintech.ecommerce.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductImageRequest {

    @NotBlank(message = "URL ảnh không được để trống")
    @Size(max = 255, message = "URL ảnh không được vượt quá 255 ký tự")
    private String imageUrl;

    @NotNull(message = "Thứ tự hiển thị không được để trống")
    @Min(value = 0, message = "Thứ tự hiển thị không được âm")
    private Integer sortDisplay;
}
