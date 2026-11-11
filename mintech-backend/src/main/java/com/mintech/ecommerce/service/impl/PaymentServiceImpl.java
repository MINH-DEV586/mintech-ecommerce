package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.exception.ResourceNotFoundException;
import com.mintech.ecommerce.dto.request.PaymentRequest;
import com.mintech.ecommerce.dto.response.PaymentResponse;
import com.mintech.ecommerce.entity.Order;
import com.mintech.ecommerce.entity.PayMent;
import com.mintech.ecommerce.repository.OrderRepository;
import com.mintech.ecommerce.repository.PaymentRepository;
import com.mintech.ecommerce.service.PaymentService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public PaymentResponse processPayment(String email, PaymentRequest request) {
        Order order = orderRepository.findByIdAndUserEmail(request.getOrderId(), email)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại"));

        if ("PAID".equals(order.getPaymentStatus()) || "CANCELLED".equals(order.getOrderStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Đơn hàng không thể thanh toán");
        }

        String method = request.getPaymentMethod().trim().toUpperCase(Locale.ROOT);
        if (!Set.of("COD", "VNPAY", "MOMO", "BANK_TRANSFER").contains(method)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phương thức thanh toán không hợp lệ");
        }
        if (order.getTotalAmount().compareTo(request.getAmount()) != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số tiền không khớp với đơn hàng");
        }

        Optional<PayMent> pending = paymentRepository
                .findFirstByOrderIdAndPaymentMethodAndStatusOrderByPaymentDateDesc(order.getId(), method, "PENDING");
        if (pending.isPresent() && pending.get().getAmount().compareTo(order.getTotalAmount()) == 0) {
            return mapToResponse(pending.get());
        }

        PayMent payment = new PayMent();
        payment.setOrder(order);
        payment.setPaymentMethod(method);
        payment.setAmount(order.getTotalAmount());
        payment.setStatus("PENDING");
        payment.setTransactionId("TXN-" + UUID.randomUUID());
        payment.setPaymentDate(LocalDateTime.now());

        return mapToResponse(paymentRepository.save(payment));
    }

    @Override
    @Transactional
    public List<PaymentResponse> getPaymentsByOrderId(String email, UUID orderId) {
        if (!orderRepository.existsByIdAndUserEmail(orderId, email)) {
            throw new ResourceNotFoundException("Đơn hàng không tồn tại");
        }
        return paymentRepository.findByOrderId(orderId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentResponse getPaymentById(String email, UUID id) {
        PayMent payment = paymentRepository.findByIdAndOrderUserEmail(id, email)
                .orElseThrow(() -> new ResourceNotFoundException("Giao dịch thanh toán không tồn tại"));
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

