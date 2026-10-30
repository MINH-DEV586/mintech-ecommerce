package com.mintech.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mintech.ecommerce.entity.Order;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
}
