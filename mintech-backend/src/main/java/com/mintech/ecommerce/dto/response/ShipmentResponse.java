package com.mintech.ecommerce.dto.response;

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
public class ShipmentResponse {
    private UUID id;
    private UUID orderId;
    private String orderCode;
    private String recipientName;
    private String shippingAddress;
    private String carrier;
    private String trackingNumber;
    private String status;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveryDate;
}

