package com.mintech.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    @NotBlank(message = "Mat khau moi khong duoc de trong")
    @Size(min = 8, max = 100, message = "Mat khau phai tu 8 den 100 ky tu")
    private String password;
}
