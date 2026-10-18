package com.mintech.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mintech.ecommerce.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}
