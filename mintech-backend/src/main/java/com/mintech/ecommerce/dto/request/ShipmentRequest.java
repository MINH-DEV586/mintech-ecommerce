package com.mintech.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentRequest {

    @NotNull(message = "ID đơn hàng không được để trống")
    private UUID orderId;

    @NotBlank(message = "Đơn vị vận chuyển không được để trống")
    private String carrier;

    private String trackingNumber;

    private String status;

    private LocalDateTime deliveryDate;
}

