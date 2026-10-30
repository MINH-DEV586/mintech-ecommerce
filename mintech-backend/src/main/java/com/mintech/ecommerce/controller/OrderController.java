package com.mintech.ecommerce.controller;

import com.mintech.ecommerce.dto.request.OrderRequest;
import com.mintech.ecommerce.dto.request.OrderStatusUpdateRequest;
import com.mintech.ecommerce.dto.response.OrderResponse;
import com.mintech.ecommerce.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Đặt hàng (checkout từ giỏ hàng hoặc danh sách items cụ thể)
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            Authentication authentication,
            @Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Xem lịch sử đơn hàng của người dùng hiện tại
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        List<OrderResponse> response = orderService.getMyOrders(authentication.getName());
        return ResponseEntity.ok(response);
    }

    // Xem chi tiết đơn hàng theo ID (chính chủ hoặc ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            Authentication authentication,
            @PathVariable UUID id) {
        OrderResponse response = orderService.getOrderById(authentication.getName(), id);
        return ResponseEntity.ok(response);
    }

    // Hủy đơn hàng (khi đơn đang ở trạng thái PENDING hoặc CONFIRMED)
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            Authentication authentication,
            @PathVariable UUID id) {
        OrderResponse response = orderService.cancelOrder(authentication.getName(), id);
        return ResponseEntity.ok(response);
    }

    // ADMIN: Xem tất cả các đơn hàng trong hệ thống (có thể lọc theo ?status=PENDING, etc.)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(
            @RequestParam(required = false) String status) {
        List<OrderResponse> response = orderService.getAllOrders(status);
        return ResponseEntity.ok(response);
    }

    // ADMIN: Cập nhật trạng thái đơn hàng và thanh toán
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(response);
    }
}

