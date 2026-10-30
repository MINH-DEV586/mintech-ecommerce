package com.mintech.ecommerce.service;

import com.mintech.ecommerce.dto.request.CartRequest;
import com.mintech.ecommerce.dto.response.CartResponse;

public interface CartService {

    CartResponse getMyCart(String email);

    CartResponse addToCart(String email, CartRequest request);

    CartResponse updateCartItem(String email, Long cartItemId, CartRequest request);

    CartResponse removeCartItem(String email, Long cartItemId);

    void clearCart(String email);
}

