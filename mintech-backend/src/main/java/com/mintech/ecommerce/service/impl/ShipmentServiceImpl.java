package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.exception.ResourceNotFoundException;
import com.mintech.ecommerce.dto.request.ShipmentRequest;
import com.mintech.ecommerce.dto.response.ShipmentResponse;
import com.mintech.ecommerce.dto.response.ShipmentTrackingResponse;
import com.mintech.ecommerce.entity.Order;
import com.mintech.ecommerce.entity.ShipMent;
import com.mintech.ecommerce.repository.OrderRepository;
import com.mintech.ecommerce.repository.ShipmentRepository;
import com.mintech.ecommerce.service.ShipmentService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public ShipmentResponse createShipment(ShipmentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại với ID: " + request.getOrderId()));

        String tracking = request.getTrackingNumber();
        if (tracking == null || tracking.isBlank()) {
            tracking = UUID.randomUUID().toString();
        }

        ShipMent shipment = ShipMent.builder()
                .order(order)
                .carrier(request.getCarrier())
                .trackingNumber(tracking)
                .status(request.getStatus() != null ? request.getStatus() : "PREPARING")
                .shippedAt(LocalDateTime.now())
                .deliveryDate(request.getDeliveryDate())
                .build();

        order.setOrderStatus("SHIPPING");
        orderRepository.save(order);

        return mapToResponse(shipmentRepository.save(shipment));
    }

    @Override
    @Transactional
    public List<ShipmentResponse> getShipmentsByOrderId(UUID orderId, String email, boolean admin) {
        boolean allowed = admin ? orderRepository.existsById(orderId) : orderRepository.existsByIdAndUserEmail(orderId, email);
        if (!allowed) {
            throw new ResourceNotFoundException("Đơn hàng không tồn tại");
        }
        return shipmentRepository.findByOrderId(orderId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ShipmentTrackingResponse getShipmentByTrackingNumber(String trackingNumber) {
        ShipMent shipment = shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vận đơn không tồn tại"));
        return new ShipmentTrackingResponse(shipment.getCarrier(), shipment.getStatus());
    }

    @Override
    @Transactional
    public ShipmentResponse updateShipmentStatus(UUID id, String status) {
        ShipMent shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vận đơn không tồn tại với ID: " + id));

        shipment.setStatus(status.toUpperCase());
        if ("DELIVERED".equalsIgnoreCase(status)) {
            shipment.setDeliveryDate(LocalDateTime.now());
            Order order = shipment.getOrder();
            if (order != null) {
                order.setOrderStatus("DELIVERED");
                orderRepository.save(order);
            }
        }

        return mapToResponse(shipmentRepository.save(shipment));
    }

    private ShipmentResponse mapToResponse(ShipMent shipment) {
        return ShipmentResponse.builder()
                .id(shipment.getId())
                .orderId(shipment.getOrder() != null ? shipment.getOrder().getId() : null)
                .orderCode(shipment.getOrder() != null ? shipment.getOrder().getOrderCode() : null)
                .recipientName(shipment.getOrder() != null ? shipment.getOrder().getRecipientName() : null)
                .shippingAddress(shipment.getOrder() != null ? shipment.getOrder().getShippingAddress() : null)
                .carrier(shipment.getCarrier())
                .trackingNumber(shipment.getTrackingNumber())
                .status(shipment.getStatus())
                .shippedAt(shipment.getShippedAt())
                .deliveryDate(shipment.getDeliveryDate())
                .build();
    }
}

