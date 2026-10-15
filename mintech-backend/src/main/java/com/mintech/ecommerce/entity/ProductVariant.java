package com.mintech.ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku", unique = true, nullable = false, length = 50)
    private String sku;
    @Column(name = "color", nullable = false, length = 50)
    private String color;

    @Column(name = "price", nullable = false)
    private BigDecimal price;
    @Column(name = "original_price", nullable = false)
    private BigDecimal originalPrice;
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;
    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

}
