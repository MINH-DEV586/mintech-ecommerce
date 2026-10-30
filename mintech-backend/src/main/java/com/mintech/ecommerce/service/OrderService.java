package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.OrderRequest;
import com.mintech.ecommerce.dto.request.OrderStatusUpdateRequest;
import com.mintech.ecommerce.dto.response.OrderResponse;

import java.util.List;
import java.util.UUID;

public interface OrderService {

    OrderResponse createOrder(String email, OrderRequest request);

    List<OrderResponse> getMyOrders(String email);

    OrderResponse getOrderById(String email, UUID id);

    OrderResponse cancelOrder(String email, UUID id);

    List<OrderResponse> getAllOrders(String status);

    OrderResponse updateOrderStatus(UUID id, OrderStatusUpdateRequest request);
}

