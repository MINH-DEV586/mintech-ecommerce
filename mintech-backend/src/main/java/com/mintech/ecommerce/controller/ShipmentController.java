package com.mintech.ecommerce.controller;

import com.mintech.ecommerce.dto.request.ShipmentRequest;
import com.mintech.ecommerce.dto.response.ShipmentResponse;
import com.mintech.ecommerce.service.ShipmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    // Tra cứu vận đơn qua mã tracking (Public/User)
    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<ShipmentResponse> getShipmentByTrackingNumber(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(shipmentService.getShipmentByTrackingNumber(trackingNumber));
    }

    // Xem thông tin vận chuyển của một đơn hàng
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<ShipmentResponse>> getShipmentsByOrderId(@PathVariable UUID orderId) {
        return ResponseEntity.ok(shipmentService.getShipmentsByOrderId(orderId));
    }

    // ADMIN: Tạo vận đơn mới cho đơn hàng
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ShipmentResponse> createShipment(@Valid @RequestBody ShipmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shipmentService.createShipment(request));
    }

    // ADMIN: Cập nhật trạng thái vận đơn (PREPARING, PICKED_UP, SHIPPING, DELIVERED, RETURNED)
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ShipmentResponse> updateShipmentStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, status));
    }
}

