package com.mintech.ecommerce.entity;

import java.lang.annotation.Inherited;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "addresses")
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 255)
    private String addressLine1;

    @Column(name = "recipient_name", length = 255)
    private String addressLine2;

    @Column(name="phone", length = 10)
    private String city;

    @Column(name="province", length = 100)
    private String state;

    @Column(name = "district",length = 100)
    private String postalCode;

    @Column(name="ward",length=100)
    private String country;

    @Column(name = "detail_addresses", length = 255)
    private String detailAddresses;

    @Column(name ="is_default", nullable = false)
    private boolean isDefault;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    


}
