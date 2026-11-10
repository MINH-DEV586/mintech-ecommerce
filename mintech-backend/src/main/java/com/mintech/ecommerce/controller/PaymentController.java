package com.mintech.ecommerce.controller;

import com.mintech.ecommerce.dto.request.PaymentRequest;
import com.mintech.ecommerce.dto.response.PaymentResponse;
import com.mintech.ecommerce.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(Authentication authentication, @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.processPayment(authentication.getName(), request));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByOrderId(Authentication authentication, @PathVariable UUID orderId) {
        return ResponseEntity.ok(paymentService.getPaymentsByOrderId(authentication.getName(), orderId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(paymentService.getPaymentById(authentication.getName(), id));
    }
}

