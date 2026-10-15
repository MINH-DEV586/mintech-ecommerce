package com.mintech.ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_code", nullable = false, length = 50)
    private String orderCode;

    @Column(name = "user_id", nullable = false, length = 20)
    private Long userId;
    @Column(name = "recipient_name", nullable = false, length = 100)
    private String recipientName;
    @Column(name = "recipient_phone", nullable = false, length = 20)
    private String recipientPhone;
    @Column(name = "shipping_address", nullable = false, length = 255)
    private String shippingAddress;
    @Column(name = "subtotal", nullable = false)
    private Double subtotal;
    @Column(name = "discount_amount", nullable = false)
    private Double discountAmount;
    @Column(name = "shipping_fee", nullable = false)
    private Double shippingFee;
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;
    @Column(name = "order_status", nullable = false, length = 20)
    private String orderStatus;
    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus;
    @Column(name = "note", length = 20)
    private String note;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

}
