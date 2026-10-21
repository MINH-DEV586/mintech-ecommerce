package com.mintech.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductSpecificationRequest {

    @NotBlank(message = "Tên thông số không được để trống")
    @Size(max = 100, message = "Tên thông số không được vượt quá 100 ký tự")
    private String specName;

    @NotBlank(message = "Giá trị thông số không được để trống")
    @Size(max = 255, message = "Giá trị thông số không được vượt quá 255 ký tự")
    private String specValue;
}
