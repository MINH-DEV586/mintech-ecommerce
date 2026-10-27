package com.mintech.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {

    @NotBlank(message = "Ten nguoi nhan khong duoc de trong")
    @Size(max = 100, message = "Ten nguoi nhan khong duoc vuot qua 100 ky tu")
    private String recipientName;

    @NotBlank(message = "So dien thoai khong duoc de trong")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "So dien thoai khong hop le")
    private String phone;

    @NotBlank(message = "Tinh/Thanh pho khong duoc de trong")
    @Size(max = 100, message = "Tinh/Thanh pho khong duoc vuot qua 100 ky tu")
    private String province;

    @NotBlank(message = "Quan/Huyen khong duoc de trong")
    @Size(max = 100, message = "Quan/Huyen khong duoc vuot qua 100 ky tu")
    private String district;

    @NotBlank(message = "Phuong/Xa khong duoc de trong")
    @Size(max = 100, message = "Phuong/Xa khong duoc vuot qua 100 ky tu")
    private String ward;

    @NotBlank(message = "Dia chi chi tiet khong duoc de trong")
    @Size(max = 255, message = "Dia chi chi tiet khong duoc vuot qua 255 ky tu")
    private String detailAddress;

    private boolean isDefault = false;
}
