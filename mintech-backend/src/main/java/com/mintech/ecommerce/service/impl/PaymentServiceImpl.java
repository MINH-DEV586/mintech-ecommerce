package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.dto.request.PaymentRequest;
import com.mintech.ecommerce.dto.response.PaymentResponse;
import com.mintech.ecommerce.entity.Order;
import com.mintech.ecommerce.entity.PayMent;
import com.mintech.ecommerce.repository.OrderRepository;
import com.mintech.ecommerce.repository.PaymentRepository;
import com.mintech.ecommerce.service.PaymentService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Đơn hàng không tồn tại với ID: " + request.getOrderId()));

        String method = request.getPaymentMethod().toUpperCase();
        String paymentStatus;

        // Nếu phương thức là COD -> Trạng thái UNPAID (chờ giao hàng trả tiền)
        // Nếu chuyển khoản hoặc cổng thanh toán giả lập -> SUCCESS
        if ("COD".equalsIgnoreCase(method)) {
            paymentStatus = "PENDING";
            order.setPaymentStatus("UNPAID");
        } else {
            paymentStatus = "SUCCESS";
            order.setPaymentStatus("PAID");
        }
        orderRepository.save(order);

        String txnId = request.getTransactionId();
        if (txnId == null || txnId.isBlank()) {
            txnId = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        PayMent payment = new PayMent();
        payment.setOrder(order);
        payment.setPaymentMethod(method);
        payment.setAmount(request.getAmount());
        payment.setStatus(paymentStatus);
        payment.setTransactionId(txnId);
        payment.setPaymentDate(LocalDateTime.now());

        return mapToResponse(paymentRepository.save(payment));
    }

    @Override
    public List<PaymentResponse> getPaymentsByOrderId(UUID orderId) {
        return paymentRepository.findByOrderId(orderId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponse getPaymentById(UUID id) {
        PayMent payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Giao dịch thanh toán không tồn tại với ID: " + id));
        return mapToResponse(payment);
    }

    private PaymentResponse mapToResponse(PayMent payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder() != null ? payment.getOrder().getId() : null)
                .orderCode(payment.getOrder() != null ? payment.getOrder().getOrderCode() : null)
                .paymentMethod(payment.getPaymentMethod())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}

