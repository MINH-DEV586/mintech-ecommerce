package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.ShipmentRequest;
import com.mintech.ecommerce.dto.response.ShipmentResponse;
import com.mintech.ecommerce.dto.response.ShipmentTrackingResponse;

import java.util.List;
import java.util.UUID;

public interface ShipmentService {
    ShipmentResponse createShipment(ShipmentRequest request);
    List<ShipmentResponse> getShipmentsByOrderId(UUID orderId, String email, boolean admin);
    ShipmentTrackingResponse getShipmentByTrackingNumber(String trackingNumber);
    ShipmentResponse updateShipmentStatus(UUID id, String status);
}

