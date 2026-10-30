package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.CartRequest;
import com.mintech.ecommerce.dto.response.CartResponse;

import java.util.UUID;

public interface CartService {

    CartResponse getMyCart(String email);

    CartResponse addToCart(String email, CartRequest request);

    CartResponse updateCartItem(String email, UUID cartItemId, CartRequest request);

    CartResponse removeCartItem(String email, UUID cartItemId);

    void clearCart(String email);
}
