package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.PaymentRequest;
import com.mintech.ecommerce.dto.response.PaymentResponse;

import java.util.List;
import java.util.UUID;

public interface PaymentService {
    PaymentResponse processPayment(String email, PaymentRequest request);
    List<PaymentResponse> getPaymentsByOrderId(String email, UUID orderId);
    PaymentResponse getPaymentById(String email, UUID id);
}

