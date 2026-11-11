package com.mintech.ecommerce.service.impl;

import com.mintech.ecommerce.exception.ResourceNotFoundException;
import com.mintech.ecommerce.dto.request.OrderItemRequest;
import com.mintech.ecommerce.dto.request.OrderRequest;
import com.mintech.ecommerce.dto.request.OrderStatusUpdateRequest;
import com.mintech.ecommerce.dto.response.OrderResponse;
import com.mintech.ecommerce.entity.Cart;
import com.mintech.ecommerce.entity.CartItem;
import com.mintech.ecommerce.entity.Coupon;
import com.mintech.ecommerce.entity.Order;
import com.mintech.ecommerce.entity.OrderItem;
import com.mintech.ecommerce.entity.ProductVariant;
import com.mintech.ecommerce.entity.Role;
import com.mintech.ecommerce.entity.User;
import com.mintech.ecommerce.repository.CartItemRepository;
import com.mintech.ecommerce.repository.CartRepository;
import com.mintech.ecommerce.repository.CouponRepository;
import com.mintech.ecommerce.repository.OrderItemRepository;
import com.mintech.ecommerce.repository.OrderRepository;
import com.mintech.ecommerce.repository.ProductVariantRepository;
import com.mintech.ecommerce.repository.UserRepository;
import com.mintech.ecommerce.service.OrderService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CouponRepository couponRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại với email: " + email));
    }

    private String generateOrderCode() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    @Override
    @Transactional
    public OrderResponse createOrder(String email, OrderRequest request) {
        User user = getUserByEmail(email);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        boolean isFromCart = (request.getItems() == null || request.getItems().isEmpty());

        if (isFromCart) {
            Cart cart = cartRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Giỏ hàng của bạn đang trống"));

            if (cart.getCartItems().isEmpty()) {
                throw new IllegalArgumentException("Giỏ hàng của bạn đang trống");
            }

            for (CartItem cartItem : new ArrayList<>(cart.getCartItems())) {
                ProductVariant variant = cartItem.getProductVariant();
                int qty = cartItem.getQuantity();

                if (variant.getStockQuantity() < qty) {
                    throw new IllegalArgumentException(
                            "Sản phẩm '" + variant.getProduct().getName() + " (" + variant.getColor() + ")' không đủ số lượng tồn kho (còn: " + variant.getStockQuantity() + ")");
                }

                variant.setStockQuantity(variant.getStockQuantity() - qty);
                productVariantRepository.save(variant);

                BigDecimal itemSubtotal = variant.getPrice().multiply(BigDecimal.valueOf(qty));
                subtotal = subtotal.add(itemSubtotal);

                OrderItem orderItem = OrderItem.builder()
                        .productVariant(variant)
                        .productName(variant.getProduct().getName())
                        .sku(variant.getSku())
                        .unitPrice(variant.getPrice())
                        .quantity(qty)
                        .subtotal(itemSubtotal)
                        .build();

                orderItems.add(orderItem);
            }

            cart.getCartItems().clear();
            cartRepository.save(cart);

        } else {
            for (OrderItemRequest itemReq : request.getItems()) {
                ProductVariant variant = productVariantRepository.findById(itemReq.getProductVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Biến thể sản phẩm không tồn tại với ID: " + itemReq.getProductVariantId()));

                int qty = itemReq.getQuantity();
                if (variant.getStockQuantity() < qty) {
                    throw new IllegalArgumentException(
                            "Sản phẩm '" + variant.getProduct().getName() + " (" + variant.getColor() + ")' không đủ số lượng tồn kho (còn: " + variant.getStockQuantity() + ")");
                }

                variant.setStockQuantity(variant.getStockQuantity() - qty);
                productVariantRepository.save(variant);

                BigDecimal itemSubtotal = variant.getPrice().multiply(BigDecimal.valueOf(qty));
                subtotal = subtotal.add(itemSubtotal);

                OrderItem orderItem = OrderItem.builder()
                        .productVariant(variant)
                        .productName(variant.getProduct().getName())
                        .sku(variant.getSku())
                        .unitPrice(variant.getPrice())
                        .quantity(qty)
                        .subtotal(itemSubtotal)
                        .build();

                orderItems.add(orderItem);

                Optional<Cart> optionalCart = cartRepository.findByUserId(user.getId());
                if (optionalCart.isPresent()) {
                    Cart cart = optionalCart.get();
                    cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                            .ifPresent(ci -> {
                                cart.getCartItems().remove(ci);
                                cartItemRepository.delete(ci);
                            });
                }
            }
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            discountAmount = applyCoupon(request.getCouponCode().trim(), subtotal);
        }

        BigDecimal shippingFee = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(shippingFee);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        Order order = Order.builder()
                .orderCode(generateOrderCode())
                .user(user)
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .shippingAddress(request.getShippingAddress())
                .note(request.getNote())
                .subtotal(subtotal)
                .discountAmount(discountAmount)
                .shippingFee(shippingFee)
                .totalAmount(totalAmount)
                .orderStatus("PENDING")
                .paymentStatus("UNPAID")
                .build();

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
        }
        orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(orderItems);

        return mapToResponse(savedOrder);
    }

    private BigDecimal applyCoupon(String couponCode, BigDecimal subtotal) {
        Optional<Coupon> optionalCoupon = couponRepository.findByCode(couponCode);
        if (optionalCoupon.isEmpty()) {
            throw new ResourceNotFoundException("Mã giảm giá không tồn tại");
        }

        Coupon coupon = optionalCoupon.get();
        LocalDateTime now = LocalDateTime.now();

        if (coupon.getStatus() != Coupon.CouponStatus.ACTIVE) {
            throw new IllegalArgumentException("Mã giảm giá hiện không còn hiệu lực");
        }
        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            throw new IllegalArgumentException("Mã giảm giá chưa đến ngày áp dụng");
        }
        if (coupon.getEndDate() != null && now.isAfter(coupon.getEndDate())) {
            throw new IllegalArgumentException("Mã giảm giá đã hết hạn");
        }
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new IllegalArgumentException("Mã giảm giá đã đạt giới hạn lượt sử dụng");
        }
        if (coupon.getMinOrderAmount() != null && subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new IllegalArgumentException("Đơn hàng phải tối thiểu " + coupon.getMinOrderAmount() + " để áp dụng mã này");
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else if (coupon.getDiscountType() == Coupon.DiscountType.FIXED_AMOUNT) {
            discount = coupon.getDiscountValue();
        }

        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);

        return discount;
    }

    @Override
    public List<OrderResponse> getMyOrders(String email) {
        User user = getUserByEmail(email);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(String email, UUID id) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại"));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new SecurityException("Bạn không có quyền xem đơn hàng này");
        }

        return mapToResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(String email, UUID id) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại"));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new SecurityException("Bạn không có quyền thao tác trên đơn hàng này");
        }

        if (!"PENDING".equalsIgnoreCase(order.getOrderStatus()) && !"CONFIRMED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new IllegalStateException("Đơn hàng chỉ có thể hủy khi đang ở trạng thái PENDING hoặc CONFIRMED");
        }

        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getProductVariant();
            if (variant != null) {
                variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                productVariantRepository.save(variant);
            }
        }

        order.setOrderStatus("CANCELLED");
        return mapToResponse(orderRepository.save(order));
    }

    @Override
    public List<OrderResponse> getAllOrders(String status) {
        List<Order> orders;
        if (status != null && !status.isBlank()) {
            orders = orderRepository.findByOrderStatusOrderByCreatedAtDesc(status.toUpperCase());
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }
        return orders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(UUID id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại"));

        if (request.getOrderStatus() != null) {
            String newStatus = request.getOrderStatus().toUpperCase();
            if ("CANCELLED".equals(newStatus) && !"CANCELLED".equals(order.getOrderStatus())) {
                for (OrderItem item : order.getOrderItems()) {
                    ProductVariant variant = item.getProductVariant();
                    if (variant != null) {
                        variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                        productVariantRepository.save(variant);
                    }
                }
            }
            order.setOrderStatus(newStatus);
        }

        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus().toUpperCase());
        }

        return mapToResponse(orderRepository.save(order));
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderResponse.OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .productVariantId(item.getProductVariant() != null ? item.getProductVariant().getId() : null)
                        .productName(item.getProductName())
                        .color(item.getProductVariant() != null ? item.getProductVariant().getColor() : null)
                        .sku(item.getSku())
                        .unitPrice(item.getUnitPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .shippingAddress(order.getShippingAddress())
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .build();
    }
}

