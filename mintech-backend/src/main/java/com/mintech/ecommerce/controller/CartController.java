package com.mintech.ecommerce.controller;

import com.mintech.ecommerce.dto.request.CartRequest;
import com.mintech.ecommerce.dto.response.CartResponse;
import com.mintech.ecommerce.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // Xem giỏ hàng của mình
    @GetMapping
    public ResponseEntity<CartResponse> getMyCart(Authentication authentication) {
        CartResponse response = cartService.getMyCart(authentication.getName());
        return ResponseEntity.ok(response);
    }

    // Thêm sản phẩm vào giỏ
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody CartRequest request) {
        CartResponse response = cartService.addToCart(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    // Cập nhật số lượng item trong giỏ
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @Valid @RequestBody CartRequest request) {
        CartResponse response = cartService.updateCartItem(authentication.getName(), cartItemId, request);
        return ResponseEntity.ok(response);
    }

    // Xóa 1 item khỏi giỏ
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            Authentication authentication,
            @PathVariable Long cartItemId) {
        CartResponse response = cartService.removeCartItem(authentication.getName(), cartItemId);
        return ResponseEntity.ok(response);
    }

    // Xóa toàn bộ giỏ hàng
    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}

