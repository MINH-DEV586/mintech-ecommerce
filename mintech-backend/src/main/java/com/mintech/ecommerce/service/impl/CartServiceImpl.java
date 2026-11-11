package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.exception.ResourceNotFoundException;
import com.mintech.ecommerce.dto.request.CartRequest;
import com.mintech.ecommerce.dto.response.CartResponse;
import com.mintech.ecommerce.entity.Cart;
import com.mintech.ecommerce.entity.CartItem;
import com.mintech.ecommerce.entity.ProductVariant;
import com.mintech.ecommerce.entity.User;
import com.mintech.ecommerce.repository.CartItemRepository;
import com.mintech.ecommerce.repository.CartRepository;
import com.mintech.ecommerce.repository.ProductVariantRepository;
import com.mintech.ecommerce.repository.UserRepository;
import com.mintech.ecommerce.service.CartService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));
    }

    @Override
    public CartResponse getMyCart(String email) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addToCart(String email, CartRequest request) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);

        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Biến thể sản phẩm không tồn tại"));

        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndProductVariantId(cart.getId(), variant.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productVariant(variant)
                    .quantity(request.getQuantity())
                    .build();
            cart.getCartItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return mapToResponse(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(String email, UUID cartItemId, CartRequest request) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không có trong giỏ hàng"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Bạn không có quyền sửa item này");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return mapToResponse(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Override
    @Transactional
    public CartResponse removeCartItem(String email, UUID cartItemId) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không có trong giỏ hàng"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Bạn không có quyền xóa item này");
        }

        cart.getCartItems().remove(item);
        cartItemRepository.delete(item);

        return mapToResponse(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Override
    @Transactional
    public void clearCart(String email) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    private CartResponse mapToResponse(Cart cart) {
        List<CartResponse.CartItemResponse> itemResponses = cart.getCartItems().stream()
                .map(item -> {
                    ProductVariant variant = item.getProductVariant();
                    BigDecimal subtotal = variant.getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                    return CartResponse.CartItemResponse.builder()
                            .cartItemId(item.getId())
                            .productVariantId(variant.getId())
                            .productName(variant.getProduct().getName())
                            .color(variant.getColor())
                            .sku(variant.getSku())
                            .price(variant.getPrice())
                            .quantity(item.getQuantity())
                            .subtotal(subtotal)
                            .build();
                })
                .collect(Collectors.toList());

        BigDecimal totalPrice = itemResponses.stream()
                .map(CartResponse.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .totalPrice(totalPrice)
                .updatedAt(cart.getUpdatedAt())
                .build();
    }
}
